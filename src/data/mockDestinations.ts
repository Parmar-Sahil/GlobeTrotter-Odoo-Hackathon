import { DestinationCatalogItem } from '../types/travel';

export const MOCK_DESTINATIONS: DestinationCatalogItem[] = [
  {
    id: 'dest-bali',
    city: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    coverImage: '/assets/dest_bali.jpg',
    tagline: 'Island of the Gods, Emerald Terraces & Sunsets',
    description: 'A spiritual haven blending lush jungles in Ubud, coastal beach sunsets in Uluwatu, and rich Balinese traditions.',
    matchTags: ['Beach', 'Culture', 'Relaxation', 'Food & Wine', 'Nature'],
    avgBudgetDaily: 75,
    bestTimeToVisit: 'April - October',
    rating: 4.9,
    featuredActivities: [
      { title: 'Tegalalang Rice Terraces & Jungle Swing', category: 'sightseeing', cost: 18, duration: '3 hours' },
      { title: 'Mount Batur Sunrise Volcano Trek', category: 'adventure', cost: 45, duration: '5 hours' },
      { title: 'Uluwatu Cliff Temple & Kecak Fire Dance', category: 'culture', cost: 22, duration: '4 hours' },
      { title: 'Seminyak Sunset Beach Club & Seafood Dinner', category: 'food', cost: 40, duration: '3 hours' }
    ]
  },
  {
    id: 'dest-kyoto',
    city: 'Kyoto',
    country: 'Japan',
    region: 'East Asia',
    coverImage: '/assets/dest_kyoto.jpg',
    tagline: 'Ancient Shrines, Zen Gardens & Cherry Blossoms',
    description: 'The cultural heart of Japan boasting thousands of classical Buddhist temples, gardens, imperial palaces, and traditional wooden machiya houses.',
    matchTags: ['Culture', 'Food & Wine', 'Sightseeing', 'Photography'],
    avgBudgetDaily: 120,
    bestTimeToVisit: 'March - May & Oct - Nov',
    rating: 4.95,
    featuredActivities: [
      { title: 'Fushimi Inari 10,000 Torii Gates Trail', category: 'sightseeing', cost: 0, duration: '3 hours' },
      { title: 'Gion Traditional Tea Ceremony in Machiya', category: 'culture', cost: 35, duration: '2 hours' },
      { title: 'Arashiyama Bamboo Forest & Monkey Park', category: 'nature' as any, cost: 15, duration: '3.5 hours' },
      { title: 'Nishiki Food Market Tasting Tour', category: 'food', cost: 50, duration: '2.5 hours' }
    ]
  },
  {
    id: 'dest-amalfi',
    city: 'Amalfi Coast & Positano',
    country: 'Italy',
    region: 'Southern Europe',
    coverImage: '/assets/dest_amalfi.jpg',
    tagline: 'Pastel Cliffside Villages & Mediterranean Magic',
    description: 'A dramatic 50-kilometer stretch of coastline featuring towering cliffs, pastel-colored fishing villages, terrace lemon groves, and luxury yacht coves.',
    matchTags: ['Luxury', 'Food & Wine', 'Beach', 'Photography', 'Relaxation'],
    avgBudgetDaily: 190,
    bestTimeToVisit: 'May - September',
    rating: 4.88,
    featuredActivities: [
      { title: 'Private Wooden Gozzo Boat Tour to Capri', category: 'adventure', cost: 110, duration: '6 hours' },
      { title: 'Path of the Gods (Sentiero degli Dei) Hike', category: 'adventure', cost: 10, duration: '4.5 hours' },
      { title: 'Ravello Villa Cimbrone Gardens & Viewpoint', category: 'sightseeing', cost: 15, duration: '2 hours' },
      { title: 'Limoncello & Fresh Handmade Pasta Cooking Class', category: 'food', cost: 85, duration: '3.5 hours' }
    ]
  },
  {
    id: 'dest-swiss',
    city: 'Interlaken & Jungfrau',
    country: 'Switzerland',
    region: 'Central Europe',
    coverImage: '/assets/dest_swiss.jpg',
    tagline: 'Snowcapped Alps, Turquoise Lakes & Chalets',
    description: 'An alpine paradise tucked between Lake Thun and Lake Brienz, surrounded by the towering Eiger, Mönch, and Jungfrau summits.',
    matchTags: ['Adventure', 'Nature', 'Hiking', 'Luxury', 'Photography'],
    avgBudgetDaily: 210,
    bestTimeToVisit: 'June - September & Dec - March',
    rating: 4.92,
    featuredActivities: [
      { title: 'Jungfraujoch - Top of Europe Train Expedition', category: 'sightseeing', cost: 160, duration: '6 hours' },
      { title: 'Lake Brienz Kayak Tour & Giessbach Falls', category: 'adventure', cost: 75, duration: '3 hours' },
      { title: 'Lauterbrunnen 72 Waterfalls Valley E-Bike Tour', category: 'nature' as any, cost: 45, duration: '4 hours' },
      { title: 'Traditional Swiss Cheese Fondue in Mountain Chalet', category: 'food', cost: 55, duration: '2 hours' }
    ]
  },
  {
    id: 'dest-jaipur',
    city: 'Jaipur',
    country: 'India',
    region: 'South Asia',
    coverImage: '/assets/dest_jaipur.jpg',
    tagline: 'The Pink City, Royal Forts & Vibrant Bazaars',
    description: 'The vibrant capital of Rajasthan, famous for opulent royal palaces, pink sandstone ramparts, majestic hilltop forts, and aromatic street delicacies.',
    matchTags: ['Culture', 'History', 'Food & Wine', 'Budget Backpacker', 'Photography'],
    avgBudgetDaily: 45,
    bestTimeToVisit: 'October - March',
    rating: 4.85,
    featuredActivities: [
      { title: 'Amber Palace Elephant Ramparts & Sheesh Mahal', category: 'culture', cost: 12, duration: '4 hours' },
      { title: 'Hawa Mahal & Johari Bazaar Spice Walk', category: 'sightseeing', cost: 8, duration: '3 hours' },
      { title: 'Nahargarh Fort Sunset Over Pink City', category: 'sightseeing', cost: 5, duration: '2.5 hours' },
      { title: 'Royal Rajasthani Thali Tasting & Sweet Lassi Tour', category: 'food', cost: 20, duration: '2 hours' }
    ]
  },
  {
    id: 'dest-iceland',
    city: 'Reykjavik & South Coast',
    country: 'Iceland',
    region: 'Northern Europe',
    coverImage: '/assets/dest_iceland.jpg',
    tagline: 'Land of Fire & Ice, Northern Lights & Glaciers',
    description: 'A land of dramatic volcanic landscapes, steaming geothermal lagoons, thunderous waterfalls, black sand beaches, and the celestial Aurora Borealis.',
    matchTags: ['Adventure', 'Nature', 'Photography', 'Road Trip'],
    avgBudgetDaily: 175,
    bestTimeToVisit: 'September - March (Aurora) / June - August (Sun)',
    rating: 4.96,
    featuredActivities: [
      { title: 'Jökulsárlón Glacier Lagoon & Diamond Beach Walk', category: 'nature' as any, cost: 30, duration: '4 hours' },
      { title: 'Northern Lights Aurora Hunt with Astro Photographer', category: 'adventure', cost: 95, duration: '4.5 hours' },
      { title: 'Blue Lagoon Geothermal Spa & Silica Mud Mask', category: 'relaxation', cost: 85, duration: '3 hours' },
      { title: 'Golden Circle (Geysir, Gullfoss, Thingvellir)', category: 'sightseeing', cost: 65, duration: '7 hours' }
    ]
  }
];
