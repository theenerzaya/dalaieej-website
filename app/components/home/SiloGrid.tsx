"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { playfairDisplayItalic } from "@/app/fonts";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const silos = [
  {
    id: "stay",
    href: /*"/accommodation",*/ "#",
    en: "Cabins",
    mn: "Өрөөнүүд",
    image: "/images/silogrid/sanctuary.webp"
  },
  {
    id: "dining",
    href: /*"/dining",*/ "#",
    en: "Restaurant",
    mn: "Ресторан",
    image: "/images/silogrid/hearth.webp"
  },
  {
    id: "wellness",
    href: /*"/wellness",*/ "#",
    en: "Wellness",
    mn: "Алжаал тайлах",
    image: "/images/silogrid/wellness.webp"
  },
  {
    id: "adventure",
    href: /*"/experiences",*/ "#",
    en: "Experiences",
    mn: "Аялал",
    image: "/images/silogrid/wilderness.webp"
  }
];

const storiesSilo = {
  id: "stories",
  href: "#",
  en: "Stories",
  mn: "Нийтлэл",
  image: "/images/silogrid/stories-placeholder.webp"
};

interface MobileSiloProps {
  silo: typeof silos[0];
  localePrefix: string;
  isMongolian: boolean;
  index: number;
}

function MobileSilo({
  silo,
  localePrefix,
  isMongolian,
  index,
}: MobileSiloProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isStoriesMnTitle = isMongolian && silo.id === "stories";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // % of the motion layer (≈ card height), not vh — avoids iOS toolbar resize jank.
  const y = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);

  return (
    <motion.div
      ref={ref}
      className="relative h-[80vh] min-h-[600px] w-full shrink-0 bg-gray-900 overflow-hidden z-0"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        delay: reduceMotion ? 0 : index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
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
            className={
              silo.id === "stories"
                ? "w-full h-full object-cover object-center"
                : "w-full h-full object-cover"
            }
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Motion Text Layer */}
        {/* Added 'pointer-events-none' to prevent cursor interaction glitches */}
        <motion.div 
          style={{ y, willChange: "transform" }} 
          className="absolute inset-x-0 top-[30%] flex flex-col items-center px-4 z-10 pointer-events-none"
        >
          <h3
            className={[
              isMongolian
                ? `${playfairDisplayItalic.className} italic font-normal`
                : "font-sloops",
              isStoriesMnTitle
                ? "text-[2.025rem] md:text-[2.7rem] text-white text-center tracking-wider leading-none mb-6 drop-shadow-lg"
                : "text-4xl md:text-5xl text-white text-center tracking-wider leading-none mb-6 drop-shadow-lg",
            ].join(" ")}
          >
            {isMongolian ? silo.mn : silo.en}
          </h3>

          <span className="text-[10px] tracking-[0.4em] uppercase text-white/90 border-b border-white/40 pb-1 mt-8 drop-shadow-md">
            {isMongolian ? "ТАНИЛЦАХ" : "DISCOVER"}
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function SiloGrid() {
  const locale = useLocale();
  const localePrefix = locale === 'mn' ? '/mn' : '';
  const isMongolian = locale === 'mn';
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full bg-white">
      {/* Mobile Stack */}
      <div className="flex flex-col w-full md:hidden bg-white [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-solid [&>*:not(:first-child)]:border-white">
        {silos.map((silo, i) => (
          <MobileSilo
            key={silo.id}
            silo={silo}
            localePrefix={localePrefix}
            isMongolian={isMongolian}
            index={i}
          />
        ))}
        <MobileSilo
          key={storiesSilo.id}
          silo={storiesSilo}
          localePrefix={localePrefix}
          isMongolian={isMongolian}
          index={silos.length}
        />
      </div>

      {/* Desktop Grid */}
      <div
        className="hidden md:grid grid-cols-2 w-full bg-white gap-x-px gap-y-px"
        style={{ columnGap: "1px", rowGap: "1px" }}
      >
        {silos.map((silo, i) => (
          <motion.div
            key={silo.id}
            className="relative h-[80vh] w-full bg-gray-900 overflow-hidden group"
            initial={
              reduceMotion
                ? { opacity: 1, y: 0, x: 0 }
                : { opacity: 0, y: 28, x: -28 }
            }
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: reduceMotion ? 0 : 0.65,
              // Grid is filled row-wise: left → right, then next row (same reading order).
              delay: reduceMotion ? 0 : i * 0.11,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
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
                <h3
                  className={[
                    isMongolian
                      ? `${playfairDisplayItalic.className} italic font-normal`
                      : "font-sloops",
                    "text-4xl lg:text-7xl text-white text-center tracking-wider drop-shadow-lg",
                  ].join(" ")}
                >
                  {isMongolian ? silo.mn : silo.en}
                </h3>
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/90 border-b border-white/40 pb-1 mt-8 group-hover:border-white transition-colors duration-300 drop-shadow-md">
                  {isMongolian ? "ТАНИЛЦАХ" : "DISCOVER"}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Stories — full-width row spanning both columns */}
        <motion.div
          className="relative col-span-2 h-[80vh] w-full bg-gray-900 overflow-hidden group"
          initial={
            reduceMotion
              ? { opacity: 1, y: 0, x: 0 }
              : { opacity: 0, y: 28, x: -28 }
          }
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            delay: reduceMotion ? 0 : silos.length * 0.11,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Link
            href={`${localePrefix}${storiesSilo.href}`}
            className="relative block w-full h-full"
          >
            <img
              src={storiesSilo.image}
              alt={isMongolian ? storiesSilo.mn : storiesSilo.en}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-x-0 top-[30%] flex flex-col items-center px-4 z-10">
              <h3
                className={[
                  isMongolian
                    ? `${playfairDisplayItalic.className} italic font-normal`
                    : "font-sloops",
                  isMongolian
                    ? "text-[2.025rem] lg:text-[4.05rem] text-white text-center tracking-wider drop-shadow-lg"
                    : "text-4xl lg:text-7xl text-white text-center tracking-wider drop-shadow-lg",
                ].join(" ")}
              >
                {isMongolian ? storiesSilo.mn : storiesSilo.en}
              </h3>
              <span className="text-[10px] tracking-[0.4em] uppercase text-white/90 border-b border-white/40 pb-1 mt-8 group-hover:border-white transition-colors duration-300 drop-shadow-md">
                {isMongolian ? "ТАНИЛЦАХ" : "DISCOVER"}
              </span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}