import { prisma } from '../../config/prisma.config';
import { parsePagination, buildMeta } from '../../utils/pagination.util';
import { Prisma } from '@prisma/client';
import { ActivityCategory } from '../../types/enums';

export const searchActivities = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);
  const {
    search,
    destinationId,
    city,
    category,
    minPrice,
    maxPrice,
    sortBy = 'rating',
    sortOrder = 'desc',
    groupBy,
  } = query;

  const whereClause: Prisma.ActivityWhereInput = {};

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (destinationId) {
    whereClause.destinationId = destinationId;
  }

  if (city) {
    whereClause.destination = { name: { contains: city } };
  }

  if (category) {
    whereClause.category = category as ActivityCategory;
  }

  if (minPrice || maxPrice) {
    whereClause.estimatedPrice = {
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
        title: true,
        category: true,
        description: true,
        imageUrl: true,
        estimatedPrice: true,
        estimatedDurationHours: true,
        rating: true,
        isPopular: true,
        locationAddress: true,
        destination: {
          select: { id: true, name: true, country: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.activity.count({ where: whereClause }),
  ]);

  // Handle in-memory grouping if requested (e.g., group by category or city)
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
      const key = act.destination.name;
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
      title: true,
      category: true,
      description: true,
      imageUrl: true,
      estimatedPrice: true,
      estimatedDurationHours: true,
      rating: true,
      isPopular: true,
      locationAddress: true,
      destination: {
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
    data,
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      imageUrl: true,
      estimatedPrice: true,
      estimatedDurationHours: true,
      rating: true,
      isPopular: true,
    },
  });
};
