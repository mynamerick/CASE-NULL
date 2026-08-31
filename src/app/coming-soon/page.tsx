import type { Metadata } from "next";
import { ComingSoonScreen } from "@/components/marketing/ComingSoonScreen";
import { isComingSoonConfigured, isComingSoonEnabled } from "@/lib/coming-soon";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Restricted preview",
  robots: { index: false, follow: false },
};

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  if (!isComingSoonEnabled()) {
    redirect("/");
  }

  const params = await searchParams;
  const redirectTo = sanitizeRedirect(params.redirect);

  return <ComingSoonScreen redirectTo={redirectTo} configured={isComingSoonConfigured()} />;
}

function sanitizeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  if (value.startsWith("/coming-soon")) {
    return "/";
  }
  return value;
}
