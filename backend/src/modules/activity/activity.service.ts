import { prisma } from '../../config/prisma.config';
import { parsePagination, buildMeta } from '../../utils/pagination.util';
import { Prisma } from '@prisma/client';

export const searchActivities = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);
  const {
    search,
    cityId,
    city,
    category,
    minPrice,
    maxPrice,
    sortBy = 'popularityScore',
    sortOrder = 'desc',
    groupBy,
  } = query;

  const whereClause: Prisma.ActivityWhereInput = { isActive: true };

  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { address: { contains: search } },
    ];
  }

  if (cityId) {
    whereClause.cityId = cityId;
  }

  if (city) {
    whereClause.city = { name: { contains: city } };
  }

  if (category) {
    whereClause.category = category;
  }

  if (minPrice || maxPrice) {
    whereClause.estimatedCost = {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    };
  }

  const orderBy = { [sortBy]: sortOrder };

  const [activities, totalItems] = await Promise.all([
    prisma.activity.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        imageUrl: true,
        estimatedCost: true,
        currency: true,
        durationMinutes: true,
        popularityScore: true,
        address: true,
        city: {
          select: { id: true, name: true, country: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.activity.count({ where: whereClause }),
  ]);

  let groupedData: Record<string, typeof activities> | null = null;
  if (groupBy === 'category') {
    groupedData = activities.reduce((acc, act) => {
      const key = act.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(act);
      return acc;
    }, {} as Record<string, typeof activities>);
  } else if (groupBy === 'city') {
    groupedData = activities.reduce((acc, act) => {
      const key = act.city.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(act);
      return acc;
    }, {} as Record<string, typeof activities>);
  }

  const meta = buildMeta(totalItems, page, limit);

  return {
    activities: groupedData || activities,
    isGrouped: !!groupedData,
    meta,
  };
};

export const getActivityById = async (id: string) => {
  const activity = await prisma.activity.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      imageUrl: true,
      estimatedCost: true,
      currency: true,
      durationMinutes: true,
      popularityScore: true,
      address: true,
      city: {
        select: { id: true, name: true, country: true, imageUrl: true },
      },
    },
  });

  if (!activity) {
    throw new Error('Activity not found');
  }

  return activity;
};

export const createActivity = async (data: any) => {
  return await prisma.activity.create({
    data: {
      cityId: data.cityId || data.destinationId,
      name: data.name || data.title,
      category: data.category || 'activity',
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      estimatedCost: data.estimatedCost || data.estimatedPrice || 0.0,
      currency: data.currency || 'USD',
      durationMinutes: data.durationMinutes || (data.estimatedDurationHours ? data.estimatedDurationHours * 60 : 60),
      address: data.address || data.locationAddress || null,
      popularityScore: data.popularityScore || 0.0,
    },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      imageUrl: true,
      estimatedCost: true,
      durationMinutes: true,
      popularityScore: true,
    },
  });
};
