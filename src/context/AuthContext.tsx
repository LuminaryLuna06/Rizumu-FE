import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { ModelUserProfile } from "@rizumu/models/userProfile";
import {
  clearAuthTokens,
  updateAccessToken,
} from "@rizumu/utils/cookieManager";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import { signInWithGoogle } from "@rizumu/config/firebase";

interface AuthContextType {
  user: ModelUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpened: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const queryClient = useQueryClient();

  const openAuthModal = () => setAuthModalOpened(true);
  const closeAuthModal = () => setAuthModalOpened(false);

  useEffect(() => {
    const handleOpenAuthModal = () => {
      setAuthModalOpened(true);
    };

    window.addEventListener("open-auth-modal", handleOpenAuthModal);
    return () =>
      window.removeEventListener("open-auth-modal", handleOpenAuthModal);
  }, []);

  const { data: user, isLoading } = useQuery<ModelUserProfile>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const response = await axiosClient.get("/auth/profile");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await axiosClient.post("/auth/login", {
        username,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { access_token, data: userData } = data;
      updateAccessToken(access_token);

      queryClient.setQueryData(queryKeys.auth.me(), userData);
      closeAuthModal();
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await axiosClient.post("/auth/register", {
        username,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { access_token, data: userData } = data;
      updateAccessToken(access_token);

      queryClient.setQueryData(queryKeys.auth.me(), userData);
      closeAuthModal();
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (payload: {
      email: string;
      name?: string;
      avatar?: string;
      googleId?: string;
      idToken?: string;
    }) => {
      const response = await axiosClient.post("/auth/google", payload);
      return response.data;
    },
    onSuccess: (data) => {
      const { access_token, data: userData } = data;
      updateAccessToken(access_token);

      queryClient.setQueryData(queryKeys.auth.me(), userData);
      closeAuthModal();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      const response = await axiosClient.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.post("/auth/logout");
    },
    onSuccess: () => {
      clearAuthTokens();
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout API error:", error);
      clearAuthTokens();
      queryClient.clear();
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const register = async (username: string, password: string) => {
    await registerMutation.mutateAsync({ username, password });
  };

  const loginWithGoogle = async () => {
    const { user: googleUser, idToken } = await signInWithGoogle();
    if (!googleUser.email) {
      throw new Error("No email found from Google account");
    }

    await googleLoginMutation.mutateAsync({
      email: googleUser.email,
      name: googleUser.displayName || "",
      avatar: googleUser.photoURL || "",
      googleId: googleUser.uid,
      idToken,
    });
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    await changePasswordMutation.mutateAsync({ oldPassword, newPassword });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const refreshUser = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.auth.me(),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
        isLoading,
        authModalOpened,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        changePassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
