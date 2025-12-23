export const queryKeys = {
  // Auth keys
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  // Profile keys
  profile: {
    all: ["profile"] as const,
    byId: (id: string) => [...queryKeys.profile.all, "byId", id] as const,
    search: (query: string) =>
      [...queryKeys.profile.all, "search", query] as const,
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
    byId: (id: string) => [...queryKeys.rooms.all, "byId", id] as const,
    bySlug: (slug: string) => [...queryKeys.rooms.all, "bySlug", slug] as const,
    members: (id: string) => [...queryKeys.rooms.all, "members", id] as const,
    public: () => [...queryKeys.rooms.all, "public"] as const,
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
    hourly: (startTime: string, endTime: string, userId: string) =>
      [
        ...queryKeys.sessions.all,
        "hourly",
        startTime,
        endTime,
        userId,
      ] as const,
    daily: (startTime: string, endTime: string, userId: string) =>
      [...queryKeys.sessions.all, "daily", startTime, endTime, userId] as const,
    heatmap: (startTime: string, endTime: string, userId: string) =>
      [
        ...queryKeys.sessions.all,
        "heatmap",
        startTime,
        endTime,
        userId,
      ] as const,
    leaderboard: (startTime: string, endTime: string) =>
      [...queryKeys.sessions.all, "leaderboard", startTime, endTime] as const,
    leaderboardFriend: (startTime: string, endTime: string) =>
      [
        ...queryKeys.sessions.all,
        "leaderboard-friend",
        startTime,
        endTime,
      ] as const,
  },

  // Progress keys
  progress: {
    all: ["progress"] as const,
    stats: () => [...queryKeys.progress.all, "stats"] as const,
    statsById: (id: string) =>
      [...queryKeys.progress.all, "stats", id] as const,
    streak: () => [...queryKeys.progress.all, "streak"] as const,
    progressById: (id: string) =>
      [...queryKeys.progress.all, "progress", id] as const,
    gifts: () => [...queryKeys.progress.all, "gifts"] as const,
    giftById: (id: string) => [...queryKeys.progress.all, "gifts", id] as const,
  },

  // Friends keys
  friends: {
    all: ["friends"] as const,
    list: () => [...queryKeys.friends.all, "list"] as const,
    requests: () => [...queryKeys.friends.all, "requests"] as const,
  },
} as const;
