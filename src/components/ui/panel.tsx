import * as React from "react";
import { cn } from "@/lib/utils";

/** A flat instrument panel. Deliberately not a SaaS card: no shadow, no radius bloat. */
export function Panel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border border-line bg-panel/70 rounded-[4px]", className)}
      {...props}
    />
  );
}

export function PanelHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-line px-3 py-2",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("label-xs", className)} {...props} />;
}
