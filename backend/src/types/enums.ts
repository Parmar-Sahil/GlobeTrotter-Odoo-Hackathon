export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum TripStatus {
  DRAFT = 'draft',
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum TripVisibility {
  PRIVATE = 'private',
  FRIENDS = 'friends',
  PUBLIC = 'public',
  UNLISTED = 'unlisted',
}

export enum ItineraryItemType {
  ACTIVITY = 'activity',
  TRANSPORT = 'transport',
  ACCOMMODATION = 'accommodation',
  MEAL = 'meal',
  OTHER = 'other',
}

export enum ShareMode {
  PUBLIC_LINK = 'public_link',
  FRIEND = 'friend',
}

export enum SearchType {
  CITY = 'city',
  ACTIVITY = 'activity',
  COMMUNITY = 'community',
  TRIP = 'trip',
}

export enum PostStatus {
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
  FLAGGED = 'flagged',
  DELETED = 'deleted',
}

// Aliases for backwards compatibility
export { UserRole as Role };
export { ItineraryItemType as ActivityCategory };
