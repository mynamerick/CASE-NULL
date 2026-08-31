import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { CookieSettingsButton } from "@/components/marketing/CookieSettingsButton";
import { SITE } from "@/lib/site";

export function MarketingFooter() {
  return (
    <footer className="border-t border-line-soft bg-abyss">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-6">
        <div className="space-y-4">
          <BrandLogo variant="compact" linked={false} className="h-7 opacity-90" />
          <p className="max-w-sm text-sm leading-relaxed text-ink-faint">
            Interactive investigations played inside a forensic workstation. Account
            required to open a case.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.14em]">
          <Link href="/privacy" className="text-ink-faint transition-colors hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="text-ink-faint transition-colors hover:text-ink">
            Terms
          </Link>
          <Link href="/cookies" className="text-ink-faint transition-colors hover:text-ink">
            Cookies
          </Link>
          <Link href="/contact" className="text-ink-faint transition-colors hover:text-ink">
            Contact
          </Link>
          <CookieSettingsButton />
        </div>
      </div>

      <div className="border-t border-line-soft px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-ghost">
            © {SITE.copyrightYear} {SITE.name}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-ghost">
            Fictional scenarios. No real persons or events depicted.
          </p>
        </div>
      </div>
    </footer>
  );
}
