import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Lấy từ biến môi trường
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout sau 10s
});

// --- Interceptor cho Request (Gửi đi) ---
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage (hoặc nơi bạn lưu trữ)
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
    // Chỉ lấy phần data trả về để code gọn hơn
    // Thay vì gọi response.data.data thì chỉ cần gọi response.data
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung (Global Error Handling)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token hết hạn -> Xóa token và redirect về trang login
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