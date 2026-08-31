"use client";

import { useEffect } from "react";
import { reportClientError } from "@/lib/report-error";

export function ReportErrorOnMount({
  error,
  source,
}: {
  error: Error & { digest?: string };
  source: string;
}) {
  useEffect(() => {
    reportClientError({
      message: error.message || "React error boundary",
      digest: error.digest,
      source,
      stack: error.stack,
    });
  }, [error, source]);

  return null;
}
