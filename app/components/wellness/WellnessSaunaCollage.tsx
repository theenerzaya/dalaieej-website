"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SiteImage from "@/app/components/SiteImage";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import { BodyText, Eyebrow, Headline } from "@/app/components/ui/Typography";

type TileId = "hero" | "social" | "steam" | "light";

const TILES: {
  id: TileId;
  src: string;
  alt: { en: string; mn: string };
  gridClass: string;
  sizes: string;
}[] = [
  {
    id: "hero",
    src: "/spa-anonymous-main.jpg",
    alt: {
      en: "A couple relaxing in the outdoor hot pool overlooking the lake",
      mn: "Далайн харагдацтай гаднах халуун усан санд амарч буй хос",
    },
    gridClass: "col-start-1 col-end-8 row-start-1 row-end-7 z-[1]",
    sizes: "(max-width: 1024px) 85vw, 42vw",
  },
  {
    id: "social",
    src: "/jacuzzi-3.webp",
    alt: {
      en: "Guests enjoying the lakeside hot pool together",
      mn: "Далайн эрэг дээрх халуун усан санд хамтдаа амарч буй зочид",
    },
    gridClass: "col-start-6 col-end-11 row-start-5 row-end-11 z-[2]",
    sizes: "(max-width: 1024px) 70vw, 36vw",
  },
  {
    id: "steam",
    src: "/close-up-1.jpg",
    alt: {
      en: "Steam and water jets in the outdoor spa pool",
      mn: "Гаднах спа усан сангийн уур, усан хошуу",
    },
    gridClass: "col-start-1 col-end-5 row-start-6 row-end-11 z-[3]",
    sizes: "(max-width: 1024px) 55vw, 22vw",
  },
  {
    id: "light",
    src: "/close-up-2.jpg",
    alt: {
      en: "Blue-lit water detail in the hot pool at dusk",
      mn: "Үдэшлэгийн цагт халуун усан сангийн цэнхэр гэрэлтүүлэг",
    },
    gridClass: "col-start-8 col-end-11 row-start-1 row-end-4 z-[2]",
    sizes: "(max-width: 1024px) 45vw, 18vw",
  },
];

const STAGGER_MS: Record<TileId, number> = {
  hero: 0,
  social: 120,
  steam: 240,
  light: 360,
};

const COPY = {
  en: {
    eyebrow: "A FIRST FOR KHÖVSGÖL",
    headline: "The Warmest Shore on the Lake",
    body: "We all know how unforgiving the wind and water of Khövsgöl can be. That is why we installed an international-standard outdoor hot pool on the estate. Now, the shoreline is truly open to everyone—children can play in the water without the chill, and our parents can shelter from the wind, relaxing as if sitting in a natural hot spring. It is a place to experience the wild northern landscape in complete, welcoming warmth.",
  },
  mn: {
    eyebrow: "ХӨВСГӨЛД АНХ УДАА",
    headline: "Хөвсгөлийн хамгийн дулаахан эрэг",
    body: "Хөвсгөл далайн ус, салхи хэчнээн жихүүн байдгийг бид бүгд мэднэ. Тийм ч учраас бид эдлэн газартаа олон улсын стандартын, гаднах халуун усан санг суурилуулсан юм. Одоо далайн эрэг хүн бүрт нээлттэй боллоо—хүүхдүүд даарахгүйгээр усанд тоглож, аав ээжүүд маань салхинаас нөмөрлөн халуун рашаанд суух мэт тухлах боломжтой. Хөвсгөлийн байгалийг хамгийн дулаанаар мэдрэх цэг.",
  },
} as const;

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type WellnessSaunaCollageProps = {
  locale: "en" | "mn";
};

export default function WellnessSaunaCollage({ locale }: WellnessSaunaCollageProps) {
  const t = COPY[locale];
  const reduceMotion = useReducedMotion();
  const collageRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isRevealed = reduceMotion || revealed;

  useEffect(() => {
    if (reduceMotion) return;

    const el = collageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <section id="hot-pool" aria-label={t.headline} className="scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-14 xl:gap-x-16 lg:items-start">
          <div className="lg:col-span-5 lg:pt-4">
            <FadeInBlock>
              <Eyebrow className="!text-water-deep/70 mb-4">{t.eyebrow}</Eyebrow>
              <Headline as="h2" size="sub" className="!text-left mb-6">
                {t.headline}
              </Headline>
              <BodyText size="md" className="!text-left max-w-none text-ink/75">
                {t.body}
              </BodyText>
            </FadeInBlock>
          </div>

          <div
            ref={collageRef}
            className={cn(
              "group/collage relative lg:col-span-7",
              "min-h-[min(72vw,28rem)] sm:min-h-[26rem] lg:min-h-[36rem]",
            )}
          >
            <div
              className={cn(
                "grid h-full w-full grid-cols-10 grid-rows-10 gap-2 sm:gap-3",
                isRevealed && "is-revealed",
              )}
            >
              {TILES.map((tile) => (
                <div
                  key={tile.id}
                  className={cn(
                    "collage-tile relative overflow-hidden bg-ink/5 ring-1 ring-ink/10",
                    "shadow-[0_18px_48px_-12px_rgba(13,15,28,0.22)]",
                    "transition-[opacity,transform,z-index] duration-500 ease-out",
                    "motion-reduce:opacity-100 motion-reduce:translate-y-0",
                    isRevealed
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5",
                    "[@media(hover:hover)]:group-hover/collage:opacity-100",
                    "[@media(hover:hover)]:group-hover/collage:[&:not(:hover)]:opacity-[0.35]",
                    "hover:z-20 hover:scale-[1.03] hover:opacity-100",
                    tile.gridClass,
                  )}
                  style={{
                    transitionDelay: reduceMotion
                      ? "0ms"
                      : `${STAGGER_MS[tile.id]}ms`,
                  }}
                >
                  <SiteImage
                    src={tile.src}
                    alt={tile.alt[locale]}
                    fill
                    sizes={tile.sizes}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
