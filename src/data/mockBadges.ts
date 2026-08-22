export interface GlobalBadgeInfo {
  id: string;
  name: string;
  category: 'hosting' | 'exploration' | 'community' | 'budget';
  description: string;
  icon: string;
  color: string;
  requirement: string;
}

export const ALL_AVAILABLE_BADGES: GlobalBadgeInfo[] = [
  {
    id: 'b-host',
    name: 'Super Host',
    category: 'hosting',
    description: 'Host 5+ trips with an average rating of 4.9 or higher.',
    icon: '👑',
    color: 'from-amber-400 to-orange-500',
    requirement: 'Host 5 Trips'
  },
  {
    id: 'b-globe',
    name: 'Globe Trekker',
    category: 'exploration',
    description: 'Stamp your passport in over 20 distinct countries.',
    icon: '🌍',
    color: 'from-teal-400 to-emerald-500',
    requirement: '20+ Countries'
  },
  {
    id: 'b-culture',
    name: 'Culture Connoisseur',
    category: 'exploration',
    description: 'Explore historical heritage sights and attend local cultural workshops.',
    icon: '🏛️',
    color: 'from-purple-400 to-indigo-500',
    requirement: '15 Cultural Stops'
  },
  {
    id: 'b-trail',
    name: 'Trailblazer',
    category: 'exploration',
    description: 'Complete high-altitude alpine hikes and scenic trails.',
    icon: '⛰️',
    color: 'from-cyan-400 to-blue-500',
    requirement: '5 Alpine Treks'
  },
  {
    id: 'b-joiner',
    name: 'Co-Pilot Star',
    category: 'community',
    description: 'Collaborate and vote actively on 10+ group itinerary proposals.',
    icon: '🤝',
    color: 'from-rose-400 to-pink-500',
    requirement: '10 Votes & Proposals'
  },
  {
    id: 'b-budget',
    name: 'Budget Maestro',
    category: 'budget',
    description: 'Complete a multi-day trip keeping total expenses strictly under budget.',
    icon: '💰',
    color: 'from-emerald-400 to-teal-500',
    requirement: 'Under Budget Trip'
  },
  {
    id: 'b-photographer',
    name: 'Shutterbug',
    category: 'exploration',
    description: 'Share 25+ scenic photo highlights across your trip itineraries.',
    icon: '📸',
    color: 'from-pink-500 to-rose-600',
    requirement: '25 Highlights'
  },
  {
    id: 'b-early',
    name: 'Sunrise Chaser',
    category: 'exploration',
    description: 'Add and complete 3 early dawn / sunrise activities.',
    icon: '🌅',
    color: 'from-orange-400 to-amber-500',
    requirement: '3 Sunrise Plans'
  }
];

export const PASSPORT_STAMPS = [
  { country: 'Indonesia', code: 'ID', date: '2026-03', city: 'Bali', icon: '🌴', color: '#14b8a6' },
  { country: 'Japan', code: 'JP', date: '2025-11', city: 'Kyoto', icon: '⛩️', color: '#f43f5e' },
  { country: 'Italy', code: 'IT', date: '2025-08', city: 'Amalfi', icon: '🍋', color: '#fb923c' },
  { country: 'Switzerland', code: 'CH', date: '2025-06', city: 'Interlaken', icon: '🏔️', color: '#38bdf8' },
  { country: 'India', code: 'IN', date: '2025-01', city: 'Jaipur', icon: '🦚', color: '#f59e0b' },
  { country: 'Iceland', code: 'IS', date: '2024-10', city: 'Reykjavik', icon: '❄️', color: '#818cf8' },
  { country: 'Vietnam', code: 'VN', date: '2024-04', city: 'Hoi An', icon: '🏮', color: '#ec4899' },
  { country: 'Morocco', code: 'MA', date: '2023-12', city: 'Marrakech', icon: '🕌', color: '#d97706' },
];
