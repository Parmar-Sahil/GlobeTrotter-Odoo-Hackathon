export const APP_NAME = "GlobeTrotter";
export const APP_DESCRIPTION = "Personalized Travel Planning Application";

export const API_ENDPOINTS = {
  HEALTH: "/health",
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  TRIPS: {
    BASE: "/trips",
    BY_ID: (id: string) => `/trips/${id}`,
  },
  CITIES: {
    BASE: "/cities",
    SEARCH: "/cities/search",
  },
  ACTIVITIES: {
    BASE: "/activities",
    SEARCH: "/activities/search",
  },
  SHARING: {
    BY_TOKEN: (token: string) => `/sharing/${token}`,
  },
} as const;
