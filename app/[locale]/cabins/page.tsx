/* eslint-disable @next/next/no-img-element */
"use client";

/**
 * /cabins — Our Rooms index.
 *
 * Adapted from the Hoteller "Our Rooms" template
 * (https://hotellerv5.themegoods.com/resort/our-rooms/) and restyled with the
 * Dalai Eej palette (ink / main / bark / leaf) and editorial typography
 * (Playfair Display italic EN, Cormorant italic MN, Montserrat for CTAs,
 * Araboto for body) to match the booking page, /superior-cabin and the
 * navigation overlay.
 *
 * Each room card links to either a live detail page (/superior-cabin, /lodge)
 * or to /cabins as a placeholder for future detail pages. The mini
 * booking bar links to /booking?... so the main booking flow remains the
 * single source of truth for availability, rates and checkout.
 */

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BedDouble, Minus, Plus, Ruler, Users } from "lucide-react";
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
import { assetUrl } from "@/lib/assetUrl";
import { getCabinCatalogEntry } from "@/lib/cabinCatalog";
import DateInput from "@/app/components/ui/DateInput";

// Client-only: bundles ~150 LOC of WebGL, dynamically loaded so /cabins SSR
// stays clean and no WebGL code ships to other routes.
const MirageImage = dynamic(
  () => import("@/app/components/cabins/MirageImage"),
  { ssr: false },
);

/** Jul 1–5 default stay window, aligned with /booking + /superior-cabin. */
function getDefaultJulyStayDates(): { checkin: string; checkout: string } {
  const now = new Date();
  let year = now.getFullYear();
  const afterWindow = now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 5);
  if (afterWindow) year += 1;
  return { checkin: `${year}-07-01`, checkout: `${year}-07-05` };
}

type Bilingual = { en: string; mn: string };

type Room = {
  slug: string;
  href: string;
  name: Bilingual;
  area: Bilingual;
  guests: Bilingual;
  quantity: Bilingual;
  intro: Bilingual;
  image: string;
};

function getRequiredCabinCatalogEntry(slug: string) {
  const entry = getCabinCatalogEntry(slug);
  if (!entry) throw new Error(`Missing cabin catalog entry for slug: ${slug}`);
  return entry;
}

const ROOMS: Room[] = [
  {
    slug: "superior-cabin",
    href: "/superior-cabin",
    name: getRequiredCabinCatalogEntry("superior-cabin").name,
    area: { en: "50 m²", mn: "50 m²" },
    guests: { en: "3 adults · 4 child", mn: "3 том хүн · 4 хүүхэд" },
    quantity: { en: "1 cabin", mn: "1 байшин" },
    intro: {
      en: "Wood-fired warmth, handwoven textiles and a private forest view — our entry-level cabin, sized for couples and small families.",
      mn: "Галын зуухны дулаан, гар нэхмэл эдлэл, ойн хувийн харагдацтай — хос болон жижиг гэр бүлд зориулсан анхны шатны модон байшин.",
    },
    image: assetUrl("/images/cabins/room-superior.webp"),
  },
  {
    slug: "triple-traditional-cabin",
    href: "/triple-traditional-cabin",
    name: getRequiredCabinCatalogEntry("triple-traditional-cabin").name,
    area: { en: "30 m²", mn: "30 m²" },
    guests: { en: "3 adults · 2 child", mn: "3 том хүн · 2 хүүхэд" },
    quantity: { en: "5 cabins", mn: "5 байшин" },
    intro: {
      en: "A classic timber cabin layout with three full sleeping spaces, a warm hearth corner, and a sheltered deck for cool evenings by the trees.",
      mn: "Гурван бүрэн унтлагын орчинтой уламжлалт модон төлөвлөлт, дулаан зуухны булан, ойн сэрүүхэн оройд тохирох хамгаалалттай террастай.",
    },
    image: assetUrl("/images/cabins/room-triple-traditional.webp"),
  },
  {
    slug: "lakeside-cabin",
    href: "/lakeside-cabin",
    name: getRequiredCabinCatalogEntry("lakeside-cabin").name,
    area: { en: "40 m²", mn: "40 m²" },
    guests: { en: "2 adults · 1 child", mn: "2 том хүн · 1 хүүхэд" },
    quantity: { en: "2 cabins", mn: "2 байшин" },
    intro: {
      en: "A wider footprint at the shoreline — two sleeping spaces, a reading nook and a deck that steps straight toward Lake Khövsgöl.",
      mn: "Нуурын эрэгт илүү өргөн талбайтай — хоёр унтлагын орчин, уншлагын булан, Хөвсгөл нуур руу шууд гарах тавцантай.",
    },
    image: assetUrl("/images/cabins/room-lakeside.webp"),
  },
  {
    slug: "triple-electric-cabin",
    href: "/triple-electric-cabin",
    name: getRequiredCabinCatalogEntry("triple-electric-cabin").name,
    area: { en: "30 m²", mn: "30 m²" },
    guests: { en: "3 adults · 2 children", mn: "3 том хүн · 2 хүүхэд" },
    quantity: { en: "1 cabin", mn: "1 байшин" },
    intro: {
      en: "Designed for longer family stays, with three sleeping zones, electric heating for stable comfort, and a brighter open-plan living area.",
      mn: "Гэр бүлийн урт амралтад зориулсан гурван унтлагын бүс, тогтвортой дулааны цахилгаан халаалт, илүү саруул нээлттэй зочны хэсэгтэй.",
    },
    image: assetUrl("/images/cabins/room-triple-electric.webp"),
  },
  {
    slug: "signature-cabin",
    href: "/signature-cabin",
    name: getRequiredCabinCatalogEntry("signature-cabin").name,
    area: { en: "30 m²", mn: "30 m²" },
    guests: { en: "2 adults", mn: "2 том хүн" },
    quantity: { en: "5 cabins", mn: "5 байшин" },
    intro: {
      en: "Our most requested room — a separate living area, deep-soak tub, and a private terrace that opens onto the larch line.",
      mn: "Хамгийн их эрэлттэй өрөө — тусдаа зочны хэсэг, гүн угаалгын ванн, шинэсэн ой руу нээгдэх хувийн террастай.",
    },
    image: assetUrl("/images/cabins/room-signature.webp"),
  },
  {
    slug: "quad-electric-cabin",
    href: "/quad-electric-cabin",
    name: getRequiredCabinCatalogEntry("quad-electric-cabin").name,
    area: { en: "25 m²", mn: "25 m²" },
    guests: { en: "4 adults · 3 children", mn: "4 том хүн · 3 хүүхэд" },
    quantity: { en: "1 cabin", mn: "1 байшин" },
    intro: {
      en: "Our flexible mid-tier option for groups — four sleeping positions, full electric comfort systems, and a larger lounge facing the shoreline.",
      mn: "Баг болон найзын аялалд тохирох дунд ангиллын сонголт — дөрвөн унтлагын байрлал, бүрэн цахилгаан тав тух, эрэг рүү харсан том зочны хэсэгтэй.",
    },
    image: assetUrl("/images/cabins/room-quad-electric.webp"),
  },
  {
    slug: "grand-peninsula-suite",
    href: "/grand-peninsula-suite",
    name: getRequiredCabinCatalogEntry("grand-peninsula-suite").name,
    area: { en: "35 m²", mn: "35 m²" },
    guests: { en: "4 adults · 3 children", mn: "4 том хүн · 3 хүүхэд" },
    quantity: { en: "1 suite", mn: "1 тусгай хаус" },
    intro: {
      en: "A standalone suite on its own peninsula — two bedrooms, a wood-panelled living room, and uninterrupted lake views on three sides.",
      mn: "Өөрийн хойг дээрх тусдаа хаус — хоёр унтлагын өрөө, модон хавтастай зочны танхим, гурван тал нуурын тасралтгүй харагдацтай.",
    },
    image: assetUrl("/images/cabins/room-grand-peninsula.webp"),
  },
  {
    slug: "camping",
    href: "/booking",
    name: getRequiredCabinCatalogEntry("camping").name,
    area: { en: "Outdoor setup", mn: "Гадаа байрлал" },
    guests: { en: "2 adults · 2 children", mn: "2 том хүн · 2 хүүхэд" },
    quantity: { en: "Limited spots", mn: "Хязгаартай талбай" },
    intro: {
      en: "A nature-first stay under the open sky with essential camp comforts and direct access to the lakeside grounds.",
      mn: "Нээлттэй тэнгэрийн дор, нуурын эрэг рүү шууд гарах боломжтой, үндсэн тухтай шийдэл бүхий байгаль төвтэй амралт.",
    },
    image: assetUrl("/images/rooms/camping.webp"),
  },
];

const HERO_IMAGE = assetUrl("/images/cabins/hero-our-rooms.webp");

// Paired images for the Hoteller-style "mirage" crossfade.
// `before` is the resting state; `after` is revealed with a WebGL liquid
// distortion on hover. Each pair is two visually related but distinct shots
// so the morph reads as a mood shift rather than a flicker.
const SPA_IMAGE_BEFORE = assetUrl("/images/cabins/spa-mirage-before.webp");
const SPA_IMAGE_AFTER = assetUrl("/images/cabins/spa-mirage-after.webp");
const WELLNESS_IMAGE_BEFORE = assetUrl("/images/cabins/wellness-mirage-before.webp");
const WELLNESS_IMAGE_AFTER = assetUrl("/images/cabins/wellness-mirage-after.webp");
const TAGLINE_BG_MAIN = assetUrl("/images/cabins/room-grand-peninsula.webp");

type CopyKey =
  | "eyebrow"
  | "title"
  | "bookingHeading"
  | "bookingSubtitle"
  | "checkIn"
  | "checkOut"
  | "adults"
  | "children"
  | "bookingCta"
  | "required"
  | "sectionEyebrow"
  | "sectionHeading"
  | "sectionIntro"
  | "quantityLabel"
  | "guestsLabel"
  | "areaLabel"
  | "moreInfo"
  | "tagline1"
  | "tagline2"
  | "aboutCta"
  | "experiencesEyebrow"
  | "experiencesHeading"
  | "spaTitle"
  | "spaDesc"
  | "wellnessTitle"
  | "wellnessDesc"
  | "learnMore";

const COPY: Record<"en" | "mn", Record<CopyKey, string>> = {
  en: {
    eyebrow: "Stay with us · feel like home",
    title: "Our Rooms",
    bookingHeading: "Check availability",
    bookingSubtitle: "Required fields are followed by *",
    checkIn: "Check-in Date",
    checkOut: "Check-out Date",
    adults: "Adults",
    children: "Children",
    bookingCta: "Check Availability",
    required: "*",
    sectionEyebrow: "Accommodations",
    sectionHeading: "Slow days. Deep waters.",
    sectionIntro:
      "Traditional wooden cabins on Lake Khövsgöl's eastern shore.",
    quantityLabel: "Quantity",
    guestsLabel: "Guests",
    areaLabel: "Average area",
    moreInfo: "Get More Information",
    tagline1: "The best people to take care of",
    tagline2: "our most valuable asset: you.",
    aboutCta: "More About Us",
    experiencesEyebrow: "Paired with your stay",
    experiencesHeading: "Relax & restore",
    spaTitle: "Relax Spa",
    spaDesc:
      "A quiet treatment room of warm stone and birch steam — drawn from local herbs and the shoreline breeze.",
    wellnessTitle: "Wellness",
    wellnessDesc:
      "Morning movement on the deck, sauna at dusk, and a slow ritual of tea on the return from the lake.",
    learnMore: "Learn More",
  },
  mn: {
    eyebrow: "Гэрэл шиг уух · гэр шиг амар",
    title: "Манай өрөөнүүд",
    bookingHeading: "Боломжит өрөө шалгах",
    bookingSubtitle: "Заавал бөглөх талбарыг * тэмдэглэв",
    checkIn: "Ирэх огноо",
    checkOut: "Гарах огноо",
    adults: "Том хүн",
    children: "Хүүхэд",
    bookingCta: "Боломжит өрөө шалгах",
    required: "*",
    sectionEyebrow: "Байрлах сонголтууд",
    sectionHeading: "Удаан өдрүүд. Гүн ус.",
    sectionIntro:
      "Хөвсгөл нуурын зүүн эрэг дээрх уламжлалт модон байшин.",
    quantityLabel: "Тоо ширхэг",
    guestsLabel: "Зочид",
    areaLabel: "Дундаж талбай",
    moreInfo: "Дэлгэрэнгүй",
    tagline1: "Таны хамгийн үнэт зүйлд —",
    tagline2: "өөрт тань, бид анхаарна.",
    aboutCta: "Бидний тухай",
    experiencesEyebrow: "Амралттай хослуулах",
    experiencesHeading: "Амар тайван сэргэлт",
    spaTitle: "Relax Spa",
    spaDesc:
      "Дулаан чулуу, хусны уураар хийгдсэн чимээгүй эмчилгээний өрөө — нутгийн ургамал, нуурын салхийг хослуулав.",
    wellnessTitle: "Сайн сайхан",
    wellnessDesc:
      "Өглөөний дасгал тавцан дээр, үдшийн саун, нууранд очоод буцах замын цайны зан үйл.",
    learnMore: "Дэлгэрэнгүй",
  },
};

export default function CabinsPage() {
  const locale = useLocale();
  const isMn = locale === "mn";
  const t = COPY[isMn ? "mn" : "en"];
  const reduce = useReducedMotion();
  const localePrefix = isMn ? "/mn" : "/en";
  const headlineFont = isMn ? "font-editorial-mn" : "font-editorial-en";
  const heroEyebrow = isMn ? t.eyebrow.toUpperCase() : "STAY WITH US FEEL LIKE HOME";

  const defaults = useMemo(() => getDefaultJulyStayDates(), []);
  const [checkin, setCheckin] = useState(defaults.checkin);
  const [checkout, setCheckout] = useState(defaults.checkout);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams({
      checkin,
      checkout,
      adults: String(adults),
      children: String(children),
    });
    return `${localePrefix}/booking?${params.toString()}`;
  }, [checkin, checkout, adults, children, localePrefix]);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "12%"]);

  return (
    <main id="main-content" className="min-h-screen bg-ink text-main">
      {/* ------------------------------------------------------------ HERO */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 h-full w-full"
          style={reduce ? undefined : { y: heroImageY }}
        >
          <motion.div
            className="relative h-full w-full"
            initial={reduce ? { scale: 1 } : { scale: 1.14 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <SiteImage
              src={HERO_IMAGE}
              alt={t.title}
              fill
              priority
              sizes="100vw"
              className="object-cover will-change-transform"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/75" />

        <HeroFadeOut
          className="relative z-10 flex h-full items-start justify-center pt-24 pb-[20rem] md:items-center md:pt-0 md:pb-0"
          rise={160}
        >
          <div className="mx-auto w-full max-w-6xl px-6 text-center md:-mt-32">
            {/* First-load entrance: subtle slide-up from below.
                The drop-down-from-above on scroll-return-to-top is produced
                by HeroFadeOut's scroll-linked transform reversing. */}
            <motion.p
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="block font-cta uppercase tracking-[0.32em] text-[11px] sm:text-xs text-main/85 mb-5"
            >
              {heroEyebrow}
            </motion.p>
            <motion.h1
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={`block ${headlineFont} italic font-normal text-main text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02]`}
            >
              {t.title}
            </motion.h1>
          </div>
        </HeroFadeOut>

        {/* Hero booking bar — overlaid at the bottom of the image. */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 bottom-0 z-20"
        >
          <div className="mx-auto w-full max-w-6xl px-6 pb-8 md:pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-5 items-end">
              <div className="lg:col-span-1">
                <label
                  htmlFor="cbns-checkin"
                  className="block font-body text-main text-sm mb-1"
                >
                  {t.checkIn} <span className="text-main/60">{t.required}</span>
                </label>
                <DateInput
                  id="cbns-checkin"
                  value={checkin}
                  onChange={setCheckin}
                  className="w-full bg-transparent border-0 border-b border-main/40 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none !rounded-none !px-0"
                />
              </div>

              <div className="lg:col-span-1">
                <label
                  htmlFor="cbns-checkout"
                  className="block font-body text-main text-sm mb-1"
                >
                  {t.checkOut} <span className="text-main/60">{t.required}</span>
                </label>
                <DateInput
                  id="cbns-checkout"
                  value={checkout}
                  onChange={setCheckout}
                  min={checkin}
                  className="w-full bg-transparent border-0 border-b border-main/40 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none !rounded-none !px-0"
                />
              </div>

              <div className="lg:col-span-1">
                <span
                  id="cbns-adults"
                  className="block font-body text-main text-sm mb-1"
                >
                  {t.adults}
                </span>
                <Stepper
                  value={adults}
                  min={1}
                  max={20}
                  onChange={setAdults}
                  ariaLabelledBy="cbns-adults"
                />
              </div>

              <div className="lg:col-span-1">
                <span
                  id="cbns-children"
                  className="block font-body text-main text-sm mb-1"
                >
                  {t.children}
                </span>
                <Stepper
                  value={children}
                  min={0}
                  max={10}
                  onChange={setChildren}
                  ariaLabelledBy="cbns-children"
                />
              </div>

              <div className="lg:col-span-1">
                <Link
                  href={bookingHref}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-main text-ink font-cta uppercase tracking-[0.32em] text-[11px] hover:bg-main/90 transition-colors"
                >
                  {t.bookingCta}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --------------------------------------------------- SECTION INTRO */}
      {/* Collage layout modelled on Hoteller's "Our Rooms" intro — three
          opaque photo frames spaced apart around the centered heading.
          Each image is rendered over the ink-navy background with
          `mix-blend-luminosity` so it reads as a navy-toned monochrome
          tile, blending into the page backgroundColor rather than
          introducing unrelated saturated color. */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          {/* Upper-left — landscape frame */}
          <ImageReveal
            className="absolute top-[10%] left-[4%] w-[30%] aspect-[16/10] overflow-hidden bg-ink hidden md:block"
            duration={1.4}
            from={1.08}
            direction="left"
          >
            <SiteImage
              src={TAGLINE_BG_MAIN}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="object-cover mix-blend-luminosity opacity-90"
            />
            <div className="absolute inset-0 bg-ink/25" />
          </ImageReveal>

          {/* Upper-right — portrait frame */}
          <ImageReveal
            className="absolute top-[8%] right-[5%] w-[22%] aspect-[4/5] overflow-hidden bg-ink hidden md:block"
            duration={1.4}
            from={1.08}
            direction="right"
          >
            <SiteImage
              src={WELLNESS_IMAGE_BEFORE}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 22vw"
              className="object-cover mix-blend-luminosity opacity-90"
            />
            <div className="absolute inset-0 bg-ink/25" />
          </ImageReveal>

          {/* Lower-center — small square accent */}
          <ImageReveal
            className="absolute bottom-[10%] left-[32%] w-[14%] aspect-square overflow-hidden bg-ink hidden md:block"
            duration={1.3}
            from={1.1}
          >
            <SiteImage
              src={SPA_IMAGE_BEFORE}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 14vw"
              className="object-cover mix-blend-luminosity opacity-90"
            />
            <div className="absolute inset-0 bg-ink/25" />
          </ImageReveal>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 md:pt-40 pb-24 md:pb-36">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedText
              as="p"
              text={t.sectionEyebrow}
              className="block font-cta uppercase tracking-[0.32em] text-[10px] text-bark mb-5"
              stagger={0.04}
              duration={0.7}
            />
            <AnimatedText
              as="h2"
              text={t.sectionHeading}
              className={`block ${headlineFont} italic text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-main text-overlay-glow`}
              delay={0.1}
              stagger={0.06}
            />
          </div>

          <div className="mt-14 md:mt-24 md:ml-auto md:mr-[4%] md:max-w-xs md:text-left text-center">
            <Reveal
              as="p"
              className="font-body text-main/70 text-sm leading-relaxed"
              delay={0.25}
            >
              {t.sectionIntro}
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- ROOMS */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 space-y-20 md:space-y-28">
          {ROOMS.map((room, idx) => (
            <RoomRow
              key={room.slug}
              room={room}
              isMn={isMn}
              reverse={idx % 2 === 1}
              localePrefix={localePrefix}
              headlineFont={headlineFont}
              t={t}
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- TAGLINE QUOTE */}
      {/* Collage layout inspired by Hoteller's "valuable asset: you." —
          four discrete photo frames positioned around the centered quote.
          Frames stay visible (not a blurred backdrop) so they read as a
          gallery rather than decoration. */}
      <section className="relative isolate overflow-hidden border-y border-main/10 bg-black min-h-[80vh] md:min-h-[92vh] flex items-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <ImageReveal
            className="absolute top-[8%] left-[4%] w-[22%] h-[78%] overflow-hidden hidden md:block"
            duration={1.4}
            from={1.08}
            direction="left"
          >
            <SiteImage
              src={WELLNESS_IMAGE_BEFORE}
              alt=""
              fill
              sizes="22vw"
              className="object-cover opacity-55 saturate-[0.65]"
            />
          </ImageReveal>
          <ImageReveal
            className="absolute top-[7%] left-[40%] w-[16%] aspect-[4/3] overflow-hidden hidden lg:block"
            duration={1.3}
            from={1.1}
          >
            <SiteImage
              src={SPA_IMAGE_BEFORE}
              alt=""
              fill
              sizes="16vw"
              className="object-cover opacity-55 saturate-[0.65]"
            />
          </ImageReveal>
          <ImageReveal
            className="absolute top-[14%] right-[4%] w-[24%] h-[70%] overflow-hidden hidden md:block"
            duration={1.4}
            from={1.08}
            direction="right"
          >
            <SiteImage
              src={TAGLINE_BG_MAIN}
              alt=""
              fill
              sizes="24vw"
              className="object-cover opacity-55 saturate-[0.65]"
            />
          </ImageReveal>
          <ImageReveal
            className="absolute bottom-[6%] left-[38%] w-[18%] aspect-[4/3] overflow-hidden hidden lg:block"
            duration={1.3}
            from={1.1}
          >
            <SiteImage
              src={WELLNESS_IMAGE_AFTER}
              alt=""
              fill
              sizes="18vw"
              className="object-cover opacity-55 saturate-[0.65]"
            />
          </ImageReveal>

          {/* Mobile-only soft backdrop so text stays legible without frames. */}
          <SiteImage
            src={TAGLINE_BG_MAIN}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-20 md:hidden"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:py-32 text-center w-full">
          <AnimatedText
            as="h2"
            mode="line"
            text={`${t.tagline1}\n${t.tagline2}`}
            className={`block ${headlineFont} italic text-3xl md:text-5xl leading-[1.15] text-main mb-10 text-overlay-glow`}
            stagger={0.18}
            duration={1.0}
          />
          <Reveal delay={0.3} as="div" className="inline-block">
            <Link
              href={`${localePrefix}/about-us`}
              className="inline-flex items-center gap-2 font-cta uppercase tracking-[0.28em] text-[11px] text-main/80 hover:text-main transition-colors"
            >
              <span className="border-b border-main/55 pb-0.5">{t.aboutCta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------- RELATED EXPERIENCES */}
      <section className="border-b border-main/10">
        <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-14">
          <div className="text-center">
            <AnimatedText
              as="p"
              text={t.experiencesEyebrow}
              className="block font-cta uppercase tracking-[0.32em] text-[10px] text-bark mb-4"
              stagger={0.04}
              duration={0.7}
            />
            <AnimatedText
              as="h2"
              text={t.experiencesHeading}
              className={`block ${headlineFont} italic text-3xl md:text-5xl text-main`}
              delay={0.1}
              stagger={0.06}
            />
          </div>
        </div>
        <StaggerGroup
          className="grid grid-cols-1 md:grid-cols-2"
          stagger={0.14}
          offsetY={0}
        >
          <StaggerItem>
            <ExperienceCard
              imageBefore={SPA_IMAGE_BEFORE}
              imageAfter={SPA_IMAGE_AFTER}
              title={t.spaTitle}
              href={`${localePrefix}/book-now`}
              headlineFont={headlineFont}
            />
          </StaggerItem>
          <StaggerItem>
            <ExperienceCard
              imageBefore={WELLNESS_IMAGE_BEFORE}
              imageAfter={WELLNESS_IMAGE_AFTER}
              title={t.wellnessTitle}
              body={t.wellnessDesc}
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
/*  Room row                                                                  */
/* -------------------------------------------------------------------------- */

function RoomRow({
  room,
  isMn,
  reverse,
  localePrefix,
  headlineFont,
  t,
}: {
  room: Room;
  isMn: boolean;
  reverse: boolean;
  localePrefix: string;
  headlineFont: string;
  t: Record<CopyKey, string>;
}) {
  const lang = isMn ? "mn" : "en";
  const detailHref = `${localePrefix}/bookings`;

  return (
    <article
      className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${
        reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <ImageReveal
        className="md:col-span-7 block aspect-[4/3] overflow-hidden bg-white/5"
        duration={1.3}
        from={1.1}
        direction={reverse ? "right" : "left"}
      >
        <Link
          href={detailHref}
          className="relative block h-full w-full group"
        >
          <SiteImage
            src={room.image}
            alt={room.name[lang]}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
          />
        </Link>
      </ImageReveal>

      <ScrollParallax className="md:col-span-5" y={-90}>
        <AnimatedText
          as="h3"
          text={room.name[lang]}
          className={`block ${headlineFont} italic text-3xl md:text-4xl lg:text-5xl text-main leading-[1.1] mb-6`}
          stagger={0.07}
          duration={0.85}
        />

        <StaggerGroup
          as="div"
          className="flex flex-wrap gap-x-6 gap-y-3 mb-6 text-main/70"
          stagger={0.06}
          offsetY={14}
        >
          <StaggerItem as="div">
            <Fact
              icon={<Ruler className="w-4 h-4 text-bark" strokeWidth={1.4} />}
              label={t.areaLabel}
              value={room.area[lang]}
            />
          </StaggerItem>
          <StaggerItem as="div">
            <Fact
              icon={<Users className="w-4 h-4 text-bark" strokeWidth={1.4} />}
              label={t.guestsLabel}
              value={room.guests[lang]}
            />
          </StaggerItem>
          <StaggerItem as="div">
            <Fact
              icon={<BedDouble className="w-4 h-4 text-bark" strokeWidth={1.4} />}
              label={t.quantityLabel}
              value={room.quantity[lang]}
            />
          </StaggerItem>
        </StaggerGroup>

        <Reveal
          as="p"
          className="font-body text-main/70 leading-relaxed mb-8"
          delay={0.15}
        >
          {room.intro[lang]}
        </Reveal>

        <StaggerGroup
          className="flex gap-4 border-t border-main/10 pt-6"
          stagger={0.08}
          offsetY={18}
        >
          <StaggerItem>
            <Link
              href={detailHref}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-main/30 text-main font-cta uppercase tracking-[0.28em] text-[11px] hover:border-main hover:bg-main/5 transition-colors"
            >
              {t.moreInfo}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </StaggerItem>
        </StaggerGroup>
      </ScrollParallax>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                */
/* -------------------------------------------------------------------------- */

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <span className="flex flex-col leading-tight">
        <span className="font-cta uppercase tracking-[0.22em] text-[9px] text-main/45">
          {label}
        </span>
        <span className="font-body text-sm text-main/85">{value}</span>
      </span>
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
  ariaLabelledBy,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  ariaLabelledBy: string;
}) {
  return (
    <div
      role="group"
      aria-labelledby={ariaLabelledBy}
      className="flex items-center justify-between border border-main/20 px-1.5 py-1"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors"
        aria-label="Decrease"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="text-main font-body text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors"
        aria-label="Increase"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ExperienceCard({
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

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-ink/40 via-ink/0 to-ink/0" />
      {body ? (
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0" />
      ) : null}

      <div className="pointer-events-none absolute top-10 md:top-16 left-8 md:left-14 z-[3]">
        <AnimatedText
          as="h3"
          text={title}
          className={`block ${headlineFont} italic text-main text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-overlay-glow`}
          stagger={0.07}
          duration={0.9}
        />
      </div>

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
