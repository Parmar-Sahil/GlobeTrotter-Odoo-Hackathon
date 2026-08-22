import { prisma } from '../../../config/prisma.config';
import { ItineraryItemType } from '../../../types/enums';

export const addSectionToTrip = async (
  tripId: string,
  userId: string,
  data: {
    cityId?: string;
    destinationId?: string;
    title?: string;
    description?: string;
    sectionOrder?: number;
    stopOrder?: number;
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

  const lastStop = await prisma.tripStop.findFirst({
    where: { tripId },
    orderBy: { stopOrder: 'desc' },
    select: { stopOrder: true },
  });
  const stopOrder = (lastStop?.stopOrder || 0) + 1;

  // Get or pick a cityId if not provided
  let cityId = data.cityId || data.destinationId;
  if (!cityId) {
    const firstCity = await prisma.city.findFirst({ select: { id: true } });
    cityId = firstCity?.id || '';
  }

  return await prisma.tripStop.create({
    data: {
      tripId,
      cityId,
      stopOrder,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      notes: data.description || data.title || null,
    },
    select: {
      id: true,
      tripId: true,
      cityId: true,
      stopOrder: true,
      startDate: true,
      endDate: true,
      notes: true,
      city: {
        select: { id: true, name: true, country: true },
      },
    },
  });
};

export const addItemToSection = async (
  stopId: string,
  userId: string,
  data: {
    activityId?: string;
    title: string;
    description?: string;
    itemType?: string;
    category?: string;
    dayNumber?: number;
    orderIndex?: number;
    itemOrder?: number;
    expense?: number;
    costEstimate?: number;
    startTime?: string;
    endTime?: string;
    notes?: string;
  }
) => {
  const stop = await prisma.tripStop.findUnique({
    where: { id: stopId },
    select: {
      id: true,
      tripId: true,
      trip: {
        select: { id: true, userId: true },
      },
    },
  });

  if (!stop || stop.trip.userId !== userId) {
    throw new Error('Access forbidden or stop not found');
  }

  return await prisma.itineraryItem.create({
    data: {
      tripId: stop.tripId,
      stopId,
      activityId: data.activityId || null,
      title: data.title,
      description: data.description || data.notes || null,
      itemType: data.itemType || data.category || ItineraryItemType.ACTIVITY,
      costEstimate: data.costEstimate || data.expense || 0.0,
      orderIndex: data.orderIndex || data.itemOrder || 1,
      startTime: data.startTime || null,
      endTime: data.endTime || null,
    },
    select: {
      id: true,
      tripId: true,
      stopId: true,
      activityId: true,
      itemType: true,
      title: true,
      description: true,
      costEstimate: true,
      orderIndex: true,
      startTime: true,
      endTime: true,
      activity: {
        select: { id: true, name: true, imageUrl: true, popularityScore: true, estimatedCost: true },
      },
    },
  });
};

export const getTripItinerary = async (tripId: string) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      totalBudget: true,
      currency: true,
      stops: {
        select: {
          id: true,
          stopOrder: true,
          startDate: true,
          endDate: true,
          notes: true,
          city: {
            select: { id: true, name: true, country: true, imageUrl: true },
          },
          itineraryItems: {
            select: {
              id: true,
              title: true,
              itemType: true,
              description: true,
              orderIndex: true,
              costEstimate: true,
              startTime: true,
              endTime: true,
              activity: {
                select: { id: true, name: true, imageUrl: true, popularityScore: true },
              },
            },
            orderBy: { orderIndex: 'asc' },
          },
        },
        orderBy: { stopOrder: 'asc' },
      },
    },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  let totalExpense = 0;
  const dayWiseItinerary: Record<number, any[]> = {};

  trip.stops.forEach((stop, index) => {
    const dayNum = index + 1;
    if (!dayWiseItinerary[dayNum]) dayWiseItinerary[dayNum] = [];

    stop.itineraryItems.forEach((item) => {
      totalExpense += item.costEstimate || 0;
      dayWiseItinerary[dayNum].push({
        ...item,
        cityName: stop.city.name,
      });
    });
  });

  return {
    tripId: trip.id,
    title: trip.name,
    totalBudget: trip.totalBudget || 0,
    totalCalculatedExpense: totalExpense,
    remainingBudget: (trip.totalBudget || 0) - totalExpense,
    stops: trip.stops,
    dayWiseItinerary,
  };
};

export const getBudgetSummary = async (tripId: string) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
      id: true,
      name: true,
      totalBudget: true,
      currency: true,
      itineraryItems: {
        select: {
          id: true,
          itemType: true,
          costEstimate: true,
        },
      },
      dailyBudgets: {
        select: {
          budgetDate: true,
          budgetAmount: true,
        },
      },
    },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  const categoryBreakdown: Record<string, number> = {};
  let totalExpense = 0;

  trip.itineraryItems.forEach((item) => {
    const cost = item.costEstimate || 0;
    totalExpense += cost;
    const cat = item.itemType || 'other';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + cost;
  });

  const totalBudget = trip.totalBudget || 0;

  return {
    tripId: trip.id,
    title: trip.name,
    allocatedTotalBudget: totalBudget,
    totalActualExpense: totalExpense,
    budgetStatus: totalExpense > totalBudget && totalBudget > 0 ? 'OVER_BUDGET' : 'WITHIN_BUDGET',
    categoryBreakdown,
    dailyBudgets: trip.dailyBudgets,
  };
};
