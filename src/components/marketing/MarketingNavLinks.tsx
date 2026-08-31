"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/cases", label: "Cases" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
] as const;

export function MarketingNavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
      {LINKS.map((link) => {
        const active = link.href.startsWith("/#")
          ? pathname === "/"
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active && !link.href.startsWith("/#") ? "page" : undefined}
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:text-ink",
              active && !link.href.startsWith("/#") ? "text-ink" : "text-ink-faint",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
