import { useState, useRef, useEffect, useCallback } from "react";
import type { Preset, TimerDirection, TimerMode } from "@rizumu/constants/timer";
import type { ActiveTimerState } from "@rizumu/models/timer";
import type { ModelTag } from "@rizumu/models/tag";
import {
  DEFAULT_PRESETS,
} from "@rizumu/constants/timer";
import {
  getCurrentPresetId,
  initializePresets,
  saveCurrentPresetId,
} from "@rizumu/utils/presets";
import { getTimerSettings } from "@rizumu/utils/timerSettings";
import {
  ACTIVE_TIMER_STORAGE_KEY,
  calculateDisplayTime,
  calculateElapsedSeconds,
  formatTime,
  getInitialActiveTimerState,
  getPresetTargetDuration,
  isSessionFinished,
  loadActiveTimerState,
  saveActiveTimerState,
} from "@rizumu/utils/timerEngine";
import {
  useCreateSession,
  useUpdateSession,
} from "@rizumu/tanstack/api/hooks";
import { useToast } from "@rizumu/utils/toast/toast";

const TIMER_DIRECTION_KEY = "pomodoro_timer_direction";

const getStoredTimerDirection = (): TimerDirection => {
  try {
    const stored = localStorage.getItem(TIMER_DIRECTION_KEY);
    return (stored as TimerDirection) || "countdown";
  } catch {
    return "countdown";
  }
};

const saveStoredTimerDirection = (direction: TimerDirection) => {
  try {
    localStorage.setItem(TIMER_DIRECTION_KEY, direction);
  } catch (error) {
    console.error("Failed to save timer direction:", error);
  }
};

interface UsePomodoroTimerProps {
  user: any;
  selectedTag: ModelTag | null;
  setFocusMode: (mode?: boolean | ((prev: boolean) => boolean)) => void;
  playClickSound: () => void;
  playDing: () => void;
  initAudio: () => void;
}

export function usePomodoroTimer({
  user,
  selectedTag,
  setFocusMode,
  playClickSound,
  playDing,
  initAudio,
}: UsePomodoroTimerProps) {
  const toast = useToast();
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();

  const [presets, setPresets] = useState<Preset[]>(() => {
    try {
      const stored = localStorage.getItem("pomodoro_presets");
      if (stored) return JSON.parse(stored);
    } catch {}
    initializePresets();
    return DEFAULT_PRESETS;
  });

  const [currentPresetId, setCurrentPresetId] = useState<number>(() =>
    getCurrentPresetId()
  );

  const [timerDirection, setTimerDirection] = useState<TimerDirection>(() =>
    getStoredTimerDirection()
  );

  const [timerState, setTimerState] = useState<ActiveTimerState>(() => {
    const loaded = loadActiveTimerState();
    if (loaded) {
      // Khi mở web lại, nếu phiên trước đó vẫn đang ở trạng thái running (do tắt tab), tự động chuyển thành paused
      if (loaded.status === "running") {
        const pausedState: ActiveTimerState = {
          ...loaded,
          status: "paused",
          lastResumedAt: null,
          expectedEndTime: null,
        };
        saveActiveTimerState(pausedState);
        return pausedState;
      }
      return loaded;
    }
    const initialPresetId = getCurrentPresetId();
    const direction = getStoredTimerDirection();
    return getInitialActiveTimerState(DEFAULT_PRESETS, initialPresetId, direction);
  });

  const [displayTime, setDisplayTime] = useState<number>(() => {
    return calculateDisplayTime(timerState, Date.now());
  });

  const stateRef = useRef<ActiveTimerState>(timerState);
  useEffect(() => {
    stateRef.current = timerState;
    saveActiveTimerState(timerState);
  }, [timerState]);

  const presetsRef = useRef<Preset[]>(presets);
  useEffect(() => {
    presetsRef.current = presets;
  }, [presets]);

  const currentPresetIdRef = useRef<number>(currentPresetId);
  useEffect(() => {
    currentPresetIdRef.current = currentPresetId;
  }, [currentPresetId]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Save direction
  useEffect(() => {
    saveStoredTimerDirection(timerDirection);
    setTimerState((prev) => {
      if (prev.direction === timerDirection) return prev;
      const next = { ...prev, direction: timerDirection };
      setDisplayTime(calculateDisplayTime(next, Date.now()));
      return next;
    });
  }, [timerDirection]);

  // Handle Session Completion
  const handleSessionComplete = useCallback(
    (currentState: ActiveTimerState) => {
      clearTimerInterval();
      initAudio();
      playDing();
      setFocusMode(false);

      const now = Date.now();
      const endedAt = new Date(now).toISOString();
      const finalDuration = currentState.targetDuration;

      // Update backend if Pomodoro
      if (currentState.mode === "pomodoro") {
        updateSession.mutate(
          {
            session_id: currentState.sessionId,
            completed: true,
            duration: finalDuration,
            ended_at: endedAt,
          },
          {
            onSuccess: (data: any) => {
              const earnedXp = data?.rewards?.earnedXp ?? Math.floor(finalDuration / 60);
              const earnedCoins = data?.rewards?.earnedCoins ?? 0;
              if (earnedXp > 0 || earnedCoins > 0) {
                toast.info(
                  `You gained ${earnedXp} xp${earnedCoins > 0 ? ` and ${earnedCoins} coins` : ""}.`,
                  "Let's fucking gooooo!"
                );
              }
              if (data?.meta?.isDailyLimitReached) {
                toast.info(
                  "Bạn đã đạt giới hạn học tập tối đa 16 tiếng hôm nay rồi. Hãy nghỉ ngơi nhé!",
                  "Giới hạn hàng ngày"
                );
              }
            },
            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || "Failed to end session",
                "Error"
              );
            },
          }
        );
      }

      // Mode switching
      const settings = getTimerSettings();
      let nextMode: TimerMode;
      let nextPomodoroCount = currentState.pomodoroCount;

      if (currentState.mode === "pomodoro") {
        const newCount = currentState.pomodoroCount + 1;
        if (newCount >= settings.longBreakInterval) {
          nextMode = "long_break";
          nextPomodoroCount = 0;
        } else {
          nextMode = "short_break";
          nextPomodoroCount = newCount;
        }
      } else {
        nextMode = "pomodoro";
      }

      const nextTargetDuration = getPresetTargetDuration(
        nextMode,
        currentPresetIdRef.current,
        presetsRef.current
      );

      const autoStart =
        (nextMode === "pomodoro" && settings.autoStartPomodoro) ||
        ((nextMode === "short_break" || nextMode === "long_break") &&
          settings.autoStartBreak);

      const startTimeIso = new Date(now).toISOString();

      if (autoStart) {
        setFocusMode(true);
        const nextState: ActiveTimerState = {
          mode: nextMode,
          status: "running",
          direction: currentState.direction,
          targetDuration: nextTargetDuration,
          startedAt: startTimeIso,
          lastResumedAt: now,
          accumulatedSeconds: 0,
          expectedEndTime:
            nextMode === "stopwatch" ? null : now + nextTargetDuration * 1000,
          tagId: selectedTag?._id || "",
          pomodoroCount: nextPomodoroCount,
        };

        if (nextMode === "pomodoro") {
          createSession.mutate(
            {
              completed: false,
              duration: 0,
              plannedDuration: nextTargetDuration,
              session_type: "pomodoro",
              timer_type: "focus",
              tag_id: selectedTag?._id || " ",
            },
            {
              onSuccess: (data) => {
                const newId = data?.session?._id || data?.session?.id;
                if (newId) {
                  setTimerState((prev) => ({ ...prev, sessionId: newId }));
                }
              },
              onError: (error: any) => {
                toast.error(
                  error?.response?.data?.message || "Failed to start a session",
                  "Error"
                );
              },
            }
          );
        }

        setTimerState(nextState);
        setDisplayTime(calculateDisplayTime(nextState, now));
      } else {
        const nextState: ActiveTimerState = {
          mode: nextMode,
          status: "idle",
          direction: currentState.direction,
          targetDuration: nextTargetDuration,
          startedAt: "",
          lastResumedAt: null,
          accumulatedSeconds: 0,
          expectedEndTime: null,
          tagId: selectedTag?._id || "",
          pomodoroCount: nextPomodoroCount,
        };

        setTimerState(nextState);
        setDisplayTime(calculateDisplayTime(nextState, now));
      }
    },
    [
      clearTimerInterval,
      initAudio,
      playDing,
      setFocusMode,
      toast,
      updateSession,
      selectedTag?._id,
      createSession,
    ]
  );

  // Active Running Tick Loop
  useEffect(() => {
    if (timerState.status === "running") {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const current = stateRef.current;

        if (current.status === "running" && isSessionFinished(current, now)) {
          handleSessionComplete(current);
        } else {
          setDisplayTime(calculateDisplayTime(current, now));
        }
      }, 250);
    } else {
      clearTimerInterval();
      setDisplayTime(calculateDisplayTime(timerState, Date.now()));
    }

    return clearTimerInterval;
  }, [timerState.status, handleSessionComplete, clearTimerInterval, timerState]);

  // Tab Visibility Change Check
  useEffect(() => {
    const handleVisibilityChange = () => {
      const current = stateRef.current;
      const now = Date.now();

      if (current.status === "running") {
        if (isSessionFinished(current, now)) {
          handleSessionComplete(current);
        } else {
          setDisplayTime(calculateDisplayTime(current, now));
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleSessionComplete]);

  // Multi-tab Sync via Storage Event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ACTIVE_TIMER_STORAGE_KEY && e.newValue) {
        try {
          const syncedState = JSON.parse(e.newValue) as ActiveTimerState;
          if (syncedState) {
            setTimerState(syncedState);
            setDisplayTime(calculateDisplayTime(syncedState, Date.now()));
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Tự động tạm dừng (pause) và lưu trạng thái vào localStorage khi người dùng đóng web / unload
  useEffect(() => {
    const handleUnloadOrPageHide = () => {
      const current = stateRef.current;
      if (current.status === "running") {
        const now = Date.now();
        const currentSegment = current.lastResumedAt
          ? Math.max(0, Math.floor((now - current.lastResumedAt) / 1000))
          : 0;
        const updatedAccumulated = current.accumulatedSeconds + currentSegment;

        const pausedState: ActiveTimerState = {
          ...current,
          status: "paused",
          lastResumedAt: null,
          expectedEndTime: null,
          accumulatedSeconds:
            current.mode === "stopwatch"
              ? updatedAccumulated
              : Math.min(current.targetDuration, updatedAccumulated),
        };

        saveActiveTimerState(pausedState);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      handleUnloadOrPageHide();
      if (stateRef.current.status === "running") {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleUnloadOrPageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleUnloadOrPageHide);
    };
  }, []);

  // Toggle Start / Pause
  const toggleStartPause = useCallback(() => {
    initAudio();
    playClickSound();

    const now = Date.now();
    const current = stateRef.current;

    if (current.status === "running") {
      // Pause
      const currentSegment = current.lastResumedAt
        ? Math.max(0, Math.floor((now - current.lastResumedAt) / 1000))
        : 0;
      const updatedAccumulated = current.accumulatedSeconds + currentSegment;

      const nextState: ActiveTimerState = {
        ...current,
        status: "paused",
        lastResumedAt: null,
        expectedEndTime: null,
        accumulatedSeconds:
          current.mode === "stopwatch"
            ? updatedAccumulated
            : Math.min(current.targetDuration, updatedAccumulated),
      };

      setTimerState(nextState);
      setDisplayTime(calculateDisplayTime(nextState, now));
      setFocusMode(false);
    } else if (current.status === "paused") {
      // Resume
      const remainingSeconds = Math.max(
        0,
        current.targetDuration - current.accumulatedSeconds
      );
      const expectedEnd =
        current.mode === "stopwatch"
          ? null
          : now + remainingSeconds * 1000;

      const nextState: ActiveTimerState = {
        ...current,
        status: "running",
        lastResumedAt: now,
        expectedEndTime: expectedEnd,
      };

      setTimerState(nextState);
      setDisplayTime(calculateDisplayTime(nextState, now));
      setFocusMode(true);
    } else {
      // Start from Idle
      const startedAtIso = new Date(now).toISOString();
      const expectedEnd =
        current.mode === "stopwatch"
          ? null
          : now + current.targetDuration * 1000;

      const nextState: ActiveTimerState = {
        ...current,
        status: "running",
        startedAt: startedAtIso,
        lastResumedAt: now,
        expectedEndTime: expectedEnd,
        accumulatedSeconds: 0,
        tagId: selectedTag?._id || "",
      };

      setTimerState(nextState);
      setDisplayTime(calculateDisplayTime(nextState, now));
      setFocusMode(true);

      if (current.mode === "pomodoro") {
        createSession.mutate(
          {
            completed: false,
            duration: 0,
            plannedDuration: current.targetDuration,
            session_type: "pomodoro",
            timer_type: "focus",
            tag_id: selectedTag?._id || " ",
          },
          {
            onSuccess: (data) => {
              const newId = data?.session?._id || data?.session?.id;
              if (newId) {
                setTimerState((prev) => ({ ...prev, sessionId: newId }));
              }
            },
            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || "Failed to start a session",
                "Error"
              );
            },
          }
        );
      }
    }
  }, [
    initAudio,
    playClickSound,
    setFocusMode,
    selectedTag?._id,
    createSession,
    toast,
  ]);

  // Skip Session
  const skipSession = useCallback(() => {
    clearTimerInterval();
    initAudio();
    playDing();
    setFocusMode(false);

    const now = Date.now();
    const current = stateRef.current;
    const elapsed = calculateElapsedSeconds(current, now);

    if (current.startedAt && current.mode === "pomodoro" && elapsed > 0) {
      updateSession.mutate(
        {
          session_id: current.sessionId,
          completed: true,
          duration: elapsed,
          ended_at: new Date(now).toISOString(),
        },
        {
          onSuccess: (data: any) => {
            const earnedXp = data?.rewards?.earnedXp ?? 0;
            const earnedCoins = data?.rewards?.earnedCoins ?? 0;
            if (earnedXp > 0 || earnedCoins > 0) {
              toast.info(
                `You gained ${earnedXp} xp${earnedCoins > 0 ? ` and ${earnedCoins} coins` : ""}.`,
                "Let's fucking gooooo!"
              );
            }
            if (data?.meta?.isDailyLimitReached) {
              toast.info(
                "Bạn đã đạt giới hạn học tập tối đa 16 tiếng hôm nay rồi. Hãy nghỉ ngơi nhé!",
                "Giới hạn hàng ngày"
              );
            }
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Failed to end session",
              "Error"
            );
          },
        }
      );
    }

    if (current.mode === "stopwatch") {
      const nextState: ActiveTimerState = {
        ...current,
        status: "idle",
        startedAt: "",
        lastResumedAt: null,
        accumulatedSeconds: 0,
        expectedEndTime: null,
        targetDuration: 0,
        sessionId: undefined,
      };
      setTimerState(nextState);
      setDisplayTime(0);
      return;
    }

    // Switch mode for Pomodoro cycle
    const settings = getTimerSettings();
    let nextMode: TimerMode;
    let nextPomodoroCount = current.pomodoroCount;

    if (current.mode === "pomodoro") {
      const newCount = current.pomodoroCount + 1;
      if (newCount >= settings.longBreakInterval) {
        nextMode = "long_break";
        nextPomodoroCount = 0;
      } else {
        nextMode = "short_break";
        nextPomodoroCount = newCount;
      }
    } else {
      nextMode = "pomodoro";
    }

    const nextTargetDuration = getPresetTargetDuration(
      nextMode,
      currentPresetIdRef.current,
      presetsRef.current
    );

    const nextState: ActiveTimerState = {
      mode: nextMode,
      status: "idle",
      direction: current.direction,
      targetDuration: nextTargetDuration,
      startedAt: "",
      lastResumedAt: null,
      accumulatedSeconds: 0,
      expectedEndTime: null,
      tagId: selectedTag?._id || "",
      pomodoroCount: nextPomodoroCount,
      sessionId: undefined,
    };

    setTimerState(nextState);
    setDisplayTime(calculateDisplayTime(nextState, now));
  }, [
    clearTimerInterval,
    initAudio,
    playDing,
    setFocusMode,
    toast,
    updateSession,
    selectedTag?._id,
  ]);

  // Mode Change (User clicked Pomodoro, Short Break, Long Break, Stopwatch)
  const changeMode = useCallback(
    (newMode: TimerMode) => {
      clearTimerInterval();
      setFocusMode(false);

      const targetDuration = getPresetTargetDuration(
        newMode,
        currentPresetIdRef.current,
        presetsRef.current
      );

      const nextState: ActiveTimerState = {
        ...stateRef.current,
        mode: newMode,
        status: "idle",
        targetDuration,
        startedAt: "",
        lastResumedAt: null,
        accumulatedSeconds: 0,
        expectedEndTime: null,
        sessionId: undefined,
      };

      setTimerState(nextState);
      setDisplayTime(calculateDisplayTime(nextState, Date.now()));
    },
    [clearTimerInterval, setFocusMode]
  );

  // Preset Change
  const changePreset = useCallback(
    (presetId: number) => {
      clearTimerInterval();
      setFocusMode(false);
      setCurrentPresetId(presetId);
      saveCurrentPresetId(presetId);

      const currentMode = stateRef.current.mode;
      const targetDuration = getPresetTargetDuration(
        currentMode,
        presetId,
        presetsRef.current
      );

      const nextState: ActiveTimerState = {
        ...stateRef.current,
        status: "idle",
        targetDuration,
        startedAt: "",
        lastResumedAt: null,
        accumulatedSeconds: 0,
        expectedEndTime: null,
        sessionId: undefined,
      };

      setTimerState(nextState);
      setDisplayTime(calculateDisplayTime(nextState, Date.now()));
    },
    [clearTimerInterval, setFocusMode]
  );

  // Toggle Direction
  const toggleDirection = useCallback(() => {
    setTimerDirection((prev) =>
      prev === "countdown" ? "countup" : "countdown"
    );
  }, []);

  return {
    timerState,
    displayTime,
    formattedTime: formatTime(displayTime),
    running: timerState.status === "running",
    mode: timerState.mode,
    timerDirection,
    presets,
    currentPresetId,
    toggleStartPause,
    skipSession,
    changeMode,
    changePreset,
    toggleDirection,
  };
}
