import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosClient from "../config/axiosClient";
import { queryKeys } from "../query/queryKeys";

// Types
interface User {
  id: string;
  username: string;
  email: string;
  // Thêm các field khác theo backend
}

interface AuthResponse {
  access_token: string;
  refreshToken: string;
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// GET: Lấy thông tin user hiện tại
export const useGetMe = () => {
  return useQuery<User, AxiosError>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const { data } = await axiosClient.get("/auth/me");
      return data;
    },
    // Chỉ fetch khi đã có token
    enabled: !!localStorage.getItem("access_token"),
  });
};

// POST: Login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError, LoginRequest>({
    mutationFn: async (credentials) => {
      const { data } = await axiosClient.post("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      // Cache user data sau khi login
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

// POST: Register
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError, RegisterRequest>({
    mutationFn: async (userData) => {
      const { data } = await axiosClient.post("/auth/register", userData);
      return data;
    },
    onSuccess: (data) => {
      // Cache user data sau khi register
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

// POST: Logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      await axiosClient.post("/auth/logout");
    },
    onSuccess: () => {
      // Clear tất cả cache khi logout
      queryClient.clear();
    },
  });
};
