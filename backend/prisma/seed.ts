import { PrismaClient } from '@prisma/client';
import {
  UserRole,
  UserStatus,
  TripStatus,
  TripVisibility,
  ItineraryItemType,
  PostStatus,
  ShareMode,
  SearchType,
} from '../src/types/enums';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding GlobeTrotter 14-Table Database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@globetrotter.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@globetrotter.com',
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      firstName: 'Admin',
      lastName: 'User',
      city: 'Paris',
      country: 'France',
      countryCode: 'FR',
      bio: 'Head Travel Curator at GlobeTrotter',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      isEmailVerified: true,
    },
  });

  const john = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      username: 'johndoe',
      email: 'john.doe@example.com',
      passwordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      country: 'USA',
      countryCode: 'US',
      bio: 'Travel enthusiast & landscape photographer.',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      isEmailVerified: true,
    },
  });

  const jane = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      username: 'janesmith',
      email: 'jane.smith@example.com',
      passwordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'Tokyo',
      country: 'Japan',
      countryCode: 'JP',
      bio: 'Culture explorer & foodie travel blogger.',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      isEmailVerified: true,
    },
  });

  console.log('✅ Users seeded');

  // 2. Cities
  const paris = await prisma.city.upsert({
    where: { name_countryCode: { name: 'Paris', countryCode: 'FR' } },
    update: {},
    create: {
      name: 'Paris',
      countryCode: 'FR',
      country: 'France',
      region: 'Europe',
      costIndex: 85.5,
      popularityScore: 98.4,
      description: 'The City of Light, world famous for art, fashion, gastronomy and culture.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      latitude: 48.8566,
      longitude: 2.3522,
      timezone: 'Europe/Paris',
    },
  });

  const nyc = await prisma.city.upsert({
    where: { name_countryCode: { name: 'New York City', countryCode: 'US' } },
    update: {},
    create: {
      name: 'New York City',
      countryCode: 'US',
      country: 'USA',
      region: 'North America',
      costIndex: 92.0,
      popularityScore: 96.2,
      description: 'The Big Apple: home of skyscrapers, Broadway, Central Park and iconic museums.',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      latitude: 40.7128,
      longitude: -74.006,
      timezone: 'America/New_York',
    },
  });

  const tokyo = await prisma.city.upsert({
    where: { name_countryCode: { name: 'Tokyo', countryCode: 'JP' } },
    update: {},
    create: {
      name: 'Tokyo',
      countryCode: 'JP',
      country: 'Japan',
      region: 'Asia',
      costIndex: 88.0,
      popularityScore: 99.1,
      description: 'A futuristic metropolis combining neon skyscrapers with ancient shinto shrines.',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      latitude: 35.6762,
      longitude: 139.6503,
      timezone: 'Asia/Tokyo',
    },
  });

  console.log('✅ Cities seeded');

  // 3. Saved Destinations
  await prisma.savedDestination.upsert({
    where: { userId_cityId: { userId: john.id, cityId: paris.id } },
    update: {},
    create: { userId: john.id, cityId: paris.id },
  });

  // 4. Activities
  const eiffelTour = await prisma.activity.create({
    data: {
      cityId: paris.id,
      name: 'Eiffel Tower Guided Summit Visit',
      description: 'Skip-the-line elevator access with expert guide.',
      category: ItineraryItemType.ACTIVITY,
      estimatedCost: 75.0,
      durationMinutes: 150,
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
      popularityScore: 99.0,
    },
  });

  const paragliding = await prisma.activity.create({
    data: {
      cityId: paris.id,
      name: 'Paragliding over Seine Valley',
      description: 'Tandem paragliding experience with panoramic views.',
      category: ItineraryItemType.ACTIVITY,
      estimatedCost: 180.0,
      durationMinutes: 180,
      address: 'Seine Valley Flight Center, Paris',
      imageUrl: 'https://images.unsplash.com/photo-1512555928601-e3feed426f28?w=800',
      popularityScore: 94.5,
    },
  });

  const centralPark = await prisma.activity.create({
    data: {
      cityId: nyc.id,
      name: 'Central Park Bicycle Tour',
      description: 'Guided bike tour across Bethesda Terrace & Strawberry Fields.',
      category: ItineraryItemType.ACTIVITY,
      estimatedCost: 45.0,
      durationMinutes: 120,
      address: '59th St & 5th Ave, New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
      popularityScore: 91.0,
    },
  });

  console.log('✅ Activities seeded');

  // 5. Trips
  const parisTrip = await prisma.trip.create({
    data: {
      userId: john.id,
      name: 'Paris Summer Exploration',
      description: '7-day getaway exploring romantic Paris landmarks and Seine Valley adventure.',
      coverPhotoUrl: paris.imageUrl,
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-17'),
      status: TripStatus.UPCOMING,
      visibility: TripVisibility.PUBLIC,
      totalBudget: 2500.0,
    },
  });

  // 6. Trip Stops
  const parisStop = await prisma.tripStop.create({
    data: {
      tripId: parisTrip.id,
      cityId: paris.id,
      stopOrder: 1,
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-17'),
      notes: 'Main city stop for hotel and activities',
    },
  });

  // 7. Itinerary Items
  await prisma.itineraryItem.createMany({
    data: [
      {
        tripId: parisTrip.id,
        stopId: parisStop.id,
        activityId: eiffelTour.id,
        itemType: ItineraryItemType.ACTIVITY,
        title: 'Eiffel Tower Guided Summit Visit',
        description: 'Guided summit tour',
        startDate: new Date('2026-09-11'),
        endDate: new Date('2026-09-11'),
        startTime: '10:00 AM',
        endTime: '12:30 PM',
        costEstimate: 75.0,
        orderIndex: 1,
      },
      {
        tripId: parisTrip.id,
        stopId: parisStop.id,
        activityId: paragliding.id,
        itemType: ItineraryItemType.ACTIVITY,
        title: 'Paragliding over Seine Valley',
        description: 'Tandem flight',
        startDate: new Date('2026-09-12'),
        endDate: new Date('2026-09-12'),
        startTime: '02:00 PM',
        endTime: '05:00 PM',
        costEstimate: 180.0,
        orderIndex: 2,
      },
    ],
  });

  // 8. Trip Daily Budgets
  await prisma.tripDailyBudget.create({
    data: {
      tripId: parisTrip.id,
      budgetDate: new Date('2026-09-11'),
      budgetAmount: 350.0,
    },
  });

  // 9. Trip Shares
  await prisma.tripShare.create({
    data: {
      tripId: parisTrip.id,
      sharedByUserId: john.id,
      mode: ShareMode.PUBLIC_LINK,
      token: 'e7a10f92-9382-411a-8291-paris-public-link',
    },
  });

  // 10. Community Posts
  const post = await prisma.communityPost.create({
    data: {
      userId: john.id,
      tripId: parisTrip.id,
      activityId: paragliding.id,
      cityId: paris.id,
      title: 'Tandem Paragliding over Seine Valley - Unbelievable Experience!',
      body: 'Taking off over the Seine valley was pure magic. Highly recommend booking in advance!',
      imageUrls: JSON.stringify([paragliding.imageUrl]),
      tags: JSON.stringify(['Paris', 'Adventure', 'Paragliding']),
      status: PostStatus.PUBLISHED,
    },
  });

  // 11. Post Comments
  await prisma.communityPostComment.create({
    data: {
      postId: post.id,
      userId: jane.id,
      body: 'Incredible photo! Adding this activity to my Paris wishlist right away.',
    },
  });

  // 12. Post Likes
  await prisma.communityPostLike.create({
    data: {
      postId: post.id,
      userId: jane.id,
    },
  });

  // 13. Search Logs
  await prisma.searchLog.create({
    data: {
      userId: john.id,
      searchType: SearchType.CITY,
      query: 'Paris',
      filters: JSON.stringify({ region: 'Europe' }),
      resultCount: 1,
    },
  });

  console.log('🎉 14-Table Seeding Complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
