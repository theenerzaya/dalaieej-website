"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { BodyText, Headline } from "../ui/Typography";

/** Google Maps place listing */
const MAP_URL =
  "https://www.google.com/maps/place/Dalai+Eej+Resort+%7C+Далай+ээж+ресорт/@50.449042,100.148914,13z/data=!4m9!3m8!1s0x5d0dbb730711f929:0xb57b13f8b35c0cf3!5m2!4m1!1i2!8m2!3d50.4846951!4d100.1893209!16s%2Fg%2F11stqvr5td?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D";
/** Driving directions from Murun Airport */
const DIRECTIONS_AIRPORT_URL =
  "https://www.google.com/maps/dir/Murun+Airport,+M37W%2BM9Q,+Murun,+Khovsgol,+Mongolia/Dalai+Eej+Resort+%7C+Далай+ээж+ресорт,+Mergen's+Ridge,+Khatgal,+Khovsgol+67143,+Mongolia/@50.0646492,99.4429743,9z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x5d0d29f43fffffff:0x6f9b57b06e76be73!2m2!1d100.0959984!2d49.6642244!1m5!1m1!1s0x5d0dbb730711f929:0xb57b13f8b35c0cf3!2m2!1d100.1893209!2d50.4846951!3e0?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D";
/** Driving directions from Khatgal village */
const DIRECTIONS_CITY_URL =
  "https://www.google.com/maps/dir/Khatgal,+Khovsgol,+Mongolia/Dalai+Eej+Resort+%7C+Далай+ээж+ресорт,+Mergen's+Ridge,+Khatgal,+Khovsgol+67143,+Mongolia/@50.449042,100.148914,13z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x5d0dba5f265ed071:0xbfeab22f3128d8b8!2m2!1d100.16109!2d50.4359649!1m5!1m1!1s0x5d0dbb730711f929:0xb57b13f8b35c0cf3!2m2!1d100.1893209!2d50.4846951!3e0?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D";

const PHONE = "+976 9500 5595";
const PHONE_HREF = "tel:+97695005595";
const EMAIL = "reservations@dalaieej.com";
const EMAIL_HREF = "mailto:reservations@dalaieej.com";

export default function AddressSection() {
  const t = useTranslations("address");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const localePrefix = locale === "mn" ? "/mn" : "";
  const editorialFont =
    locale === "mn" ? "font-editorial-mn" : "font-editorial-en";

  const cardBase =
    "relative flex flex-col justify-between bg-earth text-main p-8 md:p-12 min-h-[260px] md:min-h-[360px]";

  const inlineLink =
    "underline decoration-main decoration-[1px] underline-offset-[6px] hover:decoration-main/60 transition-colors";

  return (
    <section className="bg-ink px-6 pt-16 md:pt-20 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Headline as="h2" size="section" tone="dark">
            {t("title")}
          </Headline>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Left card — Visit Us */}
          <div className={`${cardBase} md:col-span-1`}>
            <BodyText
              size="sm"
              align="left"
              className="!text-main/90 max-w-[32ch]"
            >
              {t("visitCopy")}
            </BodyText>

            <Link
              href={`${localePrefix}/contact`}
              className={`${editorialFont} mt-10 inline-block text-2xl md:text-3xl text-main hover:text-main/70 transition-colors`}
            >
              {t("visitCta")}
            </Link>
          </div>

          {/* Right card — Holidays / contact / directions */}
          <div className={`${cardBase} md:col-span-2`}>
            <div className="flex flex-col gap-5">
              <h3
                className={`${editorialFont} text-main text-3xl md:text-4xl lg:text-5xl leading-snug`}
              >
                {t("stayHeadline")}
              </h3>
              <BodyText
                align="left"
                size="md"
                className="!text-main/90 max-w-[60ch]"
              >
                {t("bestPrice")}
              </BodyText>
            </div>

            <div className="mt-8 flex flex-col gap-2 font-body text-sm md:text-base text-main/90 leading-relaxed">
              <p>
                {t("fullAddress")}{" "}
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={inlineLink}
                >
                  ({t("mapLabel")})
                </a>
              </p>
              <p>
                <span className="text-main/85">{t("coordinatesLabel")}:</span>{" "}
                <span className="tabular-nums">{t("coordinatesValue")}</span>
              </p>
              <p>
                <a href={PHONE_HREF} className={inlineLink}>
                  {PHONE}
                </a>
              </p>
              <p>
                <a href={EMAIL_HREF} className={inlineLink}>
                  {EMAIL}
                </a>
              </p>
              <p>
                <Link
                  href={`${localePrefix}/booking`}
                  className={inlineLink}
                >
                  {t("manageReservation")}
                </Link>
              </p>
            </div>

            <p className="mt-6 font-body text-sm md:text-base text-main/80 leading-relaxed">
              {t("directionsLabel")}{" "}
              <a
                href={DIRECTIONS_CITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={inlineLink}
              >
                {t("directionsFromCity")}
              </a>
              {", "}
              <a
                href={DIRECTIONS_AIRPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={inlineLink}
              >
                {t("directionsFromAirport")}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
