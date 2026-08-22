import { prisma } from '../../config/prisma.config';
import { parsePagination, buildMeta } from '../../utils/pagination.util';
import { Prisma } from '@prisma/client';

export const getTopRegionalDestinations = async () => {
  // Fetch popular destinations grouped by region with explicit selective fields
  const destinations = await prisma.destination.findMany({
    where: { isPopular: true },
    select: {
      id: true,
      name: true,
      country: true,
      region: true,
      description: true,
      imageUrl: true,
      bannerUrl: true,
      rating: true,
      visitCount: true,
      _count: {
        select: { activities: true, trips: true },
      },
    },
    orderBy: { rating: 'desc' },
    take: 12,
  });

  // Efficiently group by region in-memory (Rule 2: avoid N+1 queries)
  const groupedByRegion = destinations.reduce((acc, dest) => {
    const region = dest.region || 'Other';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(dest);
    return acc;
  }, {} as Record<string, typeof destinations>);

  return groupedByRegion;
};

export const searchDestinations = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);
  const { search, region, isPopular, sortBy = 'rating', sortOrder = 'desc' } = query;

  const whereClause: Prisma.DestinationWhereInput = {};

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

  if (isPopular !== undefined) {
    whereClause.isPopular = isPopular === 'true';
  }

  const orderBy = { [sortBy]: sortOrder };

  const [destinations, totalItems] = await Promise.all([
    prisma.destination.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        country: true,
        region: true,
        description: true,
        imageUrl: true,
        bannerUrl: true,
        rating: true,
        visitCount: true,
        _count: {
          select: { activities: true },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.destination.count({ where: whereClause }),
  ]);

  const meta = buildMeta(totalItems, page, limit);
  return { destinations, meta };
};

export const getDestinationById = async (id: string) => {
  const destination = await prisma.destination.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      country: true,
      region: true,
      description: true,
      imageUrl: true,
      bannerUrl: true,
      rating: true,
      visitCount: true,
      activities: {
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
        orderBy: { isPopular: 'desc' },
      },
    },
  });

  if (!destination) {
    throw new Error('Destination not found');
  }

  // Asynchronously increment visitCount for analytics (non-blocking)
  prisma.destination.update({
    where: { id },
    data: { visitCount: { increment: 1 } },
  }).catch((err) => console.error('Failed to increment visitCount:', err));

  return destination;
};

export const getDestinationSuggestions = async (destinationId: string) => {
  const destination = await prisma.destination.findUnique({
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
          title: true,
          category: true,
          description: true,
          imageUrl: true,
          estimatedPrice: true,
          estimatedDurationHours: true,
          rating: true,
          isPopular: true,
        },
        orderBy: { rating: 'desc' },
        take: 10,
      },
    },
  });

  if (!destination) {
    throw new Error('Destination not found');
  }

  return {
    destination: {
      id: destination.id,
      name: destination.name,
      country: destination.country,
      region: destination.region,
      imageUrl: destination.imageUrl,
    },
    suggestedActivities: destination.activities,
  };
};

export const createDestination = async (data: any) => {
  return await prisma.destination.create({
    data,
    select: {
      id: true,
      name: true,
      country: true,
      region: true,
      description: true,
      imageUrl: true,
      bannerUrl: true,
      isPopular: true,
      rating: true,
    },
  });
};
