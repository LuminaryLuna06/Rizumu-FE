import Modal from "@rizumu/components/Modal";
import SelectInput from "@rizumu/components/SelectInput";
import Switch from "@rizumu/components/Switch";
import type { Preset, TimerMode } from "@rizumu/constants/timer";
import { IconStopwatch } from "@tabler/icons-react";
import { useState } from "react";

interface PresetModalProps {
  opened: boolean;
  onClose: () => void;
  presets: Preset[];
  currentPresetId: number;
  onPresetChange: (presetId: number) => void;
  timerDirection: "countdown" | "countup";
  onToggleTimerDirection: () => void;
  currentMode: TimerMode;
  onModeChange: (newMode: TimerMode) => void;
}

function PresetModal({
  opened,
  onClose,
  presets,
  currentPresetId,
  onPresetChange,
  timerDirection,
  onToggleTimerDirection,
  currentMode,
  onModeChange,
}: PresetModalProps) {
  const [activeTab, setActiveTab] = useState<"pomodoro" | "stopwatch">(
    currentMode === "stopwatch" ? "stopwatch" : "pomodoro"
  );
  const tabs = [
    {
      id: 0,
      mode: "pomodoro",
      name: "Focus Timer",
    },
    {
      id: 1,
      mode: "stopwatch",
      name: "Stopwatch",
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Pomodoro Presets"
      className="!w-[500px]"
    >
      {/* Tab */}
      <div className="flex gap-1 bg-secondary/5 p-1 rounded-md mb-4 md:mb-8 text-white">
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.mode);
              if (tab.mode === "stopwatch") {
                onModeChange("stopwatch");
              } else {
                onModeChange("pomodoro");
              }
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-slow cursor-pointer ${
              activeTab === tab.mode
                ? "bg-secondary/10"
                : "text-secondary/50 hover:text-secondary/80 hover:bg-secondary/5"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {activeTab === "pomodoro" ? (
        <div className="space-y-md">
          <Switch
            label="Count up timer"
            checked={timerDirection === "countup"}
            onChange={onToggleTimerDirection}
          />
          <SelectInput
            label="Presets"
            value={String(currentPresetId)}
            data={presets.map((preset) => ({
              value: String(preset.id),
              label: `${preset.name} (${preset.durations.pomodoro}m /${preset.durations.short_break}m /${preset.durations.long_break}m)`,
            }))}
            onChange={(value) => onPresetChange(Number(value))}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-md text-center py-lg">
          <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
            <IconStopwatch size={40} className="text-secondary" />
          </div>
          <div className="space-y-xs text-secondary/60 text-sm">
            <h3 className="text-lg font-semibold text-secondary">
              Track time without limits
            </h3>
            <p className="max-w-[300px] text-secondary/70">
              Perfect for open-ended study sessions. Timer will count up
              indefinitely.
            </p>
            <p className="max-w-[300px] text-secondary/70 italic pt-2">
              Press Skip to reset to 0:00
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default PresetModal;
