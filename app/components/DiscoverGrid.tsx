/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const gridItems = [
  {
    id: "rooms",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80",
    titleKey: "discover.rooms",
    href: "/booking"
  },
  {
    id: "dining",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=80",
    titleKey: "discover.dining",
    href: "#dining"
  },
  {
    id: "wellness",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&auto=format&fit=crop&q=80",
    titleKey: "discover.wellness",
    href: "#wellness"
  },
  {
    id: "experiences",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=80",
    titleKey: "discover.experiences",
    href: "#tours"
  }
];

export default function DiscoverGrid() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/mn') ? 'mn' : 'en';
  const localePrefix = currentLocale === 'mn' ? '/mn' : '';

  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {gridItems.map((item) => (
          <a
            key={item.id}
            href={item.href.startsWith('/') ? `${localePrefix}${item.href}` : item.href}
            className="group relative h-[50vh] md:h-[60vh] overflow-hidden"
          >
            <img
              src={item.image}
              alt={t(item.titleKey)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="font-sloops text-3xl md:text-4xl lg:text-5xl text-white text-center tracking-wider capitalize">
                {t(item.titleKey)}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
