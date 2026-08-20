import type { TimerMode, TimerDirection, Preset } from "@rizumu/constants/timer";
import type { ActiveTimerState } from "@rizumu/models/timer";
import { DEFAULT_PRESETS } from "@rizumu/constants/timer";
import { getCurrentPresetId } from "@rizumu/utils/presets";

export const ACTIVE_TIMER_STORAGE_KEY = "rizumu_active_timer_state";

export const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safeSeconds / 3600);
  const m = Math.floor((safeSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (safeSeconds % 60).toString().padStart(2, "0");
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m}:${s}`;
  }
  return `${m}:${s}`;
};

export const getPresetTargetDuration = (
  mode: TimerMode,
  presetId: number,
  presets: Preset[]
): number => {
  if (mode === "stopwatch") return 0;
  const currentPreset = presets.find((p) => p.id === presetId) || presets[0];
  const minutes = currentPreset?.durations?.[mode] ?? DEFAULT_PRESETS[0]?.durations?.[mode] ?? 25;
  return Math.round(minutes * 60);
};

export const getInitialActiveTimerState = (
  presets: Preset[] = DEFAULT_PRESETS,
  presetId: number = getCurrentPresetId(),
  direction: TimerDirection = "countdown"
): ActiveTimerState => {
  const targetDuration = getPresetTargetDuration("pomodoro", presetId, presets);
  return {
    mode: "pomodoro",
    status: "idle",
    direction,
    targetDuration,
    startedAt: "",
    lastResumedAt: null,
    accumulatedSeconds: 0,
    expectedEndTime: null,
    tagId: "",
    pomodoroCount: 0,
  };
};

export const loadActiveTimerState = (): ActiveTimerState | null => {
  try {
    const raw = localStorage.getItem(ACTIVE_TIMER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.mode === "string" && typeof parsed.status === "string") {
      return parsed as ActiveTimerState;
    }
  } catch (error) {
    console.error("Failed to load active timer state:", error);
  }
  return null;
};

export const saveActiveTimerState = (state: ActiveTimerState | null): void => {
  try {
    if (!state) {
      localStorage.removeItem(ACTIVE_TIMER_STORAGE_KEY);
    } else {
      localStorage.setItem(ACTIVE_TIMER_STORAGE_KEY, JSON.stringify(state));
    }
  } catch (error) {
    console.error("Failed to save active timer state:", error);
  }
};

/**
 * Calculates the total elapsed seconds of the session so far.
 */
export const calculateElapsedSeconds = (
  state: ActiveTimerState,
  now: number = Date.now()
): number => {
  if (state.status === "running" && state.lastResumedAt !== null) {
    const currentSegmentSeconds = Math.max(
      0,
      Math.floor((now - state.lastResumedAt) / 1000)
    );
    return state.accumulatedSeconds + currentSegmentSeconds;
  }
  return state.accumulatedSeconds;
};

/**
 * Calculates display time based on direction and mode.
 */
export const calculateDisplayTime = (
  state: ActiveTimerState,
  now: number = Date.now()
): number => {
  const elapsed = calculateElapsedSeconds(state, now);
  if (state.mode === "stopwatch") {
    return elapsed;
  }
  if (state.direction === "countup") {
    return Math.min(state.targetDuration, elapsed);
  }
  return Math.max(0, state.targetDuration - elapsed);
};

/**
 * Checks if the timer session has completed its target duration.
 */
export const isSessionFinished = (
  state: ActiveTimerState,
  now: number = Date.now()
): boolean => {
  if (state.mode === "stopwatch") return false;
  if (state.targetDuration <= 0) return false;
  
  if (state.expectedEndTime !== null && now >= state.expectedEndTime) {
    return true;
  }
  return calculateElapsedSeconds(state, now) >= state.targetDuration;
};
