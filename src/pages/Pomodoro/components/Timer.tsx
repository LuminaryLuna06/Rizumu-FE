import axiosClient from "@rizumu/api/config/axiosClient";
import { DEFAULT_PRESETS, type Preset } from "@rizumu/constants/timer";
import { useAuth } from "@rizumu/context/AuthContext";
import {
  getCurrentPresetId,
  initializePresets,
  saveCurrentPresetId,
} from "@rizumu/utils/presets";
import {
  IconFlag,
  IconClockHour11Filled,
  IconPlayerSkipForwardFilled,
  IconChevronDown,
  IconPictureInPicture,
} from "@tabler/icons-react";
import { useState, useRef, useEffect, useCallback } from "react";
import PresetModal from "./PresetModal";

type TimerMode = "pomodoro" | "short_break" | "long_break";
type TimerDirection = "countdown" | "countup";

interface TimerData {
  completed: boolean;
  started_at: string;
  ended_at: string;
  duration: number;
  session_type: string; //"pomodoro";
  timer_type: string; //"focus" | "stopwatch"
  user_id: string | undefined;
}

const POMODOROS_BEFORE_LONG_BREAK = 3;
const TIMER_DIRECTION_KEY = "pomodoro_timer_direction";

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

function Timer({ bgIsImage }: { bgIsImage: boolean }) {
  const { user } = useAuth();
  const [openedPreset, setOpenedPreset] = useState(false);
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [currentPresetId, setCurrentPresetId] = useState(0);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [timerDirection, setTimerDirection] = useState<TimerDirection>(() =>
    getTimerDirection()
  );

  const [targetDuration, setTargetDuration] = useState(() => {
    const storedPresets = localStorage.getItem("pomodoro_presets");
    const currentId = getCurrentPresetId();

    if (storedPresets) {
      const loadedPresets: Preset[] = JSON.parse(storedPresets);
      return loadedPresets[currentId]?.durations.pomodoro * 60 || 25 * 60;
    }

    return DEFAULT_PRESETS[currentId]?.durations.pomodoro * 60 || 25 * 60;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const direction = getTimerDirection();
    const storedPresets = localStorage.getItem("pomodoro_presets");
    const currentId = getCurrentPresetId();

    let duration = 25 * 60;
    if (storedPresets) {
      const loadedPresets: Preset[] = JSON.parse(storedPresets);
      duration = loadedPresets[currentId]?.durations.pomodoro * 60 || 25 * 60;
    } else {
      duration = DEFAULT_PRESETS[currentId]?.durations.pomodoro * 60 || 25 * 60;
    }

    return direction === "countup" ? 0 : duration;
  });

  const [running, setRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const durationRef = useRef(0);
  const dataRef = useRef<TimerData>({
    completed: false,
    started_at: "",
    duration: 0,
    ended_at: "",
    session_type: "pomodoro",
    timer_type: "focus",
    user_id: "",
  });

  // Picture-in-Picture state
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isPipSupported] = useState(() => "documentPictureInPicture" in window);

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
    saveTimerDirection(timerDirection);
  }, [timerDirection]);

  useEffect(() => {
    if (!running) {
      setTimeLeft(timerDirection === "countup" ? 0 : targetDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerDirection]);

  // Prevent accidental page close when timer is running
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

      const targetPresetId =
        presetId !== undefined ? presetId : currentPresetId;
      const currentPreset = presets[targetPresetId];
      const duration = currentPreset?.durations[targetMode] * 60 || 25 * 60;

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
      };
    },
    [clearTimer, mode, presets, currentPresetId, timerDirection]
  );

  useEffect(() => {
    if (running) {
      if (!dataRef.current.started_at) {
        dataRef.current.started_at = new Date().toISOString();
        dataRef.current.user_id = user?._id;
        console.log("Started: ", dataRef.current);
        if (dataRef.current.session_type === "pomodoro") {
          console.log("Started Pomodoro: ", dataRef.current);
          axiosClient.post("/session", {
            completed: false,
            duration: 0,
            session_type: dataRef.current.session_type,
            started_at: dataRef.current.started_at,
            timer_type: dataRef.current.timer_type,
            // user_id: dataRef.current.user_id,
          });
        }
      }
      intervalRef.current = setInterval(() => {
        durationRef.current += 1;
        // setDuration(durationRef.current);
        setTimeLeft((prev) => {
          let newTimeLeft: number;
          let isCompleted: boolean;

          if (timerDirection === "countup") {
            // Count up from 0 to targetDuration
            newTimeLeft = prev + 1;
            isCompleted = newTimeLeft >= targetDuration;
          } else {
            // Count down from targetDuration to 0
            newTimeLeft = prev - 1;
            isCompleted = newTimeLeft <= 0;
          }

          if (isCompleted) {
            dataRef.current.ended_at = new Date().toISOString();
            dataRef.current.duration = durationRef.current;
            dataRef.current.completed = true;
            const completedSession = { ...dataRef.current };
            console.log("Ended: ", completedSession);
            if (completedSession.session_type === "pomodoro") {
              console.log("Ended Pomodoro: ", completedSession);
              axiosClient.patch("/session", {
                completed: true,
                duration: dataRef.current.duration,
                ended_at: dataRef.current.ended_at,
                // user_id: dataRef.current.user_id,
              });
            }

            queueMicrotask(() => {
              // Auto-switch to next mode
              let nextMode: TimerMode;

              if (mode === "pomodoro") {
                const newCount = pomodoroCount + 1;
                setPomodoroCount(newCount);

                if (newCount >= POMODOROS_BEFORE_LONG_BREAK) {
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
    }
    setMode(newMode);
    resetTimer(newMode);
  };

  const handlePresetChange = (presetId: number) => {
    if (running) {
      setRunning(false);
    }

    setCurrentPresetId(presetId);

    const newPreset = presets.find((p) => p.id === presetId);
    if (newPreset) {
      setTimeLeft(newPreset.durations[mode] * 60);
      resetTimer(mode, presetId);
    }

    saveCurrentPresetId(presetId);
  };

  const handleSkipSession = () => {
    clearTimer();
    setRunning(false);

    // Mark session as completed if it was started
    if (dataRef.current.started_at) {
      dataRef.current.ended_at = new Date().toISOString();
      dataRef.current.duration = durationRef.current;
      dataRef.current.completed = true;

      // Send API call if it's a pomodoro session
      if (dataRef.current.session_type === "pomodoro") {
        console.log("Skipped Pomodoro: ", dataRef.current);
        axiosClient.patch("/session", {
          completed: true,
          duration: dataRef.current.duration,
          ended_at: dataRef.current.ended_at,
        });
      }
    }

    // Auto-switch to next mode
    let nextMode: TimerMode;

    if (mode === "pomodoro") {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);

      if (newCount >= POMODOROS_BEFORE_LONG_BREAK) {
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

  // Picture-in-Picture handlers
  const openPictureInPicture = async () => {
    if (!window.documentPictureInPicture || pipWindow) return;

    try {
      const pip = await window.documentPictureInPicture.requestWindow({
        width: 350,
        height: 200,
      });

      setPipWindow(pip);

      // Copy stylesheets to PiP window
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join("");
          const style = pip.document.createElement("style");
          style.textContent = cssRules;
          pip.document.head.appendChild(style);
        } catch (e) {
          // External stylesheets may fail due to CORS
          const link = pip.document.createElement("link");
          link.rel = "stylesheet";
          link.href = (styleSheet as CSSStyleSheet).href || "";
          if (link.href) pip.document.head.appendChild(link);
        }
      });

      // Create PiP UI structure
      const bgStyle = bgIsImage
        ? `background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('/image/fuji.webp');
          background-size: cover;
          background-position: center;`
        : `background: black; position: relative; overflow: hidden;`;

      const videoBg = !bgIsImage
        ? `<video autoplay muted loop style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
          ">
            <source src="/video/Vid_BG_1.mp4" type="video/mp4" />
          </video>`
        : "";

      // Create PiP UI structure
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

      // Setup button event listeners
      const toggleBtn = pip.document.getElementById("pip-toggle");
      const skipBtn = pip.document.getElementById("pip-skip");

      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => setRunning((prev) => !prev));
        toggleBtn.addEventListener("mouseenter", () => {
          toggleBtn.style.transform = "scale(1.05)";
        });
        toggleBtn.addEventListener("mouseleave", () => {
          toggleBtn.style.transform = "scale(1)";
        });
      }

      if (skipBtn) {
        skipBtn.addEventListener("click", handleSkipSession);
        skipBtn.addEventListener("mouseenter", () => {
          skipBtn.style.background = "rgba(255, 255, 255, 0.3)";
          skipBtn.style.transform = "scale(1.1)";
        });
        skipBtn.addEventListener("mouseleave", () => {
          skipBtn.style.background = "rgba(255, 255, 255, 0.2)";
          skipBtn.style.transform = "scale(1)";
        });
      }

      // Handle PiP window close
      pip.addEventListener("pagehide", () => {
        setPipWindow(null);
      });
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

  // Update PiP content when timer state changes
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
    // Close PiP when skipping since we're switching modes
    if (pipWindow) {
      closePictureInPicture();
    }
  };

  return (
    <div className="main-content flex flex-col justify-center items-center gap-y-xs h-[82vh]">
      {pipWindow ? (
        // Show minimized message when PiP is active
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
        // Show full timer when PiP is not active
        <>
          <a
            href="/#/pomodoro"
            className="flex items-center bg-primary-hover rounded-lg px-lg py-xs cursor-pointer text-secondary/90"
          >
            Select a tag <IconChevronDown size={20} />
          </a>

          <div className="flex gap-x-xl items-center mt-10">
            <button
              onClick={() => handleModeChange("pomodoro")}
              className={`rounded-full bg-secondary transition-all duration-slow ${
                mode === "pomodoro"
                  ? "w-8 h-8"
                  : "w-7 h-7 hover:w-8 hover:h-8 bg-secondary/60 hover:bg-secondary"
              }`}
              aria-label="Pomodoro mode"
              title="Pomodoro"
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
            ></button>
          </div>

          <p className="leading-tight md:text-[10em] text-[6em] font-extrabold tracking-[0.07em] transition-all duration-slower ease-in-out">
            {formatTime(timeLeft)}
          </p>
          <button className="flex justify-center items-center gap-x-xs text-normal">
            <IconFlag size={20} />
            <p>Website</p>
          </button>

          <div className="grid grid-cols-3 items-center w-full max-w-[35rem] gap-x-4">
            <div className="flex justify-end">
              <IconClockHour11Filled
                className="hover:scale-110 transition-all cursor-pointer"
                size={26}
                onClick={() => setOpenedPreset(true)}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setRunning(!running)}
                className="px-lg py-lg w-[140px] md:w-[200px] my-lg text-primary rounded-full bg-secondary text-lg font-bold hover:bg-secondary-hover cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              >
                {running ? "Pause" : "Start"}
              </button>
            </div>

            <div className="flex justify-start gap-x-lg">
              <IconPictureInPicture
                className={`hover:scale-110 transition-all cursor-pointer ${
                  !isPipSupported ? "opacity-30 cursor-not-allowed" : ""
                } ${pipWindow ? "text-accent" : ""}`}
                size={26}
                onClick={isPipSupported ? handleTogglePiP : undefined}
                title={
                  !isPipSupported
                    ? "Picture-in-Picture not supported"
                    : pipWindow
                    ? "Close Picture-in-Picture"
                    : "Open Picture-in-Picture"
                }
              />
              <IconPlayerSkipForwardFilled
                className="hover:scale-110 transition-all cursor-pointer"
                onClick={handleSkipSessionWrapper}
                size={26}
              />
            </div>
          </div>
        </>
      )}
      <PresetModal
        opened={openedPreset}
        onClose={() => setOpenedPreset(false)}
        presets={presets}
        currentPresetId={currentPresetId}
        onPresetChange={handlePresetChange}
        timerDirection={timerDirection}
        onToggleTimerDirection={handleToggleTimerDirection}
      />
    </div>
  );
}

export default Timer;
