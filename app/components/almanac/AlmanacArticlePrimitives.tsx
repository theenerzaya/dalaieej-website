"use client";

import type { ReactNode } from "react";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import MediaPlaceholder from "@/app/components/getting-here/MediaPlaceholder";
import SiteImage from "@/app/components/SiteImage";
import { BodyText, Headline } from "@/app/components/ui/Typography";
import { assetUrl } from "@/lib/assetUrl";

const aboutUsPaperBackground = {
  backgroundImage: `url("${assetUrl("/images/about-us/decorations/paper.jpg")}")`,
  backgroundRepeat: "repeat",
  backgroundSize: "720px 720px",
  backgroundBlendMode: "multiply",
} as const;

/** Matches the David Bowie archival photo on Getting Here (Chapter I). */
export const COMPACT_FIGURE_CLASS =
  "mx-auto w-[13rem] shrink-0 md:mx-0 md:w-[14rem] lg:w-[15rem]";

export function ArticleSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-16 first:pt-0">
      <FadeInBlock>
        <Headline as="h2" size="sub" className="!text-left mb-8">
          {title}
        </Headline>
      </FadeInBlock>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function Subhead({ children }: { children: ReactNode }) {
  return (
    <Headline
      as="h3"
      size="sub"
      align="left"
      className="!text-ink/90 mt-10 mb-4 text-xl md:!text-2xl"
    >
      {children}
    </Headline>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <BodyText size="md" className="!text-left max-w-none text-ink/75">
      {children}
    </BodyText>
  );
}

export function ArticleImage({
  src,
  alt,
  label,
  caption,
  aspectClass = "aspect-[4/3] md:aspect-[21/9]",
  size = "default",
}: {
  src: string;
  alt: string;
  label: string;
  caption?: string;
  aspectClass?: string;
  size?: "default" | "compact";
}) {
  if (size === "compact") {
    return (
      <FadeInBlock delay={0.05}>
        <figure className={COMPACT_FIGURE_CLASS}>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink/5">
            <SiteImage
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 208px, 240px"
              className="object-cover"
            />
          </div>
          {caption ? (
            <figcaption className="mt-3 font-body text-sm leading-snug text-ink/60">
              {caption}
            </figcaption>
          ) : (
            <span className="sr-only">{label}</span>
          )}
        </figure>
      </FadeInBlock>
    );
  }

  return (
    <FadeInBlock delay={0.05}>
      <figure>
        <MediaPlaceholder
          variant="photo"
          label={label}
          imageSrc={src}
          imageAlt={alt}
          aspectClass={aspectClass}
          imageClassName="object-cover"
        />
        {caption ? (
          <figcaption className="mx-auto mt-3 max-w-lg text-center font-body text-sm leading-snug text-ink/60">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </FadeInBlock>
  );
}

export function ArticleFigure({
  src,
  alt,
  captionTitle,
  caption,
  aspectClass = "aspect-[4/3]",
  fit = "cover",
  size = "default",
}: {
  src: string;
  alt: string;
  captionTitle: string;
  caption: string;
  aspectClass?: string;
  /** "contain" shows the full image at its natural aspect ratio (e.g. maps). */
  fit?: "cover" | "contain";
  size?: "default" | "compact" | "centered";
}) {
  const isCompact = size === "compact";
  const isCentered = size === "centered";

  return (
    <FadeInBlock delay={0.05}>
      <figure
        className={
          isCompact
            ? COMPACT_FIGURE_CLASS
            : isCentered
              ? "mx-auto w-full max-w-md md:max-w-xl"
              : undefined
        }
      >
        <div
          className={
            isCompact
              ? "relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink/5"
              : fit === "contain"
                ? "mx-auto max-w-full overflow-hidden rounded-sm ring-1 ring-ink/10"
                : `relative w-full overflow-hidden rounded-sm ring-1 ring-ink/10 ${aspectClass}`
          }
        >
          {fit === "contain" ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt={alt}
              className={
                isCompact
                  ? "block h-full w-full object-contain"
                  : "block h-auto w-full"
              }
            />
          ) : (
            <SiteImage
              src={src}
              alt={alt}
              fill
              sizes={
                isCompact ? "(max-width: 768px) 208px, 240px" : "(max-width: 768px) 100vw, 720px"
              }
              className="object-cover"
            />
          )}
        </div>
        <figcaption
          className={
            isCompact
              ? "mt-3"
              : "mx-auto mt-4 max-w-2xl text-center"
          }
        >
          <p
            className={
              isCompact
                ? "font-cta text-[10px] font-medium uppercase leading-snug tracking-[0.18em] text-ink/50"
                : "font-cta text-[11px] font-medium uppercase tracking-[0.22em] text-ink/50 sm:text-xs"
            }
          >
            {captionTitle}
          </p>
          <p
            className={
              isCompact
                ? "mt-1.5 font-body text-sm leading-snug text-ink/60"
                : "mt-2 font-body text-sm leading-relaxed text-ink/60"
            }
          >
            {caption}
          </p>
        </figcaption>
      </figure>
    </FadeInBlock>
  );
}

export function ArticleVideo({
  src,
  alt,
  caption,
  credit,
}: {
  src: string;
  alt: string;
  caption: string;
  credit?: string;
}) {
  return (
    <FadeInBlock delay={0.05}>
      <figure>
        <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-surface-alt/40">
          <video
            src={src}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            aria-label={alt}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <figcaption className="mx-auto mt-3 max-w-lg text-center font-body text-sm leading-snug text-ink/60">
          {caption}
          {credit ? (
            <>
              <br />
              {credit}
            </>
          ) : null}
        </figcaption>
      </figure>
    </FadeInBlock>
  );
}

export function EpilogueQuote({
  quote,
  attribution,
}: {
  quote: string;
  attribution: string;
}) {
  return (
    <FadeInBlock>
      <div
        className="mt-20 bg-main py-10 md:py-14"
        style={aboutUsPaperBackground}
      >
        <blockquote className="ml-[5%] max-w-2xl pr-6 text-left md:pr-10">
          <p className="font-editorial-mn text-lg leading-relaxed text-ink/85 md:text-xl">
            &ldquo;{quote}&rdquo;
          </p>
          <footer className="mt-4 font-cta text-[11px] font-normal uppercase not-italic tracking-[0.15em] text-ink/60">
            {attribution}
          </footer>
        </blockquote>
      </div>
    </FadeInBlock>
  );
}
