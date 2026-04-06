"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

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
  { id: 'courts', left: 74.38, top: 63.2, image: '/images/map/basketball.jpg' },
  { id: 'entrance', left: 34.1, top: 51.3, noImage: true },
  { id: 'overland', left: 19.43, top: 99.7, image: '/images/map/overland.jpg' },
  { id: 'parking', left: 0.03, top: 58.1, noImage: true }
];

export default function InteractiveMap() {
  const t = useTranslations();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const isArrowMarker = (id: string) => id === 'overland' || id === 'parking';

  const handleHotspotClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveHotspot(activeHotspot === id ? null : id);
  };

  const handleBackgroundClick = () => {
    setActiveHotspot(null);
  };

  return (
    <section className="bg-surface-alt py-20 px-8">
      <div className="hidden">
        {locations.map((loc) => (
           loc.image && <Image key={loc.id} src={loc.image} alt="preload" width={10} height={10} priority />
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">
            {t('map.title')}
          </h2>
          <p className="font-body text-ink/70 max-w-2xl mx-auto text-lg">
            {t('map.subtitle')}
          </p>
        </div>

        <div 
          className="relative w-full overflow-visible z-10 cursor-pointer" 
          style={{ aspectRatio: '6876 / 3000' }}
          onClick={handleBackgroundClick}
        >
          <Image
            src="/images/resort-map.jpg"
            alt="Dalai Eej Resort Map"
            fill
            priority
            className="object-cover rounded-lg shadow-2xl"
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
                  onClick={(e) => handleHotspotClick(e, location.id)}
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isArrowMarker(location.id)
                      ? `w-[30.5px] h-[30.5px] rounded-md ${
                          activeHotspot === location.id
                            ? "bg-surface-alt text-leaf scale-110"
                            : "bg-leaf/80 text-main hover:bg-leaf hover:scale-110"
                        }`
                      : `w-[38px] h-[31.25px] rounded-full ${
                          activeHotspot === location.id
                            ? "bg-surface-alt text-leaf scale-110"
                            : "bg-leaf/80 text-main hover:bg-leaf hover:scale-110"
                        }`
                  }`}
                >
                  {isArrowMarker(location.id) ? (
                    <ArrowUpRight className="w-5 h-5 rotate-180" />
                  ) : (
                    <span className="text-2xl font-light">+</span>
                  )}
                  {!isArrowMarker(location.id) && (
                    <span className="absolute w-full h-full rounded-full bg-leaf/30 animate-ping" />
                  )}
                </button>

                <AnimatePresence>
                  {activeHotspot === location.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-12 left-1/2 -translate-x-1/2 w-72 bg-white rounded-xl shadow-xl overflow-hidden z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setActiveHotspot(null)}
                        className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center bg-white/90 rounded-full text-ink/70 hover:text-ink hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {location.image && !location.noImage && (
                        <div className="relative aspect-video w-full">
                          <Image
                            src={location.image}
                            alt={t(`map.${location.id}.title`)}
                            fill
                            className="object-cover"
                            sizes="288px" 
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-serif text-lg text-ink mb-2">
                          {t(`map.${location.id}.title`)}
                        </h3>
                        <p className="font-body text-sm text-ink/70">
                          {t(`map.${location.id}.desc`)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center font-body text-ink/50 text-sm mt-4">
          {t('map.hint')}
        </p>
      </div>
    </section>
  );
}