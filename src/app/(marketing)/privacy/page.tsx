import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/marketing/LegalPage";
import { SITE } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy policy",
  description: `How ${SITE.name} collects, uses, and stores account and investigation progress data.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy policy" updated="31 August 2026">
      <LegalSection title="Who we are">
        <p>
          {SITE.legalName} (“we”, “us”) operates the {SITE.name} website and game at{" "}
          {SITE.domain}. This policy describes the personal data we process when you
          create an account, subscribe, or play an investigation.
        </p>
        <p>
          Questions:{" "}
          <a href={`mailto:${SITE.supportEmail}`} className="text-ink underline-offset-4 hover:underline">
            {SITE.supportEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Fictional content">
        <p>
          {SITE.name} investigations, characters, devices, files, messages, and other
          evidence are fictional. They do not depict real persons, real incidents, or
          real private data.
        </p>
      </LegalSection>

      <LegalSection title="Data we process">
        <p>Depending on how you use the service, we may process:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-medium text-ink">Account data</strong> — name, email
            address, authentication details, and session information. Sign-in is handled
            by our authentication provider.
          </li>
          <li>
            <strong className="font-medium text-ink">Billing data</strong> — if you
            subscribe to Premium, payment is handled by our billing provider and its
            payment processor. We receive subscription status, not your full card number.
          </li>
          <li>
            <strong className="font-medium text-ink">Investigation progress</strong> —
            discovered evidence, unlocks, board pins, notes, and submitted theories,
            stored against your account in our cloud database so you can resume on
            another device. A local copy may also be kept in your browser.
          </li>
          <li>
            <strong className="font-medium text-ink">Marketing preferences</strong> — if you
            opt in, your choice and the time you gave it are stored on your account.
          </li>
          <li>
            <strong className="font-medium text-ink">Cookie preferences</strong> — your
            accept / reject / preference choice, stored in your browser.
          </li>
          <li>
            <strong className="font-medium text-ink">Technical logs</strong> — standard
            hosting logs from our hosting provider (IP address, user agent, request path)
            used to operate and secure the site.
          </li>
        </ul>
        <p>
          We do not currently run third-party advertising pixels. Optional product
          analytics runs only if you opt in via cookie preferences. Error reports
          needed to fix faults may still be sent to our monitoring provider without
          marketing cookies.
        </p>
      </LegalSection>

      <LegalSection title="Marketing email">
        <p>
          We only send promotional email — such as new case releases — if you opt in. The
          checkbox on sign-up is unchecked by default. You can turn product updates on or off
          anytime from Account settings.
        </p>
        <p>
          Transactional email about your account (welcome, billing, security) is separate
          and may still be sent when needed to run the service.
        </p>
        <p>
          Marketing broadcasts include a way to opt out in the email itself, as required by
          law. That link only affects promotional mail, not account or billing messages.
        </p>
      </LegalSection>

      <LegalSection title="Why we use this data">
        <ul className="list-disc space-y-2 pl-5">
          <li>To create and secure your account</li>
          <li>To let you play cases and restore progress</li>
          <li>To process subscriptions you start</li>
          <li>To respond to support requests</li>
          <li>To keep the service secure and available</li>
        </ul>
        <p>
          We do not sell your personal data. We do not use investigation notes or
          theories for advertising.
        </p>
      </LegalSection>

      <LegalSection title="Processors">
        <p>We use these service providers to run {SITE.name}:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Authentication and billing provider — sign-in, sessions, and subscriptions</li>
          <li>Email provider — transactional mail and marketing contact lists for opted-in users</li>
          <li>Database provider — case progress storage</li>
          <li>Hosting provider — website and application hosting</li>
        </ul>
        <p>
          Account emails such as verification and password reset are sent by our
          authentication provider. Our domain, DNS, and HTTPS may be managed by
          additional infrastructure providers.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep data">
        <p>
          Account and progress data are kept while your account is open. If you delete
          your account from{" "}
          <Link href="/account" className="text-ink underline-offset-4 hover:underline">
            Account
          </Link>
          , your authentication record is deleted. Associated progress rows may remain
          until they are cleaned up. Hosting logs are retained only as long as needed
          for security and operations.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <ul className="list-disc space-y-2 pl-5">
          <li>Update your email or password from Account settings</li>
          <li>Turn product update email on or off from Account settings</li>
          <li>Delete your account from Account settings</li>
          <li>
            Change cookie preferences from the footer or the{" "}
            <Link href="/cookies" className="text-ink underline-offset-4 hover:underline">
              cookie policy
            </Link>
          </li>
          <li>
            Contact us at {SITE.supportEmail} to ask what data we hold or to request
            deletion if you cannot access Account settings
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          {SITE.name} is not directed at children under 16. Do not create an account if
          you are under 16.
        </p>
      </LegalSection>

      <LegalSection title="International transfers">
        <p>
          Our providers may process data in the United Kingdom, European Economic Area,
          United States, or other countries. Where they do, they are responsible for
          applying appropriate safeguards under their own terms.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update this policy as the service changes. The date at the top of this
          page will change when we do.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
