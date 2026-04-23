"use client";

/**
 * /gallery — Visual Journey.
 *
 * A close visual port of the Meritage Resort gallery
 * (https://www.meritageresort.com/gallery), restyled with the Dalai Eej voice.
 *
 * Layout register:
 *   1. HEADER — centred italic serif "Gallery" on a warm cream ground with
 *      an underline-on-active horizontal filter nav (no pill chips).
 *   2. STAGGERED 3-COLUMN GRID — square-ish tiles where the middle column is
 *      offset downward (Meritage's signature rhythm). Tile heights vary so
 *      the columns interlock into a quiet staircase.
 *   3. LIGHTBOX — full-bleed overlay with prev/next/close, keyboard-navigable
 *      (ArrowLeft / ArrowRight / Escape).
 *
 * All gallery imagery is served from /images/gallery and grouped by
 * gallery category folders for easier content management.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type FilterId =
  | "all"
  | "resort"
  | "rooms"
  | "dining"
  | "wellness"
  | "adventures"
  | "lake";

type GalleryImage = {
  src: string;
  category: Exclude<FilterId, "all">;
  alt: string;
  /** Aspect ratio used by the tile — creates the Meritage rhythm. */
  ratio: "portrait" | "landscape" | "square";
};

/* -------------------------------------------------------------------------- */
/*  Curated images (all hosted under /public/images/gallery)                  */
/* -------------------------------------------------------------------------- */

const IMAGES: GalleryImage[] = [
  // Row 1
  { src: "/images/gallery/the-resort/lodge-first-light-shore.jpg", category: "resort", alt: "Lodge at first light, seen from the shore", ratio: "landscape" },
  { src: "/images/gallery/wine-and-dine/chefs-table-lake-dining.jpg", category: "dining", alt: "Chef's table in the lake-facing dining room", ratio: "portrait" },
  { src: "/images/gallery/the-lake/eastern-ridge-sunset.jpg", category: "lake", alt: "Eastern ridge at sunset over Lake Khuvsgul", ratio: "landscape" },

  // Row 2
  { src: "/images/gallery/accommodations/lakeside-cabin-morning-light.jpg", category: "rooms", alt: "Lakeside cabin — morning light through linen", ratio: "portrait" },
  { src: "/images/gallery/wine-and-dine/house-made-bread-wild-herb-butter.jpg", category: "dining", alt: "House-made bread and wild-herb butter", ratio: "landscape" },
  { src: "/images/gallery/spa-and-wellness/birch-steam-sauna-afternoon.jpg", category: "wellness", alt: "Birch-steam sauna, afternoon session", ratio: "portrait" },

  // Row 3
  { src: "/images/gallery/accommodations/superior-cabin-living-room-firelit.jpg", category: "rooms", alt: "Superior cabin living room, fire lit", ratio: "landscape" },
  { src: "/images/gallery/the-resort/main-lodge-low-cloud.jpg", category: "resort", alt: "Main lodge exterior under low cloud", ratio: "portrait" },
  { src: "/images/gallery/wine-and-dine/evening-service-deck.jpg", category: "dining", alt: "Evening service on the deck", ratio: "landscape" },

  // Row 4
  { src: "/images/gallery/spa-and-wellness/warm-stone-massage-candlelight.jpg", category: "wellness", alt: "Warm-stone massage room, candlelight", ratio: "square" },
  { src: "/images/gallery/adventures/horseback-haichin-valley.png", category: "adventures", alt: "Horseback ride along the Haichin valley", ratio: "portrait" },
  { src: "/images/gallery/accommodations/grand-peninsula-suite-lake-view.jpg", category: "rooms", alt: "Grand Peninsula suite, lake view", ratio: "landscape" },

  // Row 5
  { src: "/images/gallery/wine-and-dine/hand-plated-seasonal-entree.jpg", category: "dining", alt: "Hand-plated seasonal entrée", ratio: "landscape" },
  { src: "/images/gallery/wine-and-dine/dining-room-at-dusk.jpg", category: "dining", alt: "Dining room at dusk", ratio: "portrait" },
  { src: "/images/gallery/accommodations/grand-peninsula-bedroom-sunrise.jpg", category: "rooms", alt: "Grand Peninsula bedroom at sunrise", ratio: "landscape" },

  // Row 6
  { src: "/images/gallery/accommodations/bath-suite-stone-cedar.jpg", category: "rooms", alt: "Bath suite, stone and cedar", ratio: "portrait" },
  { src: "/images/gallery/the-resort/lodge-walkway-late-summer.png", category: "resort", alt: "Walkway to the lodge in late summer", ratio: "landscape" },
  { src: "/images/gallery/wine-and-dine/late-evening-dessert-course.jpg", category: "dining", alt: "Late-evening dessert course", ratio: "portrait" },

  // Row 7
  { src: "/images/gallery/the-lake/shoreline-mergens-ridge.jpg", category: "lake", alt: "Shoreline at the foot of Mergen's Ridge", ratio: "landscape" },
  { src: "/images/gallery/wine-and-dine/mongolian-wine-pairing.jpg", category: "dining", alt: "Wine pairing, Mongolian vineyard selection", ratio: "square" },
  { src: "/images/gallery/accommodations/grand-peninsula-facing-peninsula.jpg", category: "rooms", alt: "Grand Peninsula, facing the peninsula", ratio: "landscape" },
];

const FILTERS_EN: Record<FilterId, string> = {
  all: "All",
  resort: "The Resort",
  rooms: "Accommodations",
  dining: "Wine & Dine",
  wellness: "Spa & Wellness",
  adventures: "Adventures",
  lake: "The Lake",
};

const FILTERS_MN: Record<FilterId, string> = {
  all: "Бүгд",
  resort: "Ресорт",
  rooms: "Байр",
  dining: "Хоол & Дарс",
  wellness: "Спа & Сайн сайхан",
  adventures: "Адал явдал",
  lake: "Хөвсгөл",
};

const FILTER_ORDER: FilterId[] = [
  "all",
  "resort",
  "rooms",
  "dining",
  "wellness",
  "adventures",
  "lake",
];

/* -------------------------------------------------------------------------- */
/*  Meritage staircase — tiles step up/down, middle column sits offset.       */
/* -------------------------------------------------------------------------- */

const RATIO_CLASS: Record<GalleryImage["ratio"], string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function GalleryGrid() {
  const locale = useLocale();
  const isMn = locale === "mn";
  const labels = isMn ? FILTERS_MN : FILTERS_EN;
  const headlineFont = isMn ? "font-editorial-mn" : "font-editorial-en";

  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = useMemo(
    () =>
      activeFilter === "all"
        ? IMAGES
        : IMAGES.filter((img) => img.category === activeFilter),
    [activeFilter]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + filteredImages.length) % filteredImages.length
    );
  }, [filteredImages.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % filteredImages.length
    );
  }, [filteredImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightboxIndex]);

  const activeImage =
    lightboxIndex === null ? null : filteredImages[lightboxIndex];

  return (
    <main
      id="main-content"
      className="min-h-screen pt-24 md:pt-32 pb-24 md:pb-32"
      style={{ backgroundColor: "#f4efe6" }}
    >
      {/* =============================================================== HEAD */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`${headlineFont} italic text-[#223127] text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.02] font-normal`}
          >
            {isMn ? "Галерей" : "Gallery"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-body text-[#223127]/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
          >
            {isMn
              ? "Хөвсгөлийн хэмнэл — бууц, нуур, хоол, тайван агшнууд."
              : "A visual journey through the lodge, the lake, and the quiet hours between."}
          </motion.p>

          {/* ========================================================= FILTERS */}
          <nav
            aria-label={isMn ? "Галерейн ангилал" : "Gallery categories"}
            className="mt-12 md:mt-16"
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-10">
              {FILTER_ORDER.map((id) => {
                const isActive = activeFilter === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setActiveFilter(id)}
                      aria-pressed={isActive}
                      className={`font-cta uppercase text-[11px] md:text-xs tracking-[0.22em] transition-colors duration-300 pb-1 border-b ${
                        isActive
                          ? "text-[#223127] border-[#223127]"
                          : "text-[#223127]/55 border-transparent hover:text-[#223127]"
                      }`}
                    >
                      {labels[id]}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      {/* ================================================================= GRID */}
      <section className="px-4 md:px-8 mt-14 md:mt-20">
        <div className="mx-auto max-w-[1280px]">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => {
                // Middle column is offset downward (Meritage staircase).
                const columnOffset =
                  index % 3 === 1 ? "lg:mt-16 xl:mt-24" : "lg:mt-0";

                return (
                  <motion.button
                    key={`${image.src}-${activeFilter}`}
                    type="button"
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{
                      duration: 0.55,
                      delay: Math.min(index * 0.04, 0.35),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => setLightboxIndex(index)}
                    aria-label={image.alt}
                    className={`group relative block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#223127] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4efe6] ${columnOffset}`}
                  >
                    <div
                      className={`${RATIO_CLASS[image.ratio]} w-full overflow-hidden bg-[#e7dfce]`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-[#223127]/0 transition-colors duration-500 group-hover:bg-[#223127]/10" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filteredImages.length === 0 && (
            <p className="mt-20 text-center font-body text-[#223127]/60">
              {isMn
                ? "Энэ ангилалд одоогоор зураг байхгүй байна."
                : "No images in this collection yet."}
            </p>
          )}
        </div>
      </section>

      {/* ============================================================ LIGHTBOX */}
      <AnimatePresence>
        {activeImage && lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isMn ? "Гэрэл зургийн дэлгэрэнгүй" : "Gallery viewer"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0b0f0c]/95 backdrop-blur-sm p-4 md:p-10"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              aria-label={isMn ? "Хаах" : "Close"}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full p-2"
            >
              <X className="h-7 w-7" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label={isMn ? "Өмнөх" : "Previous image"}
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full p-2"
            >
              <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label={isMn ? "Дараах" : "Next image"}
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full p-2"
            >
              <ChevronRight className="h-8 w-8 md:h-10 md:w-10" aria-hidden="true" />
            </button>

            <motion.figure
              key={activeImage.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-h-full max-w-6xl flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-h-[80vh] w-auto max-w-full object-contain"
              />
              <figcaption className="flex w-full items-center justify-between gap-6 font-cta uppercase tracking-[0.22em] text-[11px] text-white/70">
                <span>{labels[activeImage.category]}</span>
                <span>
                  {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
                  {String(filteredImages.length).padStart(2, "0")}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
