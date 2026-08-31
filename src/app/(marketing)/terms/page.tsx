import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/marketing/LegalPage";
import { SITE } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of service",
  description: `Terms for using ${SITE.name}, including accounts, fictional content, and subscriptions.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of service" updated="31 August 2026">
      <LegalSection title="Agreement">
        <p>
          These terms apply when you use {SITE.name} at {SITE.domain}, including the
          marketing site, accounts, and the investigation game. If you do not agree, do
          not use the service.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          {SITE.name} is a browser-based interactive investigation game. You explore
          fictional recovered devices, files, messages, photos, and other digital
          evidence, then submit a theory.
        </p>
        <p>
          All investigations, characters, organisations, locations, and evidence are
          fiction. They are not real cases and do not depict real people or events.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          You need an account to open a case. You must provide accurate information,
          keep your login details secure, and be at least 16 years old.
        </p>
        <p>
          You are responsible for activity on your account. Sign out on shared devices.
          Manage or delete your account from{" "}
          <Link href="/account" className="text-ink underline-offset-4 hover:underline">
            Account
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Access and subscriptions">
        <p>
          A free account includes a limited number of investigations, as shown on the
          site at the time you play. Premium, if offered, unlocks additional cases and
          is billed through our subscription provider.
        </p>
        <p>
          Prices, included cases, and features may change. Coming-soon cases and
          future features described on the site are not a guarantee they will ship.
        </p>
        <p>
          We may suspend access if we need to maintain the service, if your payment
          fails, or if you misuse the service.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the service for any unlawful purpose</li>
          <li>Attempt to break into another player’s account or progress</li>
          <li>Attack, scrape, or overload the site</li>
          <li>Present fictional case content as real-world evidence or news</li>
          <li>Redistribute case content or solution material as your own product</li>
        </ul>
      </LegalSection>

      <LegalSection title="Progress and content">
        <p>
          Your notes, pins, and theories are stored so you can continue a case. We may
          update a case after publication. We try not to wipe progress, but we do not
          guarantee that every earlier save will remain compatible if a case changes.
        </p>
        <p>
          You keep ownership of the text you write in notes and theory submissions. You
          give us permission to store that text solely to operate the game.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The {SITE.name} name, interface, case writing, and related materials belong to
          us or our licensors. You may play the game for personal, non-commercial use.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer">
        <p>
          The service is provided as-is. Investigations are entertainment. We do not
          warrant uninterrupted access, that a case cannot be spoiled, or that scores
          have any meaning outside the game.
        </p>
        <p>
          To the fullest extent allowed by law, we are not liable for lost progress,
          lost profits, or indirect damages arising from use of the service. Nothing in
          these terms limits rights that cannot be limited under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Privacy details are in the{" "}
          <Link href="/privacy" className="text-ink underline-offset-4 hover:underline">
            privacy policy
          </Link>
          . For other questions:{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="text-ink underline-offset-4 hover:underline">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
