// Tiny synthesized sound effects via Web Audio — no audio files to ship.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function beep(freq: number, duration: number, type: OscillatorType = "square", gain = 0.06, delay = 0) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(c.destination);
  const start = c.currentTime + delay;
  osc.start(start);
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.stop(start + duration);
}

export const sfx = {
  click() {
    beep(440, 0.05, "square", 0.04);
  },
  run() {
    beep(330, 0.08, "sawtooth", 0.05);
  },
  pass() {
    beep(523, 0.1, "square", 0.07);
    beep(659, 0.1, "square", 0.07, 0.09);
    beep(784, 0.16, "square", 0.08, 0.18);
  },
  fail() {
    beep(220, 0.18, "sawtooth", 0.07);
    beep(160, 0.22, "sawtooth", 0.07, 0.12);
  },
  levelUp() {
    [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.12, "square", 0.08, i * 0.09));
  },
};
