import Cookies from "js-cookie";

/**
 * Cookie Manager Utility
 *
 * Quản lý authentication tokens thông qua cookies.
 * File này đã được chuẩn bị sẵn để migrate từ localStorage sang cookies.
 *
 * Sử dụng khi sẵn sàng chuyển đổi:
 * - Import các functions từ file này
 * - Thay thế localStorage.getItem/setItem/removeItem bằng các functions tương ứng
 */

// Cookie keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refreshToken";

interface CookieOptions {
  expires?: number; // days
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
}

/**
 * Lưu access token và refresh token vào cookies
 * @param accessToken - Access token từ API
 * @param refreshToken - Refresh token từ API
 */
export const setAuthTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  const accessTokenOptions: CookieOptions = {
    expires: 15 / (24 * 60), // 15 minutes
    secure: true, // Bắt buộc HTTPS để sử dụng sameSite: "none"
    sameSite: "none", // Cho phép gửi cookie cross-origin
    path: "/",
  };

  const refreshTokenOptions: CookieOptions = {
    expires: 7, // 7 days
    secure: true, // Bắt buộc HTTPS để sử dụng sameSite: "none"
    sameSite: "none", // Cho phép gửi cookie cross-origin
    path: "/",
  };

  Cookies.set(ACCESS_TOKEN_KEY, accessToken, accessTokenOptions);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, refreshTokenOptions);
};

/**
 * Lấy access token từ cookies
 * @returns Access token hoặc undefined nếu không tồn tại
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

/**
 * Lấy refresh token từ cookies
 * @returns Refresh token hoặc undefined nếu không tồn tại
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

/**
 * Cập nhật chỉ access token
 * @param accessToken - Access token mới
 */
export const updateAccessToken = (accessToken: string): void => {
  const options: CookieOptions = {
    expires: 15 / (24 * 60), // 15 minutes
    secure: true, // Bắt buộc HTTPS để sử dụng sameSite: "none"
    sameSite: "none", // Cho phép gửi cookie cross-origin
    path: "/",
  };

  Cookies.set(ACCESS_TOKEN_KEY, accessToken, options);
};

/**
 * Xóa tất cả authentication cookies
 */
export const clearAuthTokens = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
};

/**
 * Kiểm tra xem user đã authenticated chưa (có access token)
 * @returns true nếu có access token
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Export cookie keys để có thể sử dụng ở nơi khác nếu cần
export const COOKIE_KEYS = {
  ACCESS_TOKEN: ACCESS_TOKEN_KEY,
  REFRESH_TOKEN: REFRESH_TOKEN_KEY,
} as const;
