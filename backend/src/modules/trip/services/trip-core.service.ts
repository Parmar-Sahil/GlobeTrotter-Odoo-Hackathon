import { prisma } from '../../../config/prisma.config';
import { parsePagination, buildMeta } from '../../../utils/pagination.util';
import { Prisma } from '@prisma/client';
import { TripStatus } from '../../../types/enums';

export const createTrip = async (
  userId: string,
  data: {
    title: string;
    destinationId?: string;
    startDate: string;
    endDate: string;
    totalBudget?: number;
    coverImage?: string;
    notes?: string;
  }
) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (end < start) {
    throw new Error('End date cannot be prior to start date');
  }

  // Auto-determine status based on dates
  const now = new Date();
  let status: TripStatus = TripStatus.UPCOMING;
  if (now >= start && now <= end) {
    status = TripStatus.ONGOING;
  } else if (now > end) {
    status = TripStatus.COMPLETED;
  }

  return await prisma.trip.create({
    data: {
      userId,
      title: data.title,
      destinationId: data.destinationId || null,
      startDate: start,
      endDate: end,
      status,
      totalBudget: data.totalBudget || 0.0,
      coverImage: data.coverImage || null,
      notes: data.notes || null,
    },
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
      status: true,
      totalBudget: true,
      coverImage: true,
      notes: true,
      createdAt: true,
      destination: {
        select: { id: true, name: true, country: true, imageUrl: true },
      },
    },
  });
};

export const getUserTrips = async (userId: string, query: any) => {
  const { page, limit, skip } = parsePagination(query);
  const { status, search, sortBy = 'startDate', sortOrder = 'asc' } = query;

  const whereClause: Prisma.TripWhereInput = { userId };

  if (status) {
    whereClause.status = status as TripStatus;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { destination: { name: { contains: search } } },
    ];
  }

  const [trips, totalItems] = await Promise.all([
    prisma.trip.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        status: true,
        totalBudget: true,
        coverImage: true,
        notes: true,
        destination: {
          select: { id: true, name: true, country: true, imageUrl: true },
        },
        _count: {
          select: { sections: true },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.trip.count({ where: whereClause }),
  ]);

  const meta = buildMeta(totalItems, page, limit);
  return { trips, meta };
};

export const getTripById = async (tripId: string, userId?: string) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
      id: true,
      userId: true,
      title: true,
      startDate: true,
      endDate: true,
      status: true,
      totalBudget: true,
      coverImage: true,
      isPublic: true,
      isPreplanned: true,
      notes: true,
      createdAt: true,
      destination: {
        select: { id: true, name: true, country: true, imageUrl: true, bannerUrl: true },
      },
      user: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true },
      },
    },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Authorization Privacy Check (Rule 5)
  if (!trip.isPublic && !trip.isPreplanned && trip.userId !== userId) {
    throw new Error('Access forbidden: You do not have permission to view this trip');
  }

  return trip;
};

export const updateTrip = async (
  tripId: string,
  userId: string,
  data: any
) => {
  const existingTrip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true, userId: true },
  });

  if (!existingTrip) {
    throw new Error('Trip not found');
  }

  if (existingTrip.userId !== userId) {
    throw new Error('Access forbidden: You can only update your own trips');
  }

  const updatePayload: Prisma.TripUpdateInput = {};
  if (data.title) updatePayload.title = data.title;
  if (data.destinationId) updatePayload.destination = { connect: { id: data.destinationId } };
  if (data.startDate) updatePayload.startDate = new Date(data.startDate);
  if (data.endDate) updatePayload.endDate = new Date(data.endDate);
  if (data.status) updatePayload.status = data.status;
  if (data.totalBudget !== undefined) updatePayload.totalBudget = data.totalBudget;
  if (data.coverImage !== undefined) updatePayload.coverImage = data.coverImage || null;
  if (data.notes !== undefined) updatePayload.notes = data.notes || null;

  return await prisma.trip.update({
    where: { id: tripId },
    data: updatePayload,
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
      status: true,
      totalBudget: true,
      coverImage: true,
      updatedAt: true,
    },
  });
};

export const deleteTrip = async (tripId: string, userId: string) => {
  const existingTrip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true, userId: true },
  });

  if (!existingTrip) {
    throw new Error('Trip not found');
  }

  if (existingTrip.userId !== userId) {
    throw new Error('Access forbidden: You can only delete your own trips');
  }

  await prisma.trip.delete({ where: { id: tripId } });
  return { message: 'Trip deleted successfully' };
};
