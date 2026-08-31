import { ClerkPricingTable } from "@/components/marketing/ClerkPricingTable";
import { MarketingSectionTitle } from "@/components/marketing/MarketingRevealText";

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-line-soft bg-abyss py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <MarketingSectionTitle className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Pricing
          </MarketingSectionTitle>
          <p className="mt-4 text-base leading-relaxed text-ink-dim">
            Start free with three cases. Upgrade when you want the full library.
          </p>
        </div>

        <div className="mt-12">
          <ClerkPricingTable />
        </div>
      </div>
    </section>
  );
}
