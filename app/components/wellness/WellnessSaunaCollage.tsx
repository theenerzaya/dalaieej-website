"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SiteImage from "@/app/components/SiteImage";
import FadeInBlock from "@/app/components/getting-here/FadeInBlock";
import { BodyText, Eyebrow, Headline } from "@/app/components/ui/Typography";

type TileId = "tl" | "tr" | "bl" | "br";

/** Flex alignment so each image’s inner corner meets the grid center. */
const CENTER_ANCHOR: Record<TileId, string> = {
  tl: "items-end justify-end",
  tr: "items-end justify-start",
  bl: "items-start justify-end",
  br: "items-start justify-start",
};

const TILES: {
  id: TileId;
  src: string;
  alt: { en: string; mn: string };
  width: number;
  height: number;
  sizes: string;
  cellClassName?: string;
  imageClassName?: string;
}[] = [
  {
    id: "tl",
    src: "/spa-anonymous-main.jpg",
    alt: {
      en: "A couple relaxing in the outdoor hot pool overlooking the lake",
      mn: "Далайн харагдацтай гаднах халуун усан санд амарч буй хос",
    },
    width: 900,
    height: 1200,
    sizes: "(max-width: 1024px) 72vw, 40vw",
    cellClassName: "min-h-[16.4rem] sm:min-h-[19.9rem] md:min-h-[23.4rem]",
    imageClassName: "max-h-[117%] max-w-[117%]",
  },
  {
    id: "tr",
    src: "/close-up-1.jpg",
    alt: {
      en: "Steam and water jets in the outdoor spa pool",
      mn: "Гаднах спа усан сангийн уур, усан хошуу",
    },
    width: 1200,
    height: 800,
    sizes: "(max-width: 1024px) 61vw, 32vw",
  },
  {
    id: "bl",
    src: "/close-up-2.jpg",
    alt: {
      en: "Blue-lit water detail in the hot pool at dusk",
      mn: "Үдэшлэгийн цагт халуун усан сангийн цэнхэр гэрэлтүүлэг",
    },
    width: 800,
    height: 600,
    sizes: "(max-width: 1024px) 61vw, 32vw",
  },
  {
    id: "br",
    src: "/jacuzzi-3.webp",
    alt: {
      en: "Guests enjoying the lakeside hot pool together",
      mn: "Далайн эрэг дээрх халуун усан санд хамтдаа амарч буй зочид",
    },
    width: 1024,
    height: 1024,
    sizes: "(max-width: 1024px) 61vw, 32vw",
  },
];

const GRID_CLASS: Record<TileId, string> = {
  tl: "col-start-1 row-start-1",
  tr: "col-start-2 row-start-1",
  bl: "col-start-1 row-start-2",
  br: "col-start-2 row-start-2",
};

const STAGGER_MS: Record<TileId, number> = {
  tl: 0,
  tr: 120,
  bl: 240,
  br: 360,
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
            className="group/collage lg:col-span-7 flex justify-center lg:justify-end"
          >
            <div
              className={cn(
                "grid w-full max-w-[42.67rem] grid-cols-2 grid-rows-2 gap-px",
                "[grid-template-columns:1.82fr_0.78fr] [grid-template-rows:1.82fr_0.78fr]",
                isRevealed && "is-revealed",
              )}
            >
              {TILES.map((tile) => (
                <div
                  key={tile.id}
                  className={cn(
                    "collage-tile flex min-h-[10.5rem] sm:min-h-[12rem] md:min-h-[13.5rem]",
                    tile.cellClassName,
                    CENTER_ANCHOR[tile.id],
                    GRID_CLASS[tile.id],
                    "transition-[transform] duration-[650ms] ease-[0.22,1,0.36,1]",
                    "transition-opacity duration-150 ease-out",
                    "motion-reduce:opacity-100 motion-reduce:translate-y-0",
                    isRevealed
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5",
                    "[@media(hover:hover)]:group-hover/collage:opacity-100",
                    "[@media(hover:hover)]:group-hover/collage:[&:not(:hover)]:opacity-[0.72]",
                    "hover:opacity-100",
                  )}
                  style={{
                    transitionDelay:
                      reduceMotion || isRevealed
                        ? "0ms"
                        : `${STAGGER_MS[tile.id]}ms`,
                  }}
                >
                  <SiteImage
                    src={tile.src}
                    alt={tile.alt[locale]}
                    width={tile.width}
                    height={tile.height}
                    sizes={tile.sizes}
                    className={cn(
                      "max-h-full max-w-full h-auto w-auto object-contain",
                      tile.imageClassName,
                    )}
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
