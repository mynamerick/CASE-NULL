"use client";

import { useEffect } from "react";
import { audio } from "@/game/audio/engine";

/** Warms the room-tone decode while the player browses the catalog. */
export function AmbientPreload() {
  useEffect(() => {
    void audio.preloadAmbient();
  }, []);

  return null;
}
