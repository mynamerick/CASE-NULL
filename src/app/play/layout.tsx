import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Workstation",
  description:
    "Forensic review terminal. Open the evidence, follow the trail, submit your theory.",
  robots: { index: false, follow: false },
};

export default async function PlayLayout({ children }: { children: React.ReactNode }) {
  await auth.protect();
  return <main id="main">{children}</main>;
}
