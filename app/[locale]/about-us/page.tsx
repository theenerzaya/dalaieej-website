"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

const content = {
  en: {
    heroCaption:
      "The legend of the source—and a family sanctuary in the Khuvsgul taiga.",
    historySectionLabel: "A History Carved in Timber",
    historyScrollHint: "Scroll the years",
    history: [
      {
        year: "The 1990s",
        title: "The Auction",
        body: 'As Mongolia transitioned to capitalism, a local "Khatgal boy"—and future Member of Parliament—purchased a pioneer camp at auction. The price paid funded the province’s civil servants for a full year, cementing our investment in Khuvsgul\'s survival.',
      },
      {
        year: "The 2000s",
        title: "The Early Years",
        body: "We built a sanctuary from the ground up, carrying water by yak and living by candlelight through harsh winters.",
      },
      {
        year: "2009",
        title: "The Royal Ultimatum",
        body: "Our reputation soon preceded our infrastructure. When a visiting Middle Eastern royal insisted on staying despite our lack of indoor plumbing, we didn't hesitate. In a true display of northern hustle, we constructed flush toilets and running water from scratch just in time to welcome him.",
      },
      {
        year: "The 2010s",
        title: "Conservation",
        body: "We became a quiet retreat for global diplomats and established an on-site conservation program to protect the endangered Siberian musk deer.",
      },
      {
        year: "2022",
        title: "A New Era",
        body: "Dalai Eej passed to its third generation of female-led family stewardship, continuing our mission to protect and share the North.",
      },
    ],
    pillarsTitle: "The 6 Pillars",
    pillars: [
      {
        num: "01",
        title: "A Legacy of the Taiga",
        body: "We are a three-generation local family offering an authentic gateway into the North.",
      },
      {
        num: "02",
        title: "Built for the Wilderness",
        body: "Our seasonal timber cabins blend rustic immersion with refined comfort.",
      },
      {
        num: "03",
        title: "Sincere Northern Hospitality",
        body: "Our local team delivers intuitive, warm-hearted Mongolian care.",
      },
      {
        num: "04",
        title: "Effortless Planning",
        body: "We ensure your booking and local arrangements are seamless and secure.",
      },
      {
        num: "05",
        title: "Protectors of the Blue Pearl",
        body: "We pledge 10% of our net profits directly to local Khatgal community development.",
      },
      {
        num: "06",
        title: "A Vibrant Crossroads",
        body: "We are a gathering place where global explorers and locals share stories under the starlight.",
      },
    ],
    founderSectionLabel: "Founder's Note",
    founderHeadline: "A Note from the Family",
    founderListenLabel: "Listen",
    founderBody: [
      "Khuvsgul is the life force that raised us. Our founder wrote this song to honor the “Deep Blue Mother Ocean”—a pure spring that provides for the Mongolian North. Today, our family works side-by-side to share the taiga's profound silence and protective energy with you. Welcome to our home.",
      "— The Family at Dalai Eej Resort",
    ],
    founderClosing:
      "From the heart of our founder at Dalai Eej Resort—our family welcomes you to our northern home.",
  },
  mn: {
    heroCaption:
      "Рашааны домог, Хөвсгөлийн тайгад хадгалагдсан гэр бүлийн өргөө.",
    historySectionLabel: "Модонд сийлэгдсэн түүх",
    historyScrollHint: "Жилүүдийг гүйлгэх",
    history: [
      {
        year: "1990-ээд он",
        title: "Дуудлага худалдаа",
        body: 'Нийгмийн шилжилтийн үед, хожим УИХ-ын гишүүнээр сонгогдсон "Хатгалын хүү" пионерийн зусланг дуудлага худалдаагаар авав. Түүний төлсөн үнэ тухайн үед аймгийн бүх төрийн албан хаагчдын бүтэн жилийн цалин болж, бидний нутагтайгаа холбогдох холбоог баталгаажуулсан юм.',
      },
      {
        year: "2000-аад он",
        title: "Эхэн үе",
        body: "Бид ундны усаа сарлаг тэргээр зөөж, лааны гэрэлд хатуу өвлийг даван туулж, энэхүү өргөөг тэгээс нь босгосон.",
      },
      {
        year: "2009 он",
        title: "Эрхэм зочин",
        body: "Ойрхи Дорнодын нэгэн хааны гэр бүл манай байрлалыг таалж, заавал буудаллахыг шаардсан юм. Бид умардынхны дайчин шаргуу зангаар богино хугацаанд цэвэр ус, боловсон нойлыг тэгээс нь барьж байгуулж, эрхэм зочноо угтан авсан түүхтэй.",
      },
      {
        year: "2010-аад он",
        title: "Байгаль хамгаалал",
        body: "Бид гадаадын дипломатчид, хүндэт зочдын амар амгалангийн өргөө болж, нэн ховордсон Сибирийн хүдрийг өсгөн үржүүлэх төслийг хэрэгжүүлж эхэлсэн.",
      },
      {
        year: "2022 он",
        title: "Шинэ эрин үе",
        body: '"Далай ээж" ресорт гэр бүлийн гурав дахь үеийн буюу эмэгтэйчүүдийн удирдлагад шилжиж, умардын байгалиг хамгаалах зорилгоо үргэлжлүүлж байна.',
      },
    ],
    pillarsTitle: "6 Тулгуур",
    pillars: [
      {
        num: "01",
        title: "Тайгын өв уламжлал",
        body: "Бид хоймор нутгийн жинхэнэ дүр төрхийг хуваалцах гурван үеийн түүхт уугуул гэр бүл юм.",
      },
      {
        num: "02",
        title: "Байгальд ууссан хийц",
        body: "Манай модон бүхээгүүд байгалийн унаган төрхийг тав тухтай орчинтой төгс хослуулсан.",
      },
      {
        num: "03",
        title: "Хоймор нутгийн чин сэтгэл",
        body: "Манай хамт олон хоймор нутгийн цайлган, найрсаг зангаар чин сэтгэлээсээ үйлчилнэ.",
      },
      {
        num: "04",
        title: "Хялбар төлөвлөлт",
        body: "Захиалгаас эхлээд төлбөр тооцоо хүртэлх бүхий л үйл явц хурдан, найдвартай байх болно.",
      },
      {
        num: "05",
        title: "Хөх сувдын хамгаалагчид",
        body: "Бид цэвэр ашгийнхаа 10 хувийг Хатгал тосгоны хөгжилд шууд зориулдаг.",
      },
      {
        num: "06",
        title: "Амьд харилцааны уулзвар",
        body: "Бид дэлхийн аялагчид болон нутгийн иргэд оддын дор түүхээ хуваалцдаг халуун дулаан голомт юм.",
      },
    ],
    founderSectionLabel: "Үүсгэн байгуулагчийн зурвас",
    founderHeadline: "Гэр бүлийн зурвас",
    founderListenLabel: "Сонсох",
    founderBody: [
      "Хөвсгөл бол биднийг өсгөсөн амьдралын ундарга. Манай үүсгэн байгуулагч энэ дууг «Гүн цэнхэр эх далай» — Монголын умардтай тэжээл өгдөг цэвэр рашааныг өргөмжлөхөөр бичжээ. Өнөөдөр бид гэр бүлээрээ хамтдаа, тайгын гүн чимээгүй байдал, хамгаалах эрчим хүчийг тантай хуваалцдаг. Манайд тавтай морилно уу.",
      "— Далай ээж ресортын гэр бүл",
    ],
    founderClosing:
      "– Далай ээж ресортын үүсгэн байгуулагчийн зүрхний үгнээс. Бидний гэр бүлийн зүгээс таныг хоймор нутагт минь тавтай морилохыг урьж байна.",
  },
};

const founderSongLyrics = `Хөвсгөл далайн хөвөөнд хувь заяагаар төрж дээ
Хөл нүцгэн гүйлдсээр хүүхэд насаа өнгөрүүлж дээ
“Эх болсон зургаан зүйл хамаг амьтан”-ыг умдаалсан
Эзэн Монголын рашаан минь-Далай ээж минь
Ижий минь ээж далайдаа даатгаж дээ
Аавын минь аав тэнгэртээ залбирч дээ
Эр биеийг минь гүйцээж энх тунхтай золгуулж дээ
Ижий цэнхэр далай ээж минь-эзэн Монголын амин сүнс минь
    Уул уулсын эзэн Хорьдол сарьдаг минь
    Ус усны хатан гоо эх далай ээж минь
    Энэ Монголдоо ганц, эх дэлхийдээ ганцхан
    Гүн цэнхэрхэн далай ижий минь
Мөнх хөх тэнгэрээ тольдсон мөнх тэнгистээ мөргөөе
Мөнхөд орших нутгийн минь мөнхийн амьдрал минь
Мөнх тэнгэрийн хүчин дор мөнхөд цэлэлзээрэй
Ижий цэнхэр Далай минь- эзэн Монголын амин сүнс минь
Уул уулсын эзэн Хорьдол сарьдаг минь
    Ус усны хатан гоо эх далай ээж минь
    Энэ Монголдоо ганц, эх дэлхийдээ ганцхан
    Гүн цэнхэрхэн далай ижий минь
Гүн цэнхэрхэн
Гүн цэнхэрхэн
Гүн цэнхэрхэн далай ижий минь`;

/** Set when an audio file is added to `public/audio/founders-song.mp3`. */
const FOUNDER_AUDIO_SRC = "/audio/founders-song.mp3";

// Scrapbook visuals for the timeline—one entry per era (5 total). Swap `src`s
// or tweak rotations to change the layout; the text/year/title/body live on
// the localized `content[locale].history` array above.
const historyVisuals: Array<{
  primary: { src: string; rotate: string; caption?: { en: string; mn: string } };
  secondary?: { src: string; rotate: string };
  annotation?: { en: string; mn: string };
}> = [
  {
    primary: {
      src: "/images/about-bw.jpg",
      rotate: "-rotate-[3deg]",
      caption: { en: "Khatgal's son.", mn: "Хатгалын хүү." },
    },
    secondary: { src: "/images/about-scrapbook-lake.png", rotate: "rotate-[4deg]" },
    annotation: {
      en: "Auction day\u2014a year of civil service wages.",
      mn: "Дуудлагын өдөр — жилийн цалин.",
    },
  },
  {
    primary: {
      src: "/images/about-scrapbook-lake.png",
      rotate: "rotate-[2deg]",
      caption: { en: "First winters.", mn: "Анхны өвлүүд." },
    },
    annotation: {
      en: "Water by yak, light by candle.",
      mn: "Сарлагаар ус, лааны гэрэл.",
    },
  },
  {
    primary: {
      src: "/images/about-scrapbook-founder.jpg",
      rotate: "-rotate-[2deg]",
      caption: { en: "Middle Eastern royalty", mn: "Ойрхи Дорнодын хаад" },
    },
    annotation: {
      en: "Plumbing in two weeks flat.",
      mn: "Хоёр долоо хоногт нойл боссон.",
    },
  },
  {
    primary: {
      src: "/images/about-scrapbook-deer.png",
      rotate: "rotate-[3deg]",
      caption: { en: "Musk deer.", mn: "Хүдэр." },
    },
    annotation: {
      en: "Conservation program \u2014\u2192",
      mn: "Хамгааллын хөтөлбөр \u2014\u2192",
    },
  },
  {
    primary: {
      src: "/images/about-scrapbook-founder.jpg",
      rotate: "-rotate-[4deg]",
      caption: { en: "Third generation.", mn: "Гурав дахь үе." },
    },
    secondary: { src: "/images/about-scrapbook-lake.png", rotate: "rotate-[2deg]" },
    annotation: { en: "...with you.", mn: "...тантай хамт." },
  },
];

function CampfireMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* sparks */}
      <path d="M32 6v3" />
      <path d="M26 8l1.5 2.5" />
      <path d="M38 8l-1.5 2.5" />
      <path d="M22 12l2 1.5" />
      <path d="M42 12l-2 1.5" />
      {/* flame */}
      <path d="M32 14c3.5 4.5 6 7.8 6 12a6 6 0 0 1-12 0c0-2.3 1-4.1 2.4-5.3-.3 1.3-.1 2.6.6 3.6.6-3.4 1.6-6.7 3-10.3z" />
      {/* inner flame */}
      <path d="M32 22c1.8 2.4 3 4 3 6a3 3 0 0 1-6 0c0-1.3.6-2.3 1.4-2.9 0 .8.2 1.4.6 1.9.3-1.8.6-3.3 1-5z" />
      {/* logs */}
      <path d="M18 44l28 8" />
      <path d="M18 52l28-8" />
      <path d="M22 42l4 12" />
      <path d="M42 42l-4 12" />
    </svg>
  );
}

function SectionAccent({
  className = "",
  width = "w-20 md:w-24",
  invert = false,
  src = "/images/about-us/decorations/accent.svg",
}: {
  className?: string;
  width?: string;
  invert?: boolean;
  src?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex justify-center items-center py-8 md:py-12 ${className}`}
    >
      <img
        src={src}
        alt=""
        className={`${width} h-auto opacity-70 select-none pointer-events-none ${
          invert ? "invert brightness-0 opacity-60" : ""
        }`}
        draggable={false}
      />
    </div>
  );
}

function FounderNote({
  headline,
  body,
  playLabel,
  lyrics,
  closing,
}: {
  headline: string;
  body: string[];
  playLabel: string;
  lyrics: string;
  closing: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  // Grid-based, overlapping scrapbook layout
  return (
    <div className="relative mx-auto max-w-[1180px]">
      {/* soft base shadow under the whole composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 bottom-2 h-10 rounded-full bg-black/25 blur-2xl"
      />

      <div className="relative grid grid-cols-12 gap-0">
        {/* ---------- Envelope + Letter (right side) ---------- */}
        <div className="relative col-span-12 md:col-span-8 md:col-start-5 order-1 md:order-2">
          {/* Stacking grid: every child occupies the same cell. The letter is
              the only child without absolute positioning, so its intrinsic
              size drives the composition's height. The envelope back and flap
              sit behind it and extend slightly beyond the letter's edges. */}
          <div className="relative grid w-full [&>*]:[grid-area:1/1]">
            {/* Envelope back body */}
            <div
              className="relative m-[-3%_-1%_-5%_-1%] rounded-[4px] rotate-[-2deg] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]"
              style={{
                background:
                  "linear-gradient(180deg, #e6d9bd 0%, #d8c9a7 45%, #c9b88e 100%)",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='160' height='160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\"), linear-gradient(180deg, #e8dbc0 0%, #d6c7a3 55%, #c6b48a 100%)",
                border: "1px solid rgba(70, 52, 30, 0.22)",
              }}
              aria-hidden
            >
              {/* Postage stamp */}
              <div
                className="absolute right-[6%] top-[6%] w-[16%] aspect-[4/5] bg-[#c99a78] border-[3px] border-dashed border-[#b27a55] shadow-sm"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.12) 100%)",
                }}
              />
              {/* Circular postmark */}
              <div
                className="absolute right-[24%] top-[10%] w-[14%] aspect-square rounded-full border-2 border-[#8a5c3a]/60 rotate-[-12deg]"
                style={{
                  backgroundImage:
                    "repeating-radial-gradient(circle, rgba(138,92,58,0.35) 0 1px, transparent 1px 6px)",
                }}
              />
              {/* Address lines (bottom right) */}
              <div className="absolute right-[8%] bottom-[8%] w-[40%] space-y-[0.35rem] opacity-70">
                <div className="h-[2px] bg-[#5a3e22]/50" />
                <div className="h-[2px] w-[85%] bg-[#5a3e22]/45" />
                <div className="h-[2px] w-[65%] bg-[#5a3e22]/40" />
              </div>
            </div>

            {/* Envelope flap (sits above back, below letter) */}
            <div className="pointer-events-none relative">
              <div
                className="absolute left-[-1%] right-[-1%] top-[-3%] rotate-[-2deg] aspect-[2.4/1]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background:
                    "linear-gradient(180deg, #eadcbf 0%, #d5c49d 100%)",
                  borderTop: "1px solid rgba(70, 52, 30, 0.18)",
                  boxShadow: "inset 0 -6px 12px -4px rgba(0,0,0,0.2)",
                }}
                aria-hidden
              />
            </div>

            {/* Letter paper — drives the natural height of the composition */}
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative mx-auto w-[84%] bg-[#fbf7ee] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] px-[6%] py-[6%]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='160' height='160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\"), linear-gradient(180deg, #fdfaf1 0%, #f5ead4 100%)",
                border: "1px solid rgba(70, 52, 30, 0.14)",
              }}
            >
              <pre className="font-editorial-mn not-italic whitespace-pre-wrap leading-[1.55] text-[clamp(0.82rem,1.35vw,1.15rem)] text-[#1c2340]/85 [text-shadow:0_0_1px_rgba(28,35,64,0.12)]">
{lyrics}
              </pre>

              <p className="font-body mt-5 md:mt-6 text-[clamp(0.95rem,1.2vw,1.3rem)] text-[#1c2340]/80">
                {closing}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ---------- Note from the Family (left card) ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative col-span-12 md:col-span-5 md:col-start-1 md:row-start-1 order-2 md:order-1 mt-6 md:mt-0 md:self-end md:translate-y-[-8%] md:translate-x-[-2%] z-10"
        >
          <div
            className="relative mx-auto w-full max-w-[22rem] -rotate-[3deg] px-7 pt-10 pb-8 shadow-[0_22px_40px_-16px_rgba(0,0,0,0.5)]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='180' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E\"), linear-gradient(180deg, #e9dcbd 0%, #d9c59a 100%)",
              border: "1px solid rgba(70, 52, 30, 0.2)",
              // Torn/deckle edge on the bottom
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 96%, 96% 99%, 92% 95%, 88% 99%, 82% 94%, 76% 99%, 70% 95%, 64% 99%, 58% 94%, 52% 99%, 46% 95%, 40% 99%, 34% 95%, 28% 99%, 22% 95%, 16% 99%, 10% 95%, 4% 99%, 0% 96%)",
            }}
          >
            {/* Play button "taped" on top */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-[-2deg]">
              {/* piece of tape */}
              <span
                aria-hidden
                className="absolute left-1/2 -top-2 h-4 w-16 -translate-x-1/2 rotate-[-6deg] bg-[#f1e6c8]/70 shadow-sm"
              />
              <button
                type="button"
                onClick={toggle}
                aria-pressed={isPlaying}
                aria-label={playLabel}
                className="relative inline-flex items-center gap-2 rounded-sm bg-[#111418] px-3 py-1.5 text-[#efe7d0] shadow-md ring-1 ring-black/40 transition-transform hover:-translate-y-[1px]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#efe7d0] text-[#111418]">
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <Play className="h-3.5 w-3.5 translate-x-[1px]" strokeWidth={2.5} />
                  )}
                </span>
                <span className="font-body text-sm tracking-wide">
                  {playLabel}
                </span>
              </button>
            </div>

            <h3 className="font-editorial-mn text-[1.9rem] leading-[1.1] text-[#2a2416]">
              {headline}
            </h3>

            <div className="mt-5 space-y-4 font-body text-[0.95rem] leading-[1.7] text-[#2a2416]/85">
              {body.map((p, i) => {
                const isCredit = i === body.length - 1 && body.length > 1;
                return isCredit ? (
                  <p
                    key={i}
                    className="font-body italic text-[0.9rem] tracking-wide text-[#2a2416]/70"
                  >
                    {p}
                  </p>
                ) : (
                  <p key={i}>{p}</p>
                );
              })}
            </div>

            <audio ref={audioRef} preload="metadata" src={FOUNDER_AUDIO_SRC} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AboutUsPage() {
  const locale = useLocale();
  const isMn = locale === "mn";
  const t = isMn ? content.mn : content.en;
  const historyScrollRef = useRef<HTMLDivElement | null>(null);

  // Translate vertical wheel input into horizontal scroll while the timeline
  // still has room to scroll, so users don't need to find a trackpad gesture
  // or literally scroll left-to-right. Once an edge is reached, we release so
  // the page continues scrolling vertically and the user is never trapped.
  useEffect(() => {
    const el = historyScrollRef.current;
    if (!el) return;

    let target = el.scrollLeft;
    let rafId: number | null = null;

    const step = () => {
      rafId = null;
      const maxScroll = el.scrollWidth - el.clientWidth;
      target = Math.max(0, Math.min(maxScroll, target));
      const current = el.scrollLeft;
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = target;
        return;
      }
      el.scrollLeft = current + diff * 0.22;
      rafId = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      // Leave horizontal gestures alone so native trackpad momentum keeps working.
      if (absY <= absX) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const delta = e.deltaY;
      const current = el.scrollLeft;
      const atStart = current <= 0;
      const atEnd = current >= maxScroll - 1;

      // If we're already past the edge in the direction of travel, let the
      // page scroll vertically instead of hijacking.
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;

      e.preventDefault();
      target = Math.max(0, Math.min(maxScroll, target + delta));
      if (rafId == null) rafId = requestAnimationFrame(step);
    };

    const onScroll = () => {
      // Keep target in sync if the user drags the scrollbar or snap adjusts.
      if (rafId == null) target = el.scrollLeft;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main
      id="main-content"
      className="bg-main text-ink min-h-screen"
      style={{
        backgroundImage:
          'url("/images/about-us/decorations/paper.jpg")',
        backgroundRepeat: "repeat",
        backgroundSize: "720px 720px",
        backgroundBlendMode: "multiply",
      }}
    >
      <section className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="sr-only">{isMn ? "Бидний тухай" : "About Us"}</h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-sm border border-ink/10 shadow-lg bg-ink/[0.04]">
              <img
                src="/images/about-hero.webp"
                alt="Illustrated map of Khuvsgul region"
                className="w-full h-auto"
              />
            </div>
            <p className="text-center mt-8 font-body text-sm md:text-base italic text-ink/60 tracking-wide max-w-2xl mx-auto leading-relaxed">
              {t.heroCaption}
            </p>
          </motion.div>
        </div>
      </section>

      <SectionAccent />

      <section className="py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 mb-2">
            <div className="flex items-center gap-6 flex-1">
              <h2 className="font-editorial-mn text-4xl md:text-6xl text-ink leading-tight whitespace-nowrap">
                {t.historySectionLabel}
              </h2>
              <div className="h-px flex-1 bg-ink/15" />
            </div>
            <span className="hidden md:inline-flex items-center gap-2 font-body italic text-sm text-ink/55 whitespace-nowrap">
              {t.historyScrollHint}
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>

        <div
          ref={historyScrollRef}
          className="mt-12 md:mt-16 w-full overflow-x-auto overflow-y-visible overscroll-x-contain snap-x snap-proximity [scrollbar-width:thin]"
        >
          <div className="flex flex-row items-start gap-6 md:gap-10 w-max pl-6 pr-6 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pr-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pt-6 pb-16">
            {t.history.map((item, i) => {
              const visuals = historyVisuals[i];
              const caption = visuals?.primary.caption?.[isMn ? "mn" : "en"];
              const annotation = visuals?.annotation?.[isMn ? "mn" : "en"];
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-5% 0px -5% 0px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.25) }}
                  className="snap-center shrink-0 relative w-[min(92vw,22rem)] md:w-[26rem] h-[34rem] md:h-[36rem]"
                >
                  {/* Secondary polaroid (tucked behind) */}
                  {visuals?.secondary ? (
                    <div
                      className={`absolute top-2 left-2 ${visuals.secondary.rotate} w-40 md:w-44 bg-white p-2 pb-4 shadow-lg border border-ink/5`}
                      aria-hidden
                    >
                      <img src={visuals.secondary.src} alt="" className="w-full h-40 md:h-44 object-cover" />
                    </div>
                  ) : null}

                  {/* Primary polaroid */}
                  {visuals ? (
                    <div
                      className={`absolute top-0 ${visuals.secondary ? "left-28 md:left-32" : "left-6 md:left-10"} ${visuals.primary.rotate} w-56 md:w-64 bg-white p-3 pb-10 shadow-xl border border-ink/5`}
                    >
                      <img src={visuals.primary.src} alt={item.title} className="w-full h-56 md:h-64 object-cover" />
                      {caption ? (
                        <p className="font-editorial-mn text-base md:text-lg text-ink/75 text-center mt-2 leading-tight">
                          {caption}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Aged-paper note card */}
                  <div
                    className={`absolute bottom-0 ${i % 2 === 0 ? "left-0 md:left-2 rotate-[-1deg]" : "right-0 md:right-2 rotate-[1.5deg]"} w-[17rem] md:w-[18rem] bg-[#efe3c9] border border-ink/10 shadow-lg px-6 py-6 md:px-7 md:py-7`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
                    }}
                  >
                    <p className="font-body italic text-[0.7rem] md:text-xs uppercase tracking-[0.2em] text-ink/55 mb-1">
                      {item.year}
                    </p>
                    <h3 className="font-editorial-mn text-2xl md:text-[1.7rem] text-ink mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm md:text-[0.95rem] leading-[1.65] text-ink/80">{item.body}</p>
                  </div>

                  {/* Handwritten annotation */}
                  {annotation ? (
                    <p
                      className={`absolute ${i % 2 === 0 ? "bottom-[-1.5rem] right-2 rotate-[-4deg]" : "bottom-[-1.5rem] left-2 rotate-[3deg]"} font-editorial-mn text-base md:text-lg text-ink/65 leading-tight max-w-[12rem]`}
                    >
                      {annotation}
                    </p>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <SectionAccent />

      <section
        className="relative py-24 md:py-36 bg-[#4B5A3E] text-[#EDE3CC] overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cg fill='none' stroke='%23EDE3CC' stroke-opacity='0.07' stroke-width='1'%3E%3Cpath d='M0 110 Q55 55 110 110 T220 110'/%3E%3Cpath d='M0 60 Q55 5 110 60 T220 60'/%3E%3Cpath d='M0 160 Q55 105 110 160 T220 160'/%3E%3Ccircle cx='55' cy='110' r='4'/%3E%3Ccircle cx='165' cy='110' r='4'/%3E%3Ccircle cx='110' cy='60' r='3'/%3E%3Ccircle cx='110' cy='160' r='3'/%3E%3Cpath d='M95 95 L125 125 M125 95 L95 125'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "220px 220px",
        }}
      >
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-editorial-mn text-4xl md:text-5xl text-center text-[#EDE3CC] mb-14 md:mb-20 tracking-wide"
          >
            {t.pillarsTitle}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-5">
            {t.pillars.map((pillar, i) => {
              const isLast = i === t.pillars.length - 1;
              return (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
                  className="rounded-sm bg-black/15 backdrop-blur-[2px] border border-[#EDE3CC]/10 px-6 py-7 md:px-8 md:py-8 flex flex-col h-full"
                >
                  <span className="block font-editorial-mn not-italic text-lg md:text-xl text-[#EDE3CC]/70 mb-2 tracking-wide">
                    {pillar.num}
                  </span>
                  <h3 className="font-editorial-mn text-2xl md:text-[1.75rem] leading-tight text-[#EDE3CC] mb-4">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-base md:text-[1.02rem] leading-[1.75] text-[#EDE3CC]/80 flex-1">
                    {pillar.body}
                  </p>
                  {isLast ? (
                    <div className="flex justify-center mt-6 pt-2">
                      <CampfireMark className="w-16 h-16 md:w-20 md:h-20 text-[#EDE3CC]/80" />
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionAccent />

      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background photo with soft blue atmosphere */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/about-hero.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(64,98,142,0.55) 0%, rgba(46,70,105,0.45) 45%, rgba(32,49,74,0.65) 100%)",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-editorial-mn text-[#f3ead3] text-5xl md:text-7xl leading-tight mb-12 md:mb-16 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            {t.founderSectionLabel}
          </motion.h2>

          <FounderNote
            headline={t.founderHeadline}
            body={t.founderBody}
            playLabel={t.founderListenLabel}
            lyrics={founderSongLyrics}
            closing={t.founderClosing}
          />
        </div>
      </section>

      <div className="pb-24 md:pb-32" />
    </main>
  );
}
