"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/game/store";
import { usePrefs } from "@/game/prefs";
import { audio } from "./engine";

/** Interactive elements that should click. Excluded via `data-no-sound`. */
const CLICKABLE = 'button,a[href],[role="button"],label,summary';

/**
 * Wires the audio engine to the game without scattering play() calls through
 * the app. Most cues are derivable from state transitions, and clicks are
 * caught once by delegation, so app components stay unaware of audio.
 */
export function AudioBridge() {
  const soundEnabled = usePrefs((s) => s.soundEnabled);
  const volume = usePrefs((s) => s.volume);
  const mounted = useRef(false);

  useEffect(() => {
    audio.setEnabled(soundEnabled);

    // Unmuting is otherwise silent until something happens to make a noise.
    if (mounted.current && soundEnabled) audio.play("notice");
    mounted.current = true;
  }, [soundEnabled]);

  useEffect(() => {
    audio.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    if (!soundEnabled) {
      audio.stopAmbient();
      return;
    }
    audio.startAmbient();
    return () => audio.stopAmbient();
  }, [soundEnabled]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const el = target.closest(CLICKABLE);
      if (!el || el.closest("[data-no-sound]")) return;
      if (el instanceof HTMLButtonElement && el.disabled) return;

      audio.play("click");
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  /*
   * Cues ordered by importance: the burst cap in the engine drops whatever
   * comes last, and a window chirp matters less than new evidence landing.
   */
  useEffect(() => {
    const initial = useGame.getState();
    let toasts = initial.toasts.length;
    let unlocked = initial.unlocked.length;
    let submitted = Boolean(initial.submission);
    let pins = initial.pins.length;
    let windows = initial.windows.length;

    return useGame.subscribe((s) => {
      if (s.unlocked.length > unlocked) audio.play("unlock-success");

      if (s.toasts.length > toasts) {
        const latest = s.toasts[s.toasts.length - 1];
        // Neutral toasts are confirmations of something the player just did,
        // which already made a sound. Only the amber ones announce news.
        if (latest?.tone === "amber") audio.play("evidence");
      }

      const nowSubmitted = Boolean(s.submission);
      if (nowSubmitted && !submitted) audio.play("submit");

      if (s.pins.length > pins) audio.play("pin");
      else if (s.pins.length < pins) audio.play("unpin");

      if (s.windows.length > windows) audio.play("window-open");
      else if (s.windows.length < windows) audio.play("window-close");

      toasts = s.toasts.length;
      unlocked = s.unlocked.length;
      submitted = nowSubmitted;
      pins = s.pins.length;
      windows = s.windows.length;
    });
  }, []);

  return null;
}
