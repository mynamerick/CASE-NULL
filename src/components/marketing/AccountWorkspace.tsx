"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAvatar, useAuth, useUser } from "@clerk/nextjs";
import { AccountProfile } from "@/components/marketing/AccountProfile";
import { MarketingEmailPreferences } from "@/components/marketing/MarketingEmailPreferences";
import { hasPremiumAccess } from "@/lib/features";
import { proseContainerClass } from "@/lib/layout";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/account", label: "Profile", match: (path: string) => path === "/account" },
  {
    href: "/account/security",
    label: "Security",
    match: (path: string) => path.startsWith("/account/security"),
  },
  {
    href: "/account/billing",
    label: "Billing",
    match: (path: string) => path.startsWith("/account/billing"),
  },
  {
    href: "/account/notifications",
    label: "Notifications",
    match: (path: string) => path.startsWith("/account/notifications"),
  },
] as const;

function AccountNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-wrap gap-2", className)}>
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-[4px] border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
              active
                ? "border-amber/40 bg-panel text-ink"
                : "border-line-soft text-ink-dim hover:border-line hover:bg-panel/60 hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AgentSummary() {
  const { user, isLoaded } = useUser();
  const { has, isLoaded: authLoaded } = useAuth();
  const isPremium = authLoaded && hasPremiumAccess(has);

  if (!isLoaded || !user) {
    return (
      <div className="animate-pulse flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 rounded-full bg-panel" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-panel" />
          <div className="h-3 w-40 rounded bg-panel" />
        </div>
      </div>
    );
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress;
  const displayName = user.fullName ?? user.firstName ?? "Agent";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar
          appearance={{
            elements: {
              avatarBox: "h-12 w-12 rounded-full border border-line",
            },
          }}
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{displayName}</p>
          {primaryEmail ? (
            <p className="truncate font-mono text-[11px] text-ink-faint">{primaryEmail}</p>
          ) : null}
        </div>
      </div>

      <dl className="flex shrink-0 gap-6 font-mono text-[10px] uppercase tracking-[0.14em] sm:gap-8">
        <div>
          <dt className="text-ink-ghost">Clearance</dt>
          <dd className={cn("mt-1", isPremium ? "text-amber" : "text-ink-dim")}>
            {isPremium ? "Premium" : "Free"}
          </dd>
        </div>
        <div>
          <dt className="text-ink-ghost">Status</dt>
          <dd className="mt-1 text-verified">Active</dd>
        </div>
      </dl>
    </div>
  );
}

export function AccountWorkspace() {
  const pathname = usePathname();
  const { has, isLoaded } = useAuth();
  const isPremium = isLoaded && hasPremiumAccess(has);
  const isNotifications = pathname.startsWith("/account/notifications");

  return (
    <div className="min-h-[100dvh] bg-void">
      <header className="border-b border-line-soft bg-abyss">
        <div className={cn(proseContainerClass, "py-12 md:py-16")}>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
            Agent file
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Account
          </h1>
          <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-ink-dim">
            Profile, security, billing, and notifications for your investigations.
          </p>
        </div>
      </header>

      <div className={cn(proseContainerClass, "py-10 md:py-12")}>
        <div className="rounded-[6px] border border-line-soft bg-shell p-5 md:p-6">
          <AgentSummary />
          <AccountNav className="mt-6 border-t border-line-soft pt-6" />
        </div>

        {isNotifications ? (
          <MarketingEmailPreferences />
        ) : (
          <section className="account-clerk mt-8 min-w-0">
            <AccountProfile />
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line-soft pt-6 font-mono text-[11px] uppercase tracking-[0.12em]">
          <Link href="/cases" className="text-ink-dim transition-colors hover:text-ink">
            My cases
          </Link>
          {!isPremium ? (
            <Link href="/#pricing" className="text-amber transition-colors hover:text-ink">
              Upgrade clearance
            </Link>
          ) : null}
          <a
            href={`mailto:${SITE.supportEmail}`}
            className="text-ink-faint transition-colors hover:text-ink-dim"
          >
            Contact support
          </a>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink-faint">
          Deleting your account removes sign-in access. Email {SITE.supportEmail} if you need
          progress data removed after that.
        </p>
      </div>
    </div>
  );
}
