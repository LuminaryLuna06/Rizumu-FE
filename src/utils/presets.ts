import { DEFAULT_PRESETS, type Preset } from "@rizumu/constants/timer";

export const initializePresets = () => {
  try {
    const localPresets = localStorage.getItem("pomodoro_presets");
    if (!localPresets) {
      localStorage.setItem("pomodoro_presets", JSON.stringify(DEFAULT_PRESETS));
    }
  } catch (error) {
    console.error("Failed to initialize presets:", error);
    localStorage.setItem("pomodoro_presets", JSON.stringify(DEFAULT_PRESETS));
  }
};

export const getPresets = (): Preset[] => {
  try {
    const stored = localStorage.getItem("pomodoro_presets");
    return stored ? JSON.parse(stored) : DEFAULT_PRESETS;
  } catch (error) {
    console.error("Failed to load presets:", error);
    return DEFAULT_PRESETS;
  }
};
export const getCurrentPresetId = (): number => {
  try {
    const stored = localStorage.getItem("current_preset_id");
    return stored ? Number(stored) : 0;
  } catch {
    return 0;
  }
};
export const saveCurrentPresetId = (id: number) => {
  localStorage.setItem("current_preset_id", String(id));
};
