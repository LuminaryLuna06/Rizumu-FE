// API Endpoint Configuration
// Quản lý tập trung các đường dẫn API và headers

/**
 * Headers Configuration
 */
export const HEADERS = {
  DEFAULT_HEADER: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  header: () => ({
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  }),
  jsonHeader: () => ({
    "Content-Type": "application/json; charset=UTF-8",
  }),
  fileHeader: () => ({
    "Content-Type": "multipart/form-data",
  }),
  tokenHeader: () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    };
  },
};

/**
 * API URLs Configuration
 */
export const API_URLS = {
  AUTH: {
    login: () => ({
      url: "/auth/login",
      method: "POST",
      headers: HEADERS.DEFAULT_HEADER,
    }),
    register: () => ({
      url: "/auth/register",
      method: "POST",
      headers: HEADERS.DEFAULT_HEADER,
    }),
    logout: () => ({
      url: "/auth/logout",
      method: "POST",
      headers: HEADERS.tokenHeader(),
    }),
    refresh: () => ({
      url: "/auth/refresh",
      method: "POST",
      headers: HEADERS.DEFAULT_HEADER,
    }),
    profile: () => ({
      url: "/auth/profile",
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    updateProfile: () => ({
      url: "/auth/profile",
      method: "PUT",
      headers: HEADERS.tokenHeader(),
    }),
  },

  USER: {
    getAll: () => ({
      url: "/users",
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    getById: (id: string | number) => ({
      url: `/users/${id}`,
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    create: () => ({
      url: "/users",
      method: "POST",
      headers: HEADERS.tokenHeader(),
    }),
    update: (id: string | number) => ({
      url: `/users/${id}`,
      method: "PUT",
      headers: HEADERS.tokenHeader(),
    }),
    delete: (id: string | number) => ({
      url: `/users/${id}`,
      method: "DELETE",
      headers: HEADERS.tokenHeader(),
    }),
    uploadAvatar: () => ({
      url: "/users/avatar",
      method: "POST",
      headers: HEADERS.fileHeader(),
    }),
  },

  POMODORO: {
    getAll: () => ({
      url: "/pomodoro/sessions",
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    getById: (id: string | number) => ({
      url: `/pomodoro/sessions/${id}`,
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    create: () => ({
      url: "/pomodoro/sessions",
      method: "POST",
      headers: HEADERS.tokenHeader(),
    }),
    update: (id: string | number) => ({
      url: `/pomodoro/sessions/${id}`,
      method: "PUT",
      headers: HEADERS.tokenHeader(),
    }),
    delete: (id: string | number) => ({
      url: `/pomodoro/sessions/${id}`,
      method: "DELETE",
      headers: HEADERS.tokenHeader(),
    }),
    getStats: () => ({
      url: "/pomodoro/stats",
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    getHistory: () => ({
      url: "/pomodoro/history",
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
  },

  ROOM: {
    getAll: () => ({
      url: "/rooms",
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    getById: (id: string | number) => ({
      url: `/rooms/${id}`,
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    create: () => ({
      url: "/rooms",
      method: "POST",
      headers: HEADERS.tokenHeader(),
    }),
    update: (id: string | number) => ({
      url: `/rooms/${id}`,
      method: "PUT",
      headers: HEADERS.tokenHeader(),
    }),
    delete: (id: string | number) => ({
      url: `/rooms/${id}`,
      method: "DELETE",
      headers: HEADERS.tokenHeader(),
    }),
    join: (id: string | number) => ({
      url: `/rooms/${id}/join`,
      method: "POST",
      headers: HEADERS.tokenHeader(),
    }),
    leave: (id: string | number) => ({
      url: `/rooms/${id}/leave`,
      method: "POST",
      headers: HEADERS.tokenHeader(),
    }),
    getMessages: (id: string | number) => ({
      url: `/rooms/${id}/messages`,
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    sendMessage: (id: string | number) => ({
      url: `/rooms/${id}/messages`,
      method: "POST",
      headers: HEADERS.tokenHeader(),
    }),
  },

  SETTINGS: {
    get: () => ({
      url: "/settings",
      method: "GET",
      headers: HEADERS.tokenHeader(),
    }),
    update: () => ({
      url: "/settings",
      method: "PUT",
      headers: HEADERS.tokenHeader(),
    }),
    reset: () => ({
      url: "/settings/reset",
      method: "POST",
      headers: HEADERS.tokenHeader(),
    }),
  },

  UPLOAD: {
    image: () => ({
      url: "/upload/image",
      method: "POST",
      headers: HEADERS.fileHeader(),
    }),
    file: () => ({
      url: "/upload/file",
      method: "POST",
      headers: HEADERS.fileHeader(),
    }),
    avatar: () => ({
      url: "/upload/avatar",
      method: "POST",
      headers: HEADERS.fileHeader(),
    }),
  },

  HEALTH: {
    ping: () => ({
      url: "/health",
      method: "GET",
      headers: HEADERS.DEFAULT_HEADER,
    }),
  },
};

export default API_URLS;
