"use client";

import { StatusPage } from "@/components/marketing/StatusPage";
import { ReportErrorOnMount } from "@/components/analytics/ReportErrorOnMount";
import "./globals.css";

export default function GlobalError({
  reset,
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body className="antialiased">
        <ReportErrorOnMount error={error} source="global-error-boundary" />
        <StatusPage
          code="500"
          title="The terminal hit an unexpected fault."
          body="A serious error stopped the page from loading. Try again."
          actions={[
            { label: "Try again", onClick: reset, primary: true },
            { href: "/", label: "Back to home" },
          ]}
        />
      </body>
    </html>
  );
}
