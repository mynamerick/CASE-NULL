import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { isComingSoonEnabled } from "@/lib/coming-soon";
import { getSiteUrl } from "@/lib/site";

export const OG_IMAGE_PATH = "/marketing/og-image.png";

export const SITE_KEYWORDS = [
  "mystery game",
  "browser mystery",
  "investigation game",
  "forensic mystery",
  "interactive fiction",
  "detective game",
  BRAND.name,
] as const;

/** Absolute URL for a site path (e.g. `/contact`). */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  if (path === "/" || path === "") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface PageSeoOptions {
  /** Short page title — root template appends brand name where applicable. */
  title: string;
  description: string;
  /** Path with leading slash. */
  path: string;
  /** Public marketing pages default to indexable; auth/app routes should pass false. */
  index?: boolean;
  ogImage?: string;
}

/** Shared metadata for marketing and utility pages. Respects COMING_SOON noindex. */
export function buildPageMetadata({
  title,
  description,
  path,
  index = true,
  ogImage = OG_IMAGE_PATH,
}: PageSeoOptions): Metadata {
  const url = absoluteUrl(path);
  const noIndex = !index || isComingSoonEnabled();
  const ogTitle = path === "/" ? BRAND.title : `${title} — ${BRAND.name}`;

  return {
    title: path === "/" ? { absolute: BRAND.title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url,
      siteName: BRAND.name,
      title: ogTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${BRAND.name} — ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
  };
}
