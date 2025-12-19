export interface TimerSettings {
  autoStartBreak: boolean;
  autoStartPomodoro: boolean;
  longBreakInterval: number;
  autoMiniTimer: boolean;
}

const TIMER_SETTINGS_KEY = "rizumu_timer_settings";

const DEFAULT_SETTINGS: TimerSettings = {
  autoStartBreak: false,
  autoStartPomodoro: false,
  longBreakInterval: 4,
  autoMiniTimer: false,
};

/**
 * Get all timer settings from localStorage
 */
export const getTimerSettings = (): TimerSettings => {
  try {
    const stored = localStorage.getItem(TIMER_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle missing keys
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
export const saveTimerSettings = (settings: TimerSettings): void => {
  try {
    localStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save timer settings:", error);
  }
};

/**
 * Update a single timer setting
 */
export const updateTimerSetting = <K extends keyof TimerSettings>(
  key: K,
  value: TimerSettings[K]
): void => {
  const settings = getTimerSettings();
  settings[key] = value;
  saveTimerSettings(settings);
};

/**
 * Get a single timer setting
 */
export const getTimerSetting = <K extends keyof TimerSettings>(
  key: K
): TimerSettings[K] => {
  const settings = getTimerSettings();
  return settings[key];
};
