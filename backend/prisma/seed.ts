import { PrismaClient } from '@prisma/client';
import { Role, TripStatus, ActivityCategory } from '../src/types/enums';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GlobeTrotter database seeding...');

  // 1. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@globetrotter.com' },
    update: {},
    create: {
      email: 'admin@globetrotter.com',
      username: 'admin',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      city: 'Paris',
      country: 'France',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      bio: 'GlobeTrotter Administrator & Head Travel Plan Curator',
    },
  });

  const john = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      username: 'johndoe',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.USER,
      city: 'New York',
      country: 'USA',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Avid explorer & photography enthusiast!',
    },
  });

  const jane = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      username: 'janesmith',
      passwordHash,
      firstName: 'Jane',
      lastName: 'Smith',
      role: Role.USER,
      city: 'Tokyo',
      country: 'Japan',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Foodie & culture lover travelling the globe.',
    },
  });

  console.log('✅ Users seeded successfully');

  // 2. Create Destinations
  const paris = await prisma.destination.upsert({
    where: { name: 'Paris' },
    update: {},
    create: {
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      description: 'The City of Light, world famous for romance, art, culture, and iconic architecture.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
      isPopular: true,
      rating: 4.9,
      visitCount: 1540,
    },
  });

  const nyc = await prisma.destination.upsert({
    where: { name: 'New York City' },
    update: {},
    create: {
      name: 'New York City',
      country: 'USA',
      region: 'North America',
      description: 'The Big Apple, featuring breathtaking skyscrapers, Broadway shows, and vibrant nightlife.',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200',
      isPopular: true,
      rating: 4.8,
      visitCount: 2310,
    },
  });

  const tokyo = await prisma.destination.upsert({
    where: { name: 'Tokyo' },
    update: {},
    create: {
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      description: 'A dazzling blend of futuristic technology, rich ancient temples, and exquisite cuisine.',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      bannerUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
      isPopular: true,
      rating: 4.95,
      visitCount: 3100,
    },
  });

  const bali = await prisma.destination.upsert({
    where: { name: 'Bali' },
    update: {},
    create: {
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      description: 'Tropical paradise featuring serene beaches, volcanic mountains, and lush rice terraces.',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      isPopular: true,
      rating: 4.85,
      visitCount: 1890,
    },
  });

  console.log('✅ Destinations seeded successfully');

  // 3. Create Activities
  const paragliding = await prisma.activity.create({
    data: {
      destinationId: paris.id,
      title: 'Paragliding over Seine Valley',
      category: ActivityCategory.ADVENTURE,
      description: 'Tandem paragliding experience with certified flight instructors providing panoramic views.',
      imageUrl: 'https://images.unsplash.com/photo-1512555928601-e3feed426f28?w=800',
      estimatedPrice: 180.0,
      estimatedDurationHours: 3.0,
      rating: 4.9,
      isPopular: true,
    },
  });

  const eiffelTour = await prisma.activity.create({
    data: {
      destinationId: paris.id,
      title: 'Eiffel Tower Guided Summit Visit',
      category: ActivityCategory.SIGHTSEEING,
      description: 'Skip-the-line elevator access to the summit with expert local guide.',
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
      estimatedPrice: 75.0,
      estimatedDurationHours: 2.5,
      rating: 4.95,
      isPopular: true,
    },
  });

  const centralPark = await prisma.activity.create({
    data: {
      destinationId: nyc.id,
      title: 'Central Park Bicycle & Walking Tour',
      category: ActivityCategory.PHYSICAL_ACTIVITY,
      description: 'Explore famous movie locations, Bethesda Terrace, and Strawberry Fields.',
      imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
      estimatedPrice: 45.0,
      estimatedDurationHours: 2.0,
      rating: 4.75,
      isPopular: true,
    },
  });

  const shibuyaCrossing = await prisma.activity.create({
    data: {
      destinationId: tokyo.id,
      title: 'Shibuya Night Street Food Tour',
      category: ActivityCategory.FOOD_AND_DINING,
      description: 'Taste authentic ramen, yakitori, and matcha desserts through Shibuya backstreets.',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
      estimatedPrice: 90.0,
      estimatedDurationHours: 3.5,
      rating: 4.9,
      isPopular: true,
    },
  });

  console.log('✅ Activities seeded successfully');

  // 4. Create Trips & Itineraries
  const parisTrip = await prisma.trip.create({
    data: {
      userId: john.id,
      destinationId: paris.id,
      title: 'Paris Summer Vacation',
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-17'),
      status: TripStatus.UPCOMING,
      totalBudget: 2500.0,
      coverImage: paris.imageUrl,
      isPublic: true,
      notes: 'Remember to book Louvre museum passes in advance!',
      sections: {
        create: [
          {
            title: 'Arrival & City Orientation',
            sectionOrder: 1,
            allocatedBudget: 600.0,
            items: {
              create: [
                {
                  title: 'Check-in at Hotel Le Meurice',
                  category: ActivityCategory.RELAXATION,
                  dayNumber: 1,
                  itemOrder: 1,
                  expense: 350.0,
                  startTime: '02:00 PM',
                  endTime: '03:30 PM',
                  location: '228 Rue de Rivoli, 75001 Paris',
                },
                {
                  activityId: eiffelTour.id,
                  title: 'Eiffel Tower Guided Summit Visit',
                  category: ActivityCategory.SIGHTSEEING,
                  dayNumber: 1,
                  itemOrder: 2,
                  expense: 75.0,
                  startTime: '05:00 PM',
                  endTime: '07:30 PM',
                },
              ],
            },
          },
          {
            title: 'Adventure & Outdoor Activities',
            sectionOrder: 2,
            allocatedBudget: 800.0,
            items: {
              create: [
                {
                  activityId: paragliding.id,
                  title: 'Paragliding over Seine Valley',
                  category: ActivityCategory.ADVENTURE,
                  dayNumber: 2,
                  itemOrder: 1,
                  expense: 180.0,
                  startTime: '10:00 AM',
                  endTime: '01:00 PM',
                },
              ],
            },
          },
        ],
      },
    },
  });

  const nycTrip = await prisma.trip.create({
    data: {
      userId: john.id,
      destinationId: nyc.id,
      title: 'NYC Getaway',
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-05'),
      status: TripStatus.UPCOMING,
      totalBudget: 1800.0,
      coverImage: nyc.imageUrl,
      isPublic: true,
    },
  });

  const japanTrip = await prisma.trip.create({
    data: {
      userId: jane.id,
      destinationId: tokyo.id,
      title: 'Japan Adventure',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-10'),
      status: TripStatus.COMPLETED,
      totalBudget: 3200.0,
      coverImage: tokyo.imageUrl,
      isPublic: true,
    },
  });

  console.log('✅ Trips & Itineraries seeded successfully');

  // 5. Create Community Posts
  const post1 = await prisma.communityPost.create({
    data: {
      userId: john.id,
      tripId: parisTrip.id,
      title: 'Unforgettable Tandem Paragliding in Paris!',
      content: 'Taking off above the Seine valley was one of the most thrilling feelings of my life. Highly recommended for adventure seekers!',
      imageUrl: paragliding.imageUrl,
      location: 'Paris, France',
      category: 'Adventure',
      likesCount: 15,
      viewsCount: 142,
      comments: {
        create: [
          {
            userId: jane.id,
            content: 'Looks totally awesome! Adding this to my bucket list for next year.',
          },
        ],
      },
    },
  });

  console.log('✅ Community posts & comments seeded successfully');
  console.log('🎉 Seeding complete!');
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
