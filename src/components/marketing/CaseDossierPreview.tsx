import { theLastMessage } from "@/cases/the-last-message/case";

export function CaseDossierPreview() {
  return (
    <div className="relative overflow-hidden rounded-[6px] border border-line bg-shell shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-line-soft bg-panel px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Case preview
        </span>
        <span className="font-mono text-[10px] text-amber">{theLastMessage.codename}</span>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-ghost">
            File ref
          </p>
          <p className="mt-1 font-mono text-xs text-ink-dim">MP26-0431 / HART_M</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
            {theLastMessage.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-dim">
            {theLastMessage.summary.slice(0, 168)}…
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-line-soft pt-4">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost">
              Apps
            </dt>
            <dd className="mt-1 text-sm text-ink-dim">10 forensic tools</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost">
              Evidence
            </dt>
            <dd className="mt-1 text-sm text-ink-dim">
              {theLastMessage.evidence.length} indexed items
            </dd>
          </div>
        </dl>

        <div className="flex items-center gap-3 border-t border-line-soft pt-4">
          <span
            aria-hidden
            className="inline-block h-8 w-[2px] bg-amber"
          />
          <p className="font-mono text-[10px] leading-relaxed uppercase tracking-[0.14em] text-ink-ghost">
            Working copy. Not for disclosure.
          </p>
        </div>
      </div>
    </div>
  );
}
