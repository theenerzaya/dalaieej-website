"use client";

import type { ReactNode } from "react";
import PageShell from "@/app/components/layout/PageShell";
import ContentSection from "@/app/components/ui/ContentSection";
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
import { useLocale } from "next-intl";
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

const TOC_ITEMS: GettingHereTocItem[] = [
  { id: "domestic-flights", label: "I. The Quickest Route: Domestic Flights" },
  { id: "overland-driving", label: "II. The Overland Expedition: Driving the Steppe" },
  {
    id: "coaches-railway",
    label: "III. Intercity Coaches & Railway Options",
  },
  { id: "murun-to-resort", label: "IV. The Final Leg: Murun to the Resort" },
];

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
  const localePrefix = locale === "mn" ? "/mn" : "";
  const reduceMotion = useReducedMotion();

  const transferOptions: TransferOption[] = [
    {
      id: "resort-transfer",
      icon: Ship,
      title: "Resort Transfer",
      meta: "270,000 MNT · each way",
      body: "We offer a private transfer (100 km drive followed by a scenic speedboat arrival) for 270,000 MNT each way. When your travel plans are set, share your itinerary so we can time your transfer and resort welcome.",
      href: ITINERARY_MAILTO,
      linkLabel: "Share your itinerary",
    },
    {
      id: "ubcab",
      icon: Car,
      title: "UBCab",
      meta: "App · Murun → Khatgal",
      body: "You can reliably hail a taxi directly from Murun to Khatgal using the UBCab app.",
      href: "https://onelink.to/ubcab",
      linkLabel: "Get UBCab",
      external: true,
    },
  ];

  return (
    <PageShell>
      <FrostedMapSection
        aria-label="How We Get to Khövsgöl"
        className="pb-16 md:pb-24 pt-10 md:pt-14 min-h-[min(58vh,32rem)]"
        imagePriority
      >
        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
        >
          <Eyebrow className="!text-water-deep/70 mb-6">
            The Journey
          </Eyebrow>
          <Headline as="h1" size="section">
            How We Get to Khövsgöl
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
            A comprehensive guide to traveling from Ulaanbaatar to the Khaich
            Valley.
          </BodyText>
        </motion.div>
      </FrostedMapSection>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <article
            aria-label="Arrival guide"
            className="lg:grid lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:gap-x-14 xl:gap-x-20"
          >
            <aside className="mb-12 lg:mb-0">
              <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
                <FadeInBlock>
                  <GettingHereToc items={TOC_ITEMS} />
                </FadeInBlock>
              </div>
            </aside>

            <div className="min-w-0 space-y-0">
              <SectionBlock
                id="domestic-flights"
                eyebrow="Section I"
                title="The Quickest Route: Domestic Flights"
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label="Murun Airport"
                    imageSrc="/images/getting-here/murun-airport-exterior.jpg"
                    imageAlt="Murun Airport terminal viewed from an aircraft on the tarmac, with the wing and steppe mountains beyond."
                    aspectClass="aspect-[4/3] md:aspect-[21/9]"
                    imageClassName="object-cover"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Prose>
                    The most efficient route to the resort begins with a domestic
                    flight from Ulaanbaatar (UBN) to Murun Airport (MXV).
                  </Prose>
                  <Prose>
                    During the peak summer season, domestic flights run almost daily.
                    The flight takes approximately one hour, with one-way tickets
                    starting from 300,000 MNT per person.
                  </Prose>
                  <Prose>
                    Because July represents the peak of the Mongolian summer, domestic
                    flights sell out exceptionally quickly. We strongly advise
                    securing your air travel as early as possible directly with the
                    carriers:
                  </Prose>
                </FadeInBlock>
                <FadeInBlock delay={0.15}>
                  <div className="grid gap-4 md:grid-cols-1">
                    <CarrierCard
                      name="MIAT Mongolian Airlines"
                      description="Check schedules and book directly on the MIAT website."
                      linkLabel="miat.com"
                      href={
                        locale === "mn"
                          ? "https://miat.com/mn"
                          : "https://miat.com/en"
                      }
                      external
                    />
                    <CarrierCard
                      name="Hunnu Air"
                      description="View timetables and book directly on the Hunnu Air website."
                      linkLabel="hunnuair.com"
                      href={
                        locale === "mn"
                          ? "https://www.hunnuair.com/mn/timetable"
                          : "https://www.hunnuair.com/en/timetable"
                      }
                      external
                    />
                    <CarrierCard
                      name="Chinggis Airlines (Nomin Holdings)"
                      description="For availability on this newer premium option, please contact their operator, Enkhjargal, directly via Viber at +976 8810 4149."
                      href="#"
                    />
                  </div>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock
                id="overland-driving"
                eyebrow="Section II"
                title="The Overland Expedition: Driving the Steppe"
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label="Overland route through Bulgan province"
                    imageSrc="/images/getting-here/bulgan-province-overland-road.jpeg"
                    imageAlt="A vehicle stopped on a paved road across the open steppe in Bulgan province, Mongolia."
                    aspectClass="aspect-[4/3]"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Prose>
                    For those who wish to experience the vastness of the Mongolian
                    landscape at their own pace, driving overland is a spectacular
                    option. The 1,000 km route from Ulaanbaatar is fully paved.
                  </Prose>
                  <Subhead>Pacing the Journey</Subhead>
                  <Prose>
                    If you plan to complete the drive to Lake Khövsgöl in a single
                    day, an early departure is essential. We strongly advise setting
                    out from Ulaanbaatar no later than 9:00 AM sharp. To comfortably
                    complete the journey and arrive before nightfall, aim to safely
                    maintain a cruising speed of 100 km/h where the open road allows.
                  </Prose>
                </FadeInBlock>
                <FadeInBlock delay={0.15}>
                  <Subhead>The Erdenet Pitstop</Subhead>
                  <Prose>
                    If you are driving, we highly recommend breaking up the trip
                    with a stop in Erdenet for lunch and refueling. As one of
                    Mongolia&apos;s wealthiest cities per capita, Erdenet offers a
                    charming glimpse into Soviet-era urban planning. It is filled
                    with character—you will find an eclectic mix of options to
                    recharge, from cozy local &quot;tea houses&quot; to excellent
                    standalone restaurants.
                  </Prose>
                  <Subhead>The Heart of Bulgan</Subhead>
                  <Prose>
                    As you leave Erdenet and continue northwest, the road opens up
                    into Bulgan province. If you are familiar with airag—Mongolia&apos;s
                    traditional fermented mare&apos;s milk—Bulgan is the undisputed
                    heartland for it. As you drive through, the definitive place to
                    stop and taste the best airag in the country is at the Tuluu Pass
                    (Түлүүгийн даваа).
                  </Prose>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock
                id="coaches-railway"
                eyebrow="Section III"
                title="Intercity Coaches & Railway Options"
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label="Train travel in Mongolia"
                    imageSrc="/images/getting-here/train.jpg"
                    imageAlt="A passenger train on the railway in Mongolia."
                    aspectClass="aspect-[8/5] md:aspect-[21/9]"
                    imageClassName="object-cover"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Subhead>Intercity Coaches</Subhead>
                  <Prose>
                    For a direct overland route, air-conditioned intercity coaches
                    depart from Ulaanbaatar&apos;s Old Dragon Terminal (Хуучин
                    Драгон). Tickets are 110,000 MNT for adults and 55,800 MNT for
                    children (ages 6–12). All tickets automatically include travel
                    insurance (up to 10 million MNT in compensation).
                  </Prose>
                  <BulletList
                    items={[
                      <>
                        <strong className="font-medium text-ink">The VIP Coach:</strong>{" "}
                        Departs once a week on Sundays at 21:10. This premium option
                        features spacious, reclining seating and phone charging ports
                        so you can sleep comfortably and wake up in the north.
                      </>,
                      <>
                        <strong className="font-medium text-ink">Standard Coaches:</strong>{" "}
                        Depart six times a day, offering flexibility for your
                        schedule.
                      </>,
                      <>
                        <strong className="font-medium text-ink">Booking:</strong>{" "}
                        Tickets can be purchased online via the Transdep E-Ticket
                        Portal.
                      </>,
                    ]}
                  />
                  <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                    <CTALink
                      href={
                        locale === "mn"
                          ? "https://eticket.transdep.mn/?language=mn"
                          : "https://eticket.transdep.mn/?language=en"
                      }
                      external
                    >
                      Transdep E-Ticket
                    </CTALink>
                  </div>
                </FadeInBlock>
                <FadeInBlock delay={0.15}>
                  <Subhead>The Trans-Siberian Railway</Subhead>
                  <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
                    <div className="min-w-0 flex-1 space-y-6">
                      <Prose>
                        There is no direct train to Murun; the railway ends in
                        Erdenet. However, the route is a spur of the legendary
                        Trans-Siberian Railway—the very same iconic railway famously
                        traveled by David Bowie. Taking the overnight sleeper train to
                        Erdenet is a deeply nostalgic, romantic way to travel. Once
                        you arrive, independent drivers are waiting at the station
                        ready to take you the rest of the way to Murun (please
                        remember to negotiate your fare before departing).
                      </Prose>
                      <Prose>
                        <strong className="font-medium text-ink">
                          For Motorbike Expeditions:
                        </strong>{" "}
                        You can transport your motorbike with you on the train to
                        Erdenet, bypassing the heaviest city traffic and officially
                        beginning your ride from there.
                      </Prose>
                      <div className="pt-2">
                        <CTALink
                          href="https://eticket.ubtz.mn/search"
                          external
                        >
                          UBTZ E-Ticket
                        </CTALink>
                      </div>
                    </div>
                    <figure className="mx-auto w-[13rem] shrink-0 md:mx-0 md:w-[14rem] lg:w-[15rem]">
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-ink/5">
                        <SiteImage
                          src="/images/getting-here/david-bowie-trans-siberian-railway-1973.jpg"
                          alt="Black and white archival photograph of David Bowie traveling in a sleeper cabin on the Trans-Siberian Railway."
                          title="David Bowie on the Trans-Siberian Railway"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 208px, 240px"
                        />
                      </div>
                      <figcaption className="mt-3 font-body text-sm leading-snug text-ink/60">
                        David Bowie on the Trans-Siberian Railway, 1973.
                        Photograph by Geoff MacCormack.
                      </figcaption>
                    </figure>
                  </div>
                </FadeInBlock>
              </SectionBlock>

              <SectionBlock
                id="murun-to-resort"
                eyebrow="Section IV"
                title="The Final Leg: Murun to the Resort"
              >
                <FadeInBlock delay={0.05}>
                  <MediaPlaceholder
                    variant="photo"
                    label="Murun Airport terminal"
                    imageSrc="/images/getting-here/murun-airport-terminal-interior.jpg"
                    imageAlt="Travelers in the Murun Airport terminal with Dalai Eej Resort signage visible."
                    aspectClass="aspect-[4/3] md:aspect-[21/9]"
                  />
                </FadeInBlock>
                <FadeInBlock delay={0.1}>
                  <Subhead>Provisioning in Murun</Subhead>
                  <Prose>
                    If you are driving yourself, Murun is your final major outpost.
                    Before you leave the city limits for the lake, we highly recommend
                    a stop at the Nomin Supermarket. Depending on your planned level
                    of adventure, this is the definitive place to load up on essential
                    supplies—from rechargeable batteries and flashlights to barbecue
                    provisions and rain boots.
                  </Prose>
                </FadeInBlock>
                <FadeInBlock delay={0.12}>
                  <Subhead>Navigating the Final Approach</Subhead>
                  <Prose>
                    The resort is located 13 km beyond the village of Khatgal, tucked
                    into the Khaich Valley on the eastern shore of the lake. If you are
                    driving yourself for this final leg, please note that while our
                    Google Maps pin is highly accurate, the final approach to the resort
                    can be adventurous.
                  </Prose>
                  <Prose>
                    The first 8 km out of Khatgal is a graded gravel road, but the
                    final 5 km is an unpaved, natural dirt track. Because of this, we
                    highly recommend traveling in a 4x4 vehicle or ensuring you are
                    an experienced driver.
                  </Prose>
                  <BodyText
                    size="md"
                    className="!text-left max-w-none italic text-ink/55"
                  >
                    Once you pass the Khatgal village edge, you will need to navigate
                    around the tree line…
                  </BodyText>
                  <div className="pt-2">
                    <CTALink href={MAP_URL} external>
                      Google Maps
                    </CTALink>
                  </div>
                  <Prose>
                    For those driving independently, the precise path to the resort.
                  </Prose>
                  <FadeInBlock delay={0.05} className="mt-6">
                    <AccessRoadMap />
                  </FadeInBlock>
                </FadeInBlock>
                <FadeInBlock delay={0.15}>
                  <Subhead>Taxis and Private Transfers</Subhead>
                  <Prose>
                    If you did not drive your own vehicle to Murun, you have two
                    options for the final stretch:
                  </Prose>
                  <TransferOptions options={transferOptions} />
                </FadeInBlock>
              </SectionBlock>
            </div>
          </article>
        </div>
      </section>

      <FrostedMapSection
        aria-label="Continue planning"
        className="py-24 md:py-32"
        contentClassName="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center"
        fadeTop
        fadeBottom={false}
      >
        <FadeInBlock className="flex w-full flex-col items-center gap-8 text-center">
          <Eyebrow className="!text-water-deep/70">Continue planning</Eyebrow>
          <Headline as="h2" size="sub">
            Ready to plan your time on the water?
          </Headline>
          <BodyText size="md" className="max-w-xl">
            Discover our wellness and heritage experiences on the shores of Lake
            Khövsgöl.
          </BodyText>
          <CTALink href={`${localePrefix}/experiences`} arrow>
            Discover Our Wellness & Heritage Experiences
          </CTALink>
        </FadeInBlock>
      </FrostedMapSection>
    </PageShell>
  );
}
