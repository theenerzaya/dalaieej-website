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

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

// Client-only WebGL component shared with /cabins. Dynamic import keeps the
// shader code out of the server bundle and off any other route.
const MirageImage = dynamic(
  () => import("@/app/components/cabins/MirageImage"),
  { ssr: false },
);
import {
  ArrowRight,
  BedDouble,
  Minus,
  Mountain,
  Plus,
  Ruler,
  ShowerHead,
  Tv,
  Wifi,
} from "lucide-react";

/** Jul 1–5 for the upcoming summer window (matches the booking page's default). */
function getDefaultJulyStayDates(): { checkin: string; checkout: string } {
  const now = new Date();
  let year = now.getFullYear();
  const afterWindow = now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 5);
  if (afterWindow) year += 1;
  return { checkin: `${year}-07-01`, checkout: `${year}-07-05` };
}

type CopyKey =
  | "eyebrow"
  | "title"
  | "avgArea"
  | "areaValue"
  | "guests"
  | "guestsValue"
  | "intro"
  | "detailsHeading"
  | "size"
  | "bed"
  | "view"
  | "shower"
  | "tv"
  | "wifi"
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
    eyebrow: "Designed for natural living",
    title: "Superior Cabin",
    avgArea: "Average area",
    areaValue: "30 m²",
    guests: "Guests",
    guestsValue: "2 adults · 1 child",
    intro:
      "Wood-fired warmth, handwoven textiles and a private view of the larch line — our Superior Cabin pairs the quiet materiality of the Khuvsgul forest with a restrained, crafted interior. Every detail is placeholder copy, ready to be replaced with the final room story.",
    detailsHeading: "At a glance",
    size: "30 m²",
    bed: "1 Queen Bed",
    view: "Forest View",
    shower: "Rain Shower",
    tv: "TV + VOD",
    wifi: "WiFi",
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
    eyebrow: "Байгальд ойр амьдралд зориулав",
    title: "Superior модон байшин",
    avgArea: "Дундаж талбай",
    areaValue: "30 м²",
    guests: "Зочид",
    guestsValue: "2 том хүн · 1 хүүхэд",
    intro:
      "Галын зуухны дулаан, гар нэхмэл эдлэл, шинэсэн ойн хувийн харагдацтай — манай Superior модон байшин нь Хөвсгөлийн ойн анир чимээ болон даруухан, гар урлалаар бүтээсэн дотоод засал хоёрыг нэгтгэдэг. Бүх текст түр орлуулсан бөгөөд дараа нь эцсийн агуулгаар солигдоно.",
    detailsHeading: "Товч танилцуулга",
    size: "30 м²",
    bed: "1 том ор",
    view: "Ойн харагдац",
    shower: "Бороон шүршүүр",
    tv: "TV + VOD",
    wifi: "WiFi",
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

const HERO_IMAGE = "/superior-cabin/hero.jpg";

const GALLERY_IMAGES = [
  "/superior-cabin/gallery-1.jpg",
  "/superior-cabin/gallery-2.jpg",
  "/superior-cabin/gallery-3.jpg",
];

// Mirage effect pairs — identical set used on /cabins so the crossfade reads
// consistently across the site.
const SPA_IMAGE_BEFORE = "/superior-cabin/spa-mirage-before.jpg";
const SPA_IMAGE_AFTER = "/superior-cabin/spa-mirage-after.jpg";
const WELLNESS_IMAGE_BEFORE = "/superior-cabin/wellness-mirage-before.jpg";
const WELLNESS_IMAGE_AFTER = "/superior-cabin/wellness-mirage-after.jpg";

const OTHER_ROOMS = [
  {
    name: { en: "Lakeside Cabin", mn: "Нуурын модон байшин" },
    size: { en: "55 m² / 3 guests", mn: "55 м² / 3 зочин" },
    image: "/superior-cabin/other-lakeside.jpg",
    href: "/cabins",
  },
  {
    name: { en: "The Lodge", mn: "Гол байшин" },
    size: { en: "70 m² / 3 guests", mn: "70 м² / 3 зочин" },
    image: "/superior-cabin/other-lodge.jpg",
    href: "/lodge",
  },
  {
    name: { en: "Grand Peninsula Suite", mn: "Хойг дээрх тусгай хаус" },
    size: { en: "120 m² / 4 guests", mn: "120 м² / 4 зочин" },
    image: "/superior-cabin/other-grand-peninsula.jpg",
    href: "/cabins",
  },
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
  const localePrefix = isMn ? "/mn" : "";
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
    { icon: Ruler, label: t.size },
    { icon: BedDouble, label: t.bed },
    { icon: Mountain, label: t.view },
    { icon: ShowerHead, label: t.shower },
    { icon: Tv, label: t.tv },
    { icon: Wifi, label: t.wifi },
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
          <motion.div
            variants={fadeUpSlow}
            className="md:col-span-3 aspect-[4/3] overflow-hidden bg-white/5 group"
          >
            <img
              src={GALLERY_IMAGES[0]}
              alt={t.title}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
          </motion.div>
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
              <input
                id="sc-checkin"
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none"
              />
            </div>

            <div>
              <label htmlFor="sc-checkout" className="block font-body text-main text-sm mb-1">
                {t.checkOut} <span className="text-main/50">{t.required}</span>
              </label>
              <input
                id="sc-checkout"
                type="date"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                min={checkin}
                className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none"
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
      <section className="border-b border-main/10">
        <motion.div
          initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center"
        >
          <h2 className={`${headlineFont} italic text-3xl md:text-5xl leading-[1.15] text-main`}>
            {t.tagline1}
            <br />
            {t.tagline2}
          </h2>
        </motion.div>
      </section>

      {/* ------------------------------------------------- RELATED STAYS */}
      <section className="border-b border-main/10">
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
              {t.experiencesEyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className={`${headlineFont} italic text-3xl md:text-5xl text-main`}
            >
              {t.experiencesHeading}
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14"
          >
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
          </motion.div>
        </div>
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

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {OTHER_ROOMS.map((room) => (
              <motion.div key={room.name.en} variants={fadeUp}>
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
                    {room.size[isMn ? "mn" : "en"]}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

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
  const reduce = useReducedMotion();
  const tiltRef = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rxSpring = useSpring(rx, { stiffness: 140, damping: 16, mass: 0.4 });
  const rySpring = useSpring(ry, { stiffness: 140, damping: 16, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const max = 6; // degrees — matches `tilt.jquery.js` default intensity-ish
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article variants={fadeUp} className="group">
      <motion.div
        ref={tiltRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={
          reduce
            ? undefined
            : {
                rotateX: rxSpring,
                rotateY: rySpring,
                transformPerspective: 1200,
                transformStyle: "preserve-3d",
              }
        }
        className="block aspect-[5/3] overflow-hidden bg-white/5 mb-6 will-change-transform"
      >
        <Link href={href} className="block h-full w-full">
          <MirageImage
            before={imageBefore}
            after={imageAfter}
            alt={title}
            className="h-full w-full"
          />
        </Link>
      </motion.div>
      <h3 className={`${headlineFont} italic text-2xl md:text-3xl text-main mb-3`}>
        {title}
      </h3>
      <p className="font-body text-main/70 leading-relaxed mb-5">{description}</p>
      <Link
        href={href}
        className="group/cta inline-flex items-center gap-2 font-cta uppercase tracking-[0.28em] text-[11px] text-bark hover:text-main transition-colors"
      >
        <span className="border-b border-bark/40 group-hover/cta:border-main pb-0.5">
          {learnMore}
        </span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-1" />
      </Link>
    </motion.article>
  );
}
