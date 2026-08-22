import { prisma } from '../../../config/prisma.config';

export const getUserCalendarEvents = async (userId: string, year?: number, month?: number) => {
  const whereClause: any = { userId };

  if (year && month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    whereClause.OR = [
      {
        startDate: { gte: startDate, lte: endDate },
      },
      {
        endDate: { gte: startDate, lte: endDate },
      },
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
      title: true,
      startDate: true,
      endDate: true,
      status: true,
      coverImage: true,
      destination: {
        select: { id: true, name: true, country: true },
      },
    },
    orderBy: { startDate: 'asc' },
  });

  // Map trips to calendar event structures (Rule 2: in-memory formatting)
  const calendarEvents = trips.map((trip) => {
    const startStr = trip.startDate.toISOString().split('T')[0];
    const endStr = trip.endDate.toISOString().split('T')[0];

    return {
      id: trip.id,
      title: trip.title,
      destinationName: trip.destination?.name || 'Multiple Places',
      startDate: startStr,
      endDate: endStr,
      status: trip.status,
      coverImage: trip.coverImage,
      displayLabel: `${trip.destination?.name ? trip.destination.name.toUpperCase() + ' TRIP' : trip.title.toUpperCase()}`,
    };
  });

  return calendarEvents;
};
