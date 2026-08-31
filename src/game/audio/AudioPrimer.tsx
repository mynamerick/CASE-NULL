"use client";

import { useEffect } from "react";
import { audio } from "./engine";

/**
 * Claims the first gesture made anywhere on the site. Navigating to a case is
 * a click in the same document, so by the time the workstation boots the audio
 * context is already running and the terminal is heard from its first line.
 */
export function AudioPrimer() {
  useEffect(() => {
    audio.prime();
  }, []);

  return null;
}
