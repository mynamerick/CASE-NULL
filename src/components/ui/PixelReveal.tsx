"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type PixelRevealOrder = "random" | "ltr" | "rtl" | "ttb" | "btt";
export type PixelRevealTrigger = "viewport" | "immediate";

type PixelRevealOwnProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  /** Side length of each mask block in CSS pixels. Default 8. */
  blockSize?: number;
  /** Total reveal duration in ms. Default 550. */
  duration?: number;
  /** Delay before the reveal starts, in ms. Default 0. */
  delay?: number;
  /** Block disappearance order. Default "random". */
  order?: PixelRevealOrder;
  /** When to start the animation. Default "viewport". */
  trigger?: PixelRevealTrigger;
  /** Only animate the first time the element enters the viewport. Default true. */
  once?: boolean;
  /** Briefly re-flash a few blocks mid-reveal. Default true. */
  flicker?: boolean;
  /** Override mask block colour (CSS colour). Sampled from background when omitted. */
  blockColor?: string;
  rootMargin?: string;
  threshold?: number;
};

export type PixelRevealProps<T extends ElementType = "span"> = PixelRevealOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PixelRevealOwnProps<T> | "as" | "children">;

interface MaskBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  revealAt: number;
  flickerAt: number | null;
  revealed: boolean;
  flickerUntil: number;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseRgb(color: string): [number, number, number] | null {
  const m = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function resolveBackground(el: HTMLElement): string {
  let node: HTMLElement | null = el;
  for (let i = 0; i < 8 && node; i++) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
    node = node.parentElement;
  }
  return "rgb(8, 9, 11)";
}

function blockColorAt(base: string, rand: () => number): string {
  const rgb = parseRgb(base);
  if (!rgb) return base;
  const drift = () => Math.round((rand() - 0.5) * 18);
  const [r, g, b] = rgb.map((v) => Math.min(255, Math.max(0, v + drift()))) as [
    number,
    number,
    number,
  ];
  return `rgb(${r}, ${g}, ${b})`;
}

function buildRevealSchedule(
  cols: number,
  rows: number,
  order: PixelRevealOrder,
  duration: number,
  rand: () => number,
): number[] {
  const indices = Array.from({ length: cols * rows }, (_, i) => i);

  if (order === "random") {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  } else {
    indices.sort((a, b) => {
      const ax = a % cols;
      const ay = Math.floor(a / cols);
      const bx = b % cols;
      const by = Math.floor(b / cols);
      switch (order) {
        case "ltr":
          return ay - by || ax - bx;
        case "rtl":
          return ay - by || bx - ax;
        case "ttb":
          return ax - bx || ay - by;
        case "btt":
          return ax - bx || by - ay;
        default:
          return 0;
      }
    });
  }

  const total = indices.length;
  const schedule = new Array<number>(total).fill(0);
  indices.forEach((blockIndex, rank) => {
    const base = (rank / Math.max(total - 1, 1)) * duration;
    const jitter = (rand() - 0.5) * Math.min(48, duration * 0.12);
    schedule[blockIndex] = Math.max(0, base + jitter);
  });
  return schedule;
}

export function PixelReveal<T extends ElementType = "span">({
  as,
  children,
  className,
  blockSize = 8,
  duration = 550,
  delay = 0,
  order = "random",
  trigger = "viewport",
  once = true,
  flicker = true,
  blockColor,
  rootMargin = "0px 0px -8% 0px",
  threshold = 0.2,
  ...rest
}: PixelRevealProps<T>) {
  const Component = (as ?? "span") as ElementType;
  const reduceMotion = useReducedMotion();
  const seed = useId();

  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blocksRef = useRef<MaskBlock[]>([]);
  const rafRef = useRef<number>(0);
  const startedRef = useRef(false);
  const doneRef = useRef(false);
  const armAnimRef = useRef(false);

  const [overlayVisible, setOverlayVisible] = useState(false);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const rect = root.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    for (const block of blocksRef.current) {
      const visible = !block.revealed || performance.now() < block.flickerUntil;
      if (!visible) continue;
      ctx.fillStyle = block.color;
      ctx.fillRect(block.x, block.y, block.w, block.h);
    }
  }, []);

  const buildBlocks = useCallback(() => {
    const root = rootRef.current;
    if (!root) return false;

    const rect = root.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w < 2 || h < 2) return false;

    const cols = Math.ceil(w / blockSize);
    const rows = Math.ceil(h / blockSize);
    const rand = mulberry32(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
    const baseColor = blockColor ?? resolveBackground(root);
    const schedule = buildRevealSchedule(cols, rows, order, duration, rand);

    const flickerCount = flicker ? Math.max(1, Math.round((cols * rows) * 0.04)) : 0;
    const flickerSet = new Set<number>();
    while (flickerSet.size < flickerCount) {
      flickerSet.add(Math.floor(rand() * cols * rows));
    }

    const blocks: MaskBlock[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        const x = col * blockSize;
        const y = row * blockSize;
        const bw = col === cols - 1 ? w - x : blockSize;
        const bh = row === rows - 1 ? h - y : blockSize;
        const revealAt = schedule[index] ?? 0;
        const flickerAt =
          flickerSet.has(index) ? revealAt + 40 + rand() * (duration * 0.45) : null;

        blocks.push({
          x,
          y,
          w: bw,
          h: bh,
          color: blockColorAt(baseColor, rand),
          revealAt,
          flickerAt,
          revealed: false,
          flickerUntil: 0,
        });
      }
    }

    blocksRef.current = blocks;
    return true;
  }, [blockColor, blockSize, duration, flicker, order, seed]);

  const startAnimation = useCallback(() => {
    const flickerDuration = 42;
    const start = performance.now() + delay;

    const tick = (now: number) => {
      if (doneRef.current) return;

      const elapsed = now - start;
      let allRevealed = true;

      for (const block of blocksRef.current) {
        if (!block.revealed && elapsed >= block.revealAt) {
          block.revealed = true;
        }

        if (
          block.flickerAt !== null &&
          elapsed >= block.flickerAt &&
          block.flickerUntil === 0
        ) {
          block.flickerUntil = now + flickerDuration;
        }

        if (!block.revealed || now < block.flickerUntil) {
          allRevealed = false;
        }
      }

      paint();

      if (allRevealed && elapsed >= duration + 80) {
        doneRef.current = true;
        setOverlayVisible(false);
        blocksRef.current = [];
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    paint();
    rafRef.current = requestAnimationFrame(tick);
  }, [delay, duration, paint]);

  const runReveal = useCallback(() => {
    if (startedRef.current || doneRef.current || reduceMotion) return;
    if (!buildBlocks()) return;

    startedRef.current = true;
    armAnimRef.current = true;
    setOverlayVisible(true);
  }, [buildBlocks, reduceMotion]);

  useLayoutEffect(() => {
    if (!overlayVisible || !armAnimRef.current) return;
    armAnimRef.current = false;
    startAnimation();
  }, [overlayVisible, startAnimation]);

  useEffect(() => {
    if (reduceMotion) {
      setOverlayVisible(false);
      return;
    }

    if (trigger === "immediate") {
      runReveal();
      return;
    }

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        runReveal();
        if (once) observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, reduceMotion, rootMargin, runReveal, threshold, trigger]);

  useEffect(() => {
    if (reduceMotion || doneRef.current || !overlayVisible) return;

    const node = rootRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      if (!startedRef.current) buildBlocks();
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [buildBlocks, overlayVisible, reduceMotion]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <Component
      ref={rootRef}
      className={cn("relative w-fit max-w-full", className)}
      {...rest}
    >
      {children}
      {overlayVisible ? (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
        />
      ) : null}
    </Component>
  );
}
