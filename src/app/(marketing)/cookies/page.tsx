import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/marketing/LegalPage";
import { CookieSettingsButton } from "@/components/marketing/CookieSettingsButton";
import { SITE } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie policy",
  description: `How ${SITE.name} uses essential cookies for sign-in and optional analytics cookies.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage eyebrow="Legal" title="Cookie policy" updated="31 August 2026">
      <LegalSection title="What cookies we use">
        <p>
          Cookies are small files stored on your device. {SITE.name} uses them only as
          described below.
        </p>
      </LegalSection>

      <LegalSection title="Essential cookies">
        <p>These are required for the site to work. They cannot be switched off.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-ink">Sign-in session cookies</strong> —
            keep you signed in, protect the session, and remember authentication state
            across pages.
          </li>
          <li>
            <strong className="font-medium text-ink">Cookie preference</strong> — stores
            whether you accepted or rejected non-essential cookies, so we do not ask on
            every visit.
          </li>
        </ul>
        <p>
          If you block essential cookies in your browser, sign-in and account features
          will not work.
        </p>
      </LegalSection>

      <LegalSection title="Non-essential cookies">
        <p>
          We do not currently set advertising cookies or load third-party analytics
          scripts unless you opt in. If you accept non-essential cookies, we load a
          product analytics tool to understand how cases are started and completed.
          Those events do not include your notes, theory text, or evidence content.
        </p>
        <p>
          Choosing “Reject non-essential” leaves only essential cookies in place.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          Use the banner when it appears, or open cookie settings:{" "}
          <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
            <CookieSettingsButton />
          </span>
          .
        </p>
        <p>
          You can also delete cookies in your browser. That signs you out and forgets
          this preference.
        </p>
      </LegalSection>

      <LegalSection title="More information">
        <p>
          See the{" "}
          <Link href="/privacy" className="text-ink underline-offset-4 hover:underline">
            privacy policy
          </Link>{" "}
          for how account and progress data are handled, or contact{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="text-ink underline-offset-4 hover:underline">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
