"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const marketingCtaVariants = cva(
  "group relative inline-flex items-stretch overflow-hidden rounded-[4px] font-mono text-[11px] uppercase tracking-[0.14em] outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-amber/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "border border-amber/70 bg-gradient-to-b from-[#b84545] to-[#8f3030] text-void shadow-[0_0_0_1px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(0,0,0,0.42)] hover:-translate-y-0.5 hover:border-amber hover:from-[#c04a4a] hover:to-[#9f3838] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.26),0_10px_28px_rgba(0,0,0,0.5)] active:translate-y-0 active:scale-[0.98] motion-reduce:hover:translate-y-0",
        secondary:
          "border border-dashed border-line bg-panel/80 text-ink-dim shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-ink-ghost hover:bg-raised hover:text-ink active:scale-[0.98]",
        accent:
          "border border-amber/45 bg-amber/[0.08] text-amber shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-amber/70 hover:bg-amber/14 hover:text-ink active:scale-[0.98]",
        ghost:
          "border border-transparent bg-transparent text-ink-dim hover:border-line hover:bg-raised/50 hover:text-ink active:scale-[0.98]",
      },
      size: {
        sm: "min-h-9 text-[10px]",
        md: "min-h-10 text-[11px]",
        lg: "min-h-12 text-[12px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const labelPadding = cva("", {
  variants: {
    size: {
      sm: "px-4 py-2",
      md: "px-5 py-2.5",
      lg: "px-6 py-3",
    },
  },
  defaultVariants: { size: "md" },
});

const railPadding = cva(
  "flex items-center justify-center border-l border-void/25 bg-void/20 text-inherit transition-colors group-hover:bg-void/30",
  {
    variants: {
      size: {
        sm: "px-2.5",
        md: "px-3",
        lg: "px-3.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type VariantPropsOnly = VariantProps<typeof marketingCtaVariants>;

type MarketingCtaBaseProps = VariantPropsOnly & {
  className?: string;
  /** Show trailing arrow rail. Defaults to true on primary variant. */
  showArrow?: boolean;
  children: React.ReactNode;
};

type MarketingCtaLinkProps = MarketingCtaBaseProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, keyof MarketingCtaBaseProps> & {
    href: string;
  };

type MarketingCtaButtonProps = MarketingCtaBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type MarketingCtaSpanProps = MarketingCtaBaseProps &
  React.HTMLAttributes<HTMLSpanElement> & {
    href?: never;
    as: "span";
  };

export type MarketingCtaProps =
  | MarketingCtaLinkProps
  | MarketingCtaButtonProps
  | MarketingCtaSpanProps;

function CtaContent({
  children,
  showArrow,
  variant,
  size,
}: {
  children: React.ReactNode;
  showArrow: boolean;
  variant: VariantPropsOnly["variant"];
  size: VariantPropsOnly["size"];
}) {
  const label = (
    <span className={cn("inline-flex items-center", labelPadding({ size }), variant === "primary" && "font-semibold")}>
      {children}
    </span>
  );

  if (showArrow && variant === "primary") {
    return (
      <>
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1 bg-void/45 transition-colors group-hover:bg-void/55"
        />
        <span
          className={cn(
            "inline-flex items-center font-semibold",
            size === "sm" && "py-2 pl-6 pr-4",
            size === "md" && "py-2.5 pl-7 pr-5",
            size === "lg" && "py-3 pl-8 pr-6",
            !size && "py-2.5 pl-7 pr-5",
          )}
        >
          {children}
        </span>
        <span className={railPadding({ size })} aria-hidden>
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
            strokeWidth={2.5}
          />
        </span>
      </>
    );
  }

  return (
    <span className={cn("inline-flex w-full items-center justify-center", labelPadding({ size }))}>
      {children}
    </span>
  );
}

export const MarketingCta = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement,
  MarketingCtaProps
>(function MarketingCta(props, ref) {
  const {
    variant = "primary",
    size = "md",
    className,
    showArrow = variant === "primary",
    children,
    ...rest
  } = props;

  const classes = cn(marketingCtaVariants({ variant, size }), className);

  if ("as" in props && props.as === "span") {
    const { as: _as, ...spanRest } = rest as MarketingCtaSpanProps;
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={classes} {...spanRest}>
        <CtaContent showArrow={showArrow} variant={variant} size={size}>
          {children}
        </CtaContent>
      </span>
    );
  }

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as Omit<MarketingCtaLinkProps, keyof MarketingCtaBaseProps>;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...linkRest}
      >
        <CtaContent showArrow={showArrow} variant={variant} size={size}>
          {children}
        </CtaContent>
      </Link>
    );
  }

  const buttonRest = rest as Omit<MarketingCtaButtonProps, keyof MarketingCtaBaseProps>;
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...buttonRest}>
      <CtaContent showArrow={showArrow} variant={variant} size={size}>
        {children}
      </CtaContent>
    </button>
  );
});

MarketingCta.displayName = "MarketingCta";
