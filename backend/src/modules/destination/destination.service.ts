import { prisma } from '../../config/prisma.config';
import { parsePagination, buildMeta } from '../../utils/pagination.util';
import { Prisma } from '@prisma/client';

export const getTopRegionalDestinations = async () => {
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      country: true,
      countryCode: true,
      region: true,
      description: true,
      imageUrl: true,
      popularityScore: true,
      costIndex: true,
      _count: {
        select: { activities: true, tripStops: true },
      },
    },
    orderBy: { popularityScore: 'desc' },
    take: 12,
  });

  const groupedByRegion = cities.reduce((acc, city) => {
    const region = city.region || 'Other';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(city);
    return acc;
  }, {} as Record<string, typeof cities>);

  return groupedByRegion;
};

export const searchDestinations = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);
  const { search, region, sortBy = 'popularityScore', sortOrder = 'desc' } = query;

  const whereClause: Prisma.CityWhereInput = { isActive: true };

  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { country: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (region) {
    whereClause.region = { equals: region };
  }

  const orderBy = { [sortBy]: sortOrder };

  const [cities, totalItems] = await Promise.all([
    prisma.city.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        country: true,
        countryCode: true,
        region: true,
        description: true,
        imageUrl: true,
        popularityScore: true,
        costIndex: true,
        _count: {
          select: { activities: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.city.count({ where: whereClause }),
  ]);

  const meta = buildMeta(totalItems, page, limit);
  return { destinations: cities, meta };
};

export const getDestinationById = async (id: string) => {
  const city = await prisma.city.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      country: true,
      countryCode: true,
      region: true,
      description: true,
      imageUrl: true,
      popularityScore: true,
      costIndex: true,
      latitude: true,
      longitude: true,
      timezone: true,
      activities: {
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
        orderBy: { popularityScore: 'desc' },
      },
    },
  });

  if (!city) {
    throw new Error('Destination city not found');
  }

  // Non-blocking popularity update for analytics
  prisma.city.update({
    where: { id },
    data: { popularityScore: { increment: 0.1 } },
  }).catch((err) => console.error('Failed to update popularity score:', err));

  return city;
};

export const getDestinationSuggestions = async (destinationId: string) => {
  const city = await prisma.city.findUnique({
    where: { id: destinationId },
    select: {
      id: true,
      name: true,
      country: true,
      region: true,
      imageUrl: true,
      activities: {
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
        orderBy: { popularityScore: 'desc' },
        take: 10,
      },
    },
  });

  if (!city) {
    throw new Error('Destination city not found');
  }

  return {
    destination: {
      id: city.id,
      name: city.name,
      country: city.country,
      region: city.region,
      imageUrl: city.imageUrl,
    },
    suggestedActivities: city.activities,
  };
};

export const createDestination = async (data: any) => {
  return await prisma.city.create({
    data: {
      name: data.name,
      countryCode: data.countryCode || 'US',
      country: data.country || null,
      region: data.region || null,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      popularityScore: data.popularityScore || 0.0,
      costIndex: data.costIndex || null,
    },
    select: {
      id: true,
      name: true,
      country: true,
      countryCode: true,
      region: true,
      description: true,
      imageUrl: true,
      popularityScore: true,
    },
  });
};
