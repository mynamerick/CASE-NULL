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

/** Room ambient loop — served from public/audio/. */
const AMBIENT_SOURCE = "/audio/room-tone.mp3";
const AMBIENT_FADE_IN_SEC = 0.8;
const AMBIENT_PEAK_GAIN = 0.5;

/**
 * Laptop speakers roll off steeply below roughly 300 Hz and have little output
 * to spare, so the cues are mixed hot and a compressor catches the overlaps
 * rather than the mix being kept quiet enough to never need one.
 */
const MASTER_TRIM = 2.4;

/** Stops a repeated cue from stacking into mush. */
const COOLDOWN_MS = 40;

/**
 * One action often trips several cues — pinning an item also raises a toast and
 * opens the board. Cap how many can start together and let callers fire the
 * important cue first; the rest are dropped rather than layered.
 */
const BURST_WINDOW_MS = 60;
const BURST_MAX = 3;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let ambientStop: (() => void) | null = null;
let ambientEl: HTMLAudioElement | null = null;
let ambientElSource: MediaElementAudioSourceNode | null = null;
let ambientGain: GainNode | null = null;
/** Serialises overlapping start attempts on the single ambient element. */
let ambientStarting = false;
/** True while /play wants room tone — survives until stopAmbient or unmount. */
let ambientWanted = false;
/** Invalidates in-flight ambient starts when leaving /play or calling stop. */
let ambientGeneration = 0;
let enabled = false;
let volume = 1.0;
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

  const trim = ctx.createGain();
  trim.gain.value = MASTER_TRIM;

  // Only engages when cues overlap or ambient and a cue land together.
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -8;
  comp.knee.value = 6;
  comp.ratio.value = 6;
  comp.attack.value = 0.003;
  comp.release.value = 0.12;

  master.connect(trim).connect(comp).connect(ctx.destination);
  hookGesture();
  return ctx;
}

/**
 * The autoplay policy only lifts on a real gesture, and client-side navigation
 * keeps the same document — so the click that opens a case from the catalog is
 * the one that unlocks playback, and the boot terminal has sound from its first
 * line. Listeners stay attached because the first resume can still be refused.
 */
function hookGesture() {
  if (gestureHooked || typeof window === "undefined") return;
  gestureHooked = true;
  const unlock = () => {
    const c = getCtx();
    if (!c) return;
    void resumeContext(c).then(maybeKickAmbient);
  };
  window.addEventListener("pointerdown", unlock, { capture: true, passive: true });
  window.addEventListener("keydown", unlock, { capture: true });
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

/*
 * Every cue carries its weight in the 300 Hz–3 kHz band. The low layers are
 * still there for headphones and desk speakers, but nothing depends on them
 * alone: a cue whose only content is a 40 Hz rumble does not exist on a laptop.
 */
const CUES: Record<CueName, (c: AudioContext, out: AudioNode) => void> = {
  /** Drive spinning up behind the first boot lines. */
  "boot-start": (c, out) => {
    tone(c, out, { freq: 55, to: 130, dur: 0.9, peak: 0.14, attack: 0.3 });
    tone(c, out, { freq: 220, to: 330, type: "triangle", dur: 0.8, peak: 0.09, attack: 0.25 });
    burst(c, out, { dur: 0.6, freq: 620, type: "lowpass", peak: 0.07 });
  },

  "boot-line": (c, out) => {
    burst(c, out, {
      dur: 0.03,
      freq: 2400 + Math.random() * 900,
      q: 1.4,
      peak: 0.085,
    });
  },

  /** Case file loaded — low swell, one high shimmer well behind it. */
  "case-reveal": (c, out) => {
    tone(c, out, { freq: 110, dur: 1.6, peak: 0.16, attack: 0.14 });
    tone(c, out, { freq: 220, dur: 1.3, peak: 0.12, attack: 0.2 });
    tone(c, out, { freq: 440, type: "triangle", dur: 1.1, peak: 0.08, attack: 0.22 });
    tone(c, out, {
      freq: 660,
      type: "triangle",
      dur: 0.9,
      peak: 0.06,
      attack: 0.3,
      delay: 0.2,
    });
  },

  click: (c, out) => {
    burst(c, out, { dur: 0.018, freq: 1700, q: 1.1, peak: 0.09 });
    tone(c, out, { freq: 420, type: "square", dur: 0.025, peak: 0.04 });
  },

  "window-open": (c, out) => {
    tone(c, out, { freq: 260, to: 520, dur: 0.13, peak: 0.12 });
  },

  "window-close": (c, out) => {
    tone(c, out, { freq: 520, to: 240, dur: 0.12, peak: 0.11 });
  },

  /** New evidence. A restrained two-note figure, not a reward jingle. */
  evidence: (c, out) => {
    tone(c, out, { freq: 587.33, type: "triangle", dur: 0.16, peak: 0.14 });
    tone(c, out, {
      freq: 784,
      type: "triangle",
      dur: 0.34,
      peak: 0.12,
      attack: 0.01,
      delay: 0.13,
    });
  },

  notice: (c, out) => {
    tone(c, out, { freq: 520, type: "triangle", dur: 0.12, peak: 0.09 });
  },

  "unlock-success": (c, out) => {
    tone(c, out, { freq: 440, type: "triangle", dur: 0.1, peak: 0.12 });
    tone(c, out, { freq: 660, type: "triangle", dur: 0.1, peak: 0.12, delay: 0.08 });
    tone(c, out, { freq: 880, type: "triangle", dur: 0.3, peak: 0.1, delay: 0.16 });
  },

  /** Dull and mechanical. Wrong, not punishing. */
  "unlock-fail": (c, out) => {
    tone(c, out, { freq: 240, to: 150, type: "square", dur: 0.22, peak: 0.1 });
    burst(c, out, { dur: 0.09, freq: 520, type: "lowpass", peak: 0.07 });
  },

  pin: (c, out) => {
    burst(c, out, { dur: 0.035, freq: 1100, q: 1.6, peak: 0.11 });
    tone(c, out, { freq: 330, to: 190, dur: 0.08, peak: 0.1 });
  },

  unpin: (c, out) => {
    tone(c, out, { freq: 340, to: 210, dur: 0.1, peak: 0.08 });
  },

  /** Filing the report: a stamp with weight behind it. */
  submit: (c, out) => {
    burst(c, out, { dur: 0.055, freq: 900, type: "lowpass", peak: 0.16 });
    tone(c, out, { freq: 90, to: 62, dur: 0.45, peak: 0.16, attack: 0.002 });
    tone(c, out, { freq: 210, to: 140, dur: 0.3, peak: 0.11, attack: 0.002 });
    tone(c, out, { freq: 420, type: "triangle", dur: 0.18, peak: 0.09, delay: 0.03 });
  },

  "verdict-good": (c, out) => {
    tone(c, out, { freq: 392, type: "triangle", dur: 0.5, peak: 0.14, attack: 0.02 });
    tone(c, out, {
      freq: 587.33,
      type: "triangle",
      dur: 0.6,
      peak: 0.12,
      attack: 0.02,
      delay: 0.16,
    });
    tone(c, out, { freq: 784, dur: 1.1, peak: 0.09, attack: 0.12, delay: 0.32 });
  },

  "verdict-bad": (c, out) => {
    tone(c, out, { freq: 330, type: "triangle", dur: 0.5, peak: 0.13, attack: 0.02 });
    tone(c, out, {
      freq: 247,
      type: "triangle",
      dur: 0.7,
      peak: 0.12,
      attack: 0.02,
      delay: 0.18,
    });
    tone(c, out, { freq: 220, dur: 1.2, peak: 0.1, attack: 0.14, delay: 0.34 });
    tone(c, out, { freq: 110, dur: 1.2, peak: 0.1, attack: 0.14, delay: 0.34 });
  },
};

function ensureAmbientElement(): HTMLAudioElement {
  if (!ambientEl) {
    ambientEl = new Audio(AMBIENT_SOURCE);
    ambientEl.loop = true;
    ambientEl.preload = "auto";
  }
  return ambientEl;
}

function resumeContext(c: AudioContext): Promise<void> {
  if (c.state === "running") return Promise.resolve();
  return c.resume().then(() => undefined);
}

/**
 * Room tone is one long loop on a single element, so "start" means "make sure
 * it is running" — every cue takes a cheap shot at this because the first
 * attempt on a fresh load is usually refused by the autoplay policy.
 */
function maybeKickAmbient() {
  if (ambientWanted && enabled) void beginAmbientPlayback();
}

async function beginAmbientPlayback() {
  if (ambientStarting) return;

  const c = getCtx();
  if (!c || !master || !enabled || !ambientWanted) return;

  const el = ensureAmbientElement();
  if (ambientStop && !el.paused) return;

  ambientStarting = true;
  const gen = ambientGeneration;
  try {
    await resumeContext(c);
    if (c.state !== "running" || gen !== ambientGeneration) return;
    if (!enabled || !ambientWanted) return;

    if (!ambientElSource) {
      ambientElSource = c.createMediaElementSource(el);
      ambientGain = c.createGain();
      ambientElSource.connect(ambientGain).connect(master);
    }

    const gain = ambientGain!;
    gain.gain.cancelScheduledValues(c.currentTime);
    gain.gain.setValueAtTime(0.0001, c.currentTime);
    gain.gain.linearRampToValueAtTime(AMBIENT_PEAK_GAIN, c.currentTime + AMBIENT_FADE_IN_SEC);

    await el.play();
    if (gen !== ambientGeneration || !enabled || !ambientWanted) {
      el.pause();
      el.currentTime = 0;
      return;
    }

    ambientStop = () => {
      const now = c.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
      window.setTimeout(() => {
        if (ambientWanted) return;
        el.pause();
        el.currentTime = 0;
      }, 500);
    };
  } catch {
    // Refused for now; the next gesture or cue tries again.
  } finally {
    ambientStarting = false;
  }
}

export const audio = {
  /**
   * Watch for the first gesture anywhere on the site without building an audio
   * graph for visitors who never open a case.
   */
  prime() {
    hookGesture();
  },

  /** True once the context is actually running and cues will be heard. */
  ready(): boolean {
    return Boolean(ctx && ctx.state === "running");
  },

  /**
   * Resolves to whether playback is available now. A refused resume can leave
   * the promise pending indefinitely, so give it a deadline and read the state.
   */
  async unlock(): Promise<boolean> {
    const c = getCtx();
    if (!c) return false;

    if (c.state !== "running") {
      try {
        await Promise.race([
          resumeContext(c),
          new Promise((resolve) => window.setTimeout(resolve, 300)),
        ]);
      } catch {
        // Refused — the caller decides what to do about it.
      }
    }

    const ok = c.state === "running";
    if (ok) maybeKickAmbient();
    return ok;
  },

  /** Warm the room-tone element while the player browses the catalog. */
  preloadAmbient(): Promise<null> {
    if (typeof window === "undefined") return Promise.resolve(null);
    ensureAmbientElement().load();
    return Promise.resolve(null);
  },
  setEnabled(on: boolean) {
    enabled = on;
    if (!on) {
      if (master) master.gain.value = 0;
      return;
    }
    const c = getCtx();
    if (!c || !master) return;
    master.gain.value = volume;
    void resumeContext(c).then(maybeKickAmbient);
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
      // No gesture yet — drop the cue rather than queue a delayed blast, but
      // take the chance to unlock the context and pick up room tone.
      void resumeContext(c).then(maybeKickAmbient);
      return;
    }

    lastAt.set(cue, now);
    recent.push(now);
    try {
      CUES[cue](c, master);
      maybeKickAmbient();
    } catch {
      // Audio must never break the investigation.
    }
  },

  startAmbient() {
    if (!enabled) return;
    ambientWanted = true;
    void beginAmbientPlayback();
  },

  stopAmbient() {
    ambientWanted = false;
    ambientGeneration += 1;
    ambientStop?.();
    ambientStop = null;
    if (ambientEl) {
      ambientEl.pause();
      ambientEl.currentTime = 0;
    }
  },
};
