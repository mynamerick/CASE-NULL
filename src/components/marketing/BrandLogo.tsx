import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const LOGO = {
  compact: {
    src: "/logos/logo-short-text-w.png",
    width: 882,
    height: 126,
    alt: BRAND.name,
    className: "h-7 w-auto md:h-8",
  },
  full: {
    src: "/logos/logo-text-w.png",
    width: 882,
    height: 187,
    alt: BRAND.title,
    className: "h-auto w-full max-w-[320px]",
  },
} as const;

interface BrandLogoProps {
  variant?: keyof typeof LOGO;
  className?: string;
  linked?: boolean;
}

export function BrandLogo({
  variant = "compact",
  className,
  linked = true,
}: BrandLogoProps) {
  const logo = LOGO[variant];

  const image = (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      priority={variant === "compact"}
      className={cn(logo.className, className)}
    />
  );

  if (!linked) return image;

  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  );
}
