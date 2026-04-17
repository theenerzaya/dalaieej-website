"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { cormorantGaramondItalic } from "@/app/fonts";

interface Location {
  id: string;
  left: number;
  top: number;
  image?: string;
  noImage?: boolean;
}

const locations: Location[] = [
  { id: 'reception', left: 66.27, top: 66.2, image: '/images/map/reception.jpg' },
  { id: 'annex', left: 54.44, top: 63.5, image: '/images/map/annex.jpg' },
  { id: 'ensuite', left: 28.32, top: 79.5, image: '/images/map/ensuite.jpg' },
  { id: 'heritage', left: 47.88, top: 63.43, image: '/images/map/heritage.jpg' },
  { id: 'grand', left: 41.23, top: 71.4, image: '/images/map/grand.jpg' },
  { id: 'bathhouse', left: 69.01, top: 71.3, image: '/images/map/bathhouse.jpg' },
  { id: 'sauna', left: 95.43, top: 75.53, image: '/images/map/sauna.jpg' },
  { id: 'pier', left: 93.37, top: 66.03, image: '/images/map/pier.jpg' },
  { id: 'courts', left: 74.38, top: 63.2, image: '/images/map/courts.jpg' },
  { id: 'entrance', left: 34.1, top: 51.3, noImage: true },
  { id: 'overland', left: 19.43, top: 99.7, image: '/images/map/overland.jpg' },
  { id: 'parking', left: 0.03, top: 58.1, noImage: true }
];

export default function InteractiveMap() {
  const locale = useLocale();
  const isMn = locale === "mn";
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const isArrowMarker = (id: string) => id === 'overland' || id === 'parking';

  const handleHotspotClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveHotspot(activeHotspot === id ? null : id);
  };

  const handleBackgroundClick = () => {
    setActiveHotspot(null);
  };

  const activeLocation =
    activeHotspot !== null
      ? locations.find((l) => l.id === activeHotspot) ?? null
      : null;

  return (
    <section className="bg-surface pt-24 md:pt-32 pb-[6.9rem] md:pb-[9.2rem] mb-[6.9rem] md:mb-[9.2rem] px-6">
      <div className="hidden" aria-hidden="true">
        {locations.map((loc) => (
           loc.image && <Image key={loc.id} src={loc.image} alt="" width={10} height={10} priority />
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p
            className={[
              "text-ink/55 uppercase mb-6",
              isMn
                ? "text-[11px] sm:text-xs font-light tracking-[0.18em]"
                : "text-xs tracking-[0.3em]",
            ].join(" ")}
          >
            {t("map.eyebrow")}
          </p>
          <h2
            className={
              isMn
                ? `${cormorantGaramondItalic.className} italic font-normal text-3xl md:text-4xl lg:text-5xl leading-relaxed text-water-deep`
                : "font-light text-2xl md:text-3xl lg:text-4xl text-water-deep leading-relaxed"
            }
          >
            {t("map.title")}
          </h2>
        </motion.div>

        <motion.div
          className="relative w-full overflow-visible z-10 cursor-pointer touch-manipulation select-none [-webkit-touch-callout:none]"
          style={{ aspectRatio: "6876 / 3000" }}
          onClick={handleBackgroundClick}
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
            src="/images/resort-map.jpg"
            alt="Dalai Eej Resort Map"
            fill
            priority
            draggable={false}
            className="object-cover object-center rounded-lg shadow-2xl touch-manipulation select-none [-webkit-touch-callout:none]"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />

          <div className="absolute inset-0 z-20">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${activeHotspot === location.id ? 'z-50' : 'z-20'}`}
                style={{ top: `${location.top}%`, left: `${location.left}%` }}
              >
                <button
                  type="button"
                  onClick={(e) => handleHotspotClick(e, location.id)}
                  aria-label={t(`map.${location.id}.title`)}
                  aria-expanded={activeHotspot === location.id}
                  className={`relative inline-flex items-center justify-center transition-all duration-300 ${
                    isArrowMarker(location.id)
                      ? `p-0.5 rounded-md md:p-1 ${
                          activeHotspot === location.id
                            ? "bg-surface-alt text-leaf scale-110"
                            : "bg-leaf/80 text-main hover:bg-leaf hover:scale-110"
                        }`
                      : `h-5 w-5 rounded-full md:h-6 md:w-6 ${
                          activeHotspot === location.id
                            ? "bg-surface-alt text-leaf scale-110"
                            : "bg-leaf/80 text-main hover:bg-leaf hover:scale-110"
                        }`
                  }`}
                >
                  {isArrowMarker(location.id) ? (
                    <ArrowUpRight className="h-3 w-3 rotate-180 md:h-4 md:w-4" aria-hidden="true" />
                  ) : (
                    <span className="text-base leading-none font-light md:text-lg" aria-hidden="true">+</span>
                  )}
                  {!isArrowMarker(location.id) && (
                    <span className="absolute w-full h-full rounded-full bg-leaf/30 animate-ping" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          className="text-center font-body text-water-deep/60 text-sm font-light leading-relaxed mt-4"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {t("map.hint")}
        </motion.p>
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
              <div className="p-6">
                <h3
                  id={`map-dialog-title-${activeLocation.id}`}
                  className={
                    isMn
                      ? `${cormorantGaramondItalic.className} italic font-normal text-3xl md:text-4xl lg:text-5xl leading-relaxed text-water-deep mb-4`
                      : "font-light text-2xl md:text-3xl lg:text-4xl text-water-deep leading-relaxed mb-4"
                  }
                >
                  {t(`map.${activeLocation.id}.title`)}
                </h3>
                <p className="font-body text-lg font-light leading-relaxed text-water-deep/70">
                  {t(`map.${activeLocation.id}.desc`)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}