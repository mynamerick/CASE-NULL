import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { BRAND } from "@/lib/brand";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { getSiteUrl } from "@/lib/site";
import { CookieConsent } from "@/components/marketing/CookieConsent";
import { DevToolsMount } from "@/components/dev/DevToolsMount";
import { NetworkStatus } from "@/components/marketing/NetworkStatus";
import { SkipLink } from "@/components/marketing/SkipLink";
import { MonitoringProvider } from "@/components/analytics/MonitoringProvider";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-stack",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-stack",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: BRAND.title,
    template: `%s — ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: BRAND.name,
    title: BRAND.title,
    description: BRAND.description,
    images: [
      {
        url: "/marketing/hero.png",
        alt: `${BRAND.name} forensic workstation`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.title,
    description: BRAND.description,
    images: ["/marketing/hero.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logos/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${plexSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <SkipLink />
        <ClerkProvider ui={ui} appearance={clerkAppearance}>
          {children}
          <MonitoringProvider />
          <CookieConsent />
          <NetworkStatus />
          <DevToolsMount />
        </ClerkProvider>
      </body>
    </html>
  );
}
