import { DEFAULT_PRESETS, type Preset } from "@rizumu/constants/timer";

export const getPresetsStorageKey = (userId?: string): string => {
  return userId ? `pomodoro_presets_${userId}` : "pomodoro_presets";
};

export const getCurrentPresetIdStorageKey = (userId?: string): string => {
  return userId ? `current_preset_id_${userId}` : "current_preset_id";
};

export const initializePresets = (userId?: string) => {
  try {
    const key = getPresetsStorageKey(userId);
    const localPresets = localStorage.getItem(key);
    if (!localPresets) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_PRESETS));
    }
  } catch (error) {
    console.error("Failed to initialize presets:", error);
    localStorage.setItem(getPresetsStorageKey(userId), JSON.stringify(DEFAULT_PRESETS));
  }
};

export const getPresets = (userId?: string): Preset[] => {
  try {
    const key = getPresetsStorageKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    const legacy = localStorage.getItem("pomodoro_presets");
    if (legacy) return JSON.parse(legacy);
    return DEFAULT_PRESETS;
  } catch (error) {
    console.error("Failed to load presets:", error);
    return DEFAULT_PRESETS;
  }
};

export const getCurrentPresetId = (userId?: string): number => {
  try {
    const key = getCurrentPresetIdStorageKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) return Number(stored);
    const legacy = localStorage.getItem("current_preset_id");
    return legacy ? Number(legacy) : 0;
  } catch {
    return 0;
  }
};

export const saveCurrentPresetId = (id: number, userId?: string) => {
  try {
    const key = getCurrentPresetIdStorageKey(userId);
    localStorage.setItem(key, String(id));
  } catch (error) {
    console.error("Failed to save current preset id:", error);
  }
};
