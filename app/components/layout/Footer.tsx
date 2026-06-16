/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Eyebrow } from "../ui/Typography";
import { assetUrl } from "@/lib/assetUrl";
import { FOOTER_PARTNERS } from "@/lib/footerPartners";
import { withLocalePath } from "@/lib/localePath";

/** Shared row height — logos scale to fill this box (vertical centres align). */
const PARTNER_ROW_HEIGHT = "h-7 md:h-8";

const PARTNER_LOGO_CLASS =
  "block h-full w-auto object-contain object-center opacity-80 transition-opacity";

const PARTNER_LOGO_MAX_HEIGHT: Record<string, string> = {
  bradt: "max-h-7 md:max-h-8",
  "ha-travel": "max-h-7 md:max-h-8",
  telegraph: "max-h-[34px] md:max-h-[38px]",
};

const PARTNER_LOGO_MAX_WIDTH: Record<string, string> = {
  bradt: "max-w-[92px]",
  "ha-travel": "max-w-[112px]",
  telegraph: "max-w-[92px]",
};

const PARTNER_ITEM_CLASS = `flex ${PARTNER_ROW_HEIGHT} items-center justify-center`;

function FooterPartnerLogo({
  id,
  src,
  alt,
  className,
}: {
  id: string;
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={assetUrl(src)}
      alt={alt}
      draggable={false}
      className={[
        PARTNER_LOGO_CLASS,
        PARTNER_LOGO_MAX_HEIGHT[id] ?? "max-h-7 md:max-h-8",
        PARTNER_LOGO_MAX_WIDTH[id] ?? "max-w-[92px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const pathname = usePathname();
  const isAboutUs = pathname?.includes("/about-us");

  const experienceLinks: Array<{ key: string; href: string; active: boolean }> = [
    { key: "stay", href: "/cabins", active: true },
    { key: "dining", href: "/restaurant", active: true },
    { key: "wellness", href: "/wellness", active: false },
    { key: "adventures", href: "/experiences", active: true },
    { key: "stories", href: "/almanac", active: true },
  ];

  const resortLinks: {
    key: string;
    href: string;
    external?: boolean;
    enOnly?: boolean;
  }[] = [
    { key: "about", href: "/about-us" },
    { key: "catalogue", href: "/catalogue" },
    { key: "gallery", href: "/gallery" },
    { key: "gettingHere", href: "/getting-here" },
    { key: "policies", href: "#" },
  ];

  return (
    <footer className="sticky bottom-0 z-0 bg-ink text-main font-body">
      <div className="max-w-7xl mx-auto px-6 pt-8 md:pt-20 pb-10 md:pb-28 lg:pb-36">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-10 lg:gap-8">

          {/* Column 1: Brand */}
          <div
            className={`col-span-2 lg:col-span-1 ${
              isAboutUs ? "text-center md:text-left" : ""
            }`}
          >
            <Link
              href={withLocalePath(locale, "/")}
              className="relative inline-grid place-items-center hover:opacity-90 transition-opacity"
              aria-label="Dalai Eej Resort"
            >
              {isAboutUs ? (
                <img
                  src={assetUrl("/images/about-us/decorations/accent-5.png")}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="col-start-1 row-start-1 w-[18rem] h-auto select-none pointer-events-none opacity-50"
                />
              ) : null}
              <img
                src={isAboutUs ? assetUrl("/branding/logos/logo-white-text.png") : assetUrl("/branding/logos/logo-white.png")}
                alt="Dalai Eej Resort"
                className={
                  isAboutUs
                    ? "col-start-1 row-start-1 h-8 md:h-9 w-auto"
                    : "col-start-1 row-start-1 h-10 md:h-12 w-auto"
                }
              />
            </Link>
            <p
              className={`mt-3 md:mt-4 text-sm text-main/70 leading-relaxed max-w-xs whitespace-pre-line ${
                isAboutUs ? "mx-auto md:mx-0" : ""
              }`}
            >
              {t("bio")}
            </p>
          </div>

          {/* Column 2: Experience */}
          <div className="min-w-0">
            <div className="mb-3 md:mb-6">
              <Eyebrow tone="dark" className="!text-main/50">{t("experience")}</Eyebrow>
            </div>
            <ul className="space-y-2 md:space-y-3">
              {experienceLinks.map((item) => (
                <li key={item.key}>
                  {item.active ? (
                    <Link
                      href={withLocalePath(locale, item.href)}
                      className="text-sm text-main/80 hover:text-white transition-colors"
                    >
                      {t(item.key)}
                    </Link>
                  ) : (
                    <a href="#" aria-disabled="true" className="text-sm text-main/80 hover:text-white transition-colors">
                      {t(item.key)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resort */}
          <div className="min-w-0">
            <div className="mb-3 md:mb-6">
              <Eyebrow tone="dark" className="!text-main/50">{t("resort")}</Eyebrow>
            </div>
            <ul className="space-y-2 md:space-y-3">
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
                    item.href === "#" ? (
                      <a href="#" className="text-sm text-main/80 hover:text-white transition-colors">
                        {t(item.key)}
                      </a>
                    ) : (
                      <Link
                        href={withLocalePath(locale, item.href)}
                        className="text-sm text-main/80 hover:text-white transition-colors"
                      >
                        {t(item.key)}
                      </Link>
                    )
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-3 md:mb-6">
              <Eyebrow tone="dark" className="!text-main/50">{t("contact")}</Eyebrow>
            </div>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-main/50 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-main/80">
                  {t("address")}
                </span>
              </li>
              <li>
                <a 
                  href="tel:+97677809010" 
                  className="flex items-center gap-3 text-sm text-main/80 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-main/50 flex-shrink-0" />
                  +976 77 809010
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

            <nav aria-label={t("asFeaturedIn")} className="mt-6 md:mt-8">
              <ul
                className={`flex flex-wrap lg:flex-nowrap items-center gap-x-4 lg:gap-x-5 gap-y-3 ${PARTNER_ROW_HEIGHT}`}
              >
                {FOOTER_PARTNERS.map((partner) => (
                  <li key={partner.id} className={PARTNER_ITEM_CLASS}>
                    {partner.href ? (
                      <a
                        href={partner.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={partner.ariaLabel ?? partner.alt}
                        className={`${PARTNER_ITEM_CLASS} hover:[&_img]:opacity-100`}
                      >
                        <FooterPartnerLogo id={partner.id} src={partner.src} alt="" />
                      </a>
                    ) : (
                      <span
                        className={PARTNER_ITEM_CLASS}
                        aria-label={partner.alt}
                      >
                        <FooterPartnerLogo id={partner.id} src={partner.src} alt="" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* BOTTOM BAR: Copyright & Agency Credits */}
        <div className="mt-6 pt-4 md:mt-12 md:pt-8 border-t border-surface/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-main/40">
          <p>
            &copy; 2026 Dalai Eej Resort. {t("rights")}
          </p>

          <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-6 mt-3 md:mt-0 text-center md:text-right">

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
