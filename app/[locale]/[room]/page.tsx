/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
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
import DateInput from "@/app/components/ui/DateInput";
import {
  ArrowRight,
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Minus,
  Mountain,
  Plus,
  Ruler,
  ShowerHead,
} from "lucide-react";
import { assetUrl } from "@/lib/assetUrl";
import { getCabinCloudbedsFact } from "@/lib/cabinCloudbedsSnapshot";
import {
  CABIN_CATALOG,
  getCabinCatalogEntry,
  getCabinCatalogEntryByRouteSlug,
  type CabinSlug,
} from "@/lib/cabinCatalog";
import { withLocalePath } from "@/lib/localePath";

const MirageImage = dynamic(
  () => import("@/app/components/cabins/MirageImage"),
  { ssr: false },
);

const SHARED_SPA_IMAGE_BEFORE = assetUrl("/images/cabins/spa-mirage-before.webp");
const SHARED_SPA_IMAGE_AFTER = assetUrl("/images/cabins/spa-mirage-after.webp");
const SHARED_WELLNESS_IMAGE_BEFORE = assetUrl("/images/cabins/wellness-mirage-before.webp");
const SHARED_WELLNESS_IMAGE_AFTER = assetUrl("/images/cabins/wellness-mirage-after.webp");

function getDefaultJulyStayDates(): { checkin: string; checkout: string } {
  const now = new Date();
  let year = now.getFullYear();
  const afterWindow = now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 5);
  if (afterWindow) year += 1;
  return { checkin: `${year}-07-01`, checkout: `${year}-07-05` };
}

type Bilingual = { en: string; mn: string };
type RoomConfig = {
  slug: CabinSlug;
  href: string;
  title: Bilingual;
  eyebrow: Bilingual;
  heating: Bilingual;
  roomSize?: Bilingual;
  guests: Bilingual;
  intro: Bilingual;
  image: string;
  gallery: string[];
  bathroom: Bilingual;
  shower: Bilingual;
  bed: Bilingual;
  view: Bilingual;
  equipment: Bilingual[];
};

function getRequiredCabinFact(slug: CabinSlug) {
  const fact = getCabinCloudbedsFact(slug);
  if (!fact) throw new Error(`Missing Cloudbeds cabin fact for slug: ${slug}`);
  return fact;
}

function makeRoomConfig(slug: CabinSlug, image: string): RoomConfig {
  const fact = getRequiredCabinFact(slug);
  const entry = getCabinCatalogEntry(slug);
  if (!entry) throw new Error(`Missing cabin catalog entry for slug: ${slug}`);
  return {
    slug,
    href: entry.href,
    title: { en: fact.name, mn: fact.name },
    eyebrow: { en: "Current Cloudbeds room details", mn: "Cloudbeds-ийн өрөөний мэдээлэл" },
    heating: fact.heatingLabel,
    roomSize: fact.roomSizeLabel,
    guests: fact.guestLabel,
    intro: fact.description,
    image,
    gallery: entry.gallery.map(assetUrl),
    bathroom: fact.bathroomLabel,
    shower: fact.showerLabel,
    bed: fact.bedLabel,
    view: fact.viewLabel,
    equipment: fact.equipmentLabels,
  };
}

const ROOM_CONFIGS: RoomConfig[] = CABIN_CATALOG.map((entry) =>
  makeRoomConfig(entry.slug, assetUrl(entry.cardImage)),
);

const ROOM_IMAGE_POOL = ROOM_CONFIGS.map((config) => config.image);

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const COPY = {
  en: {
    avgArea: "Heating",
    guests: "Guests",
    detailsHeading: "Cloudbeds details",
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
  },
  mn: {
    avgArea: "Халаалт",
    guests: "Зочид",
    detailsHeading: "Cloudbeds-ийн мэдээлэл",
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
  },
} as const;

export default function RoomDetailPage() {
  const locale = useLocale();
  const params = useParams<{ room: string }>();
  const isMn = locale === "mn";
  const lang = isMn ? "mn" : "en";
  const t = COPY[lang];
  const localePrefix = withLocalePath(locale, "/");
  const reduce = useReducedMotion();

  const routeEntry = getCabinCatalogEntryByRouteSlug(params.room);
  const room = routeEntry ? ROOM_CONFIGS.find((r) => r.slug === routeEntry.slug) : undefined;
  const roomSlug = room?.slug ?? "";
  const roomImage = room?.image ?? ROOM_IMAGE_POOL[0];
  const roomIndex = ROOM_CONFIGS.findIndex((r) => r.slug === roomSlug);
  const safeRoomIndex = Math.max(roomIndex, 0);

  const galleryFallbackImages = (() => {
    const alternates = ROOM_IMAGE_POOL.filter((image) => image !== roomImage);
    if (alternates.length === 0) return [roomImage, roomImage, roomImage, roomImage];
    const rotation = safeRoomIndex % alternates.length;
    const rotatedAlternates = [...alternates.slice(rotation), ...alternates.slice(0, rotation)];
    return [roomImage, rotatedAlternates[0], rotatedAlternates[1], rotatedAlternates[2]].map(
      (image) => image ?? roomImage,
    );
  })();
  const heroImage = room?.gallery[0] ?? roomImage;
  const localGalleryImages = (() => {
    const gallery = room?.gallery.length ? room.gallery : [roomImage];
    return [1, 2, 3, 4].map((index) => gallery[index] ?? gallery[0] ?? roomImage);
  })();

  const otherRooms = ROOM_CONFIGS.filter((r) => r.slug !== roomSlug);
  const otherRoomsTrack = useMemo(
    () => [...otherRooms, ...otherRooms, ...otherRooms],
    [otherRooms],
  );
  const headlineFont = isMn ? "font-editorial-mn" : "font-editorial-en";

  const defaults = useMemo(() => getDefaultJulyStayDates(), []);
  const [checkin, setCheckin] = useState(defaults.checkin);
  const [checkout, setCheckout] = useState(defaults.checkout);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const bookingHref = useMemo(() => {
    const qp = new URLSearchParams({ checkin, checkout, adults: `${adults}`, children: `${children}` });
    return `${localePrefix}/booking?${qp.toString()}`;
  }, [checkin, checkout, adults, children, localePrefix]);

  const heroRef = useRef<HTMLElement>(null);
  const otherRoomsCarouselRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const facts = room
    ? [
        ...(room.roomSize ? [{ icon: Ruler, label: room.roomSize[lang] }] : []),
        { icon: BedDouble, label: room.bed[lang] },
        { icon: Bath, label: room.bathroom[lang] },
        { icon: ShowerHead, label: room.shower[lang] },
        { icon: Mountain, label: room.view[lang] },
        ...room.equipment.map((item) => ({ icon: CircleCheck, label: item[lang] })),
      ]
    : [];

  useEffect(() => {
    const el = otherRoomsCarouselRef.current;
    if (!el) return;

    // Keep the user in the middle copy to allow seamless looping both ways.
    const loopWidth = el.scrollWidth / 3;
    el.scrollLeft = loopWidth;
  }, [roomSlug]);

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

  if (!room) {
    return (
      <main
        id="main-content"
        ref={heroRef}
        className="min-h-screen bg-ink text-main flex items-center justify-center px-6 py-28"
      >
        <section className="w-full max-w-2xl text-center">
          <p className="font-cta uppercase tracking-[0.32em] text-[11px] text-main/55">
            {isMn ? "Өрөө олдсонгүй" : "Room not found"}
          </p>
          <h1
            className={`${headlineFont} italic font-normal text-main text-4xl sm:text-5xl md:text-6xl leading-tight mt-5`}
          >
            {isMn ? "Энэ байр олдсонгүй" : "We could not find this stay"}
          </h1>
          <p className="font-body text-main/70 text-base md:text-lg leading-relaxed mt-6">
            {isMn
              ? "Холбоос өөрчлөгдсөн эсвэл энэ өрөө одоогоор нийтлэгдээгүй байна. Бүх байраа үзэх эсвэл огноогоор боломжтой өрөөг шалгана уу."
              : "This link may have changed, or the room is not currently published. Browse all stays or check availability for your dates."}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`${localePrefix}/cabins`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-main/25 px-6 font-cta text-[11px] uppercase tracking-[0.24em] text-main transition-colors hover:border-main hover:bg-main hover:text-ink"
            >
              {isMn ? "Бүх байр үзэх" : "View cabins"}
            </Link>
            <Link
              href={`${localePrefix}/booking`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-main px-6 font-cta text-[11px] uppercase tracking-[0.24em] text-ink transition-colors hover:bg-bark hover:text-main"
            >
              {isMn ? "Боломж шалгах" : "Check availability"}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-ink text-main overflow-hidden">
      <section ref={heroRef} className="relative h-[90vh] min-h-[560px] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={reduce ? undefined : { y: imageY, scale: imageScale }}
          initial={reduce ? { scale: 1 } : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <FallbackImage
            src={heroImage}
            fallbackSrc={room.image}
            alt={room.title[lang]}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/80" />
        <motion.div className="relative z-10 flex h-full items-end" style={reduce ? undefined : { opacity: titleOpacity, y: titleY }}>
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 md:pb-24">
            <p className="font-cta uppercase tracking-[0.32em] text-[11px] sm:text-xs text-main/75 mb-5">{room.eyebrow[lang]}</p>
            <h1 className={`${headlineFont} italic font-normal text-main text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02]`}>{room.title[lang]}</h1>
          </div>
        </motion.div>
      </section>

      <section className="border-b border-main/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-16">
          <ul className="space-y-4 md:border-r md:border-main/10 md:pr-16 shrink-0">
            <li>
              <p className="font-cta uppercase tracking-[0.28em] text-[10px] text-main/50 mb-1">{t.avgArea}</p>
              <p className={`${headlineFont} italic text-2xl md:text-3xl text-main`}>{room.heating[lang]}</p>
            </li>
            <li>
              <p className="font-cta uppercase tracking-[0.28em] text-[10px] text-main/50 mb-1">{t.guests}</p>
              <p className={`${headlineFont} italic text-2xl md:text-3xl text-main`}>{room.guests[lang]}</p>
            </li>
          </ul>
          <p className="font-body text-main/75 text-base md:text-lg leading-relaxed max-w-2xl">{room.intro[lang]}</p>
        </div>
      </section>

      <section className="border-b border-main/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-cta uppercase tracking-[0.32em] text-[10px] text-main/50 mb-8 md:mb-12 text-center">{t.detailsHeading}</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-10 gap-x-6">
            {facts.map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center text-center gap-3 text-main/80">
                <Icon className="w-6 h-6 text-bark" strokeWidth={1.4} />
                <span className="font-body text-sm tracking-wide">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-main/10">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6"
        >
          <div className="md:col-span-3 grid grid-cols-1 gap-4 md:gap-6">
            <motion.div variants={fadeUp} className="aspect-[4/3] overflow-hidden bg-white/5 group">
              <img
                src={localGalleryImages[0]}
                onError={createImageFallbackHandler(galleryFallbackImages[0])}
                alt={room.title[lang]}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
            <motion.div variants={fadeUp} className="aspect-[4/3] overflow-hidden bg-white/5 group">
              <img
                src={localGalleryImages[1]}
                onError={createImageFallbackHandler(galleryFallbackImages[1])}
                alt={room.title[lang]}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 gap-4 md:gap-6">
            <motion.div variants={fadeUp} className="aspect-[4/3] md:aspect-auto overflow-hidden bg-white/5 group">
              <img
                src={localGalleryImages[2]}
                onError={createImageFallbackHandler(galleryFallbackImages[2])}
                alt={room.title[lang]}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
            <motion.div variants={fadeUp} className="aspect-[4/3] md:aspect-auto overflow-hidden bg-white/5 group">
              <img
                src={localGalleryImages[3]}
                onError={createImageFallbackHandler(galleryFallbackImages[3])}
                alt={room.title[lang]}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="border-b border-main/10">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 text-center">
          <h2 className={`${headlineFont} italic text-4xl md:text-5xl text-main mb-3`}>{t.bookHeading}</h2>
          <p className="font-body text-main/50 text-xs mb-10">{t.bookSubtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-left">
            <div>
              <label htmlFor="room-checkin" className="block font-body text-main text-sm mb-1">
                {t.checkIn} <span className="text-main/50">{t.required}</span>
              </label>
              <DateInput id="room-checkin" value={checkin} onChange={setCheckin} className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none !rounded-none !px-0" />
            </div>
            <div>
              <label htmlFor="room-checkout" className="block font-body text-main text-sm mb-1">
                {t.checkOut} <span className="text-main/50">{t.required}</span>
              </label>
              <DateInput id="room-checkout" value={checkout} onChange={setCheckout} min={checkin} className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none !rounded-none !px-0" />
            </div>
            <div>
              <span id="room-adults" className="block font-body text-main text-sm mb-1">{t.adults}</span>
              <Stepper value={adults} min={1} max={20} onChange={setAdults} ariaLabelledBy="room-adults" />
            </div>
            <div>
              <span id="room-children" className="block font-body text-main text-sm mb-1">{t.children}</span>
              <Stepper value={children} min={0} max={10} onChange={setChildren} ariaLabelledBy="room-children" />
            </div>
          </div>
          <div className="mt-10">
            <Link href={bookingHref} className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-main text-ink font-cta uppercase tracking-[0.28em] text-xs hover:bg-main/90 transition-colors">
              {t.bookCta}
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

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
              src={SHARED_WELLNESS_IMAGE_BEFORE}
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
              src={SHARED_SPA_IMAGE_BEFORE}
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
              src={heroImage}
              onError={createImageFallbackHandler(room.image)}
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
              src={localGalleryImages[3]}
              onError={createImageFallbackHandler(galleryFallbackImages[3])}
              alt=""
              className="h-full w-full object-cover opacity-55 saturate-[0.65]"
            />
          </ImageReveal>

          <img
            src={heroImage}
            onError={createImageFallbackHandler(room.image)}
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

      <section className="border-b border-main/10">
        <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-14">
          <div className="text-center">
            <p className="font-cta uppercase tracking-[0.32em] text-[10px] text-bark mb-4">
              {t.experiencesEyebrow}
            </p>
            <h2 className={`${headlineFont} italic text-3xl md:text-5xl text-main`}>
              {t.experiencesHeading}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <ExperienceCard
            imageBefore={SHARED_SPA_IMAGE_BEFORE}
            imageAfter={SHARED_SPA_IMAGE_AFTER}
            title={t.spaTitle}
            href={`${localePrefix}/wellness`}
            headlineFont={headlineFont}
          />
          <ExperienceCard
            imageBefore={SHARED_WELLNESS_IMAGE_BEFORE}
            imageAfter={SHARED_WELLNESS_IMAGE_AFTER}
            title={t.wellnessTitle}
            body={t.wellnessDesc}
            learnMore={t.learnMore}
            href={`${localePrefix}/wellness`}
            headlineFont={headlineFont}
          />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="text-center mb-14">
            <p className="font-cta uppercase tracking-[0.32em] text-[10px] text-bark mb-4">{t.otherRoomsEyebrow}</p>
            <h2 className={`${headlineFont} italic text-3xl md:text-5xl text-main`}>{t.otherRoomsHeading}</h2>
          </div>
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
            <div
              ref={otherRoomsCarouselRef}
              onScroll={normalizeOtherRoomsScroll}
              className="flex gap-6 md:gap-8 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {otherRoomsTrack.map((other, idx) => (
                <div
                  key={`${other.slug}-${idx}`}
                  data-room-card
                  className="snap-start shrink-0 w-[84%] sm:w-[56%] lg:w-[32%]"
                >
                <Link href={`${localePrefix}${other.href}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-white/5 mb-5">
                    <img src={other.image} alt={other.title[lang]} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" />
                  </div>
                  <h3 className={`${headlineFont} italic text-2xl md:text-3xl text-main group-hover:text-bark transition-colors`}>{other.title[lang]}</h3>
                  <p className="font-body text-main/60 text-sm mt-2">{`${other.heating[lang]} / ${other.guests[lang]}`}</p>
                </Link>
              </div>
            ))}
            </div>
          </div>
          <div className="text-center mt-14">
            <Link href={`${localePrefix}/cabins`} className="group inline-flex items-center gap-2 font-cta uppercase tracking-[0.28em] text-[11px] text-main/70 hover:text-main transition-colors">
              <span className="border-b border-main/30 group-hover:border-main pb-0.5">{t.viewAllRooms}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
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

function createImageFallbackHandler(fallbackSrc: string) {
  const resolved = assetUrl(fallbackSrc);
  return (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    image.onerror = null;
    image.src = resolved;
  };
}

function FallbackImage({
  src,
  fallbackSrc,
  alt,
  className,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className: string;
}) {
  return (
    <img
      src={assetUrl(src)}
      alt={alt}
      className={className}
      onError={createImageFallbackHandler(fallbackSrc)}
    />
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
    <div role="group" aria-labelledby={ariaLabelledBy} className="flex items-center justify-between border border-main/20 px-1.5 py-1">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors" aria-label="Decrease">
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="text-main font-body text-sm" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors" aria-label="Increase">
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
