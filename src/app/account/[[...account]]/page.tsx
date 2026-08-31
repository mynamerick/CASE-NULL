import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { AccountWorkspace } from "@/components/marketing/AccountWorkspace";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Account",
  description: `Manage your ${SITE.name} account, password, email, and deletion.`,
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  await auth.protect();
  return <AccountWorkspace />;
}
