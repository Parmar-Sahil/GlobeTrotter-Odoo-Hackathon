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
  console.log('🌱 Inserting rich mock data into GlobeTrotter 14-Table Database...');

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
      phone: '+1-555-0100',
      city: 'Paris',
      country: 'France',
      countryCode: 'FR',
      bio: 'Head Travel Curator & Administrator at GlobeTrotter',
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
      phone: '+1-555-0199',
      city: 'New York',
      country: 'USA',
      countryCode: 'US',
      bio: 'Avid traveler & landscape photography enthusiast.',
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
      phone: '+81-90-5555-0123',
      city: 'Tokyo',
      country: 'Japan',
      countryCode: 'JP',
      bio: 'Foodie, culture seeker & travel blogger.',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      isEmailVerified: true,
    },
  });

  const alex = await prisma.user.upsert({
    where: { email: 'alex.rivera@example.com' },
    update: {},
    create: {
      username: 'alexrivera',
      email: 'alex.rivera@example.com',
      passwordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      firstName: 'Alex',
      lastName: 'Rivera',
      phone: '+44-20-7946-0912',
      city: 'London',
      country: 'UK',
      countryCode: 'GB',
      bio: 'Mountain hiker & outdoor sports junkie.',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      isEmailVerified: true,
    },
  });

  console.log('✅ Users seeded successfully');

  // 2. Password Reset Tokens
  await prisma.passwordResetToken.create({
    data: {
      userId: john.id,
      tokenHash: 'hashed_sample_reset_token_123',
      expiresAt: new Date(Date.now() + 3600000),
    },
  });

  // 3. Cities
  const paris = await prisma.city.upsert({
    where: { name_countryCode: { name: 'Paris', countryCode: 'FR' } },
    update: {},
    create: {
      name: 'Paris',
      countryCode: 'FR',
      country: 'France',
      region: 'Europe',
      costIndex: 85.5,
      popularityScore: 98.5,
      description: 'The City of Light, world famous for romance, art, architecture and fine gastronomy.',
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
      popularityScore: 96.8,
      description: 'The Big Apple: home of iconic skyscrapers, Broadway theaters and Central Park.',
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
      popularityScore: 99.2,
      description: 'A vibrant metropolis blending futuristic technology with centuries-old temples.',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      latitude: 35.6762,
      longitude: 139.6503,
      timezone: 'Asia/Tokyo',
    },
  });

  const manali = await prisma.city.upsert({
    where: { name_countryCode: { name: 'Manali', countryCode: 'IN' } },
    update: {},
    create: {
      name: 'Manali',
      countryCode: 'IN',
      country: 'India',
      region: 'Asia',
      costIndex: 35.0,
      popularityScore: 93.4,
      description: 'High-altitude Himalayan resort town famous for skiing, paragliding, and trekking.',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      latitude: 32.2432,
      longitude: 77.1892,
      timezone: 'Asia/Kolkata',
    },
  });

  const bali = await prisma.city.upsert({
    where: { name_countryCode: { name: 'Bali', countryCode: 'ID' } },
    update: {},
    create: {
      name: 'Bali',
      countryCode: 'ID',
      country: 'Indonesia',
      region: 'Asia',
      costIndex: 42.0,
      popularityScore: 97.1,
      description: 'Tropical paradise renowned for volcanic mountains, iconic rice paddies, and coral reefs.',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      latitude: -8.4095,
      longitude: 115.1889,
      timezone: 'Asia/Makassar',
    },
  });

  console.log('✅ Cities seeded successfully');

  // 4. Saved Destinations
  await prisma.savedDestination.upsert({
    where: { userId_cityId: { userId: john.id, cityId: paris.id } },
    update: {},
    create: { userId: john.id, cityId: paris.id },
  });

  await prisma.savedDestination.upsert({
    where: { userId_cityId: { userId: jane.id, cityId: tokyo.id } },
    update: {},
    create: { userId: jane.id, cityId: tokyo.id },
  });

  // 5. Activities
  const eiffelTour = await prisma.activity.create({
    data: {
      cityId: paris.id,
      name: 'Eiffel Tower Guided Summit Visit',
      description: 'Skip-the-line elevator access to the summit with expert local guide.',
      category: ItineraryItemType.ACTIVITY,
      estimatedCost: 75.0,
      durationMinutes: 150,
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
      popularityScore: 99.5,
    },
  });

  const paraglidingParis = await prisma.activity.create({
    data: {
      cityId: paris.id,
      name: 'Paragliding over Seine Valley',
      description: 'Tandem paragliding experience with certified flight instructors.',
      category: ItineraryItemType.ACTIVITY,
      estimatedCost: 180.0,
      durationMinutes: 180,
      address: 'Seine Valley Flight Center, Paris',
      imageUrl: 'https://images.unsplash.com/photo-1512555928601-e3feed426f28?w=800',
      popularityScore: 94.0,
    },
  });

  const louvreTour = await prisma.activity.create({
    data: {
      cityId: paris.id,
      name: 'Louvre Museum Timed Entry & Guided Tour',
      description: 'Explore the Mona Lisa, Venus de Milo, and masterworks with an art historian.',
      category: ItineraryItemType.ACTIVITY,
      estimatedCost: 65.0,
      durationMinutes: 180,
      address: 'Rue de Rivoli, 75001 Paris',
      imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=800',
      popularityScore: 98.0,
    },
  });

  const centralParkBike = await prisma.activity.create({
    data: {
      cityId: nyc.id,
      name: 'Central Park Guided Bicycle Tour',
      description: 'Explore famous movie locations, Bethesda Terrace, and Strawberry Fields.',
      category: ItineraryItemType.ACTIVITY,
      estimatedCost: 45.0,
      durationMinutes: 120,
      address: '59th St & 5th Ave, New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
      popularityScore: 92.0,
    },
  });

  const shibuyaFoodTour = await prisma.activity.create({
    data: {
      cityId: tokyo.id,
      name: 'Shibuya Night Street Food Tour',
      description: 'Taste authentic ramen, yakitori, and matcha desserts through Shibuya backstreets.',
      category: ItineraryItemType.MEAL,
      estimatedCost: 90.0,
      durationMinutes: 210,
      address: 'Shibuya Crossing, Tokyo',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
      popularityScore: 97.5,
    },
  });

  const solangParagliding = await prisma.activity.create({
    data: {
      cityId: manali.id,
      name: 'Solang Valley Tandem Paragliding',
      description: 'High-altitude paragliding over snow-capped Himalayan peaks.',
      category: ItineraryItemType.ACTIVITY,
      estimatedCost: 55.0,
      durationMinutes: 90,
      address: 'Solang Valley, Manali, Himachal Pradesh',
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      popularityScore: 96.0,
    },
  });

  console.log('✅ Activities seeded successfully');

  // 6. Trips
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

  const nycTrip = await prisma.trip.create({
    data: {
      userId: john.id,
      name: 'NYC Getaway',
      description: '4-day urban adventure in New York City.',
      coverPhotoUrl: nyc.imageUrl,
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-05'),
      status: TripStatus.UPCOMING,
      visibility: TripVisibility.PUBLIC,
      totalBudget: 1800.0,
    },
  });

  const japanTrip = await prisma.trip.create({
    data: {
      userId: jane.id,
      name: 'Japan Culture & Food Tour',
      description: '10-day immersive food and temple tour across Tokyo.',
      coverPhotoUrl: tokyo.imageUrl,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-10'),
      status: TripStatus.COMPLETED,
      visibility: TripVisibility.PUBLIC,
      totalBudget: 3200.0,
    },
  });

  const manaliTrip = await prisma.trip.create({
    data: {
      userId: alex.id,
      name: 'Himalayan Manali Adventure',
      description: 'Trekking & paragliding in Solang valley.',
      coverPhotoUrl: manali.imageUrl,
      startDate: new Date('2026-08-20'),
      endDate: new Date('2026-08-27'),
      status: TripStatus.ONGOING,
      visibility: TripVisibility.PUBLIC,
      totalBudget: 1200.0,
    },
  });

  console.log('✅ Trips seeded successfully');

  // 7. Trip Stops
  const parisStop = await prisma.tripStop.create({
    data: {
      tripId: parisTrip.id,
      cityId: paris.id,
      stopOrder: 1,
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-17'),
      notes: 'Paris main hotel & tour stop',
    },
  });

  const nycStop = await prisma.tripStop.create({
    data: {
      tripId: nycTrip.id,
      cityId: nyc.id,
      stopOrder: 1,
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-05'),
    },
  });

  const tokyoStop = await prisma.tripStop.create({
    data: {
      tripId: japanTrip.id,
      cityId: tokyo.id,
      stopOrder: 1,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-10'),
    },
  });

  const manaliStop = await prisma.tripStop.create({
    data: {
      tripId: manaliTrip.id,
      cityId: manali.id,
      stopOrder: 1,
      startDate: new Date('2026-08-20'),
      endDate: new Date('2026-08-27'),
    },
  });

  // 8. Itinerary Items
  await prisma.itineraryItem.createMany({
    data: [
      {
        tripId: parisTrip.id,
        stopId: parisStop.id,
        activityId: eiffelTour.id,
        itemType: ItineraryItemType.ACTIVITY,
        title: 'Eiffel Tower Guided Summit Visit',
        description: 'Guided summit tour with skip-the-line access',
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
        activityId: louvreTour.id,
        itemType: ItineraryItemType.ACTIVITY,
        title: 'Louvre Museum Timed Entry & Guided Tour',
        description: 'Exploring Mona Lisa and classic sculptures',
        startDate: new Date('2026-09-11'),
        endDate: new Date('2026-09-11'),
        startTime: '02:00 PM',
        endTime: '05:00 PM',
        costEstimate: 65.0,
        orderIndex: 2,
      },
      {
        tripId: parisTrip.id,
        stopId: parisStop.id,
        activityId: paraglidingParis.id,
        itemType: ItineraryItemType.ACTIVITY,
        title: 'Paragliding over Seine Valley',
        description: 'Tandem paragliding flight',
        startDate: new Date('2026-09-12'),
        endDate: new Date('2026-09-12'),
        startTime: '01:00 PM',
        endTime: '04:00 PM',
        costEstimate: 180.0,
        orderIndex: 1,
      },
      {
        tripId: nycTrip.id,
        stopId: nycStop.id,
        activityId: centralParkBike.id,
        itemType: ItineraryItemType.ACTIVITY,
        title: 'Central Park Guided Bicycle Tour',
        description: 'Cycling around Bethesda Fountain and Bow Bridge',
        startDate: new Date('2026-10-02'),
        endDate: new Date('2026-10-02'),
        startTime: '11:00 AM',
        endTime: '01:00 PM',
        costEstimate: 45.0,
        orderIndex: 1,
      },
      {
        tripId: japanTrip.id,
        stopId: tokyoStop.id,
        activityId: shibuyaFoodTour.id,
        itemType: ItineraryItemType.MEAL,
        title: 'Shibuya Night Street Food Tour',
        description: 'Ramen & yakitori tasting tour',
        startDate: new Date('2026-08-03'),
        endDate: new Date('2026-08-03'),
        startTime: '06:00 PM',
        endTime: '09:30 PM',
        costEstimate: 90.0,
        orderIndex: 1,
      },
      {
        tripId: manaliTrip.id,
        stopId: manaliStop.id,
        activityId: solangParagliding.id,
        itemType: ItineraryItemType.ACTIVITY,
        title: 'Solang Valley Tandem Paragliding',
        description: 'Tandem flight in Solang valley',
        startDate: new Date('2026-08-22'),
        endDate: new Date('2026-08-22'),
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        costEstimate: 55.0,
        orderIndex: 1,
      },
    ],
  });

  // 9. Trip Daily Budgets
  await prisma.tripDailyBudget.createMany({
    data: [
      {
        tripId: parisTrip.id,
        budgetDate: new Date('2026-09-11'),
        budgetAmount: 350.0,
      },
      {
        tripId: parisTrip.id,
        budgetDate: new Date('2026-09-12'),
        budgetAmount: 300.0,
      },
    ],
  });

  // 10. Trip Shares
  await prisma.tripShare.create({
    data: {
      tripId: parisTrip.id,
      sharedByUserId: john.id,
      mode: ShareMode.PUBLIC_LINK,
      token: 'paris-summer-vacation-2026-public-token',
    },
  });

  // 11. Community Posts
  const post1 = await prisma.communityPost.create({
    data: {
      userId: john.id,
      tripId: parisTrip.id,
      activityId: paraglidingParis.id,
      cityId: paris.id,
      title: 'Tandem Paragliding in Paris - Pure Thrill!',
      body: 'Taking off over the Seine valley was one of the highlights of my European vacation. Incredible scenery!',
      imageUrls: JSON.stringify([paraglidingParis.imageUrl]),
      tags: JSON.stringify(['Paris', 'Adventure', 'Paragliding', 'France']),
      status: PostStatus.PUBLISHED,
    },
  });

  const post2 = await prisma.communityPost.create({
    data: {
      userId: jane.id,
      tripId: japanTrip.id,
      activityId: shibuyaFoodTour.id,
      cityId: tokyo.id,
      title: 'Best Ramen & Street Food Tour in Shibuya',
      body: 'If you visit Tokyo, you must take the Shibuya food tour. Best tonkotsu ramen I have ever tasted!',
      imageUrls: JSON.stringify([shibuyaFoodTour.imageUrl]),
      tags: JSON.stringify(['Tokyo', 'Foodie', 'Ramen', 'Japan']),
      status: PostStatus.PUBLISHED,
    },
  });

  // 12. Post Comments
  await prisma.communityPostComment.create({
    data: {
      postId: post1.id,
      userId: jane.id,
      body: 'That view looks breathtaking! Adding this paragliding spot to my itinerary.',
    },
  });

  await prisma.communityPostComment.create({
    data: {
      postId: post2.id,
      userId: alex.id,
      body: 'Tokyo street food is top notch! Thanks for sharing the recommendation.',
    },
  });

  // 13. Post Likes
  await prisma.communityPostLike.createMany({
    data: [
      { postId: post1.id, userId: jane.id },
      { postId: post1.id, userId: alex.id },
      { postId: post2.id, userId: john.id },
    ],
  });

  // 14. Search Logs
  await prisma.searchLog.createMany({
    data: [
      {
        userId: john.id,
        searchType: SearchType.CITY,
        query: 'Paris',
        filters: JSON.stringify({ region: 'Europe' }),
        resultCount: 1,
      },
      {
        userId: jane.id,
        searchType: SearchType.ACTIVITY,
        query: 'Ramen',
        filters: JSON.stringify({ category: 'meal' }),
        resultCount: 3,
      },
    ],
  });

  console.log('🎉 Mock Data Seeding Complete across all 14 Tables!');
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
