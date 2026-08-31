import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { AmbientPreload } from "@/game/audio/AmbientPreload";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Workstation",
  description:
    "Forensic review terminal. Open the evidence, follow the trail, submit your theory.",
  path: "/play",
  index: false,
});

export default async function PlayLayout({ children }: { children: React.ReactNode }) {
  await auth.protect();
  return (
    <main id="main">
      <AmbientPreload />
      {children}
    </main>
  );
}
