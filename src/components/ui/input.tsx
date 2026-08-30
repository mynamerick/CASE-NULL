import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-9 w-full rounded-[4px] border border-line bg-abyss px-3 text-[13px] text-ink",
      "placeholder:text-ink-ghost outline-none transition-colors",
      "focus:border-amber/50 focus:ring-1 focus:ring-amber/25",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-[4px] border border-line bg-abyss px-3 py-2 text-[13px] leading-relaxed text-ink",
      "placeholder:text-ink-ghost outline-none transition-colors resize-none scroll-thin",
      "focus:border-amber/50 focus:ring-1 focus:ring-amber/25",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
