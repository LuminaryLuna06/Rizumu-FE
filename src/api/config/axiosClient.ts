import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 25000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      { refresh_token: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { access_token } = response.data;

    if (!access_token) {
      throw new Error("No access token in response");
    }

    localStorage.setItem("access_token", access_token);
    return access_token;
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.dispatchEvent(new CustomEvent("open-auth-modal"));

    throw error;
  }
};

// --- Interceptor cho Request (Gửi đi) ---
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interceptor cho Response (Nhận về) ---
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response) {
      if (
        (error.response.status === 401 || error.response.status === 403) &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);

          return axiosClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      switch (error.response.status) {
        // case 403:
        //   console.error("Lỗi 403: Forbidden");
        //   window.dispatchEvent(new CustomEvent("open-auth-modal"));
        //   break;
        case 404:
          console.error("Lỗi 404: Page not found");
          break;
        case 500:
          console.error("Lỗi 500: Server Error");
          break;
        default:
          console.error("Lỗi khác:", error.message);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
