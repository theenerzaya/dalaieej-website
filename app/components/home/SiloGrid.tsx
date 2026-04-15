"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const silos = [
  {
    id: "stay",
    href: /*"/accommodation",*/ "#",
    en: "Sanctuary",
    mn: "Өргөө",
    image: "/images/silogrid/sanctuary.webp"
  },
  {
    id: "dining",
    href: /*"/dining",*/ "#",
    en: "Hearth",
    mn: "Гал голомт",
    image: "/images/silogrid/hearth.webp"
  },
  {
    id: "wellness",
    href: /*"/wellness",*/ "#",
    en: "Stillness",
    mn: "Анир",
    image: "/images/silogrid/wellness.webp"
  },
  {
    id: "adventure",
    href: /*"/experiences",*/ "#",
    en: "Wilderness",
    mn: "Хөвч",
    image: "/images/silogrid/wilderness.webp"
  }
];

interface MobileSiloProps {
  silo: typeof silos[0];
  localePrefix: string;
  isMongolian: boolean;
}

function MobileSilo({ silo, localePrefix, isMongolian }: MobileSiloProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // % of the motion layer (≈ card height), not vh — avoids iOS toolbar resize jank.
  const y = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);

  return (
    <div 
      ref={ref}
      className="relative h-[80vh] min-h-[600px] w-full shrink-0 border-b border-white/10 bg-gray-900 overflow-hidden z-0"
    >
      <Link
        href={`${localePrefix}${silo.href}`}
        className="relative block w-full h-full"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={silo.image}
            alt={isMongolian ? silo.mn : silo.en}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Motion Text Layer */}
        {/* Added 'pointer-events-none' to prevent cursor interaction glitches */}
        <motion.div 
          style={{ y, willChange: "transform" }} 
          className="absolute inset-x-0 top-[30%] flex flex-col items-center px-4 z-10 pointer-events-none"
        >
          <h3 className={`${isMongolian ? 'font-serif' : 'font-sloops'} text-5xl md:text-6xl text-white text-center tracking-wider leading-none mb-6 drop-shadow-lg`}>
            {isMongolian ? silo.mn : silo.en}
          </h3>

          <span className="text-[10px] tracking-[0.4em] uppercase text-white/90 border-b border-white/40 pb-1 mt-8 drop-shadow-md">
            {isMongolian ? "ДЭЛГЭРЭНГҮЙ" : "DISCOVER"}
          </span>
        </motion.div>
      </Link>
    </div>
  );
}

export default function SiloGrid() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const isMongolian = locale === 'mn';

  return (
    <section className="bg-white w-full">
      {/* Mobile Stack */}
      <div className="flex flex-col w-full md:hidden">
        {silos.map((silo) => (
          <MobileSilo
            key={silo.id}
            silo={silo}
            localePrefix={localePrefix}
            isMongolian={isMongolian}
          />
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 w-full">
        {silos.map((silo) => (
          <div key={silo.id} className="relative h-[80vh] w-full bg-gray-900 overflow-hidden group">
            <Link
              href={`${localePrefix}${silo.href}`}
              className="relative block w-full h-full"
            >
              <img
                src={silo.image}
                alt={isMongolian ? silo.mn : silo.en}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute inset-x-0 top-[30%] flex flex-col items-center px-4 z-10">
                <h3 className={`${isMongolian ? 'font-serif' : 'font-sloops'} text-5xl lg:text-8xl text-white text-center tracking-wider drop-shadow-lg`}>
                  {isMongolian ? silo.mn : silo.en}
                </h3>
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/90 border-b border-white/40 pb-1 mt-8 group-hover:border-white transition-colors duration-300 drop-shadow-md">
                  {isMongolian ? "ДЭЛГЭРЭНГҮЙ" : "DISCOVER"}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}