import { useState, useEffect, useRef } from "react";
import Modal from "../Modal";
import Switch from "../FormComponent/Switch";
import SelectInput from "../FormComponent/SelectInput";
import {
  getTimerSettings,
  saveTimerSettings,
} from "@rizumu/utils/timerSettings";
import {
  SOUND_PRESETS,
  playSound,
  createAudioContext,
  type SoundPresetName,
} from "@rizumu/utils/audioPresets";
import { IconVolume } from "@tabler/icons-react";

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
  const [alarmSound, setAlarmSound] = useState<SoundPresetName>("softBell");

  // Alarm settings
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmVolume, setAlarmVolume] = useState(50);
  const [alarmRepeat, setAlarmRepeat] = useState(1);

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  // Audio context for preview
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load settings on mount
  useEffect(() => {
    const settings = getTimerSettings();
    setAutoStartBreak(settings.autoStartBreak);
    setAutoStartPomodoro(settings.autoStartPomodoro);
    setLongBreakInterval(settings.longBreakInterval);
    setAutoMiniTimer(settings.autoMiniTimer);
    setAlarmSound(settings.alarmSound);
    setAlarmEnabled(settings.alarmEnabled);
    setAlarmVolume(settings.alarmVolume);

    // Initialize audio context
    audioCtxRef.current = createAudioContext();
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
      alarmSound,
      alarmEnabled,
      alarmVolume,
    };
    saveTimerSettings(newSettings);
  }, [
    autoStartBreak,
    autoStartPomodoro,
    longBreakInterval,
    autoMiniTimer,
    alarmSound,
    alarmEnabled,
    alarmVolume,
  ]);

  // Handle preview alarm sound
  const handlePreviewSound = () => {
    if (audioCtxRef.current) {
      playSound(alarmSound, audioCtxRef.current, 1, alarmVolume);
    }
  };
  return (
    <Modal
      opened={opened}
      onClose={() => onClose()}
      title="Settings"
      className="app-setting-modal !max-w-[700px] text-white overflow-y-auto [&::-webkit-scrollbar]:hidden"
    >
      {/* Alarm sound */}
      <div className="mb-10">
        <div className="text-left mt-10">Alarm Sound</div>
        <hr className="h-[1px] bg-gray mt-1 mb-4" />

        <div className="flex justify-between items-center mt-5">
          <p>Alarm enabled</p>
          <Switch
            labelPosition="right"
            checked={alarmEnabled}
            onChange={(checked) => setAlarmEnabled(checked)}
          />
        </div>

        <div className="flex justify-between items-center mt-5">
          <p>Alarm Sounds</p>
          <div className="flex items-center gap-2">
            <SelectInput
              data={Object.keys(SOUND_PRESETS).map((preset) => ({
                value: preset,
                label: preset.charAt(0).toUpperCase() + preset.slice(1),
              }))}
              value={alarmSound}
              onChange={(value) => setAlarmSound(value as SoundPresetName)}
              placeholder="Select sound"
              size="sm"
              className="w-40"
            />
            <button
              onClick={handlePreviewSound}
              className="p-2 border rounded-lg hover:bg-secondary/10 transition-colors"
              title="Preview sound"
            >
              <IconVolume size={20} className="text-secondary" />
            </button>
          </div>
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
      </div>

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

      {/* <div className="flex justify-between items-center mt-5">
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
      </div> */}

      {/* Motivation */}
      {/* <div className="text-left mt-10">Motivation</div>
      <hr className="h-[1px] bg-gray mt-1 mb-4" />

      <div className="flex justify-between items-center mt-5">
        <p>Show Widget</p>
        <Switch labelPosition="right" />
      </div> */}
    </Modal>
  );
}

export default AppSetting;
