"use client";

/**
 * /restaurant — Food & Beverage.
 *
 * A close visual port of the Hoteller "Food & Beverage" demo
 * (https://hotellerv5.themegoods.com/resort/restaurant/), restyled with the
 * Dalai Eej voice (ink ground, peach panel, Playfair / Cormorant editorial).
 *
 * Section order — matches the demo top-to-bottom:
 *   1. HERO — full-bleed image, centred eyebrow + italic title.
 *   2. EDITORIAL COLLAGE — three off-grid images (top-left, bottom-left,
 *      right) wrapped around a large regular-serif paragraph with
 *      italic <em> emphasis on a few key phrases. Below the paragraph,
 *      a small caption line.
 *   3. INVITATION CARDS — a 1/3 + 2/3 split of two warm peach cards
 *      sitting on the ink ground: "Visit Us" (small body + italic label)
 *      and "Spend your holidays with us" (italic two-line heading +
 *      address + italic CTA underline).
 *   4. PEEK CAROUSEL — full-bleed 3-slide gallery; centre slide is
 *      prominent, neighbours peek in dimmed.
 *   5. SPA / WELLNESS — two full-height immersive cards with the title
 *      overlaid in white italic on the image (Wellness adds a body
 *      block + LEARN MORE inside the photograph itself).
 *
 * Reuses /cabins animation primitives (AnimatedText, HeroFadeOut,
 * ImageReveal, Reveal, ScrollParallax, StaggerGroup/Item) so the
 * animation register matches STAY / NOURISH.
 */

import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  AnimatedText,
  HeroFadeOut,
  ImageReveal,
  Reveal,
  ScrollParallax,
  StaggerGroup,
  StaggerItem,
} from "@/app/components/cabins/animations";
import SiteImage from "@/app/components/SiteImage";
import RestaurantCarousel from "@/app/components/restaurant/Carousel";
import { assetUrl } from "@/lib/assetUrl";

// Client-only WebGL distortion. Loaded only on this route.
const MirageImage = dynamic(
  () => import("@/app/components/cabins/MirageImage"),
  { ssr: false },
);

/* -------------------------------------------------------------------------- */
/*  Assets                                                                    */
/* -------------------------------------------------------------------------- */

const HERO_IMAGE = assetUrl("/images/restaurant/hero-food-beverage.webp");

const COLLAGE_TOP_LEFT = assetUrl("/images/restaurant/collage-tl.webp");
const COLLAGE_BOTTOM_LEFT = assetUrl("/images/restaurant/collage-bl.webp");
const COLLAGE_RIGHT = assetUrl("/images/restaurant/collage-r.webp");

const CAROUSEL_IMAGES = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
].map((i) => assetUrl(`/images/restaurant/carousel/${i}.webp`));

const SPA_IMAGE_BEFORE = assetUrl("/images/cabins/spa-mirage-before.webp");
const SPA_IMAGE_AFTER = assetUrl("/images/cabins/spa-mirage-after.webp");
const WELLNESS_IMAGE_BEFORE = assetUrl("/images/cabins/wellness-mirage-before.webp");
const WELLNESS_IMAGE_AFTER = assetUrl("/images/cabins/wellness-mirage-after.webp");

// Warm terracotta panel for the invitation cards.
const TERRACOTTA = "var(--accent-earth)";

/* -------------------------------------------------------------------------- */
/*  Bilingual copy                                                            */
/* -------------------------------------------------------------------------- */

type CopyKey =
  | "eyebrow"
  | "title"
  | "editorialBefore"
  | "editorialEm1"
  | "editorialMid"
  | "editorialEm2"
  | "editorialAfter"
  | "editorialCaption"
  | "visitBody"
  | "visitLabel"
  | "bookHeadingLine1"
  | "bookHeadingLine2"
  | "bookAddress"
  | "bookCta"
  | "spaTitle"
  | "wellnessTitle"
  | "wellnessBody"
  | "learnMore";

const COPY: Record<"en" | "mn", Record<CopyKey, string>> = {
  en: {
    eyebrow: "Fire, water, and wild herbs",
    title: "Dining",

    editorialBefore: "The lodge sits within a ",
    editorialEm1: "Protected Natural Area",
    editorialMid:
      " and blends quietly into the lake-shore. Dalai Eej has been built and slowly tended by ",
    editorialEm2: "Mongolian craftspeople",
    editorialAfter: " with the utmost respect for its unique landscape.",
    editorialCaption:
      "A tonic of wilderness on Lake Khövsgöl's eastern shore.",

    visitBody:
      "Open to passing travellers as well as house guests. Walk in for lunch on the deck, or reserve ahead for a lake-facing dinner of fire-roasted meat and wild herbs.",
    visitLabel: "Visit Us",

    bookHeadingLine1: "Spend your",
    bookHeadingLine2: "evenings with us",
    bookAddress:
      "Mergen's Ridge, Haichin Am — eastern shore of Lake Khövsgöl, 13 km from Khatgal.",
    bookCta: "Book your stay",

    spaTitle: "Sauna & Jacuzzi",
    wellnessTitle: "Yoga & Hiking",
    wellnessBody:
      "Lots of oxygen, wild trails, and morning movement. Reconnect with nature, water, and fire.",
    learnMore: "Learn More",
  },
  mn: {
    eyebrow: "Байгалийн амт, галын илч",
    title: "Зоогийн газар",

    editorialBefore: "Бууц нь ",
    editorialEm1: "Тусгай хамгаалалттай байгалийн бүс",
    editorialMid:
      "-д орших ба нуурын эрэгтэй чимээгүйхэн нийлдэг. Далай Ээжийг ",
    editorialEm2: "Монгол гар урчууд",
    editorialAfter: " өөрийн өвөрмөц байгалийг хүндэтгэн алхам алхмаар бүтээсэн.",
    editorialCaption:
      "Хөвсгөл нуурын зүүн эрэг дээрх онгон байгалийн амт.",

    visitBody:
      "Аян замын гийчид болон амралтын зочдод үргэлж нээлттэй. Нуурын мандал тольдох модон тавцан дээр үдийн зоог барьж, эсвэл ил гал дээр шарсан мах, зэрлэг ургамлаар амталсан оройн зоогийг урьдчилан захиалах боломжтой.",
    visitLabel: "Манайд морил",

    bookHeadingLine1: "Үдшийн цагаа",
    bookHeadingLine2: "бидэнтэй өнгөрөөгөөрэй",
    bookAddress:
      "Мэргэний шил, Хайчийн ам — Хөвсгөл нуурын зүүн эрэг, Хатгал сумаас 13 км.",
    bookCta: "Захиалга өгөх",

    spaTitle: "Саун & Халуун усан сан",
    wellnessTitle: "Иог & Алхалт",
    wellnessBody:
      "Цэнгэг агаар, онгон байгалийн жим, өглөөний дасгал хөдөлгөөн. Байгаль дэлхий, ус, галтайгаа эргэн холбогдох шидэт хором.",
    learnMore: "Дэлгэрэнгүй",
  },
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function RestaurantPage() {
  const locale = useLocale();
  const isMn = locale === "mn";
  const t = COPY[isMn ? "mn" : "en"];
  const localePrefix = isMn ? "/mn" : "";
  const headlineFont = isMn ? "font-editorial-mn" : "font-editorial-en";
  const serifFont = isMn ? "font-serif-mn" : "font-serif-en";

  const slides = CAROUSEL_IMAGES.map((src, i) => ({
    src,
    alt: `${t.title} — ${i + 1}`,
  }));

  return (
    <main id="main-content" className="min-h-screen bg-ink text-main">
      {/* ============================================================== HERO */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
        <ImageReveal
          className="absolute inset-0 h-full w-full"
          duration={1.6}
          from={1.12}
        >
          <SiteImage
            src={HERO_IMAGE}
            alt={t.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </ImageReveal>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/55" />
        <HeroFadeOut
          className="relative z-10 flex h-full items-center justify-center"
          rise={140}
        >
          <div className="mx-auto w-full max-w-5xl px-6 text-center">
            <AnimatedText
              as="p"
              text={t.eyebrow.toUpperCase()}
              className="block font-cta uppercase tracking-[0.34em] text-[11px] sm:text-xs text-main mb-6"
              stagger={0.03}
              duration={0.7}
            />
            <AnimatedText
              as="h1"
              text={t.title}
              className={`block ${headlineFont} italic font-normal text-main text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02]`}
              delay={0.15}
              stagger={0.08}
              duration={0.9}
            />
          </div>
        </HeroFadeOut>
      </section>

      {/* ================================================ EDITORIAL COLLAGE */}
      <section className="relative">
        <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-36">
          <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 gap-y-10 md:gap-y-14 items-start">
            {/* Top-left image */}
            <ScrollParallax className="col-span-7 md:col-span-3" y={-50}>
              <ImageReveal
                className="block aspect-[4/3] overflow-hidden bg-white/5"
                duration={1.2}
                from={1.08}
                direction="left"
              >
                <SiteImage
                  src={COLLAGE_TOP_LEFT}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 768px) 58vw, 24vw"
                  className="object-cover"
                />
              </ImageReveal>
            </ScrollParallax>

            {/* Big serif paragraph (centre) */}
            <div className="col-span-12 md:col-span-6 md:col-start-4 md:row-start-1 md:pt-6 md:pb-2">
              <Reveal
                as="p"
                className={`${serifFont} text-main text-2xl md:text-3xl lg:text-[2.15rem] leading-[1.3] tracking-[-0.005em]`}
              >
                {t.editorialBefore}
                <em>{t.editorialEm1}</em>
                {t.editorialMid}
                <em>{t.editorialEm2}</em>
                {t.editorialAfter}
              </Reveal>
            </div>

            {/* Right image */}
            <ScrollParallax
              className="col-span-12 md:col-span-3 md:col-start-10 md:row-start-1"
              y={-90}
            >
              <ImageReveal
                className="block aspect-[3/4] overflow-hidden bg-white/5"
                duration={1.3}
                from={1.08}
                direction="right"
              >
                <SiteImage
                  src={COLLAGE_RIGHT}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 768px) 100vw, 24vw"
                  className="object-cover"
                />
              </ImageReveal>
            </ScrollParallax>

            {/* Bottom-left image (offset under top-left) */}
            <ScrollParallax
              className="col-span-7 md:col-span-3 md:col-start-2 md:-mt-10"
              y={40}
            >
              <ImageReveal
                className="block aspect-[4/3] overflow-hidden bg-white/5"
                duration={1.3}
                from={1.08}
                direction="left"
              >
                <SiteImage
                  src={COLLAGE_BOTTOM_LEFT}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 768px) 58vw, 24vw"
                  className="object-cover"
                />
              </ImageReveal>
            </ScrollParallax>

            {/* Caption — sits under the centre paragraph */}
            <Reveal
              as="p"
              className="col-span-12 md:col-span-5 md:col-start-7 font-body text-main/55 text-sm md:text-[0.95rem] leading-relaxed -mt-2 md:mt-0"
              delay={0.2}
            >
              {t.editorialCaption}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================================================ INVITATION CARDS */}
      <section>
        <div className="mx-auto max-w-[1240px] px-6 pb-20 md:pb-28">
          <StaggerGroup
            className="grid grid-cols-12 gap-4 md:gap-6"
            stagger={0.12}
            offsetY={28}
          >
            {/* Visit Us (left, narrow) */}
            <StaggerItem className="col-span-12 md:col-span-4">
              <article
                className="flex h-full flex-col justify-between p-8 md:p-10 min-h-[260px]"
                style={{ backgroundColor: TERRACOTTA }}
              >
                <Reveal
                  as="p"
                  className="font-body text-ink/80 text-[15px] leading-relaxed"
                >
                  {t.visitBody}
                </Reveal>
                <p
                  className={`${headlineFont} italic text-ink text-3xl md:text-4xl mt-10`}
                >
                  {t.visitLabel}
                </p>
              </article>
            </StaggerItem>

            {/* Book / Spend your evenings (right, wide) */}
            <StaggerItem className="col-span-12 md:col-span-8">
              <article
                className="flex h-full flex-col justify-between p-8 md:p-12 min-h-[260px]"
                style={{ backgroundColor: TERRACOTTA }}
              >
                <div>
                  <h2
                    className={`${headlineFont} italic text-ink text-3xl md:text-5xl leading-[1.1]`}
                  >
                    <span className="not-italic font-normal block">
                      {t.bookHeadingLine1}
                    </span>
                    <span className="block">{t.bookHeadingLine2}</span>
                  </h2>
                  <Reveal
                    as="p"
                    className="font-body text-ink/75 text-[15px] mt-6 max-w-md"
                    delay={0.15}
                  >
                    {t.bookAddress}
                  </Reveal>
                </div>

                <Reveal as="div" className="mt-10" delay={0.25}>
                  <Link
                    href={`${localePrefix}/booking`}
                    className={`group/cta inline-flex items-center gap-4 ${headlineFont} italic text-ink text-xl md:text-2xl`}
                  >
                    {t.bookCta}
                    <span
                      aria-hidden
                      className="block h-px w-12 bg-ink/70 transition-all duration-500 ease-out group-hover/cta:w-20 group-hover/cta:bg-ink"
                    />
                  </Link>
                </Reveal>
              </article>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* ===================================================== PEEK CAROUSEL */}
      <section>
        <ImageReveal className="w-full" duration={1.2} from={1.04}>
          <RestaurantCarousel slides={slides} />
        </ImageReveal>
      </section>

      {/* =============================================== SPA / WELLNESS PAIR */}
      <section>
        <StaggerGroup
          className="grid grid-cols-1 md:grid-cols-2"
          stagger={0.14}
          offsetY={0}
        >
          <StaggerItem>
            <SpaCard
              imageBefore={SPA_IMAGE_BEFORE}
              imageAfter={SPA_IMAGE_AFTER}
              title={t.spaTitle}
              href={`${localePrefix}/wellness`}
              headlineFont={headlineFont}
            />
          </StaggerItem>
          <StaggerItem>
            <SpaCard
              imageBefore={WELLNESS_IMAGE_BEFORE}
              imageAfter={WELLNESS_IMAGE_AFTER}
              title={t.wellnessTitle}
              body={t.wellnessBody}
              learnMore={t.learnMore}
              href={`${localePrefix}/wellness`}
              headlineFont={headlineFont}
            />
          </StaggerItem>
        </StaggerGroup>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  SpaCard — full-height immersive card with a white italic overlay title.   */
/*  Optional body + LEARN MORE block centred lower (Wellness variant).        */
/* -------------------------------------------------------------------------- */

function SpaCard({
  imageBefore,
  imageAfter,
  title,
  body,
  learnMore,
  href,
  headlineFont,
}: {
  imageBefore: string;
  imageAfter: string;
  title: string;
  body?: string;
  learnMore?: string;
  href: string;
  headlineFont: string;
}) {
  // The MirageImage must be the topmost pointer target so its
  // `onPointerEnter` fires and the WebGL liquid distortion crossfade kicks
  // in. `pointerenter` does not bubble across siblings — any sibling with
  // `pointer-events: auto` rendered above the Mirage will steal the event,
  // which is exactly the bug we hit with the previous `<Link>` + gradient
  // wrappers. Solution:
  //   1. Mirage sits as a sibling at the base. ALL overlays above are
  //      `pointer-events-none`, including the title and body blocks.
  //   2. Clicking the card navigates via an article-level handler — keyboard
  //      users get the same affordance through tabIndex + Enter/Space.
  //   3. The optional inner LEARN MORE link is the only re-enabled
  //      pointer-events island; it stops propagation so the article-level
  //      click doesn't double-fire (both go to the same URL anyway, but it's
  //      cleaner).
  const navigate = () => {
    if (typeof window !== "undefined") window.location.href = href;
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={title}
      onClick={navigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate();
        }
      }}
      className="group relative aspect-[3/4] h-auto min-h-0 w-full overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-main/40 md:aspect-auto md:h-[78vh] md:min-h-[520px]"
    >
      {/* Base layer: WebGL Mirage. Receives pointer enter/leave directly. */}
      <ImageReveal
        className="absolute inset-0 h-full w-full z-0"
        duration={1.4}
        from={1.08}
      >
        <MirageImage
          before={imageBefore}
          after={imageAfter}
          alt={title}
          className="h-full w-full"
        />
      </ImageReveal>

      {/* Soft vignette so the white title always reads — non-interactive. */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-ink/40 via-ink/0 to-ink/0" />
      {body ? (
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0" />
      ) : null}

      {/* Title (top-left, white italic, large) */}
      <div className="pointer-events-none absolute top-10 md:top-16 left-8 md:left-14 z-[3]">
        <AnimatedText
          as="h3"
          text={title}
          className={`block ${headlineFont} italic text-main text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-overlay-glow`}
          stagger={0.07}
          duration={0.9}
        />
      </div>

      {/* Optional body + LEARN MORE (centre-right, lower third) */}
      {body ? (
        <div className="pointer-events-none absolute right-8 md:right-14 bottom-16 md:bottom-24 z-[3] max-w-md text-right">
          <Reveal
            as="p"
            className="font-body text-main/90 text-sm md:text-base leading-relaxed mb-5"
          >
            {body}
          </Reveal>
          {learnMore ? (
            <Reveal as="div" className="inline-block pointer-events-auto" delay={0.15}>
              <Link
                href={href}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 font-cta uppercase tracking-[0.32em] text-[11px] text-main"
              >
                <span className="border-b border-main/60 group-hover:border-main pb-0.5">
                  {learnMore}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Reveal>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
