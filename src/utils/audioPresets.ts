export type SoundPreset = {
  waveType: OscillatorType;
  frequency: number;
  duration: number;
  gainStart: number;
  delayTime?: number;
  feedbackGain?: number;
};

export const SOUND_PRESETS: Record<string, SoundPreset> = {
  softBell: {
    waveType: "triangle",
    frequency: 1200,
    duration: 0.4,
    gainStart: 0.4,
    delayTime: 0.1,
    feedbackGain: 0.3,
  },

  zen: {
    waveType: "sine",
    frequency: 900,
    duration: 0.5,
    gainStart: 0.35,
  },

  wind: {
    waveType: "triangle",
    frequency: 700,
    duration: 0.45,
    gainStart: 0.3,
  },

  notify: {
    waveType: "sine",
    frequency: 1100,
    duration: 0.2,
    gainStart: 0.7,
  },

  tap: {
    waveType: "triangle",
    frequency: 1000,
    duration: 0.12,
    gainStart: 0.6,
  },

  chime: {
    waveType: "sine",
    frequency: 1600,
    duration: 0.35,
    gainStart: 0.8,
    delayTime: 0.06,
    feedbackGain: 0.45,
  },
  ambient: {
    waveType: "triangle",
    frequency: 600,
    duration: 0.6,
    gainStart: 0.25,
  },
  meditation: {
    waveType: "sine",
    frequency: 528,
    duration: 0.8,
    gainStart: 0.35,
    delayTime: 0.15,
    feedbackGain: 0.5,
  },
  levelUp: {
    waveType: "triangle",
    frequency: 900,
    duration: 0.15,
    gainStart: 0.6,
  },
};

export type SoundPresetName = keyof typeof SOUND_PRESETS;

export const createAudioContext = (): AudioContext => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export const playSound = (
  presetName: SoundPresetName,
  audioContext?: AudioContext | null,
  repeat: number = 1,
  volume: number = 50 // Volume 0-100
): void => {
  let ctx = audioContext;

  // Create context if not provided
  if (!ctx) {
    ctx = createAudioContext();
  }

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const preset = SOUND_PRESETS[presetName];
  const volumeMultiplier = volume / 100; // Convert 0-100 to 0-1

  // Repeat
  for (let i = 0; i < repeat; i++) {
    const t = ctx.currentTime + i * (preset.duration + 0.5); // 0.5s gap

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = preset.waveType;
    osc.frequency.setValueAtTime(preset.frequency, t);

    // Apply volume multiplier to gainStart
    const adjustedGain = preset.gainStart * volumeMultiplier;
    gain.gain.setValueAtTime(adjustedGain, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + preset.duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Add delay/echo effect if preset has it
    if (preset.delayTime && preset.feedbackGain) {
      const delay = ctx.createDelay();
      const feedback = ctx.createGain();
      const lowpass = ctx.createBiquadFilter();

      delay.delayTime.value = preset.delayTime;
      feedback.gain.value = preset.feedbackGain;
      lowpass.type = "lowpass";
      lowpass.frequency.value = 900;

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -24;
      comp.ratio.value = 6;

      gain.connect(comp);
      comp.connect(ctx.destination);

      comp.connect(delay);
      delay.connect(feedback);
      feedback.connect(lowpass);
      lowpass.connect(delay);
      lowpass.connect(ctx.destination);
    }

    osc.start(t);
    osc.stop(t + preset.duration + 0.5);
  }
};
