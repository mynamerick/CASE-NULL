import type { AppId } from "@/game/types";
import {
  Mail,
  MessageSquare,
  Folder,
  Image as ImageIcon,
  Globe,
  Phone,
  LayoutGrid,
  FileText,
  NotebookPen,
  Gavel,
  type LucideIcon,
} from "lucide-react";

export interface AppMeta {
  id: AppId;
  name: string;
  /** Shown under the icon on the desktop, above the window title. */
  subtitle: string;
  icon: LucideIcon;
  /** Accent used for the icon glyph only — never for large fills. */
  tone: "ink" | "amber" | "cool" | "signal";
  /** Apps that hold evidence get an unreviewed-count badge. */
  holdsEvidence: boolean;
}

export const APPS: AppMeta[] = [
  { id: "casefile", name: "Case File", subtitle: "Briefing", icon: FileText, tone: "amber", holdsEvidence: false },
  { id: "mail", name: "Mail", subtitle: "Mailbox", icon: Mail, tone: "ink", holdsEvidence: true },
  { id: "messages", name: "Messages", subtitle: "Handset", icon: MessageSquare, tone: "ink", holdsEvidence: true },
  { id: "files", name: "Files", subtitle: "Disk", icon: Folder, tone: "ink", holdsEvidence: true },
  { id: "photos", name: "Photos", subtitle: "Camera", icon: ImageIcon, tone: "ink", holdsEvidence: true },
  { id: "browser", name: "History", subtitle: "Browser", icon: Globe, tone: "ink", holdsEvidence: true },
  { id: "calls", name: "Call Logs", subtitle: "Network", icon: Phone, tone: "ink", holdsEvidence: true },
  { id: "board", name: "Evidence Board", subtitle: "Wall", icon: LayoutGrid, tone: "cool", holdsEvidence: false },
  { id: "notes", name: "Notes", subtitle: "Scratchpad", icon: NotebookPen, tone: "cool", holdsEvidence: false },
  { id: "theory", name: "Submit Theory", subtitle: "Report", icon: Gavel, tone: "signal", holdsEvidence: false },
];

export const appById: Record<AppId, AppMeta> = Object.fromEntries(
  APPS.map((a) => [a.id, a]),
) as Record<AppId, AppMeta>;

export const TONE_CLASS: Record<AppMeta["tone"], string> = {
  ink: "text-ink-dim",
  amber: "text-amber",
  cool: "text-cool",
  signal: "text-signal",
};
