"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const personas = [
  {
    id: 1,
    en: { 
      title: "THE SANCTUARY",
      description: "Refined comfort in the wild. A peaceful escape from the capital, with zero compromises.",
      // EN Image: Interior focus (Safety/Comfort)
      image: "/images/personas/sanctuary-en.jpg",
      href: /*"/suites"*/ "/#"
    },
    mn: { 
      title: "ЭРХЭМСЭГ АЯЛАЛ",
      description: "Тав тух, аюулгүй байдал, тансаг зэрэглэл. Таны гэр бүлд зориулсан дээд зэрэглэлийн үйлчилгээ.",
      // MN Image: Exterior/Grandeur focus (Status/Nature)
      image: "/images/personas/sanctuary-mn.jpg",
      href: /*"/suites"*/ "/#"
    }
  },
  {
    id: 2,
    en: { 
      title: "THE FRONTIER",
      description: "For those who have been everywhere. Experience the untamed Taiga and the raw beauty of the Blue Pearl.",
      // EN Image: Moody, dramatic, "National Geographic" style
      image: "/images/personas/frontier-en.jpg",
      href: /*"/experiences"*/ "/#"
    },
    mn: { 
      title: "ХӨХ СУВДЫН АЯЛАЛ",
      description: "Хязгааргүй эрх чөлөө, онгон байгаль. Морьт аялал, явган алхалт, байгалийн гэрэл зураг.",
      // MN Image: Bright, sunny, "Holiday" style
      image: "/images/personas/frontier-mn.jpg",
      href: /*"/experiences"*/ "/#"
    }
  },
  {
    id: 3,
    en: { 
      title: "DISCONNECT TO RECONNECT",
      description: "Silence the noise. No Zoom calls, just crackling fires, lake sounds, and deep focus.",
      // EN Image: Solitude, person reading, calm water
      image: "/images/personas/disconnect-en.jpg",
      href: /*"/retreats"*/ "/#"
    },
    mn: { 
      title: "ХИЙМОРЬ СЭРГЭЭХ АЯН",
      description: "Амжилттай яваа эрхмүүдийн алжаал тайлах цэг. Чимээгүй орчин, хувийн орон зай.",
      // MN Image: Powerful stance, looking at horizon (Revitalization)
      image: "/images/personas/disconnect-mn.jpg",
      href: /*"/retreats"*/ "/#"
    }
  },
  {
    id: 4,
    en: { 
      title: "THE SECLUSION",
      description: "Intimate escapes designed for two. Private dining, sunset wine, and zero interruptions.",
      // EN Image: Wine glasses, dim lighting, intimate
      image: "/images/personas/seclusion.jpg",
      href: /*"/offers"*/ "/#"
    },
    mn: { 
      title: "ХАЙРЫН ДИВААЖИН",
      description: "Хоёулаа төгс цагийг өнгөрүүлэх. Хувийн оройн хоол, жаргах нар, нандин мөчүүд.",
      // MN Image: Couple walking together, golden hour
      image: "/images/personas/seclusion.jpg",
      href: /*"/offers"*/ "/#"
    }
  }
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

export default function PersonaSlider() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const filtered = locale === 'en' ? personas.filter(p => p.id === 2) : personas;
  const visiblePersonas = filtered.length > 0 ? filtered : personas;

  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = useCallback((newDirection: number) => {
    setActiveIndex(([currentIndex]) => {
      const newIndex = currentIndex + newDirection;
      if (newIndex < 0) {
        return [visiblePersonas.length - 1, newDirection];
      } else if (newIndex >= visiblePersonas.length) {
        return [0, newDirection];
      } else {
        return [newIndex, newDirection];
      }
    });
  }, [visiblePersonas.length]);

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

  const handleDotClick = (index: number) => {
    setActiveIndex(([currentIndex]) => [index, index > currentIndex ? 1 : -1]);
    resetTimer();
  };

  const currentPersona = visiblePersonas[activeIndex];
  const content = locale === 'mn' ? currentPersona.mn : currentPersona.en;

  return (
    <section className="py-16 md:py-24 bg-ink relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <p className="text-center font-body text-main/60 text-xs tracking-[0.3em] uppercase mb-8">
          {locale === 'mn' ? "Таны Аялал, Таны Түүх" : "Find Your Journey"}
        </p>

        <div className="relative">
          <div className="relative aspect-[16/9] md:aspect-[2.5/1] overflow-hidden rounded-lg shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                // KEY CHANGE: The key now includes locale to force re-render if language changes
                key={`${currentPersona.id}-${locale}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 }
                }}
                className="absolute inset-0"
              >
                <Image
                  // USE LOCALIZED IMAGE
                  src={content.image}
                  alt={content.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {visiblePersonas.length > 1 && (
              <>
                <button
                  onClick={() => handlePaginate(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors border border-white/10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => handlePaginate(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors border border-white/10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-body text-main/50 text-sm">
                  0{activeIndex + 1}
                </span>
                <div className="h-[1px] w-12 bg-surface/20" />
                <span className="font-body text-main/50 text-sm">
                  0{visiblePersonas.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  // Force re-render on locale change for text animations too
                  key={`${currentPersona.id}-${locale}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-main mb-3 tracking-wide">
                    {content.title}
                  </h3>
                  <p className="font-body text-main/70 max-w-xl text-lg font-light leading-relaxed">
                    {content.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <Link
              href={`${localePrefix}${content.href}`}
              className="group inline-flex items-center gap-3 font-body text-sm tracking-[0.15em] uppercase text-main hover:text-white transition-colors border border-surface/30 px-6 py-3 rounded-full hover:bg-white/5"
            >
              <span>{locale === 'mn' ? "Дэлгэрэнгүй" : "Explore"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex justify-center gap-2 mt-12 md:mt-0 md:absolute md:top-6 md:right-6 z-20">
            {visiblePersonas.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? "bg-white w-6" 
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}