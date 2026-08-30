"use client";

import { Paperclip, Trash2, CircleSlash, Clock } from "lucide-react";
import type { EvidenceItem, DocumentBlock, MapPin } from "@/game/types";
import { useGame } from "@/game/store";
import { isSealed } from "@/game/unlocks";
import { LockedItemGate } from "./LockedItemGate";
import { AddToBoardButton } from "./AddToBoardButton";
import { PhotoScene } from "@/components/photo/PhotoScene";
import { Badge } from "@/components/ui/badge";
import { peopleById } from "@/cases/the-last-message";
import { fullStamp, machineStamp, formatDuration, dayHeading, dayKey } from "@/lib/time";
import { withGroupBreaks } from "@/lib/grouping";
import { cn } from "@/lib/utils";

/**
 * Renders one evidence item. Everything here is display: nothing in this file
 * or anything it imports knows which items matter to the solution.
 */
export function EvidenceDetail({ item }: { item: EvidenceItem }) {
  const unlocked = useGame((s) => s.unlocked);
  const sealed = isSealed(item, new Set(unlocked));

  if (sealed) return <LockedItemGate item={item} />;

  return (
    <div className="scroll-thin h-full overflow-y-auto" data-testid="evidence-detail">
      <div className="mx-auto max-w-3xl p-4 md:p-6">
        <Body item={item} />
        <Footer item={item} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ body -- */

function Body({ item }: { item: EvidenceItem }) {
  const c = item.content;
  switch (c.kind) {
    case "email":
      return <EmailView content={c} />;
    case "conversation":
      return <ConversationView content={c} />;
    case "document":
      return <DocumentView content={c} />;
    case "photo":
      return <PhotoView content={c} />;
    case "web-session":
      return <WebSessionView content={c} />;
    case "call-log":
      return <CallLogView content={c} />;
  }
}

/* ----------------------------------------------------------------- email -- */

function EmailView({ content: c }: { content: Extract<EvidenceItem["content"], { kind: "email" }> }) {
  return (
    <article>
      <h2 className="text-lg font-semibold leading-snug tracking-tight text-ink">
        {c.subject}
      </h2>

      <dl className="mt-4 space-y-1.5 border-y border-line py-3 font-mono text-[11.5px]">
        <Row k="From" v={`${c.from.name} <${c.from.address}>`} />
        <Row k="To" v={c.to.map((t) => `${t.name} <${t.address}>`).join(", ")} />
        {c.cc && c.cc.length > 0 && (
          <Row k="Cc" v={c.cc.map((t) => `${t.name} <${t.address}>`).join(", ")} />
        )}
        {c.automated && <Row k="Note" v="Automated message — no-reply sender" />}
      </dl>

      <div className="mt-5 space-y-3.5 text-[13.5px] leading-[1.7] text-ink-dim">
        {c.body.map((p, i) => (
          <p key={i} className={p.startsWith("—") ? "border-l-2 border-line pl-3 text-[12px] text-ink-faint" : undefined}>
            {p}
          </p>
        ))}
      </div>

      {c.attachments && c.attachments.length > 0 && (
        <div className="mt-5 border-t border-line pt-3">
          <p className="label-xs">Attachments</p>
          <ul className="mt-2 space-y-1.5">
            {c.attachments.map((a) => (
              <li
                key={a.name}
                className="flex items-center gap-2 rounded-[3px] border border-line bg-panel/60 px-2.5 py-1.5 font-mono text-[11.5px] text-ink-dim"
              >
                <Paperclip className="h-3 w-3 shrink-0 text-ink-ghost" />
                <span className="truncate">{a.name}</span>
                <span className="ml-auto shrink-0 text-ink-ghost">{a.size}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

/* ---------------------------------------------------------- conversation -- */

function ConversationView({
  content: c,
}: {
  content: Extract<EvidenceItem["content"], { kind: "conversation" }>;
}) {
  const person = peopleById[c.personId];
  const rows = withGroupBreaks(c.lines, (l) => dayKey(l.at));

  return (
    <div className="space-y-1">
      <header className="mb-4 flex items-center gap-3 border-b border-line pb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-raised font-mono text-[11px] text-ink-dim">
          {person?.avatarInitials ?? "??"}
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-ink">{person?.name}</p>
          <p className="font-mono text-[11px] text-ink-faint">{c.handle}</p>
        </div>
      </header>

      {rows.map(({ item: l, group: day, startsGroup }) => (
          <div key={l.id}>
            {startsGroup && (
              <div className="my-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-line-soft" />
                <span className="label-xs whitespace-nowrap">{dayHeading(day)}</span>
                <span className="h-px flex-1 bg-line-soft" />
              </div>
            )}

            <div className={cn("flex", l.direction === "out" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[82%] md:max-w-[74%]", l.direction === "out" && "text-right")}>
                {l.deleted ? (
                  <div className="inline-flex items-center gap-2 rounded-[10px] border border-dashed border-line px-3 py-2 text-[12px] text-ink-ghost">
                    <Trash2 className="h-3 w-3 shrink-0" />
                    <span className="italic">Message deleted</span>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "inline-block rounded-[12px] px-3 py-2 text-left text-[13px] leading-snug",
                      l.direction === "out"
                        ? "bg-cool/18 text-ink"
                        : "border border-line bg-panel text-ink-dim",
                    )}
                  >
                    {l.text}
                  </div>
                )}
                <div
                  className={cn(
                    "mt-1 flex items-center gap-2 font-mono text-[10px] text-ink-ghost",
                    l.direction === "out" ? "justify-end" : "justify-start",
                  )}
                >
                  <span className="tnum">{l.at.slice(11, 16)}</span>
                  {l.status === "not-delivered" && (
                    <span className="text-signal">Not delivered</span>
                  )}
                  {l.status === "delivered" && <span>Delivered</span>}
                </div>
              </div>
            </div>

            {l.gapAfter && (
              <div className="my-4 flex gap-2.5 rounded-[4px] border border-dashed border-line bg-abyss/60 px-3 py-2.5">
                <CircleSlash className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-ghost" />
                <p className="font-mono text-[11px] leading-relaxed text-ink-faint">
                  {l.gapAfter}
                </p>
              </div>
            )}
          </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- document -- */

function DocumentView({
  content: c,
}: {
  content: Extract<EvidenceItem["content"], { kind: "document" }>;
}) {
  return (
    <article>
      <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-line pb-3">
        <Badge variant="default">{c.format.toUpperCase()}</Badge>
        <span className="font-mono text-[12px] text-ink">{c.filename}</span>
        <span className="ml-auto font-mono text-[11px] text-ink-ghost">{c.size}</span>
      </div>
      <div className="space-y-4">
        {c.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    </article>
  );
}

function Block({ block: b }: { block: DocumentBlock }) {
  switch (b.type) {
    case "heading":
      return (
        <h3 className="border-b border-line-soft pb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber">
          {b.text}
        </h3>
      );
    case "para":
      return <p className="text-[13.5px] leading-[1.7] text-ink-dim">{b.text}</p>;
    case "mono":
      return (
        <pre className="scroll-thin overflow-x-auto whitespace-pre-wrap rounded-[3px] border border-line bg-abyss p-3 font-mono text-[12px] leading-[1.7] text-ink-dim">
          {b.text}
        </pre>
      );
    case "note":
      return (
        <div className="rounded-[3px] border-l-2 border-amber-dim bg-amber/[0.04] py-2.5 pl-3 pr-3">
          {b.author && <p className="label-xs mb-1.5">{b.author}</p>}
          <p className="whitespace-pre-line text-[13px] leading-[1.7] text-ink-dim">
            {b.text}
          </p>
        </div>
      );
    case "kv":
      return (
        <dl className="divide-y divide-line-soft rounded-[3px] border border-line">
          {b.rows.map((r) => (
            <div key={r.k} className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:gap-4">
              <dt className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint sm:w-56">
                {r.k}
              </dt>
              <dd className="font-mono text-[12px] leading-relaxed text-ink-dim">{r.v}</dd>
            </div>
          ))}
        </dl>
      );
    case "table":
      return (
        <div>
          <div className="scroll-thin overflow-x-auto rounded-[3px] border border-line">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-raised">
                  {b.columns.map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row, i) => (
                  <tr key={i} className="border-b border-line-soft last:border-0 hover:bg-raised/50">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={cn(
                          "px-2.5 py-1.5 align-top font-mono text-[11.5px] leading-relaxed",
                          j === 0 ? "whitespace-nowrap text-ink" : "text-ink-dim",
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.footnote && (
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-amber">{b.footnote}</p>
          )}
        </div>
      );
    case "map":
      return <SchematicMap pins={b.pins} caption={b.caption} />;
    case "redaction":
      return (
        <div className="space-y-1.5">
          {Array.from({ length: b.lines }, (_, i) => (
            <div
              key={i}
              className="h-3 rounded-[1px] bg-line"
              style={{ width: `${60 + ((i * 37) % 38)}%` }}
            />
          ))}
        </div>
      );
  }
}

function SchematicMap({ pins, caption }: { pins: MapPin[]; caption: string }) {
  return (
    <figure>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[3px] border border-line bg-abyss">
        <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full">
          <rect width="400" height="250" fill="#0c1016" />
          {/* road grid */}
          <g stroke="#1b2331" strokeWidth="8">
            <line x1="0" y1="170" x2="400" y2="150" />
            <line x1="90" y1="0" x2="120" y2="250" />
            <line x1="250" y1="0" x2="238" y2="250" />
            <line x1="0" y1="72" x2="400" y2="58" />
          </g>
          <g stroke="#232c3b" strokeWidth="2">
            <line x1="150" y1="60" x2="160" y2="170" />
            <line x1="120" y1="110" x2="250" y2="104" />
          </g>
          {/* plots */}
          {[
            [140, 76, 90, 26],
            [140, 112, 90, 26],
            [268, 84, 76, 44],
            [30, 186, 70, 40],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="#141a24" stroke="#1e2733" />
          ))}
        </svg>

        {pins.map((p) => (
          <div
            key={p.label}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div
              className={cn(
                "whitespace-nowrap rounded-[3px] border px-1.5 py-1 font-mono text-[9.5px] leading-none",
                p.tone === "amber"
                  ? "border-amber-dim bg-amber/15 text-amber"
                  : p.tone === "signal"
                    ? "border-signal-dim bg-signal/15 text-signal"
                    : "border-line bg-panel text-ink-faint",
              )}
            >
              {p.label}
            </div>
            <div
              className={cn(
                "mx-auto h-2 w-px",
                p.tone === "amber" ? "bg-amber" : "bg-ink-ghost",
              )}
            />
            <div
              className={cn(
                "mx-auto h-1.5 w-1.5 -translate-y-0.5 rotate-45",
                p.tone === "amber" ? "bg-amber" : "bg-ink-ghost",
              )}
            />
          </div>
        ))}
      </div>
      <figcaption className="mt-2 font-mono text-[11px] leading-relaxed text-ink-faint">
        {caption}
      </figcaption>
    </figure>
  );
}

/* ----------------------------------------------------------------- photo -- */

function PhotoView({
  content: c,
}: {
  content: Extract<EvidenceItem["content"], { kind: "photo" }>;
}) {
  return (
    <article>
      {/* Capped so the caption and frame analysis stay above the fold in a
          standard window — the scene is drawn with slice, so it crops. */}
      <div className="overflow-hidden rounded-[4px] border border-line bg-void">
        <PhotoScene
          scene={c.scene}
          className="aspect-[4/3] max-h-[min(46vh,20rem)] w-full object-cover"
        />
      </div>

      <p className="mt-3 font-mono text-[11.5px] text-ink">{c.filename}</p>

      <p className="mt-3 text-[13.5px] leading-[1.7] text-ink-dim">{c.caption}</p>

      <div className="mt-4 rounded-[3px] border-l-2 border-amber-dim bg-amber/[0.04] py-2.5 pl-3 pr-3">
        <p className="label-xs mb-1.5">Frame analysis</p>
        <p className="text-[13px] leading-[1.7] text-ink-dim">{c.observation}</p>
      </div>

      <div className="mt-4">
        <p className="label-xs mb-2">Image metadata</p>
        <dl className="divide-y divide-line-soft rounded-[3px] border border-line">
          {c.exif.map((e) => (
            <div key={e.k} className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:gap-4">
              <dt className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint sm:w-40">
                {e.k}
              </dt>
              <dd className="font-mono text-[12px] leading-relaxed text-ink-dim">{e.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------- web session -- */

const CATEGORY_STYLE: Record<string, string> = {
  search: "text-amber",
  maps: "text-verified",
  shopping: "text-ink-faint",
  social: "text-ink-faint",
  reference: "text-cool",
  media: "text-ink-ghost",
};

function WebSessionView({
  content: c,
}: {
  content: Extract<EvidenceItem["content"], { kind: "web-session" }>;
}) {
  const rows = withGroupBreaks(c.visits, (v) => dayKey(v.at));
  return (
    <div>
      <p className="label-xs mb-3">{c.device}</p>
      <ol className="divide-y divide-line-soft rounded-[3px] border border-line">
        {rows.map(({ item: v, group: day, startsGroup }, i) => (
            <li key={i}>
              {startsGroup && (
                <p className="border-b border-line-soft bg-raised/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  {dayHeading(day)}
                </p>
              )}
              <div className="flex items-start gap-3 px-3 py-2 hover:bg-raised/40">
                <span className="shrink-0 pt-0.5 font-mono text-[11px] tabular-nums text-ink-ghost">
                  {v.at.slice(11, 16)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug text-ink-dim">{v.title}</p>
                  <p className="mt-0.5 truncate font-mono text-[10.5px] text-ink-ghost">{v.url}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={cn(
                      "font-mono text-[9.5px] uppercase tracking-[0.1em]",
                      CATEGORY_STYLE[v.category] ?? "text-ink-ghost",
                    )}
                  >
                    {v.category}
                  </span>
                  {v.count && v.count > 1 && (
                    <span className="font-mono text-[10px] text-ink-ghost">×{v.count}</span>
                  )}
                </div>
              </div>
            </li>
        ))}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------- call log -- */

const DIRECTION_STYLE = {
  in: { label: "Incoming", cls: "text-verified" },
  out: { label: "Outgoing", cls: "text-cool" },
  missed: { label: "Missed", cls: "text-signal" },
  voicemail: { label: "Voicemail", cls: "text-amber" },
} as const;

function CallLogView({
  content: c,
}: {
  content: Extract<EvidenceItem["content"], { kind: "call-log" }>;
}) {
  const rows = withGroupBreaks(c.records, (r) => dayKey(r.at));
  return (
    <ol className="divide-y divide-line-soft rounded-[3px] border border-line">
      {rows.map(({ item: r, group: day, startsGroup }, i) => {
        const d = DIRECTION_STYLE[r.direction];
        return (
          <li key={i}>
            {startsGroup && (
              <p className="border-b border-line-soft bg-raised/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                {dayHeading(day)}
              </p>
            )}
            <div className="px-3 py-2 hover:bg-raised/40">
              <div className="flex items-center gap-3">
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-ghost">
                  {r.at.slice(11, 16)}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink-dim">
                  {r.displayName}
                </span>
                <span className={cn("shrink-0 font-mono text-[10px] uppercase tracking-[0.1em]", d.cls)}>
                  {d.label}
                </span>
                <span className="w-14 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-faint">
                  {formatDuration(r.duration)}
                </span>
              </div>
              <p className="mt-0.5 pl-[3.4rem] font-mono text-[10.5px] text-ink-ghost">
                {r.number}
              </p>
              {r.transcript && (
                <div className="ml-[3.4rem] mt-2 rounded-[3px] border-l-2 border-amber-dim bg-amber/[0.04] py-2 pl-3 pr-3">
                  <p className="label-xs mb-1">Voicemail transcript</p>
                  <p className="text-[12.5px] italic leading-relaxed text-ink-dim">
                    {r.transcript}
                  </p>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------------------------------------------------------- footer -- */

function Footer({ item }: { item: EvidenceItem }) {
  return (
    <footer className="mt-8 border-t border-line pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <Clock className="h-3 w-3 text-ink-ghost" />
        <span className="font-mono text-[11px] text-ink-faint">{fullStamp(item.timestamp)}</span>
        <span className="font-mono text-[11px] text-ink-ghost">·</span>
        <span className="font-mono text-[11px] text-ink-ghost">{machineStamp(item.timestamp)}</span>
        {item.location && (
          <>
            <span className="font-mono text-[11px] text-ink-ghost">·</span>
            <span className="font-mono text-[11px] text-ink-faint">{item.location}</span>
          </>
        )}
      </div>

      {item.metadata && (
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
          {Object.entries(item.metadata).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-ghost">
                {k}
              </dt>
              <dd className="font-mono text-[11px] text-ink-faint">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {item.tags.map((t) => (
          <Badge key={t} variant="quiet" className="border-line-soft bg-abyss">
            {t}
          </Badge>
        ))}
        {item.relatedPeople.map((p) => (
          <Badge key={p} variant="default">
            {peopleById[p]?.name ?? p}
          </Badge>
        ))}
      </div>

      <div className="mt-5">
        <AddToBoardButton evidenceId={item.id} />
      </div>
    </footer>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-10 shrink-0 uppercase tracking-[0.08em] text-ink-ghost">{k}</dt>
      <dd className="min-w-0 flex-1 break-words text-ink-faint">{v}</dd>
    </div>
  );
}
