"use client";

/**
 * Workstation audio, synthesised with the Web Audio API rather than shipped as
 * files. A relay click or a dot-matrix tick is easier to get right from an
 * oscillator than to source and licence, and it costs nothing to download.
 *
 * Nothing in here may throw into the game: a browser without Web Audio, or a
 * context the autoplay policy refuses to start, must degrade to silence.
 */

export type CueName =
  | "boot-start"
  | "boot-line"
  | "case-reveal"
  | "click"
  | "window-open"
  | "window-close"
  | "evidence"
  | "notice"
  | "unlock-success"
  | "unlock-fail"
  | "pin"
  | "unpin"
  | "submit"
  | "verdict-good"
  | "verdict-bad";

/**
 * Point this at a file under /public (e.g. "/audio/room-tone.mp3") to use a
 * recorded room tone instead of the generated one. Left as "synth" there is no
 * request, no 404, and no asset to ship.
 */
const AMBIENT_SOURCE: string = "synth";

/** Stops a repeated cue from stacking into mush. */
const COOLDOWN_MS = 40;

/**
 * One action often trips several cues — pinning an item also raises a toast and
 * opens the board. Cap how many can start together and let callers fire the
 * important cue first; the rest are dropped rather than layered.
 */
const BURST_WINDOW_MS = 60;
const BURST_MAX = 2;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let ambientStop: (() => void) | null = null;
let enabled = false;
let volume = 0.7;
let gestureHooked = false;
const lastAt = new Map<CueName, number>();
let recent: number[] = [];

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;

  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  ctx = new Ctor();
  noise = null;
  master = ctx.createGain();
  master.gain.value = enabled ? volume : 0;
  master.connect(ctx.destination);
  hookGesture();
  return ctx;
}

/**
 * Autoplay policy suspends a context created without a user gesture — landing
 * straight on /play via a reload, for instance. Resume on the next interaction.
 */
function hookGesture() {
  if (gestureHooked || typeof window === "undefined") return;
  gestureHooked = true;
  const resume = () => {
    if (ctx && ctx.state === "suspended") void ctx.resume();
  };
  window.addEventListener("pointerdown", resume, { passive: true });
  window.addEventListener("keydown", resume);
}

function noiseBuffer(c: AudioContext): AudioBuffer {
  if (!noise) {
    const len = Math.floor(c.sampleRate * 0.5);
    noise = c.createBuffer(1, len, c.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  }
  return noise;
}

interface ToneOpts {
  freq: number;
  /** Glide target by the end of the cue. */
  to?: number;
  type?: OscillatorType;
  dur?: number;
  peak?: number;
  attack?: number;
  delay?: number;
}

function tone(c: AudioContext, dest: AudioNode, o: ToneOpts) {
  const t0 = c.currentTime + (o.delay ?? 0);
  const dur = o.dur ?? 0.12;
  const attack = Math.min(o.attack ?? 0.004, dur * 0.5);

  const osc = c.createOscillator();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.freq, t0);
  if (o.to !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.to), t0 + dur);
  }

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(o.peak ?? 0.06, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(g).connect(dest);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

interface BurstOpts {
  dur?: number;
  freq?: number;
  q?: number;
  type?: BiquadFilterType;
  peak?: number;
  delay?: number;
}

/** Filtered noise — clicks, ticks, impacts. */
function burst(c: AudioContext, dest: AudioNode, o: BurstOpts = {}) {
  const t0 = c.currentTime + (o.delay ?? 0);
  const dur = o.dur ?? 0.02;

  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;

  const filter = c.createBiquadFilter();
  filter.type = o.type ?? "bandpass";
  filter.frequency.value = o.freq ?? 1800;
  filter.Q.value = o.q ?? 1;

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(o.peak ?? 0.05, t0 + Math.min(0.002, dur * 0.4));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  src.connect(filter).connect(g).connect(dest);
  // Random offset so repeated ticks are not identical.
  src.start(t0, Math.random() * 0.4);
  src.stop(t0 + dur + 0.02);
}

const CUES: Record<CueName, (c: AudioContext, out: AudioNode) => void> = {
  /** Drive spinning up behind the first boot lines. */
  "boot-start": (c, out) => {
    tone(c, out, { freq: 38, to: 88, dur: 0.9, peak: 0.09, attack: 0.3 });
    burst(c, out, { dur: 0.5, freq: 240, type: "lowpass", peak: 0.025 });
  },

  "boot-line": (c, out) => {
    burst(c, out, {
      dur: 0.014,
      freq: 2400 + Math.random() * 900,
      q: 1.4,
      peak: 0.026,
    });
  },

  /** Case file loaded — low swell, one high shimmer well behind it. */
  "case-reveal": (c, out) => {
    tone(c, out, { freq: 110, dur: 1.6, peak: 0.1, attack: 0.14 });
    tone(c, out, { freq: 220, dur: 1.3, peak: 0.045, attack: 0.2 });
    tone(c, out, {
      freq: 660,
      type: "triangle",
      dur: 0.9,
      peak: 0.028,
      attack: 0.3,
      delay: 0.2,
    });
  },

  click: (c, out) => {
    burst(c, out, { dur: 0.012, freq: 1700, q: 1.1, peak: 0.03 });
    tone(c, out, { freq: 320, type: "square", dur: 0.02, peak: 0.01 });
  },

  "window-open": (c, out) => {
    tone(c, out, { freq: 200, to: 420, dur: 0.13, peak: 0.045 });
  },

  "window-close": (c, out) => {
    tone(c, out, { freq: 380, to: 160, dur: 0.11, peak: 0.04 });
  },

  /** New evidence. A restrained two-note figure, not a reward jingle. */
  evidence: (c, out) => {
    tone(c, out, { freq: 587.33, type: "triangle", dur: 0.16, peak: 0.055 });
    tone(c, out, {
      freq: 784,
      type: "triangle",
      dur: 0.34,
      peak: 0.05,
      attack: 0.01,
      delay: 0.13,
    });
  },

  notice: (c, out) => {
    tone(c, out, { freq: 520, type: "triangle", dur: 0.12, peak: 0.03 });
  },

  "unlock-success": (c, out) => {
    tone(c, out, { freq: 440, type: "triangle", dur: 0.1, peak: 0.045 });
    tone(c, out, { freq: 660, type: "triangle", dur: 0.1, peak: 0.045, delay: 0.08 });
    tone(c, out, { freq: 880, type: "triangle", dur: 0.3, peak: 0.04, delay: 0.16 });
  },

  /** Dull and mechanical. Wrong, not punishing. */
  "unlock-fail": (c, out) => {
    tone(c, out, { freq: 150, to: 110, type: "square", dur: 0.2, peak: 0.04 });
    burst(c, out, { dur: 0.07, freq: 320, type: "lowpass", peak: 0.025 });
  },

  pin: (c, out) => {
    burst(c, out, { dur: 0.03, freq: 1100, q: 1.6, peak: 0.04 });
    tone(c, out, { freq: 190, to: 120, dur: 0.07, peak: 0.045 });
  },

  unpin: (c, out) => {
    tone(c, out, { freq: 280, to: 180, dur: 0.09, peak: 0.028 });
  },

  /** Filing the report: a stamp with weight behind it. */
  submit: (c, out) => {
    burst(c, out, { dur: 0.05, freq: 700, type: "lowpass", peak: 0.085 });
    tone(c, out, { freq: 90, to: 62, dur: 0.45, peak: 0.12, attack: 0.002 });
    tone(c, out, { freq: 300, type: "triangle", dur: 0.18, peak: 0.028, delay: 0.03 });
  },

  "verdict-good": (c, out) => {
    tone(c, out, { freq: 392, type: "triangle", dur: 0.5, peak: 0.055, attack: 0.02 });
    tone(c, out, {
      freq: 587.33,
      type: "triangle",
      dur: 0.6,
      peak: 0.045,
      attack: 0.02,
      delay: 0.16,
    });
    tone(c, out, { freq: 784, dur: 1.1, peak: 0.035, attack: 0.12, delay: 0.32 });
  },

  "verdict-bad": (c, out) => {
    tone(c, out, { freq: 330, type: "triangle", dur: 0.5, peak: 0.05, attack: 0.02 });
    tone(c, out, {
      freq: 247,
      type: "triangle",
      dur: 0.7,
      peak: 0.045,
      attack: 0.02,
      delay: 0.18,
    });
    tone(c, out, { freq: 110, dur: 1.2, peak: 0.055, attack: 0.14, delay: 0.34 });
  },
};

/** Evidence-room hum: filtered noise, mains buzz, and a very slow drift. */
function startSynthAmbient(c: AudioContext, out: AudioNode): () => void {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 220;
  lp.Q.value = 0.7;

  const noiseGain = c.createGain();
  noiseGain.gain.value = 0.0001;

  const hum = c.createOscillator();
  hum.frequency.value = 50;
  const harmonic = c.createOscillator();
  harmonic.frequency.value = 100;
  const humGain = c.createGain();
  humGain.gain.value = 0.0001;

  // Without this the tone sits perfectly still and reads as a dead loop.
  const drift = c.createOscillator();
  drift.frequency.value = 0.06;
  const driftDepth = c.createGain();
  driftDepth.gain.value = 40;
  drift.connect(driftDepth).connect(lp.frequency);

  src.connect(lp).connect(noiseGain).connect(out);
  hum.connect(humGain).connect(out);
  harmonic.connect(humGain);

  const t = c.currentTime;
  noiseGain.gain.linearRampToValueAtTime(0.032, t + 2.5);
  humGain.gain.linearRampToValueAtTime(0.011, t + 2.5);

  src.start();
  hum.start();
  harmonic.start();
  drift.start();

  return () => {
    const now = c.currentTime;
    noiseGain.gain.cancelScheduledValues(now);
    humGain.gain.cancelScheduledValues(now);
    noiseGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    humGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    window.setTimeout(() => {
      for (const node of [src, hum, harmonic, drift]) {
        try {
          node.stop();
        } catch {
          // Already stopped.
        }
      }
    }, 800);
  };
}

async function startFileAmbient(
  c: AudioContext,
  out: AudioNode,
  url: string,
): Promise<(() => void) | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await c.decodeAudioData(await res.arrayBuffer());

    const src = c.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const g = c.createGain();
    g.gain.value = 0.0001;
    src.connect(g).connect(out);
    g.gain.linearRampToValueAtTime(0.3, c.currentTime + 2.5);
    src.start();

    return () => {
      const now = c.currentTime;
      g.gain.cancelScheduledValues(now);
      g.gain.linearRampToValueAtTime(0.0001, now + 0.6);
      window.setTimeout(() => {
        try {
          src.stop();
        } catch {
          // Already stopped.
        }
      }, 800);
    };
  } catch {
    return null;
  }
}

export const audio = {
  setEnabled(on: boolean) {
    enabled = on;
    if (!on) {
      if (master) master.gain.value = 0;
      return;
    }
    const c = getCtx();
    if (!c || !master) return;
    master.gain.value = volume;
    if (c.state === "suspended") void c.resume();
  },

  setVolume(value: number) {
    volume = Math.min(1, Math.max(0, value));
    if (master && enabled) master.gain.value = volume;
  },

  play(cue: CueName) {
    if (!enabled) return;

    const now = Date.now();
    if (now - (lastAt.get(cue) ?? 0) < COOLDOWN_MS) return;

    recent = recent.filter((t) => now - t < BURST_WINDOW_MS);
    if (recent.length >= BURST_MAX) return;

    const c = getCtx();
    if (!c || !master) return;
    if (c.state === "suspended") {
      // No gesture yet — drop the cue rather than queue a delayed blast.
      void c.resume();
      return;
    }

    lastAt.set(cue, now);
    recent.push(now);
    try {
      CUES[cue](c, master);
    } catch {
      // Audio must never break the investigation.
    }
  },

  startAmbient() {
    if (!enabled || ambientStop) return;
    const c = getCtx();
    if (!c || !master) return;
    const out = master;

    if (AMBIENT_SOURCE === "synth") {
      ambientStop = startSynthAmbient(c, out);
      return;
    }

    void startFileAmbient(c, out, AMBIENT_SOURCE).then((stop) => {
      if (!enabled) {
        stop?.();
        return;
      }
      ambientStop = stop ?? startSynthAmbient(c, out);
    });
  },

  stopAmbient() {
    ambientStop?.();
    ambientStop = null;
  },
};
