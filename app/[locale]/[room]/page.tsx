"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  ArrowRight,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Minus,
  Mountain,
  Plus,
  Ruler,
  ShowerHead,
  Tv,
  Wifi,
} from "lucide-react";

const SHARED_SPA_IMAGE_BEFORE = "/images/rooms/superior-cabin/spa-mirage-before.webp";
const SHARED_WELLNESS_IMAGE_BEFORE = "/images/rooms/superior-cabin/wellness-mirage-before.webp";

function getDefaultJulyStayDates(): { checkin: string; checkout: string } {
  const now = new Date();
  let year = now.getFullYear();
  const afterWindow = now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 5);
  if (afterWindow) year += 1;
  return { checkin: `${year}-07-01`, checkout: `${year}-07-05` };
}

type Bilingual = { en: string; mn: string };
type RoomConfig = {
  slug: string;
  title: Bilingual;
  eyebrow: Bilingual;
  area: Bilingual;
  guests: Bilingual;
  intro: Bilingual;
  image: string;
  size: Bilingual;
  bed: Bilingual;
  view: Bilingual;
};

const ROOM_CONFIGS: RoomConfig[] = [
  {
    slug: "superior-cabin",
    title: { en: "Superior Cabin", mn: "Superior модон байшин" },
    eyebrow: { en: "Designed for natural living", mn: "Байгальд ойр амьдралд зориулав" },
    area: { en: "30 m²", mn: "30 м²" },
    guests: { en: "2 adults · 1 child", mn: "2 том хүн · 1 хүүхэд" },
    intro: {
      en: "Wood-fired warmth, handwoven textiles and a private forest view define the Superior Cabin. It is a quiet base for couples and small families who want to stay close to the lake and larch line.",
      mn: "Галын зуухны дулаан, гар нэхмэл эдлэл, ойн хувийн харагдац Superior модон байшинг тодорхойлно. Нуур, шинэсэн ойд ойр амрахыг хүссэн хос болон жижиг гэр бүлд тохиромжтой.",
    },
    image: "/images/cabins/room-superior.webp",
    size: { en: "30 m²", mn: "30 м²" },
    bed: { en: "1 Queen Bed", mn: "1 том ор" },
    view: { en: "Forest View", mn: "Ойн харагдац" },
  },
  {
    slug: "triple-traditional-cabin",
    title: { en: "Triple Traditional Cabin", mn: "Гурвалсан уламжлалт модон байшин" },
    eyebrow: { en: "Traditional comfort, refined", mn: "Уламжлалт тав тух, шинэ өнгө аяс" },
    area: { en: "58 m²", mn: "58 м²" },
    guests: { en: "3 adults · 1 child", mn: "3 том хүн · 1 хүүхэд" },
    intro: {
      en: "A classic timber layout with three sleeping spaces, a warm hearth corner, and a sheltered deck for cool evenings by the trees.",
      mn: "Гурван унтлагын орчинтой уламжлалт модон төлөвлөлт, дулаан зуухны булан, ойн сэрүүхэн оройд тохирох хамгаалалттай террастай.",
    },
    image: "/images/cabins/room-triple-traditional.webp",
    size: { en: "58 m²", mn: "58 м²" },
    bed: { en: "3 Sleeping Spaces", mn: "3 унтлагын хэсэг" },
    view: { en: "Forest Deck View", mn: "Ойн террасын харагдац" },
  },
  {
    slug: "lakeside-cabin",
    title: { en: "Lakeside Cabin", mn: "Нуурын модон байшин" },
    eyebrow: { en: "Closer to the waterline", mn: "Усны эрэгт илүү ойр" },
    area: { en: "55 m²", mn: "55 м²" },
    guests: { en: "3 adults · 1 child", mn: "3 том хүн · 1 хүүхэд" },
    intro: {
      en: "A wider shoreline footprint with two sleeping spaces, a reading nook, and a deck that steps directly toward Lake Khuvsgul.",
      mn: "Нуурын эрэгт илүү өргөн талбайтай, хоёр унтлагын орчин, уншлагын булан, Хөвсгөл нуур руу шууд гарах тавцантай.",
    },
    image: "/images/cabins/room-lakeside.webp",
    size: { en: "55 m²", mn: "55 м²" },
    bed: { en: "2 Sleeping Spaces", mn: "2 унтлагын хэсэг" },
    view: { en: "Lake View", mn: "Нуурын харагдац" },
  },
  {
    slug: "triple-electric-cabin",
    title: { en: "Triple Electric Cabin", mn: "Гурвалсан цахилгаан тохижилттой модон байшин" },
    eyebrow: { en: "Family-ready for longer stays", mn: "Урт амралтад зориулсан шийдэл" },
    area: { en: "60 m²", mn: "60 м²" },
    guests: { en: "3 adults · 2 children", mn: "3 том хүн · 2 хүүхэд" },
    intro: {
      en: "Designed for longer family stays with three sleeping zones, electric heating for stable comfort, and a brighter open-plan living area.",
      mn: "Гэр бүлийн урт амралтад зориулсан гурван унтлагын бүс, тогтвортой тав тух өгөх цахилгаан халаалт, илүү саруул нээлттэй зочны хэсэгтэй.",
    },
    image: "/images/cabins/room-triple-electric.webp",
    size: { en: "60 m²", mn: "60 м²" },
    bed: { en: "3 Sleeping Zones", mn: "3 унтлагын бүс" },
    view: { en: "Shoreline View", mn: "Эргийн харагдац" },
  },
  {
    slug: "signature-cabin",
    title: { en: "Signature Cabin", mn: "Онцгой модон байшин" },
    eyebrow: { en: "Our most requested stay", mn: "Хамгийн эрэлттэй сонголт" },
    area: { en: "70 m²", mn: "70 м²" },
    guests: { en: "3 adults · 2 children", mn: "3 том хүн · 2 хүүхэд" },
    intro: {
      en: "A separate living area, deep-soak tub, and private terrace opening onto the larch line make this the most requested room type.",
      mn: "Тусдаа зочны хэсэг, гүн ванн, шинэсэн ой руу нээгдэх хувийн террас нь энэ өрөөг хамгийн эрэлттэй сонголт болгодог.",
    },
    image: "/images/cabins/room-signature.webp",
    size: { en: "70 m²", mn: "70 м²" },
    bed: { en: "2 Bedrooms", mn: "2 унтлагын өрөө" },
    view: { en: "Larch Line View", mn: "Шинэсэн ойн харагдац" },
  },
  {
    slug: "quad-electric-cabin",
    title: { en: "Quad Electric Cabin", mn: "Дөрвөлсөн цахилгаан тохижилттой модон байшин" },
    eyebrow: { en: "Flexible for group travel", mn: "Багаар аялахад тохиромжтой" },
    area: { en: "66 m²", mn: "66 м²" },
    guests: { en: "4 adults · 1 child", mn: "4 том хүн · 1 хүүхэд" },
    intro: {
      en: "A flexible mid-tier option with four sleeping positions, full electric comfort systems, and a larger lounge facing the shoreline.",
      mn: "Дөрвөн унтлагын байрлал, бүрэн цахилгаан тав тухын систем, эрэг рүү харсан том зочны хэсэг бүхий уян хатан дунд ангиллын сонголт.",
    },
    image: "/images/cabins/room-quad-electric.webp",
    size: { en: "66 m²", mn: "66 м²" },
    bed: { en: "4 Sleeping Positions", mn: "4 унтлагын байрлал" },
    view: { en: "Shoreline View", mn: "Эргийн харагдац" },
  },
  {
    slug: "grand-peninsula-suite",
    title: { en: "Grand Peninsula Suite", mn: "Хойг дээрх тусгай хаус" },
    eyebrow: { en: "Our largest private stay", mn: "Хамгийн том хувийн байр" },
    area: { en: "120 m²", mn: "120 м²" },
    guests: { en: "4 adults · 2 children", mn: "4 том хүн · 2 хүүхэд" },
    intro: {
      en: "A standalone suite on its own peninsula with two bedrooms, a wood-panelled living room, and uninterrupted lake views on three sides.",
      mn: "Өөрийн хойг дээр байрлах тусдаа хаус бөгөөд хоёр унтлагын өрөө, модон хавтастай зочны танхим, гурван талаараа тасралтгүй нуурын харагдацтай.",
    },
    image: "/images/cabins/room-grand-peninsula.webp",
    size: { en: "120 m²", mn: "120 м²" },
    bed: { en: "2 Bedrooms", mn: "2 унтлагын өрөө" },
    view: { en: "Panoramic Lake View", mn: "Панорам нуурын харагдац" },
  },
];

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
    avgArea: "Average area",
    guests: "Guests",
    detailsHeading: "At a glance",
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
    aboutCta: "More About Us",
    otherRoomsEyebrow: "Other Stays",
    otherRoomsHeading: "Find your cabin",
    viewAllRooms: "View all accommodations",
  },
  mn: {
    avgArea: "Дундаж талбай",
    guests: "Зочид",
    detailsHeading: "Товч танилцуулга",
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
    aboutCta: "Бидний тухай",
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
  const localePrefix = isMn ? "/mn" : "";
  const reduce = useReducedMotion();

  const room = ROOM_CONFIGS.find((r) => r.slug === params.room);
  if (!room) return null;

  const roomImageBasePath = `/images/rooms/${room.slug}`;
  const heroImage = `${roomImageBasePath}/00.webp`;
  const roomIndex = ROOM_CONFIGS.findIndex((r) => r.slug === room.slug);
  const galleryFallbackImages = useMemo(() => {
    const alternates = ROOM_IMAGE_POOL.filter((image) => image !== room.image);
    if (alternates.length === 0) return [room.image, room.image, room.image, room.image];
    const rotation = roomIndex % alternates.length;
    const rotatedAlternates = [...alternates.slice(rotation), ...alternates.slice(0, rotation)];
    return [room.image, rotatedAlternates[0], rotatedAlternates[1], rotatedAlternates[2]].map(
      (image) => image ?? room.image,
    );
  }, [room.image, roomIndex]);
  const localGalleryImages = useMemo(
    () => ["01", "02", "03", "04"].map((index) => `${roomImageBasePath}/${index}.webp`),
    [roomImageBasePath],
  );

  const otherRooms = ROOM_CONFIGS.filter((r) => r.slug !== room.slug);
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

  const facts = [
    { icon: Ruler, label: room.size[lang] },
    { icon: BedDouble, label: room.bed[lang] },
    { icon: Mountain, label: room.view[lang] },
    { icon: ShowerHead, label: t.shower },
    { icon: Tv, label: t.tv },
    { icon: Wifi, label: t.wifi },
  ];

  useEffect(() => {
    const el = otherRoomsCarouselRef.current;
    if (!el) return;

    // Keep the user in the middle copy to allow seamless looping both ways.
    const loopWidth = el.scrollWidth / 3;
    el.scrollLeft = loopWidth;
  }, [room.slug]);

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
              <p className={`${headlineFont} italic text-2xl md:text-3xl text-main`}>{room.area[lang]}</p>
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
              <input id="room-checkin" type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none" />
            </div>
            <div>
              <label htmlFor="room-checkout" className="block font-body text-main text-sm mb-1">
                {t.checkOut} <span className="text-main/50">{t.required}</span>
              </label>
              <input id="room-checkout" type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} min={checkin} className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none" />
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
                <Link href={`${localePrefix}/${other.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-white/5 mb-5">
                    <img src={other.image} alt={other.title[lang]} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" />
                  </div>
                  <h3 className={`${headlineFont} italic text-2xl md:text-3xl text-main group-hover:text-bark transition-colors`}>{other.title[lang]}</h3>
                  <p className="font-body text-main/60 text-sm mt-2">{`${other.area[lang]} / ${other.guests[lang]}`}</p>
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

function createImageFallbackHandler(fallbackSrc: string) {
  return (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    image.onerror = null;
    image.src = fallbackSrc;
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
      src={src}
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
