import { prisma } from '../../../config/prisma.config';
import { parsePagination, buildMeta } from '../../../utils/pagination.util';
import { Prisma } from '@prisma/client';
import { TripStatus } from '../../../types/enums';

export const createTrip = async (
  userId: string,
  data: {
    title?: string;
    name?: string;
    destinationId?: string;
    cityId?: string;
    startDate: string;
    endDate: string;
    totalBudget?: number;
    coverImage?: string;
    coverPhotoUrl?: string;
    notes?: string;
    description?: string;
  }
) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (end < start) {
    throw new Error('End date cannot be prior to start date');
  }

  const now = new Date();
  let status: string = TripStatus.UPCOMING;
  if (now >= start && now <= end) {
    status = TripStatus.ONGOING;
  } else if (now > end) {
    status = TripStatus.COMPLETED;
  }

  const trip = await prisma.trip.create({
    data: {
      userId,
      name: data.name || data.title || 'My Trip',
      description: data.description || data.notes || null,
      startDate: start,
      endDate: end,
      status,
      totalBudget: data.totalBudget || 0.0,
      coverPhotoUrl: data.coverPhotoUrl || data.coverImage || null,
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      status: true,
      totalBudget: true,
      currency: true,
      coverPhotoUrl: true,
      description: true,
      createdAt: true,
    },
  });

  // If a destination city is passed, create a default trip stop
  const targetCityId = data.cityId || data.destinationId;
  if (targetCityId) {
    await prisma.tripStop.create({
      data: {
        tripId: trip.id,
        cityId: targetCityId,
        stopOrder: 1,
        startDate: start,
        endDate: end,
      },
    });
  }

  return trip;
};

export const getUserTrips = async (userId: string, query: any) => {
  const { page, limit, skip } = parsePagination(query);
  const { status, search, sortBy = 'startDate', sortOrder = 'asc' } = query;

  const whereClause: Prisma.TripWhereInput = { userId, deletedAt: null };

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [trips, totalItems] = await Promise.all([
    prisma.trip.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        visibility: true,
        totalBudget: true,
        currency: true,
        coverPhotoUrl: true,
        description: true,
        stops: {
          select: {
            id: true,
            stopOrder: true,
            city: {
              select: { id: true, name: true, country: true, imageUrl: true },
            },
          },
          orderBy: { stopOrder: 'asc' },
        },
        _count: {
          select: { stops: true, itineraryItems: true },
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
      name: true,
      description: true,
      startDate: true,
      endDate: true,
      status: true,
      visibility: true,
      totalBudget: true,
      currency: true,
      coverPhotoUrl: true,
      createdAt: true,
      stops: {
        select: {
          id: true,
          stopOrder: true,
          startDate: true,
          endDate: true,
          notes: true,
          city: {
            select: { id: true, name: true, country: true, countryCode: true, imageUrl: true },
          },
        },
        orderBy: { stopOrder: 'asc' },
      },
      user: {
        select: { id: true, firstName: true, lastName: true, profilePhotoUrl: true, username: true },
      },
    },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  const isPrivate = !trip.visibility || trip.visibility.toLowerCase() === 'private';
  if (isPrivate && (!userId || trip.userId !== userId)) {
    throw new Error('Access forbidden: Private trip');
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
    throw new Error('Access forbidden');
  }

  const updatePayload: Prisma.TripUpdateInput = {};
  if (data.name || data.title) updatePayload.name = data.name || data.title;
  if (data.startDate) updatePayload.startDate = new Date(data.startDate);
  if (data.endDate) updatePayload.endDate = new Date(data.endDate);
  if (data.status) updatePayload.status = data.status;
  if (data.visibility) updatePayload.visibility = data.visibility;
  if (data.totalBudget !== undefined) updatePayload.totalBudget = data.totalBudget;
  if (data.coverPhotoUrl || data.coverImage) updatePayload.coverPhotoUrl = data.coverPhotoUrl || data.coverImage;
  if (data.description || data.notes) updatePayload.description = data.description || data.notes;

  return await prisma.trip.update({
    where: { id: tripId },
    data: updatePayload,
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      status: true,
      visibility: true,
      totalBudget: true,
      coverPhotoUrl: true,
      updatedAt: true,
    },
  });
};

export const deleteTrip = async (tripId: string, userId: string) => {
  const existingTrip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true, userId: true },
  });

  if (!existingTrip || existingTrip.userId !== userId) {
    throw new Error('Access forbidden or trip not found');
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: { deletedAt: new Date() },
  });

  return { message: 'Trip deleted successfully' };
};
