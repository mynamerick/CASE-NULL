import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { CaseCatalogCard } from "@/components/marketing/CaseCatalogCard";
import { getCaseCatalog } from "@/lib/catalog";
import { hasPremiumAccess } from "@/lib/features";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Case catalog",
  description: `Browse ${BRAND.name} investigations. Sign in to open a case from your free or premium library.`,
  robots: { index: false, follow: false },
};
export default async function CasesPage() {
  const { has } = await auth.protect();
  const isPremium = hasPremiumAccess(has);
  const catalog = getCaseCatalog();
  const premiumCount = catalog.filter((entry) => entry.status === "live").length;
  const freeCount = catalog.filter((entry) => entry.access === "free").length;

  return (
    <div className="min-h-[100dvh] bg-void">
      <div className="border-b border-line-soft bg-abyss">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
            Case catalog
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Begin an investigation
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-dim">
            Ready to solve a case? Choose from library of cases, get started with {freeCount} free cases or upgrade to Premium for the full library.
          </p>

          <dl className="mt-8 flex flex-wrap gap-8 font-mono text-[11px] uppercase tracking-[0.14em]">
            <div>
              <dt className="text-ink-ghost">Premium cases</dt>
              <dd className="mt-1 text-2xl tabular-nums text-ink">{premiumCount}</dd>
            </div>
            <div>
              <dt className="text-ink-ghost">Free cases</dt>
              <dd className="mt-1 text-2xl tabular-nums text-ink">{freeCount}</dd>
            </div>
            <div>
              <dt className="text-ink-ghost">Your plan</dt>
              <dd className="mt-1 text-2xl tabular-nums text-ink">
                {isPremium ? "Premium" : "Free"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <div className="mt-0 grid gap-5 md:grid-cols-2 xl:grid-cols-2">
          {catalog.map((entry) => (
            <CaseCatalogCard
              key={entry.id}
              entry={entry}
              isSignedIn
              isPremium={isPremium}
            />
          ))}
        </div>

        <div className="mt-12 rounded-[6px] border border-line-soft bg-abyss px-5 py-6 md:flex md:items-center md:justify-between md:px-6">
          <p className="max-w-lg text-sm leading-relaxed text-ink-dim">
            {isPremium
              ? "You have access to the full case library."
              : "Want the full library? Upgrade to Premium for every case plus extra features to help you solve the case."}
          </p>
          {!isPremium ? (
            <Link
              href="/#pricing"
              className="mt-4 inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] border border-amber/40 px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-amber transition-colors hover:border-amber/70 hover:text-ink md:mt-0"
            >
              View pricing
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

