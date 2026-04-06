"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Location {
  id: string;
  category: "accommodation" | "activities";
  left: number;
  top: number;
  image?: string;
}

const locations: Location[] = [
  { id: 'reception', category: 'accommodation', left: 66.27, top: 66.2, image: '/images/map/reception.jpg' },
  { id: 'annex', category: 'accommodation', left: 54.44, top: 63.5, image: '/images/map/annex.jpg' },
  { id: 'ensuite', category: 'accommodation', left: 28.32, top: 79.5, image: '/images/map/ensuite.jpg' },
  { id: 'heritage', category: 'accommodation', left: 47.88, top: 63.43, image: '/images/map/heritage.jpg' },
  { id: 'grand', category: 'accommodation', left: 41.23, top: 71.4, image: '/images/map/grand.jpg' },
  { id: 'bathhouse', category: 'accommodation', left: 69.01, top: 71.3, image: '/images/map/bathhouse.jpg' },
  { id: 'sauna', category: 'activities', left: 95.43, top: 75.53, image: '/images/map/sauna.jpg' },
  { id: 'pier', category: 'activities', left: 93.37, top: 66.03, image: '/images/map/pier.jpg' },
  { id: 'basketball', category: 'activities', left: 77.55, top: 63.6, image: '/images/map/basketball.jpg' },
  { id: 'volleyball', category: 'activities', left: 71.22, top: 62.87, image: '/images/map/volleyball.jpg' },
  { id: 'entrance', category: 'activities', left: 34.1, top: 51.3, image: '/images/map/entrance.jpg' },
  { id: 'overland', category: 'activities', left: 19.43, top: 99.7, image: '/images/map/overland.jpg' },
  { id: 'parking', category: 'activities', left: 0.03, top: 58.1, image: '/images/map/parking.jpg' }
];

type TabType = "accommodation" | "activities";

export default function InteractiveMap() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabType>("accommodation");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const filteredLocations = locations.filter(loc => loc.category === activeTab);
  const isArrowMarker = (id: string) => id === 'overland' || id === 'parking';

  const handleHotspotClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveHotspot(activeHotspot === id ? null : id);
  };

  const handleBackgroundClick = () => {
    setActiveHotspot(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setActiveHotspot(null);
  };

  return (
    <section className="bg-surface-alt py-20 px-8">
      {/* Hidden Preloader for Hotspot Images */}
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

        <div className="flex justify-center mb-6">
          {/* ... [Tabs Logic - Unchanged] ... */}
          <div className="inline-flex bg-ink/10 rounded-full p-1">
            <button
              onClick={() => handleTabChange("accommodation")}
              className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-300 ${
                activeTab === "accommodation"
                  ? "bg-ink text-main shadow-md"
                  : "text-ink hover:bg-ink/10"
              }`}
            >
              {t('map.tabs.accommodation')}
            </button>
            <button
              onClick={() => handleTabChange("activities")}
              className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-300 ${
                activeTab === "activities"
                  ? "bg-ink text-main shadow-md"
                  : "text-ink hover:bg-ink/10"
              }`}
            >
              {t('map.tabs.activities')}
            </button>
          </div>
        </div>

        {/* --- FIXED CONTAINER --- */}
        <div 
          // FIX 1: Changed 'overflow-hidden' to 'overflow-visible' so popups can stick out
          className="relative w-full overflow-visible z-10 cursor-pointer" 
          style={{ aspectRatio: '6876 / 3000' }}
          onClick={handleBackgroundClick}
        >
          <Image
            src="/images/resort-map.jpg"
            alt="Dalai Eej Resort Map"
            fill
            priority
            // FIX 2: Moved rounding and shadow to the Image itself
            className="object-cover rounded-lg shadow-2xl"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-20"
            >
              {filteredLocations.map((location) => (
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
                        : `w-[38px] h-[36px] rounded-full ${
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
                        {location.image && (
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
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center font-body text-ink/50 text-sm mt-4">
          {t('map.hint')}
        </p>
      </div>
    </section>
  );
}