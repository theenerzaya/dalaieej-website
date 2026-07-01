"use client";

import type { ReactNode } from "react";
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
import FrostedMapSection from "@/app/components/getting-here/FrostedMapSection";
import { ArchivalCard } from "@/app/components/almanac/AlmanacArticlePrimitives";
import ContextualTestimonial from "@/app/components/testimonials/ContextualTestimonial";
import { SUGGESTED_PROGRAMME_PDF_PATH } from "@/lib/suggestedProgrammePdf";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

const EXPERIENCE_LINKS = {
  tumenEkh:
    "https://www.facebook.com/p/Tumen-Ekh-ensembleofficial-page-100090139782969/",
  tsagaanLavai: "https://tsagaanlavai.mn/?lang=en",
  chuchoMountain:
    "https://www.wikiloc.com/hiking-trails/mongolia-khyasaayaa-uul-5154270",
  sukhbaatarMuseum: "https://maps.app.goo.gl/Gpk4Ab9zjAQ6DchU9",
  localMarket: "https://maps.app.goo.gl/8hhA5upPR6Y28aKGA",
  galleria: "https://maps.app.goo.gl/5NyPbFWGRdUsezpQ9",
  stateDepartmentStore: "https://maps.app.goo.gl/xU8nJ39YZW67TL1m8",
} as const;

const PROSE_LINK_CLASS =
  "font-medium text-ink underline decoration-ink/25 underline-offset-2 transition-colors hover:text-water-deep hover:decoration-water-deep/40";

function InlineExternalArrow() {
  return (
    <span aria-hidden className="inline-block text-[0.85em] leading-none">
      ↗
    </span>
  );
}

function ExternalProseLink({
  href,
  children,
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  arrow?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${PROSE_LINK_CLASS}${arrow ? " inline-flex items-baseline gap-0.5" : ""}`}
    >
      {children}
      {arrow ? <InlineExternalArrow /> : null}
    </a>
  );
}

function SectionBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-16 first:pt-0">
      <FadeInBlock>
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

const MAP_LINK_CLASS =
  "inline-flex items-center gap-1 font-body text-sm text-ink/70 underline decoration-ink/25 underline-offset-2 transition-colors hover:text-water-deep hover:decoration-water-deep/40";

function MapSiteLinks({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={MAP_LINK_CLASS}
        >
          {link.label}
          <InlineExternalArrow />
        </a>
      ))}
    </div>
  );
}

function RateCard({
  name,
  meta,
  description,
}: {
  name: string;
  meta?: string;
  description: ReactNode;
}) {
  return (
    <div className="bg-surface-alt/80 p-6 md:p-8">
      <div
        className={
          meta
            ? "mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
            : "mb-3"
        }
      >
        <p className="font-cta text-[11px] uppercase tracking-[0.25em] text-leaf">
          {name}
        </p>
        {meta ? (
          <p className="font-cta text-[10px] uppercase tracking-[0.22em] text-ink/45 sm:shrink-0 sm:text-right">
            {meta}
          </p>
        ) : null}
      </div>
      <Prose>{description}</Prose>
    </div>
  );
}

export default function ExperiencesPage() {
  const locale = useLocale();
  const t = useTranslations("experiencesPage");
  const localePrefix = locale === "mn" ? "/mn" : "";
  const reduceMotion = useReducedMotion();

  const experienceRichTags = {
    tumenEkh: (chunks: ReactNode) => (
      <ExternalProseLink href={EXPERIENCE_LINKS.tumenEkh}>
        {chunks}
      </ExternalProseLink>
    ),
    tsagaanLavai: (chunks: ReactNode) => (
      <ExternalProseLink href={EXPERIENCE_LINKS.tsagaanLavai}>
        {chunks}
      </ExternalProseLink>
    ),
    chucho: (chunks: ReactNode) => (
      <ExternalProseLink href={EXPERIENCE_LINKS.chuchoMountain}>
        {chunks}
      </ExternalProseLink>
    ),
    galleria: (chunks: ReactNode) => (
      <ExternalProseLink href={EXPERIENCE_LINKS.galleria}>
        {chunks}
      </ExternalProseLink>
    ),
    stateDepartmentStore: (chunks: ReactNode) => (
      <ExternalProseLink href={EXPERIENCE_LINKS.stateDepartmentStore}>
        {chunks}
      </ExternalProseLink>
    ),
  };

  const ulaanbaatarRichTags = {
    tumenEkh: (chunks: ReactNode) => (
      <ExternalProseLink href={EXPERIENCE_LINKS.tumenEkh} arrow={false}>
        {chunks}
      </ExternalProseLink>
    ),
    tsagaanLavai: (chunks: ReactNode) => (
      <ExternalProseLink href={EXPERIENCE_LINKS.tsagaanLavai} arrow={false}>
        {chunks}
      </ExternalProseLink>
    ),
    galleria: (chunks: ReactNode) => (
      <ExternalProseLink href={EXPERIENCE_LINKS.galleria} arrow={false}>
        {chunks}
      </ExternalProseLink>
    ),
    stateDepartmentStore: (chunks: ReactNode) => (
      <ExternalProseLink
        href={EXPERIENCE_LINKS.stateDepartmentStore}
        arrow={false}
      >
        {chunks}
      </ExternalProseLink>
    ),
  };

  const TOC_ITEMS: GettingHereTocItem[] = [
    { id: "boat-expeditions", label: t("toc.boatExpeditions") },
    { id: "horseback", label: t("toc.horseback") },
    { id: "deep-taiga", label: t("toc.deepTaiga") },
    { id: "khatgal-western-shore", label: t("toc.khatgalWesternShore") },
    { id: "peninsula-leisure", label: t("toc.peninsulaLeisure") },
    { id: "sauna", label: t("toc.sauna") },
    { id: "ulaanbaatar", label: t("toc.ulaanbaatar") },
    { id: "getting-here", label: t("toc.gettingHere") },
  ];

  return (
    <PageShell offsetNavbar={false}>
      <FrostedMapSection
        aria-label={t("hero.title")}
        className="pb-16 md:pb-24 pt-[calc(var(--navbar-h)+2.5rem)] md:pt-[calc(var(--navbar-h)+3.5rem)] min-h-[min(58vh,32rem)]"
        imageSrc="/images/gallery/adventures/DBR_4391.webp"
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
          <FadeInBlock className="mb-12 md:mb-16 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <CTALink
              href={`${localePrefix}/almanac`}
              arrow={false}
              className="!text-ink/50 hover:!text-water-deep [&>span]:!border-ink/20 [&>span]:group-hover:!border-water-deep/40"
            >
              {t("backToAlmanac")}
            </CTALink>
            <CTALink href={SUGGESTED_PROGRAMME_PDF_PATH} external>
              {t("programmePdf")}
            </CTALink>
          </FadeInBlock>

          <article
            aria-label={t("ariaGuide")}
            className="lg:grid lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-20"
          >
            <aside className="mb-12 lg:mb-0">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <FadeInBlock>
                  <GettingHereToc items={TOC_ITEMS} title={t("tocTitle")} />
                </FadeInBlock>
              </div>
            </aside>

            <div className="min-w-0 space-y-0">
              <SectionBlock
                id="boat-expeditions"
                title={t("boatExpeditions.title")}
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.boatExpeditions.label")}
                    imageSrc="/images/experiences/boat.jpg"
                    imageAlt={t("media.boatExpeditions.alt")}
                    aspectClass="aspect-[4/3] md:aspect-[21/9]"
                    imageClassName="object-cover"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Prose>{t("boatExpeditions.intro")}</Prose>
                  <div className="grid gap-4 pt-2">
                    <RateCard
                      name={t("boatExpeditions.expedition1.name")}
                      meta={t("boatExpeditions.expedition1.meta")}
                      description={t("boatExpeditions.expedition1.desc")}
                    />
                    <RateCard
                      name={t("boatExpeditions.expedition2.name")}
                      meta={t("boatExpeditions.expedition2.meta")}
                      description={t("boatExpeditions.expedition2.desc")}
                    />
                    <RateCard
                      name={t("boatExpeditions.expedition3.name")}
                      meta={t("boatExpeditions.expedition3.meta")}
                      description={t("boatExpeditions.expedition3.desc")}
                    />
                  </div>
                  <Prose>
                    <LabelledText
                      label={t("boatExpeditions.captainsNoteLabel")}
                      body={t("boatExpeditions.captainsNote")}
                    />
                  </Prose>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock id="horseback" title={t("horseback.title")}>
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.horseback.label")}
                    imageSrc="/images/experiences/horse.jpg"
                    imageAlt={t("media.horseback.alt")}
                    aspectClass="aspect-[3/2]"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Prose>{t("horseback.body")}</Prose>
                  <Prose>
                    <LabelledText
                      label={t("horseback.rateLabel")}
                      body={t("horseback.rate")}
                    />
                  </Prose>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock id="deep-taiga" title={t("deepTaiga.title")}>
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.deepTaiga.label")}
                    imageSrc="/images/experiences/hiking.jpg"
                    imageAlt={t("media.deepTaiga.alt")}
                    aspectClass="aspect-[3/2]"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Prose>{t("deepTaiga.body")}</Prose>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock
                id="khatgal-western-shore"
                title={t("khatgalWesternShore.title")}
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.westernShore.label")}
                    imageSrc="/images/experiences/khyasaa.png"
                    imageAlt={t("media.westernShore.alt")}
                    aspectClass="aspect-[1330/766]"
                    imageClassName="object-contain"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Subhead>{t("khatgalWesternShore.chuchoTitle")}</Subhead>
                  <Prose>
                    {t.rich("khatgalWesternShore.chucho", experienceRichTags)}
                  </Prose>
                  <Subhead>{t("khatgalWesternShore.museumTitle")}</Subhead>
                  <Prose>{t("khatgalWesternShore.museumBody")}</Prose>
                  <MapSiteLinks
                    links={[
                      {
                        label: t("khatgalWesternShore.mapLinks.museum"),
                        href: EXPERIENCE_LINKS.sukhbaatarMuseum,
                      },
                      {
                        label: t("khatgalWesternShore.mapLinks.market"),
                        href: EXPERIENCE_LINKS.localMarket,
                      },
                    ]}
                  />
                  <ArchivalCard
                    eyebrow={t("khatgalWesternShore.openAirArchive.eyebrow")}
                    body={t("khatgalWesternShore.openAirArchive.body")}
                    image={{
                      src: "/images/almanac/borders-and-industry/sukhbaatar-museum.jpeg",
                      alt: t("khatgalWesternShore.openAirArchive.imageAlt"),
                    }}
                    link={{
                      label: t("khatgalWesternShore.openAirArchive.link"),
                      href: `${localePrefix}/almanac/borders-and-industry`,
                    }}
                  />
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock
                id="peninsula-leisure"
                title={t("peninsulaLeisure.title")}
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.peninsulaLeisure.label")}
                    imageSrc="/images/experiences/kayaking.jpg"
                    imageAlt={t("media.peninsulaLeisure.alt")}
                    aspectClass="aspect-[3/2]"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Subhead>{t("peninsulaLeisure.kayakingTitle")}</Subhead>
                  <Prose>{t("peninsulaLeisure.kayaking")}</Prose>
                  <Subhead>{t("peninsulaLeisure.walksTitle")}</Subhead>
                  <Prose>{t("peninsulaLeisure.walks")}</Prose>
                  <Subhead>{t("peninsulaLeisure.mergenTitle")}</Subhead>
                  <Prose>{t("peninsulaLeisure.mergen")}</Prose>
                  <Subhead>{t("peninsulaLeisure.picnicsTitle")}</Subhead>
                  <Prose>{t("peninsulaLeisure.picnics")}</Prose>
                </FadeInBlock>
              </SectionBlock>

              <ContextualTestimonial
                testimonialId="ankita-silence"
                eyebrow={{
                  en: "Guest reflection",
                  mn: "Зочны үгээр",
                }}
                className="py-8 md:py-12"
              />

              <SectionBlock id="sauna" title={t("sauna.title")}>
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label={t("media.sauna.label")}
                    imageSrc="/images/experiences/kids-yoga.jpg"
                    imageAlt={t("media.sauna.alt")}
                    aspectClass="aspect-[3/2]"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Prose>{t("sauna.body")}</Prose>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock id="ulaanbaatar" title={t("ulaanbaatar.title")}>
                <FadeInBlock delay={0.1}>
                  <Prose>{t("ulaanbaatar.intro")}</Prose>
                  <div className="grid gap-4 pt-2">
                    <RateCard
                      name={t("ulaanbaatar.artsLabel")}
                      description={t.rich("ulaanbaatar.arts", ulaanbaatarRichTags)}
                    />
                    <RateCard
                      name={t("ulaanbaatar.cashmereLabel")}
                      description={t.rich(
                        "ulaanbaatar.cashmere",
                        ulaanbaatarRichTags
                      )}
                    />
                  </div>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock id="getting-here" title={t("gettingHere.title")}>
                <FadeInBlock delay={0.1}>
                  <Prose>{t("gettingHere.body")}</Prose>
                  <div className="pt-2">
                    <CTALink href={`${localePrefix}/getting-here`} arrow>
                      {t("gettingHere.cta")}
                    </CTALink>
                  </div>
                </FadeInBlock>
              </SectionBlock>
            </div>
          </article>
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
          <CTALink href={`${localePrefix}/cabins`} arrow>
            {t("destination.link")}
          </CTALink>
        </FadeInBlock>
      </FrostedMapSection>
    </PageShell>
  );
}
