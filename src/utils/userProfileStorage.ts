import type { ModelUserProfile } from "@rizumu/models/userProfile";
import { getUserIdFromToken } from "./cookieManager";

const getProfileStorageKey = (userId: string) => `rizumu_user_profile_${userId}`;

export const saveCachedUserProfile = (user: ModelUserProfile): void => {
  try {
    const userId = user._id || (user as any).id;
    if (userId) {
      localStorage.setItem(getProfileStorageKey(userId), JSON.stringify(user));
      localStorage.setItem("rizumu_last_auth_user_id", userId);
    }
  } catch (e) {
    console.error("Failed to save cached user profile:", e);
  }
};

export const getCachedUserProfile = (): ModelUserProfile | undefined => {
  try {
    const tokenUserId = getUserIdFromToken();
    const userId = tokenUserId || localStorage.getItem("rizumu_last_auth_user_id");
    if (!userId) return undefined;

    const raw = localStorage.getItem(getProfileStorageKey(userId));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && (parsed._id || parsed.id)) {
      return parsed as ModelUserProfile;
    }
    return undefined;
  } catch (e) {
    console.error("Failed to get cached user profile:", e);
    return undefined;
  }
};

export const clearCachedUserProfile = (userId?: string): void => {
  try {
    const targetUserId =
      userId || getUserIdFromToken() || localStorage.getItem("rizumu_last_auth_user_id");
    if (targetUserId) {
      localStorage.removeItem(getProfileStorageKey(targetUserId));
    }
    localStorage.removeItem("rizumu_last_auth_user_id");
  } catch (e) {
    console.error("Failed to clear cached user profile:", e);
  }
};
