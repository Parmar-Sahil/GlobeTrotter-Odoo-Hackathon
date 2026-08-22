import { prisma } from '../../config/prisma.config';
import { parsePagination, buildMeta } from '../../utils/pagination.util';
import { TripStatus } from '../../types/enums';

export const updateUserProfile = async (
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    profilePhotoUrl?: string;
    phoneNumber?: string;
    phone?: string;
    city?: string;
    country?: string;
    bio?: string;
    language?: string;
    currency?: string;
  }
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.profilePhotoUrl !== undefined || data.avatarUrl !== undefined
        ? { profilePhotoUrl: data.profilePhotoUrl || data.avatarUrl || null }
        : {}),
      ...(data.phone !== undefined || data.phoneNumber !== undefined
        ? { phone: data.phone || data.phoneNumber || null }
        : {}),
      ...(data.city !== undefined && { city: data.city || null }),
      ...(data.country !== undefined && { country: data.country || null }),
      ...(data.bio !== undefined && { bio: data.bio || null }),
      ...(data.language && { language: data.language }),
      ...(data.currency && { currency: data.currency }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      profilePhotoUrl: true,
      phone: true,
      city: true,
      country: true,
      bio: true,
      language: true,
      currency: true,
      role: true,
      updatedAt: true,
    },
  });
};

export const getUserPreplannedTrips = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const whereClause = {
    visibility: 'public',
    deletedAt: null,
  };

  const [trips, totalItems] = await Promise.all([
    prisma.trip.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        coverPhotoUrl: true,
        startDate: true,
        endDate: true,
        totalBudget: true,
        currency: true,
        stops: {
          select: {
            city: {
              select: { id: true, name: true, country: true, imageUrl: true },
            },
          },
          take: 1,
        },
        _count: {
          select: { stops: true, itineraryItems: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.trip.count({ where: whereClause }),
  ]);

  const meta = buildMeta(totalItems, page, limit);
  return { trips, meta };
};

export const getUserPreviousTrips = async (userId: string, query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const whereClause = {
    userId,
    status: TripStatus.COMPLETED,
    deletedAt: null,
  };

  const [trips, totalItems] = await Promise.all([
    prisma.trip.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        coverPhotoUrl: true,
        startDate: true,
        endDate: true,
        totalBudget: true,
        currency: true,
        status: true,
        stops: {
          select: {
            city: {
              select: { id: true, name: true, country: true, imageUrl: true },
            },
          },
          take: 1,
        },
        _count: {
          select: { stops: true, itineraryItems: true },
        },
      },
      orderBy: { endDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.trip.count({ where: whereClause }),
  ]);

  const meta = buildMeta(totalItems, page, limit);
  return { trips, meta };
};
