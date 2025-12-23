import Cookies from "js-cookie";

// Cookie keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refreshToken";

interface CookieOptions {
  expires?: number; // days
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
}

export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const updateAccessToken = (accessToken: string): void => {
  const options: CookieOptions = {
    expires: 15 / (24 * 60), // 15 minutes
    secure: true,
    sameSite: "none",
    path: "/",
  };

  Cookies.set(ACCESS_TOKEN_KEY, accessToken, options);
};

export const clearAuthTokens = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
};
