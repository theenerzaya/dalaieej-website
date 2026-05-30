"use client";

import Link from "next/link";
import SiteImage from "@/app/components/SiteImage";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import {
  BodyText,
  CTALink,
  Eyebrow,
  Headline,
} from "@/app/components/ui/Typography";

const chapterLinkFocus =
  "rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water-deep";

export interface AlmanacChapterBlockProps {
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  imageScale?: number;
  imageCaption?: string;
  href?: string;
  ctaLabel?: string;
}

export default function AlmanacChapterBlock({
  index,
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  imageFit = "contain",
  imageScale = 0.85,
  imageCaption,
  href,
  ctaLabel,
}: AlmanacChapterBlockProps) {
  const imageFirst = index % 2 === 0;
  const articleLabel = ctaLabel ?? `Read ${eyebrow}`;
  const scaledImage = imageScale > 0 && imageScale < 1;
  const figureClassName = [
    scaledImage ? undefined : "w-full",
    scaledImage && !imageFirst ? "md:ml-auto" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const imageBlock = (
    <figure
      className={figureClassName || undefined}
      style={scaledImage ? { width: `${imageScale * 100}%` } : undefined}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-alt/30">
        <SiteImage
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 42vw"
          className={[
            imageFit === "contain" ? "object-contain" : "object-cover",
            href ? "transition-transform duration-500 group-hover:scale-[1.02]" : "",
          ].join(" ")}
        />
      </div>
      {imageCaption ? (
        <figcaption className="mx-auto mt-3 max-w-sm text-center font-body text-sm leading-snug text-ink/60">
          {imageCaption}
        </figcaption>
      ) : null}
    </figure>
  );

  return (
    <FadeInBlock>
      <article className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
        <div
          className={
            imageFirst ? "order-1 md:sticky md:top-28" : "order-1 md:order-2 md:sticky md:top-28"
          }
        >
          {href ? (
            <Link
              href={href}
              className={`group block ${chapterLinkFocus}`}
              aria-label={articleLabel}
            >
              {imageBlock}
            </Link>
          ) : (
            imageBlock
          )}
        </div>

        <div
          className={`flex max-w-md flex-col gap-6 md:gap-7 md:py-4 ${
            imageFirst ? "order-2" : "order-2 md:order-1 md:ml-auto"
          }`}
        >
          {href ? (
            <Link
              href={href}
              className={`group block w-fit ${chapterLinkFocus}`}
              aria-label={articleLabel}
            >
              <Eyebrow
                as="span"
                className="!text-water-deep/70 mb-0 transition-colors group-hover:!text-water-deep"
              >
                {eyebrow}
              </Eyebrow>
            </Link>
          ) : (
            <Eyebrow className="!text-water-deep/70 mb-0">{eyebrow}</Eyebrow>
          )}
          {href ? (
            <Link
              href={href}
              className={`group block w-fit ${chapterLinkFocus}`}
              aria-label={articleLabel}
            >
              <Headline
                as="h2"
                size="sub"
                align="left"
                className="!text-left transition-colors group-hover:!text-water-deep"
              >
                {title}
              </Headline>
            </Link>
          ) : (
            <Headline as="h2" size="sub" align="left" className="!text-left">
              {title}
            </Headline>
          )}
          <BodyText size="md" className="!text-left text-ink/75">
            {description}
          </BodyText>
          {href && ctaLabel ? (
            <CTALink
              href={href}
              className="mt-1 !text-water-deep [&>span]:!border-water-deep/40 [&>span]:group-hover:!border-water-deep"
            >
              {ctaLabel}
            </CTALink>
          ) : (
            <p className="mt-1 font-cta text-[11px] font-medium uppercase tracking-[0.3em] text-ink/40 sm:text-xs">
              Coming soon
            </p>
          )}
        </div>
      </article>
    </FadeInBlock>
  );
}
