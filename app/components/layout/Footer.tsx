"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const localePrefix = locale === 'mn' ? '/mn' : '';

  const experienceLinks = [
    { key: "stay", href: "#" },
    { key: "dining", href: "#" },
    { key: "wellness", href: "#" },
    { key: "adventures", href: "#" },
  ];

  const resortLinks: { key: string; href: string; external?: boolean; enOnly?: boolean }[] = [
    { key: "about", href: "/about-us" },
    { key: "catalogue", href: "https://online.fliphtml5.com/scxec/iewd/", external: true },
    { key: "gallery", href: "#" },
    { key: "faq", href: "#" },
    { key: "route-finder", href: "#", enOnly: true }
  ];

  return (
    <footer className="sticky bottom-0 z-0 bg-ink text-main font-body">
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 md:pb-28 lg:pb-36">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10 lg:gap-8">

          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={localePrefix || "/"} className="inline-block hover:opacity-90 transition-opacity">
              <img
                src="/images/logo-white.png"
                alt="Dalai Eej Resort"
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-main/70 leading-relaxed max-w-xs">
              {t("bio")}
            </p>
          </div>

          {/* Column 2: Experience */}
          <div className="min-w-0">
            <h4 className="text-xs tracking-[0.2em] uppercase text-main/50 mb-4 md:mb-6">
              {t("experience")}
            </h4>
            <ul className="space-y-3">
              {experienceLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href="#"
                    className="text-sm text-main/80 hover:text-white transition-colors"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resort */}
          <div className="min-w-0">
            <h4 className="text-xs tracking-[0.2em] uppercase text-main/50 mb-4 md:mb-6">
              {t("resort")}
            </h4>
            <ul className="space-y-3">
              {resortLinks.filter((item) => !item.enOnly || locale === 'en').map((item) => (
                <li key={item.key}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-main/80 hover:text-white transition-colors"
                    >
                      {t(item.key)}
                    </a>
                  ) : (
                    <Link
                      href={item.href === "#" ? "#" : `${localePrefix}${item.href}`}
                      className="text-sm text-main/80 hover:text-white transition-colors"
                    >
                      {t(item.key)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-xs tracking-[0.2em] uppercase text-main/50 mb-4 md:mb-6">
              {t("contact")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-main/50 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-main/80">
                  {t("address")}
                </span>
              </li>
              <li>
                <a 
                  href="tel:+97695005595" 
                  className="flex items-center gap-3 text-sm text-main/80 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-main/50 flex-shrink-0" />
                  +976 9500 5595
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@dalaieej.com" 
                  className="flex items-center gap-3 text-sm text-main/80 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-main/50 flex-shrink-0" />
                  hello@dalaieej.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR: Copyright & Agency Credits */}
        <div className="mt-8 pt-6 md:mt-12 md:pt-8 border-t border-surface/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-main/40">
          <p>
            &copy; 2026 Dalai Eej Resort. {t("rights")}
          </p>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 mt-4 md:mt-0 text-center md:text-right">

            {/* The London Flex */}
            <div className="group">
              <span className="opacity-50 mr-2">{t("digital")}:</span>
              <a 
                href="https://matterofform.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-normal"
              >
                MOF London
              </a>
            </div>

            {/* Divider */}
            <span className="hidden md:inline opacity-30">|</span>

            {/* The Mongolian Flex */}
            <div className="group">
              <span className="opacity-50 mr-2">{t("brand")}:</span>
              <a 
                href="https://brainstorm.agency" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-normal"
              >
                Brainstorm
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
