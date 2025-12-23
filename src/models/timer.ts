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
