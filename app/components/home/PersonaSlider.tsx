"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import FadeInWhenVisible from "./FadeInWhenVisible";
import { BodyText, CTALink, Eyebrow, Headline } from "../ui/Typography";

/**
 * Scroll reveal: card + persona row scale together (one factor).
 * Smallest size during scroll-in / scroll-out; peaks at 1 in the middle
 * of the section's pass through the viewport, where the card reaches its
 * full viewport width.
 */
const REVEAL_SCALE_MIN = 0.6;

const personas = [
  {
    id: 1,
    quoteKey: "review1",
    en: {
      title: "THE SANCTUARY",
      description:
        "Refined comfort in the wild. A peaceful escape from the capital, with zero compromises.",
      image: "/images/personas/sanctuary-en.jpg",
      href: /*"/suites"*/ "/#",
    },
    mn: {
      title: "ТАВ ТУХТАЙ АМРАЛТ",
      description:
        "Байгаль дунд тав тухтай амарч, хэрэгтэй бүхнээ нэг дороос авах тайван сонголт.",
      image: "/images/personas/sanctuary-mn.jpg",
      href: /*"/suites"*/ "/#",
    },
  },
  {
    id: 2,
    quoteKey: "review3",
    en: {
      title: "THE FRONTIER",
      description:
        "For those who have been everywhere. Experience the untamed Taiga and the raw beauty of the Blue Pearl.",
      image: "/images/personas/frontier-en.jpg",
      href: /*"/experiences"*/ "/#",
    },
    mn: {
      title: "БАЙГАЛИЙН АДАЛ ЯВДАЛ",
      description:
        "Хөх сувдын эрэг, тайгын жимээр алхаж, морь унан, Хөвсгөлийн жинхэнэ өнгийг мэдрэх аялал.",
      image: "/images/personas/frontier-mn.jpg",
      href: /*"/experiences"*/ "/#",
    },
  },
  {
    id: 3,
    quoteKey: "review2",
    en: {
      title: "DISCONNECT TO RECONNECT",
      description:
        "Silence the noise. No Zoom calls, just crackling fires, lake sounds, and deep focus.",
      image: "/images/personas/disconnect-en.jpg",
      href: /*"/retreats"*/ "/#",
    },
    mn: {
      title: "АМЬСГАА АВАХ ЗАВСАР",
      description:
        "Хотын хэмнэлээс түр холдож, чимээгүй орчинд өөртөө эргэн төвлөрөх нам гүм хугацаа.",
      image: "/images/personas/disconnect-mn.jpg",
      href: /*"/retreats"*/ "/#",
    },
  },
  {
    id: 4,
    quoteKey: "review4",
    en: {
      title: "THE SECLUSION",
      description:
        "Intimate escapes designed for two. Private dining, sunset wine, and zero interruptions.",
      image: "/images/personas/seclusion.jpg",
      href: /*"/offers"*/ "/#",
    },
    mn: {
      title: "ХОЁУЛАХНЫ АМРАЛТ",
      description:
        "Хувийн уур амьсгалтай орчинд жаргах нарыг хамт үзэж, дурсамж бүтээх дулаан аялал.",
      image: "/images/personas/seclusion.jpg",
      href: /*"/offers"*/ "/#",
    },
  },
];

type PersonaEntry = (typeof personas)[number];

/** CapCut-style “Left”: next pushes current off to the left; prev is the reverse. */
const pushVariants = {
  enter: (d: number) => ({
    x: d >= 0 ? "100%" : "-100%",
  }),
  center: { x: "0%" },
  exit: (d: number) => ({
    x: d >= 0 ? "-100%" : "100%",
  }),
};

const pushTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1] as const,
};

function PersonaPushFrame({
  persona,
  locale,
  direction,
  priority,
  sizes,
}: {
  persona: PersonaEntry;
  locale: string;
  direction: number;
  priority?: boolean;
  sizes: string;
}) {
  const copy = locale === "mn" ? persona.mn : persona.en;
  return (
    <AnimatePresence initial={false} custom={direction} mode="sync">
      <motion.div
        key={`${persona.id}-${locale}`}
        custom={direction}
        variants={pushVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={pushTransition}
        className="absolute inset-0"
      >
        <Image
          src={copy.image}
          alt={copy.title}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default function PersonaSlider() {
  const locale = useLocale();
  const localePrefix = locale === "mn" ? "/mn" : "";
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const tTestimonials = useTranslations("amenities.testimonials");
  const isMn = locale === "mn";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    /** Full pass through the viewport so the zoom unfolds over more scroll. */
    offset: ["start end", "end start"],
  });
  const revealScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [REVEAL_SCALE_MIN, 1, 1]
  );

  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = useCallback(
    (newDirection: number) => {
      setActiveIndex(([currentIndex]) => [currentIndex + newDirection, newDirection]);
    },
    []
  );

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      paginate(1);
    }, 6000);
  }, [paginate]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetTimer]);

  const handlePaginate = (newDirection: number) => {
    paginate(newDirection);
    resetTimer();
  };

  const n = personas.length;
  const normalizedIndex = ((activeIndex % n) + n) % n;
  const leftIdx = ((activeIndex - 1) % n + n) % n;
  const rightIdx = ((activeIndex + 1) % n + n) % n;

  const currentPersona = personas[normalizedIndex];
  const content = locale === "mn" ? currentPersona.mn : currentPersona.en;
  const sideFrameClass =
    "relative w-[20vw] max-w-[260px] shrink-0 aspect-[3/4] overflow-hidden shadow-2xl ring-1 ring-white/10";
  const centerFrameClass =
    "relative w-[min(52vw,780px)] shrink-0 aspect-[1.4/1] md:aspect-[1.45/1] overflow-hidden shadow-2xl ring-1 ring-white/10 z-10";

  const cardMotionStyle = reduceMotion ? undefined : { scale: revealScale };

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-surface relative overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center gap-6 mb-10 md:mb-12">
        <FadeInWhenVisible y={14} duration={0.5}>
          <Eyebrow>
            {locale === "mn" ? "Танд тохирох аяллаа сонгоорой" : "Find Your Journey"}
          </Eyebrow>
        </FadeInWhenVisible>
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            delay: reduceMotion ? 0 : 0.1,
          }}
          className="max-w-2xl"
        >
          <Headline as="h2" size="section">
            {locale === "mn"
              ? "Аялагч бүр өөр өөр хүслээр ирдэг. Таных аль нь вэ?"
              : "Every traveler arrives with a different story. Which is yours?"}
          </Headline>
        </motion.div>
      </div>

      <div className="relative z-10 w-full">
        <motion.div
          className="relative mx-auto w-screen max-w-none origin-center will-change-transform"
          style={cardMotionStyle}
        >
          <div className="relative rounded-t-3xl bg-ink p-6 sm:p-8 md:p-10 shadow-2xl ring-1 ring-white/10 overflow-x-hidden">
          {n === 1 ? (
            <FadeInWhenVisible
              className="relative max-w-4xl mx-auto aspect-[16/10] md:aspect-[2.2/1] overflow-hidden shadow-2xl ring-1 ring-white/10"
              delay={0.06}
              x={-20}
              y={20}
              duration={0.6}
            >
              <PersonaPushFrame
                persona={personas[0]}
                locale={locale}
                direction={direction}
                priority
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </FadeInWhenVisible>
          ) : (
            <div className="-mx-6 sm:-mx-8 md:-mx-10 overflow-x-hidden">
              <div className="flex items-center justify-between py-2">
                <FadeInWhenVisible
                  className={sideFrameClass}
                  delay={0}
                  x={-20}
                  y={14}
                  duration={0.55}
                  amount={0.08}
                >
                  <PersonaPushFrame
                    persona={personas[leftIdx]}
                    locale={locale}
                    direction={direction}
                    sizes="(max-width: 768px) 20vw, 260px"
                  />
                </FadeInWhenVisible>
                <FadeInWhenVisible
                  className={centerFrameClass}
                  delay={0.12}
                  x={-20}
                  y={14}
                  duration={0.55}
                  amount={0.08}
                >
                  <PersonaPushFrame
                    persona={personas[normalizedIndex]}
                    locale={locale}
                    direction={direction}
                    priority
                    sizes="(max-width: 768px) 52vw, 780px"
                  />
                </FadeInWhenVisible>
                <FadeInWhenVisible
                  className={sideFrameClass}
                  delay={0.24}
                  x={-20}
                  y={14}
                  duration={0.55}
                  amount={0.08}
                >
                  <PersonaPushFrame
                    persona={personas[rightIdx]}
                    locale={locale}
                    direction={direction}
                    sizes="(max-width: 768px) 20vw, 260px"
                  />
                </FadeInWhenVisible>
              </div>
            </div>
          )}

          {n > 1 && (
            <FadeInWhenVisible
              className="mt-8 flex flex-col items-center gap-6"
              delay={0.34}
              x={-16}
              y={12}
              duration={0.5}
              amount={0.15}
            >
              <div className="w-full max-w-3xl text-center mx-auto">
                <p className="font-cta text-main/60 text-xs tracking-[0.3em] uppercase tabular-nums mb-4">
                  {String(normalizedIndex + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </p>

                <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
                  <button
                    type="button"
                    onClick={() => handlePaginate(-1)}
                    className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-main transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex-1 min-w-0 min-h-[4.5rem] md:min-h-[5.25rem] lg:min-h-[6.25rem] flex items-center justify-center">
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={`${currentPersona.id}-${locale}`}
                        custom={direction}
                        initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Headline as="h3" size="sub" tone="dark">
                          {content.title}
                        </Headline>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePaginate(1)}
                    className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-main transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 min-h-[7.5rem] sm:min-h-[6.5rem] md:min-h-[6rem] relative">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={`${currentPersona.id}-${locale}-desc`}
                      custom={direction}
                      initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <BodyText tone="dark" size="md" className="max-w-xl mx-auto">
                        {content.description}
                      </BodyText>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <CTALink href={`${localePrefix}${content.href}`} tone="dark" arrow={false}>
                    {locale === "mn" ? "Дэлгэрэнгүй" : "Explore"}
                  </CTALink>
                </div>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.figure
                    key={`${currentPersona.id}-${locale}-quote`}
                    custom={direction}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                    className="mt-14 md:mt-16 flex flex-col items-center"
                    aria-label="Guest reflection"
                  >
                    <span
                      aria-hidden
                      className="block h-px w-12 bg-main/20"
                    />
                    <blockquote
                      className={[
                        "mt-8 mx-auto max-w-2xl text-pretty text-center text-main/85",
                        isMn ? "font-editorial-mn" : "font-editorial-en",
                        "italic font-light",
                        "text-xl sm:text-2xl md:text-[1.6rem]",
                        "leading-[1.5] md:leading-[1.55]",
                        "min-h-[8rem] sm:min-h-[9.5rem] md:min-h-[10.5rem]",
                        "flex items-center justify-center",
                      ].join(" ")}
                    >
                      <span>
                        &ldquo;{tTestimonials(`${currentPersona.quoteKey}.text`)}&rdquo;
                      </span>
                    </blockquote>
                    <figcaption className="mt-5 font-cta text-main/70 text-xs tracking-[0.3em] uppercase">
                      &mdash;&nbsp;{tTestimonials(`${currentPersona.quoteKey}.author`)}
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
            </FadeInWhenVisible>
          )}

          {n === 1 && (
            <div className="mt-8 flex flex-col items-center text-center gap-6">
              <div className="w-full max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentPersona.id}-${locale}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-3 items-center"
                  >
                    <Headline as="h3" size="sub" tone="dark">
                      {content.title}
                    </Headline>
                    <BodyText tone="dark" size="md" className="max-w-xl mx-auto">
                      {content.description}
                    </BodyText>
                  </motion.div>
                </AnimatePresence>
              </div>

              <CTALink href={`${localePrefix}${content.href}`} tone="dark" arrow={false}>
                {locale === "mn" ? "Дэлгэрэнгүй" : "Explore"}
              </CTALink>

              <figure
                className="mt-14 md:mt-16 flex flex-col items-center"
                aria-label="Guest reflection"
              >
                <span aria-hidden className="block h-px w-12 bg-main/20" />
                <blockquote
                  className={[
                    "mt-8 mx-auto max-w-2xl text-pretty text-center text-main/85",
                    isMn ? "font-editorial-mn" : "font-editorial-en",
                    "italic font-light",
                    "text-xl sm:text-2xl md:text-[1.6rem]",
                    "leading-[1.5] md:leading-[1.55]",
                    "min-h-[8rem] sm:min-h-[9.5rem] md:min-h-[10.5rem]",
                    "flex items-center justify-center",
                  ].join(" ")}
                >
                  <span>
                    &ldquo;{tTestimonials(`${currentPersona.quoteKey}.text`)}&rdquo;
                  </span>
                </blockquote>
                <figcaption className="mt-5 font-cta text-main/70 text-xs tracking-[0.3em] uppercase">
                  &mdash;&nbsp;{tTestimonials(`${currentPersona.quoteKey}.author`)}
                </figcaption>
              </figure>
            </div>
          )}
          </div>

          {/* Decorative scalloped tip — exact curves from /images/personas/scallop.svg,
              viewBox cropped to the scallop band only (no body above). */}
          <svg
            aria-hidden="true"
            viewBox="0 1100 2238.75 270"
            preserveAspectRatio="none"
            className="block w-full h-[76px] sm:h-[84px] md:h-[96px] lg:h-[116px] text-ink -mt-px drop-shadow-[0_10px_18px_rgba(13,15,28,0.18)]"
          >
            <path
              fill="currentColor"
              d="M 2360.460938 805.90625 C 2420.511719 907.925781 2425.410156 1038.398438 2361.933594 1148.1875 C 2268.015625 1310.632812 2060.003906 1366.308594 1897.363281 1272.515625 C 1648.910156 1126.527344 1327.367188 1167.003906 1119.304688 1364.425781 L 1119.160156 1364.425781 C 914.996094 1170.699219 600.402344 1124.53125 343.714844 1271.011719 C 241.589844 1330.984375 110.925781 1335.859375 1 1272.484375 C -161.640625 1178.667969 -217.367188 970.914062 -123.484375 808.476562 C 22.695312 560.394531 -17.855469 239.238281 -215.523438 31.445312 L -215.523438 31.300781 C -21.53125 -172.613281 24.671875 -486.773438 -121.984375 -743.160156 C -182.046875 -845.160156 -186.933594 -975.65625 -123.445312 -1085.429688 C -29.535156 -1247.90625 178.476562 -1303.589844 341.113281 -1209.796875 C 589.5625 -1063.835938 911.105469 -1104.316406 1119.179688 -1301.738281 L 1119.324219 -1301.738281 C 1329.683594 -1102.128906 1646.074219 -1065.289062 1897.386719 -1209.800781 C 2060.023438 -1303.59375 2268.035156 -1247.929688 2361.957031 -1085.476562 C 2425.433594 -975.679688 2420.53125 -845.164062 2360.460938 -743.144531 C 2213.824219 -486.757812 2260.054688 -172.636719 2454.023438 31.28125 L 2454.023438 31.421875 C 2260.027344 235.355469 2213.824219 549.515625 2360.460938 805.90625 Z"
            />
          </svg>
        </motion.div>
      </div>

      {/* Visually hidden heritage line — kept for SEO/screen readers */}
      <p className="sr-only">{tTestimonials("heritage")}</p>
    </section>
  );
}
