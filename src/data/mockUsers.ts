import { User } from '../types/travel';

export const MOCK_USERS: Record<string, User> = {
  'user-sarah': {
    id: 'user-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@globetrotter.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'Trip Host & Digital Nomad',
    bio: 'Photographer & slow traveler. Hosted 12+ group expeditions across SE Asia and Southern Europe.',
    homeCity: 'San Francisco, USA',
    level: 7,
    xp: 4850,
    countriesVisited: 24,
    tripsCompleted: 14,
    travelStreakDays: 18,
    travelStyleTags: ['Culture', 'Photography', 'Food & Wine', 'Slow Travel'],
    badges: [
      {
        id: 'b-host',
        name: 'Super Host',
        description: 'Successfully hosted 10+ group trips with 5-star feedback',
        icon: '👑',
        color: 'from-amber-400 to-orange-500',
        unlockedAt: '2026-01-15'
      },
      {
        id: 'b-globe',
        name: 'Globe Trekker',
        description: 'Explored more than 20 countries worldwide',
        icon: '🌍',
        color: 'from-teal-400 to-emerald-500',
        unlockedAt: '2025-11-20'
      },
      {
        id: 'b-culture',
        name: 'Culture Connoisseur',
        description: 'Visited 50+ UNESCO world heritage sites',
        icon: '🏛️',
        color: 'from-purple-400 to-indigo-500',
        unlockedAt: '2026-02-01'
      }
    ]
  },
  'user-alex': {
    id: 'user-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@globetrotter.io',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'Adventure Seeker & Backpacker',
    bio: 'Mountain lover, scuba diver & street food hunter. Always ready to pack a bag and join spontaneous trips.',
    homeCity: 'Barcelona, Spain',
    level: 4,
    xp: 2600,
    countriesVisited: 14,
    tripsCompleted: 7,
    travelStreakDays: 9,
    travelStyleTags: ['Adventure', 'Hiking', 'Scuba Diving', 'Budget Backpacker'],
    badges: [
      {
        id: 'b-trail',
        name: 'Trailblazer',
        description: 'Completed 5 multi-day alpine treks',
        icon: '⛰️',
        color: 'from-cyan-400 to-blue-500',
        unlockedAt: '2025-09-10'
      },
      {
        id: 'b-joiner',
        name: 'Co-Pilot Extraordinaire',
        description: 'Top-voted co-traveler in 5 group expeditions',
        icon: '🤝',
        color: 'from-rose-400 to-pink-500',
        unlockedAt: '2026-01-28'
      }
    ]
  },
  'user-elena': {
    id: 'user-elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@globetrotter.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'Luxury & Wellness Explorer',
    bio: 'Yoga instructor and wellness retreat curator. Searching for serene spots, culinary art, and scenic views.',
    homeCity: 'London, UK',
    level: 5,
    xp: 3200,
    countriesVisited: 18,
    tripsCompleted: 9,
    travelStreakDays: 14,
    travelStyleTags: ['Wellness', 'Luxury', 'Culinary', 'Eco-Tourism'],
    badges: [
      {
        id: 'b-spa',
        name: 'Serenity Seeker',
        description: 'Visited 15 world-class thermal and wellness retreats',
        icon: '✨',
        color: 'from-emerald-400 to-teal-500',
        unlockedAt: '2025-12-05'
      }
    ]
  },
  'user-admin': {
    id: 'user-admin',
    name: 'Marcus Vance (Admin)',
    email: 'admin@globetrotter.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'GlobeTrotter Platform Admin',
    bio: 'Platform safety, community moderation, and global analytics manager.',
    homeCity: 'Berlin, Germany',
    level: 10,
    xp: 9999,
    countriesVisited: 45,
    tripsCompleted: 30,
    travelStreakDays: 45,
    isAdmin: true,
    travelStyleTags: ['Community', 'Safety', 'Global Ops'],
    badges: [
      {
        id: 'b-admin',
        name: 'Platform Guardian',
        description: 'Official GlobeTrotter Community Master',
        icon: '🛡️',
        color: 'from-violet-500 to-purple-700',
        unlockedAt: '2024-01-01'
      }
    ]
  }
};
