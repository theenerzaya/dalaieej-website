"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SearchableItem {
  href: string;
  label: string;
  mn: string;
  description: string;
  mnDescription: string;
  keywords: string[];
}

const searchablePages: SearchableItem[] = [
  {
    href: "/",
    label: "Home",
    mn: "Нүүр",
    description: "Heritage site & resort at Lake Khuvsgul, Mongolia",
    mnDescription: "Хөвсгөл нуурын эрэг дэх уламжлалт амралт",
    keywords: ["home", "main", "нүүр", "resort", "ресорт"],
  },
  {
    href: "/accommodation",
    label: "Stay",
    mn: "Байрлах",
    description: "Heritage cabins, suites & the Grand Peninsula Suite",
    mnDescription: "Модон байшин, тухтай хаус, Өргөө тусгай хаус",
    keywords: ["stay", "rooms", "cabins", "suites", "accommodation", "өрөө", "байшин", "байрлах"],
  },
  {
    href: "/dining",
    label: "Dining",
    mn: "Зоог",
    description: "Restaurant with Mongolian and European cuisine",
    mnDescription: "Монгол болон Европ хоолтой зоогийн газар",
    keywords: ["dining", "food", "restaurant", "menu", "хоол", "зоог", "nourish"],
  },
  {
    href: "/wellness",
    label: "Wellness",
    mn: "Сэргээлт",
    description: "Traditional sauna & wellness facilities",
    mnDescription: "Уламжлалт саун болон сэргээх үйлчилгээ",
    keywords: ["wellness", "sauna", "spa", "relax", "restore", "сэргээлт", "саун"],
  },
  {
    href: "/experiences",
    label: "Adventures",
    mn: "Адал явдал",
    description: "Guided tours, horse trekking & lake excursions",
    mnDescription: "Хөтөчтэй аялал, морин аялал, нуурын аялал",
    keywords: ["adventures", "experiences", "activities", "horse", "hiking", "аялал", "адал явдал"],
  },
  {
    href: "/about-us",
    label: "Our Story",
    mn: "Бидний тухай",
    description: "The heritage and mission behind Dalai Eej",
    mnDescription: "Далай Ээж Ресортын түүх ба зорилго",
    keywords: ["about", "story", "heritage", "history", "түүх", "тухай"],
  },
  {
    href: "/booking",
    label: "Book Your Stay",
    mn: "Захиалга өгөх",
    description: "Check availability and reserve your cabin",
    mnDescription: "Захиалга шалгаж, байрлах газраа захиалаарай",
    keywords: ["book", "booking", "reserve", "availability", "захиалга"],
  },
  {
    href: "/offers",
    label: "Special Offers",
    mn: "Тусгай саналууд",
    description: "Summer 2026 packages, early bird deals & romantic escapes",
    mnDescription: "2026 оны зуны багцууд, эрт захиалгын хөнгөлөлт",
    keywords: ["offers", "deals", "packages", "discount", "санал", "хөнгөлөлт"],
  },
  {
    href: "/amenities",
    label: "Amenities",
    mn: "Үйлчилгээ",
    description: "Private shoreline, restaurant, sauna & guided tours",
    mnDescription: "Хувийн эрэг, зоогийн газар, саун, хөтөчтэй аялал",
    keywords: ["amenities", "facilities", "services", "үйлчилгээ"],
  },
  {
    href: "/gallery",
    label: "Gallery",
    mn: "Зургийн сан",
    description: "Photos of Khuvsgul Lake, cabins & wilderness",
    mnDescription: "Хөвсгөл нуур, модон байшин, байгалийн зургууд",
    keywords: ["gallery", "photos", "images", "зураг", "зургийн сан"],
  },
  {
    href: "/contact",
    label: "Contact",
    mn: "Холбоо барих",
    description: "Get in touch — Khatgal Village, Khuvsgul Province",
    mnDescription: "Холбогдох — Хатгал тосгон, Хөвсгөл аймаг",
    keywords: ["contact", "phone", "email", "location", "холбоо барих"],
  },
  {
    href: "/catalogue",
    label: "Journal",
    mn: "Сэтгүүл",
    description: "The 2026 resort journal & editorial archive",
    mnDescription: "2026 оны ресортын сэтгүүл",
    keywords: ["journal", "catalogue", "blog", "articles", "сэтгүүл", "нийтлэл"],
  },
  {
    href: "/route-finder",
    label: "Route Finder",
    mn: "Замын чиглэл",
    description: "Find directions to Dalai Eej Resort",
    mnDescription: "Далай Ээж Ресорт руу хэрхэн хүрэх",
    keywords: ["route", "directions", "map", "how to get", "зам", "чиглэл"],
  },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const pathname = usePathname();
  const isMongolian = pathname.startsWith("/mn");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return searchablePages;

    return searchablePages
      .map((item) => {
        const fields = [
          item.label,
          item.mn,
          item.description,
          item.mnDescription,
          ...item.keywords,
        ];
        const score = fields.reduce((acc, field) => {
          const lower = field.toLowerCase();
          if (lower === q) return acc + 10;
          if (lower.startsWith(q)) return acc + 5;
          if (lower.includes(q)) return acc + 2;
          return acc;
        }, 0);
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  const localePrefix = isMongolian ? "/mn" : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={isMongolian ? "Хайлт" : "Search"}
          className="fixed inset-0 z-[100] bg-leaf/98 backdrop-blur-sm flex flex-col"
        >
          <div className="max-w-3xl w-full mx-auto px-6 md:px-8 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between pt-6 md:pt-8 pb-4 shrink-0">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-main/50">
                {isMongolian ? "Хайлт" : "Search"}
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-surface/50"
                aria-label="Close search"
              >
                <X className="w-6 h-6 text-main" />
              </button>
            </div>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="relative shrink-0"
            >
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-main/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isMongolian ? "Юу хайж байна вэ..." : "What are you looking for..."}
                className="w-full bg-transparent border-b border-white/20 focus:border-white/50 outline-none pl-10 pr-4 py-4 font-serif text-2xl md:text-3xl text-white placeholder:text-main/30 transition-colors"
              />
            </motion.div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto mt-8 pb-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="space-y-1"
              >
                {results.length > 0 ? (
                  results.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * Math.min(i, 8) }}
                    >
                      <Link
                        href={`${localePrefix}${item.href}`}
                        onClick={onClose}
                        className="group flex items-center justify-between gap-4 px-4 py-4 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-serif text-lg md:text-xl text-main/80 group-hover:text-white transition-colors truncate">
                            {isMongolian ? item.mn : item.label}
                          </div>
                          <div className="font-body text-xs md:text-sm text-main/40 group-hover:text-main/60 transition-colors mt-0.5 truncate">
                            {isMongolian ? item.mnDescription : item.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-main/20 group-hover:text-white shrink-0 transition-all group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <p className="font-body text-sm text-main/40">
                      {isMongolian
                        ? "Үр дүн олдсонгүй"
                        : "No results found"}
                    </p>
                    <p className="font-body text-xs text-main/25 mt-2">
                      {isMongolian
                        ? "Өөр түлхүүр үгээр хайна уу"
                        : "Try a different search term"}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
