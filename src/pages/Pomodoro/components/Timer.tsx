import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import {
  DEFAULT_PRESETS,
  type Preset,
  type TimerDirection,
  type TimerMode,
} from "@rizumu/constants/timer";
import type { ModelTimer } from "@rizumu/models/timer";
import type { ModelTag } from "@rizumu/models/tag";
import {
  getCurrentPresetId,
  initializePresets,
  saveCurrentPresetId,
} from "@rizumu/utils/presets";
import { getTimerSettings } from "@rizumu/utils/timerSettings";
import { playSound, createAudioContext } from "@rizumu/utils/audioPresets";
import {
  IconClockHour11Filled,
  IconPlayerSkipForwardFilled,
  IconPictureInPicture,
  IconFlagFilled,
} from "@tabler/icons-react";
import PresetModal from "./PresetModal";
import TagSelector from "./TagSelector";
import {
  useCreateSession,
  useUpdateSession,
  useUpdateStats,
} from "@rizumu/tanstack/api/hooks";

const TIMER_DIRECTION_KEY = "pomodoro_timer_direction";
const SELECTED_TAG_KEY = "pomodoro_selected_tag";

const getTimerDirection = (): TimerDirection => {
  try {
    const stored = localStorage.getItem(TIMER_DIRECTION_KEY);
    return (stored as TimerDirection) || "countdown";
  } catch {
    return "countdown";
  }
};

const saveTimerDirection = (direction: TimerDirection) => {
  try {
    localStorage.setItem(TIMER_DIRECTION_KEY, direction);
  } catch (error) {
    console.error("Failed to save timer direction:", error);
  }
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

interface TimerProps {
  bgType: string;
  bgName: string;
  focusMode: boolean;
  selectedTag: ModelTag | null;
  onTagSelect: (tag: ModelTag | null) => void;
  setFocusMode: (mode?: boolean | ((prev: boolean) => boolean)) => void;
}

function Timer({
  bgType,
  bgName,
  focusMode,
  selectedTag,
  onTagSelect,
  setFocusMode,
}: TimerProps) {
  const { user } = useAuth();
  const toast = useToast();
  const create = useCreateSession();
  const update = useUpdateSession();
  const updateStats = useUpdateStats();

  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [openedPreset, setOpenedPreset] = useState(false);
  const [currentPresetId, setCurrentPresetId] = useState(0);
  const [presets, setPresets] = useState<Preset[]>([]);

  const [running, setRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef(0);
  const dataRef = useRef<ModelTimer>({
    completed: false,
    started_at: "",
    duration: 0,
    ended_at: "",
    session_type: "pomodoro",
    timer_type: "focus",
    user_id: "",
    tag_id: "",
  });
  const shouldAutoStartRef = useRef(false);
  const [timerDirection, setTimerDirection] = useState<TimerDirection>(() =>
    getTimerDirection()
  );

  const [targetDuration, setTargetDuration] = useState(() => {
    const storedPresets = localStorage.getItem("pomodoro_presets");
    const currentId = getCurrentPresetId();

    if (storedPresets) {
      const loadedPresets: Preset[] = JSON.parse(storedPresets);
      return (loadedPresets[currentId]?.durations?.pomodoro ?? 25) * 60;
    }

    return (DEFAULT_PRESETS[currentId]?.durations?.pomodoro ?? 25) * 60;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const direction = getTimerDirection();
    const storedPresets = localStorage.getItem("pomodoro_presets");
    const currentId = getCurrentPresetId();

    let duration = 25 * 60;
    if (storedPresets) {
      const loadedPresets: Preset[] = JSON.parse(storedPresets);
      duration = (loadedPresets[currentId]?.durations?.pomodoro ?? 25) * 60;
    } else {
      duration = (DEFAULT_PRESETS[currentId]?.durations?.pomodoro ?? 25) * 60;
    }

    return direction === "countup" ? 0 : duration;
  });

  // Picture-in-Picture
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isPipSupported] = useState(() => "documentPictureInPicture" in window);
  const modeRef = useRef<TimerMode>("pomodoro");
  const audioCtxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    const storedPresets = localStorage.getItem("pomodoro_presets");
    let loadedPresets: Preset[];

    if (storedPresets) {
      loadedPresets = JSON.parse(storedPresets);
    } else {
      initializePresets();
      loadedPresets = DEFAULT_PRESETS;
    }

    setPresets(loadedPresets);

    const currentId = getCurrentPresetId();
    setCurrentPresetId(currentId);
  }, []);

  useEffect(() => {
    if (user?._id) {
      dataRef.current.user_id = user._id;
    }
  }, [user?._id]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!user) {
      onTagSelect(null);
    } else {
      try {
        const key = `${SELECTED_TAG_KEY}_${user._id}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          onTagSelect(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to restore selected tag:", error);
      }
    }
  }, [user, onTagSelect]);

  useEffect(() => {
    saveTimerDirection(timerDirection);
  }, [timerDirection]);

  useEffect(() => {
    if (!running) {
      setTimeLeft(timerDirection === "countup" ? 0 : targetDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerDirection]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (running) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [running]);

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - Rizumu`;
    return () => {
      document.title = "Rizumu";
    };
  }, [timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const settings = getTimerSettings();
      if (settings.autoMiniTimer && document.hidden && running && !pipWindow) {
        openPictureInPicture();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [running, pipWindow]);

  // Auto-start
  useEffect(() => {
    if (shouldAutoStartRef.current) {
      shouldAutoStartRef.current = false;
      const settings = getTimerSettings();

      if (mode === "pomodoro" && settings.autoStartPomodoro) {
        setRunning(true);
        setFocusMode(true);
      } else if (
        (mode === "short_break" || mode === "long_break") &&
        settings.autoStartBreak
      ) {
        setRunning(true);
        setFocusMode(true);
      }
    }
  }, [mode, setFocusMode]);

  const handleToggleTimerDirection = () => {
    setTimerDirection((prev) =>
      prev === "countdown" ? "countup" : "countdown"
    );
  };

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(
    (newMode?: TimerMode, presetId?: number) => {
      clearTimer();
      setRunning(false);
      const targetMode = newMode || mode;

      // Stopwatch mode: no preset, always starts at 0
      if (targetMode === "stopwatch") {
        setTargetDuration(0);
        setTimeLeft(0);
        durationRef.current = 0;
        dataRef.current = {
          completed: false,
          started_at: "",
          duration: 0,
          ended_at: "",
          session_type: targetMode,
          timer_type: "focus",
          user_id: "",
          tag_id: "",
        };
        return;
      }

      const targetPresetId =
        presetId !== undefined ? presetId : currentPresetId;
      const currentPreset = presets[targetPresetId];
      const duration = (currentPreset?.durations?.[targetMode] ?? 25) * 60;

      setTargetDuration(duration);
      setTimeLeft(timerDirection === "countup" ? 0 : duration);
      durationRef.current = 0;
      dataRef.current = {
        completed: false,
        started_at: "",
        duration: 0,
        ended_at: "",
        session_type: targetMode,
        timer_type: "focus",
        user_id: "",
        tag_id: "",
      };
    },
    [clearTimer, mode, presets, currentPresetId, timerDirection]
  );

  useEffect(() => {
    if (running) {
      if (!dataRef.current.started_at) {
        dataRef.current.started_at = new Date().toISOString();
        dataRef.current.user_id = user?._id;
        dataRef.current.tag_id = selectedTag?._id || " ";
        console.log("Started: ", dataRef.current);
        if (dataRef.current.session_type === "pomodoro") {
          create.mutate(
            {
              completed: false,
              duration: 0,
              session_type: dataRef.current.session_type,
              started_at: dataRef.current.started_at,
              timer_type: dataRef.current.timer_type,
              tag_id: dataRef.current.tag_id,
            },
            {
              onError: (error: any) => {
                toast.error(
                  error?.response?.data?.message || "Failed to start a session",
                  "Error"
                );
              },
            }
          );
          setFocusMode(true);
        }
      }
      intervalRef.current = setInterval(() => {
        durationRef.current += 1;
        setTimeLeft((prev) => {
          if (mode === "stopwatch") {
            return prev + 1;
          }

          let newTimeLeft: number;
          let isCompleted: boolean;

          if (timerDirection === "countup") {
            newTimeLeft = prev + 1;
            isCompleted = newTimeLeft >= targetDuration;
          } else {
            newTimeLeft = prev - 1;
            isCompleted = newTimeLeft <= 0;
          }

          if (isCompleted) {
            dataRef.current.ended_at = new Date().toISOString();
            dataRef.current.duration = durationRef.current;
            dataRef.current.completed = true;

            initAudio();
            playDing();

            const completedSession = { ...dataRef.current };
            setFocusMode(false);
            if (completedSession.session_type === "pomodoro") {
              const duration = durationRef.current;
              const xp = Math.floor(duration / 60);
              const coin = Math.floor(duration / 600);
              if (xp > 0 || coin > 0) {
                updateStats.mutate(
                  { current_xp: xp, coins: coin },
                  {
                    onSuccess: () => {
                      toast.info(
                        `You gained ${xp} xp${
                          coin > 0 ? ` and ${coin} coins` : ""
                        }.`,
                        "Let's fucking gooooo!"
                      );
                    },
                    onError: (error: any) => {
                      toast.error(
                        error?.response?.data?.message ||
                          "Failed to update stats",
                        "Error"
                      );
                    },
                  }
                );
              }
              update.mutate(
                {
                  completed: true,
                  duration: dataRef.current.duration,
                  ended_at: dataRef.current.ended_at,
                },
                {
                  onError: (error: any) => {
                    toast.error(
                      error?.response?.data?.message || "Failed to end session",
                      "Error"
                    );
                  },
                }
              );
            }

            // Auto-switch mode
            queueMicrotask(() => {
              let nextMode: TimerMode;
              const settings = getTimerSettings();

              if (mode === "pomodoro") {
                const newCount = pomodoroCount + 1;
                setPomodoroCount(newCount);

                if (newCount >= settings.longBreakInterval) {
                  nextMode = "long_break";
                  setPomodoroCount(0);
                } else {
                  nextMode = "short_break";
                }
              } else {
                nextMode = "pomodoro";
              }

              setMode(nextMode);
              resetTimer(nextMode);

              if (
                (nextMode === "pomodoro" && settings.autoStartPomodoro) ||
                ((nextMode === "short_break" || nextMode === "long_break") &&
                  settings.autoStartBreak)
              ) {
                shouldAutoStartRef.current = true;
              }
            });

            return timerDirection === "countup" ? targetDuration : 0;
          }
          return newTimeLeft;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [running, clearTimer, resetTimer, user?._id]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const handleModeChange = (newMode: TimerMode) => {
    if (running) {
      setRunning(false);
      setFocusMode(false);
    }
    setMode(newMode);
    resetTimer(newMode);
  };

  const handlePresetChange = (presetId: number) => {
    if (running) {
      setRunning(false);
      setFocusMode(false);
    }

    setCurrentPresetId(presetId);

    const newPreset = presets.find((p) => p.id === presetId);
    if (newPreset) {
      setTimeLeft((newPreset.durations?.[mode] ?? 25) * 60);
      resetTimer(mode, presetId);
    }

    saveCurrentPresetId(presetId);
  };

  const handleSkipSession = () => {
    clearTimer();
    setRunning(false);
    setFocusMode(false);

    if (mode === "stopwatch") {
      setTimeLeft(0);
      durationRef.current = 0;
      dataRef.current = {
        completed: false,
        started_at: "",
        duration: 0,
        ended_at: "",
        session_type: "stopwatch",
        timer_type: "focus",
        user_id: "",
        tag_id: "",
      };
      return;
    }

    if (dataRef.current.started_at) {
      dataRef.current.ended_at = new Date().toISOString();
      dataRef.current.duration = durationRef.current;
      dataRef.current.completed = true;

      initAudio();
      playDing();

      if (dataRef.current.session_type === "pomodoro") {
        const duration = durationRef.current;
        const xp = Math.floor(duration / 60);
        const coin = Math.floor(duration / 600);
        if (xp > 0 || coin > 0) {
          updateStats.mutate(
            { current_xp: xp, coins: coin },
            {
              onSuccess: () => {
                toast.info(
                  `You gained ${xp} xp${coin > 0 ? ` and ${coin} coins` : ""}.`,
                  "Let's fucking gooooo!"
                );
              },
              onError: (error: any) => {
                toast.error(
                  error?.response?.data?.message || "Failed to update stats",
                  "Error"
                );
              },
            }
          );
        }
        update.mutate(
          {
            completed: true,
            duration: dataRef.current.duration,
            ended_at: dataRef.current.ended_at,
          },
          {
            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || "Failed to end session",
                "Error"
              );
            },
          }
        );
      }
    }

    // Switch mode
    const currentMode = modeRef.current;
    let nextMode: TimerMode;
    const settings = getTimerSettings();

    if (currentMode === "pomodoro") {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);

      if (newCount >= settings.longBreakInterval) {
        nextMode = "long_break";
        setPomodoroCount(0);
      } else {
        nextMode = "short_break";
      }
    } else {
      nextMode = "pomodoro";
    }

    setMode(nextMode);
    resetTimer(nextMode);
  };

  // Picture-in-Picture
  const openPictureInPicture = async () => {
    if (!window.documentPictureInPicture || pipWindow) return;

    try {
      const pip = await window.documentPictureInPicture.requestWindow({
        width: 350,
        height: 200,
      });

      setPipWindow(pip);

      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join("");
          const style = pip.document.createElement("style");
          style.textContent = cssRules;
          pip.document.head.appendChild(style);
        } catch (e) {
          const link = pip.document.createElement("link");
          link.rel = "stylesheet";
          link.href = (styleSheet as CSSStyleSheet).href || "";
          if (link.href) pip.document.head.appendChild(link);
        }
      });

      const bgStyle =
        bgType === "static"
          ? `background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${bgName});
          background-size: cover;
          background-position: center;`
          : `background: black; position: relative; overflow: hidden;`;

      const videoBg =
        bgType === "animated"
          ? `<video autoplay muted loop style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
          ">
            <source src="${bgName}" type="video/mp4" />
          </video>`
          : "";

      pip.document.body.innerHTML = `
        <div id="pip-container" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
          color: white;
          gap: 20px;
          ${bgStyle}
        ">
          ${videoBg}
          <div id="pip-timer" style="
            font-size: 4rem;
            font-weight: 800;
            letter-spacing: 0.07em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            z-index: 1;
          "></div>
          <div style="display: flex; gap: 15px; align-items: center; z-index: 1;">
            <button id="pip-toggle" style="
              padding: 12px 32px;
              border-radius: 9999px;
              border: none;
              background: white;
              color: #000000;
              font-weight: 700;
              font-size: 1rem;
              cursor: pointer;
              transition: transform 0.2s;
            "></button>
            <button id="pip-skip" style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              border: none;
              background: rgba(255, 255, 255, 0.2);
              color: white;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;
            " title="Skip Session">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18V6l10 6-10 6z" />
                <path d="M17 6h2v12h-2z" />
              </svg>
            </button>
          </div>
        </div>
      `;

      const toggleBtn = pip.document.getElementById("pip-toggle");
      const skipBtn = pip.document.getElementById("pip-skip");

      const toggleClickListener = () => {
        setRunning((prev) => !prev);
        initAudio();
        playClickSound();
        setFocusMode();
      };
      const toggleMouseEnterListener = () => {
        toggleBtn!.style.transform = "scale(1.05)";
      };
      const toggleMouseLeaveListener = () => {
        toggleBtn!.style.transform = "scale(1)";
      };

      const skipClickListener = handleSkipSession;
      const skipMouseEnterListener = () => {
        skipBtn!.style.background = "rgba(255, 255, 255, 0.3)";
        skipBtn!.style.transform = "scale(1.1)";
      };
      const skipMouseLeaveListener = () => {
        skipBtn!.style.background = "rgba(255, 255, 255, 0.2)";
        skipBtn!.style.transform = "scale(1)";
      };

      if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleClickListener);
        toggleBtn.addEventListener("mouseenter", toggleMouseEnterListener);
        toggleBtn.addEventListener("mouseleave", toggleMouseLeaveListener);
      }

      if (skipBtn) {
        skipBtn.addEventListener("click", skipClickListener);
        skipBtn.addEventListener("mouseenter", skipMouseEnterListener);
        skipBtn.addEventListener("mouseleave", skipMouseLeaveListener);
      }

      const pagehideListener = () => {
        if (toggleBtn) {
          toggleBtn.removeEventListener("click", toggleClickListener);
          toggleBtn.removeEventListener("mouseenter", toggleMouseEnterListener);
          toggleBtn.removeEventListener("mouseleave", toggleMouseLeaveListener);
        }

        if (skipBtn) {
          skipBtn.removeEventListener("click", skipClickListener);
          skipBtn.removeEventListener("mouseenter", skipMouseEnterListener);
          skipBtn.removeEventListener("mouseleave", skipMouseLeaveListener);
        }

        setPipWindow(null);
      };

      pip.addEventListener("pagehide", pagehideListener);
    } catch (error) {
      console.error("Failed to open Picture-in-Picture:", error);
    }
  };

  const closePictureInPicture = () => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  };

  useEffect(() => {
    if (pipWindow) {
      const timerEl = pipWindow.document.getElementById("pip-timer");
      const toggleBtn = pipWindow.document.getElementById("pip-toggle");

      if (timerEl) {
        timerEl.textContent = formatTime(timeLeft);
      }

      if (toggleBtn) {
        toggleBtn.textContent = running ? "Pause" : "Start";
      }
    }
  }, [pipWindow, timeLeft, running]);

  const handleTogglePiP = () => {
    if (pipWindow) {
      closePictureInPicture();
    } else {
      openPictureInPicture();
    }
  };

  const handleSkipSessionWrapper = () => {
    handleSkipSession();
    if (pipWindow) {
      closePictureInPicture();
    }
  };

  // Ding dong
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
  };
  const playDing = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const settings = getTimerSettings();
    if (settings.alarmEnabled) {
      playSound(settings.alarmSound, ctx, 1, settings.alarmVolume);
    }
  };
  // Click click
  const playClickSound = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const highpass = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, t);

    highpass.type = "highpass";
    highpass.frequency.value = 700;

    gain.gain.setValueAtTime(0.62, t);
    highpass.connect(gain);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  };
  return (
    <div className="main-content flex flex-col justify-center items-center gap-y-xs h-[82vh]">
      {pipWindow ? (
        <div className="flex flex-col items-center gap-y-lg text-secondary/70">
          <IconPictureInPicture size={64} className="opacity-50" />
          <p className="text-xl font-medium">
            Timer is in Picture-in-Picture mode
          </p>
          <button
            onClick={handleTogglePiP}
            className="px-lg py-md rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all"
          >
            Close PiP
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col justify-center items-center"
          id="timer-container"
        >
          <div
            id="timer-tag-selector"
            className={`block md:hidden lg:block transition-all duration-500 ${
              focusMode ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <TagSelector selectedTag={selectedTag} onTagSelect={onTagSelect} />
          </div>

          {mode !== "stopwatch" && (
            <div
              id="timer-mode-buttons"
              className={`flex gap-x-xl items-center mt-4 md:mt-6 transition-all duration-500`}
            >
              <button
                onClick={() => handleModeChange("pomodoro")}
                className={`rounded-full bg-secondary transition-all duration-slow ${
                  mode === "pomodoro"
                    ? "w-8 h-8"
                    : "w-7 h-7 hover:w-8 hover:h-8 bg-secondary/60 hover:bg-secondary"
                }`}
                aria-label="Pomodoro mode"
                title="Pomodoro"
                style={{
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                }}
              ></button>

              <button
                onClick={() => handleModeChange("short_break")}
                className={`rounded-full bg-secondary transition-all duration-slow ${
                  mode === "short_break"
                    ? "w-8 h-8"
                    : "w-7 h-7 hover:w-8 hover:h-8 bg-secondary/60 hover:bg-secondary"
                }`}
                aria-label="Short break mode"
                title="Short Break"
                style={{
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                }}
              ></button>

              <button
                onClick={() => handleModeChange("long_break")}
                className={`rounded-full bg-secondary transition-all duration-slow ${
                  mode === "long_break"
                    ? "w-8 h-8"
                    : "w-7 h-7 hover:w-8 hover:h-8 bg-secondary/60 hover:bg-secondary"
                }`}
                aria-label="Long break mode"
                title="Long Break"
                style={{
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                }}
              ></button>
            </div>
          )}

          <p
            id="timer-display"
            className="leading-tight text-[4.5em] sm:text-[5.5em] md:text-[7em] lg:text-[10em] font-extrabold tracking-[0.07em] transition-all duration-slower ease-in-out"
            style={{
              textShadow:
                "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06), 0 10px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            {formatTime(timeLeft)}
          </p>

          <div className="grid grid-cols-3 items-center w-full max-w-[35rem] gap-x-4">
            <div
              className={`flex justify-end transition-all duration-500 ${
                focusMode ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div
                id="timer-preset-button"
                className="rounded-full hover:scale-110 transition-all cursor-pointer"
                onClick={() => setOpenedPreset(true)}
                style={{
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                <IconClockHour11Filled
                  size={26}
                  title="Open presets"
                  aria-label="Open presets"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                id="timer-start-button"
                onClick={() => {
                  setRunning((prev) => !prev);
                  initAudio();
                  playClickSound();
                  setFocusMode();
                }}
                className="px-lg py-lg w-[140px] md:w-[200px] my-lg text-primary rounded-full bg-secondary text-lg font-bold hover:bg-secondary-hover cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                style={{
                  boxShadow:
                    "0 4px 6px rgba(105, 99, 99, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
                }}
                title={running ? "Pause session" : "Start session"}
                aria-label={running ? "Pause session" : "Start session"}
              >
                {running ? "Pause" : "Start"}
              </button>
            </div>

            <div className="flex justify-start gap-x-lg">
              <div
                id="timer-pip-button"
                className={`hidden md:block rounded-full hover:scale-110 transition-all cursor-pointer ${
                  !isPipSupported ? "opacity-30 cursor-not-allowed" : ""
                } ${pipWindow ? "text-accent" : ""}`}
                onClick={isPipSupported ? handleTogglePiP : undefined}
                title={
                  !isPipSupported
                    ? "Picture-in-Picture not supported"
                    : pipWindow
                    ? "Close Picture-in-Picture"
                    : "Open Picture-in-Picture"
                }
                style={{
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                <IconPictureInPicture
                  size={26}
                  aria-label="Open Picture-In-Picture"
                  title="Open Picture-In-Picture"
                />
              </div>
              <div
                id="timer-skip-button"
                className="rounded-full hover:scale-110 transition-all cursor-pointer"
                onClick={handleSkipSessionWrapper}
                style={{
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                <IconPlayerSkipForwardFilled
                  size={26}
                  title="Skip session"
                  aria-label="Skip session"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <PresetModal
        opened={openedPreset}
        onClose={() => setOpenedPreset(false)}
        presets={presets}
        currentPresetId={currentPresetId}
        onPresetChange={handlePresetChange}
        timerDirection={timerDirection}
        onToggleTimerDirection={handleToggleTimerDirection}
        currentMode={mode}
        onModeChange={handleModeChange}
      />
    </div>
  );
}

export default Timer;
