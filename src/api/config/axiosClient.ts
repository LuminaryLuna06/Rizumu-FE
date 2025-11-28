import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// --- Interceptor cho Request (Gửi đi) ---
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    
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
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('access_token');
          // window.location.href = '/login'; 
          console.error("Lỗi 401: Unauthorized");
          break;
        case 403:
          console.error("Lỗi 403: Forbidden");
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