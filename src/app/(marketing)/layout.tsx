import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: BRAND.title,
  description: BRAND.description,
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main id="main" className="pt-16 lg:pt-[4.5rem]">
        {children}
      </main>
      <MarketingFooter />
    </>
  );
}
