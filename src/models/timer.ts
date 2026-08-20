import type { TimerMode, TimerDirection } from "@rizumu/constants/timer";

export type ModelTimer = {
  completed: boolean;
  started_at: string;
  ended_at: string;
  duration: number;
  session_type: string; //"pomodoro";
  timer_type: string; //"focus" | "stopwatch"
  user_id: string | undefined;
  tag_id: string;
  notes?: string;
};

export interface ActiveTimerState {
  sessionId?: string;
  mode: TimerMode;
  status: "idle" | "running" | "paused";
  direction: TimerDirection;
  targetDuration: number; // in seconds
  startedAt: string; // ISO string
  lastResumedAt: number | null; // timestamp ms
  accumulatedSeconds: number; // elapsed seconds accumulated before current segment
  expectedEndTime: number | null; // timestamp ms when countdown finishes
  tagId: string;
  pomodoroCount: number;
}

