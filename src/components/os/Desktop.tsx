"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useGame, allVisible } from "@/game/store";
import { unreviewedInApp } from "@/game/progress";
import { activeCase } from "@/cases/the-last-message";
import type { AppId } from "@/game/types";
import { APPS } from "./apps";
import { AppIcon } from "./AppIcon";
import { AppWindow } from "./AppWindow";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { MobileLauncher } from "./MobileLauncher";
import { NotificationToasts } from "./NotificationToasts";
import { NoiseOverlay } from "./NoiseOverlay";
import { BackNavigationProvider } from "./BackNavigation";
import { useIsMobile } from "./useIsMobile";
import { renderApp } from "@/components/apps/renderApp";

export function Desktop() {
  const isMobile = useIsMobile();
  const windows = useGame((s) => s.windows);
  const openApp = useGame((s) => s.openApp);
  const discovered = useGame((s) => s.discovered);

  const visible = allVisible(discovered);
  const unreviewed = (id: AppId) => unreviewedInApp(id, visible, discovered);

  return (
    <BackNavigationProvider>
    <div className="relative h-dvh w-full overflow-hidden wallpaper">
      <div aria-hidden className="wallpaper-grid pointer-events-none absolute inset-0" />
      <MenuBar />

      {/* Desktop icon field ------------------------------------------------ */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="absolute left-0 top-[var(--menubar-h)] z-0 flex h-[calc(100%-var(--menubar-h)-78px)] flex-col flex-wrap content-start gap-1 p-4"
        >
          {APPS.map((meta) => (
            <AppIcon
              key={meta.id}
              meta={meta}
              variant="desktop"
              unreviewed={meta.holdsEvidence ? unreviewed(meta.id) : 0}
              onOpen={() => openApp(meta.id)}
            />
          ))}
        </motion.div>
      )}

      {/* Desktop watermark ------------------------------------------------- */}
      {!isMobile && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-24 right-8 z-0 select-none text-right"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-ghost/60">
            {activeCase.codename}
          </p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-ink-ghost/40">
            WORKING COPY — NOT FOR DISCLOSURE
          </p>
        </div>
      )}

      {/* Mobile launcher --------------------------------------------------- */}
      {isMobile && windows.filter((w) => !w.minimised).length === 0 && (
        <MobileLauncher unreviewed={unreviewed} />
      )}

      {/* Windows. The layer itself must stay click-through, or it covers the
          icon field and the launcher and swallows every tap. Each window
          re-enables pointer events for itself. ------------------------------ */}
      <div className="pointer-events-none absolute inset-0 top-[var(--menubar-h)] z-10">
        <AnimatePresence>
          {windows.map((win) => (
            <AppWindow key={win.appId} win={win} isMobile={isMobile}>
              {renderApp(win.appId)}
            </AppWindow>
          ))}
        </AnimatePresence>
      </div>

      {!isMobile && <Dock />}
      <NotificationToasts />
      <NoiseOverlay />
    </div>
    </BackNavigationProvider>
  );
}
