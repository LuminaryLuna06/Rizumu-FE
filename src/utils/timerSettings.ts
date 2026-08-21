import type { SoundPresetName } from "./audioPresets";

export interface TimerSettings {
  autoStartBreak: boolean;
  autoStartPomodoro: boolean;
  longBreakInterval: number;
  autoMiniTimer: boolean;
  alarmSound: SoundPresetName;
  alarmVolume: number;
  alarmEnabled: boolean;
}

export const getTimerSettingsKey = (userId?: string): string => {
  return userId ? `rizumu_timer_settings_${userId}` : "rizumu_timer_settings";
};

const DEFAULT_SETTINGS: TimerSettings = {
  autoStartBreak: false,
  autoStartPomodoro: false,
  longBreakInterval: 4,
  autoMiniTimer: false,
  alarmSound: "softBell",
  alarmVolume: 50,
  alarmEnabled: true,
};

/**
 * Get all timer settings from localStorage
 */
export const getTimerSettings = (userId?: string): TimerSettings => {
  try {
    const key = getTimerSettingsKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
    // Fallback to global key if user key is not set yet
    const legacy = localStorage.getItem("rizumu_timer_settings");
    if (legacy) {
      const parsed = JSON.parse(legacy);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error("Failed to load timer settings:", error);
  }
  return DEFAULT_SETTINGS;
};

/**
 * Save all timer settings to localStorage
 */
export const saveTimerSettings = (settings: TimerSettings, userId?: string): void => {
  try {
    const key = getTimerSettingsKey(userId);
    localStorage.setItem(key, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save timer settings:", error);
  }
};

/**
 * Update a single timer setting
 */
export const updateTimerSetting = <K extends keyof TimerSettings>(
  key: K,
  value: TimerSettings[K],
  userId?: string
): void => {
  const settings = getTimerSettings(userId);
  settings[key] = value;
  saveTimerSettings(settings, userId);
};

/**
 * Get a single timer setting
 */
export const getTimerSetting = <K extends keyof TimerSettings>(
  key: K,
  userId?: string
): TimerSettings[K] => {
  const settings = getTimerSettings(userId);
  return settings[key];
};
