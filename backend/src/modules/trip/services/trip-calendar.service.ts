import { prisma } from '../../../config/prisma.config';

export const getUserCalendarEvents = async (userId: string, year?: number, month?: number) => {
  const whereClause: any = { userId, deletedAt: null };

  if (year && month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    whereClause.OR = [
      { startDate: { gte: startDate, lte: endDate } },
      { endDate: { gte: startDate, lte: endDate } },
      {
        AND: [
          { startDate: { lte: startDate } },
          { endDate: { gte: endDate } },
        ],
      },
    ];
  }

  const trips = await prisma.trip.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      status: true,
      visibility: true,
      coverPhotoUrl: true,
      stops: {
        select: {
          city: {
            select: { name: true, country: true },
          },
        },
        orderBy: { stopOrder: 'asc' },
        take: 1,
      },
    },
    orderBy: { startDate: 'asc' },
  });

  const calendarEvents = trips.map((trip) => {
    const startStr = trip.startDate.toISOString().split('T')[0];
    const endStr = trip.endDate.toISOString().split('T')[0];
    const cityName = trip.stops[0]?.city?.name;

    return {
      id: trip.id,
      title: trip.name,
      cityName: cityName || 'Multi-City Trip',
      startDate: startStr,
      endDate: endStr,
      status: trip.status,
      visibility: trip.visibility,
      coverPhotoUrl: trip.coverPhotoUrl,
      displayLabel: `${cityName ? cityName.toUpperCase() + ' TRIP' : trip.name.toUpperCase()}`,
    };
  });

  return calendarEvents;
};
