import { Trip } from '../types/travel';

export const INITIAL_MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-bali-01',
    title: 'Bali Bliss & Sacred Temples Expedition',
    destination: 'Bali',
    country: 'Indonesia',
    coverImage: '/assets/dest_bali.jpg',
    startDate: '2026-09-10',
    endDate: '2026-09-17',
    durationDays: 7,
    description: 'A 7-day tropical immersion combining Ubud rainforest retreats, sunrise volcano hiking, ocean cliff temples in Uluwatu, and authentic Balinese culinary masterclasses. Open for 2 fellow mindful explorers!',
    visibility: 'open_to_join',
    maxSpots: 4,
    hostId: 'user-sarah',
    hostName: 'Sarah Jenkins',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    hostBio: 'Super Host • 14 trips completed • Photography & slow food curator',
    tags: ['Beach', 'Culture', 'Food & Wine', 'Nature', 'Wellness'],
    totalBudget: 2400,
    spentBudget: 1720,
    currency: 'USD',
    likesCount: 142,
    clonedCount: 38,
    members: [
      {
        userId: 'user-sarah',
        role: 'host',
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-08-01'
      },
      {
        userId: 'user-alex',
        role: 'co_traveler',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-08-15'
      }
    ],
    joinRequests: [
      {
        id: 'req-01',
        tripId: 'trip-bali-01',
        tripTitle: 'Bali Bliss & Sacred Temples Expedition',
        userId: 'user-elena',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        userBio: 'Yoga instructor & slow traveler from London.',
        userTags: ['Wellness', 'Eco-Tourism', 'Foodie'],
        note: 'Hey Sarah! Loved your itinerary, especially the Ubud rice terrace walk. I would love to join your morning yoga and temple outings!',
        status: 'pending',
        createdAt: '2026-08-21T18:30:00Z'
      }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2026-09-10',
        city: 'Ubud, Bali',
        highlights: 'Arrival, villa check-in, sunset welcome drinks & organic feast',
        weatherForecast: { tempC: 28, condition: 'Sunny & Warm', icon: '☀️' },
        activities: [
          {
            id: 'act-1-1',
            day: 1,
            timeSlot: '02:00 PM',
            title: 'Check-in at Maya Ubud Rainforest Resort',
            location: 'Petulu, Ubud',
            description: 'Settle into riverside pool villas overlooking the Petanu River valley.',
            category: 'stay',
            estimatedCost: 220,
            durationHours: 2,
            booked: true,
            status: 'accepted'
          },
          {
            id: 'act-1-2',
            day: 1,
            timeSlot: '06:00 PM',
            title: 'Welcome Sunset Cocktails & Balinese Rijsttafel Dinner',
            location: 'Locavore Herbivore Ubud',
            description: 'Meet and greet dinner featuring modern Indonesian multi-course tasting.',
            category: 'food',
            estimatedCost: 65,
            durationHours: 3,
            globiTip: 'Globi says: Try the fresh passionfruit kombucha!',
            booked: true,
            status: 'accepted'
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-09-11',
        city: 'Ubud & Tegallalang',
        highlights: 'Sunrise rice terraces, giant jungle swing, and Tirta Empul water blessing',
        weatherForecast: { tempC: 27, condition: 'Partly Cloudy', icon: '⛅' },
        activities: [
          {
            id: 'act-2-1',
            day: 2,
            timeSlot: '06:30 AM',
            title: 'Tegallalang Sunrise Walk & Photography',
            location: 'Tegallalang Rice Terraces',
            description: 'Beat the crowds for golden light photo shots across the tiered emerald paddies.',
            category: 'sightseeing',
            estimatedCost: 15,
            durationHours: 2.5,
            status: 'accepted'
          },
          {
            id: 'act-2-2',
            day: 2,
            timeSlot: '11:00 AM',
            title: 'Tirta Empul Holy Water Purification Ritual',
            location: 'Tampaksiring',
            description: 'Participate in traditional Melukat cleansing with local temple priest.',
            category: 'culture',
            estimatedCost: 25,
            durationHours: 2,
            status: 'accepted'
          },
          {
            id: 'act-2-3',
            day: 2,
            timeSlot: '04:00 PM',
            title: 'Campuhan Ridge Walk & Organic Coconut Cafe',
            location: 'Campuhan Ridge',
            description: 'Scenic hilltop path between two rivers followed by fresh young coconuts.',
            category: 'relaxation',
            estimatedCost: 10,
            durationHours: 2,
            isProposal: true,
            proposedBy: {
              userId: 'user-alex',
              userName: 'Alex Rivera',
              userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
            },
            votes: [
              { userId: 'user-alex', userName: 'Alex Rivera', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', vote: 'up' },
              { userId: 'user-sarah', userName: 'Sarah Jenkins', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', vote: 'up' }
            ],
            status: 'accepted'
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-09-12',
        city: 'Mount Batur & Kintamani',
        highlights: 'Mount Batur 4x4 Jeep Sunrise or 2AM Summit Trek',
        weatherForecast: { tempC: 22, condition: 'Clear Sky', icon: '✨' },
        activities: [
          {
            id: 'act-3-1',
            day: 3,
            timeSlot: '04:00 AM',
            title: 'Mount Batur Sunrise Caldera 4WD Jeep Safari',
            location: 'Kintamani Black Lava',
            description: 'Watch morning sun illuminate Lake Batur from the volcanic rim with breakfast on the hood.',
            category: 'adventure',
            estimatedCost: 55,
            durationHours: 4,
            globiTip: '💡 Globi suggestion: Bring a light windbreaker jacket for the chilly summit breeze!',
            status: 'accepted'
          },
          {
            id: 'act-3-2',
            day: 3,
            timeSlot: '11:00 AM',
            title: 'Toya Devasya Natural Hot Springs Soak',
            location: 'Lake Batur',
            description: 'Warm therapeutic geothermal baths with panoramic lake view.',
            category: 'relaxation',
            estimatedCost: 20,
            durationHours: 2.5,
            status: 'accepted'
          }
        ]
      },
      {
        dayNumber: 4,
        date: '2026-09-13',
        city: 'Uluwatu & Jimbaran',
        highlights: 'Coastal transfer, cliff-hanging temples, Kecak fire dance & seafood BBQ',
        weatherForecast: { tempC: 29, condition: 'Sunny', icon: '☀️' },
        activities: [
          {
            id: 'act-4-1',
            day: 4,
            timeSlot: '05:00 PM',
            title: 'Uluwatu Cliffside Temple & Sunset Kecak Dance',
            location: 'Uluwatu Cliffs',
            description: 'Dramatic 70m ocean cliff backdrop as the sun sinks and 50+ vocal chanters perform the Ramayana epic.',
            category: 'culture',
            estimatedCost: 30,
            durationHours: 3,
            status: 'accepted'
          },
          {
            id: 'act-4-2',
            day: 4,
            timeSlot: '08:00 PM',
            title: 'Jimbaran Bay Candlelit Seafood Dinner on Sand',
            location: 'Jimbaran Beach',
            description: 'Grilled red snapper, king prawns, and sambal matah tables right at the water’s edge.',
            category: 'food',
            estimatedCost: 45,
            durationHours: 2.5,
            status: 'accepted'
          }
        ]
      }
    ],
    expenses: [
      {
        id: 'exp-1',
        tripId: 'trip-bali-01',
        title: 'Maya Ubud Pool Villa (3 Nights)',
        category: 'stay',
        totalAmount: 660,
        currency: 'USD',
        paidByUserId: 'user-sarah',
        paidByUserName: 'Sarah Jenkins',
        paidByUserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        date: '2026-08-10',
        splits: [
          { userId: 'user-sarah', userName: 'Sarah Jenkins', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', amountOwed: 330, settled: true },
          { userId: 'user-alex', userName: 'Alex Rivera', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', amountOwed: 330, settled: false }
        ]
      },
      {
        id: 'exp-2',
        tripId: 'trip-bali-01',
        title: 'Private Airport & Ubud Van Transfer with Driver',
        category: 'transport',
        totalAmount: 90,
        currency: 'USD',
        paidByUserId: 'user-alex',
        paidByUserName: 'Alex Rivera',
        paidByUserAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        date: '2026-08-14',
        splits: [
          { userId: 'user-sarah', userName: 'Sarah Jenkins', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', amountOwed: 45, settled: false },
          { userId: 'user-alex', userName: 'Alex Rivera', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', amountOwed: 45, settled: true }
        ]
      },
      {
        id: 'exp-3',
        tripId: 'trip-bali-01',
        title: 'Mount Batur Sunrise 4WD Jeep Booking',
        category: 'activities',
        totalAmount: 110,
        currency: 'USD',
        paidByUserId: 'user-sarah',
        paidByUserName: 'Sarah Jenkins',
        paidByUserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        date: '2026-08-18',
        splits: [
          { userId: 'user-sarah', userName: 'Sarah Jenkins', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', amountOwed: 55, settled: true },
          { userId: 'user-alex', userName: 'Alex Rivera', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', amountOwed: 55, settled: false }
        ]
      }
    ],
    messages: [
      {
        id: 'msg-1',
        tripId: 'trip-bali-01',
        senderId: 'globi-bot',
        senderName: 'Globi',
        senderAvatar: '/assets/globi_hero.jpg',
        isGlobi: true,
        body: '🎉 Welcome to the official Bali Bliss Expedition group hub! I will be your AI co-pilot. You can ask me for packing tips, local etiquette, or itinerary adjustments anytime!',
        createdAt: '2026-08-15T10:00:00Z',
        attachmentType: 'itinerary_pin'
      },
      {
        id: 'msg-2',
        tripId: 'trip-bali-01',
        senderId: 'user-sarah',
        senderName: 'Sarah Jenkins',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        isHost: true,
        body: 'Hey Alex! So glad you joined the trip! I just locked in the Ubud rainforest villa. Let me know what you think of the Day 3 Mount Batur plan!',
        createdAt: '2026-08-15T10:05:00Z'
      },
      {
        id: 'msg-3',
        tripId: 'trip-bali-01',
        senderId: 'user-alex',
        senderName: 'Alex Rivera',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        body: 'Awesome to be here Sarah! Mount Batur at sunrise looks unbelievable. Should we do the 4WD Jeep or the walking hike?',
        createdAt: '2026-08-15T10:12:00Z'
      },
      {
        id: 'msg-4',
        tripId: 'trip-bali-01',
        senderId: 'user-sarah',
        senderName: 'Sarah Jenkins',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        isHost: true,
        body: 'Let\'s do a quick group poll to decide!',
        createdAt: '2026-08-15T10:15:00Z',
        attachmentType: 'poll',
        poll: {
          id: 'poll-batur',
          question: 'How should we explore Mount Batur at sunrise? 🌋',
          createdBy: 'user-sarah',
          creatorName: 'Sarah Jenkins',
          options: [
            { id: 'opt-1', text: '🚙 4x4 Custom Jeep Safari (More relaxed, coffee on hood)', votes: ['user-sarah', 'user-alex'] },
            { id: 'opt-2', text: '🥾 2:00 AM Active Summit Trek (Strenuous 4hr climb)', votes: [] }
          ]
        }
      }
    ]
  },
  {
    id: 'trip-amalfi-02',
    title: 'Amalfi Coast Pastel Dreams & Lemon Groves',
    destination: 'Amalfi Coast',
    country: 'Italy',
    coverImage: '/assets/dest_amalfi.jpg',
    startDate: '2026-10-05',
    endDate: '2026-10-11',
    durationDays: 6,
    description: 'Chasing sunset spritzes across Positano, vintage wooden gozzo cruises around Capri sea caves, and cliffside hiking on Path of the Gods.',
    visibility: 'open_to_join',
    maxSpots: 4,
    hostId: 'user-sarah',
    hostName: 'Sarah Jenkins',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tags: ['Luxury', 'Food & Wine', 'Beach', 'Photography'],
    totalBudget: 3200,
    spentBudget: 1400,
    currency: 'EUR',
    likesCount: 289,
    clonedCount: 94,
    members: [
      {
        userId: 'user-sarah',
        role: 'host',
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-08-01'
      }
    ],
    joinRequests: [],
    days: [
      {
        dayNumber: 1,
        date: '2026-10-05',
        city: 'Positano',
        highlights: 'Check-in, cliffside sunset spritz at Franco’s Bar',
        activities: [
          {
            id: 'act-amalfi-1',
            day: 1,
            timeSlot: '05:30 PM',
            title: 'Sunset Aperitivo at Franco’s Bar',
            location: 'Positano Clifftop',
            description: 'Iconic yellow-cushioned terrace watching the yachts light up.',
            category: 'food',
            estimatedCost: 35,
            durationHours: 2.5,
            status: 'accepted'
          }
        ]
      }
    ],
    expenses: [],
    messages: []
  },
  {
    id: 'trip-kyoto-03',
    title: 'Kyoto Zen & Cherry Blossom Heritage Quest',
    destination: 'Kyoto',
    country: 'Japan',
    coverImage: '/assets/dest_kyoto.jpg',
    startDate: '2027-03-25',
    endDate: '2027-04-02',
    durationDays: 8,
    description: 'Immerse in ancient Gion machiya tea ceremonies, early morning bamboo groves, culinary wanders in Nishiki market, and sunset photography at Yasaka Pagoda.',
    visibility: 'public_view',
    hostId: 'user-alex',
    hostName: 'Alex Rivera',
    hostAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    tags: ['Culture', 'Food & Wine', 'Photography', 'Sightseeing'],
    totalBudget: 2100,
    spentBudget: 890,
    currency: 'USD',
    likesCount: 512,
    clonedCount: 167,
    members: [
      {
        userId: 'user-alex',
        role: 'host',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-07-10'
      }
    ],
    joinRequests: [],
    days: [
      {
        dayNumber: 1,
        date: '2027-03-25',
        city: 'Kyoto',
        highlights: 'Fushimi Inari Torii Gate trail & Gion evening stroll',
        activities: [
          {
            id: 'act-kyoto-1',
            day: 1,
            timeSlot: '07:00 AM',
            title: 'Fushimi Inari Early Morning Torii Walk',
            location: 'Fushimi Ward',
            description: 'Wander 10,000 crimson gates before the morning rush.',
            category: 'sightseeing',
            estimatedCost: 0,
            durationHours: 3,
            status: 'accepted'
          }
        ]
      }
    ],
    expenses: [],
    messages: []
  },
  {
    id: 'trip-swiss-04',
    title: 'Swiss Alps High Altitude Lakes & Chalet Retreat',
    destination: 'Interlaken & Grindelwald',
    country: 'Switzerland',
    coverImage: '/assets/dest_swiss.jpg',
    startDate: '2026-11-12',
    endDate: '2026-11-18',
    durationDays: 6,
    description: 'Alpine hiking trails between Jungfraujoch, crystal lake kayaking in Brienz, authentic wood-fired cheese fondue, and breathtaking glacier overlooks.',
    visibility: 'open_to_join',
    maxSpots: 5,
    hostId: 'user-elena',
    hostName: 'Elena Rostova',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tags: ['Adventure', 'Hiking', 'Nature', 'Luxury'],
    totalBudget: 3600,
    spentBudget: 2100,
    currency: 'EUR',
    likesCount: 340,
    clonedCount: 82,
    members: [
      {
        userId: 'user-elena',
        role: 'host',
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-08-01'
      }
    ],
    joinRequests: [],
    days: [
      {
        dayNumber: 1,
        date: '2026-11-12',
        city: 'Interlaken',
        highlights: 'Lake Brienz turquoise cruise & Lauterbrunnen waterfalls',
        activities: [
          {
            id: 'act-swiss-1',
            day: 1,
            timeSlot: '10:00 AM',
            title: 'Lauterbrunnen 72 Waterfalls Valley Walk',
            location: 'Lauterbrunnen',
            description: 'Stroll past sheer rock walls and Staubbach falls.',
            category: 'nature' as any,
            estimatedCost: 15,
            durationHours: 3,
            status: 'accepted'
          }
        ]
      }
    ],
    expenses: [],
    messages: []
  },
  {
    id: 'trip-jaipur-05',
    title: 'Royal Rajasthan & Pink City Heritage Odyssey',
    destination: 'Jaipur',
    country: 'India',
    coverImage: '/assets/dest_jaipur.jpg',
    startDate: '2026-12-01',
    endDate: '2026-12-06',
    durationDays: 5,
    description: 'Explore the grand Sheesh Mahal at Amber Fort, royal courtyards of City Palace, pink bazaars, and traditional Rajasthani dining.',
    visibility: 'open_to_join',
    maxSpots: 6,
    hostId: 'user-sarah',
    hostName: 'Sarah Jenkins',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tags: ['Culture', 'History', 'Food & Wine', 'Photography'],
    totalBudget: 950,
    spentBudget: 420,
    currency: 'USD',
    likesCount: 195,
    clonedCount: 54,
    members: [
      {
        userId: 'user-sarah',
        role: 'host',
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-08-01'
      }
    ],
    joinRequests: [],
    days: [
      {
        dayNumber: 1,
        date: '2026-12-01',
        city: 'Jaipur',
        highlights: 'Amber Fort ramparts & Sheesh Mahal mirror palace',
        activities: [
          {
            id: 'act-j-1',
            day: 1,
            timeSlot: '09:00 AM',
            title: 'Amber Fort Hilltop Palace & Mirror Hall',
            location: 'Amer, Jaipur',
            description: 'Marvel at 16th century Rajput architecture and reflective glass inlay art.',
            category: 'culture',
            estimatedCost: 15,
            durationHours: 3.5,
            globiTip: '💡 Globi suggestion: Add Amber Fort sound & light show at sunset!',
            status: 'accepted'
          }
        ]
      }
    ],
    expenses: [],
    messages: []
  },
  {
    id: 'trip-iceland-06',
    title: 'Iceland Aurora Borealis & Glacial Lagoon Chase',
    destination: 'Reykjavik & South Coast',
    country: 'Iceland',
    coverImage: '/assets/dest_iceland.jpg',
    startDate: '2026-10-20',
    endDate: '2026-10-27',
    durationDays: 7,
    description: 'Road-tripping along Iceland\'s dramatic ring road: Diamond Beach icebergs, Skógafoss waterfall, natural geothermal hot springs, and chasing the green Northern Lights.',
    visibility: 'public_view',
    hostId: 'user-alex',
    hostName: 'Alex Rivera',
    hostAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    tags: ['Adventure', 'Nature', 'Photography', 'Road Trip'],
    totalBudget: 2800,
    spentBudget: 1950,
    currency: 'USD',
    likesCount: 680,
    clonedCount: 215,
    members: [
      {
        userId: 'user-alex',
        role: 'host',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        joinedAt: '2026-07-01'
      }
    ],
    joinRequests: [],
    days: [
      {
        dayNumber: 1,
        date: '2026-10-20',
        city: 'Reykjavik',
        highlights: 'Arrival, Blue Lagoon soak & Northern Lights hunt',
        activities: [
          {
            id: 'act-ice-1',
            day: 1,
            timeSlot: '02:00 PM',
            title: 'Blue Lagoon Geothermal Thermal Waters',
            location: 'Grindavík',
            description: 'Relax in 38°C silica-rich milky blue waters with sauna and mask bar.',
            category: 'relaxation',
            estimatedCost: 85,
            durationHours: 3,
            status: 'accepted'
          }
        ]
      }
    ],
    expenses: [],
    messages: []
  }
];
