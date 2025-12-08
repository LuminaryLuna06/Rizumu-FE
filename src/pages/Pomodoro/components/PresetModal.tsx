import Modal from "@rizumu/components/Modal";
import SelectInput from "@rizumu/components/SelectInput";
import type { Preset } from "@rizumu/constants/timer";

interface PresetModalProps {
  opened: boolean;
  onClose: () => void;
  presets: Preset[];
  currentPresetId: number;
  onPresetChange: (presetId: number) => void;
}

function PresetModal({
  opened,
  onClose,
  presets,
  currentPresetId,
  onPresetChange,
}: PresetModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Pomodoro Presets"
      className="!w-[500px]"
    >
      <SelectInput
        value={String(currentPresetId)}
        data={presets.map((preset) => ({
          value: String(preset.id),
          label: `${preset.name} (${preset.durations.pomodoro}m /${preset.durations.short_break}m /${preset.durations.long_break}m)`,
        }))}
        onChange={(value) => onPresetChange(Number(value))}
      />
    </Modal>
  );
}

export default PresetModal;
