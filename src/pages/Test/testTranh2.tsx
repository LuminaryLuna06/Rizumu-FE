import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { useAuth } from "@rizumu/context/AuthContext";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface TimerData {
  completed: boolean;
  started_at: string;
  ended_at: string;
  duration: number;
  session_type: string; //"pomodoro";
  timer_type: string; //"focus" | "stopwatch"
  user_id: string | undefined;
}

function TestTranh2() {
  const { user } = useAuth();
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

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
    setDuration(0);
    setTimeLeft(3);
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
        setTimeLeft((prev) => {
          const newTimeLeft = prev - 1;
          if (newTimeLeft <= 0) {
            dataRef.current.ended_at = new Date().toISOString();
            dataRef.current.duration = duration + 1;
            dataRef.current.completed = true;
            console.log("Ended: ", dataRef.current);

            setTimeout(() => resetTimer(), 0);
            return 0;
          }
          return newTimeLeft;
        });
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [running, resetTimer, clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  return (
    <div>
      <h1>Timer: {formatTime(timeLeft)}</h1>
      <h2>Duration: {duration} seconds</h2>
      <ResponsiveButton
        children={running ? "Stop" : "Run"}
        onClick={() => setRunning(!running)}
      />
      <ResponsiveButton
        children={"Reset"}
        onClick={() => {
          resetTimer();
        }}
      />
    </div>
  );
}

export default TestTranh2;
