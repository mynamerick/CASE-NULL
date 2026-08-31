"use client";

import { StatusPage } from "@/components/marketing/StatusPage";
import { ReportErrorOnMount } from "@/components/analytics/ReportErrorOnMount";

export default function ErrorPage({
  reset,
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <ReportErrorOnMount error={error} source="error-boundary" />
      <StatusPage
        code="500"
        title="The terminal hit an unexpected fault."
        body="Something went wrong on our side. Your progress on this device should still be here. Try again, or return home."
        actions={[
          { label: "Try again", onClick: reset, primary: true },
          { href: "/", label: "Back to home" },
        ]}
      />
    </>
  );
}
