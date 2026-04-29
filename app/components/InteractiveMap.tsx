"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BodyText, Eyebrow, Headline } from "./ui/Typography";

type CategoryId = "stays" | "amenities" | "gettingAround";

interface Location {
  id: string;
  left: number;
  top: number;
  category: CategoryId;
  image?: string;
  noImage?: boolean;
}

const locations: Location[] = [
  { id: 'annex',     left: 54.44, top: 63.50, category: 'stays',         image: '/images/map/annex.jpg' },
  { id: 'ensuite',   left: 28.32, top: 79.50, category: 'stays',         image: '/images/map/ensuite.jpg' },
  { id: 'heritage',  left: 47.88, top: 63.43, category: 'stays',         image: '/images/map/heritage.jpg' },
  { id: 'grand',     left: 41.23, top: 71.40, category: 'stays',         image: '/images/map/grand.jpg' },

  { id: 'reception', left: 66.27, top: 66.20, category: 'amenities',     image: '/images/map/reception.jpg' },
  { id: 'bathhouse', left: 69.01, top: 71.30, category: 'amenities',     image: '/images/map/bathhouse.jpg' },
  { id: 'sauna',     left: 95.43, top: 75.53, category: 'amenities',     image: '/images/map/sauna.webp' },
  { id: 'pier',      left: 93.37, top: 66.03, category: 'amenities',     image: '/images/map/pier.webp' },
  { id: 'courts',    left: 74.38, top: 63.20, category: 'amenities',     image: '/images/map/courts.jpg' },

  { id: 'entrance',  left: 34.10, top: 51.30, category: 'gettingAround', noImage: true },
  { id: 'overland',  left: 19.43, top: 99.70, category: 'gettingAround', image: '/images/map/overland.jpg' },
  { id: 'parking',   left:  0.03, top: 58.10, category: 'gettingAround', noImage: true },
];

const categoryOrder: CategoryId[] = ["stays", "amenities", "gettingAround"];

// Staggered "drop-from-above" reveal for the map markers, triggered on scroll-in.
const hotspotContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.07,
    },
  },
};

const hotspotItemVariants: Variants = {
  hidden: { y: -48, opacity: 0, scale: 0.6 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 11,
      stiffness: 170,
      mass: 0.9,
    },
  },
};

// Softer "drop-from-above" for the heading and hint text.
const textContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.12,
    },
  },
};

const textItemVariants: Variants = {
  hidden: { y: -28, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 16,
      stiffness: 150,
      mass: 0.8,
    },
  },
};

const MAP_FULLBLEED_SRC = "/images/map/resort-map.jpg";

export default function InteractiveMap() {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  // Avoid rendering the portal during SSR to prevent `document` usage errors.
  const [portalMounted] = useState(() => typeof window !== "undefined");
  const [fullscreenMapImage, setFullscreenMapImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    if (!fullscreenMapImage) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenMapImage(null);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreenMapImage]);

  const isArrowMarker = (id: string) => id === 'overland' || id === 'parking';

  // Per-category numbering (1..n within each category), matching the legend below.
  const numberById = useMemo(() => {
    const map = new Map<string, number>();
    for (const category of categoryOrder) {
      let n = 1;
      for (const loc of locations) {
        if (loc.category === category) {
          map.set(loc.id, n++);
        }
      }
    }
    return map;
  }, []);

  const locationsByCategory = useMemo(() => {
    const grouped: Record<CategoryId, Location[]> = {
      stays: [],
      amenities: [],
      gettingAround: [],
    };
    for (const loc of locations) grouped[loc.category].push(loc);
    return grouped;
  }, []);

  const handleHotspotClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveHotspot(activeHotspot === id ? null : id);
  };

  const openMapFullBleed = () => {
    setActiveHotspot(null);
    setFullscreenMapImage({ src: MAP_FULLBLEED_SRC, alt: "Dalai Eej Resort Map" });
  };

  const activeLocation =
    activeHotspot !== null
      ? locations.find((l) => l.id === activeHotspot) ?? null
      : null;

  return (
    <section className="bg-surface pt-24 md:pt-32 pb-[3.45rem] md:pb-[4.6rem] mb-[3.45rem] md:mb-[4.6rem] px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 flex flex-col items-center gap-6"
          variants={reduceMotion ? undefined : textContainerVariants}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={reduceMotion ? undefined : textItemVariants}>
            <Eyebrow>{t("map.eyebrow")}</Eyebrow>
          </motion.div>
          <motion.div variants={reduceMotion ? undefined : textItemVariants}>
            <Headline as="h2" size="section">{t("map.title")}</Headline>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative w-full overflow-visible z-10 cursor-pointer touch-manipulation select-none [-webkit-touch-callout:none]"
          style={{ aspectRatio: "6876 / 3000" }}
          role="button"
          tabIndex={0}
          aria-label={t("map.mapFullBleedLabel")}
          onClick={openMapFullBleed}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            openMapFullBleed();
          }}
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Image
            src={MAP_FULLBLEED_SRC}
            alt="Dalai Eej Resort Map"
            fill
            draggable={false}
            className="object-cover object-center rounded-lg shadow-2xl touch-manipulation select-none [-webkit-touch-callout:none]"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />

          <motion.div
            className="absolute inset-0 z-20"
            variants={reduceMotion ? undefined : hotspotContainerVariants}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.25 }}
          >
            {locations.map((location) => {
              const number = numberById.get(location.id);
              const isActive = activeHotspot === location.id;
              const isArrow = isArrowMarker(location.id);
              return (
                <div
                  key={location.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 ${isActive ? 'z-50' : 'z-20'}`}
                  style={{ top: `${location.top}%`, left: `${location.left}%` }}
                >
                  <motion.div
                    variants={reduceMotion ? undefined : hotspotItemVariants}
                    style={{ transformOrigin: "center top" }}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleHotspotClick(e, location.id)}
                      aria-label={t(`map.${location.id}.title`)}
                      aria-expanded={isActive}
                      className={`relative inline-flex items-center justify-center transition-all duration-300 ${
                        isArrow
                          ? `p-0.5 rounded-md md:p-1 ${
                              isActive
                                ? "bg-surface-alt text-bark scale-110"
                                : "bg-bark/80 text-main hover:bg-bark hover:scale-110"
                            }`
                          : `h-6 w-6 rounded-full md:h-7 md:w-7 ${
                              isActive
                                ? "bg-surface-alt text-bark scale-110 ring-2 ring-bark"
                                : "bg-bark text-main hover:bg-bark-hover hover:scale-110"
                            }`
                      }`}
                    >
                      {isArrow ? (
                        <ArrowUpRight className="h-3 w-3 rotate-180 md:h-4 md:w-4" aria-hidden="true" />
                      ) : (
                        <span className="font-cta text-[11px] md:text-xs font-medium leading-none" aria-hidden="true">
                          {number}
                        </span>
                      )}
                      {!isArrow && !isActive && (
                        <span className="absolute inset-0 rounded-full bg-bark/30 animate-ping" />
                      )}
                    </button>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-4"
          variants={reduceMotion ? undefined : textItemVariants}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.3 }}
        >
          <BodyText size="sm" align="center" className="!text-water-deep/60">
            {t("map.hint")}
          </BodyText>
        </motion.div>

        <motion.div
          className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 md:gap-x-14 gap-y-10"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.55,
            delay: reduceMotion ? 0 : 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {categoryOrder.map((category) => {
            const items = locationsByCategory[category];
            if (!items.length) return null;
            return (
              <div key={category} className="flex flex-col">
                <Eyebrow className="!text-water-deep/70">
                  {t(`map.categories.${category}`)}
                </Eyebrow>
                <div className="mt-4 border-t border-water-deep/15">
                  <ul className="flex flex-col">
                    {items.map((loc) => {
                      const number = numberById.get(loc.id);
                      const isActive = activeHotspot === loc.id;
                      return (
                        <li key={loc.id} className="border-b border-water-deep/10">
                          <button
                            type="button"
                            onClick={() => setActiveHotspot(loc.id)}
                            aria-label={t(`map.${loc.id}.title`)}
                            aria-expanded={isActive}
                            className="group flex w-full items-center gap-4 py-3.5 text-left transition-colors"
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-cta text-[11px] font-medium leading-none transition-colors ${
                                isActive
                                  ? "bg-surface-alt text-bark ring-2 ring-bark"
                                  : "bg-bark text-main group-hover:bg-bark-hover"
                              }`}
                              aria-hidden="true"
                            >
                              {number}
                            </span>
                            <span className="flex-1 font-body text-sm md:text-base text-water-deep/85 group-hover:text-water-deep transition-colors">
                              {t(`map.${loc.id}.title`)}
                            </span>
                            <ChevronRight
                              className="h-4 w-4 text-water-deep/40 transition-all group-hover:text-water-deep/80 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeLocation && (
          <motion.div
            key={activeLocation.id}
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-ink/40 p-2 sm:p-4"
            onClick={() => setActiveHotspot(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md md:max-w-lg max-h-[min(90dvh,100vh)] overflow-y-auto overflow-x-hidden bg-surface rounded-xl shadow-xl pb-[max(1rem,env(safe-area-inset-bottom))]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`map-dialog-title-${activeLocation.id}`}
            >
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                aria-label={t(`map.${activeLocation.id}.title`) + ' — close'}
                className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center bg-surface/90 rounded-full text-ink/70 hover:text-ink hover:bg-surface transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
              {activeLocation.image && !activeLocation.noImage && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={activeLocation.image}
                    alt={t(`map.${activeLocation.id}.title`)}
                    fill
                    draggable={false}
                    className="object-cover object-center touch-manipulation select-none [-webkit-touch-callout:none]"
                    sizes="(max-width: 768px) 100vw, 448px"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col gap-4">
                <Headline
                  as="h3"
                  size="section"
                  align="left"
                  className=""
                >
                  <span id={`map-dialog-title-${activeLocation.id}`}>
                    {t(`map.${activeLocation.id}.title`)}
                  </span>
                </Headline>
                <BodyText align="left" className="!text-water-deep/70">
                  {t(`map.${activeLocation.id}.desc`)}
                </BodyText>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    {portalMounted && fullscreenMapImage
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={fullscreenMapImage.alt}
            className="fixed inset-0 z-[200]"
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-black/90"
              aria-label={t("map.mapFullBleedCloseLabel")}
              onClick={() => setFullscreenMapImage(null)}
            />
            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center p-4 pt-16 md:p-8">
              <div
                className="pointer-events-auto relative w-full h-full flex items-center justify-center"
                onClick={() => setFullscreenMapImage(null)}
              >
                <Image
                  src={fullscreenMapImage.src}
                  alt={fullscreenMapImage.alt}
                  fill
                  draggable={false}
                  sizes="100vw"
                  className="object-contain shadow-2xl cursor-zoom-in select-none [-webkit-touch-callout:none]"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFullscreenMapImage(null)}
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              aria-label={t("map.mapFullBleedCloseLabel")}
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>,
          document.body
        )
      : null}
    </section>
  );
}
