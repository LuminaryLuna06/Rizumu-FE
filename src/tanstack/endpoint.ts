/**
 * Authentication Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  PROFILE: "/auth/profile",
} as const;

/**
 * User Endpoints
 */
export const PROFILE_ENDPOINTS = {
  PROFILE_BY_ID: (id: string) => `/auth/profile/${id}`,
  AVATAR: "/auth/avatar",
  SEARCH: (query: string) => `/auth/search?q=${query}`,
} as const;

/**
 * Pomodoro Session Endpoints
 */
export const POMODORO_ENDPOINTS = {
  SESSIONS: "/pomodoro/sessions",
  SESSION_BY_ID: (id: string | number) => `/pomodoro/sessions/${id}`,
  STATS: "/pomodoro/stats",
  HISTORY: "/pomodoro/history",
} as const;

/**
 * Room Endpoints
 */
export const ROOM_ENDPOINTS = {
  BASE: "/rooms",
  BY_ID: (id: string | number) => `/rooms/${id}`,
  JOIN: (id: string | number) => `/rooms/${id}/join`,
  LEAVE: (id: string | number) => `/rooms/${id}/leave`,
  MESSAGES: (id: string | number) => `/rooms/${id}/messages`,
} as const;

/**
 * Tag Endpoints
 */
export const TAG_ENDPOINTS = {
  BASE: "/tags",
  BY_ID: (id: string | number) => `/tags/${id}`,
} as const;

/**
 * Friend Endpoints
 */
export const FRIEND_ENDPOINTS = {
  BASE: "/friends",
  REQUESTS: "/friends/requests",
  REQUEST_BY_ID: (id: string | number) => `/friends/requests/${id}`,
  BY_ID: (id: string | number) => `/friends/${id}`,
} as const;

/**
 * Progress Endpoints
 */
export const PROGRESS_ENDPOINTS = {
  STATS: "/progress",
  DAILY: "/progress/daily",
  WEEKLY: "/progress/weekly",
  MONTHLY: "/progress/monthly",
} as const;

/**
 * Health Check Endpoints
 */
export const HEALTH_ENDPOINTS = {
  PING: "/health",
} as const;

export const API_URLS = {
  AUTH: AUTH_ENDPOINTS,
  PROFILE: PROFILE_ENDPOINTS,
  POMODORO: POMODORO_ENDPOINTS,
  ROOM: ROOM_ENDPOINTS,
  TAG: TAG_ENDPOINTS,
  FRIEND: FRIEND_ENDPOINTS,
  PROGRESS: PROGRESS_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINTS,
} as const;

export default API_URLS;
