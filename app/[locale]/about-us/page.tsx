"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { X } from "lucide-react";

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

const HERO_IMAGE_SRC = "/images/about-us/images/Heading-6.png";
/** Magnifying-glass cursor (PNG for Safari + Chrome; hotspot at lens center). */
const HERO_CURSOR_MAGNIFY_INK =
  'url("/images/cursors/hero-magnify-ink.png") 12 12, zoom-in';
const HERO_CURSOR_MAGNIFY_LIGHT =
  'url("/images/cursors/hero-magnify-light.png") 12 12, zoom-in';

// Scrapbook visuals for the timeline—one entry per era (5 total). Assets live in
// `public/images/about-us/images/` (Heading.png … Heading-6 primaries; secondaries
// on 1990s, 2000s, 2010s, 2022—2009 is primary only). Rotations can be tweaked;
// copy lives in `content[locale].history`.
const historyVisuals: Array<{
  primary: { src: string; rotate: string; caption?: { en: string; mn: string } };
  secondary?: {
    src: string;
    rotate: string;
    overlayOnPrimary?: boolean;
    /** Multiplier on 5.25rem / 6rem base; default 1.08 */
    overlayScaleFromOriginal?: number;
  };
  annotation?: { en: string; mn: string };
}> = [
  {
    primary: {
      src: "/images/about-us/images/Heading.png",
      rotate: "-rotate-[3deg]",
      caption: { en: "Khatgal's son.", mn: "Хатгалын хүү." },
    },
    secondary: { src: "/images/about-us/images/Heading-7.png", rotate: "rotate-[4deg]" },
    annotation: {
      en: "Auction day\u2014a year of civil service wages.",
      mn: "Дуудлагын өдөр — жилийн цалин.",
    },
  },
  {
    primary: {
      src: "/images/about-us/images/Heading-3.png",
      rotate: "rotate-[2deg]",
      caption: { en: "First winters.", mn: "Анхны өвлүүд." },
    },
    secondary: {
      src: "/images/about-us/images/Heading-8.png",
      rotate: "rotate-[4deg]",
      overlayOnPrimary: true,
      overlayScaleFromOriginal: 1.12,
    },
    annotation: {
      en: "Water by yak, light by candle.",
      mn: "Сарлагаар ус, лааны гэрэл.",
    },
  },
  {
    primary: {
      src: "/images/about-us/images/Heading-4.png",
      rotate: "-rotate-[2deg]",
      caption: { en: "Middle Eastern royalty", mn: "Ойрхи Дорнодын хаад" },
    },
    annotation: {
      en: "Plumbing in two weeks flat.",
      mn: "Хоёр долоо хоногт нойл боссон.",
    },
  },
  {
    primary: {
      src: "/images/about-us/images/Heading-5.png",
      rotate: "rotate-[3deg]",
      caption: { en: "Musk deer.", mn: "Хүдэр." },
    },
    secondary: {
      src: "/images/about-us/images/Heading-2.png",
      rotate: "-rotate-[3deg]",
      overlayOnPrimary: true,
    },
    annotation: {
      en: "Conservation program \u2014\u2192",
      mn: "Хамгааллын хөтөлбөр \u2014\u2192",
    },
  },
  {
    primary: {
      src: "/images/about-us/images/Heading-6.png",
      rotate: "-rotate-[4deg]",
      caption: { en: "Third generation.", mn: "Гурав дахь үе." },
    },
    secondary: { src: "/images/about-us/images/Heading-9.png", rotate: "rotate-[2deg]" },
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

export default function AboutUsPage() {
  const locale = useLocale();
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
            <button
              type="button"
              onClick={() => setHeroFullscreenOpen(true)}
              aria-label={t.heroExpandImage}
              style={{ cursor: HERO_CURSOR_MAGNIFY_INK }}
              className="group mt-16 md:mt-24 lg:mt-28 w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
            >
              <img
                src={HERO_IMAGE_SRC}
                alt={t.heroImageAlt}
                style={{ cursor: HERO_CURSOR_MAGNIFY_INK }}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02] group-active:scale-[0.99]"
              />
            </button>
            <p className="text-center mt-8 font-body text-sm md:text-base italic text-ink/60 tracking-wide max-w-2xl mx-auto leading-relaxed">
              {t.heroCaption}
            </p>
          </motion.div>
        </div>
      </section>

      <SectionAccent />

      <section className="py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 mb-2">
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
          </div>
        </div>

        <div
          ref={historyScrollRef}
          className="mt-12 md:mt-16 w-full overflow-x-auto overflow-y-visible overscroll-x-contain scrollbar-hide"
        >
          <div className="flex flex-row items-start gap-6 md:gap-10 w-max pl-6 pr-6 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pr-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pt-6 pb-16">
            {t.history.map((item, i) => {
              const visuals = historyVisuals[i];
              const caption = visuals?.primary.caption?.[isMn ? "mn" : "en"];
              const annotation = visuals?.annotation?.[isMn ? "mn" : "en"];
              const behindSecondary =
                visuals?.secondary && !visuals.secondary.overlayOnPrimary
                  ? visuals.secondary
                  : null;
              const secondaryOverlay = visuals?.secondary?.overlayOnPrimary
                ? visuals.secondary
                : null;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-5% 0px -5% 0px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.25) }}
                  className="snap-center shrink-0 relative w-[min(92vw,22rem)] md:w-[26rem] h-[34rem] md:h-[36rem]"
                >
                  {/* Secondary polaroid (tucked behind primary) */}
                  {behindSecondary ? (
                    <div
                      className={`absolute top-2 left-2 ${behindSecondary.rotate} w-40 md:w-44 overflow-hidden rounded-sm`}
                      aria-hidden
                    >
                      <img src={behindSecondary.src} alt="" className="w-full h-40 md:h-44 object-contain" />
                    </div>
                  ) : null}

                  {/* Primary photo + caption */}
                  {visuals ? (
                    <div
                      className={`absolute top-0 ${behindSecondary ? "left-28 md:left-32" : "left-6 md:left-10"} ${visuals.primary.rotate} w-56 md:w-64 flex flex-col`}
                    >
                      <div className="overflow-hidden rounded-sm relative">
                        <img src={visuals.primary.src} alt={item.title} className="w-full h-56 md:h-64 object-contain" />
                        {secondaryOverlay ? (
                          <div
                            className={`absolute bottom-2 left-2 z-10 ${secondaryOverlay.rotate} overflow-hidden rounded-sm ${
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
                                secondaryOverlay.overlayScaleFromOriginal === 1.12
                                  ? "h-[5.88rem] md:h-[6.72rem]"
                                  : "h-[5.67rem] md:h-[6.48rem]"
                              }`}
                            />
                          </div>
                        ) : null}
                      </div>
                      {caption ? (
                        <p className="font-editorial-mn text-base md:text-lg text-ink/75 text-center mt-2 leading-tight">
                          {caption}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Aged-paper note card */}
                  <div
                    className={`absolute bottom-0 ${i % 2 === 0 ? "left-0 md:left-2 rotate-[-1deg]" : "right-0 md:right-2 rotate-[1.5deg]"} w-[17rem] md:w-[18rem] bg-[#efe3c9] border border-ink/10 px-6 py-6 md:px-7 md:py-7`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
                    }}
                  >
                    <p className="font-body italic text-[0.7rem] md:text-xs uppercase tracking-[0.2em] text-ink/55 mb-1">
                      {item.year}
                    </p>
                    <h3 className="font-editorial-mn text-2xl md:text-[1.7rem] text-ink mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm md:text-[0.95rem] leading-[1.65] text-ink/80">{item.body}</p>
                  </div>

                  {/* Handwritten annotation */}
                  {annotation ? (
                    <p
                      className={`absolute ${i % 2 === 0 ? "bottom-[-1.5rem] right-2 rotate-[-4deg]" : "bottom-[-1.5rem] left-2 rotate-[3deg]"} font-editorial-mn text-base md:text-lg text-ink/65 leading-tight max-w-[12rem]`}
                    >
                      {annotation}
                    </p>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <SectionAccent />

      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-editorial-mn text-4xl md:text-5xl text-center text-ink mb-14 md:mb-20 tracking-wide"
          >
            {t.pillarsTitle}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-5">
            {t.pillars.map((pillar, i) => {
              const isLast = i === t.pillars.length - 1;
              return (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
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
        <div className="max-w-6xl mx-auto px-6">
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
        </div>
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
                style={{ cursor: HERO_CURSOR_MAGNIFY_LIGHT }}
                className="pointer-events-auto max-h-full max-w-full object-contain shadow-2xl"
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
