"use client";

/**
 * /restaurant — Food & Beverage index.
 *
 * Adapted from the Hoteller "Food & Beverage" template
 * (https://hotellerv5.themegoods.com/resort/restaurant/) and restyled with
 * the Dalai Eej palette (ink / main / bark / leaf) and editorial typography
 * (Playfair Display italic EN, Cormorant italic MN, Montserrat for CTAs,
 * Araboto for body) to match /cabins, /booking, /superior-cabin and the
 * navigation overlay.
 *
 * The page reuses the /cabins animation primitives (AnimatedText, Reveal,
 * StaggerGroup, ScrollParallax, HeroFadeOut, ImageReveal) and the WebGL
 * `MirageImage` hover effect for the related experience cards, so the
 * animation vocabulary across STAY / NOURISH lands in the same register.
 *
 * Each venue links to /booking as a placeholder for future detail pages.
 * The "Reserve a Table" CTA routes to /booking so the main booking flow
 * remains the single source of truth.
 */

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  MapPin,
  Minus,
  Plus,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import {
  AnimatedText,
  HeroFadeOut,
  ImageReveal,
  Reveal,
  ScrollParallax,
  StaggerGroup,
  StaggerItem,
} from "@/app/components/cabins/animations";

// Client-only: the MirageImage bundles ~150 LOC of WebGL. Loaded dynamically
// so SSR stays clean and no WebGL code ships to other routes.
const MirageImage = dynamic(
  () => import("@/app/components/cabins/MirageImage"),
  { ssr: false },
);

/** Jul 1–5 default stay window, aligned with /booking + /cabins. */
function getDefaultJulyStayDates(): { checkin: string; checkout: string } {
  const now = new Date();
  let year = now.getFullYear();
  const afterWindow = now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 5);
  if (afterWindow) year += 1;
  return { checkin: `${year}-07-01`, checkout: `${year}-07-05` };
}

type Bilingual = { en: string; mn: string };

type Venue = {
  slug: string;
  href: string;
  name: Bilingual;
  cuisine: Bilingual;
  seats: Bilingual;
  hours: Bilingual;
  intro: Bilingual;
  priceFrom: number;
  priceLabel: Bilingual;
  image: string;
};

/**
 * Three venues — matches Hoteller's F&B structure ("Food & Beverage",
 * "Sunset Bar", "Lobby Bar") but reframed for Dalai Eej.
 *
 * Images reference existing assets in /public so the page renders out of
 * the box. Drop dedicated shots into /public/restaurant/... and swap the
 * paths below when ready.
 */
const VENUES: Venue[] = [
  {
    slug: "the-hearth",
    href: "/booking",
    name: { en: "The Hearth", mn: "Гал голомт" },
    cuisine: {
      en: "Mongolian · European",
      mn: "Монгол · Европ хоол",
    },
    seats: { en: "Seats 36", mn: "36 хүний суудал" },
    hours: {
      en: "Breakfast · Lunch · Dinner",
      mn: "Өглөө · Үдэш · Орой",
    },
    intro: {
      en: "An open-fire kitchen at the heart of the lodge — wood-fired khorkhog, larch-smoked lake fish and a quiet bread programme built from Mongolian heritage grains.",
      mn: "Байшингийн төвд байрлах галан тогоо — модон галаар бэлтгэсэн хорхог, шинэсэн утаагаар уугиулсан нуурын загас, уламжлалт үр тарианаас бүтээсэн талх.",
    },
    priceFrom: 45,
    priceLabel: { en: "Tasting menu", mn: "Амтлах цэс" },
    image: "/images/silogrid/hearth.webp",
  },
  {
    slug: "sunset-deck",
    href: "/booking",
    name: { en: "Sunset Deck", mn: "Наран жаргалан" },
    cuisine: {
      en: "Lake-facing bar & small plates",
      mn: "Нуур харсан бар · жижиг хоол",
    },
    seats: { en: "Seats 24", mn: "24 хүний суудал" },
    hours: { en: "4:00pm — late", mn: "16:00 — шөнө орой хүртэл" },
    intro: {
      en: "A timber deck at the water's edge — sea buckthorn cocktails, birch-smoked aperitifs and a short menu of grilled things as the sun drops behind the Sayan range.",
      mn: "Нуурын эрэгт баригдсан модон тавцан — чацаргана, хусны мод утсан ундаанууд, Саяны нуруу руу жаргах нар дор шарсан жижиг хоолнууд.",
    },
    priceFrom: 14,
    priceLabel: { en: "Cocktails", mn: "Күүктэйль" },
    image: "/cabins/room-lakeside.jpg",
  },
  {
    slug: "library-bar",
    href: "/booking",
    name: { en: "Library Bar", mn: "Номын бар" },
    cuisine: {
      en: "Fireside lounge · digestifs",
      mn: "Гал зуухны зочны танхим · дижестив",
    },
    seats: { en: "Seats 18", mn: "18 хүний суудал" },
    hours: { en: "6:00pm — midnight", mn: "18:00 — шөнийн 12" },
    intro: {
      en: "The slow hour. Hand-tied leather, lake-ice whisky and a rotating shelf of Mongolian-forest-botanical amari — the room to finish an evening in.",
      mn: "Үдшийн тайван хором. Гараар оёсон арьсан суудал, нуурын мөсөн дээр хатаасан виски, монгол ой модны ургамлаас бэлтгэсэн амари — орой дуусгахад зориулсан өрөө.",
    },
    priceFrom: 12,
    priceLabel: { en: "Nightcap", mn: "Оройн ундаа" },
    image: "/cabins/room-grand-peninsula.jpg",
  },
];

const HERO_IMAGE = "/images/nav-overlay/dining.jpg";

// Paired images for the Hoteller-style "mirage" crossfade. Reuses the
// cabins pair so the STAY/NOURISH experience cards share a visual rhythm.
const SPA_IMAGE_BEFORE = "/cabins/spa-mirage-before.jpg";
const SPA_IMAGE_AFTER = "/cabins/spa-mirage-after.jpg";
const WELLNESS_IMAGE_BEFORE = "/cabins/wellness-mirage-before.jpg";
const WELLNESS_IMAGE_AFTER = "/cabins/wellness-mirage-after.jpg";

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
  | "cuisineLabel"
  | "seatsLabel"
  | "hoursLabel"
  | "fromLabel"
  | "perPerson"
  | "reserveCta"
  | "moreInfo"
  | "visitEyebrow"
  | "visitHeading1"
  | "visitHeading2"
  | "visitAddress"
  | "visitHours"
  | "visitCta"
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
    eyebrow: "Your smile, our happiness",
    title: "Food & Beverage",
    lead: "Three rooms gathered around the fire — a working hearth, a deck at the water's edge, and a library that holds the last hour of the night.",
    bookingHeading: "Reserve a table",
    bookingSubtitle: "Required fields are followed by *",
    checkIn: "Arrival Date",
    checkOut: "Departure Date",
    adults: "Adults",
    children: "Children",
    bookingCta: "Check Availability",
    required: "*",
    sectionEyebrow: "Our Restaurant",
    sectionHeading: "Food drawn from the shoreline.",
    sectionIntro:
      "Every room serves from a single kitchen — Mongolian heritage grains, dairy from Khuvsgul herders, wild herbs from the slope behind the lodge, and fish landed on the lake that morning.",
    cuisineLabel: "Cuisine",
    seatsLabel: "Capacity",
    hoursLabel: "Service",
    fromLabel: "From",
    perPerson: "per person",
    reserveCta: "Reserve a Table",
    moreInfo: "Get More Information",
    visitEyebrow: "Visit Us",
    visitHeading1: "Spend your",
    visitHeading2: "evenings with us",
    visitAddress:
      "Mergen's Ridge, Haichin Am — eastern shore of Lake Khuvsgul, 13 km from Khatgal.",
    visitHours:
      "Breakfast 7:00 – 10:30 · Lunch 12:30 – 14:30 · Dinner 18:00 – 22:00",
    visitCta: "Find the Resort",
    experiencesEyebrow: "Paired with your meal",
    experiencesHeading: "Relax & restore",
    spaTitle: "Relax Spa",
    spaDesc:
      "A quiet treatment room of warm stone and birch steam — drawn from local herbs and the shoreline breeze.",
    wellnessTitle: "Wellness",
    wellnessDesc:
      "Morning movement on the deck, sauna at dusk, and a slow ritual of tea on the return from the lake.",
    learnMore: "Learn More",
    finalHeading: "Book Your Stay",
    finalSubtitle: "Pick your dates — the fire and the lake are waiting.",
    finalCta: "Start Your Booking",
  },
  mn: {
    eyebrow: "Таны инээмсэглэл, бидний аз жаргал",
    title: "Хоол & ундаа",
    lead: "Гурван өрөө галын эргэн тойронд цугларав — идэвхтэй гал голомт, нуурын эргийн тавцан, шөнийн сүүлчийн цагийг барьдаг ном сантай бар.",
    bookingHeading: "Ширээ захиалах",
    bookingSubtitle: "Заавал бөглөх талбарыг * тэмдэглэв",
    checkIn: "Ирэх огноо",
    checkOut: "Гарах огноо",
    adults: "Том хүн",
    children: "Хүүхэд",
    bookingCta: "Боломжит өрөө шалгах",
    required: "*",
    sectionEyebrow: "Манай зоогийн газар",
    sectionHeading: "Нуурын эргээс бүтсэн хоол.",
    sectionIntro:
      "Бүх өрөө нэг тогооноос үйлчилнэ — монгол уламжлалт үр тариа, Хөвсгөлийн малчдын сүү цагаан идээ, байшингийн ард буй энгэрийн зэрлэг ургамал, тэр өглөө нуурнаас татсан загас.",
    cuisineLabel: "Хоолны төрөл",
    seatsLabel: "Багтаамж",
    hoursLabel: "Үйлчилгээ",
    fromLabel: "Үнэ",
    perPerson: "1 хүн",
    reserveCta: "Ширээ захиалах",
    moreInfo: "Дэлгэрэнгүй",
    visitEyebrow: "Манайд морил",
    visitHeading1: "Үдшийн цагаа",
    visitHeading2: "бидэнтэй өнгөрөөгөөрэй",
    visitAddress:
      "Мэргэний шил, Хайчийн ам — Хөвсгөл нуурын зүүн эрэг, Хатгал сумаас 13 км.",
    visitHours:
      "Өглөө 7:00 – 10:30 · Үдэш 12:30 – 14:30 · Орой 18:00 – 22:00",
    visitCta: "Ресорт хүрэх зам",
    experiencesEyebrow: "Хоолонд хосолсон туршлага",
    experiencesHeading: "Амар тайван сэргэлт",
    spaTitle: "Relax Spa",
    spaDesc:
      "Дулаан чулуу, хусны уураар хийгдсэн чимээгүй эмчилгээний өрөө — нутгийн ургамал, нуурын салхийг хослуулав.",
    wellnessTitle: "Сайн сайхан",
    wellnessDesc:
      "Өглөөний дасгал тавцан дээр, үдшийн саун, нууранд очоод буцах замын цайны зан үйл.",
    learnMore: "Дэлгэрэнгүй",
    finalHeading: "Захиалах",
    finalSubtitle: "Өдрөө сонго — гал, нуур тань таныг хүлээж байна.",
    finalCta: "Захиалга эхлүүлэх",
  },
};

export default function RestaurantPage() {
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
                htmlFor="rsvp-checkin"
                className="block font-body text-main text-sm mb-1"
              >
                {t.checkIn} <span className="text-main/50">{t.required}</span>
              </label>
              <input
                id="rsvp-checkin"
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none"
              />
            </StaggerItem>

            <StaggerItem className="lg:col-span-1">
              <label
                htmlFor="rsvp-checkout"
                className="block font-body text-main text-sm mb-1"
              >
                {t.checkOut} <span className="text-main/50">{t.required}</span>
              </label>
              <input
                id="rsvp-checkout"
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                min={checkin}
                className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none"
              />
            </StaggerItem>

            <StaggerItem className="lg:col-span-1">
              <span
                id="rsvp-adults"
                className="block font-body text-main text-sm mb-1"
              >
                {t.adults}
              </span>
              <Stepper
                value={adults}
                min={1}
                max={20}
                onChange={setAdults}
                ariaLabelledBy="rsvp-adults"
              />
            </StaggerItem>

            <StaggerItem className="lg:col-span-1">
              <span
                id="rsvp-children"
                className="block font-body text-main text-sm mb-1"
              >
                {t.children}
              </span>
              <Stepper
                value={children}
                min={0}
                max={10}
                onChange={setChildren}
                ariaLabelledBy="rsvp-children"
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

      {/* --------------------------------------------------------- VENUES */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 space-y-20 md:space-y-28">
          {VENUES.map((venue, idx) => (
            <VenueRow
              key={venue.slug}
              venue={venue}
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

      {/* ----------------------------------------------- VISIT US / ADDRESS */}
      <section className="border-y border-main/10">
        <div className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
          <AnimatedText
            as="p"
            text={t.visitEyebrow}
            className="block font-cta uppercase tracking-[0.32em] text-[10px] text-bark mb-5"
            stagger={0.04}
            duration={0.7}
          />
          <AnimatedText
            as="h2"
            mode="line"
            text={`${t.visitHeading1}\n${t.visitHeading2}`}
            className={`block ${headlineFont} italic text-3xl md:text-5xl leading-[1.15] text-main mb-10`}
            stagger={0.18}
            duration={1.0}
          />

          <StaggerGroup
            className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mb-10 text-main/80"
            stagger={0.08}
            offsetY={16}
          >
            <StaggerItem className="flex items-start gap-3 text-left">
              <MapPin className="w-4 h-4 text-bark mt-1" strokeWidth={1.4} />
              <span className="font-body text-sm max-w-xs leading-relaxed">
                {t.visitAddress}
              </span>
            </StaggerItem>
            <StaggerItem className="flex items-start gap-3 text-left">
              <Clock className="w-4 h-4 text-bark mt-1" strokeWidth={1.4} />
              <span className="font-body text-sm max-w-xs leading-relaxed">
                {t.visitHours}
              </span>
            </StaggerItem>
          </StaggerGroup>

          <Reveal delay={0.3} as="div" className="inline-block">
            <Link
              href={`${localePrefix}/contact`}
              className="inline-flex items-center gap-2 font-cta uppercase tracking-[0.28em] text-[11px] text-main/70 hover:text-main transition-colors"
            >
              <span className="border-b border-main/30 pb-0.5">{t.visitCta}</span>
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
/*  Venue row                                                                 */
/* -------------------------------------------------------------------------- */

function VenueRow({
  venue,
  isMn,
  reverse,
  localePrefix,
  bookingHref,
  headlineFont,
  t,
}: {
  venue: Venue;
  isMn: boolean;
  reverse: boolean;
  localePrefix: string;
  bookingHref: string;
  headlineFont: string;
  t: Record<CopyKey, string>;
}) {
  const lang = isMn ? "mn" : "en";
  const detailHref = `${localePrefix}${venue.href}`;
  const formattedPrice = `$${venue.priceFrom.toLocaleString()}`;

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
            src={venue.image}
            alt={venue.name[lang]}
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
          />
        </Link>
      </ImageReveal>

      <ScrollParallax className="md:col-span-5" y={-90}>
        <AnimatedText
          as="h3"
          text={venue.name[lang]}
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
              icon={<UtensilsCrossed className="w-4 h-4 text-bark" strokeWidth={1.4} />}
              label={t.cuisineLabel}
              value={venue.cuisine[lang]}
            />
          </StaggerItem>
          <StaggerItem as="li">
            <Fact
              icon={<Users className="w-4 h-4 text-bark" strokeWidth={1.4} />}
              label={t.seatsLabel}
              value={venue.seats[lang]}
            />
          </StaggerItem>
          <StaggerItem as="li">
            <Fact
              icon={<Clock className="w-4 h-4 text-bark" strokeWidth={1.4} />}
              label={t.hoursLabel}
              value={venue.hours[lang]}
            />
          </StaggerItem>
        </StaggerGroup>

        <Reveal
          as="p"
          className="font-body text-main/70 leading-relaxed mb-8"
          delay={0.15}
        >
          {venue.intro[lang]}
        </Reveal>

        <Reveal
          className="flex flex-wrap items-baseline gap-x-3 mb-8 border-t border-main/10 pt-6"
          delay={0.25}
        >
          <span className="font-cta uppercase tracking-[0.28em] text-[10px] text-main/50">
            {t.fromLabel} · {venue.priceLabel[lang]}
          </span>
          <span
            className={`${headlineFont} italic text-3xl md:text-4xl text-main`}
          >
            {formattedPrice}
          </span>
          <span className="font-body text-main/60 text-sm">
            / {t.perPerson}
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
              {t.reserveCta}
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
