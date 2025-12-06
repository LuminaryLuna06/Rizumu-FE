export type ModelUserPomodoroSession = {
  id: string;
  user_id: string;
  room_id: string;
  tag_id: string;
  completed: boolean;
  invalid: boolean;
  is_auto_started: boolean;
  session_type: string;
  timer_type: string; // "focus" | "stopwatch"
  duration: number;
  description: string;
  created_at: string;
  started_at: string;
  ended_at: string;
};
