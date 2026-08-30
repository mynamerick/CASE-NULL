import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[3px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] leading-none",
  {
    variants: {
      variant: {
        default: "border-line bg-raised text-ink-faint",
        amber: "border-amber-dim bg-amber/10 text-amber",
        signal: "border-signal-dim bg-signal/10 text-signal",
        cool: "border-cool/30 bg-cool/10 text-cool",
        verified: "border-verified/30 bg-verified/10 text-verified",
        quiet: "border-transparent bg-transparent text-ink-ghost",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
