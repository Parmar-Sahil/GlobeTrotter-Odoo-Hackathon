import { prisma } from '../../config/prisma.config';
import { parsePagination, buildMeta } from '../../utils/pagination.util';
import { Prisma } from '@prisma/client';
import { UserRole } from '../../types/enums';

export const getUsersList = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);
  const { search, role, status } = query;

  const whereClause: Prisma.UserWhereInput = { deletedAt: null };

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

  if (status) {
    whereClause.status = status;
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
        profilePhotoUrl: true,
        city: true,
        country: true,
        role: true,
        status: true,
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

export const updateUserStatus = async (userId: string, data: { status?: string; role?: string }) => {
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
      ...(data.status && { status: data.status }),
      ...(data.role && { role: data.role }),
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });
};

export const getPopularCitiesAnalytics = async () => {
  const popularCities = await prisma.city.findMany({
    select: {
      id: true,
      name: true,
      country: true,
      region: true,
      imageUrl: true,
      popularityScore: true,
      costIndex: true,
      _count: {
        select: { tripStops: true, activities: true },
      },
    },
    orderBy: [
      { popularityScore: 'desc' },
      { tripStops: { _count: 'desc' } },
    ],
    take: 10,
  });

  return popularCities.map((city) => ({
    id: city.id,
    cityName: city.name,
    country: city.country,
    region: city.region,
    popularityScore: city.popularityScore,
    tripsPlannedCount: city._count.tripStops,
    activitiesCount: city._count.activities,
  }));
};

export const getPopularActivitiesAnalytics = async () => {
  const popularActivities = await prisma.activity.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      estimatedCost: true,
      popularityScore: true,
      city: {
        select: { name: true, country: true },
      },
      _count: {
        select: { itineraryItems: true },
      },
    },
    orderBy: [
      { popularityScore: 'desc' },
      { itineraryItems: { _count: 'desc' } },
    ],
    take: 10,
  });

  return popularActivities.map((act) => ({
    id: act.id,
    title: act.name,
    category: act.category,
    cityName: act.city.name,
    estimatedCost: act.estimatedCost,
    popularityScore: act.popularityScore,
    timesAddedToItineraries: act._count.itineraryItems,
  }));
};

export const getUserTrendsAnalytics = async () => {
  const [totalUsers, totalTrips, totalCities, totalActivities, totalPosts] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.trip.count({ where: { deletedAt: null } }),
    prisma.city.count(),
    prisma.activity.count(),
    prisma.communityPost.count({ where: { deletedAt: null } }),
  ]);

  const tripStatusCounts = await prisma.trip.groupBy({
    by: ['status'],
    where: { deletedAt: null },
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
      totalCities,
      totalActivities,
      totalPosts,
    },
    tripBreakdown: {
      upcoming: statusMap['upcoming'] || 0,
      ongoing: statusMap['ongoing'] || 0,
      completed: statusMap['completed'] || 0,
      draft: statusMap['draft'] || 0,
      archived: statusMap['archived'] || 0,
    },
  };
};
