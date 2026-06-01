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
  /** Scale from inner corner so the image bleeds past the grid edge. */
  jut?: "tl" | "br";
}[] = [
  {
    id: "tl",
    src: "/images/wellness/sauna-exterior.jpg",
    alt: {
      en: "A couple relaxing in the outdoor hot pool overlooking the lake",
      mn: "Далайн харагдацтай гаднах халуун усан санд амарч буй хос",
    },
    width: 900,
    height: 1200,
    sizes: "(max-width: 1024px) 70vw, 58vw",
    cellClassName: "overflow-visible z-[1]",
    jut: "tl",
  },
  {
    id: "tr",
    src: "/images/wellness/sauna-detail-1.jpg",
    alt: {
      en: "Steam and water jets in the outdoor spa pool",
      mn: "Гаднах спа усан сангийн уур, усан хошуу",
    },
    width: 1200,
    height: 800,
    sizes: "(max-width: 1024px) 70vw, 48vw",
  },
  {
    id: "bl",
    src: "/images/wellness/sauna-detail-2.jpg",
    alt: {
      en: "Blue-lit water detail in the hot pool at dusk",
      mn: "Үдшийн бүрий дэх халуун усан сангийн цэнхэр туяа",
    },
    width: 800,
    height: 600,
    sizes: "(max-width: 1024px) 70vw, 48vw",
  },
  {
    id: "br",
    src: "/images/wellness/jacuzzi.webp",
    alt: {
      en: "Guests enjoying the lakeside hot pool together",
      mn: "Далайн эрэг дээрх халуун усан санд хамтдаа амарч буй зочид",
    },
    width: 1024,
    height: 1024,
    sizes: "(max-width: 1024px) 70vw, 48vw",
    cellClassName: "overflow-visible z-[1]",
    jut: "br",
  },
];

/** Scale from the inner corner (grid +) so hover grows outward, not toward center. */
const TILE_IMAGE_TRANSFORM: Record<
  TileId,
  { origin: string; scale: string; hoverScale: string; sizing: string }
> = {
  tl: {
    origin: "origin-bottom-right",
    scale: "scale-[1.08] lg:scale-[1.04]",
    hoverScale:
      "motion-safe:[@media(hover:hover)]:group-hover/tile:scale-[1.14] lg:group-hover/tile:scale-[1.1]",
    sizing: "w-full max-w-none object-[50%_22%]",
  },
  tr: {
    origin: "origin-bottom-left",
    scale: "scale-100",
    hoverScale: "motion-safe:[@media(hover:hover)]:group-hover/tile:scale-[1.08]",
    sizing: "max-h-full max-w-full w-auto",
  },
  bl: {
    origin: "origin-top-right",
    scale: "scale-100",
    hoverScale: "motion-safe:[@media(hover:hover)]:group-hover/tile:scale-[1.08]",
    sizing: "max-h-full max-w-full w-auto",
  },
  br: {
    origin: "origin-top-left",
    scale: "scale-[1.08]",
    hoverScale: "motion-safe:[@media(hover:hover)]:group-hover/tile:scale-[1.16]",
    sizing: "w-full max-w-none",
  },
};

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
    body: "Хөвсгөлийн салхи, далайн ус хэчнээн жихүүн байдгийг бид сайн мэднэ. Тиймдээ ч бид эдлэн газартаа олон улсын жишигт нийцсэн гаднах халуун усан санг байгуулсан юм. Ингэснээр далайн эрэг хүн бүхэнд ээлтэй болж, хүүхэд багачууд даарахгүйгээр усанд тоглож, аав ээжүүд салхинаас нөмөрлөн байгалийн халуун рашаанд суух мэт алжаалаа тайлах боломж бүрдлээ. Энэ бол хойд нутгийн онгон байгалийг хамгийн дулаан, таатайгаар мэдрэх онцгой орон зай юм.",
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
      <div className="mx-auto max-w-6xl lg:max-w-7xl">
        <div className="flex flex-col gap-16 lg:gap-20">
          <div className="w-full">
            <FadeInBlock>
              <Eyebrow className="!text-water-deep/70 mb-8">{t.eyebrow}</Eyebrow>
              <Headline as="h2" size="sub" className="!text-left mb-12">
                {t.headline}
              </Headline>
              <BodyText size="md" className="!text-left max-w-none text-ink/75">
                {t.body}
              </BodyText>
            </FadeInBlock>
          </div>

          <div
            ref={collageRef}
            className="group/collage flex justify-center overflow-visible"
          >
            <div
              className={cn(
                "grid w-full max-w-[49.07rem] lg:max-w-[58rem] xl:max-w-[64rem] grid-cols-2 gap-px overflow-visible",
                "[grid-template-columns:2.09fr_0.9fr] grid-rows-[auto_auto]",
                "p-3 sm:p-4 lg:p-5 xl:p-6",
                isRevealed && "is-revealed",
              )}
            >
              {TILES.map((tile) => (
                <div
                  key={tile.id}
                  className={cn(
                    "collage-tile group/tile flex min-h-[12.1rem] sm:min-h-[13.8rem] md:min-h-0 lg:min-h-0",
                    tile.cellClassName,
                    CENTER_ANCHOR[tile.id],
                    GRID_CLASS[tile.id],
                    "transition-[transform,opacity] duration-[650ms] ease-[0.22,1,0.36,1]",
                    "transition-opacity duration-150 ease-out",
                    "motion-reduce:opacity-100 motion-reduce:translate-y-0",
                    isRevealed
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5",
                    "[@media(hover:hover)]:group-hover/collage:opacity-100",
                    "[@media(hover:hover)]:group-hover/collage:[&:not(:hover)]:opacity-[0.72]",
                    "hover:opacity-100 [@media(hover:hover)]:hover:z-10",
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
                      "h-auto object-contain will-change-transform",
                      TILE_IMAGE_TRANSFORM[tile.id].sizing,
                      TILE_IMAGE_TRANSFORM[tile.id].origin,
                      TILE_IMAGE_TRANSFORM[tile.id].scale,
                      TILE_IMAGE_TRANSFORM[tile.id].hoverScale,
                      "transition-transform duration-300 ease-[0.22,1,0.36,1] motion-reduce:transition-none",
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
