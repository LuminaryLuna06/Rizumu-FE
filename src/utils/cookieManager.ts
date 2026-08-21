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

export const getUserIdFromToken = (): string | null => {
  try {
    const token = getAccessToken();
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // Decode base64url payload
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return payload?.id || payload?._id || payload?.userId || null;
  } catch {
    return null;
  }
};
