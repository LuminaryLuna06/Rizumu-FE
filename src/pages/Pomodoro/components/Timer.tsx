import axiosClient from "@rizumu/api/config/axiosClient";
import { useAuth } from "@rizumu/context/AuthContext";
import {
  IconFlag,
  IconClockHour11Filled,
  IconPlayerSkipForwardFilled,
} from "@tabler/icons-react";
import { useState, useRef, useEffect, useCallback } from "react";

type TimerMode = "pomodoro" | "short_break" | "long_break";

interface TimerData {
  completed: boolean;
  started_at: string;
  ended_at: string;
  duration: number;
  session_type: string; //"pomodoro";
  timer_type: string; //"focus" | "stopwatch"
  user_id: string | undefined;
}

const TIMER_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 5, // 25 minutes
  short_break: 5, // 5 minutes
  long_break: 5, // 15 minutes
};

// Number of Pomodoro sessions before a long break
const POMODOROS_BEFORE_LONG_BREAK = 3;

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

function Timer() {
  const { user } = useAuth();
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.pomodoro);
  const [running, setRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0); // Track completed Pomodoros
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
  useEffect(() => {
    if (user?._id) {
      dataRef.current.user_id = user._id;
    }
  }, [user?._id]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(
    (newMode?: TimerMode) => {
      clearTimer();
      setRunning(false);
      const targetMode = newMode || mode;
      setTimeLeft(TIMER_DURATIONS[targetMode]);
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
    [clearTimer, mode]
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
          const newTimeLeft = prev - 1;
          if (newTimeLeft <= 0) {
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

            return 0;
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

  return (
    <div className="main-content flex flex-col justify-center items-center gap-y-xs h-[82vh]">
      <a
        href="/#/pomodoro"
        className="bg-primary-light rounded-xl px-xl py-xs hover:bg-primary-secondary-hover transition-colors duration-300 ease-in-out cursor-pointer mb-md"
      >
        Select a tag
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
      <div className="flex items-center justify-center gap-x-xl cursor-pointer">
        <IconClockHour11Filled />
        <button
          onClick={() => setRunning(!running)}
          className="px-lg py-lg w-[140px] md:w-[200px] md:text-lg md:px-lg md:py-lg my-lg text-primary rounded-full bg-secondary text-lg font-bold hover:bg-secondary-hover cursor-pointer transition-colors duration-300"
        >
          {running ? "Pause" : "Start"}
        </button>
        <IconPlayerSkipForwardFilled
          onClick={() => {
            resetTimer();
          }}
        />
      </div>
    </div>
  );
}

export default Timer;
