/**
 * Authentication Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/profile", //PATCH
  AVATAR: "/auth/avatar",
} as const;

/**
 * User Endpoints
 */
export const PROFILE_ENDPOINTS = {
  PROFILE_BY_ID: (id: string) => `/auth/profile/${id}`,
  SEARCH: (query: string) => `/auth/search?q=${query}`,
} as const;

/**
 * Pomodoro Session Endpoints
 */
export const SESSION_ENDPOINTS = {
  CREATE_SESSION: "/session",
  PATCH_SESSION: "/session",
  PATCH_NOTE: (id: string) => `/session/${id}/note`,
  PATCH_TAG: (id: string) => `/session/${id}/tag`,

  HOURLY: (startTime: string, endTime: string, userId: string) =>
    `/session/hourly?startTime=${startTime}&endTime=${endTime}&userId=${userId}`,
  DAILY: (startTime: string, endTime: string, userId: string) =>
    `/session/daily?startTime=${startTime}&endTime=${endTime}&userId=${userId}`,
  HEATMAP: (startTime: string, endTime: string, userId: string) =>
    `/session/heatmap?startTime=${startTime}&endTime=${endTime}&user_id=${userId}`,
  LEADERBOARD: (startTime: string, endTime: string) =>
    `/session/leaderboard?startTime=${startTime}&endTime=${endTime}`,
  LEADERBOARD_FRIEND: (startTime: string, endTime: string) =>
    `/session/leaderboard_friend?startTime=${startTime}&endTime=${endTime}`,
} as const;

/**
 * Room Endpoints
 */
export const ROOM_ENDPOINTS = {
  PUBLIC: "/room/public",
  BY_ID: (id: string) => `/room/id/${id}`,
  BY_SLUG: (slug: string) => `/room/slug/${slug}`,
  JOIN: (id: string) => `/room/${id}/join`,
  LEAVE: (id: string) => `/room/${id}/leave`,
  MEMBERS: (id: string) => `/room/${id}/members`,
  UPDATE_ROOM: (id: string) => `/room/${id}`,
  BACKGROUND: (id: string) => `/room/${id}/background`,
  KARATE_KICK: (id: string) => `/room/${id}/kick`,
} as const;

/**
 * Message Endpoints
 */
export const MESSAGE_ENDPOINTS = {
  BY_ROOM: (roomId: string, before?: string) =>
    before ? `/${roomId}/messages?before=${before}` : `/${roomId}/messages`,
} as const;

/**
 * Tag Endpoints
 */
export const TAG_ENDPOINTS = {
  TAGS: "/tags",
  CREATE: "/tags",
  UPDATE: (id: string) => `/tags/${id}`,
  DELETE: (id: string) => `/tags/${id}`,

  // BY_ID: (id: string | number) => `/tags/${id}`,
} as const;

export const TASK_ENDPOINTS = {
  TASKS: "/task",
  CREATE: "/task",
  UPDATE: (id: string) => `/task/${id}`,
  DELETE: (id: string) => `/task/${id}`,
  DELETE_COMPLETED: "/task/completed",
};
/**
 * Friend Endpoints
 */
export const FRIEND_ENDPOINTS = {
  FRIEND: "/friend/list",
  GET_REQUESTS: "/friend/requests/received",
  SEND_REQUEST: "/friend/request", //POST
  ACCEPT: "/friend/accept",
  DELETE: (id: string) => `/friend/${id}`,
} as const;

/**
 * Progress Endpoints
 */
export const PROGRESS_ENDPOINTS = {
  STATS: "/progress/stats",
  STATS_BY_ID: (id: string) => `/progress/stats/${id}`,
  UPDATE_STATS: "/progress/stats", //PATCH
  GIFT: "/progress/gift",
  GIFT_BY_ID: (id: string) => `/progress/gift/${id}`,
  SEND_GIFT: "progress/gift", //POST

  STREAK: "/progress",
  PROGRESS_BY_ID: (id: string) => `/progress/${id}`,
  // DAILY: "/progress/daily",
  // WEEKLY: "/progress/weekly",
  // MONTHLY: "/progress/monthly",
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
  SESSION: SESSION_ENDPOINTS,
  ROOM: ROOM_ENDPOINTS,
  TAG: TAG_ENDPOINTS,
  FRIEND: FRIEND_ENDPOINTS,
  PROGRESS: PROGRESS_ENDPOINTS,
  HEALTH: HEALTH_ENDPOINTS,
} as const;

export default API_URLS;
