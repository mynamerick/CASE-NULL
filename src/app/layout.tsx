import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import { IBM_Plex_Sans, JetBrains_Mono, Barlow_Condensed } from "next/font/google";
import { GeistPixelGrid } from "geist/font/pixel";
import { BRAND } from "@/lib/brand";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { isComingSoonEnabled } from "@/lib/coming-soon";
import { getSiteUrl } from "@/lib/site";
import { OG_IMAGE_PATH, SITE_KEYWORDS, absoluteUrl } from "@/lib/seo";
import { CookieConsent } from "@/components/marketing/CookieConsent";
import { DevToolsMount } from "@/components/dev/DevToolsMount";
import { NetworkStatus } from "@/components/marketing/NetworkStatus";
import { SkipLink } from "@/components/marketing/SkipLink";
import { MonitoringProvider } from "@/components/analytics/MonitoringProvider";
import { AudioPrimer } from "@/game/audio/AudioPrimer";
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

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display-stack",
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
  keywords: [...SITE_KEYWORDS],
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  alternates: { canonical: absoluteUrl("/") },
  robots: isComingSoonEnabled()
    ? { index: false, follow: false }
    : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: absoluteUrl("/"),
    siteName: BRAND.name,
    title: BRAND.title,
    description: BRAND.description,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} — browser mystery cases`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.title,
    description: BRAND.description,
    images: [OG_IMAGE_PATH],
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
    <html lang="en-GB" className={`${plexSans.variable} ${jetbrainsMono.variable} ${barlowCondensed.variable} ${GeistPixelGrid.variable}`}>
      <body className="antialiased">
        <SkipLink />
        <AudioPrimer />
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
