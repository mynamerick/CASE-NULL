import { BrandLogo } from "@/components/marketing/BrandLogo";
import { MarketingAuthActions } from "@/components/marketing/MarketingAuthActions";
import { MarketingNavLinks } from "@/components/marketing/MarketingNavLinks";
import { cn } from "@/lib/utils";

export function MarketingNav({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-line-soft bg-void/95 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-6 lg:h-[4.5rem]">
        <BrandLogo variant="compact" />
        <MarketingNavLinks />
        <MarketingAuthActions />
      </div>
    </header>
  );
}
