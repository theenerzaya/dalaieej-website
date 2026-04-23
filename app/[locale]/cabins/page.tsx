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

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import Link from "next/link";
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
  priceFrom: number;
  image: string;
};

const ROOMS: Room[] = [
  {
    slug: "superior-cabin",
    href: "/superior-cabin",
    name: { en: "Superior Cabin", mn: "Superior модон байшин" },
    area: { en: "30 m²", mn: "30 м²" },
    guests: { en: "2 adults · 1 child", mn: "2 том хүн · 1 хүүхэд" },
    quantity: { en: "6 cabins", mn: "6 байшин" },
    intro: {
      en: "Wood-fired warmth, handwoven textiles and a private forest view — our entry-level cabin, sized for couples and small families.",
      mn: "Галын зуухны дулаан, гар нэхмэл эдлэл, ойн хувийн харагдацтай — хос болон жижиг гэр бүлд зориулсан анхны шатны модон байшин.",
    },
    priceFrom: 300,
    image: "/images/cabins/room-superior.jpg",
  },
  {
    slug: "lakeside-cabin",
    href: "/cabins",
    name: { en: "Lakeside Cabin", mn: "Нуурын модон байшин" },
    area: { en: "55 m²", mn: "55 м²" },
    guests: { en: "3 adults · 1 child", mn: "3 том хүн · 1 хүүхэд" },
    quantity: { en: "4 cabins", mn: "4 байшин" },
    intro: {
      en: "A wider footprint at the shoreline — two sleeping spaces, a reading nook and a deck that steps straight toward Lake Khuvsgul.",
      mn: "Нуурын эрэгт илүү өргөн талбайтай — хоёр унтлагын орчин, уншлагын булан, Хөвсгөл нуур руу шууд гарах тавцантай.",
    },
    priceFrom: 420,
    image: "/images/cabins/room-lakeside.jpg",
  },
  {
    slug: "signature-cabin",
    href: "/cabins",
    name: { en: "Signature Cabin", mn: "Онцгой модон байшин" },
    area: { en: "70 m²", mn: "70 м²" },
    guests: { en: "3 adults · 2 children", mn: "3 том хүн · 2 хүүхэд" },
    quantity: { en: "3 cabins", mn: "3 байшин" },
    intro: {
      en: "Our most requested room — a separate living area, deep-soak tub, and a private terrace that opens onto the larch line.",
      mn: "Хамгийн их эрэлттэй өрөө — тусдаа зочны хэсэг, гүн угаалгын ванн, шинэсэн ой руу нээгдэх хувийн террастай.",
    },
    priceFrom: 560,
    image: "/images/cabins/room-signature.jpg",
  },
  {
    slug: "grand-peninsula-suite",
    href: "/cabins",
    name: { en: "Grand Peninsula Suite", mn: "Хойг дээрх тусгай хаус" },
    area: { en: "120 m²", mn: "120 м²" },
    guests: { en: "4 adults · 2 children", mn: "4 том хүн · 2 хүүхэд" },
    quantity: { en: "1 suite", mn: "1 тусгай хаус" },
    intro: {
      en: "A standalone suite on its own peninsula — two bedrooms, a wood-panelled living room, and uninterrupted lake views on three sides.",
      mn: "Өөрийн хойг дээрх тусдаа хаус — хоёр унтлагын өрөө, модон хавтастай зочны танхим, гурван тал нуурын тасралтгүй харагдацтай.",
    },
    priceFrom: 1200,
    image: "/images/cabins/room-grand-peninsula.jpg",
  },
];

const HERO_IMAGE = "/images/cabins/hero-our-rooms.jpg";

// Paired images for the Hoteller-style "mirage" crossfade.
// `before` is the resting state; `after` is revealed with a WebGL liquid
// distortion on hover. Each pair is two visually related but distinct shots
// so the morph reads as a mood shift rather than a flicker.
const SPA_IMAGE_BEFORE = "/images/cabins/spa-mirage-before.jpg";
const SPA_IMAGE_AFTER = "/images/cabins/spa-mirage-after.jpg";
const WELLNESS_IMAGE_BEFORE = "/images/cabins/wellness-mirage-before.jpg";
const WELLNESS_IMAGE_AFTER = "/images/cabins/wellness-mirage-after.jpg";

type CopyKey =
  | "eyebrow"
  | "title"
  | "lead"
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
  | "fromLabel"
  | "perNight"
  | "moreInfo"
  | "bookCta"
  | "tagline1"
  | "tagline2"
  | "aboutCta"
  | "experiencesEyebrow"
  | "experiencesHeading"
  | "spaTitle"
  | "spaDesc"
  | "wellnessTitle"
  | "wellnessDesc"
  | "learnMore"
  | "finalHeading"
  | "finalSubtitle"
  | "finalCta";

const COPY: Record<"en" | "mn", Record<CopyKey, string>> = {
  en: {
    eyebrow: "Stay with us · feel like home",
    title: "Our Rooms",
    lead: "Redefine your expectations. A lakeside experience unlike the rest — we invite you to try it.",
    bookingHeading: "Check availability",
    bookingSubtitle: "Required fields are followed by *",
    checkIn: "Check-in Date",
    checkOut: "Check-out Date",
    adults: "Adults",
    children: "Children",
    bookingCta: "Check Availability",
    required: "*",
    sectionEyebrow: "Accommodations",
    sectionHeading: "The luxury of being yourself.",
    sectionIntro:
      "Four rooms drawn from the shoreline — every cabin hand-built by Khuvsgul craftsmen, every interior assembled with local wood, wool and stone.",
    quantityLabel: "Quantity",
    guestsLabel: "Guests",
    areaLabel: "Average area",
    fromLabel: "From",
    perNight: "per night",
    moreInfo: "Get More Information",
    bookCta: "Book Your Stay",
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
    finalHeading: "Book Your Stay",
    finalSubtitle: "Pick your dates — the lake and the larch are waiting.",
    finalCta: "Start Your Booking",
  },
  mn: {
    eyebrow: "Гэрэл шиг уух · гэр шиг амар",
    title: "Манай өрөөнүүд",
    lead: "Таны төсөөллийг эргэн сэргээх нуурын эргийн онцгой туршлага — та бидэнтэй хамт мэдрэхийг урьж байна.",
    bookingHeading: "Боломжит өрөө шалгах",
    bookingSubtitle: "Заавал бөглөх талбарыг * тэмдэглэв",
    checkIn: "Ирэх огноо",
    checkOut: "Гарах огноо",
    adults: "Том хүн",
    children: "Хүүхэд",
    bookingCta: "Боломжит өрөө шалгах",
    required: "*",
    sectionEyebrow: "Байрлах сонголтууд",
    sectionHeading: "Өөрөө байх тансаглал.",
    sectionIntro:
      "Нуурын эргээс сэдэвлэсэн дөрвөн өрөө — байшин бүрийг Хөвсгөлийн урчууд гараар бүтээж, дотоод засалд нь нутгийн мод, ноос, чулууг шингээжээ.",
    quantityLabel: "Тоо ширхэг",
    guestsLabel: "Зочид",
    areaLabel: "Дундаж талбай",
    fromLabel: "Үнэ",
    perNight: "1 шөнө",
    moreInfo: "Дэлгэрэнгүй",
    bookCta: "Захиалах",
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
    finalHeading: "Захиалах",
    finalSubtitle: "Өдрөө сонго — нуур, шинэсэн ой тань таныг хүлээж байна.",
    finalCta: "Захиалга эхлүүлэх",
  },
};

export default function CabinsPage() {
  const locale = useLocale();
  const isMn = locale === "mn";
  const t = COPY[isMn ? "mn" : "en"];
  const localePrefix = isMn ? "/mn" : "";
  const headlineFont = isMn ? "font-editorial-mn" : "font-editorial-en";

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

  return (
    <main id="main-content" className="min-h-screen bg-ink text-main">
      {/* ------------------------------------------------------------ HERO */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        <ImageReveal
          className="absolute inset-0 h-full w-full"
          duration={1.6}
          from={1.1}
        >
          <img
            src={HERO_IMAGE}
            alt={t.title}
            className="h-full w-full object-cover"
          />
        </ImageReveal>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/25 to-ink/80" />
        <HeroFadeOut className="relative z-10 flex h-full items-end" rise={140}>
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 md:pb-24">
            <AnimatedText
              as="p"
              text={t.eyebrow}
              className="block font-cta uppercase tracking-[0.32em] text-[11px] sm:text-xs text-main/75 mb-5"
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

      {/* ----------------------------------------------------- INTRO LEAD */}
      <section className="border-b border-main/10">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-center">
          <Reveal as="p" className="font-body text-main/75 text-base md:text-lg leading-relaxed">
            {t.lead}
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- BOOKING BAR */}
      <section className="border-b border-main/10">
        <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
          <div className="text-center mb-10">
            <AnimatedText
              as="h2"
              text={t.bookingHeading}
              className={`block ${headlineFont} italic text-3xl md:text-4xl text-main mb-2`}
              stagger={0.06}
            />
            <Reveal as="p" className="font-body text-main/50 text-xs" delay={0.15}>
              {t.bookingSubtitle}
            </Reveal>
          </div>

          <StaggerGroup
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-6 items-end"
            stagger={0.07}
            offsetY={18}
          >
            <StaggerItem className="lg:col-span-1">
              <label
                htmlFor="cbns-checkin"
                className="block font-body text-main text-sm mb-1"
              >
                {t.checkIn} <span className="text-main/50">{t.required}</span>
              </label>
              <input
                id="cbns-checkin"
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none"
              />
            </StaggerItem>

            <StaggerItem className="lg:col-span-1">
              <label
                htmlFor="cbns-checkout"
                className="block font-body text-main text-sm mb-1"
              >
                {t.checkOut} <span className="text-main/50">{t.required}</span>
              </label>
              <input
                id="cbns-checkout"
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                min={checkin}
                className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none"
              />
            </StaggerItem>

            <StaggerItem className="lg:col-span-1">
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
            </StaggerItem>

            <StaggerItem className="lg:col-span-1">
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
            </StaggerItem>

            <StaggerItem className="lg:col-span-1">
              <Link
                href={bookingHref}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-main text-ink font-cta uppercase tracking-[0.28em] text-[11px] hover:bg-main/90 transition-colors"
              >
                {t.bookingCta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* --------------------------------------------------- SECTION INTRO */}
      <section>
        <div className="mx-auto max-w-4xl px-6 pt-24 md:pt-32 pb-6 text-center">
          <AnimatedText
            as="p"
            text={t.sectionEyebrow}
            className="block font-cta uppercase tracking-[0.32em] text-[10px] text-bark mb-4"
            stagger={0.04}
            duration={0.7}
          />
          <AnimatedText
            as="h2"
            text={t.sectionHeading}
            className={`block ${headlineFont} italic text-3xl md:text-5xl leading-[1.15] text-main mb-6`}
            delay={0.1}
            stagger={0.06}
          />
          <Reveal
            as="p"
            className="font-body text-main/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            delay={0.2}
          >
            {t.sectionIntro}
          </Reveal>
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
              bookingHref={bookingHref}
              headlineFont={headlineFont}
              t={t}
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- TAGLINE QUOTE */}
      <section className="border-y border-main/10">
        <div className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
          <AnimatedText
            as="h2"
            mode="line"
            text={`${t.tagline1}\n${t.tagline2}`}
            className={`block ${headlineFont} italic text-3xl md:text-5xl leading-[1.15] text-main mb-10`}
            stagger={0.18}
            duration={1.0}
          />
          <Reveal delay={0.3} as="div" className="inline-block">
            <Link
              href={`${localePrefix}/about-us`}
              className="inline-flex items-center gap-2 font-cta uppercase tracking-[0.28em] text-[11px] text-main/70 hover:text-main transition-colors"
            >
              <span className="border-b border-main/30 pb-0.5">{t.aboutCta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------- RELATED EXPERIENCES */}
      <section className="border-b border-main/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="text-center mb-14">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            <ExperienceCard
              imageBefore={SPA_IMAGE_BEFORE}
              imageAfter={SPA_IMAGE_AFTER}
              title={t.spaTitle}
              description={t.spaDesc}
              learnMore={t.learnMore}
              href={`${localePrefix}/wellness`}
              headlineFont={headlineFont}
            />
            <ExperienceCard
              imageBefore={WELLNESS_IMAGE_BEFORE}
              imageAfter={WELLNESS_IMAGE_AFTER}
              title={t.wellnessTitle}
              description={t.wellnessDesc}
              learnMore={t.learnMore}
              href={`${localePrefix}/wellness`}
              headlineFont={headlineFont}
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- FINAL CTA */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-24 md:py-32 text-center">
          <AnimatedText
            as="h2"
            text={t.finalHeading}
            className={`block ${headlineFont} italic text-4xl md:text-5xl text-main mb-5`}
            stagger={0.07}
          />
          <Reveal as="p" className="font-body text-main/70 mb-10 leading-relaxed" delay={0.15}>
            {t.finalSubtitle}
          </Reveal>
          <Reveal as="div" className="inline-block" delay={0.25}>
            <Link
              href={bookingHref}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-main text-ink font-cta uppercase tracking-[0.28em] text-xs hover:bg-main/90 transition-colors"
            >
              {t.finalCta}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Reveal>
        </div>
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
  bookingHref,
  headlineFont,
  t,
}: {
  room: Room;
  isMn: boolean;
  reverse: boolean;
  localePrefix: string;
  bookingHref: string;
  headlineFont: string;
  t: Record<CopyKey, string>;
}) {
  const lang = isMn ? "mn" : "en";
  const detailHref = `${localePrefix}${room.href}`;
  const formattedPrice = `$${room.priceFrom.toLocaleString()}`;

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
          className="block h-full w-full group"
        >
          <img
            src={room.image}
            alt={room.name[lang]}
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
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
          as="ul"
          className="flex flex-wrap gap-x-6 gap-y-3 mb-6 text-main/70"
          stagger={0.06}
          offsetY={14}
        >
          <StaggerItem as="li">
            <Fact
              icon={<Ruler className="w-4 h-4 text-bark" strokeWidth={1.4} />}
              label={t.areaLabel}
              value={room.area[lang]}
            />
          </StaggerItem>
          <StaggerItem as="li">
            <Fact
              icon={<Users className="w-4 h-4 text-bark" strokeWidth={1.4} />}
              label={t.guestsLabel}
              value={room.guests[lang]}
            />
          </StaggerItem>
          <StaggerItem as="li">
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

        <Reveal
          className="flex flex-wrap items-baseline gap-x-3 mb-8 border-t border-main/10 pt-6"
          delay={0.25}
        >
          <span className="font-cta uppercase tracking-[0.28em] text-[10px] text-main/50">
            {t.fromLabel}
          </span>
          <span
            className={`${headlineFont} italic text-3xl md:text-4xl text-main`}
          >
            {formattedPrice}
          </span>
          <span className="font-body text-main/60 text-sm">
            / {t.perNight}
          </span>
        </Reveal>

        <StaggerGroup
          className="flex flex-col sm:flex-row gap-4"
          stagger={0.08}
          offsetY={18}
        >
          <StaggerItem>
            <Link
              href={bookingHref}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-main text-ink font-cta uppercase tracking-[0.28em] text-[11px] hover:bg-main/90 transition-colors"
            >
              {t.bookCta}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </StaggerItem>
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
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <span className="flex flex-col leading-tight">
        <span className="font-cta uppercase tracking-[0.22em] text-[9px] text-main/45">
          {label}
        </span>
        <span className="font-body text-sm text-main/85">{value}</span>
      </span>
    </li>
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
  description,
  learnMore,
  href,
  headlineFont,
}: {
  imageBefore: string;
  imageAfter: string;
  title: string;
  description: string;
  learnMore: string;
  href: string;
  headlineFont: string;
}) {
  return (
    <article className="group">
      <ImageReveal
        className="mb-6 aspect-[5/3] overflow-hidden bg-white/5"
        duration={1.2}
        from={1.06}
      >
        <Link href={href} className="block h-full w-full">
          <MirageImage
            before={imageBefore}
            after={imageAfter}
            alt={title}
            className="h-full w-full"
          />
        </Link>
      </ImageReveal>
      <AnimatedText
        as="h3"
        text={title}
        className={`block ${headlineFont} italic text-2xl md:text-3xl text-main mb-3`}
        stagger={0.06}
        duration={0.8}
      />
      <Reveal as="p" className="font-body text-main/70 leading-relaxed mb-5" delay={0.15}>
        {description}
      </Reveal>
      <Reveal as="div" className="inline-block" delay={0.25}>
        <Link
          href={href}
          className="inline-flex items-center gap-2 font-cta uppercase tracking-[0.28em] text-[11px] text-bark hover:text-main transition-colors"
        >
          <span className="border-b border-bark/40 group-hover:border-main pb-0.5">
            {learnMore}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Reveal>
    </article>
  );
}
