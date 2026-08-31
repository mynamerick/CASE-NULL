import type { Metadata } from "next";
import Link from "next/link";
import { proseContainerClass } from "@/lib/layout";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.name} support for account, billing, or site questions.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-[100dvh] bg-void">
      <header className="border-b border-line-soft bg-abyss">
        <div className={cn(proseContainerClass, "py-12 md:py-16")}>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
            Support
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Contact
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-dim">
            For account, billing, or site questions, email us. Do not send real personal
            evidence or anything you would not want stored in an inbox.
          </p>
        </div>
      </header>

      <div className={cn(proseContainerClass, "space-y-8 py-10 md:py-12")}>
        <section className="rounded-[6px] border border-line bg-shell p-6">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
            Email
          </h2>
          <a
            href={`mailto:${SITE.supportEmail}`}
            className="mt-3 inline-block text-lg text-ink underline-offset-4 hover:underline"
          >
            {SITE.supportEmail}
          </a>
          <p className="mt-3 text-sm leading-relaxed text-ink-dim">
            We read support mail as soon as we can. Include the email on your account if
            it is different from the one you are writing from.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Faster self-serve</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-dim">
            <li>
              Change email, password, or delete your account from{" "}
              <Link href="/account" className="text-ink underline-offset-4 hover:underline">
                Account
              </Link>
            </li>
            <li>
              Reset a forgotten password from{" "}
              <Link href="/login" className="text-ink underline-offset-4 hover:underline">
                Sign in
              </Link>
            </li>
            <li>
              Cookie choices:{" "}
              <Link href="/cookies" className="text-ink underline-offset-4 hover:underline">
                Cookie policy
              </Link>
            </li>
          </ul>
        </section>

        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-ghost">
          Investigations are fictional. No real persons or events depicted.
        </p>
      </div>
    </div>
  );
}
