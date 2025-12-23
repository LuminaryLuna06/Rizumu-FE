// Query Keys Factory Pattern
// Giúp quản lý và invalidate cache dễ dàng hơn

export const queryKeys = {
  // Auth keys
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  // User keys
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Room keys
  rooms: {
    all: ["rooms"] as const,
    lists: () => [...queryKeys.rooms.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.rooms.lists(), { filters }] as const,
    details: () => [...queryKeys.rooms.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.rooms.details(), id] as const,
  },

  // Tag keys
  tags: {
    all: ["tags"] as const,
    lists: () => [...queryKeys.tags.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.tags.lists(), { filters }] as const,
  },

  // Session keys
  sessions: {
    all: ["sessions"] as const,
    lists: () => [...queryKeys.sessions.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.sessions.lists(), { filters }] as const,
  },

  // Progress keys
  progress: {
    all: ["progress"] as const,
    stats: () => [...queryKeys.progress.all, "stats"] as const,
  },
} as const;
