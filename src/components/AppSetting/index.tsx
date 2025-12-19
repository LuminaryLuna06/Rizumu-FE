import { useState, useEffect, useRef } from "react";
import Modal from "../Modal";
import Switch from "../Switch";
import {
  getTimerSettings,
  saveTimerSettings,
} from "@rizumu/utils/timerSettings";

function AppSetting({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  // Timer settings - load from localStorage
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  const [autoStartPomodoro, setAutoStartPomodoro] = useState(false);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [autoMiniTimer, setAutoMiniTimer] = useState(false);

  // Alarm settings
  const [alarmSound, setAlarmSound] = useState("bell");
  const [alarmVolume, setAlarmVolume] = useState(50);
  const [alarmRepeat, setAlarmRepeat] = useState(1);

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  // Load settings on mount
  useEffect(() => {
    const settings = getTimerSettings();
    console.log("Loaded settings:", settings);
    setAutoStartBreak(settings.autoStartBreak);
    setAutoStartPomodoro(settings.autoStartPomodoro);
    setLongBreakInterval(settings.longBreakInterval);
    setAutoMiniTimer(settings.autoMiniTimer);
  }, []);

  // Save timer settings when they change (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const newSettings = {
      autoStartBreak,
      autoStartPomodoro,
      longBreakInterval,
      autoMiniTimer,
    };
    console.log("Saving settings:", newSettings);
    saveTimerSettings(newSettings);
  }, [autoStartBreak, autoStartPomodoro, longBreakInterval, autoMiniTimer]);
  return (
    <Modal
      opened={opened}
      onClose={() => onClose()}
      title="Settings"
      className="!max-w-[700px] text-white overflow-y-auto [&::-webkit-scrollbar]:hidden"
    >
      {/* Timer */}
      <div className="text-left">Timer</div>
      <hr className="h-[1px] bg-gray mb-4 mt-1" />

      <div className="flex justify-between items-center mt-3">
        <p>Auto Start Break</p>
        <Switch
          labelPosition="right"
          checked={autoStartBreak}
          onChange={(checked) => setAutoStartBreak(checked)}
        />
      </div>
      <div className="flex justify-between items-center mt-5">
        <p>Auto Start Pomodoro</p>
        <Switch
          labelPosition="right"
          checked={autoStartPomodoro}
          onChange={(checked) => setAutoStartPomodoro(checked)}
        />
      </div>
      <div className="flex justify-between items-center mt-5">
        <p>Long Break Interval</p>
        <input
          type="number"
          min="1"
          max="10"
          value={longBreakInterval}
          onChange={(e) =>
            setLongBreakInterval(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-20 px-3 py-2 border rounded-lg text-secondary text-center focus:outline-none"
        />
      </div>
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col">
          <p>Auto mini timer</p>
          <p className="text-xs">
            Show the mini timer when you switch away from Rizumu.
          </p>
        </div>
        <Switch
          labelPosition="right"
          checked={autoMiniTimer}
          onChange={(checked) => setAutoMiniTimer(checked)}
        />
      </div>

      {/* Sound */}
      {/* <div className="text-left mt-10">Sound</div>
      <hr className="h-[1px] bg-gray mt-1 mb-4" />

      <div className="flex justify-between items-center mt-5">
        <p>Ticking sound</p>
        <Switch labelPosition="right" />
      </div>

      <div className="flex justify-between items-center mt-5">
        <p>Volume</p>
      </div>

      <div className="flex justify-between items-center mt-5">
        <p>Ticking speed</p>
      </div> */}

      {/* Alarm sound */}
      <div className="text-left mt-10">Alarm Sound</div>
      <hr className="h-[1px] bg-gray mt-1 mb-4" />

      <div className="flex justify-between items-center mt-5">
        <p>Alarm enabled</p>
        <Switch labelPosition="right" />
      </div>

      <div className="flex justify-between items-center mt-5">
        <p>Alarm Sounds</p>
        <select
          value={alarmSound}
          onChange={(e) => setAlarmSound(e.target.value)}
          className="px-4 py-2 border rounded-lg text-secondary focus:outline-none"
        >
          <option value="bell">Bell</option>
          <option value="kitchen">Kitchen</option>
          <option value="bird">Bird</option>
          <option value="digital">Digital</option>
        </select>
      </div>

      <div className="flex justify-between items-center mt-5">
        <p>Volume</p>
        <div className="flex items-center gap-3 w-48">
          <input
            type="range"
            min="0"
            max="100"
            value={alarmVolume}
            onChange={(e) => setAlarmVolume(parseInt(e.target.value))}
            className="flex-1 h-2 bg-secondary/50 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
          />
          <span className="text-sm text-secondary/80 w-10 text-right">
            {alarmVolume}%
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5">
        <p>Repeat</p>
        <input
          type="number"
          min="1"
          max="10"
          value={alarmRepeat}
          onChange={(e) =>
            setAlarmRepeat(
              Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
            )
          }
          className="w-20 px-3 py-2 border rounded-lg text-secondary text-center focus:outline-none"
        />
      </div>

      {/* Motivation */}
      <div className="text-left mt-10">Motivation</div>
      <hr className="h-[1px] bg-gray mt-1 mb-4" />

      <div className="flex justify-between items-center mt-5">
        <p>Show Widget</p>
        <Switch labelPosition="right" />
      </div>
    </Modal>
  );
}

export default AppSetting;
