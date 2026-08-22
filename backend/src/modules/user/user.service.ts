import { prisma } from '../../config/prisma.config';
import { parsePagination, buildMeta } from '../../utils/pagination.util';
import { TripStatus } from '../../types/enums';

export const updateUserProfile = async (
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    phoneNumber?: string;
    city?: string;
    country?: string;
    bio?: string;
  }
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl || null }),
      ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber || null }),
      ...(data.city !== undefined && { city: data.city || null }),
      ...(data.country !== undefined && { country: data.country || null }),
      ...(data.bio !== undefined && { bio: data.bio || null }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      avatarUrl: true,
      phoneNumber: true,
      city: true,
      country: true,
      bio: true,
      role: true,
      updatedAt: true,
    },
  });
};

export const getUserPreplannedTrips = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const whereClause = {
    isPreplanned: true,
    isPublic: true,
  };

  const [trips, totalItems] = await Promise.all([
    prisma.trip.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        coverImage: true,
        startDate: true,
        endDate: true,
        totalBudget: true,
        destination: {
          select: { id: true, name: true, country: true, imageUrl: true },
        },
        _count: {
          select: { sections: true },
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
  };

  const [trips, totalItems] = await Promise.all([
    prisma.trip.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        coverImage: true,
        startDate: true,
        endDate: true,
        totalBudget: true,
        status: true,
        destination: {
          select: { id: true, name: true, country: true, imageUrl: true },
        },
        _count: {
          select: { sections: true },
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
