"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Headline } from "../ui/Typography";

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
    mn: "Амралт",
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

type SiloEntry = typeof silos[0];

/** Shared tile copy block used on both mobile and desktop. */
function SiloOverlay({
  silo,
  isMongolian,
  size = "section",
  positionClassName = "top-[30%]",
}: {
  silo: SiloEntry;
  isMongolian: boolean;
  size?: "section" | "hero";
  positionClassName?: string;
}) {
  const isStoriesMnTitle = isMongolian && silo.id === "stories";
  const headlineSize = size;
  /** EN: Sloops via `variant="signature"`. MN keeps Cormorant (Typography ignores signature for mn). */
  const headlineExtra = isStoriesMnTitle
    ? "!text-[2.025rem] md:!text-[2.7rem] lg:!text-[4.05rem]"
    : size === "hero"
      ? "!text-4xl md:!text-5xl lg:!text-7xl !leading-[1.1]"
      : "";

  return (
    <div className={`absolute inset-x-0 ${positionClassName} flex flex-col items-center px-4 z-10 pointer-events-none`}>
      <Headline
        as="h3"
        size={headlineSize}
        variant="signature"
        tone="dark"
        className={`text-white tracking-wider drop-shadow-lg mb-6 ${headlineExtra}`}
      >
        {isMongolian ? silo.mn : silo.en}
      </Headline>

      <span
        className={[
          "font-cta uppercase text-white/90 border-b border-white/40 pb-1 mt-8 group-hover:border-white transition-colors duration-300 drop-shadow-md",
          isMongolian
            ? "text-[10px] sm:text-[11px] font-light tracking-[0.18em]"
            : "text-[10px] font-medium tracking-[0.4em]",
        ].join(" ")}
      >
        {isMongolian ? "ТАНИЛЦАХ" : "DISCOVER"}
      </span>
    </div>
  );
}

interface MobileSiloProps {
  silo: SiloEntry;
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  /**
   * Pre-trigger (progress [0, 0.5]): no transform — the text rides with the
   * tile and lands at viewport 50% exactly when the tile is centered.
   * Post-trigger (progress [0.5, 1]): y ramps 0vh -> 90vh, which exactly
   * cancels the tile's continued upward motion. The text stays pinned at
   * viewport 50% while the tile slides up behind it, so visually the text
   * drifts down over the image at precisely 1:1 with the scroll (never
   * faster). Clipping at the tile's bottom edge — the seam where the next
   * silo begins — is what makes the text appear to sink under it.
   */
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? ["0vh", "0vh", "0vh"] : ["0vh", "0vh", "90vh"],
  );

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
        className="group relative block w-full h-full"
      >
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

        <motion.div
          style={{ y, willChange: "transform" }}
          className="absolute inset-0 pointer-events-none"
        >
          <SiloOverlay
            silo={silo}
            isMongolian={isMongolian}
            size="section"
            positionClassName="top-1/2 -translate-y-1/2"
          />
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
    <section className="relative z-10 w-full bg-surface">
      {/* Mobile Stack */}
      <div className="flex flex-col w-full md:hidden bg-surface [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-solid [&>*:not(:first-child)]:border-surface">
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
        className="hidden md:grid grid-cols-2 w-full bg-surface gap-x-px gap-y-px"
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
              <SiloOverlay silo={silo} isMongolian={isMongolian} size="hero" />
            </Link>
          </motion.div>
        ))}

        {/* Stories — full-width row */}
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
            <SiloOverlay silo={storiesSilo} isMongolian={isMongolian} size="hero" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
