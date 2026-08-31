import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

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
