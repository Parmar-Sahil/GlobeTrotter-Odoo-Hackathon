import { prisma } from '../../../config/prisma.config';
import { ActivityCategory } from '../../../types/enums';

export const addSectionToTrip = async (
  tripId: string,
  userId: string,
  data: {
    title: string;
    description?: string;
    sectionOrder?: number;
    startDate?: string;
    endDate?: string;
    allocatedBudget?: number;
  }
) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true, userId: true },
  });

  if (!trip || trip.userId !== userId) {
    throw new Error('Access forbidden or trip not found');
  }

  // Find max sectionOrder if not provided
  let sectionOrder = data.sectionOrder;
  if (!sectionOrder) {
    const lastSection = await prisma.tripSection.findFirst({
      where: { tripId },
      orderBy: { sectionOrder: 'desc' },
      select: { sectionOrder: true },
    });
    sectionOrder = (lastSection?.sectionOrder || 0) + 1;
  }

  return await prisma.tripSection.create({
    data: {
      tripId,
      title: data.title,
      description: data.description || null,
      sectionOrder,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      allocatedBudget: data.allocatedBudget || 0.0,
    },
    select: {
      id: true,
      tripId: true,
      title: true,
      description: true,
      sectionOrder: true,
      startDate: true,
      endDate: true,
      allocatedBudget: true,
    },
  });
};

export const addItemToSection = async (
  sectionId: string,
  userId: string,
  data: {
    activityId?: string;
    title: string;
    category?: ActivityCategory;
    dayNumber?: number;
    itemOrder?: number;
    expense?: number;
    startTime?: string;
    endTime?: string;
    location?: string;
    notes?: string;
  }
) => {
  const section = await prisma.tripSection.findUnique({
    where: { id: sectionId },
    select: {
      id: true,
      trip: {
        select: { id: true, userId: true },
      },
    },
  });

  if (!section || section.trip.userId !== userId) {
    throw new Error('Access forbidden or section not found');
  }

  return await prisma.tripItem.create({
    data: {
      sectionId,
      activityId: data.activityId || null,
      title: data.title,
      category: data.category || ActivityCategory.PHYSICAL_ACTIVITY,
      dayNumber: data.dayNumber || 1,
      itemOrder: data.itemOrder || 1,
      expense: data.expense || 0.0,
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      location: data.location || null,
      notes: data.notes || null,
    },
    select: {
      id: true,
      sectionId: true,
      activityId: true,
      title: true,
      category: true,
      dayNumber: true,
      itemOrder: true,
      expense: true,
      startTime: true,
      endTime: true,
      location: true,
      notes: true,
      activity: {
        select: { id: true, title: true, imageUrl: true, rating: true, estimatedPrice: true },
      },
    },
  });
};

export const getTripItinerary = async (tripId: string) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
      totalBudget: true,
      destination: {
        select: { id: true, name: true, country: true, imageUrl: true },
      },
      sections: {
        select: {
          id: true,
          title: true,
          description: true,
          sectionOrder: true,
          startDate: true,
          endDate: true,
          allocatedBudget: true,
          items: {
            select: {
              id: true,
              title: true,
              category: true,
              dayNumber: true,
              itemOrder: true,
              expense: true,
              startTime: true,
              endTime: true,
              location: true,
              notes: true,
              activity: {
                select: { id: true, title: true, imageUrl: true, rating: true },
              },
            },
            orderBy: [{ dayNumber: 'asc' }, { itemOrder: 'asc' }],
          },
        },
        orderBy: { sectionOrder: 'asc' },
      },
    },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Calculate day-wise itinerary map efficiently in-memory (Rule 2)
  const dayWiseItinerary: Record<number, any[]> = {};
  let totalExpense = 0;

  trip.sections.forEach((section) => {
    section.items.forEach((item) => {
      totalExpense += item.expense;
      if (!dayWiseItinerary[item.dayNumber]) {
        dayWiseItinerary[item.dayNumber] = [];
      }
      dayWiseItinerary[item.dayNumber].push({
        ...item,
        sectionTitle: section.title,
      });
    });
  });

  return {
    tripId: trip.id,
    title: trip.title,
    destination: trip.destination,
    totalBudget: trip.totalBudget,
    totalCalculatedExpense: totalExpense,
    remainingBudget: trip.totalBudget - totalExpense,
    sections: trip.sections,
    dayWiseItinerary,
  };
};

export const getBudgetSummary = async (tripId: string) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
      id: true,
      title: true,
      totalBudget: true,
      sections: {
        select: {
          id: true,
          title: true,
          allocatedBudget: true,
          items: {
            select: {
              id: true,
              category: true,
              expense: true,
            },
          },
        },
      },
    },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  const categoryBreakdown: Record<string, number> = {};
  let totalExpense = 0;

  trip.sections.forEach((sec) => {
    sec.items.forEach((item) => {
      totalExpense += item.expense;
      const cat = item.category || 'OTHER';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + item.expense;
    });
  });

  return {
    tripId: trip.id,
    title: trip.title,
    allocatedTotalBudget: trip.totalBudget,
    totalActualExpense: totalExpense,
    budgetStatus: totalExpense > trip.totalBudget ? 'OVER_BUDGET' : 'WITHIN_BUDGET',
    categoryBreakdown,
  };
};
