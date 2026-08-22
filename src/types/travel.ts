export type TripVisibility = 'private' | 'friends' | 'public_view' | 'open_to_join';

export type UserRole = 'host' | 'co_traveler' | 'pending';

export type ActivityCategory = 
  | 'stay' 
  | 'transport' 
  | 'food' 
  | 'sightseeing' 
  | 'adventure' 
  | 'relaxation' 
  | 'nightlife'
  | 'culture'
  | 'nature';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  roleTitle: string;
  bio: string;
  homeCity: string;
  level: number;
  xp: number;
  countriesVisited: number;
  tripsCompleted: number;
  travelStreakDays: number;
  badges: Badge[];
  travelStyleTags: string[];
  isAdmin?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: string;
}

export interface TripMember {
  userId: string;
  role: 'host' | 'co_traveler';
  joinedAt: string;
  name: string;
  avatar: string;
}

export interface JoinRequest {
  id: string;
  tripId: string;
  tripTitle: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBio: string;
  userTags: string[];
  note: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

export interface ActivityVote {
  userId: string;
  userName: string;
  userAvatar: string;
  vote: 'up' | 'down';
}

export interface ItineraryActivity {
  id: string;
  day: number;
  timeSlot: string; // e.g. "09:00 AM" or "Morning"
  title: string;
  location: string;
  description: string;
  category: ActivityCategory;
  estimatedCost: number;
  durationHours: number;
  isProposal?: boolean;
  proposedBy?: {
    userId: string;
    userName: string;
    userAvatar: string;
  };
  votes?: ActivityVote[];
  status?: 'accepted' | 'proposed' | 'declined';
  globiTip?: string;
  image?: string;
  booked?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  city: string;
  highlights: string;
  weatherForecast?: {
    tempC: number;
    condition: string;
    icon: string;
  };
  activities: ItineraryActivity[];
}

export interface ExpenseSplit {
  userId: string;
  userName: string;
  userAvatar: string;
  amountOwed: number;
  settled: boolean;
}

export interface TripExpense {
  id: string;
  tripId: string;
  title: string;
  category: 'stay' | 'transport' | 'food' | 'activities' | 'misc';
  totalAmount: number;
  currency: string;
  paidByUserId: string;
  paidByUserName: string;
  paidByUserAvatar: string;
  date: string;
  splits: ExpenseSplit[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // userIds
}

export interface Poll {
  id: string;
  question: string;
  createdBy: string;
  creatorName: string;
  options: PollOption[];
  closed?: boolean;
}

export interface ChatMessage {
  id: string;
  tripId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  isHost?: boolean;
  isGlobi?: boolean;
  body: string;
  createdAt: string;
  poll?: Poll;
  expenseId?: string;
  attachmentType?: 'itinerary_pin' | 'poll' | 'expense';
}

export interface GlobiSmartTip {
  id: string;
  type: 'nudge' | 'suggestion' | 'budget_alert' | 'celebration';
  title: string;
  message: string;
  actionLabel?: string;
  actionPayload?: any;
  targetTripId?: string;
  dismissed?: boolean;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  description: string;
  visibility: TripVisibility;
  maxSpots?: number;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostBio?: string;
  tags: string[];
  totalBudget: number;
  spentBudget: number;
  currency: string;
  members: TripMember[];
  days: ItineraryDay[];
  expenses: TripExpense[];
  messages: ChatMessage[];
  joinRequests: JoinRequest[];
  likesCount: number;
  clonedCount: number;
  isCloned?: boolean;
  clonedFromTripId?: string;
}

export interface NotificationItem {
  id: string;
  type: 'join_request' | 'join_approved' | 'globi_tip' | 'chat_message' | 'budget_alert' | 'activity_vote';
  title: string;
  message: string;
  time: string;
  read: boolean;
  tripId?: string;
  joinRequestId?: string;
  actionRequired?: boolean;
  senderAvatar?: string;
}

export interface DestinationCatalogItem {
  id: string;
  city: string;
  country: string;
  region: string;
  coverImage: string;
  tagline: string;
  description: string;
  matchTags: string[];
  avgBudgetDaily: number;
  bestTimeToVisit: string;
  rating: number;
  featuredActivities: {
    title: string;
    category: ActivityCategory;
    cost: number;
    duration: string;
  }[];
}
