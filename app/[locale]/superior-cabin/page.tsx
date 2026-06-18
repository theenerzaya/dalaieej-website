/* eslint-disable @next/next/no-img-element */
"use client";

/**
 * Superior Cabin — single room detail page.
 *
 * Layout adapted from Hoteller's Superior Room template
 * (https://hotellerv5.themegoods.com/resort/accommodation/superior-room/),
 * restyled with the Dalai Eej palette (ink / main / bark / leaf / water-deep)
 * and editorial typography (Playfair Display italic EN, Cormorant italic MN,
 * Montserrat for CTAs, Araboto for body) to match the booking page and the
 * navigation overlay.
 *
 * Hoteller uses jQuery + stellar + smoove + tilt + flickity + jarallax to get
 * its motion language. We reproduce the same feel with framer-motion so it
 * stays native to this codebase:
 *
 *   • Hero: slow image zoom-out on mount + scroll-linked parallax; title fades
 *     and lifts as the hero scrolls away (Hoteller `#page_caption.hasbg` +
 *     `stellar` parallax).
 *   • Sections: `smoove`-style fade-up on scroll enter.
 *   • Amenity icons: staggered children reveal.
 *   • Gallery: fade-up + hover zoom (`modulobox` feel).
 *   • Experience cards: mouse-tracked 3D tilt (`tilt.jquery.js`) + image zoom.
 *   • Other rooms: stagger reveal + image zoom on hover.
 *   • All motion is gated on `useReducedMotion()`.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { AnimatedText, ImageReveal, Reveal } from "@/app/components/cabins/animations";

// Client-only WebGL component shared with /cabins. Dynamic import keeps the
// shader code out of the server bundle and off any other route.
const MirageImage = dynamic(
  () => import("@/app/components/cabins/MirageImage"),
  { ssr: false },
);
import {
  ArrowRight,
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Minus,
  Mountain,
  Plus,
  Ruler,
  ShowerHead,
} from "lucide-react";
import { assetUrl } from "@/lib/assetUrl";
import DateInput from "@/app/components/ui/DateInput";
import { withLocalePath } from "@/lib/localePath";
import { getCabinCloudbedsFact } from "@/lib/cabinCloudbedsSnapshot";
import { getCabinDetailHref, type CabinSlug } from "@/lib/cabinCatalog";

/** Jul 1–5 for the upcoming summer window (matches the booking page's default). */
function getDefaultJulyStayDates(): { checkin: string; checkout: string } {
  const now = new Date();
  let year = now.getFullYear();
  const afterWindow = now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 5);
  if (afterWindow) year += 1;
  return { checkin: `${year}-07-01`, checkout: `${year}-07-05` };
}

function getRequiredCabinFact(slug: CabinSlug) {
  const fact = getCabinCloudbedsFact(slug);
  if (!fact) throw new Error(`Missing Cloudbeds cabin fact for slug: ${slug}`);
  return fact;
}

const SUPERIOR_FACT = getRequiredCabinFact("superior-cabin");
const SUPERIOR_ROOM_SIZE = SUPERIOR_FACT.roomSizeLabel ?? { en: "50 m²", mn: "50 м²" };

type CopyKey =
  | "eyebrow"
  | "title"
  | "avgArea"
  | "areaValue"
  | "guests"
  | "guestsValue"
  | "intro"
  | "detailsHeading"
  | "roomSize"
  | "bathroom"
  | "bed"
  | "view"
  | "shower"
  | "bookHeading"
  | "bookSubtitle"
  | "checkIn"
  | "checkOut"
  | "adults"
  | "children"
  | "required"
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
  | "otherRoomsEyebrow"
  | "otherRoomsHeading"
  | "viewAllRooms"
  | "backToRooms";

const COPY: Record<"en" | "mn", Record<CopyKey, string>> = {
  en: {
    eyebrow: "Current Cloudbeds room details",
    title: SUPERIOR_FACT.name,
    avgArea: "Heating",
    areaValue: SUPERIOR_FACT.heatingLabel.en,
    guests: "Guests",
    guestsValue: SUPERIOR_FACT.guestLabel.en,
    intro: SUPERIOR_FACT.description.en,
    detailsHeading: "Cloudbeds details",
    roomSize: SUPERIOR_ROOM_SIZE.en,
    bathroom: SUPERIOR_FACT.bathroomLabel.en,
    bed: SUPERIOR_FACT.bedLabel.en,
    view: SUPERIOR_FACT.viewLabel.en,
    shower: SUPERIOR_FACT.showerLabel.en,
    bookHeading: "Book Your Stay",
    bookSubtitle: "Required fields are followed by *",
    checkIn: "Check-in Date",
    checkOut: "Check-out Date",
    adults: "Adults",
    children: "Children",
    required: "*",
    bookCta: "Check Availability",
    tagline1: "The best people to take care of",
    tagline2: "our most valuable asset: you.",
    aboutCta: "More About Us",
    experiencesEyebrow: "Stay Well",
    experiencesHeading: "Paired with the forest",
    spaTitle: "Relax Spa",
    spaDesc:
      "A quiet treatment room of warm stone and birch steam — drawn from local herbs and the shoreline breeze.",
    wellnessTitle: "Wellness",
    wellnessDesc:
      "Morning movement on the deck, sauna at dusk, and a slow ritual of tea on the return from the lake.",
    learnMore: "Learn More",
    otherRoomsEyebrow: "Other Stays",
    otherRoomsHeading: "Find your cabin",
    viewAllRooms: "View all accommodations",
    backToRooms: "Back to accommodations",
  },
  mn: {
    eyebrow: "Cloudbeds-ийн өрөөний мэдээлэл",
    title: SUPERIOR_FACT.name,
    avgArea: "Халаалт",
    areaValue: SUPERIOR_FACT.heatingLabel.mn,
    guests: "Зочид",
    guestsValue: SUPERIOR_FACT.guestLabel.mn,
    intro: SUPERIOR_FACT.description.mn,
    detailsHeading: "Cloudbeds-ийн мэдээлэл",
    roomSize: SUPERIOR_ROOM_SIZE.mn,
    bathroom: SUPERIOR_FACT.bathroomLabel.mn,
    bed: SUPERIOR_FACT.bedLabel.mn,
    view: SUPERIOR_FACT.viewLabel.mn,
    shower: SUPERIOR_FACT.showerLabel.mn,
    bookHeading: "Амралтаа захиалах",
    bookSubtitle: "Заавал бөглөх талбарыг * тэмдэглэв",
    checkIn: "Ирэх огноо",
    checkOut: "Гарах огноо",
    adults: "Том хүн",
    children: "Хүүхэд",
    required: "*",
    bookCta: "Боломжит өрөө шалгах",
    tagline1: "Таны хамгийн үнэт зүйлд —",
    tagline2: "өөрт тань, бид анхаарна.",
    aboutCta: "Бидний тухай",
    experiencesEyebrow: "Сайхан амар",
    experiencesHeading: "Ойтой уялдсан туршлага",
    spaTitle: "Relax Spa",
    spaDesc:
      "Дулаан чулуу, хусны уураар хийгдсэн чимээгүй эмчилгээний өрөө — нутгийн ургамал, нуурын салхийг хослуулав.",
    wellnessTitle: "Сайн сайхан",
    wellnessDesc:
      "Өглөөний дасгал тавцан дээр, үдшийн саун, нууранд очоод буцах замын цайны зан үйл.",
    learnMore: "Дэлгэрэнгүй",
    otherRoomsEyebrow: "Бусад өрөө",
    otherRoomsHeading: "Өөрийн байшингаа сонго",
    viewAllRooms: "Бүх байрлах сонголт үзэх",
    backToRooms: "Бусад өрөө рүү буцах",
  },
};

const HERO_IMAGE = assetUrl("/images/rooms/superior-cabin/00.webp");

const GALLERY_IMAGES = [
  "01",
  "02",
  "03",
  "04",
].map((i) => assetUrl(`/images/rooms/superior-cabin/${i}.webp`));

// Mirage effect pairs — identical set used on /cabins so the crossfade reads
// consistently across the site.
const SPA_IMAGE_BEFORE = assetUrl("/images/cabins/spa-mirage-before.webp");
const SPA_IMAGE_AFTER = assetUrl("/images/cabins/spa-mirage-after.webp");
const WELLNESS_IMAGE_BEFORE = assetUrl("/images/cabins/wellness-mirage-before.webp");
const WELLNESS_IMAGE_AFTER = assetUrl("/images/cabins/wellness-mirage-after.webp");
const TAGLINE_BG_MAIN = assetUrl("/images/rooms/superior-cabin/00.webp");

function makeOtherRoom(slug: CabinSlug, image: string) {
  const fact = getRequiredCabinFact(slug);
  return {
    name: { en: fact.name, mn: fact.name },
    summary: fact.guestLabel,
    image,
    href: getCabinDetailHref(slug),
  };
}

const OTHER_ROOMS = [
  makeOtherRoom("triple-traditional-cabin", assetUrl("/images/cabins/room-triple-traditional.webp")),
  makeOtherRoom("lakeside-cabin", assetUrl("/images/cabins/room-lakeside.webp")),
  makeOtherRoom("triple-electric-cabin", assetUrl("/images/cabins/room-triple-electric.webp")),
  makeOtherRoom("signature-cabin", assetUrl("/images/cabins/room-signature.webp")),
  makeOtherRoom("quad-electric-cabin", assetUrl("/images/cabins/room-quad-electric.webp")),
  makeOtherRoom("grand-peninsula-suite", assetUrl("/images/cabins/room-grand-peninsula.webp")),
  makeOtherRoom("camping", assetUrl("/images/rooms/camping.webp")),
];

/* -------------------------------------------------------------------------- */
/*  Shared motion variants — `smoove`-style fade-up on scroll                  */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUpSlow: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function SuperiorCabinPage() {
  const locale = useLocale();
  const isMn = locale === "mn";
  const t = COPY[isMn ? "mn" : "en"];
  const localePrefix = withLocalePath(locale, "/");
  const reduce = useReducedMotion();

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

  const headlineFont = isMn ? "font-editorial-mn" : "font-editorial-en";
  const otherRoomsCarouselRef = useRef<HTMLDivElement>(null);
  const otherRoomsTrack = useMemo(
    () => [...OTHER_ROOMS, ...OTHER_ROOMS, ...OTHER_ROOMS],
    [],
  );
  const otherRoomsLoopReadyRef = useRef(false);

  useEffect(() => {
    const el = otherRoomsCarouselRef.current;
    if (!el || otherRoomsLoopReadyRef.current) return;

    // Start on the middle copy so both directions can scroll seamlessly.
    const loopWidth = el.scrollWidth / 3;
    el.scrollLeft = loopWidth;
    otherRoomsLoopReadyRef.current = true;
  }, []);

  const normalizeOtherRoomsScroll = () => {
    const el = otherRoomsCarouselRef.current;
    if (!el) return;
    const loopWidth = el.scrollWidth / 3;

    if (el.scrollLeft <= loopWidth * 0.5) {
      el.scrollLeft += loopWidth;
    } else if (el.scrollLeft >= loopWidth * 1.5) {
      el.scrollLeft -= loopWidth;
    }
  };

  const scrollOtherRooms = (direction: "prev" | "next") => {
    const el = otherRoomsCarouselRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-room-card]");
    const cardWidth = firstCard?.offsetWidth ?? Math.round(el.clientWidth * 0.86);
    const styles = typeof window !== "undefined" ? window.getComputedStyle(el) : null;
    const gap = styles ? Number.parseFloat(styles.columnGap || styles.gap || "0") : 0;
    const delta = Math.round(cardWidth + gap) * (direction === "next" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  /* --------------------- HERO scroll parallax ---------------------------- */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Title fades out + lifts — matches Hoteller `#page_caption.hasbg .page_title_inner`
  const titleOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const titleY = useTransform(heroProgress, [0, 1], ["0%", "-30%"]);
  // Background image parallax — subtler than Hoteller's 1.15 stellar ratio
  const imageY = useTransform(heroProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(heroProgress, [0, 1], [1, 1.08]);

  const facts: { icon: typeof Ruler; label: string }[] = [
    { icon: Ruler, label: t.roomSize },
    { icon: BedDouble, label: t.bed },
    { icon: Bath, label: t.bathroom },
    { icon: ShowerHead, label: t.shower },
    { icon: Mountain, label: t.view },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-ink text-main overflow-hidden">
      {/* ----------------------------------------------------------- HERO */}
      <section
        ref={heroRef}
        className="relative h-[90vh] min-h-[560px] w-full overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={
            reduce
              ? undefined
              : { y: imageY, scale: imageScale }
          }
          initial={reduce ? { scale: 1 } : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={HERO_IMAGE}
            alt={t.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/80" />

        <motion.div
          className="relative z-10 flex h-full items-end"
          style={reduce ? undefined : { opacity: titleOpacity, y: titleY }}
        >
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 md:pb-24">
            <motion.p
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: reduce ? 0 : 0.25 }}
              className="font-cta uppercase tracking-[0.32em] text-[11px] sm:text-xs text-main/75 mb-5"
            >
              {t.eyebrow}
            </motion.p>
            <motion.h1
              initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`${headlineFont} italic font-normal text-main text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02]`}
            >
              {t.title}
            </motion.h1>
          </div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------- INTRO BAND */}
      <section className="border-b border-main/10">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-16"
        >
          <motion.ul
            variants={fadeUp}
            className="space-y-4 md:border-r md:border-main/10 md:pr-16 shrink-0"
          >
            <li>
              <p className="font-cta uppercase tracking-[0.28em] text-[10px] text-main/50 mb-1">
                {t.avgArea}
              </p>
              <p className={`${headlineFont} italic text-2xl md:text-3xl text-main`}>
                {t.areaValue}
              </p>
            </li>
            <li>
              <p className="font-cta uppercase tracking-[0.28em] text-[10px] text-main/50 mb-1">
                {t.guests}
              </p>
              <p className={`${headlineFont} italic text-2xl md:text-3xl text-main`}>
                {t.guestsValue}
              </p>
            </li>
          </motion.ul>

          <motion.p
            variants={fadeUp}
            className="font-body text-main/75 text-base md:text-lg leading-relaxed max-w-2xl"
          >
            {t.intro}
          </motion.p>
        </motion.div>
      </section>

      {/* -------------------------------------------------- AMENITY ICONS */}
      <section className="border-b border-main/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <motion.p
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7 }}
            className="font-cta uppercase tracking-[0.32em] text-[10px] text-main/50 mb-8 md:mb-12 text-center"
          >
            {t.detailsHeading}
          </motion.p>

          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-10 gap-x-6"
          >
            {facts.map(({ icon: Icon, label }, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-3 text-main/80"
              >
                <Icon className="w-6 h-6 text-bark" strokeWidth={1.4} />
                <span className="font-body text-sm tracking-wide">{label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* -------------------------------------------------------- GALLERY */}
      <section className="border-b border-main/10">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6"
        >
          <div className="md:col-span-3 grid grid-cols-1 gap-4 md:gap-6">
            <motion.div
              variants={fadeUpSlow}
              className="aspect-[4/3] overflow-hidden bg-white/5 group"
            >
              <img
                src={GALLERY_IMAGES[0]}
                alt={t.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
            <motion.div
              variants={fadeUpSlow}
              className="aspect-[4/3] overflow-hidden bg-white/5 group"
            >
              <img
                src={GALLERY_IMAGES[3]}
                alt={t.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-4 md:gap-6">
            <motion.div
              variants={fadeUpSlow}
              className="aspect-[4/3] md:aspect-auto overflow-hidden bg-white/5 group"
            >
              <img
                src={GALLERY_IMAGES[1]}
                alt={t.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
            <motion.div
              variants={fadeUpSlow}
              className="aspect-[4/3] md:aspect-auto overflow-hidden bg-white/5 group"
            >
              <img
                src={GALLERY_IMAGES[2]}
                alt={t.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* -------------------------------------------------- MINI BOOKING */}
      <section className="border-b border-main/10">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className={`${headlineFont} italic text-4xl md:text-5xl text-main mb-3`}
          >
            {t.bookHeading}
          </motion.h2>
          <motion.p variants={fadeUp} className="font-body text-main/50 text-xs mb-10">
            {t.bookSubtitle}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-left"
          >
            <div>
              <label htmlFor="sc-checkin" className="block font-body text-main text-sm mb-1">
                {t.checkIn} <span className="text-main/50">{t.required}</span>
              </label>
              <DateInput
                id="sc-checkin"
                value={checkin}
                onChange={setCheckin}
                className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none !rounded-none !px-0"
              />
            </div>

            <div>
              <label htmlFor="sc-checkout" className="block font-body text-main text-sm mb-1">
                {t.checkOut} <span className="text-main/50">{t.required}</span>
              </label>
              <DateInput
                id="sc-checkout"
                value={checkout}
                onChange={setCheckout}
                min={checkin}
                className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none !rounded-none !px-0"
              />
            </div>

            <div>
              <span id="sc-adults" className="block font-body text-main text-sm mb-1">
                {t.adults}
              </span>
              <Stepper
                value={adults}
                min={1}
                max={20}
                onChange={setAdults}
                ariaLabelledBy="sc-adults"
              />
            </div>

            <div>
              <span id="sc-children" className="block font-body text-main text-sm mb-1">
                {t.children}
              </span>
              <Stepper
                value={children}
                min={0}
                max={10}
                onChange={setChildren}
                ariaLabelledBy="sc-children"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10">
            <Link
              href={bookingHref}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-main text-ink font-cta uppercase tracking-[0.28em] text-xs hover:bg-main/90 transition-colors"
            >
              {t.bookCta}
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------- TAGLINE QUOTE */}
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
            <img
              src={WELLNESS_IMAGE_BEFORE}
              alt=""
              className="h-full w-full object-cover opacity-55 saturate-[0.65]"
            />
          </ImageReveal>
          <ImageReveal
            className="absolute top-[7%] left-[40%] w-[16%] aspect-[4/3] overflow-hidden hidden lg:block"
            duration={1.3}
            from={1.1}
          >
            <img
              src={SPA_IMAGE_BEFORE}
              alt=""
              className="h-full w-full object-cover opacity-55 saturate-[0.65]"
            />
          </ImageReveal>
          <ImageReveal
            className="absolute top-[14%] right-[4%] w-[24%] h-[70%] overflow-hidden hidden md:block"
            duration={1.4}
            from={1.08}
            direction="right"
          >
            <img
              src={TAGLINE_BG_MAIN}
              alt=""
              className="h-full w-full object-cover opacity-55 saturate-[0.65]"
            />
          </ImageReveal>
          <ImageReveal
            className="absolute bottom-[6%] left-[38%] w-[18%] aspect-[4/3] overflow-hidden hidden lg:block"
            duration={1.3}
            from={1.1}
          >
            <img
              src={WELLNESS_IMAGE_AFTER}
              alt=""
              className="h-full w-full object-cover opacity-55 saturate-[0.65]"
            />
          </ImageReveal>

          <img
            src={TAGLINE_BG_MAIN}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 md:hidden"
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

      {/* ------------------------------------------------- RELATED STAYS */}
      <section className="border-b border-main/10">
        <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-14">
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              className="font-cta uppercase tracking-[0.32em] text-[10px] text-bark mb-4"
            >
              {t.experiencesEyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className={`${headlineFont} italic text-3xl md:text-5xl text-main`}
            >
              {t.experiencesHeading}
            </motion.h2>
          </motion.div>
        </div>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          <ExperienceCard
            imageBefore={SPA_IMAGE_BEFORE}
            imageAfter={SPA_IMAGE_AFTER}
            title={t.spaTitle}
            href={`${localePrefix}/wellness`}
            headlineFont={headlineFont}
          />
          <ExperienceCard
            imageBefore={WELLNESS_IMAGE_BEFORE}
            imageAfter={WELLNESS_IMAGE_AFTER}
            title={t.wellnessTitle}
            body={t.wellnessDesc}
            learnMore={t.learnMore}
            href={`${localePrefix}/wellness`}
            headlineFont={headlineFont}
          />
        </motion.div>
      </section>

      {/* ----------------------------------------------------- OTHER ROOMS */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="font-cta uppercase tracking-[0.32em] text-[10px] text-bark mb-4"
            >
              {t.otherRoomsEyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className={`${headlineFont} italic text-3xl md:text-5xl text-main`}
            >
              {t.otherRoomsHeading}
            </motion.h2>
          </motion.div>

          <div className="relative">
            <div className="hidden md:flex items-center justify-end gap-3 mb-6">
              <button
                type="button"
                onClick={() => scrollOtherRooms("prev")}
                aria-label="Previous room"
                className="inline-flex items-center justify-center w-10 h-10 border border-main/25 text-main/70 hover:text-main hover:border-main/45 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollOtherRooms("next")}
                aria-label="Next room"
                className="inline-flex items-center justify-center w-10 h-10 border border-main/25 text-main/70 hover:text-main hover:border-main/45 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <motion.div
              ref={otherRoomsCarouselRef}
              onScroll={normalizeOtherRoomsScroll}
              variants={staggerParent}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="flex gap-6 md:gap-8 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {otherRoomsTrack.map((room, idx) => (
                <motion.div
                  key={`${room.name.en}-${idx}`}
                  variants={fadeUp}
                  data-room-card
                  className="snap-start shrink-0 w-[84%] sm:w-[56%] lg:w-[32%]"
                >
                  <Link
                    href={`${localePrefix}${room.href}`}
                    className="group block"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-white/5 mb-5">
                      <img
                        src={room.image}
                        alt={room.name[isMn ? "mn" : "en"]}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      />
                    </div>
                    <h3 className={`${headlineFont} italic text-2xl md:text-3xl text-main group-hover:text-bark transition-colors`}>
                      {room.name[isMn ? "mn" : "en"]}
                    </h3>
                    <p className="font-body text-main/60 text-sm mt-2">
                      {room.summary[isMn ? "mn" : "en"]}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center mt-14 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link
              href={`${localePrefix}/cabins`}
              className="group inline-flex items-center gap-2 font-cta uppercase tracking-[0.28em] text-[11px] text-main/70 hover:text-main transition-colors"
            >
              <span className="border-b border-main/30 group-hover:border-main pb-0.5">
                {t.viewAllRooms}
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small local primitives                                                    */
/* -------------------------------------------------------------------------- */

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

/**
 * ExperienceCard — reproduces the `tilt.jquery.js` hover feel with a
 * spring-damped mouse-tracked 3D tilt, and uses the shared WebGL
 * `MirageImage` so the Spa/Wellness visuals liquid-morph on hover the same
 * way Hoteller's demo does.
 *
 * The tilt container is the mouse-tracked element; `MirageImage` listens
 * on its own canvas for hover, so both effects live inside the same card
 * without fighting each other.
 */
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
    <motion.article
      variants={fadeUp}
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
      <motion.div className="absolute inset-0 h-full w-full z-0">
        <MirageImage
          before={imageBefore}
          after={imageAfter}
          alt={title}
          className="h-full w-full"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-ink/40 via-ink/0 to-ink/0" />
      {body ? (
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0" />
      ) : null}

      <div className="pointer-events-none absolute top-10 md:top-16 left-8 md:left-14 z-[3]">
        <h3
          className={`${headlineFont} italic text-main text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-overlay-glow`}
        >
          {title}
        </h3>
      </div>

      {body ? (
        <div className="pointer-events-none absolute right-8 md:right-14 bottom-16 md:bottom-24 z-[3] max-w-md text-right">
          <p className="font-body text-main/90 text-sm md:text-base leading-relaxed mb-5">
            {body}
          </p>
          {learnMore ? (
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto inline-flex items-center gap-2 font-cta uppercase tracking-[0.32em] text-[11px] text-main"
            >
              <span className="border-b border-main/60 group-hover:border-main pb-0.5">
                {learnMore}
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </motion.article>
  );
}
