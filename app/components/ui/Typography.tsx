"use client";

/**
 * Typographic primitives for the Dalai Eej design system.
 *
 * Every home / shared-chrome block composes these four roles, in this order:
 *
 *   <Eyebrow>...</Eyebrow>
 *   <Headline>...</Headline>
 *   <BodyText>...</BodyText>
 *   <CTALink /> or <CTAButton />
 *
 * Font mapping:
 *   - Eyebrow / CTAs / UI → Montserrat (`font-cta`)
 *   - Headline EN (default)  → Playfair Display Italic (`font-editorial-en`)
 *   - Headline MN (default)  → Cormorant Garamond Italic (`font-editorial-mn`)
 *   - Headline EN (signature)→ Sloops (`font-signature`). MN ignores `signature`.
 *   - BodyText               → Araboto (`font-body`)
 */

import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type Tone = "light" | "dark";

const toneToMutedText: Record<Tone, string> = {
  light: "text-ink/55",
  dark: "text-main/60",
};

const toneToBodyText: Record<Tone, string> = {
  light: "text-ink/75",
  dark: "text-main/75",
};

const toneToCtaText: Record<Tone, string> = {
  light: "text-ink",
  dark: "text-main",
};

const toneToCtaBorder: Record<Tone, string> = {
  light: "border-ink/30 group-hover:border-ink",
  dark: "border-main/40 group-hover:border-main",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/*  Eyebrow — Montserrat, uppercase, tracked, small. One per block.            */
/* -------------------------------------------------------------------------- */

export interface EyebrowProps extends ComponentPropsWithoutRef<"p"> {
  tone?: Tone;
  as?: "p" | "span" | "h1";
}

export function Eyebrow({
  as: Tag = "p",
  tone = "light",
  className,
  children,
  ...rest
}: EyebrowProps) {
  const locale = useLocale();
  const isMn = locale === "mn";
  return (
    <Tag
      {...rest}
      className={cx(
        "font-cta uppercase",
        isMn
          ? "text-[11px] sm:text-xs font-light tracking-[0.18em]"
          : "text-[11px] sm:text-xs font-medium tracking-[0.3em]",
        toneToMutedText[tone],
        className
      )}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  Headline — editorial italic (Playfair EN / Cormorant MN). Sloops for EN   */
/*  when variant="signature" (hero wordmark + decorative accents).             */
/* -------------------------------------------------------------------------- */

type HeadlineSize = "hero" | "section" | "sub";
type HeadlineVariant = "editorial" | "signature";

const headlineSizeClasses: Record<HeadlineSize, string> = {
  hero:    "text-5xl md:text-7xl lg:text-8xl leading-[1.05]",
  section: "text-3xl md:text-4xl lg:text-5xl leading-snug",
  sub:     "text-2xl md:text-3xl lg:text-4xl leading-snug",
};

const headlineSignatureSizeClasses: Record<HeadlineSize, string> = {
  hero:    "text-6xl md:text-8xl lg:text-9xl leading-[1] tracking-tight",
  section: "text-5xl md:text-6xl leading-tight tracking-tight",
  sub:     "text-4xl md:text-5xl leading-tight tracking-tight",
};

export interface HeadlineProps {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: HeadlineSize;
  variant?: HeadlineVariant;
  tone?: Tone;
  align?: "left" | "center" | "right";
  className?: string;
  children: ReactNode;
}

export function Headline({
  as: Tag = "h2",
  size = "section",
  variant = "editorial",
  tone = "light",
  align = "center",
  className,
  children,
}: HeadlineProps) {
  const locale = useLocale();
  const isMn = locale === "mn";

  // MN never uses Sloops; fall back to editorial italic regardless of variant.
  const useSignature = variant === "signature" && !isMn;

  const fontClass = useSignature
    ? "font-signature font-normal"
    : isMn
      ? "font-editorial-mn font-normal"
      : "font-editorial-en font-normal";

  const sizeClass = useSignature
    ? headlineSignatureSizeClasses[size]
    : headlineSizeClasses[size];

  const alignClass =
    align === "left" ? "text-left" :
    align === "right" ? "text-right" :
    "text-center";

  const toneClass = tone === "dark" ? "text-main" : "text-water-deep";

  return (
    <Tag
      className={cx(
        fontClass,
        sizeClass,
        alignClass,
        toneClass,
        className
      )}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/*  BodyText — Araboto, light, comfortable leading. The only body font.       */
/* -------------------------------------------------------------------------- */

type BodySize = "sm" | "md" | "lg";

const bodySizeClasses: Record<BodySize, string> = {
  sm: "text-sm",
  md: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
};

export interface BodyTextProps extends ComponentPropsWithoutRef<"p"> {
  tone?: Tone;
  size?: BodySize;
  align?: "left" | "center" | "right";
}

export function BodyText({
  tone = "light",
  size = "md",
  align = "center",
  className,
  children,
  ...rest
}: BodyTextProps) {
  const alignClass =
    align === "left" ? "text-left" :
    align === "right" ? "text-right" :
    "text-center";

  return (
    <p
      {...rest}
      className={cx(
        "font-body font-light leading-relaxed",
        bodySizeClasses[size],
        alignClass,
        toneToBodyText[tone],
        className
      )}
    >
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  CTALink — Montserrat underlined text link. Internal: → arrow; external: ↗.  */
/*  Anything that has a link/action and reads as a CTA uses this or CTAButton. */
/* -------------------------------------------------------------------------- */

export interface CTALinkProps {
  href: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  /** Show the arrow at the end of the link. Defaults to true. */
  arrow?: boolean;
  external?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

export function CTALink({
  href,
  tone = "light",
  className,
  children,
  arrow = true,
  external,
  onClick,
  "aria-label": ariaLabel,
}: CTALinkProps) {
  const locale = useLocale();
  const isMn = locale === "mn";

  const content = (
    <>
      <span className={cx("border-b pb-0.5 transition-colors", toneToCtaBorder[tone])}>
        {children}
      </span>
      {arrow && (external ? <ExternalArrowGlyph /> : <ArrowGlyph />)}
    </>
  );

  const baseClass = cx(
    "group inline-flex items-center gap-2 font-cta uppercase",
    isMn
      ? "text-[11px] sm:text-xs font-light tracking-[0.18em]"
      : "text-[11px] sm:text-xs font-medium tracking-[0.18em]",
    toneToCtaText[tone],
    "hover:gap-3 transition-all",
    className
  );

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={baseClass} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClass} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

function ArrowGlyph() {
  return (
    <svg
      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function ExternalArrowGlyph() {
  return (
    <span
      className="text-[1em] leading-none transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
      aria-hidden="true"
    >
      ↗
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  CTAButton — Montserrat solid button. Primary (leaf) / Secondary (bark) /  */
/*  Ghost. Renders as <button> by default, as <a>/<Link> if `href` provided.  */
/* -------------------------------------------------------------------------- */

type CTAButtonVariant = "primary" | "secondary" | "ghost";
type CTAButtonSize = "sm" | "md";

const ctaButtonSizeClasses: Record<CTAButtonSize, string> = {
  sm: "px-5 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-xs",
  md: "px-6 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm",
};

const ctaButtonVariantClasses: Record<CTAButtonVariant, string> = {
  primary:   "bg-leaf text-main hover:bg-[#4a6350] focus-visible:ring-leaf/40",
  secondary: "bg-bark text-main hover:bg-bark-hover focus-visible:ring-bark/40",
  ghost:     "bg-transparent text-main border border-main/30 hover:bg-main/10 focus-visible:ring-main/30",
};

export interface CTAButtonProps {
  variant?: CTAButtonVariant;
  size?: CTAButtonSize;
  href?: string;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  disabled?: boolean;
}

export function CTAButton({
  variant = "primary",
  size = "sm",
  href,
  external,
  type = "button",
  onClick,
  className,
  children,
  "aria-label": ariaLabel,
  disabled,
}: CTAButtonProps) {
  const locale = useLocale();
  const isMn = locale === "mn";

  const base = cx(
    "inline-flex shrink-0 items-center justify-center gap-2",
    "font-cta uppercase",
    isMn ? "font-light tracking-[0.18em]" : "font-medium tracking-[0.18em]",
    "rounded-none whitespace-nowrap",
    "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    disabled && "opacity-50 pointer-events-none",
    ctaButtonSizeClasses[size],
    ctaButtonVariantClasses[variant],
    className
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={base}
          onClick={onClick}
          aria-label={ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={base} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={base}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Block — optional convenience wrapper. Lays out the eyebrow/headline/body/  */
/*  CTA stack with the canonical spacing so sections stop inventing their own. */
/* -------------------------------------------------------------------------- */

export interface BlockProps {
  eyebrow?: ReactNode;
  headline?: ReactNode;
  body?: ReactNode;
  cta?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function Block({
  eyebrow,
  headline,
  body,
  cta,
  align = "center",
  className,
}: BlockProps) {
  const alignClass = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <div className={cx("flex flex-col gap-6 max-w-3xl", alignClass, className)}>
      {eyebrow && <div>{eyebrow}</div>}
      {headline && <div>{headline}</div>}
      {body && <div className="max-w-2xl">{body}</div>}
      {cta && <div>{cta}</div>}
    </div>
  );
}

// ElementType re-export kept to allow callers to type custom `as` values.
export type { ElementType };
