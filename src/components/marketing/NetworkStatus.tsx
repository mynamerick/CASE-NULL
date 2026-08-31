"use client";

import { useEffect, useState } from "react";

export function NetworkStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[70] border-b border-amber/40 bg-shell px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-amber"
    >
      You are offline. Progress on this device is kept locally until the connection returns.
    </div>
  );
}
