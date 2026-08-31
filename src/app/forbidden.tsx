import type { Metadata } from "next";
import { StatusPage } from "@/components/marketing/StatusPage";

export const metadata: Metadata = {
  title: "Access denied",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title="You do not have access to this file."
      body="This investigation is locked to your current plan, or the link is not valid for your account."
      actions={[
        { href: "/cases", label: "View your cases", primary: true },
        { href: "/#pricing", label: "View pricing" },
      ]}
    />
  );
}
