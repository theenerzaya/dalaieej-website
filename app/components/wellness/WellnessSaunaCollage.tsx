"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import SiteImage from "@/app/components/SiteImage";
import { Eyebrow, BodyText, Headline } from "@/app/components/ui/Typography";
import { assetUrl } from "@/lib/assetUrl";

const IMAGES = {
  hero: assetUrl("/spa-anonymous-main.jpg"),
  social: assetUrl("/jacuzzi-3.webp"),
  steam: assetUrl("/close-up-1.jpg"),
  light: assetUrl("/close-up-2.jpg"),
} as const;

type LocaleKey = "en" | "mn";

const COPY: Record<
  LocaleKey,
  { eyebrow: string; headline: string; body: string; alts: Record<keyof typeof IMAGES, string> }
> = {
  en: {
    eyebrow: "A FIRST FOR KHÖVSGÖL",
    headline: "The Warmest Shore on the Lake",
    body: "We all know how unforgiving the wind and water of Khövsgöl can be. That is why we installed an international-standard outdoor hot pool on the estate. Now, the shoreline is truly open to everyone—children can play in the water without the chill, and our parents can shelter from the wind, relaxing as if sitting in a natural hot spring. It is a place to experience the wild northern landscape in complete, welcoming warmth.",
    alts: {
      hero: "A couple relaxing together in the outdoor hot pool at night",
      social: "Guests gathered at the lakeside hot pool",
      steam: "Close-up of steaming water jets in the hot pool",
      light: "Blue-lit water detail in the outdoor spa pool",
    },
  },
  mn: {
    eyebrow: "ХӨВСГӨЛД АНХ УДАА",
    headline: "Хөвсгөлийн хамгийн дулаахан эрэг",
    body: "Хөвсгөл далайн ус, салхи хэчнээн жихүүн байдгийг бид бүгд мэднэ. Тийм ч учраас бид эдлэн газартаа олон улсын стандартын, гаднах халуун усан санг суурилуулсан юм. Одоо далайн эрэг хүн бүрт нээлттэй боллоо—хүүхдүүд даарахгүйгээр усанд тоглож, аав ээжүүд маань салхинаас нөмөрлөн халуун рашаанд суух мэт тухлах боломжтой. Хөвсгөлийн байгалийг хамгийн дулаанаар мэдрэх цэг.",
    alts: {
      hero: "Хос хүн шөнийн гаднах халуун усан санд амарч байна",
      social: "Зочид нуурын эрэг дээрх халуун усан санд цугласан",
      steam: "Халуун усан сангийн ус, уурын ойрын зураг",
      light: "Гаднах усан сангийн цэнхэр гэрэлтүүлэгтэй усны дэлгэрэнгүй",
    },
  },
};

const TILES: Array<{
  id: keyof typeof IMAGES;
  src: string;
  delayMs: number;
  gridClass: string;
  aspectClass: string;
  sizes: string;
}> = [
  {
    id: "hero",
    src: IMAGES.hero,
    delayMs: 0,
    gridClass:
      "md:col-start-6 md:col-end-13 md:row-start-1 md:row-end-5 z-[2]",
    aspectClass: "aspect-[4/3] md:aspect-auto md:min-h-[280px] md:h-full",
    sizes: "(max-width: 768px) 100vw, 52vw",
  },
  {
    id: "social",
    src: IMAGES.social,
    delayMs: 120,
    gridClass:
      "md:col-start-8 md:col-end-13 md:row-start-4 md:row-end-8 z-[3] md:-mt-16",
    aspectClass: "aspect-square md:aspect-auto md:min-h-[240px] md:h-full",
    sizes: "(max-width: 768px) 88vw, 36vw",
  },
  {
    id: "steam",
    src: IMAGES.steam,
    delayMs: 240,
    gridClass:
      "md:col-start-1 md:col-end-5 md:row-start-5 md:row-end-9 z-[4] md:-mt-8",
    aspectClass: "aspect-[4/5] md:aspect-auto md:min-h-[200px] md:h-full",
    sizes: "(max-width: 768px) 72vw, 28vw",
  },
  {
    id: "light",
    src: IMAGES.light,
    delayMs: 360,
    gridClass:
      "md:col-start-9 md:col-end-12 md:row-start-1 md:row-end-3 z-[3] md:-mt-4",
    aspectClass: "aspect-[3/4] md:aspect-auto md:min-h-[160px] md:h-full",
    sizes: "(max-width: 768px) 64vw, 22vw",
  },
];

type WellnessSaunaCollageProps = {
  locale: LocaleKey;
};

export default function WellnessSaunaCollage({ locale }: WellnessSaunaCollageProps) {
  const t = COPY[locale];
  const reduceMotion = useReducedMotion();
  const collageRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(!!reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setRevealed(true);
      return;
    }

    const el = collageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <section className="relative bg-ink text-main" aria-labelledby="hot-pool-heading">
      <div className="mx-auto max-w-[1240px] px-6 py-20 md:py-32">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 md:gap-y-0 md:items-start">
          {/* Copy — left editorial column */}
          <div className="col-span-12 md:col-span-5 md:col-start-1 md:row-start-1 relative z-20 md:pt-4 md:pr-4">
            <Eyebrow tone="dark" className="!text-main/55 mb-5 md:mb-6">
              {t.eyebrow}
            </Eyebrow>
            <Headline
              as="h2"
              id="hot-pool-heading"
              size="section"
              tone="dark"
              align="left"
              className="italic mb-6 md:mb-8 text-balance"
            >
              {t.headline}
            </Headline>
            <BodyText tone="dark" size="md" align="left" className="!text-main/72 max-w-prose">
              {t.body}
            </BodyText>
          </div>

          {/* Overlapping collage */}
          <div
            ref={collageRef}
            className="group/collage col-span-12 md:col-span-12 md:col-start-1 md:row-start-1 relative z-10 mt-4 md:mt-0 min-h-[520px] md:min-h-[clamp(520px,72vh,880px)]"
          >
            <div className="grid grid-cols-12 grid-rows-[auto_auto_auto_auto] md:grid-rows-8 gap-3 md:gap-0 h-full">
              {TILES.map((tile) => (
                <CollageTile
                  key={tile.id}
                  alt={t.alts[tile.id]}
                  src={tile.src}
                  gridClass={tile.gridClass}
                  aspectClass={tile.aspectClass}
                  sizes={tile.sizes}
                  delayMs={tile.delayMs}
                  revealed={revealed}
                  reduceMotion={!!reduceMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollageTile({
  alt,
  src,
  gridClass,
  aspectClass,
  sizes,
  delayMs,
  revealed,
  reduceMotion,
}: {
  alt: string;
  src: string;
  gridClass: string;
  aspectClass: string;
  sizes: string;
  delayMs: number;
  revealed: boolean;
  reduceMotion: boolean;
}) {
  const visible = revealed || reduceMotion;

  return (
    <div
      className={[
        "collage-tile relative col-span-12 overflow-hidden bg-white/5",
        "ring-1 ring-white/10 shadow-2xl shadow-black/50",
        "transition-[opacity,transform] duration-500 ease-out",
        "motion-safe:will-change-[opacity,transform]",
        "[@media(hover:hover)]:group-hover/collage:[&:not(:hover)]:opacity-35",
        "hover:!opacity-100 hover:z-20 hover:scale-[1.03]",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        gridClass,
        aspectClass,
      ].join(" ")}
      style={{
        transitionDelay: visible ? `${delayMs}ms` : "0ms",
      }}
    >
      <SiteImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
