"use client";

import SiteImage from "@/app/components/SiteImage";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import {
  BodyText,
  CTALink,
  Eyebrow,
  Headline,
} from "@/app/components/ui/Typography";

export interface AlmanacChapterBlockProps {
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
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
  imageFit = "cover",
  imageCaption,
  href,
  ctaLabel,
}: AlmanacChapterBlockProps) {
  const imageFirst = index % 2 === 0;

  return (
    <FadeInBlock>
      <article className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
        <div
          className={
            imageFirst ? "order-1 md:sticky md:top-28" : "order-1 md:order-2 md:sticky md:top-28"
          }
        >
          <figure>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-alt/30">
              <SiteImage
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className={imageFit === "contain" ? "object-contain" : "object-cover"}
              />
            </div>
            {imageCaption ? (
              <figcaption className="mx-auto mt-3 max-w-sm text-center font-body text-sm leading-snug text-ink/60">
                {imageCaption}
              </figcaption>
            ) : null}
          </figure>
        </div>

        <div
          className={`flex max-w-md flex-col gap-6 md:gap-7 md:py-4 ${
            imageFirst ? "order-2" : "order-2 md:order-1 md:ml-auto"
          }`}
        >
          <Eyebrow className="!text-water-deep/70 mb-0">{eyebrow}</Eyebrow>
          <Headline as="h2" size="sub" align="left" className="!text-left">
            {title}
          </Headline>
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
