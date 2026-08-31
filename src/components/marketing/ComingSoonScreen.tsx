"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BRAND } from "@/lib/brand";

const BOOT_LINES: { text: string; delay: number; tone?: "warn" | "ok" | "muted" }[] = [
  { text: "CASE NULL SECURE GATEWAY — NODE 07", delay: 70 },
  { text: "handshake ............................ ESTABLISHED", delay: 180, tone: "ok" },
  { text: "tls 1.3 · cert CN=casenull.com ........ VALID", delay: 150, tone: "ok" },
  { text: "", delay: 40 },
  { text: "scanning public routes ............... BLOCKED", delay: 160, tone: "warn" },
  { text: "investigation modules ................ SEALED", delay: 130, tone: "warn" },
  { text: "workstation images ................... OFFLINE", delay: 120, tone: "muted" },
  { text: "", delay: 50 },
  { text: "status: preview access required", delay: 220, tone: "warn" },
  { text: "enter clearance key to continue", delay: 260 },
];

const HEX_STREAM =
  "4F2A9C1E8B7D0F3A6E5C2B9D1F4A8E0C7B3D6F9A2E5C8B1D4F7A0E3C6B9D2F5A8E1C4B7D0F3A6E9C2B5D8F1A4E7C0B3D6F9A2E5C8B1D4";

function toneClass(tone?: "warn" | "ok" | "muted") {
  if (tone === "warn") return "text-amber";
  if (tone === "ok") return "text-verified";
  if (tone === "muted") return "text-ink-ghost";
  return undefined;
}

export function ComingSoonScreen({
  redirectTo,
  configured,
}: {
  redirectTo: string;
  configured: boolean;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? BOOT_LINES.length : 0);
  const [phase, setPhase] = useState<"boot" | "gate" | "granted">(
    reduce ? "gate" : "boot",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reduce || shown >= BOOT_LINES.length) {
      const t = setTimeout(() => setPhase("gate"), reduce ? 0 : 280);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((n) => n + 1), BOOT_LINES[shown].delay);
    return () => clearTimeout(t);
  }, [shown, reduce]);

  useEffect(() => {
    if (phase === "gate") {
      inputRef.current?.focus();
    }
  }, [phase]);

  const triggerGlitch = () => {
    setGlitch(true);
    window.setTimeout(() => setGlitch(false), 160);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || !password.trim()) return;

    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/coming-soon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, redirect: redirectTo }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        redirect?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        triggerGlitch();
        if (data.error === "rate_limited") {
          setError("Too many attempts. Wait a minute and try again.");
        } else {
          setError("Clearance key rejected. Check the string you were given.");
        }
        setBusy(false);
        return;
      }

      setPhase("granted");
      window.setTimeout(() => {
        window.location.href = data.redirect ?? redirectTo;
      }, 1100);
    } catch {
      triggerGlitch();
      setError("Link unstable. Retry in a moment.");
      setBusy(false);
    }
  };

  return (
    <div
      className={`relative flex min-h-[100dvh] flex-col overflow-hidden bg-void ${glitch ? "glitch-slip" : ""}`}
      data-testid="coming-soon-screen"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 wallpaper" />
      <div aria-hidden className="pointer-events-none absolute inset-0 wallpaper-grid opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0 grain" />
      <div aria-hidden className="pointer-events-none absolute inset-0 scanlines" />
      <div aria-hidden className="pointer-events-none absolute inset-0 vignette" />
      {!reduce ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[min(42vw,320px)] overflow-hidden opacity-[0.07] mask-[linear-gradient(to_left,black,transparent)]"
        >
          <p className="animate-[hex-drift_18s_linear_infinite] whitespace-pre-wrap break-all p-4 font-mono text-[10px] leading-[1.35] text-verified">
            {HEX_STREAM.repeat(6)}
          </p>
        </div>
      ) : null}

      <header className="relative z-10 border-b border-line-soft/80 px-4 py-4 md:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
          {BRAND.name}
        </p>
      </header>

      <main
        id="main"
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-10 md:px-8"
      >
        <AnimatePresence mode="wait">
          {phase === "boot" ? (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-[1.7] text-ink-dim md:text-[12px]">
                {BOOT_LINES.slice(0, shown).map((line, i) => (
                  <span key={i} className={toneClass(line.tone)}>
                    {line.text}
                    {"\n"}
                  </span>
                ))}
                {shown < BOOT_LINES.length ? (
                  <span className="caret text-verified">█</span>
                ) : null}
              </pre>
            </motion.div>
          ) : null}

          {phase === "gate" || phase === "granted" ? (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <div className="border border-line-soft bg-shell/75 p-6 backdrop-blur-[2px] md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber">
                  Restricted preview
                </p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                  The archive is not public yet.
                </h1>
                <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-dim">
                  {BRAND.name} is still in sealed testing. If you have a clearance key, enter it
                  below to load the workstation.
                </p>

                {phase === "gate" ? (
                  configured ? (
                  <form onSubmit={submit} className="mt-8 space-y-4" data-testid="coming-soon-form">
                    <div>
                      <label
                        htmlFor="preview-key"
                        className="label-xs mb-2 block text-ink-faint"
                      >
                        Clearance key
                      </label>
                      <input
                        ref={inputRef}
                        id="preview-key"
                        type="password"
                        autoComplete="off"
                        spellCheck={false}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        disabled={busy}
                        data-testid="coming-soon-password"
                        className="h-11 w-full rounded-[4px] border border-line bg-abyss px-3 font-mono text-[13px] tracking-[0.08em] text-ink outline-none transition-colors placeholder:text-ink-ghost focus:border-amber/50 focus:ring-1 focus:ring-amber/25 disabled:opacity-60"
                        placeholder="key string"
                      />
                    </div>

                    {error ? (
                      <p
                        role="alert"
                        className="font-mono text-[11px] text-signal"
                        data-testid="coming-soon-error"
                      >
                        {error}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={busy || !password.trim()}
                      data-testid="coming-soon-submit"
                      className="inline-flex h-10 items-center justify-center rounded-[4px] border border-amber/60 bg-amber/90 px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-amber active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busy ? "Verifying..." : "Authenticate"}
                    </button>
                  </form>
                  ) : (
                    <p className="mt-8 font-mono text-[11px] text-amber">
                      Preview gate is active but no clearance key is configured. Set
                      COMING_SOON_PASSWORD in the environment.
                    </p>
                  )
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 font-mono text-[12px] text-verified"
                    data-testid="coming-soon-granted"
                  >
                    clearance accepted — mounting routes
                    <span className="caret ml-1 text-verified">█</span>
                  </motion.div>
                )}
              </div>

              <p className="mt-6 font-mono text-[10px] tracking-[0.12em] text-ink-ghost">
                session logged · unauthorised access attempts monitored
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
