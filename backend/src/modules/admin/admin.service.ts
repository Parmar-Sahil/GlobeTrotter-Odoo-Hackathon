import { prisma } from '../../config/prisma.config';
import { parsePagination, buildMeta } from '../../utils/pagination.util';
import { Prisma } from '@prisma/client';

export const getUsersList = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);
  const { search, role, isActive } = query;

  const whereClause: Prisma.UserWhereInput = {};

  if (search) {
    whereClause.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
      { username: { contains: search } },
    ];
  }

  if (role) {
    whereClause.role = role;
  }

  if (isActive !== undefined) {
    whereClause.isActive = isActive === 'true';
  }

  const [users, totalItems] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        avatarUrl: true,
        city: true,
        country: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { trips: true, communityPosts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  const meta = buildMeta(totalItems, page, limit);
  return { users, meta };
};

export const updateUserStatus = async (userId: string, data: { isActive?: boolean; role?: 'USER' | 'ADMIN' }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.role && { role: data.role }),
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });
};

export const getPopularCitiesAnalytics = async () => {
  // Fetch popular cities ranked by trip counts and visit counts
  const popularCities = await prisma.destination.findMany({
    select: {
      id: true,
      name: true,
      country: true,
      region: true,
      imageUrl: true,
      visitCount: true,
      rating: true,
      _count: {
        select: { trips: true, activities: true },
      },
    },
    orderBy: [
      { trips: { _count: 'desc' } },
      { visitCount: 'desc' },
    ],
    take: 10,
  });

  return popularCities.map((city) => ({
    id: city.id,
    cityName: city.name,
    country: city.country,
    region: city.region,
    visitCount: city.visitCount,
    tripsPlannedCount: city._count.trips,
    activitiesCount: city._count.activities,
    rating: city.rating,
  }));
};

export const getPopularActivitiesAnalytics = async () => {
  const popularActivities = await prisma.activity.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      estimatedPrice: true,
      rating: true,
      destination: {
        select: { name: true, country: true },
      },
      _count: {
        select: { tripItems: true },
      },
    },
    orderBy: [
      { tripItems: { _count: 'desc' } },
      { rating: 'desc' },
    ],
    take: 10,
  });

  return popularActivities.map((act) => ({
    id: act.id,
    title: act.title,
    category: act.category,
    cityName: act.destination.name,
    estimatedPrice: act.estimatedPrice,
    rating: act.rating,
    timesAddedToItineraries: act._count.tripItems,
  }));
};

export const getUserTrendsAnalytics = async () => {
  const [totalUsers, totalTrips, totalDestinations, totalActivities, totalPosts] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.destination.count(),
    prisma.activity.count(),
    prisma.communityPost.count(),
  ]);

  // Group trips by status efficiently
  const tripStatusCounts = await prisma.trip.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const statusMap = tripStatusCounts.reduce((acc, item) => {
    acc[item.status] = item._count.id;
    return acc;
  }, {} as Record<string, number>);

  return {
    overview: {
      totalUsers,
      totalTrips,
      totalDestinations,
      totalActivities,
      totalPosts,
    },
    tripBreakdown: {
      upcoming: statusMap['UPCOMING'] || 0,
      ongoing: statusMap['ONGOING'] || 0,
      completed: statusMap['COMPLETED'] || 0,
      draft: statusMap['DRAFT'] || 0,
      cancelled: statusMap['CANCELLED'] || 0,
    },
  };
};
