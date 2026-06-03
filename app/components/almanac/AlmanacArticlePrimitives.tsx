"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import FrostedMapSection from "@/app/components/getting-here/FrostedMapSection";
import MediaPlaceholder from "@/app/components/getting-here/MediaPlaceholder";
import SiteImage from "@/app/components/SiteImage";
import { BodyText, Eyebrow, Headline } from "@/app/components/ui/Typography";
import { assetUrl } from "@/lib/assetUrl";

const aboutUsPaperBackground = {
  backgroundImage: `url("${assetUrl("/images/about-us/decorations/paper.jpg")}")`,
  backgroundRepeat: "repeat",
  backgroundSize: "720px 720px",
  backgroundBlendMode: "multiply",
} as const;

const archivalLedgerBackground = {
  backgroundImage: `url("${assetUrl("/images/about-us/decorations/2009.png")}")`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundBlendMode: "multiply",
} as const;

/** Matches the David Bowie archival photo on Getting Here (Chapter I). */
export const COMPACT_FIGURE_CLASS =
  "mx-auto w-full max-w-[13rem] shrink-0 md:mx-0 md:w-[14rem] md:max-w-none lg:w-[15rem]";

export const COMPACT_LARGE_FIGURE_CLASS =
  "mx-auto w-full max-w-[min(100%,20rem)] shrink-0 sm:max-w-[22rem] md:mx-0 md:w-[24rem] md:max-w-none lg:w-[28rem] xl:w-[30rem]";

/** Two-thirds of `compactLarge` (one-third smaller). */
export const COMPACT_LARGE_SM_FIGURE_CLASS =
  "mx-auto w-full max-w-[min(100%,17.5rem)] shrink-0 md:mx-0 md:w-[18.75rem] md:max-w-none lg:w-[20rem]";

/** 90% of `compactLarge`. */
export const COMPACT_LARGE_90_FIGURE_CLASS =
  "mx-auto w-full max-w-[min(100%,18rem)] shrink-0 sm:max-w-[19.8rem] md:mx-0 md:w-[21.6rem] md:max-w-none lg:w-[25.2rem] xl:w-[27rem]";

export type CompactFigureSize =
  | "compact"
  | "compactLarge"
  | "compactLargeSm"
  | "compactLarge90";

function compactFigureClass(size: CompactFigureSize) {
  if (size === "compactLarge") return COMPACT_LARGE_FIGURE_CLASS;
  if (size === "compactLargeSm") return COMPACT_LARGE_SM_FIGURE_CLASS;
  if (size === "compactLarge90") return COMPACT_LARGE_90_FIGURE_CLASS;
  return COMPACT_FIGURE_CLASS;
}

function compactImageSizes(size: CompactFigureSize) {
  if (size === "compactLarge") return "(max-width: 768px) 416px, 480px";
  if (size === "compactLarge90") return "(max-width: 768px) 374px, 432px";
  if (size === "compactLargeSm") return "(max-width: 768px) 280px, 320px";
  return "(max-width: 768px) 208px, 240px";
}

export function isCompactFigureSize(size?: string): size is CompactFigureSize {
  return (
    size === "compact" ||
    size === "compactLarge" ||
    size === "compactLargeSm" ||
    size === "compactLarge90"
  );
}

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
      <FadeInBlock distance={20}>
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
    <BodyText size="md" className="!text-left max-w-none min-w-0 break-words text-ink/75">
      {children}
    </BodyText>
  );
}

/** Narrow index-card aside for inline almanac facts (floats beside chapter prose). */
export function InlineDataCard({
  eyebrow,
  body,
  className,
}: {
  eyebrow: string;
  body: string;
  className?: string;
}) {
  const locale = useLocale();
  const isMn = locale === "mn";

  return (
    <aside
      aria-label={eyebrow}
      className={[
        "w-full max-w-[18.75rem] border border-ink/12 bg-muted/90 px-5 py-4 shadow-[0_1px_0_rgba(13,15,28,0.04)]",
        "md:float-right md:clear-right md:ml-8 md:mb-5 md:mt-0.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p
        className={[
          "font-cta uppercase text-ink/55 mb-2.5",
          isMn
            ? "text-[10px] font-light tracking-[0.2em]"
            : "text-[10px] font-medium tracking-[0.28em]",
        ].join(" ")}
      >
        {eyebrow}
      </p>
      <p className="font-body text-sm leading-[1.65] text-ink/68">{body}</p>
    </aside>
  );
}

export function ArticleImage({
  src,
  alt,
  label,
  caption,
  aspectClass = "aspect-[4/3] md:aspect-[21/9]",
  fit = "cover",
  size = "default",
}: {
  src: string;
  alt: string;
  label: string;
  caption?: string;
  aspectClass?: string;
  fit?: "cover" | "contain";
  size?: "default" | CompactFigureSize;
}) {
  if (isCompactFigureSize(size)) {
    return (
      <figure className={compactFigureClass(size)}>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink/5">
            <SiteImage
              src={src}
              alt={alt}
              fill
              sizes={compactImageSizes(size)}
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
    );
  }

  if (fit === "contain") {
    return (
      <figure>
        <div className="mx-auto max-w-full overflow-hidden rounded-sm ring-1 ring-ink/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetUrl(src)}
            alt={alt}
            className="block h-auto w-full"
          />
        </div>
        {caption ? (
          <figcaption className="mx-auto mt-3 max-w-lg text-center font-body text-sm leading-snug text-ink/60">
            {caption}
          </figcaption>
        ) : (
          <span className="sr-only">{label}</span>
        )}
      </figure>
    );
  }

  return (
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
  frameless = false,
}: {
  src: string;
  alt: string;
  captionTitle?: string;
  caption: string;
  aspectClass?: string;
  /** "contain" shows the full image at its natural aspect ratio (e.g. maps). */
  fit?: "cover" | "contain";
  size?: "default" | CompactFigureSize | "centered";
  frameless?: boolean;
}) {
  const isCompact = isCompactFigureSize(size);
  const isCentered = size === "centered";

  return (
    <figure
      className={
        isCompact
          ? compactFigureClass(size)
          : isCentered
            ? "mx-auto w-full max-w-md md:max-w-xl"
            : undefined
      }
    >
        <div
          className={
            isCompact
              ? frameless
                ? "relative aspect-[3/2] w-full overflow-hidden rounded-sm"
                : "relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink/5"
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
                isCompact
                  ? compactImageSizes(size)
                  : "(max-width: 768px) 100vw, 720px"
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
          {captionTitle ? (
            <p
              className={
                isCompact
                  ? "font-cta text-[10px] font-medium uppercase leading-snug tracking-[0.18em] text-ink/50"
                  : "font-cta text-[11px] font-medium uppercase tracking-[0.22em] text-ink/50 sm:text-xs"
              }
            >
              {captionTitle}
            </p>
          ) : null}
          <p
            className={
              isCompact
                ? captionTitle
                  ? "mt-1.5 font-body text-sm leading-snug text-ink/60"
                  : "font-body text-sm leading-snug text-ink/60"
                : captionTitle
                  ? "mt-2 font-body text-sm leading-relaxed text-ink/60"
                  : "font-body text-sm leading-relaxed text-ink/60"
            }
          >
            {caption}
          </p>
        </figcaption>
      </figure>
  );
}

export function ArticleVideo({
  src,
  alt,
  caption,
  credit,
  width = "default",
}: {
  src: string;
  alt: string;
  caption: string;
  credit?: string;
  width?: "default" | "viewport-75";
}) {
  const isViewportWide = width === "viewport-75";

  return (
    <figure
      className={
        isViewportWide
          ? "relative left-1/2 w-[75vw] max-w-[75vw] -translate-x-1/2"
          : undefined
      }
    >
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
  );
}

export function EditorialPullQuote({
  eyebrow,
  title,
  body,
  image,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image?: { src: string; alt: string; objectPosition?: string };
}) {
  const locale = useLocale();
  const isMn = locale === "mn";
  const editorialClass = isMn ? "font-editorial-mn" : "font-editorial-en";

  if (!image) {
    return (
      <FadeInBlock distance={20}>
        <aside className="relative my-20 py-12 md:my-28 md:py-16 px-6 md:px-10" aria-label={title}>
          <Eyebrow className="!text-ink/45">{eyebrow}</Eyebrow>
          <p
            className={`mt-5 text-pretty text-2xl leading-[1.2] text-ink/90 sm:text-[1.75rem] md:text-3xl md:leading-[1.15] ${editorialClass} italic font-light`}
          >
            {title}
          </p>
          <p className="mt-7 max-w-2xl text-pretty font-body text-base leading-[1.75] text-ink/72 md:text-[1.0625rem] md:leading-[1.8]">
            {body}
          </p>
        </aside>
      </FadeInBlock>
    );
  }

  return (
    <FadeInBlock distance={20} className="my-20 -mx-6 w-[calc(100%+3rem)] max-w-none md:my-28 lg:-mx-0 lg:mx-0 lg:w-full">
      <FrostedMapSection
        aria-label={title}
        imageSrc={image.src}
        fadeTop
        fadeBottom
        frostOpacity={9}
        frostBlurPx={3.5}
        mapObjectPosition={image.objectPosition ?? "50% 45%"}
        className="min-h-[min(42vh,24rem)] py-12 md:py-16"
        contentClassName="mx-auto flex w-full max-w-3xl flex-col items-start gap-0 px-6 text-left"
      >
        <span className="sr-only">{image.alt}</span>
        <Eyebrow className="!text-water-deep/70">{eyebrow}</Eyebrow>
        <p
          className={`mt-5 text-pretty text-2xl leading-[1.2] text-ink/90 sm:text-[1.75rem] md:text-3xl md:leading-[1.15] ${editorialClass} italic font-light`}
        >
          {title}
        </p>
        <p className="mt-7 max-w-2xl text-pretty font-body text-base leading-[1.75] text-ink/80 md:text-[1.0625rem] md:leading-[1.8]">
          {body}
        </p>
      </FrostedMapSection>
    </FadeInBlock>
  );
}

export function EpilogueQuote({
  quote,
  attribution,
  compact = false,
}: {
  quote: string;
  attribution: string;
  /** Tighter top margin when placed mid-article after a section. */
  compact?: boolean;
}) {
  return (
    <FadeInBlock distance={20}>
      <div
        className={`${compact ? "mt-12" : "mt-20"} bg-main py-10 md:py-14`}
        style={aboutUsPaperBackground}
      >
        <div className="flex flex-col items-start gap-8 pl-[5%] pr-6 md:flex-row md:items-end md:justify-between md:gap-10 md:pr-[5%]">
          <blockquote className="min-w-0 max-w-2xl flex-1 text-left">
            <p className="font-editorial-mn text-lg leading-relaxed text-ink/85 md:text-xl">
              &ldquo;{quote}&rdquo;
            </p>
            <footer className="mt-4 font-cta text-[11px] font-normal uppercase not-italic tracking-[0.15em] text-ink/60">
              {attribution}
            </footer>
          </blockquote>
          <figure className="w-28 shrink-0 md:w-32">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-ink/5">
              <SiteImage
                src="/images/almanac/khovsgol-and-baikal/chekhov-penal-library.jpg"
                alt="Anton Chekhov at the Baikal penal colony library."
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          </figure>
        </div>
      </div>
    </FadeInBlock>
  );
}

export function JournalInsetVideo({
  id,
  eyebrow,
  title,
  body,
  src,
  alt,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  src: string;
  alt: string;
}) {
  const locale = useLocale();
  const isMn = locale === "mn";
  const editorialClass = isMn ? "font-editorial-mn" : "font-editorial-en";

  return (
    <FadeInBlock distance={20} className="mt-10 md:mt-12">
      <aside
        id={id}
        className={["mx-auto max-w-3xl", id ? "scroll-mt-24" : ""].filter(Boolean).join(" ")}
        aria-label={eyebrow}
      >
        <figure className="mx-auto w-full md:max-w-[360px]">
          <div className="mb-3 text-center">
            <p
              className={[
                "font-cta uppercase text-ink/45",
                isMn
                  ? "text-[10px] font-light tracking-[0.2em]"
                  : "text-[10px] font-medium tracking-[0.28em]",
              ].join(" ")}
            >
              [ {eyebrow} ]
            </p>
            <p
              className={`mt-2.5 text-pretty text-lg leading-snug text-ink/82 sm:text-xl ${editorialClass} italic font-light`}
            >
              {title}
            </p>
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-surface-alt/40">
            <video
              src={src}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-cover [filter:grayscale(15%)_contrast(105%)]"
              aria-label={alt}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <figcaption className="mt-4 text-center">
            <p className="mx-auto max-w-sm font-body text-sm leading-[1.65] text-ink/68">
              {body}
            </p>
          </figcaption>
        </figure>
      </aside>
    </FadeInBlock>
  );
}

export function ArchivalCard({
  id,
  eyebrow,
  body,
  image,
  link,
  review,
}: {
  id?: string;
  eyebrow: string;
  body: string;
  image: { src: string; alt: string };
  link?: { label: string; href: string };
  review?: { quote: string; attribution: string };
}) {
  const locale = useLocale();
  const isMn = locale === "mn";

  return (
    <FadeInBlock distance={20} className="mt-16 md:mt-20">
      <aside
        id={id}
        className={[
          "-mx-6 w-[calc(100%+3rem)] border-y border-ink/12 bg-muted/90 px-6 py-14 shadow-[0_1px_0_rgba(13,15,28,0.04)] md:py-20",
          id ? "scroll-mt-24" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={eyebrow}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-8 md:flex-row md:items-start md:gap-10">
          <figure className={COMPACT_FIGURE_CLASS}>
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink/5">
              <SiteImage
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 208px, 240px"
                className="object-cover"
              />
            </div>
          </figure>
          <div className="min-w-0 flex-1">
            <p
              className={[
                "font-cta uppercase text-ink/55 mb-2.5",
                isMn
                  ? "text-[10px] font-light tracking-[0.2em]"
                  : "text-[10px] font-medium tracking-[0.28em]",
              ].join(" ")}
            >
              {eyebrow}
            </p>
            <p className="font-body text-sm leading-[1.65] text-ink/68">
              {body}
            </p>
            {link ? (
              <p className="mt-6 text-center md:text-left">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-cta text-[11px] font-normal uppercase tracking-[0.2em] text-ink/45 no-underline transition-[color,text-decoration-color] duration-300 hover:text-ink/70 hover:underline"
                >
                  [ {link.label} ]
                </a>
              </p>
            ) : null}
            {review ? (
              <blockquote className="mt-6 text-center md:text-left">
                <p className="font-editorial-mn text-base italic leading-relaxed text-ink/75">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <footer className="mt-2 font-cta text-[10px] font-normal uppercase not-italic tracking-[0.15em] text-ink/50">
                  — {review.attribution}
                </footer>
              </blockquote>
            ) : null}
          </div>
        </div>
      </aside>
    </FadeInBlock>
  );
}

export function ArchivalFurtherReading({
  items,
}: {
  items: { title: string; href: string }[];
}) {
  const locale = useLocale();
  const isMn = locale === "mn";

  return (
    <FadeInBlock distance={20} className="mt-16 md:mt-20">
      <aside
        className="-mx-6 w-[calc(100%+3rem)] bg-main px-6 py-14 md:py-20"
        style={archivalLedgerBackground}
        aria-labelledby="archival-further-reading-heading"
      >
        <div className="mx-auto max-w-3xl">
          <h2
            id="archival-further-reading-heading"
            className="font-cta text-[10px] font-medium uppercase tracking-[0.34em] text-ink/45"
          >
            {isMn ? "Санал болгох нэмэлт унших материал" : "Suggested Further Reading"}
          </h2>
          <ul className="mt-8 list-none space-y-4 p-0 [list-style:none]">
            {items.map((item) => (
              <li key={item.href} className="list-none [list-style:none]">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-cta text-[11px] font-normal leading-relaxed tracking-[0.16em] text-[#3f464d] no-underline transition-colors duration-300 hover:text-[#8b939c]"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </FadeInBlock>
  );
}
