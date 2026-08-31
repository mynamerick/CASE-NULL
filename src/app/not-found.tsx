import type { Metadata } from "next";
import { StatusPage } from "@/components/marketing/StatusPage";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="This file is not in the archive."
      body="The page you asked for does not exist, or the link is no longer valid."
      actions={[
        { href: "/", label: "Back to home", primary: true },
        { href: "/contact", label: "Contact support" },
      ]}
    />
  );
}
