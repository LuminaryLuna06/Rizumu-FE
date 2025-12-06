import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axiosClient from "@rizumu/api/config/axiosClient";
import type { ModelUserProfile } from "@rizumu/models/userProfile";

interface AuthContextType {
  user: ModelUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpened: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ModelUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpened, setAuthModalOpened] = useState(false);

  const openAuthModal = () => setAuthModalOpened(true);
  const closeAuthModal = () => setAuthModalOpened(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const response = await axiosClient.get("/auth/profile");
        setUser(response.data.data);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const response: any = await axiosClient.post("/auth/login", {
      username,
      password,
    });

    const { access_token, refresh_token, data } = response.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setUser(data);
  };

  const register = async (username: string, password: string) => {
    const response: any = await axiosClient.post("/auth/register", {
      username,
      password,
    });

    const { access_token, refresh_token, data } = response.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setUser(data);
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const response = await axiosClient.get("/auth/profile");
    setUser(response.data.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authModalOpened,
        openAuthModal,
        closeAuthModal,
        login,
        register,
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
