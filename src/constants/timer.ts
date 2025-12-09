type TimerMode = "pomodoro" | "short_break" | "long_break";
export interface Preset {
  id: number;
  name: string;
  durations: Record<TimerMode, number>;
}
export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 0,
    name: "Classic Pomodoro",
    durations: { pomodoro: 25, short_break: 5, long_break: 15 },
  },
  {
    id: 1,
    name: "Extended Pomodoro",
    durations: { pomodoro: 50, short_break: 10, long_break: 30 },
  },
  {
    id: 2,
    name: "Quick Session",
    durations: { pomodoro: 15, short_break: 3, long_break: 10 },
  },
  {
    id: 3,
    name: "Deep Work",
    durations: { pomodoro: 90, short_break: 15, long_break: 30 },
  },
];
