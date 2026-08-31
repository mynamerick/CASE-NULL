import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { MarketingSectionTitle } from "@/components/marketing/MarketingRevealText";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CaseCatalogCard } from "@/components/marketing/CaseCatalogCard";
import { getCaseCatalog } from "@/lib/catalog";
import { BRAND } from "@/lib/brand";
import { hasPremiumAccess } from "@/lib/features";
import { getUserProgressMap } from "@/lib/progress-server";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: BRAND.title,
  description: BRAND.description,
  path: "/",
});

export default async function HomePage() {
  const { userId, has } = await auth();
  const isSignedIn = Boolean(userId);
  const isPremium = userId ? hasPremiumAccess(has) : false;
  const progressMap = userId ? await getUserProgressMap(userId) : {};
  const featured = getCaseCatalog().filter((entry) => entry.status === "live").slice(0, 1);
  const siteUrl = absoluteUrl("/");
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BRAND.name,
      url: siteUrl,
      description: BRAND.description,
      publisher: { "@type": "Organization", name: SITE.legalName },
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: BRAND.name,
      description: BRAND.description,
      url: siteUrl,
      genre: "Mystery",
      applicationCategory: "Game",
      operatingSystem: "Web browser",
      author: { "@type": "Organization", name: SITE.legalName },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingHero />

      <HowItWorksSection />

      <section id="cases" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <MarketingSectionTitle className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                Featured case
              </MarketingSectionTitle>
              <p className="mt-4 text-base leading-relaxed text-ink-dim">
                One investigation live now. More in production. Browse the full catalog
                once you have an account.
              </p>
            </div>
            <Link
              href="/cases"
              className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] border border-line px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim transition-colors hover:border-ink-ghost hover:text-ink active:scale-[0.98]"
            >
              View catalog
            </Link>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {featured.map((entry) => (
              <CaseCatalogCard
                key={entry.id}
                entry={entry}
                isSignedIn={isSignedIn}
                isPremium={isPremium}
                progressStatus={progressMap[entry.id] ?? null}
              />
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <section className="border-t border-line-soft bg-shell py-16 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="max-w-lg">
            <MarketingSectionTitle
              className="text-2xl font-semibold tracking-tight text-ink md:text-3xl"
              delay={40}
            >
              Ready to open a case?
            </MarketingSectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">
              Create a free account, pick from the catalog, and start investigating.
            </p>
          </div>
          <Link
            href={isSignedIn ? "/cases" : "/signup"}
            className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] border border-amber/60 bg-amber/90 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-void transition-colors hover:bg-amber active:scale-[0.98]"
          >
            {isSignedIn ? "Open catalog" : "Sign up"}
          </Link>
        </div>
      </section>
    </>
  );
}

