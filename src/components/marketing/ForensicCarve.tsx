"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const ROW_H = 24;
const HEX_CLASS = "font-mono text-[13px] leading-none";

const MIN_ROWS = 8;
const MAX_ROWS = 26;
const MIN_BYTES = 8;
const MAX_BYTES = 48;

const OFFSET_PX = 72; // w-[4.5rem]
const GAP_PX = 24; // two gap-3 columns between offset / hex / ascii

const TICK_MS = 100;
const SETTLE = 2;
const HOLD_TICKS = 24;

/**
 * Each pass carves one sector. `chunk` is MAX_BYTES characters and gets sliced to
 * whatever the row actually fits, so the hex on the hit row is always the literal
 * encoding of the glyphs printed beside it.
 */
const PASSES = [
  {
    base: 0x04a1c0,
    ratio: 0.42,
    chunk: "meet me at the lot, 11 pm - dont b",
    fragment: "meet me at the lot, 11",
    source: "SMS deleted 21:47",
    sha: "9F3C…D41A",
  },
  {
    base: 0x0b27a0,
    ratio: 0.74,
    chunk: "delete this once it's sent - wipe ",
    fragment: "delete this once it's sent",
    source: "Notes overwritten",
    sha: "4A81…07E2",
  },
  {
    base: 0x11f480,
    ratio: 0.23,
    chunk: "he was never on the boat that nigh",
    fragment: "he was never on the boat",
    source: "Voicemail transcript",
    sha: "C60D…B935",
  },
] as const;

function byteAt(pass: number, row: number, col: number, salt: number) {
  let h =
    Math.imul(pass + 1, 73856093) ^
    Math.imul(row + 1, 19349663) ^
    Math.imul(col + 1, 83492791) ^
    Math.imul(salt + 1, 2654435761);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) & 0xff;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const hex2 = (n: number) => n.toString(16).toUpperCase().padStart(2, "0");
const glyph = (n: number) => (n >= 32 && n <= 126 ? String.fromCharCode(n) : ".");
const offset = (n: number) => n.toString(16).toUpperCase().padStart(6, "0");

export function ForensicCarve() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  const hexRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  // Sized to the space the readout is actually given, so it fills the column on
  // any viewport instead of being pinned to one hard-coded shape.
  const [grid, setGrid] = useState({ rows: 16, bytes: 12 });

  useEffect(() => {
    const hex = hexRef.current;
    const probe = probeRef.current;
    if (!hex || !probe) return;

    const measure = () => {
      const charW = probe.getBoundingClientRect().width / 10;
      if (!charW) return;
      const { width, height } = hex.getBoundingClientRect();
      // Each byte costs 3 hex chars + 1 ascii char in this mono face.
      const bytes = clamp(
        Math.floor((width - GAP_PX - OFFSET_PX) / (4 * charW)),
        MIN_BYTES,
        MAX_BYTES,
      );
      const rows = clamp(Math.floor(height / ROW_H), MIN_ROWS, MAX_ROWS);
      setGrid((prev) =>
        prev.rows === rows && prev.bytes === bytes ? prev : { rows, bytes },
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hex);
    return () => ro.disconnect();
  }, []);

  const { rows, bytes: BYTES } = grid;
  const scanTicks = rows * SETTLE;
  const cycle = scanTicks + HOLD_TICKS;

  useEffect(() => {
    // Reduced motion still gets the readout, just jumped straight to a carved and
    // verified sector. Deferred through a timer so the server and the first client
    // render agree before the state lands.
    if (reduce) {
      const id = window.setTimeout(() => setTick(scanTicks + 6), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => window.clearInterval(id);
  }, [reduce, scanTicks]);

  const passIndex = Math.floor(tick / cycle) % PASSES.length;
  const pass = PASSES[passIndex];
  const t = tick % cycle;

  const cursor = Math.min(Math.floor(t / SETTLE), rows);
  const pct = Math.min(100, Math.round((t / scanTicks) * 100));
  const hitRow = clamp(Math.round(rows * pass.ratio), 1, rows - 2);
  const carved = cursor > hitRow;
  const done = cursor >= rows;
  const meterCells = clamp(Math.round(rows * 2.4), 20, 48);
  const filled = Math.round((pct / 100) * meterCells);

  // Until this sector's fragment surfaces, the last one stays on the readout.
  const result = carved ? pass : PASSES[(passIndex + PASSES.length - 1) % PASSES.length];

  return (
    <div aria-hidden className="flex h-full w-full flex-col pl-24 opacity-50">
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="tnum text-ink-faint">Sector 0x{offset(pass.base)}</span>
        <span className="text-amber">MP26-0431</span>
      </div>

      <div ref={hexRef} className="relative mt-5 min-h-0 flex-1 overflow-hidden">
        <span
          ref={probeRef}
          className={`pointer-events-none absolute -z-10 select-none opacity-0 ${HEX_CLASS}`}
        >
          0123456789
        </span>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 border-b border-amber/45 bg-amber/[0.08] transition-transform duration-100 ease-linear will-change-transform"
          style={{ height: ROW_H, transform: `translateY(${cursor * ROW_H}px)` }}
        />

        {Array.from({ length: rows }, (_, i) => {
          const settled = i < cursor;
          const active = i === cursor;
          const hit = settled && i === hitRow;

          const cells = Array.from({ length: BYTES }, (_, c) => {
            if (hit && c < pass.chunk.length) return pass.chunk.charCodeAt(c);
            return byteAt(passIndex, i, c, active ? tick : 0);
          });

          return (
            <div
              key={i}
              className={`tnum relative flex w-full items-center gap-3 whitespace-nowrap ${HEX_CLASS}`}
              style={{ height: ROW_H }}
            >
              <span className="w-[4.5rem] shrink-0 text-ink-ghost">
                {offset(pass.base + i * 16)}
              </span>

              {settled || active ? (
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={
                      hit ? "text-amber" : active ? "text-ink-faint/60" : "text-ink-faint"
                    }
                  >
                    {cells.map(hex2).join(" ")}
                  </span>
                  <span className={`shrink-0 ${hit ? "text-amber/80" : "text-ink-ghost"}`}>
                    {cells.map(glyph).join("")}
                  </span>
                </div>
              ) : (
                <span className="min-w-0 flex-1 text-ink-ghost/35">
                  {"·· ".repeat(BYTES).trim()}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 shrink-0 border-t border-line/45 pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-ghost">
          Recovered
        </p>
        <p
          className={`mt-2 h-7 truncate font-mono text-[17px] leading-7 ${
            carved ? "text-amber" : "text-ink-ghost"
          }`}
        >
          {`\u201C${result.fragment}\u201D`}
        </p>
        <p className="mt-1.5 h-4 font-mono text-[10px] uppercase leading-4 tracking-[0.16em] text-ink-faint">
          {result.source}
        </p>

        <div className="mt-6 flex gap-[3px]">
          {Array.from({ length: meterCells }, (_, i) => (
            <span
              key={i}
              className={`h-[6px] flex-1 ${i < filled ? "bg-amber-dim" : "bg-line"}`}
            />
          ))}
        </div>

        <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
          <span className="text-ink-ghost">{done ? "Block verified" : "Carving"}</span>
          <span className={done ? "text-verified" : "tnum text-ink-faint"}>
            {done ? pass.sha : `${pct}%`}
          </span>
        </div>
      </div>
    </div>
  );
}
