"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import FadeInWhenVisible from "./FadeInWhenVisible";

const personas = [
  {
    id: 1,
    en: {
      title: "THE SANCTUARY",
      description:
        "Refined comfort in the wild. A peaceful escape from the capital, with zero compromises.",
      image: "/images/personas/sanctuary-en.jpg",
      href: /*"/suites"*/ "/#",
    },
    mn: {
      title: "ЭРХЭМСЭГ АЯЛАЛ",
      description:
        "Тав тух, аюулгүй байдал, тансаг зэрэглэл. Таны гэр бүлд зориулсан дээд зэрэглэлийн үйлчилгээ.",
      image: "/images/personas/sanctuary-mn.jpg",
      href: /*"/suites"*/ "/#",
    },
  },
  {
    id: 2,
    en: {
      title: "THE FRONTIER",
      description:
        "For those who have been everywhere. Experience the untamed Taiga and the raw beauty of the Blue Pearl.",
      image: "/images/personas/frontier-en.jpg",
      href: /*"/experiences"*/ "/#",
    },
    mn: {
      title: "ХӨХ СУВДЫН АЯЛАЛ",
      description:
        "Хязгааргүй эрх чөлөө, онгон байгаль. Морьт аялал, явган алхалт, байгалийн гэрэл зураг.",
      image: "/images/personas/frontier-mn.jpg",
      href: /*"/experiences"*/ "/#",
    },
  },
  {
    id: 3,
    en: {
      title: "DISCONNECT TO RECONNECT",
      description:
        "Silence the noise. No Zoom calls, just crackling fires, lake sounds, and deep focus.",
      image: "/images/personas/disconnect-en.jpg",
      href: /*"/retreats"*/ "/#",
    },
    mn: {
      title: "ХИЙМОРЬ СЭРГЭЭХ АЯН",
      description:
        "Амжилттай яваа эрхмүүдийн алжаал тайлах цэг. Чимээгүй орчин, хувийн орон зай.",
      image: "/images/personas/disconnect-mn.jpg",
      href: /*"/retreats"*/ "/#",
    },
  },
  {
    id: 4,
    en: {
      title: "THE SECLUSION",
      description:
        "Intimate escapes designed for two. Private dining, sunset wine, and zero interruptions.",
      image: "/images/personas/seclusion.jpg",
      href: /*"/offers"*/ "/#",
    },
    mn: {
      title: "ХАЙРЫН ДИВААЖИН",
      description:
        "Хоёулаа төгс цагийг өнгөрүүлэх. Хувийн оройн хоол, жаргах нар, нандин мөчүүд.",
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

  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = useCallback(
    (newDirection: number) => {
      setActiveIndex(([currentIndex]) => {
        const newIndex = currentIndex + newDirection;
        if (newIndex < 0) {
          return [personas.length - 1, newDirection];
        }
        if (newIndex >= personas.length) {
          return [0, newDirection];
        }
        return [newIndex, newDirection];
      });
    },
    [personas.length]
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
  const leftIdx = (activeIndex - 1 + n) % n;
  const rightIdx = (activeIndex + 1) % n;

  const currentPersona = personas[activeIndex];
  const content = locale === "mn" ? currentPersona.mn : currentPersona.en;

  const sideFrameClass =
    "relative w-[28%] max-w-[220px] md:max-w-[300px] shrink-0 aspect-[5/4] md:aspect-[3/2] overflow-hidden shadow-2xl ring-1 ring-white/10";
  const centerFrameClass =
    "relative w-[min(52vw,720px)] shrink-0 aspect-[16/10] md:aspect-[2.2/1] overflow-hidden shadow-2xl ring-1 ring-white/10 z-10";

  return (
    <section className="py-16 md:py-24 bg-main relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <FadeInWhenVisible
          className="text-center font-body text-ink/60 text-xs tracking-[0.3em] uppercase mb-6"
          y={14}
          duration={0.5}
        >
          <p>
            {locale === "mn" ? "Таны Аялал, Таны Түүх" : "Find Your Journey"}
          </p>
        </FadeInWhenVisible>
        <motion.h2
          initial={
            reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            delay: reduceMotion ? 0 : 0.1,
          }}
          className="text-center font-serif text-2xl md:text-3xl lg:text-4xl text-ink/80 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {locale === "mn"
            ? "Аялагч бүр өөрийн түүхтэй ирдэг. Танийх аль нь вэ?"
            : "Every traveler arrives with a different story. Which is yours?"}
        </motion.h2>

        <FadeInWhenVisible
          className="relative mx-auto max-w-5xl rounded-3xl bg-ink p-6 sm:p-8 md:p-10 shadow-2xl ring-1 ring-white/10 overflow-x-hidden"
          delay={0.08}
          y={28}
          duration={0.65}
        >
          {n === 1 ? (
            <div className="relative max-w-4xl mx-auto aspect-[16/10] md:aspect-[2.2/1] overflow-hidden shadow-2xl ring-1 ring-white/10">
              <PersonaPushFrame
                persona={personas[0]}
                locale={locale}
                direction={direction}
                priority
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          ) : (
            <div className="w-full overflow-x-hidden">
              <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 py-2 -mx-4 sm:-mx-8">
                <div className={sideFrameClass}>
                  <PersonaPushFrame
                    persona={personas[leftIdx]}
                    locale={locale}
                    direction={direction}
                    sizes="(max-width: 768px) 40vw, 300px"
                  />
                </div>
                <div className={centerFrameClass}>
                  <PersonaPushFrame
                    persona={personas[activeIndex]}
                    locale={locale}
                    direction={direction}
                    priority
                    sizes="(max-width: 768px) 85vw, 720px"
                  />
                </div>
                <div className={sideFrameClass}>
                  <PersonaPushFrame
                    persona={personas[rightIdx]}
                    locale={locale}
                    direction={direction}
                    sizes="(max-width: 768px) 40vw, 300px"
                  />
                </div>
              </div>
            </div>
          )}

          {n > 1 && (
            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handlePaginate(-1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-main transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-body text-main/70 text-sm tabular-nums min-w-[3.5rem] text-center">
                  {activeIndex + 1}/{n}
                </span>
                <button
                  type="button"
                  onClick={() => handlePaginate(1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-main transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full max-w-2xl text-center mx-auto">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`${currentPersona.id}-${locale}`}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-main mb-3 tracking-wide">
                      {content.title}
                    </h3>
                    <p className="font-body text-main/70 max-w-xl mx-auto text-lg font-light leading-relaxed">
                      {content.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href={`${localePrefix}${content.href}`}
                    className="group inline-flex items-center gap-3 font-body text-sm tracking-[0.15em] uppercase text-main hover:text-white transition-colors border border-surface/30 px-6 py-3 rounded-full hover:bg-white/5"
                  >
                    <span>{locale === "mn" ? "Дэлгэрэнгүй" : "Explore"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
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
                  >
                    <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-main mb-3 tracking-wide">
                      {content.title}
                    </h3>
                    <p className="font-body text-main/70 max-w-xl mx-auto text-lg font-light leading-relaxed">
                      {content.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <Link
                href={`${localePrefix}${content.href}`}
                className="group inline-flex items-center gap-3 font-body text-sm tracking-[0.15em] uppercase text-main hover:text-white transition-colors border border-surface/30 px-6 py-3 rounded-full hover:bg-white/5"
              >
                <span>{locale === "mn" ? "Дэлгэрэнгүй" : "Explore"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </FadeInWhenVisible>
      </div>
    </section>
  );
}
