import { useAuth } from "@rizumu/context/AuthContext";
import {
  IconFlag,
  IconClockHour11Filled,
  IconPlayerSkipForwardFilled,
} from "@tabler/icons-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface TimerData {
  completed: boolean;
  started_at: string;
  ended_at: string;
  duration: number;
  session_type: string; //"pomodoro";
  timer_type: string; //"focus" | "stopwatch"
  user_id: string | undefined;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

function Timer() {
  const { user } = useAuth();
  //   const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [running, setRunning] = useState(false);
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

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    clearTimer();
    setRunning(false);
    // setDuration(0);
    setTimeLeft(3);
    durationRef.current = 0;
    dataRef.current = {
      completed: false,
      started_at: "",
      duration: 0,
      ended_at: "",
      session_type: "pomodoro",
      timer_type: "focus",
      user_id: "",
    };
  }, [clearTimer]);

  useEffect(() => {
    if (running) {
      if (!dataRef.current.started_at) {
        dataRef.current.started_at = new Date().toISOString();
        dataRef.current.user_id = user?._id;
        console.log("Started: ", dataRef.current);
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

            queueMicrotask(() => {
              resetTimer();
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

  return (
    <div className="main-content flex flex-col justify-center items-center gap-y-xs h-[82vh]">
      <a
        href="/#/pomodoro"
        className="bg-primary-light rounded-xl px-xl py-xs hover:bg-primary-secondary-hover transition-colors duration-300 ease-in-out cursor-pointer"
      >
        Select a tag
      </a>

      <div className="flex gap-x-xl items-center mt-10">
        <div className="w-8 h-8 rounded-full bg-secondary"></div>
        <div className="w-7 h-7 hover:w-8 hover:h-8 hover:bg-secondary rounded-full bg-secondary/60 transition-all duration-slow"></div>
        <div className="w-7 h-7 hover:w-8 hover:h-8 hover:bg-secondary rounded-full bg-secondary/60 transition-all duration-slow"></div>
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
