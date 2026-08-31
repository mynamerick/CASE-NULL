import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { CaseCatalogCard } from "@/components/marketing/CaseCatalogCard";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { MarketingPageTitle } from "@/components/marketing/MarketingRevealText";
import { AmbientPreload } from "@/game/audio/AmbientPreload";
import { getCaseCatalog } from "@/lib/catalog";
import { hasPremiumAccess } from "@/lib/features";
import { getUserProgressMap } from "@/lib/progress-server";
import { BRAND } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Case catalog",
  description: `Browse ${BRAND.name} investigations. Sign in to open a case from your free or premium library.`,
  path: "/cases",
  index: false,
});
export default async function CasesPage() {
  const { userId, has } = await auth.protect();
  const isPremium = hasPremiumAccess(has);
  const catalog = getCaseCatalog();
  const progressMap = await getUserProgressMap(userId);
  const liveCatalog = catalog.filter((entry) => entry.status === "live");
  const premiumCount = liveCatalog.filter((entry) => entry.access === "premium").length;
  const freeCount = liveCatalog.filter((entry) => entry.access === "free").length;
  const activeCount = liveCatalog.filter(
    (entry) => progressMap[entry.id] === "in_progress",
  ).length;
  const completedCount = liveCatalog.filter(
    (entry) => progressMap[entry.id] === "completed",
  ).length;
  const abandonedCount = liveCatalog.filter(
    (entry) => progressMap[entry.id] === "abandoned",
  ).length;

  return (
    <div className="min-h-[100dvh] bg-void">
      <AmbientPreload />
      <div className="border-b border-line-soft bg-abyss">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <MarketingPageTitle
            eyebrow="Case catalog"
            title="Begin an investigation"
            eyebrowClassName="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint"
            titleClassName="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink md:text-4xl"
          />
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
            <div>
              <dt className="text-ink-ghost">In progress</dt>
              <dd className="mt-1 text-2xl tabular-nums text-ink">{activeCount}</dd>
            </div>
            <div>
              <dt className="text-ink-ghost">Completed</dt>
              <dd className="mt-1 text-2xl tabular-nums text-ink">{completedCount}</dd>
            </div>
            <div>
              <dt className="text-ink-ghost">Abandoned</dt>
              <dd className="mt-1 text-2xl tabular-nums text-ink">{abandonedCount}</dd>
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
              progressStatus={progressMap[entry.id] ?? null}
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
            <MarketingCta href="/#pricing" variant="accent" size="sm" showArrow={false} className="mt-4 shrink-0 md:mt-0">
              View pricing
            </MarketingCta>
          ) : null}
        </div>
      </div>
    </div>
  );
}

