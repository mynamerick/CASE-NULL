import type { Metadata } from "next";
import { StatusPage } from "@/components/marketing/StatusPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Maintenance",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <StatusPage
      code="Unavailable"
      title="The archive is closed for maintenance."
      body={`We are making a short change to ${SITE.name}. Try again in a few minutes. Your account and saved progress are not being deleted.`}
      actions={[{ href: `mailto:${SITE.supportEmail}`, label: "Contact support" }]}
    />
  );
}
