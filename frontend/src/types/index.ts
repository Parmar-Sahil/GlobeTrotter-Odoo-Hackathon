// Core API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[] | Record<string, string[]>;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// User & Auth
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  city?: string | null;
  country?: string | null;
  preferredLanguage?: string;
  currency?: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Destination & City
export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  imageUrl: string;
  bannerUrl?: string;
  costIndex?: number; // 1 to 5 ($ to $$$$$)
  popularity?: number;
  rating?: number;
  visitCount?: number;
  isPopular?: boolean;
}

// Activity
export type ActivityCategory =
  | "SIGHTSEEING"
  | "ADVENTURE"
  | "FOOD_DRINK"
  | "CULTURE"
  | "RELAXATION"
  | "NIGHTLIFE"
  | "SHOPPING"
  | "OTHER";

export interface Activity {
  id: string;
  destinationId?: string;
  destination?: Destination;
  title: string;
  description: string;
  category: ActivityCategory;
  estimatedCost: number;
  currency?: string;
  durationMinutes: number;
  imageUrl: string;
  rating?: number;
  location?: string;
}

// Itinerary Item & Section (Stop)
export interface ItineraryItem {
  id: string;
  sectionId: string;
  activityId?: string | null;
  activity?: Activity | null;
  title: string;
  description?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  durationMinutes?: number;
  cost: number;
  order: number;
  category?: ActivityCategory;
  notes?: string | null;
}

export interface ItinerarySection {
  id: string;
  tripId: string;
  destinationId?: string | null;
  destination?: Destination | null;
  title: string;
  date?: string | null;
  arrivalDate?: string | null;
  departureDate?: string | null;
  order: number;
  items: ItineraryItem[];
}

// Trip
export type TripStatus = "PLANNING" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type TripVisibility = "PUBLIC" | "PRIVATE" | "FRIENDS";

export interface Trip {
  id: string;
  userId?: string;
  user?: User;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  startDate: string;
  endDate: string;
  budgetLimit?: number | null;
  currency?: string;
  status: TripStatus;
  visibility?: TripVisibility;
  shareToken?: string | null;
  sections?: ItinerarySection[];
  destinationCount?: number;
  totalEstimatedCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Budget Breakdown
export interface BudgetCategory {
  name: "Transport" | "Accommodation" | "Activities" | "Meals" | "Other";
  amount: number;
  percentage: number;
  color: string;
}

export interface BudgetSummary {
  totalEstimatedCost: number;
  budgetLimit: number;
  remainingAmount: number;
  percentageUsed: number;
  isOverBudget: boolean;
  categories: BudgetCategory[];
  dailyAverage: number;
  tripDaysCount: number;
}
