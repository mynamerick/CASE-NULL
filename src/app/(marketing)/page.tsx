import { auth } from "@clerk/nextjs/server";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { MarketingCta } from "@/components/marketing/MarketingCta";
import { MarketingCtaBand } from "@/components/marketing/MarketingCtaBand";
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
        <MarketingCta href="/cases" variant="secondary" size="md" showArrow={false}>
              View catalog
            </MarketingCta>
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

      <MarketingCtaBand
        title="Ready to open a case?"
        description="Create a free account, pick from the catalog, and start investigating."
        href={isSignedIn ? "/cases" : "/signup"}
        label={isSignedIn ? "Open catalog" : "Sign up"}
      />
    </>
  );
}

