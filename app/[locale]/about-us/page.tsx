"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { X, Play, Pause } from "lucide-react";
import { AboutHeroLoupe } from "@/app/components/about-us/AboutHeroLoupe";

const content = {
  en: {
    heroTitle: "Our Story",
    heroCaption:
      "The legend of the source—and a family sanctuary in the Khuvsgul taiga.",
    historySectionLabel: "A History Carved in Timber",
    historyScrollHint: "Scroll the years",
    history: [
      {
        year: "The 1990s",
        title: "The Auction",
        body: 'As Mongolia transitioned to capitalism, a local "Khatgal boy"—and future Member of Parliament—purchased a pioneer camp at auction. The price paid funded the province’s civil servants for a full year, cementing our investment in Khuvsgul\'s survival.',
      },
      {
        year: "The 2000s",
        title: "The Early Years",
        body: "We built a sanctuary from the ground up, carrying water by yak and living by candlelight through harsh winters.",
      },
      {
        year: "2009",
        title: "The Royal Ultimatum",
        body: "Our reputation soon preceded our infrastructure. When a visiting Middle Eastern royal insisted on staying despite our lack of indoor plumbing, we didn't hesitate. In a true display of northern hustle, we constructed flush toilets and running water from scratch just in time to welcome him.",
      },
      {
        year: "The 2010s",
        title: "Conservation",
        body: "We became a quiet retreat for global diplomats and established an on-site conservation program to protect the endangered Siberian musk deer.",
      },
      {
        year: "2022",
        title: "A New Era",
        body: "Dalai Eej passed to its third generation of female-led family stewardship, continuing our mission to protect and share the North.",
      },
    ],
    pillarsTitle: "The 6 Pillars",
    pillars: [
      {
        num: "01",
        title: "A Legacy of the Taiga",
        body: "We are a three-generation local family offering an authentic gateway into the North.",
      },
      {
        num: "02",
        title: "Built for the Wilderness",
        body: "Our seasonal timber cabins blend rustic immersion with refined comfort.",
      },
      {
        num: "03",
        title: "Sincere Northern Hospitality",
        body: "Our local team delivers intuitive, warm-hearted Mongolian care.",
      },
      {
        num: "04",
        title: "Effortless Planning",
        body: "We ensure your booking and local arrangements are seamless and secure.",
      },
      {
        num: "05",
        title: "Protectors of the Blue Pearl",
        body: "We pledge 10% of our net profits directly to local Khatgal community development.",
      },
      {
        num: "06",
        title: "A Vibrant Crossroads",
        body: "We are a gathering place where global explorers and locals share stories under the starlight.",
      },
    ],
    founderSectionLabel: "Founder's Note",
    founderHeadline: "A Note from the Family",
    founderListenLabel: "Listen",
    founderBody: [
      "Khuvsgul is the life force that raised us. Our founder wrote this song to honor the “Deep Blue Mother Ocean”—a pure spring that provides for the Mongolian North. Today, our family works side-by-side to share the taiga's profound silence and protective energy with you. Welcome to our home.",
      "— The Family at Dalai Eej Resort",
    ],
    founderClosing:
      "From the heart of our founder at Dalai Eej Resort—our family welcomes you to our northern home.",
    heroImageAlt: "Dalai Eej Resort",
    heroExpandImage: "View image full screen",
    heroCloseFullscreen: "Close full screen",
  },
  mn: {
    heroTitle: "Бидний тухай",
    heroCaption:
      "Рашааны домгоос эхтэй, Хөвсгөлийн тайгад ургасан гэр бүлийн голомт.",
    historySectionLabel: "Модоор бичигдсэн бидний түүх",
    historyScrollHint: "Он цагийг гүйлгэж үзэх",
    history: [
      {
        year: "1990-ээд он",
        title: "Дуудлага худалдаа",
        body: 'Нийгмийн шилжилтийн он жилүүдэд хожим УИХ-ын гишүүн болсон "Хатгалын хүү" пионерийн зусланг дуудлага худалдаагаар худалдан авсан. Тэр хөрөнгө аймгийн төрийн албан хаагчдын нэг жилийн цалинг дааж, бидний Хөвсгөлтэй холбогдох амлалтыг эхлүүлсэн түүхтэй.',
      },
      {
        year: "2000-аад он",
        title: "Эхэн үе",
        body: "Сарлагаар ус зөөж, лааны гэрэлд өвөлжсөөр энэ газрыг бид тэгээс нь босгосон.",
      },
      {
        year: "2009 он",
        title: "Хүндэт зочны сорилт",
        body: "Ойрхи Дорнодын хааны угсааны зочин дэд бүтэц бүрэн биш байхад ч заавал манайд бууна гэж шийдсэн. Тэгэхэд бид богино хугацаанд цэвэр ус, дотор ариун цэврийн шийдлээ бүрдүүлж, нэр төртэйгөөр угтан авсан.",
      },
      {
        year: "2010-аад он",
        title: "Байгаль хамгаалал",
        body: "Бид олон улсын дипломатчид, хүндэт зочдын нам гүм амрах цэг болж, нэн ховордсон Сибирийн хүдрийн хамгааллын ажлыг орон нутагтайгаа хамт эхлүүлсэн.",
      },
      {
        year: "2022 он",
        title: "Шинэ эрин үе",
        body: '"Далай ээж" гэр бүлийн гурав дахь үеийн, эмэгтэйчүүдийн манлайлалтай удирдлагад шилжиж, умардын байгалиа хайрлан хамгаалах зорилгоо улам бататгасан.',
      },
    ],
    pillarsTitle: "Бидний 6 тулгуур",
    pillars: [
      {
        num: "01",
        title: "Тайгын өв уламжлал",
        body: "Бид бол Хөвсгөлийн амьд ахуй, үнэт уламжлалаа гурван үеэрээ авч явж буй нутгийн гэр бүл.",
      },
      {
        num: "02",
        title: "Байгальд ууссан хийц",
        body: "Манай модон өргөө, байшингууд байгалийн өнгө төрхтэй зохицсон атлаа тав тухыг бүрэн мэдрүүлнэ.",
      },
      {
        num: "03",
        title: "Хоймор нутгийн зочломтгой зан",
        body: "Манай хамт олон хүнийг хүндэлсэн, дулаан уур амьсгалтай үйлчилгээг сэтгэл гарган хүргэдэг.",
      },
      {
        num: "04",
        title: "Хялбар төлөвлөлт",
        body: "Захиалгаас эхлээд ирж очих зохион байгуулалт хүртэл бүхнийг ойлгомжтой, найдвартай байлгадаг.",
      },
      {
        num: "05",
        title: "Хөх сувдын хамгаалагчид",
        body: "Бид цэвэр ашгийнхаа 10 хувийг Хатгалын орон нутгийн хөгжил, санаачилгад тогтмол зориулдаг.",
      },
      {
        num: "06",
        title: "Амьд харилцааны уулзвар",
        body: "Энд дэлхийн өнцөг булангийн аялагчид, нутгийн хүмүүс нэг галын дэргэд түүхээ хуваалцдаг.",
      },
    ],
    founderSectionLabel: "Үүсгэн байгуулагчийн зурвас",
    founderHeadline: "Гэр бүлийн мэндчилгээ",
    founderListenLabel: "Сонсох",
    founderBody: [
      "Хөвсгөл бол биднийг өсгөсөн амьдралын ундарга. Үүсгэн байгуулагч маань энэ дуугаа \"Гүн цэнхэр эх далай\"-д, Монголын хоймрыг тэтгэдэг ариун рашаанд зориулж туурвисан. Өнөөдөр бид гэр бүлээрээ тайгын аниргүй амгалан, хамгаалан тэтгэх тэр л эрчийг тантай хуваалцаж байна. Манайд тавтай морил.",
      "— Далай ээж ресортын гэр бүл",
    ],
    founderClosing:
      "Үүсгэн байгуулагчийн сэтгэлийн үгтэй хамт бидний гэр бүл таныг Хөвсгөлийн хойморт халуун дотноор угтана.",
    heroImageAlt: "Далай ээж ресорт",
    heroExpandImage: "Зургийг бүтэн дэлгэцээр харах",
    heroCloseFullscreen: "Хаах",
  },
};

const HERO_IMAGE_SRC = "/images/about-hero.webp";
const historyCardTextures = [
  "/images/about-us/decorations/1990s.png",
  "/images/about-us/decorations/2000s.png",
  "/images/about-us/decorations/2009.png",
  "/images/about-us/decorations/2010s.png",
  "/images/about-us/decorations/2022.png",
];

// Scrapbook visuals for the timeline—one entry per era (5 total). Assets live in
// `public/images/about-us/images/` using descriptive timeline names (primary and
// optional secondary by era). Rotations can be tweaked; copy lives in
// `content[locale].history`.
const historyVisuals: Array<{
  primary: { src: string; rotate: string; caption?: { en: string; mn: string } };
  background?: {
    src: string;
    rotate?: string;
    positionClass?: string;
    sizeClass?: string;
  };
  secondary?: {
    src: string;
    rotate: string;
    overlayOnPrimary?: boolean;
    overlayOnCard?: boolean;
    overlayPositionClass?: string;
    overlaySizeClass?: string;
    /** Multiplier on 5.25rem / 6rem base; default 1.08 */
    overlayScaleFromOriginal?: number;
  };
  annotation?: { en: string; mn: string };
}> = [
  {
    primary: {
      src: "/images/about-us/images/timeline-1990s-primary.png",
      rotate: "-rotate-[3deg]",
      caption: { en: "Khatgal's son.", mn: "Хатгалын хүү." },
    },
    background: {
      src: "/images/about-us/images/timeline-1990s-background.png",
      rotate: "-rotate-[1deg]",
      positionClass: "top-[-0.2rem] left-[-1.35rem] md:top-[-0.45rem] md:left-[-1.75rem]",
      sizeClass: "w-[21rem] md:w-[23rem] h-[39rem] md:h-[41rem]",
    },
    secondary: { src: "/images/about-us/images/timeline-1990s-secondary.png", rotate: "rotate-[4deg]" },
    annotation: {
      en: "Auction day\u2014a year of civil service wages.",
      mn: "Дуудлагын өдөр — жилийн цалин.",
    },
  },
  {
    primary: {
      src: "/images/about-us/images/timeline-2000s-primary.png",
      rotate: "rotate-[2deg]",
      caption: { en: "First winters.", mn: "Анхны өвлүүд." },
    },
    background: {
      src: "/images/about-us/images/timeline-2000s-background.jpeg",
      rotate: "rotate-[0.8deg]",
      positionClass: "top-[-0.2rem] left-[-1.3rem] md:top-[-0.45rem] md:left-[-1.7rem]",
      sizeClass: "w-[21rem] md:w-[23rem] h-[39rem] md:h-[41rem]",
    },
    secondary: {
      src: "/images/about-us/images/timeline-2000s-secondary.png",
      rotate: "rotate-[4deg]",
      overlayOnPrimary: true,
      overlayOnCard: true,
      overlayPositionClass: "bottom-7 right-3 md:bottom-8 md:right-4",
      overlaySizeClass: "h-[7.56rem] md:h-[8.64rem] w-[7.56rem] md:w-[8.64rem]",
      overlayScaleFromOriginal: 1.12,
    },
    annotation: {
      en: "Water by yak, light by candle.",
      mn: "Сарлагаар ус, лааны гэрэл.",
    },
  },
  {
    primary: {
      src: "/images/about-us/images/timeline-2009-primary.png",
      rotate: "-rotate-[2deg]",
      caption: { en: "Middle Eastern royalty", mn: "Ойрхи Дорнодын хаад" },
    },
    background: {
      src: "/images/about-us/images/timeline-2009-background.png",
      rotate: "-rotate-[1.5deg]",
      positionClass: "top-[-0.25rem] left-[-1.5rem] md:top-[-0.5rem] md:left-[-1.9rem]",
      sizeClass: "w-[21rem] md:w-[23rem] h-[39rem] md:h-[41rem]",
    },
    annotation: {
      en: "Plumbing in two weeks flat.",
      mn: "Хоёр долоо хоногт нойл боссон.",
    },
  },
  {
    primary: {
      src: "/images/about-us/images/timeline-2010s-primary.png",
      rotate: "rotate-[3deg]",
      caption: { en: "Musk deer.", mn: "Хүдэр." },
    },
    background: {
      src: "/images/about-us/images/timeline-2010s-background.png",
      rotate: "rotate-[1deg]",
      positionClass: "top-[-0.2rem] left-[-1.3rem] md:top-[-0.45rem] md:left-[-1.7rem]",
      sizeClass: "w-[21rem] md:w-[23rem] h-[39rem] md:h-[41rem]",
    },
    secondary: {
      src: "/images/about-us/images/timeline-2010s-secondary.png",
      rotate: "-rotate-[3deg]",
      overlayOnPrimary: true,
      overlayOnCard: true,
      overlayPositionClass: "bottom-8 left-3 md:bottom-10 md:left-4",
      overlaySizeClass: "h-[7.04rem] md:h-[8.06rem] w-[7.04rem] md:w-[8.06rem]",
    },
    annotation: {
      en: "Conservation program \u2014\u2192",
      mn: "Хамгааллын хөтөлбөр \u2014\u2192",
    },
  },
  {
    primary: {
      src: "/images/about-us/images/timeline-2022-primary.png",
      rotate: "-rotate-[4deg]",
      caption: { en: "Third generation.", mn: "Гурав дахь үе." },
    },
    background: {
      src: "/images/about-us/images/timeline-2022-background.jpg",
      rotate: "-rotate-[0.8deg]",
      positionClass: "top-[-0.15rem] left-[-1.25rem] md:top-[-0.4rem] md:left-[-1.65rem]",
      sizeClass: "w-[21rem] md:w-[23rem] h-[39rem] md:h-[41rem]",
    },
    secondary: { src: "/images/about-us/images/timeline-2022-secondary.png", rotate: "rotate-[2deg]" },
    annotation: { en: "...with you.", mn: "...тантай хамт." },
  },
];

function CampfireMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* sparks */}
      <path d="M32 6v3" />
      <path d="M26 8l1.5 2.5" />
      <path d="M38 8l-1.5 2.5" />
      <path d="M22 12l2 1.5" />
      <path d="M42 12l-2 1.5" />
      {/* flame */}
      <path d="M32 14c3.5 4.5 6 7.8 6 12a6 6 0 0 1-12 0c0-2.3 1-4.1 2.4-5.3-.3 1.3-.1 2.6.6 3.6.6-3.4 1.6-6.7 3-10.3z" />
      {/* inner flame */}
      <path d="M32 22c1.8 2.4 3 4 3 6a3 3 0 0 1-6 0c0-1.3.6-2.3 1.4-2.9 0 .8.2 1.4.6 1.9.3-1.8.6-3.3 1-5z" />
      {/* logs */}
      <path d="M18 44l28 8" />
      <path d="M18 52l28-8" />
      <path d="M22 42l4 12" />
      <path d="M42 42l-4 12" />
    </svg>
  );
}

function SectionAccent({
  className = "py-1 md:py-2",
  width = "w-20 md:w-24",
  invert = false,
  src = "/images/about-us/decorations/accent.svg",
}: {
  className?: string;
  width?: string;
  invert?: boolean;
  src?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex justify-center items-center ${className}`}
    >
      <img
        src={src}
        alt=""
        className={`${width} h-auto opacity-70 select-none pointer-events-none ${
          invert ? "invert brightness-0 opacity-60" : ""
        }`}
        draggable={false}
      />
    </div>
  );
}

function TimelineCard({
  index,
  scrollRootRef,
  reduceMotion,
  className,
  children,
}: {
  index: number;
  scrollRootRef: React.RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  // Observe intersection with the horizontal scroll container as root so cards
  // fade/slide in as they enter the visible horizontal area.
  const inView = useInView(ref, {
    root: scrollRootRef as React.RefObject<Element>,
    amount: 0.25,
    margin: "0px -8% 0px 0px",
    once: true,
  });

  return (
    <motion.article
      ref={ref}
      initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      animate={
        reduceMotion || inView || index === 0
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: 40 }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.article>
  );
}

function FounderAudio({ label, src }: { label: string; src: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      // Start at 0:20 on the first play, then keep normal resume behavior.
      if (audioRef.current.currentTime < 0.1) {
        audioRef.current.currentTime = 20;
      }
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="flex justify-center mt-10 md:mt-14">
      <button
        onClick={toggle}
        className="flex items-center gap-3 px-6 py-3 rounded-full border border-ink/20 bg-ink/[0.03] hover:bg-ink/[0.08] transition-colors text-ink font-editorial-mn text-lg md:text-xl tracking-wide"
      >
        {playing ? <Pause className="w-5 h-5 opacity-70" /> : <Play className="w-5 h-5 opacity-70" />}
        <span>{label}</span>
      </button>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onEnded={() => setPlaying(false)}
        className="hidden"
      />
    </div>
  );
}

export default function AboutUsPage() {
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const isMn = locale === "mn";
  const t = isMn ? content.mn : content.en;
  const historyScrollRef = useRef<HTMLDivElement | null>(null);
  const historyHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const [heroFullscreenOpen, setHeroFullscreenOpen] = useState(false);
  const [portalMounted, setPortalMounted] = useState(false);

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  useEffect(() => {
    if (!heroFullscreenOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHeroFullscreenOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [heroFullscreenOpen]);

  // Translate vertical wheel input into horizontal scroll on the timeline.
  // The hijack only activates once the section heading has settled near the
  // top of the viewport. At each edge (start and end) we absorb a little wheel
  // delta before either starting the horizontal scroll or releasing to the
  // page, giving a tactile "delay" at the beginning and end of the cards.
  useEffect(() => {
    const el = historyScrollRef.current;
    if (!el) return;

    const state = { released: false, buffer: 0 };
    const EDGE_DELAY = 300; // accumulated |deltaY| required to cross an edge

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      const heading = historyHeadingRef.current;
      if (!heading) return;
      const rect = heading.getBoundingClientRect();
      const threshold = Math.min(140, window.innerHeight * 0.15);

      // Heading hasn't settled into position yet (user still approaching from
      // below) — let the page scroll and reset state.
      if (rect.top > threshold) {
        state.released = false;
        state.buffer = 0;
        return;
      }
      // Heading has fully scrolled above the viewport — we're past the
      // section, don't hijack anymore and allow re-entry later.
      if (rect.bottom < 0) {
        state.released = false;
        state.buffer = 0;
        return;
      }
      // Already released past this section in the current pass — don't
      // re-hijack while the heading is still inside the activation zone.
      if (state.released) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const delta = e.deltaY;
      const current = el.scrollLeft;
      const atStart = current <= 0;
      const atEnd = current >= maxScroll - 1;

      if (atStart || atEnd) {
        // Reset buffer when the user reverses direction at the edge.
        if (state.buffer !== 0 && Math.sign(state.buffer) !== Math.sign(delta)) {
          state.buffer = 0;
        }
        state.buffer += delta;
        if (Math.abs(state.buffer) < EDGE_DELAY) {
          // Still absorbing—hold position, don't move page or cards.
          e.preventDefault();
          return;
        }
        state.buffer = 0;
        const wantsToExit =
          (atStart && delta < 0) || (atEnd && delta > 0);
        if (wantsToExit) {
          state.released = true;
          return; // let the page scroll vertically
        }
        // Threshold crossed while entering the cards—start moving them.
        e.preventDefault();
        el.scrollLeft = current + delta;
        return;
      }

      // In the middle of the timeline—direct 1:1 scroll, no resistance.
      state.buffer = 0;
      e.preventDefault();
      el.scrollLeft = current + delta;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <>
    <main
      id="main-content"
      className="bg-main text-ink min-h-screen"
      style={{
        backgroundImage:
          'url("/images/about-us/decorations/paper.jpg")',
        backgroundRepeat: "repeat",
        backgroundSize: "720px 720px",
        backgroundBlendMode: "multiply",
      }}
    >
      <section className="pt-40 md:pt-56 lg:pt-64 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="mx-auto w-max max-w-full flex flex-col items-stretch gap-2 md:gap-3">
              <h1 className="font-editorial-mn text-4xl md:text-6xl text-ink text-center leading-tight tracking-wide">
                {t.heroTitle}
              </h1>
              <SectionAccent
                src="/images/about-us/decorations/accent-2.svg"
                className="py-0"
                width="w-[min(58%,22rem)] min-w-[10.5rem] md:min-w-[13rem] mx-auto"
              />
            </div>
            <AboutHeroLoupe
              src={HERO_IMAGE_SRC}
              alt={t.heroImageAlt}
              expandLabel={t.heroExpandImage}
              onRequestFullscreen={() => setHeroFullscreenOpen(true)}
              className="mt-16 md:mt-24 lg:mt-28"
            />
            <p className="text-center mt-8 font-body text-sm md:text-base italic text-ink/60 tracking-wide max-w-2xl mx-auto leading-relaxed">
              {t.heroCaption}
            </p>
          </motion.div>
        </div>
      </section>

      <SectionAccent />

      <section className="py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="flex items-end justify-between gap-6 mb-2"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-6 flex-1">
              <h2
                ref={historyHeadingRef}
                className="font-editorial-mn text-4xl md:text-6xl text-ink leading-tight whitespace-nowrap"
              >
                {t.historySectionLabel}
              </h2>
              <div className="h-px flex-1 bg-ink/15" />
            </div>
            <span className="hidden md:inline-flex items-center gap-2 font-body italic text-sm text-ink/55 whitespace-nowrap">
              {t.historyScrollHint}
              <span aria-hidden>→</span>
            </span>
          </motion.div>
        </div>

        <div
          ref={historyScrollRef}
          className="mt-12 md:mt-16 w-full overflow-x-auto overflow-y-visible overscroll-x-contain scrollbar-hide"
        >
          <div className="flex flex-row items-start gap-3 md:gap-4 w-max pl-6 pr-6 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pr-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pt-6 pb-16">
            {t.history.map((item, i) => {
              const visuals = historyVisuals[i];
              const cardTexture = historyCardTextures[i];
              const cardTopPadding = i === 0 ? "pt-6 md:pt-7" : "pt-20 md:pt-24";
              const shiftLeftClass = i === 1 || i === 3 ? "-translate-x-4 md:-translate-x-5" : "";
              const primaryPositionClass =
                i === 0
                  ? "top-2 md:top-3"
                  : i === 1
                  ? "top-8 md:top-9"
                  : i === 2
                  ? "top-9 md:top-10"
                  : i === 3
                  ? "top-8 md:top-10"
                  : "top-7 md:top-9";
              const caption = visuals?.primary.caption?.[isMn ? "mn" : "en"];
              const annotation = visuals?.annotation?.[isMn ? "mn" : "en"];
              const behindSecondary =
                visuals?.secondary && !visuals.secondary.overlayOnPrimary
                  ? visuals.secondary
                  : null;
              const secondaryOverlay =
                visuals?.secondary?.overlayOnPrimary && !visuals.secondary.overlayOnCard
                  ? visuals.secondary
                  : null;
              const secondaryCardOverlay = visuals?.secondary?.overlayOnCard
                ? visuals.secondary
                : null;
              return (
                <TimelineCard
                  key={item.title}
                  index={i}
                  scrollRootRef={historyScrollRef}
                  reduceMotion={!!reduceMotion}
                  className={`snap-center shrink-0 relative w-[min(92vw,20rem)] md:w-[23rem] h-[39rem] md:h-[41rem] ${shiftLeftClass}`}
                >
                  {/* Era-specific scene image behind the note card */}
                  {visuals?.background ? (
                    <div
                      className={`absolute z-0 pointer-events-none select-none ${
                        visuals.background.positionClass ??
                        "top-[-0.25rem] left-[-1.4rem] md:top-[-0.5rem] md:left-[-1.8rem]"
                      } ${visuals.background.rotate ?? ""} ${
                        visuals.background.sizeClass ?? "w-[20.8rem] md:w-[22.8rem] h-[39rem] md:h-[41rem]"
                      }`}
                      aria-hidden
                    >
                      <img
                        src={visuals.background.src}
                        alt=""
                        className="w-full h-full object-cover opacity-[0.96]"
                        draggable={false}
                      />
                    </div>
                  ) : null}

                  {/* Secondary polaroid (tucked behind primary) */}
                  {behindSecondary ? (
                    <div
                      className={`absolute top-2 left-2 z-20 ${behindSecondary.rotate} w-36 md:w-40 overflow-hidden rounded-sm`}
                      aria-hidden
                    >
                      <img src={behindSecondary.src} alt="" className="w-full h-36 md:h-40 object-contain" />
                    </div>
                  ) : null}

                  {/* Primary photo + caption */}
                  {visuals ? (
                    <div
                      className={`absolute z-30 ${primaryPositionClass} ${
                        behindSecondary ? "left-24 md:left-28" : "left-5 md:left-7"
                      } ${visuals.primary.rotate} w-52 md:w-56 flex flex-col`}
                    >
                      <div className="overflow-hidden rounded-sm relative">
                        <img src={visuals.primary.src} alt={item.title} className="w-full h-52 md:h-56 object-contain" />
                        {caption ? (
                          <p
                            className="absolute left-2 right-2 bottom-2 z-20 font-editorial-mn text-sm md:text-base text-ink/85 leading-tight text-center px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.16)] backdrop-blur-[1px]"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.52)",
                              border: "1px solid rgba(255,255,255,0.38)",
                              clipPath:
                                "polygon(2% 20%, 8% 7%, 17% 12%, 27% 5%, 38% 10%, 51% 4%, 63% 11%, 76% 6%, 89% 12%, 97% 25%, 95% 80%, 88% 93%, 77% 88%, 66% 95%, 54% 90%, 43% 96%, 31% 89%, 20% 95%, 10% 87%, 3% 73%)",
                            }}
                          >
                            {caption}
                          </p>
                        ) : null}
                        {secondaryOverlay ? (
                          <div
                            className={`absolute z-10 ${
                              secondaryOverlay.overlayOnCard
                                ? "bottom-2 left-2"
                                : secondaryOverlay.overlayPositionClass ?? "bottom-2 left-2"
                            } ${secondaryOverlay.rotate} overflow-hidden rounded-sm ${
                              secondaryOverlay.overlayScaleFromOriginal === 1.12
                                ? "w-[5.88rem] md:w-[6.72rem]"
                                : "w-[5.67rem] md:w-[6.48rem]"
                            }`}
                            aria-hidden
                          >
                            <img
                              src={secondaryOverlay.src}
                              alt=""
                              className={`w-full object-contain ${
                                secondaryOverlay.overlaySizeClass
                                  ? secondaryOverlay.overlaySizeClass
                                  : secondaryOverlay.overlayScaleFromOriginal === 1.12
                                  ? "h-[5.88rem] md:h-[6.72rem]"
                                  : "h-[5.67rem] md:h-[6.48rem]"
                              }`}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {/* Aged-paper note card */}
                  <div
                    className={`absolute bottom-0 z-10 ${i % 2 === 0 ? "left-0 md:left-1 rotate-[-1deg]" : "right-0 md:right-1 rotate-[1.5deg]"} w-[16rem] md:w-[17rem] h-[28rem] md:h-[29rem] bg-[#efe3c9] px-6 ${cardTopPadding} pb-6 md:px-7 md:pb-7 flex flex-col`}
                    style={{
                      backgroundImage: cardTexture ? `url("${cardTexture}")` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <p className="font-body italic text-[0.7rem] md:text-xs uppercase tracking-[0.2em] text-ink/55 mb-1">
                      {item.year}
                    </p>
                    <h3 className="font-editorial-mn text-2xl md:text-[1.7rem] text-ink mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm md:text-[0.95rem] leading-[1.65] text-ink/80">
                      {item.body}
                    </p>
                    {annotation ? (
                      <p
                        className={`mt-auto pt-4 font-editorial-mn text-base md:text-lg text-ink/65 leading-tight ${
                          i % 2 === 0 ? "text-right rotate-[-2deg]" : "text-left rotate-[2deg]"
                        }`}
                      >
                        {annotation}
                      </p>
                    ) : null}
                  </div>
                  {secondaryCardOverlay ? (
                    <div
                      className={`absolute z-40 ${secondaryCardOverlay.overlayPositionClass ?? "bottom-3 right-3"} ${secondaryCardOverlay.rotate} overflow-hidden rounded-sm`}
                      aria-hidden
                    >
                      <img
                        src={secondaryCardOverlay.src}
                        alt=""
                        className={`w-full object-contain ${
                          secondaryCardOverlay.overlaySizeClass
                            ? secondaryCardOverlay.overlaySizeClass
                            : secondaryCardOverlay.overlayScaleFromOriginal === 1.12
                            ? "h-[5.88rem] md:h-[6.72rem] w-[5.88rem] md:w-[6.72rem]"
                            : "h-[5.67rem] md:h-[6.48rem] w-[5.67rem] md:w-[6.48rem]"
                        }`}
                      />
                    </div>
                  ) : null}

                </TimelineCard>
              );
            })}
          </div>
        </div>
      </section>

      <SectionAccent />

      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.h2
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-editorial-mn text-4xl md:text-5xl text-center text-ink mb-14 md:mb-20 tracking-wide"
          >
            {t.pillarsTitle}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-5">
            {t.pillars.map((pillar, i) => {
              const isLast = i === t.pillars.length - 1;
              const isHospitalityPillar = i === 2;
              return (
                <motion.div
                  key={pillar.num}
                  initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2, margin: "-10% 0px" }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    delay: reduceMotion ? 0 : Math.min(i * 0.04, 0.16),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-sm bg-ink/[0.04] border border-ink/10 px-6 py-7 md:px-8 md:py-8 flex flex-col h-full shadow-sm"
                >
                  <span className="block font-editorial-mn not-italic text-lg md:text-xl text-ink/60 mb-2 tracking-wide">
                    {pillar.num}
                  </span>
                  <h3 className="font-editorial-mn text-2xl md:text-[1.75rem] leading-tight text-ink mb-4">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-base md:text-[1.02rem] leading-[1.75] text-ink/80 flex-1">
                    {pillar.body}
                  </p>
                  {isHospitalityPillar ? (
                    <div className="flex justify-center mt-6 pt-2">
                      <img
                        src="/images/about-us/decorations/icon-dombo.svg"
                        alt=""
                        className="w-16 h-16 md:w-20 md:h-20 object-contain select-none pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  ) : null}
                  {isLast ? (
                    <div className="flex justify-center mt-6 pt-2">
                      <CampfireMark className="w-16 h-16 md:w-20 md:h-20 text-ink/70" />
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionAccent />

      <section className="relative py-20 md:py-32">
        <motion.div
          className="max-w-6xl mx-auto px-6"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={
              isMn
                ? "/images/about-us/images/founders-note-mn.svg"
                : "/images/about-us/images/founders-note.svg"
            }
            alt={t.founderSectionLabel}
            className="w-full h-auto select-none"
            draggable={false}
          />
          <FounderAudio label={t.founderListenLabel} src="/audio/gun-tsenherhen.mp3" />
        </motion.div>
      </section>

      <div className="pb-24 md:pb-32" />
    </main>
    {portalMounted && heroFullscreenOpen
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.heroImageAlt}
            className="fixed inset-0 z-[200]"
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-black/90"
              aria-label={t.heroCloseFullscreen}
              onClick={() => setHeroFullscreenOpen(false)}
            />
            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center p-4 pt-16 md:p-8">
              <img
                src={HERO_IMAGE_SRC}
                alt={t.heroImageAlt}
                onClick={() => setHeroFullscreenOpen(false)}
                className="pointer-events-auto max-h-full max-w-full object-contain shadow-2xl cursor-zoom-in"
              />
            </div>
            <button
              type="button"
              onClick={() => setHeroFullscreenOpen(false)}
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              aria-label={t.heroCloseFullscreen}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>,
          document.body
        )
      : null}
    </>
  );
}
