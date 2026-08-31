import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.title,
    short_name: BRAND.name,
    description: BRAND.description,
    start_url: "/",
    display: "browser",
    background_color: "#07090d",
    theme_color: "#07090d",
    icons: [
      {
        src: "/logos/favicon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/logos/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
