"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/app/components/layout/PageShell";
import {
  BodyText,
  CTALink,
  Eyebrow,
  Headline,
} from "@/app/components/ui/Typography";
import GettingHereToc, {
  type GettingHereTocItem,
} from "@/app/components/getting-here/GettingHereToc";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import MediaPlaceholder from "@/app/components/getting-here/MediaPlaceholder";
import TransferOptions, {
  type TransferOption,
} from "@/app/components/getting-here/TransferOptions";
import AccessRoadMap from "@/app/components/getting-here/AccessRoadMap";
import FrostedMapSection from "@/app/components/getting-here/FrostedMapSection";
import SiteImage from "@/app/components/SiteImage";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ALMANAC_CHAPTERS as EN_CHAPTERS } from "@/app/data/almanacChapters";
import { ALMANAC_CHAPTERS as MN_CHAPTERS } from "@/app/data/almanacChapters.mn";
import { Car, Ship } from "lucide-react";

const MAP_URL =
  "https://www.google.com/maps/place/Dalai+Eej+Resort+%7C+Далай+ээж+ресорт/@50.449042,100.148914,13z/data=!4m9!3m8!1s0x5d0dbb730711f929:0xb57b13f8b35c0cf3!5m2!4m1!1i2!8m2!3d50.4846951!4d100.1893209!16s%2Fg%2F11stqvr5td?entry=ttu";

const ITINERARY_EMAIL_SUBJECT = "Arrival itinerary - Dalai Eej Resort";
const ITINERARY_EMAIL_BODY = [
  "Dear Dalai Eej team,",
  "",
  "I would like to share my arrival itinerary:",
  "",
  "Name:",
  "Booking reference (if applicable):",
  "Arrival date:",
  "Flight or transport details:",
  "Estimated arrival time in Murun or Khatgal:",
  "",
  "Thank you,",
].join("\n");
const ITINERARY_MAILTO = `mailto:hello@dalaieej.com?subject=${encodeURIComponent(ITINERARY_EMAIL_SUBJECT)}&body=${encodeURIComponent(ITINERARY_EMAIL_BODY)}`;

function SectionBlock({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-16 first:pt-0">
      <FadeInBlock>
        <Eyebrow className="!text-water-deep/70 mb-4">{eyebrow}</Eyebrow>
        <Headline as="h2" size="sub" className="!text-left mb-8">
          {title}
        </Headline>
      </FadeInBlock>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Subhead({ children }: { children: ReactNode }) {
  return (
    <Headline
      as="h3"
      size="sub"
      align="left"
      className="!text-ink/90 mt-10 mb-4 text-xl md:!text-2xl"
    >
      {children}
    </Headline>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <BodyText size="md" className="!text-left max-w-none text-ink/75">
      {children}
    </BodyText>
  );
}

function OptionalProse({ text }: { text: string }) {
  if (!text) return null;
  return <Prose>{text}</Prose>;
}

function LabelledText({
  label,
  body,
}: {
  label: string;
  body: string;
}) {
  return (
    <>
      <strong className="font-medium text-ink">{label}</strong> {body}
    </>
  );
}

function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 font-body text-base md:text-lg text-ink/75 leading-relaxed">
      {items.map((item, i) => (
        <li key={i}>
          <p>{item}</p>
        </li>
      ))}
    </ul>
  );
}

function CarrierCard({
  name,
  description,
  href,
  external,
  linkLabel,
}: {
  name: string;
  description: string;
  href: string;
  external?: boolean;
  linkLabel?: string;
}) {
  return (
    <div className="bg-surface-alt/80 p-6 md:p-8">
      <p className="font-cta text-[11px] uppercase tracking-[0.25em] text-leaf mb-2">
        {name}
      </p>
      <Prose>{description}</Prose>
      {href !== "#" && linkLabel && (
        <div className="mt-4">
          <CTALink href={href} external={external}>
            {linkLabel}
          </CTALink>
        </div>
      )}
    </div>
  );
}

export default function GettingHerePage() {
  const locale = useLocale();
  const t = useTranslations("gettingHerePage");
  const localePrefix = locale === "mn" ? "/mn" : "";
  const chapters = locale === "mn" ? MN_CHAPTERS : EN_CHAPTERS;
  const nextChapter = chapters.find((c) => c.id === "chapter-ii");
  const reduceMotion = useReducedMotion();

  const TOC_ITEMS: GettingHereTocItem[] = [
    { id: "domestic-flights", label: t("toc.section1") },
    { id: "overland-driving", label: t("toc.section2") },
    { id: "coaches-railway", label: t("toc.section3") },
    { id: "murun-to-resort", label: t("toc.section4") },
  ];

  const transferOptions: TransferOption[] = [
    {
      id: "resort-transfer",
      icon: Ship,
      title: t("section4.transfer1.title"),
      meta: t("section4.transfer1.meta"),
      body: t("section4.transfer1.body"),
      href: ITINERARY_MAILTO,
      linkLabel: t("section4.transfer1.link"),
    },
    {
      id: "ubcab",
      icon: Car,
      title: t("section4.transfer2.title"),
      meta: t("section4.transfer2.meta"),
      body: t("section4.transfer2.body"),
      href: "https://onelink.to/ubcab",
      linkLabel: t("section4.transfer2.link"),
      external: true,
    },
  ];

  return (
    <PageShell offsetNavbar={false}>
      <FrostedMapSection
        aria-label={t("hero.title")}
        className="pb-16 md:pb-24 pt-[calc(var(--navbar-h)+2.5rem)] md:pt-[calc(var(--navbar-h)+3.5rem)] min-h-[min(58vh,32rem)]"
        imageSrc="/images/almanac/getting-here/bulgan-province-overland-road.jpeg"
        imagePriority
        frostOpacity={13.87}
        frostBlurPx={6.2}
        mapObjectPosition="50% 45%"
      >
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
        >
          <Eyebrow className="!text-water-deep/70 mb-6">
            {t("hero.eyebrow")}
          </Eyebrow>
          <Headline as="h1" size="section">
            {t("hero.title")}
          </Headline>
        </motion.div>
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.15,
          }}
        >
          <BodyText size="md" className="max-w-2xl">
            {t("hero.subtitle")}
          </BodyText>
        </motion.div>
        <div
          id="hero-nav-sentinel"
          aria-hidden
          className="pointer-events-none h-px w-full shrink-0"
        />
      </FrostedMapSection>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <FadeInBlock className="mb-12 md:mb-16">
            <CTALink
              href={`${localePrefix}/almanac`}
              arrow={false}
              className="!text-ink/50 hover:!text-water-deep [&>span]:!border-ink/20 [&>span]:group-hover:!border-water-deep/40"
            >
              {t("backToAlmanac")}
            </CTALink>
          </FadeInBlock>

          <article
            aria-label={t("ariaArrivalGuide")}
            className="lg:grid lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-20"
          >
            <aside className="mb-12 lg:mb-0">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <FadeInBlock>
                  <GettingHereToc items={TOC_ITEMS} />
                </FadeInBlock>
              </div>
            </aside>

            <div className="min-w-0 space-y-0">
              <SectionBlock
                id="domestic-flights"
                eyebrow={t("section1.eyebrow")}
                title={t("section1.title")}
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.murunAirport.label")}
                    imageSrc="/images/almanac/getting-here/murun-airport-exterior.jpg"
                    imageAlt={t("media.murunAirport.alt")}
                    aspectClass="aspect-[4/3] md:aspect-[21/9]"
                    imageClassName="object-cover"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Prose>
                    {t("section1.p1")}
                  </Prose>
                  <OptionalProse text={t("section1.p2")} />
                  <OptionalProse text={t("section1.p3")} />
                </FadeInBlock>
                <FadeInBlock delay={0.15}>
                  <div className="grid gap-4 md:grid-cols-1">
                    <CarrierCard
                      name={t("section1.miat.name")}
                      description={t("section1.miat.desc")}
                      linkLabel={t("section1.miat.link")}
                      href={
                        locale === "mn"
                          ? "https://miat.com/mn"
                          : "https://miat.com/en"
                      }
                      external
                    />
                    <CarrierCard
                      name={t("section1.hunnu.name")}
                      description={t("section1.hunnu.desc")}
                      linkLabel={t("section1.hunnu.link")}
                      href={
                        locale === "mn"
                          ? "https://www.hunnuair.com/mn/timetable"
                          : "https://www.hunnuair.com/en/timetable"
                      }
                      external
                    />
                    <CarrierCard
                      name={t("section1.chinggis.name")}
                      description={t("section1.chinggis.desc")}
                      href="#"
                    />
                  </div>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock
                id="overland-driving"
                eyebrow={t("section2.eyebrow")}
                title={t("section2.title")}
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.overlandRoute.label")}
                    imageSrc="/images/almanac/getting-here/bulgan-province-overland-road.jpeg"
                    imageAlt={t("media.overlandRoute.alt")}
                    aspectClass="aspect-[4/3]"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Prose>
                    {t("section2.p1")}
                  </Prose>
                  <Subhead>{t("section2.sub1")}</Subhead>
                  <Prose>
                    {t("section2.p2")}
                  </Prose>
                </FadeInBlock>
                <FadeInBlock delay={0.15}>
                  <Subhead>{t("section2.sub2")}</Subhead>
                  <Prose>
                    {t("section2.p3")}
                  </Prose>
                  <Subhead>{t("section2.sub3")}</Subhead>
                  <Prose>
                    {t("section2.p4")}
                  </Prose>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock
                id="coaches-railway"
                eyebrow={t("section3.eyebrow")}
                title={t("section3.title")}
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.trainTravel.label")}
                    imageSrc="/images/almanac/getting-here/train.jpg"
                    imageAlt={t("media.trainTravel.alt")}
                    aspectClass="aspect-[8/5] md:aspect-[21/9]"
                    imageClassName="object-cover"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Subhead>{t("section3.sub1")}</Subhead>
                  <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
                    <div className="min-w-0 flex-1 space-y-6">
                      <Prose>
                        {t("section3.p1")}
                      </Prose>
                      <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                        <CTALink
                          href="https://eticket.ubtz.mn/search"
                          external
                        >
                          {t("section3.ubtzLink")}
                        </CTALink>
                      </div>
                      {t("section3.motorbike") ? (
                        <Prose>
                          <LabelledText
                            label={t("section3.motorbikeLabel")}
                            body={t("section3.motorbike")}
                          />
                        </Prose>
                      ) : null}
                    </div>
                    <figure className="mx-auto w-[13rem] shrink-0 md:mx-0 md:w-[14rem] lg:w-[15rem]">
                      <p className="font-cta text-[10px] uppercase tracking-[0.25em] text-ink/45 mb-2">
                        {t("section3.bowieEyebrow")}
                      </p>
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink/5">
                        <SiteImage
                          src="/images/almanac/getting-here/david-bowie-trans-siberian-railway-1973.jpg"
                          alt={t("section3.bowieAlt")}
                          title="David Bowie on the Trans-Siberian Railway"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 208px, 240px"
                        />
                      </div>
                      <figcaption className="mt-3 font-body text-sm leading-snug text-ink/60">
                        <p>{t("section3.bowieCaption")}</p>
                        <p className="mt-1">{t("section3.bowieCredit")}</p>
                      </figcaption>
                    </figure>
                  </div>
                </FadeInBlock>
                <FadeInBlock delay={0.15}>
                  <Subhead>{t("section3.sub2")}</Subhead>
                  <Prose>
                    {t("section3.p2")}
                  </Prose>
                  {t("section3.vipCoach") ? (
                    <BulletList
                      items={[
                        <LabelledText
                          key="vip"
                          label={t("section3.vipCoachLabel")}
                          body={t("section3.vipCoach")}
                        />,
                        <LabelledText
                          key="standard"
                          label={t("section3.standardCoachLabel")}
                          body={t("section3.standardCoach")}
                        />,
                        ...(t("section3.bookingCoach")
                          ? [
                              locale === "en" ? (
                                <LabelledText
                                  key="booking"
                                  label={t("section3.bookingCoachLabel")}
                                  body={t("section3.bookingCoach")}
                                />
                              ) : (
                                <span key="booking">{t("section3.bookingCoach")}</span>
                              ),
                            ]
                          : []),
                      ]}
                    />
                  ) : null}
                  <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                    <CTALink
                      href={
                        locale === "mn"
                          ? "https://eticket.transdep.mn/?language=mn"
                          : "https://eticket.transdep.mn/?language=en"
                      }
                      external
                    >
                      {t("section3.transdepLink")}
                    </CTALink>
                  </div>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock
                id="murun-to-resort"
                eyebrow={t("section4.eyebrow")}
                title={t("section4.title")}
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.murunTerminal.label")}
                    imageSrc="/images/almanac/getting-here/murun-airport-terminal-interior.jpg"
                    imageAlt={t("media.murunTerminal.alt")}
                    aspectClass="aspect-[4/3] md:aspect-[21/9]"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Subhead>{t("section4.sub1")}</Subhead>
                  <Prose>
                    {t("section4.p1")}
                  </Prose>
                </FadeInBlock>
                <FadeInBlock delay={0.12}>
                  <Subhead>{t("section4.sub2")}</Subhead>
                  <Prose>
                    {t("section4.p2")}
                  </Prose>
                  <OptionalProse text={t("section4.p3")} />
                  {t("section4.note") ? (
                    <BodyText
                      size="md"
                      className="!text-left max-w-none italic text-ink/55"
                    >
                      {t("section4.note")}
                    </BodyText>
                  ) : null}
                  <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                    <CTALink href={MAP_URL} external>
                      {t("section4.mapLink")}
                    </CTALink>
                  </div>
                  <FadeInBlock delay={0.05} className="mt-6">
                    <AccessRoadMap className="mx-auto w-full md:w-1/2" />
                  </FadeInBlock>
                </FadeInBlock>
                <FadeInBlock delay={0.15}>
                  <Subhead>{t("section4.sub3")}</Subhead>
                  <Prose>
                    {t("section4.p4")}
                  </Prose>
                  <TransferOptions options={transferOptions} />
                </FadeInBlock>
              </SectionBlock>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 pb-4 md:pb-6">
        <div className="mx-auto max-w-6xl">
          <FadeInBlock>
            <div className="flex justify-end border-t border-ink/10 pt-12">
              {nextChapter ? (
                <Link
                  href={`${localePrefix}${nextChapter.href}`}
                  className="group text-right font-body text-sm text-ink/60 transition-colors hover:text-water-deep"
                >
                  <span className="font-cta text-[10px] uppercase tracking-[0.25em] text-ink/40">
                    {locale === "mn" ? "Дараах" : "Next"}
                  </span>
                  <span className="mt-1 block text-base text-ink group-hover:text-water-deep">
                    {nextChapter.eyebrow} — {nextChapter.title}
                  </span>
                </Link>
              ) : null}
            </div>
          </FadeInBlock>
        </div>
      </section>

      <FrostedMapSection
        aria-label={t("destination.eyebrow")}
        className="py-24 md:py-32"
        contentClassName="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center"
        fadeTop
        fadeBottom={false}
      >
        <FadeInBlock className="flex w-full flex-col items-center gap-8 text-center">
          <Eyebrow className="!text-water-deep/70">{t("destination.eyebrow")}</Eyebrow>
          <Headline as="h2" size="sub">
            {t("destination.title")}
          </Headline>
          <BodyText size="md" className="max-w-xl">
            {t("destination.subtitle")}
          </BodyText>
          <CTALink href={`${localePrefix}/accommodation`} arrow>
            {t("destination.link")}
          </CTALink>
        </FadeInBlock>
      </FrostedMapSection>
    </PageShell>
  );
}
