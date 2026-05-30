/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { X, Play, Pause } from "lucide-react";
import { AboutHeroLoupe } from "@/app/components/about-us/AboutHeroLoupe";
import { AboutUsAlmanacFloatingBanner } from "@/app/components/about-us/AboutUsAlmanacFloatingBanner";
import { assetUrl } from "@/lib/assetUrl";

const content = {
  en: {
    heroTitle: "Our Story",
    heroCaption:
      "A quiet refuge on Lake Khövsgöl's eastern shore.",
    historySectionLabel: "Our Journey",
    historyScrollHint: "Scroll the years",
    history: [
      {
        year: "The 1990s",
        title: "The Auction",
        body: "During Mongolia's transition to a market economy, a local Khatgal native purchased a former summer camp at auction. The funds from this sale paid the province's civil servants for a full year, beginning our family's long-term commitment to Khövsgöl.",
      },
      {
        year: "The 2000s",
        title: "The Early Years",
        body: "We built the resort from the ground up. In those early years, we carried water by yak and relied on candlelight to get through the harsh northern winters.",
      },
      {
        year: "2009",
        title: "The Royal Ultimatum",
        body: "When a Middle Eastern royal family requested to stay with us, our infrastructure wasn't quite ready. In a true display of northern resourcefulness, we built our first indoor plumbing and running water systems from scratch just in time to welcome them.",
      },
      {
        year: "The 2010s",
        title: "Conservation",
        body: "As we became a retreat for international guests, we also deepened our roots in nature. We partnered with locals to establish a conservation program for the endangered Siberian musk deer.",
      },
      {
        year: "2022",
        title: "A New Era",
        body: "Dalai Eej transitioned to its third generation of family stewardship. Led by the women of our family, we continue our mission to protect and share the beauty of the North.",
      },
    ],
    pillarsTitle: "Our Philosophy",
    pillars: [
      {
        num: "01",
        title: "Rooted in the Taiga",
        body: "We are a three-generation family business and a local team. We offer honest, heartfelt hospitality to help you experience the wilderness authentically.",
      },
      {
        num: "02",
        title: "Built for the Wilderness",
        body: "We use natural timber and simple elements to create comfortable spaces that respect and highlight the surrounding landscape.",
      },
      {
        num: "03",
        title: "Pure Elements",
        body: "We serve pure spring water, wild-caught fish, and meat from local herders. We believe good food comes from a clean, natural environment.",
      },
      {
        num: "04",
        title: "Seamless Journey",
        body: "The Taiga is vast, but reaching it shouldn't be hard. From your first booking to the moment you arrive, we make your journey North completely seamless.",
      },
      {
        num: "05",
        title: "Protecting Khövsgöl",
        body: "We are committed to Khatgal. We direct 10% of our net profits to local initiatives, actively supporting the community and preserving the lake.",
      },
      {
        num: "06",
        title: "An Open Community",
        body: "Under the open sky, global travellers and locals come together. We foster a relaxed, welcoming environment built on genuine connection and shared experiences.",
      },
    ],
    founderSectionLabel: "Founder's Letter",
    founderHeadline: "A Note from the Family",
    founderListenLabel: "Listen",
    founderBody: [
      "Khövsgöl is the lake that raised us. Our founder wrote this song to honour the “Deep Blue Mother Ocean”—the pure waters that sustain the Mongolian North. Today, our family works together to share the quiet beauty of the taiga with you. Welcome to our home.",
      "— The Family at Dalai Eej Resort",
    ],
    founderClosing:
      "From the heart of our founder at Dalai Eej Resort—our family welcomes you to our northern home.",
    founderParallaxLines: [
      "At Nordå, we create spaces",
      "that blend seamlessly with their surroundings,",
      "enhancing both functionality and aesthetic appeal.",
      "Our process is thoughtful, collaborative, and tailored to bring your vision to life.",
    ],
    heroImageAlt: "Dalai Eej Resort",
    heroExpandImage: "View image full screen",
    heroCloseFullscreen: "Close full screen",
    almanacBannerMessage: "Discover the history of the Khaich Valley.",
    almanacBannerCta: "Read the Almanac",
    almanacBannerDismiss: "Dismiss banner",
  },
  mn: {
    heroTitle: "Бидний тухай",
    heroCaption:
      "Хөвсгөл нуурын зүүн эрэг дээрх чимээгүй амарлал.",
    historySectionLabel: "Бидний туулсан замнал",
    historyScrollHint: "Он цагийг гүйлгэж үзэх",
    history: [
      {
        year: "1990-ээд он",
        title: "Дуудлага худалдаа",
        body: "Монгол улс зах зээлийн нийгэмд шилжих эгзэгтэй он жилүүдэд Хатгал нутгийн хүү хуучин пионерийн зусланг дуудлага худалдаагаар худалдан авсан түүхтэй. Энэхүү хөрөнгөөр тухайн үед аймгийн төрийн албан хаагчдын нэг жилийн цалинг тавьсан нь бидний Хөвсгөл нутагтайгаа хувь заяагаа холбох эхлэл болсон юм.",
      },
      {
        year: "2000-аад он",
        title: "Эхэн үе",
        body: "Бид энэхүү амралтын газраа хоосон буурин дээрээс нь босгосон. Эхний жилүүдэд сарлагаар ус зөөж, лааны гэрэлд өвөлжих зэргээр бэрхшээл бүхнийг даван туулж байлаа.",
      },
      {
        year: "2009 он",
        title: "Хүндэт зочны сорилт",
        body: "Ойрхи Дорнодын язгууртан зочид манайд тухлах хүсэлт тавихад бидэнд орчин үеийн дэд бүтэц байсангүй. Гэвч бид богино хугацаанд шавдан ажиллаж, цэвэр усны шугам, дотор ариун цэврийн өрөөг шинээр байгуулан тэднийг нүүр бардам угтан авсан юм.",
      },
      {
        year: "2010-аад он",
        title: "Байгаль хамгаалал",
        body: "Олон улсын зочдын зорин ирдэг газар болохын сацуу бид байгаль хамгааллын үйлсэд манлайлан оролцож, нэн ховордсон хүдэр хамгаалах хөтөлбөрийг нутгийн иргэдтэйгээ хамтран эхлүүлсэн.",
      },
      {
        year: "2022 он",
        title: "Шинэ эрин үе",
        body: "Далай ээж ресортын үйл ажиллагааг гэр бүлийн маань гурав дахь үеийнхэн, тэр дундаа эмэгтэйчүүд удирдан чиглүүлж байна. Бид унаган байгалиа хайрлан хамгаалах, умардын гоо үзэсгэлэнг бусадтай хуваалцах эрхэм зорилгоо тасралтгүй үргэлжлүүлсээр байна.",
      },
    ],
    pillarsTitle: "Бидний үнэт зүйлс",
    pillars: [
      {
        num: "01",
        title: "Тайгын өв",
        body: "Бид энэ нутагтаа гурван үеэрээ ажиллаж амьдарч буй гэр бүл, нутгийн иргэдээс бүрдсэн хамт олон. Зочиддоо чин сэтгэлээсээ үйлчилж, тайгын онгон байгальтай танилцах жинхэнэ аяллыг санал болгодог.",
      },
      {
        num: "02",
        title: "Байгальд ууссан шийдэл",
        body: "Бид байгалийн унаган төрхийг алдагдуулахгүйгээр, цэвэр модон хийц, байгалийн элементүүдийг ашиглан тайгын тав тухыг цогцлоодог.",
      },
      {
        num: "03",
        title: "Байгалийн шим",
        body: "Бид уулын гүний цэвэр ус, нутгийн малын мах, Хөвсгөлийн шинэхэн загас зэрэг байгалийн гаралтай хүнсээр үйлчилдэг. Хамгийн эрүүл бөгөөд амттай зоог бол байгалийн шим гэдэгт бид итгэдэг.",
      },
      {
        num: "04",
        title: "Амар тайван аялал",
        body: "Тайга руу аялах нь бэрхшээлтэй мэт санагдаж болох ч бид бүх зүйлийг хөнгөвчилнө. Захиалга өгөхөөс эхлээд биднийг зорин ирэх хүртэлх бүх аяллыг тань ямар ч саадгүй, тав тухтай байхаар зохион байгуулдаг.",
      },
      {
        num: "05",
        title: "Хөвсгөлөө хайрлах сэтгэл",
        body: "Бид Хатгал нутагтаа үргэлж хариуцлагатай ханддаг. Цэвэр ашгийнхаа 10 хувийг орон нутгийн иргэдийг дэмжих, нуураа хамгаалах үйлсэд зориулж, бодит хувь нэмэр оруулдаг.",
      },
      {
        num: "06",
        title: "Халуун дулаан уур амьсгал",
        body: "Уудам тэнгэрийн дор дэлхийн өнцөг булан бүрээс ирсэн аялагчид болон нутгийн иргэд чөлөөтэй танилцаж, илэн далангүй ярилцах боломжтой нээлттэй, нөхөрсөг орчныг бид бүрдүүлдэг.",
      },
    ],
    founderSectionLabel: "Үүсгэн байгуулагчийн зурвас",
    founderHeadline: "Гэр бүлийн мэндчилгээ",
    founderListenLabel: "Сонсох",
    founderBody: [
      "Хөвсгөл бол бидний өлгий нутаг. Үүсгэн байгуулагч маань энэхүү дууг нутгийн зон олныг ундаалан тэтгэдэг Хөвсгөл нууртаа зориулан бүтээсэн түүхтэй. Өнөөдөр бид гэр бүлээрээ тайгын амар амгалан, байгалийн сайхныг зочидтойгоо хуваалцан ажиллаж байна. Манайд тавтай морилно уу.",
      "— Далай ээж ресортын гэр бүл",
    ],
    founderClosing:
      "Үүсгэн байгуулагчийн маань сэтгэлийн үгтэй хамт бидний гэр бүл таныг Хөвсгөлийн хойморт халуун дотноор угтан авах болно.",
    founderParallaxLines: [
      "At Nordå, we create spaces",
      "that blend seamlessly with their surroundings,",
      "enhancing both functionality and aesthetic appeal.",
      "Our process is thoughtful, collaborative, and tailored to bring your vision to life.",
    ],
    heroImageAlt: "Далай ээж ресорт",
    heroExpandImage: "Зургийг бүтэн дэлгэцээр харах",
    heroCloseFullscreen: "Хаах",
    almanacBannerMessage: "Хайчин хөдийн түүхийг судлаарай.",
    almanacBannerCta: "Товчоон унших",
    almanacBannerDismiss: "Хаах",
  },
};

const HERO_IMAGE_SRC = assetUrl("/images/about-us/images/about-hero.webp");
const historyCardTextures = [
  assetUrl("/images/about-us/decorations/1990s.png"),
  assetUrl("/images/about-us/decorations/2000s.png"),
  assetUrl("/images/about-us/decorations/2009.png"),
  assetUrl("/images/about-us/decorations/2010s.png"),
  assetUrl("/images/about-us/decorations/2022.png"),
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
      src: assetUrl("/images/about-us/images/timeline-1990s-primary.png"),
      rotate: "-rotate-[3deg]",
      caption: { en: "Khatgal's son.", mn: "Хатгалын хүү." },
    },
    background: {
      src: assetUrl("/images/about-us/images/timeline-1990s-background.png"),
      rotate: "-rotate-[1deg]",
      positionClass: "top-[-0.2rem] left-[-1.35rem] md:top-[-0.45rem] md:left-[-1.75rem]",
      sizeClass: "w-[21rem] md:w-[23rem] h-[39rem] md:h-[41rem]",
    },
    secondary: { src: assetUrl("/images/about-us/images/timeline-1990s-secondary.png"), rotate: "rotate-[4deg]" },
    annotation: {
      en: "Auction day\u2014a year of civil service wages.",
      mn: "Дуудлагын өдөр — жилийн цалин.",
    },
  },
  {
    primary: {
      src: assetUrl("/images/about-us/images/timeline-2000s-primary.png"),
      rotate: "rotate-[2deg]",
      caption: { en: "First winters.", mn: "Анхны өвлүүд." },
    },
    background: {
      src: assetUrl("/images/about-us/images/timeline-2000s-background.jpeg"),
      rotate: "rotate-[0.8deg]",
      positionClass: "top-[-0.2rem] left-[-1.3rem] md:top-[-0.45rem] md:left-[-1.7rem]",
      sizeClass: "w-[21rem] md:w-[23rem] h-[39rem] md:h-[41rem]",
    },
    secondary: {
      src: assetUrl("/images/about-us/images/timeline-2000s-secondary.png"),
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
      src: assetUrl("/images/about-us/images/timeline-2009-primary.png"),
      rotate: "-rotate-[2deg]",
      caption: { en: "Middle Eastern royalty", mn: "Ойрхи Дорнодын хаад" },
    },
    background: {
      src: assetUrl("/images/about-us/images/timeline-2009-background.png"),
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
      src: assetUrl("/images/about-us/images/timeline-2010s-primary.png"),
      rotate: "rotate-[3deg]",
      caption: { en: "Musk deer.", mn: "Хүдэр." },
    },
    background: {
      src: assetUrl("/images/about-us/images/timeline-2010s-background.png"),
      rotate: "rotate-[1deg]",
      positionClass: "top-[-0.2rem] left-[-1.3rem] md:top-[-0.45rem] md:left-[-1.7rem]",
      sizeClass: "w-[21rem] md:w-[23rem] h-[39rem] md:h-[41rem]",
    },
    secondary: {
      src: assetUrl("/images/about-us/images/timeline-2010s-secondary.png"),
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
      src: assetUrl("/images/about-us/images/timeline-2022-primary.png"),
      rotate: "-rotate-[4deg]",
      caption: { en: "Third generation.", mn: "Гурав дахь үе." },
    },
    background: {
      src: assetUrl("/images/about-us/images/timeline-2022-background.jpg"),
      rotate: "-rotate-[0.8deg]",
      positionClass: "top-[-0.15rem] left-[-1.25rem] md:top-[-0.4rem] md:left-[-1.65rem]",
      sizeClass: "w-[21rem] md:w-[23rem] h-[39rem] md:h-[41rem]",
    },
    secondary: { src: assetUrl("/images/about-us/images/timeline-2022-secondary.png"), rotate: "rotate-[2deg]" },
    annotation: { en: "...with you.", mn: "...тантай хамт." },
  },
];

function SectionAccent({
  className = "py-1 md:py-2",
  width = "w-20 md:w-24",
  invert = false,
  src = assetUrl("/images/about-us/decorations/accent.svg"),
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
        reduceMotion || inView || index === 0 || index === 3
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
  const allowPlayRef = useRef(false);

  useEffect(() => {
    if (!audioRef.current) return;
    // Guard against browsers restoring media playback on mount/navigation.
    audioRef.current.pause();
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      // Start at 0:20 on the first play, then keep normal resume behavior.
      if (audioRef.current.currentTime < 0.1) {
        audioRef.current.currentTime = 20;
      }
      allowPlayRef.current = true;
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
        onPlay={() => {
          if (allowPlayRef.current) {
            allowPlayRef.current = false;
            setPlaying(true);
            return;
          }
          audioRef.current?.pause();
          setPlaying(false);
        }}
        onPause={() => setPlaying(false)}
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
  const [fullscreenImage, setFullscreenImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const pillarsSectionRef = useRef<HTMLElement | null>(null);
  const bannerEndRef = useRef<HTMLDivElement | null>(null);
  const almanacHref = locale === "mn" ? "/mn/almanac" : "/almanac";
  // Avoid rendering the portal during SSR.
  const [portalMounted] = useState(() => typeof window !== "undefined");

  useEffect(() => {
    if (!fullscreenImage) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreenImage]);

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
          `url("${assetUrl("/images/about-us/decorations/paper.jpg")}")`,
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
                src={assetUrl("/images/about-us/decorations/accent-2.svg")}
                className="py-0"
                width="w-[min(58%,22rem)] min-w-[10.5rem] md:min-w-[13rem] mx-auto"
              />
            </div>
            <AboutHeroLoupe
              src={HERO_IMAGE_SRC}
              alt={t.heroImageAlt}
              expandLabel={t.heroExpandImage}
              onRequestFullscreen={() =>
                setFullscreenImage({ src: HERO_IMAGE_SRC, alt: t.heroImageAlt })
              }
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
                      className={`absolute z-0 select-none ${
                        visuals.background.positionClass ??
                        "top-[-0.25rem] left-[-1.4rem] md:top-[-0.5rem] md:left-[-1.8rem]"
                      } ${visuals.background.rotate ?? ""} ${
                        visuals.background.sizeClass ?? "w-[20.8rem] md:w-[22.8rem] h-[39rem] md:h-[41rem]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setFullscreenImage({
                            src: visuals.background!.src,
                            alt: `${item.year}. ${item.title}`,
                          })
                        }
                        className="block h-full w-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/50"
                        aria-label={`${t.heroExpandImage}: ${item.title}`}
                      >
                        <img
                          src={visuals.background.src}
                          alt=""
                          className="pointer-events-none h-full w-full object-cover opacity-[0.96]"
                          draggable={false}
                        />
                      </button>
                    </div>
                  ) : null}

                  {/* Secondary polaroid (tucked behind primary) */}
                  {behindSecondary ? (
                    <div
                      className={`absolute top-2 left-2 z-20 ${behindSecondary.rotate} w-36 md:w-40 overflow-hidden rounded-sm`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setFullscreenImage({
                            src: behindSecondary.src,
                            alt: item.title,
                          })
                        }
                        className="block h-36 w-full cursor-zoom-in border-0 bg-transparent p-0 md:h-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/50"
                        aria-label={`${t.heroExpandImage}: ${item.title}`}
                      >
                        <img
                          src={behindSecondary.src}
                          alt=""
                          className="pointer-events-none h-36 w-full object-contain md:h-40"
                          draggable={false}
                        />
                      </button>
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
                        <button
                          type="button"
                          onClick={() =>
                            setFullscreenImage({
                              src: visuals.primary.src,
                              alt: caption ? `${item.title}. ${caption}` : item.title,
                            })
                          }
                          className="block w-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/50"
                          aria-label={`${t.heroExpandImage}: ${item.title}`}
                        >
                          <img
                            src={visuals.primary.src}
                            alt=""
                            className="pointer-events-none h-52 w-full object-contain md:h-56"
                            draggable={false}
                          />
                        </button>
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
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setFullscreenImage({
                                  src: secondaryOverlay.src,
                                  alt: caption ? `${item.title}. ${caption}` : item.title,
                                })
                              }
                              className="block h-full w-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/50"
                              aria-label={`${t.heroExpandImage}: ${item.title}`}
                            >
                              <img
                                src={secondaryOverlay.src}
                                alt=""
                                className={`pointer-events-none w-full object-contain ${
                                  secondaryOverlay.overlaySizeClass
                                    ? secondaryOverlay.overlaySizeClass
                                    : secondaryOverlay.overlayScaleFromOriginal === 1.12
                                    ? "h-[5.88rem] md:h-[6.72rem]"
                                    : "h-[5.67rem] md:h-[6.48rem]"
                                }`}
                                draggable={false}
                              />
                            </button>
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
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setFullscreenImage({
                            src: secondaryCardOverlay.src,
                            alt: caption ? `${item.title}. ${caption}` : item.title,
                          })
                        }
                        className="block cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/50"
                        aria-label={`${t.heroExpandImage}: ${item.title}`}
                      >
                        <img
                          src={secondaryCardOverlay.src}
                          alt=""
                          className={`pointer-events-none w-full object-contain ${
                            secondaryCardOverlay.overlaySizeClass
                              ? secondaryCardOverlay.overlaySizeClass
                              : secondaryCardOverlay.overlayScaleFromOriginal === 1.12
                              ? "h-[5.88rem] md:h-[6.72rem] w-[5.88rem] md:w-[6.72rem]"
                              : "h-[5.67rem] md:h-[6.48rem] w-[5.67rem] md:w-[6.48rem]"
                          }`}
                          draggable={false}
                        />
                      </button>
                    </div>
                  ) : null}

                </TimelineCard>
              );
            })}
          </div>
        </div>
      </section>

      <SectionAccent />

      <section
        ref={pillarsSectionRef}
        className="relative py-24 md:py-36 overflow-hidden"
        style={{
          backgroundImage: `url("${assetUrl("/images/about-us/images/pillars-background.png")}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.h2
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-editorial-mn text-4xl md:text-5xl text-center text-white mb-14 md:mb-20 tracking-wide"
          >
            {t.pillarsTitle}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-5">
            {t.pillars.map((pillar, i) => {
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
                  className="bg-[#4B4D40] px-6 py-7 md:px-8 md:py-8 flex flex-col h-full"
                >
                  {isHospitalityPillar ? (
                    <div className="flex justify-center mb-5 pt-1">
                      <img
                        src={assetUrl("/images/about-us/decorations/icon-dombo.svg")}
                        alt=""
                        className="w-16 h-16 md:w-20 md:h-20 object-contain select-none pointer-events-none brightness-0 invert"
                        draggable={false}
                      />
                    </div>
                  ) : null}
                  <span className="block font-editorial-mn not-italic text-lg md:text-xl text-white/70 mb-2 tracking-wide">
                    {pillar.num}
                  </span>
                  <h3 className="font-editorial-mn text-2xl md:text-[1.75rem] leading-tight text-white mb-4">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-base md:text-[1.02rem] leading-[1.75] text-white/90 flex-1">
                    {pillar.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionAccent />

      <section className="relative py-20 md:py-32">
        <motion.div
          className="w-full max-w-none px-0"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative mx-auto w-[90vw] max-w-none aspect-[1440/1640] overflow-hidden shadow-[0_24px_54px_rgba(26,17,6,0.2)]">
            <h3 className="absolute top-5 left-5 z-[60] font-editorial-mn text-xl md:text-2xl text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] tracking-wide">
              {t.founderSectionLabel}
            </h3>
            <img
              src="/images/about-us/letter/background.jpg"
              alt={t.founderSectionLabel}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover select-none ${
                isMn ? "object-center" : "object-[center_60%]"
              }`}
              draggable={false}
            />
            <motion.img
              src={
                isMn
                  ? "/images/about-us/letter/letter-1.png"
                  : "/images/about-us/letter/letter-2.png"
              }
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{
                duration: reduceMotion ? 0 : 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`absolute left-1/2 z-10 w-auto -translate-x-1/2 object-contain select-none ${
                isMn
                  ? "top-[14%] h-[116%] max-w-none"
                  : "top-[28%] h-[110%] max-w-none"
              }`}
              draggable={false}
            />
          </div>
          <FounderAudio label={t.founderListenLabel} src="/audio/gun-tsenherhen.mp3" />
        </motion.div>
      </section>

      {/*
      <section
        ref={founderParallaxRef}
        className="relative h-[360vh] bg-[#0f100f]"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative overflow-hidden will-change-transform"
              style={{
                width: founderParallaxWidth,
                height: founderParallaxHeight,
                borderRadius: founderParallaxRadius,
              }}
            >
              <motion.img
                src={assetUrl("/images/about-us/images/founder-parallax-hallway.png")}
                alt={t.founderSectionLabel}
                aria-hidden
                className="absolute inset-0 h-[106%] w-full object-cover opacity-80 will-change-transform"
                style={{ y: founderParallaxY }}
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/75" />
            </motion.div>
          </div>

          <motion.div
            className="relative z-10 mx-auto flex h-full max-w-5xl items-end px-6 pb-16 md:pb-24 pointer-events-none"
            style={{ opacity: founderTextOpacity }}
          >
            <div className="max-w-6xl space-y-2 md:space-y-3 font-body text-white/90">
              <motion.p
                className="text-[1.95rem] leading-[1.03] md:text-[5.6rem] md:leading-[0.98]"
                style={{ y: founderLine1Y }}
              >
                {t.founderParallaxLines[0]}
              </motion.p>
              <motion.p
                className="text-[1.95rem] leading-[1.03] md:text-[5.6rem] md:leading-[0.98]"
                style={{ opacity: founderLine2Opacity, y: founderLine2Y }}
              >
                {t.founderParallaxLines[1]}
              </motion.p>
              <motion.p
                className="text-[1.95rem] leading-[1.03] md:text-[5.6rem] md:leading-[0.98]"
                style={{ opacity: founderLine3Opacity, y: founderLine3Y }}
              >
                {t.founderParallaxLines[2]}
              </motion.p>
              <motion.p
                className="max-w-5xl text-[1.55rem] leading-[1.08] md:text-[4.3rem] md:leading-[1]"
                style={{ opacity: founderLine4Opacity, y: founderLine4Y }}
              >
                {t.founderParallaxLines[3]}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      <div
        className="relative z-20 -mt-[100vh] h-screen bg-main"
        style={{
          backgroundImage: `url("${assetUrl("/images/about-us/decorations/paper.jpg")}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "720px 720px",
          backgroundBlendMode: "multiply",
        }}
        aria-hidden
      />
      */}

      <div ref={bannerEndRef} className="h-px w-full" aria-hidden />
      <div className="pb-24 md:pb-32" />
    </main>
    <AboutUsAlmanacFloatingBanner
      triggerRef={pillarsSectionRef}
      endRef={bannerEndRef}
      message={t.almanacBannerMessage}
      ctaLabel={t.almanacBannerCta}
      href={almanacHref}
      dismissLabel={t.almanacBannerDismiss}
    />
    {portalMounted && fullscreenImage
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={fullscreenImage.alt}
            className="fixed inset-0 z-[200]"
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-black/90"
              aria-label={t.heroCloseFullscreen}
              onClick={() => setFullscreenImage(null)}
            />
            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center p-4 pt-16 md:p-8">
              <img
                src={fullscreenImage.src}
                alt={fullscreenImage.alt}
                onClick={() => setFullscreenImage(null)}
                className="pointer-events-auto max-h-full max-w-full object-contain shadow-2xl cursor-zoom-in"
              />
            </div>
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
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
