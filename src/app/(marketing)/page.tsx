import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { PricingSection } from "@/components/marketing/PricingSection";
import { CaseCatalogCard } from "@/components/marketing/CaseCatalogCard";
import { getCaseCatalog } from "@/lib/catalog";
import { BRAND } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site";

const STEPS = [
  {
    title: "Open the case file",
    body: "Mail, messages, photos, call logs, and documents on a forensic workstation.",
  },
  {
    title: "Follow the evidence",
    body: "Discover items, unlock protected files, and pin what matters on your board.",
  },
  {
    title: "Submit your theory",
    body: "Name a suspect, motive, and location. Your report is scored against the truth.",
  },
] as const;

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);
  const featured = getCaseCatalog().filter((entry) => entry.status === "live").slice(0, 1);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: BRAND.name,
    description: BRAND.description,
    url: getSiteUrl(),
    genre: "Mystery",
    applicationCategory: "Game",
    operatingSystem: "Web browser",
    author: { "@type": "Organization", name: BRAND.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingHero />

      <section id="how-it-works" className="border-b border-line-soft bg-abyss py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-dim">
              Three moves. No tutorial telling you where to look.
            </p>
          </div>

          <ol className="mt-12 grid gap-6 md:grid-cols-3 md:gap-5">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[6px] border border-line bg-shell p-6 md:p-7"
              >
                <span className="font-mono text-[11px] tabular-nums text-amber">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="cases" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                Featured case
              </h2>
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
              <CaseCatalogCard key={entry.id} entry={entry} isSignedIn={isSignedIn} />
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <section className="border-t border-line-soft bg-shell py-16 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="max-w-lg">
            <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Ready to open a case?
            </h2>
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

