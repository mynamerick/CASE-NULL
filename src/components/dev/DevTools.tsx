"use client";

import { useClerk, useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Cookie,
  DoorOpen,
  LogOut,
  RefreshCw,
  ShieldOff,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { clearConsent, openCookiePreferences, readConsent } from "@/lib/consent";
import { isDevToolsEnabled } from "@/lib/dev-tools";
import { resetPostHog } from "@/lib/posthog";
import { useIsClient } from "@/lib/useIsClient";
import { cn } from "@/lib/utils";

type Flash = { tone: "ok" | "error"; message: string } | null;

interface DevAction {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  run: () => void | Promise<void>;
  danger?: boolean;
}

export function DevTools({ comingSoonEnabled }: { comingSoonEnabled: boolean }) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const panelId = useId();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [flash, setFlash] = useState<Flash>(null);

  const notify = useCallback((tone: "ok" | "error", message: string) => {
    setFlash({ tone, message });
    window.setTimeout(() => setFlash(null), 2600);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!isClient || !isDevToolsEnabled()) return null;

  const run = async (id: string, fn: () => void | Promise<void>) => {
    setBusy(id);
    try {
      await fn();
    } catch {
      notify("error", "Action failed.");
    } finally {
      setBusy(null);
    }
  };

  const actions: DevAction[] = [
    {
      id: "cookie-banner",
      label: "Reset cookie banner",
      hint: "Clears consent choice so the banner shows again.",
      icon: <Cookie className="h-3.5 w-3.5" />,
      run: () => {
        clearConsent();
        resetPostHog();
        notify("ok", "Cookie banner reset.");
      },
    },
    {
      id: "cookie-prefs",
      label: "Open cookie preferences",
      hint: "Opens the preferences dialog without clearing storage.",
      icon: <Cookie className="h-3.5 w-3.5" />,
      run: () => {
        openCookiePreferences();
        setOpen(false);
      },
    },
    ...(comingSoonEnabled
      ? [
          {
            id: "preview-exit",
            label: "Exit preview gate",
            hint: "Clears preview access and sends you back to /coming-soon.",
            icon: <DoorOpen className="h-3.5 w-3.5" />,
            danger: true,
            run: async () => {
              const res = await fetch("/api/dev/preview-access", { method: "DELETE" });
              if (!res.ok) {
                notify("error", "Could not clear preview cookie.");
                return;
              }
              window.location.href = "/coming-soon";
            },
          } satisfies DevAction,
        ]
      : []),
    ...(isSignedIn
      ? [
          {
            id: "sign-out",
            label: "Sign out",
            hint: "Ends your Clerk session on this device.",
            icon: <LogOut className="h-3.5 w-3.5" />,
            run: async () => {
              await signOut({ redirectUrl: "/" });
            },
          } satisfies DevAction,
        ]
      : []),
    {
      id: "analytics",
      label: "Reset analytics client",
      hint: "Opts out and clears PostHog local state.",
      icon: <ShieldOff className="h-3.5 w-3.5" />,
      run: () => {
        resetPostHog();
        notify("ok", "Analytics client cleared.");
      },
    },
    {
      id: "storage",
      label: "Clear site storage",
      hint: "Removes consent, PostHog keys, and other casenull.* local entries.",
      icon: <Trash2 className="h-3.5 w-3.5" />,
      danger: true,
      run: () => {
        const keys: string[] = [];
        for (let i = 0; i < window.localStorage.length; i += 1) {
          const key = window.localStorage.key(i);
          if (
            key &&
            (key.startsWith("casenull.") || key.startsWith("ph_") || key.startsWith("__ph"))
          ) {
            keys.push(key);
          }
        }
        keys.forEach((key) => window.localStorage.removeItem(key));
        clearConsent();
        resetPostHog();
        notify("ok", `Cleared ${keys.length} storage key${keys.length === 1 ? "" : "s"}.`);
      },
    },
    {
      id: "reload",
      label: "Hard reload",
      hint: "Refreshes the page from the server.",
      icon: <RefreshCw className="h-3.5 w-3.5" />,
      run: () => {
        window.location.reload();
      },
    },
  ];

  const consent = readConsent();

  return (
    <div className="fixed right-0 top-1/2 z-[100] flex -translate-y-1/2 items-center">
      <AnimatePresence>
        {open ? (
          <motion.aside
            id={panelId}
            role="dialog"
            aria-label="Developer tools"
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mr-2 w-[min(92vw,280px)] rounded-[6px] border border-line bg-shell/95 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-line-soft px-3 py-2.5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber">Dev</p>
                <p className="font-mono text-[10px] text-ink-ghost">local utilities</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close developer tools"
                className="rounded-[4px] p-1.5 text-ink-faint transition-colors hover:bg-hover hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1 px-2 py-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void run(action.id, action.run)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-[4px] border px-2.5 py-2 text-left transition-colors disabled:opacity-50",
                    action.danger
                      ? "border-signal/25 hover:border-signal/45 hover:bg-signal/10"
                      : "border-transparent hover:border-line hover:bg-panel",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 shrink-0",
                      action.danger ? "text-signal" : "text-ink-faint",
                    )}
                  >
                    {action.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
                      {busy === action.id ? "Working..." : action.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-faint">
                      {action.hint}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-line-soft px-3 py-2.5">
              <dl className="space-y-1 font-mono text-[10px] text-ink-ghost">
                <div className="flex justify-between gap-3">
                  <dt>Consent</dt>
                  <dd className="text-ink-dim">
                    {consent === null ? "unset" : consent.analytics ? "analytics on" : "essential only"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Preview gate</dt>
                  <dd className="text-ink-dim">{comingSoonEnabled ? "enabled" : "off"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Session</dt>
                  <dd className="text-ink-dim">{isSignedIn ? "signed in" : "guest"}</dd>
                </div>
              </dl>
              {flash ? (
                <p
                  className={cn(
                    "mt-2 font-mono text-[10px]",
                    flash.tone === "ok" ? "text-verified" : "text-signal",
                  )}
                >
                  {flash.message}
                </p>
              ) : null}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close developer tools" : "Open developer tools"}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "group flex h-11 w-11 items-center justify-center rounded-l-[6px] border border-r-0 border-line bg-shell/90 text-ink-dim shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors hover:border-amber/40 hover:bg-panel hover:text-amber",
          open && "border-amber/40 bg-panel text-amber",
        )}
        data-testid="dev-tools-toggle"
      >
        <Terminal className="h-4 w-4 transition-transform group-hover:scale-105" />
      </button>
    </div>
  );
}
