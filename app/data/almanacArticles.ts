export type AsidePlacement = "center" | "aside-span" | "aside-left" | "aside-right";

export type AlmanacContentBlock =
  | { type: "prose"; text: string; placement?: AsidePlacement }
  | { type: "subhead"; text: string }
  | {
      type: "image";
      src: string;
      alt: string;
      captionTitle?: string;
      caption: string;
      aspectClass?: string;
      fit?: "cover" | "contain";
      size?:
        | "default"
        | "compact"
        | "compactLarge"
        | "compactLargeSm"
        | "compactLarge90"
        | "centered";
      /** Omit ring/background on compact figures (e.g. archival scans). */
      frameless?: boolean;
      placement?: AsidePlacement;
    }
  | {
      type: "video";
      src: string;
      alt: string;
      caption: string;
      credit?: string;
      /** `viewport-75` — 75% of the viewport width, centered (breaks out of the prose column). */
      width?: "default" | "viewport-75";
    }
  | {
      type: "dataCard";
      eyebrow: string;
      body: string;
    };

export type AlmanacArticleSection = {
  id: string;
  tocLabel: string;
  title: string;
  /** Compact figure column: default right of intro prose; `left` puts images left of trailing prose. */
  compactAside?: "left" | "right";
  /** `flow` — inline data cards float beside prose within the section. */
  layout?: "default" | "flow";
  image?: {
    src: string;
    alt: string;
    label: string;
    caption?: string;
    aspectClass?: string;
    size?: "default" | "compact" | "compactLarge" | "compactLargeSm";
  };
  blocks: AlmanacContentBlock[];
  epilogue?: {
    quote: string;
    attribution: string;
  };
};

export type AlmanacArticle = {
  slug: string;
  chapterEyebrow: string;
  title: string;
  lede: string[];
  heroImage: {
    src: string;
    alt: string;
    objectPosition?: string;
    /** Override default hero frost wash (percent). */
    frostOpacity?: number;
    /** Override default hero frost blur (px). */
    frostBlurPx?: number;
  };
  /** Navbar floats transparent over the hero until scroll (wellness-style). */
  translucentNavbar?: boolean;
  metadata: {
    /** ISO 8601 — used for Open Graph and Article JSON-LD */
    published: string;
    modified: string;
  };
  sections: AlmanacArticleSection[];
  pullQuote?: {
    eyebrow: string;
    title: string;
    body: string;
    image?: { src: string; alt: string; objectPosition?: string };
  };
  closingImage?: {
    src: string;
    alt: string;
    caption: string;
    aspectClass?: string;
  };
  epilogue?: {
    quote: string;
    attribution: string;
  };
  furtherReading?: { title: string; href: string }[];
  archivalCard?: {
    id?: string;
    tocLabel?: string;
    eyebrow: string;
    body: string;
    image: { src: string; alt: string };
    link?: { label: string; href: string };
  };
  journalInset?: {
    id?: string;
    tocLabel?: string;
    eyebrow: string;
    title: string;
    body: string;
    src: string;
    alt: string;
  };
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
};

export const ALMANAC_ARTICLES: AlmanacArticle[] = [
  {
    slug: "murun",
    chapterEyebrow: "Chapter II",
    title: "Field Notes from Mörön",
    lede: [
      "Before the pavement ends and the absolute isolation of the Khaich Valley begins, there is Mörön. It is less of a grand provincial capital and more of a quirky logistical hub—a frontier town that operates entirely on its own highly specific, deeply charming frequency.",
    ],
    heroImage: {
      src: "/images/almanac/murun/hero-wes-anderson-terminal.webp",
      alt: "Murun Airport terminal, noted for its mid-century aesthetic by Accidentally Wes Anderson.",
      objectPosition: "50% 45%",
    },
    metadata: {
      published: "2025-04-01T00:00:00.000Z",
      modified: "2026-05-30T00:00:00.000Z",
    },
    prev: {
      href: "/getting-here",
      label: "Chapter I — The Journey",
    },
    next: {
      href: "/almanac/borders-and-industry",
      label: "Chapter III — Borders & Industry",
    },
    sections: [
      {
        id: "wes-anderson-runway",
        tocLabel: "The Wes Anderson Runway",
        title: "The Wes Anderson Runway",
        image: {
          src: "/images/almanac/murun/airport-exterior.jpg",
          alt: "Murun Airport terminal viewed from the tarmac, with the wing and steppe mountains beyond.",
          label: "Mörön Airport",
        },
        blocks: [
          {
            type: "prose",
            text: "The journey north usually begins on the tarmac of Mörön Airport (MXV). While a previous, pastel iteration of its architecture once caught the eye of the Accidentally Wes Anderson catalogue, the modern reality of the airstrip is much more grounded. It is so deeply woven into the daily fabric of the town that, before the first flights arrive, the perimeter of the runway is routinely repurposed by the local jogging club as their morning training track.",
          },
        ],
      },
      {
        id: "northern-icarus",
        tocLabel: "The Northern Icarus",
        title: "The Northern Icarus",
        image: {
          src: "/images/almanac/murun/gelenkhuu-statue.jpg",
          alt: "Bronze monument to Shükherch Gelenkhüü outside Mörön Airport.",
          label: "Monument to Gelenkhüü",
          size: "compact",
        },
        blocks: [
          {
            type: "prose",
            text: "Stepping out of the terminal, arrivals are met by a bronze monument that captures the sheer, unapologetic defiance of the province. It depicts Shükherch Gelenkhüü, a local from the 1930s who became so consumed by the concept of flight that he engineered his own wings out of sheepskin and eagle feathers and threw himself from a 170-meter cliff.",
          },
          {
            type: "prose",
            text: "To domestic guests, the premise instantly evokes Byambyn Rinchen's acclaimed short story, Shükherch Bunya (Parachutist Bunya). But there is a sharp divergence between national fiction and northern reality. In Rinchen's tale, the aviator's ambition ends in tragedy and death. Gelenkhüü, however, survived his fall—brilliantly—by driving his own flock of sheep to the base of the cliff beforehand to act as a physical cushion.",
          },
        ],
      },
      {
        id: "international-fire-engine",
        tocLabel: "The International Fire Engine",
        title: "The International Fire Engine",
        blocks: [
          {
            type: "prose",
            text: "Mörön is defined by its resourcefulness. When the airport recently celebrated a massive milestone—receiving its first-ever direct international flight from South Korea—aviation protocol dictated that two fire engines had to be present on the tarmac. Equipped with only one, the airport was unfazed. They simply borrowed the municipal fire engine from the town square for the afternoon. The flight landed flawlessly.",
          },
        ],
      },
      {
        id: "finding-dalai-eej",
        tocLabel: "Finding Dalai Eej",
        title: "Finding Dalai Eej",
        blocks: [
          {
            type: "prose",
            text: "As you drive through the streets to provision for the lake, the local reverence for your final destination becomes obvious. The town's bustling central market is named Dalai Eej (\"Mother Ocean\"), and you will spot the exact same name painted across the facades of countless neighborhood kiosks. It is a fun, recurring primer on the lake's cultural gravity as you navigate the final roads toward the pristine eastern shores.",
          },
        ],
      },
    ],
  },
  {
    slug: "borders-and-industry",
    chapterEyebrow: "Chapter III",
    title: "The Making of the North: Borders & Industry",
    lede: [
      "To a modern traveller, the administrative map of Mongolia—divided into twenty-one aimags (provinces)—can seem somewhat arbitrary. In reality, the boundaries drawn across the northern steppe are a direct byproduct of centuries of geopolitical shifts, from the colonial administration of the Qing Dynasty to the heavy industry of Soviet socialism.",
    ],
    heroImage: {
      src: "/images/almanac/borders-and-industry/hero-sukhbaatar.jpeg",
      alt: "Historical photograph of the Sukhbaatar.",
      objectPosition: "50% 45%",
    },
    metadata: {
      published: "2025-05-01T00:00:00.000Z",
      modified: "2026-05-30T00:00:00.000Z",
    },
    prev: {
      href: "/almanac/murun",
      label: "Chapter II — Field Notes from Mörön",
    },
    next: {
      href: "/almanac/forest-and-steppe",
      label: "Chapter IV — Forest & Steppe",
    },
    sections: [
      {
        id: "zasagt-khan",
        tocLabel: "The Realm of the Zasagt Khan",
        title: "The Realm of the Zasagt Khan",
        blocks: [
          {
            type: "prose",
            text: "Before the 1930s, the modern concept of Khövsgöl did not exist. Instead, the Mongolian steppe was divided into four massive, sweeping provinces. The territory that encompasses today's Khövsgöl belonged largely to the Zasagt Khan Aimag (The Province of the Ruling King). Governed by dynastic nobles, it was a vast, wild frontier region defined by nomadic movement rather than fixed borders.",
          },
          {
            type: "image",
            src: "/images/almanac/borders-and-industry/zasagt-khan-aimags-map.jpg",
            alt: "Historical map of the four aimags of Outer Mongolia under Qing administration.",
            captionTitle: "THE FOUR AIMAGS (c. 18th – Early 20th Century)",
            caption:
              "Before the modern reorganisation into twenty-one provinces, Outer Mongolia was administered by the Qing Dynasty as four massive, sweeping aimags. From west to east, they were the realms of the Zasagt Khan, Sain Noyon Khan, Tüsheet Khan, and Setsen Khan. Flanked by special military frontiers (like Khovd in the far west), this four-province structure governed the nomadic movement of the steppe for nearly two hundred years, until the collapse of the Bogd Khanate and the rise of the Soviet-backed Mongolian People's Republic in the 1920s.",
            fit: "contain",
            size: "centered",
          },
        ],
      },
      {
        id: "original-capital",
        tocLabel: "The Original Capital",
        title: "The Original Capital",
        blocks: [
          {
            type: "prose",
            text: "As the Qing Dynasty exerted its influence, fixed settlements became necessary to monitor trade and territorial lines. Khatgal was founded in 1727 as a Qing military border post. Because of its strategic proximity to the Russian frontier, it naturally developed into a bustling transit hub.",
          },
          {
            type: "prose",
            text: "When the modern Khövsgöl province was officially carved out and established in 1931, Khatgal was designated as its first administrative capital. However, logistical realities quickly set in, and just two years later in 1933, the provincial centre was permanently relocated 100 km south to the more accessible town of Mörön.",
          },
        ],
      },
      {
        id: "industrial-frontier",
        tocLabel: "Mongolia's Industrial Frontier",
        title: "Mongolia's Industrial Frontier",
        blocks: [
          {
            type: "prose",
            text: "Despite losing its capital status, Khatgal was not abandoned; it transformed into an industrial powerhouse. In 1933, the Khatgal Wool Washing Factory was established on the southern shore of the lake.",
          },
          {
            type: "prose",
            text: "Built with Soviet engineering and capital, it was a massive milestone for the country—one of the very first fully mechanised light-industry factories in Mongolia. The facility was considered a triumph of national engineering, and its round-the-clock operations were even immortalised in a state documentary capturing an inspection by Mongolian leader Yumjaagiin Tsedenbal. The surviving footage, highlighting the relentless hum of the machinery and the strict quotas of the command economy, perfectly captures the heavy, demanding momentum of the era.",
          },
          {
            type: "video",
            src: "/images/almanac/borders-and-industry/khatgal-wool-factory.mp4",
            alt: "Archival footage of the Khatgal Wool Washing Factory.",
            width: "viewport-75",
            caption:
              "Archival footage of the Khatgal Wool Washing Factory (c. 1980–1988), capturing an inspection by state leader Yumjaagiin Tsedenbal. The audio's explicit directives for the floor staff to \"work harder\" offer a raw glimpse into the intense demands of the Five-Year Plan.",
            credit: "Sourced via the Ergen Dursakhad Saikhan digital archive.",
          },
          {
            type: "subhead",
            text: "The Hub of the North",
          },
          {
            type: "prose",
            text: "Khatgal became a bustling, cinematic centre of commerce. Wool and goods were transported not just by modern trucks, but by steamboats across the summer waters, horse-drawn sledges fitted with iron horseshoes over the winter ice, and camel caravans arriving from as far away as the Gobi Desert.",
          },
          {
            type: "subhead",
            text: "The Power Grid",
          },
          {
            type: "prose",
            text: "The factory was remarkably advanced for its time. Its massive steam boilers generated enough surplus electricity to power Khatgal's schools, hospitals, and homes—making it the first rural town in Mongolia to have 24-hour electricity, decades before the national grid arrived.",
          },
          {
            type: "subhead",
            text: "The Ecological Pivot",
          },
          {
            type: "prose",
            text: "For over half a century, the factory operated around the clock, processing thousands of tons of wool bound for international markets. However, in 1988, a landmark government resolution was passed. To protect the pristine ecology and pure waters of Lake Khövsgöl, the heavy wool-washing operations were permanently ordered to cease.",
          },
          {
            type: "prose",
            text: "Today, the heavy industrial machinery and cargo barges are gone, and Khatgal has returned to a quieter existence. Yet, this era of sweeping geopolitical shifts and early industry remains woven into the architecture, the local infrastructure, and the families who built the modern north.",
          },
        ],
      },
    ],
    archivalCard: {
      eyebrow: "THE SUKHBAATAR MUSEUM",
      body: "A stark physical record of the northern frontier. Located at the former Khatgal petroleum base, this open-air archive preserves the Sukhbaatar-1 and a sunken fleet of Soviet logistics machinery hauled from depths of 171 meters.",
      image: {
        src: "/images/almanac/borders-and-industry/sukhbaatar-museum.jpeg",
        alt: "The Sukhbaatar Museum open-air archive at the former Khatgal petroleum base.",
      },
      link: {
        label: "View Coordinates",
        href: "https://maps.app.goo.gl/Gpk4Ab9zjAQ6DchU9",
      },
    },
    journalInset: {
      id: "local-dispatch",
      tocLabel: "Local Dispatch",
      eyebrow: "LOCAL DISPATCH",
      title: "A Playground of Black Ice…",
      body: "Rosy-cheeked and entirely unbothered by the -50°C (-58°F) winter, the local children skate in perfect single file across the Mother Sea. To the rest of the world, this is a formidable, 262-meter-deep frozen expanse. But here in our Khatgal, it is simply the backyard where they play and grow up.",
      src: "/images/almanac/borders-and-industry/khatgal-ice-skating.mp4",
      alt: "Children skating in single file across the frozen surface of Lake Khövsgöl near Khatgal.",
    },
  },
  {
    slug: "forest-and-steppe",
    chapterEyebrow: "Chapter IV",
    title: "The Forest and the Steppe: An Ancient Divide",
    lede: [
      "Historian David Morgan notes in The Mongols that one of the deepest, most enduring divides in Central Asia was never just political—it was ecological. For centuries, a quiet tension existed between the nomadic pastoralists of the open steppe and the hunter-gatherer \"forest dwellers\" (hoi-yin irgen) of the northern taiga.",
      "Lake Khövsgöl sits exactly on this ancient geographic fault line. As you travel north from Mörön toward Khatgal, you are physically crossing from the Central Asian steppe into the Siberian taiga. The landscape shifts abruptly from the rolling, arid grasslands that defined the Mongol Empire into dense, alpine forests of larch and pine.",
    ],
    heroImage: {
      src: "/images/almanac/forest-and-steppe/hero-deer-stones.jpg",
      alt: "The Uushigiin Övör Deer Stones at the ancient threshold of the steppe.",
      objectPosition: "50% 45%",
      frostOpacity: 34,
      frostBlurPx: 9,
    },
    translucentNavbar: true,
    metadata: {
      published: "2025-06-01T00:00:00.000Z",
      modified: "2026-05-30T00:00:00.000Z",
    },
    prev: {
      href: "/almanac/borders-and-industry",
      label: "Chapter III — Borders & Industry",
    },
    next: {
      href: "/almanac/khovsgol-and-baikal",
      label: "Chapter V — Khövsgöl & Baikal",
    },
    sections: [
      {
        id: "two-ways-of-life",
        tocLabel: "Two Ways of Life, Two Faiths",
        title: "Two Ways of Life, Two Faiths",
        layout: "flow",
        image: {
          src: "/images/personas/frontier-en.jpg",
          alt: "The open steppe meeting the northern forest at Khövsgöl.",
          label: "Steppe and taiga at the northern frontier",
          aspectClass: "aspect-[4/3] md:aspect-[21/9]",
        },
        blocks: [
          {
            type: "prose",
            text: "This dramatic geography created a hard border between two radically different ways of life—and ultimately, two different spiritual worlds.",
          },
          {
            type: "subhead",
            text: "The Steppe and the Sutras",
          },
          {
            type: "prose",
            text: "To the south, the pastoralists thrived on the open plains. As the centuries progressed, the steppe nomads underwent a massive cultural shift, adopting Tibetan Buddhism. High lamas became powerful political figures, vast monasteries were built across the plains, and the nomadic elite embraced the structured, institutionalised religion of the Yellow Hat sect.",
          },
          {
            type: "subhead",
            text: "The Forest and the Old Gods",
          },
          {
            type: "dataCard",
            eyebrow: "THE TAIGA BIOME",
            body: "The largest continuous forest on Earth. Originating in the Khövsgöl basin and stretching to the Arctic Circle, this freezing expanse relies on permafrost to act as the planet’s primary carbon sink, sequestering more carbon than the Amazon rainforest.",
          },
          {
            type: "prose",
            text: "To the north, deep in the taiga and the neighbouring Darkhad Valley, the forest peoples lived an entirely different existence. Relying on hunting, trapping, and reindeer herding, they completely rejected the encroaching Buddhism. The dense, impenetrable forests acted as a fortress, allowing the northern tribes to preserve the original animist faith of the Mongols: Shamanism.",
          },
          {
            type: "prose",
            text: "To this day, the Khövsgöl region remains the undisputed heartland of Mongolian shamanism—the original religion of Chinggis Khan. While his successors would later bastardise the old ways, adopting foreign faiths and elaborate rituals as they settled into sedentary empires, the Great Khan's own spirituality was notoriously austere. He famously performed no sacrifices, preferring to simply remove his hat and belt to speak directly to the Eternal Blue Sky. When you arrive in Khatgal and look out over the water, you are standing on the ultimate frontier: the exact point where the Buddhist steppe ends, and that ancient, unmediated connection to the taiga begins.",
          },
        ],
      },
    ],
    closingImage: {
      src: "/images/almanac/forest-and-steppe/estate-library.jpg",
      alt: "Selections from the estate library at Dalai Eej.",
      caption:
        "Selections from the estate library. A curated study of the northern frontier, featuring local cartography, regional ecology, indigenous glossaries, and foundational Mongolian history.",
      aspectClass: "aspect-[4/3] md:aspect-[16/10]",
    },
  },
  {
    slug: "khovsgol-and-baikal",
    chapterEyebrow: "Chapter V",
    title: "Two Lakes, One Empire: Khövsgöl and Baikal",
    lede: [
      "To understand Lake Khövsgöl, one must look 200 kilometers across the northern border to its geological older sister: Lake Baikal. Today, a hard international border separates the two, but for centuries, they were the dual anchors of the northern Mongolian frontier.",
    ],
    heroImage: {
      src: "/images/almanac/khovsgol-and-baikal/olkhon-island-shores.jpg",
      alt: "The shores of Olkhon Island on Lake Baikal.",
      objectPosition: "50% 50%",
    },
    translucentNavbar: true,
    metadata: {
      published: "2025-07-01T00:00:00.000Z",
      modified: "2026-05-30T12:00:00.000Z",
    },
    prev: {
      href: "/almanac/forest-and-steppe",
      label: "Chapter IV — Forest & Steppe",
    },
    sections: [
      {
        id: "sister-lakes",
        tocLabel: "The Sister Lakes",
        title: "The Sister Lakes",
        blocks: [
          {
            type: "prose",
            text: "Khövsgöl and Baikal are geologically bound. They sit within the same massive tectonic rift valley, and the waters of Khövsgöl eventually flow all the way into Baikal via the Eg and Selenge rivers.",
          },
          {
            type: "prose",
            text: "More importantly, they were historically part of the same unified cultural expanse. The very name Baikal is a Russian adaptation of the Mongolian word Baigal (Байгаль), which simply translates to \"nature.\" To the Mongols who inhabited its shores, the lake was the ultimate natural phenomenon.",
          },
        ],
      },
      {
        id: "severing-of-north",
        tocLabel: "The Severing of the North",
        title: "The Severing of the North",
        blocks: [
          {
            type: "prose",
            text: "The separation of the two lakes was not a natural divide, but an imperial one. For centuries, the dense forests connecting Khövsgöl and Baikal were indistinguishable—a single, sprawling northern territory inhabited by the Buryats. Bound by blood and speaking the Mongolian language, they were not a separate people, but a direct extension of the nomadic world to the south.",
          },
          {
            type: "image",
            src: "/images/almanac/khovsgol-and-baikal/west-buryat-family-portrait.webp",
            alt: "A portrait of a West Buryat family, late 19th century.",
            caption:
              "A portrait of a West Buryat family, late 19th century. Archival photograph.",
            fit: "contain",
            size: "compactLargeSm",
          },
          {
            type: "prose",
            text: "However, as the Russian Empire expanded eastward across Siberia, and the Qing Dynasty secured its grip on the Mongolian steppe, the two powers collided. Through a series of treaties—most notably the Treaty of Kyakhta in 1727—a hard geopolitical line was drawn directly through the taiga. Lake Baikal and the Buryat people were formally absorbed into the Russian Empire, while Lake Khövsgöl remained on the southern side of the border, left as the northernmost frontier of the Mongolian state.",
          },
        ],
      },
      {
        id: "transformation-of-taiga",
        tocLabel: "The Transformation of the Taiga",
        title: "The Transformation of the Taiga",
        compactAside: "left",
        blocks: [
          {
            type: "prose",
            text: "This geopolitical fracture would permanently alter the destiny of the two lakes. For millennia, the vast expanse of Siberia surrounding Baikal was the exclusive domain of Mongolic, Turkic, and Tungusic tribes—peoples intimately adapted to the harsh, sacred rhythms of the forest and steppe.",
          },
          {
            type: "image",
            src: "/images/almanac/khovsgol-and-baikal/gulag-remnants-amos-chapple.jpg",
            alt: "Decaying remnants of the Soviet penal network, deep in the Siberian taiga.",
            caption:
              "The decaying remnants of the Soviet penal network, deep in the Siberian taiga. Photograph by Amos Chapple / RFE/RL.",
            fit: "cover",
            size: "compactLarge",
          },
          {
            type: "prose",
            text: "As the Russian—and later Soviet—state tightened its grip on Siberia, the taiga was repurposed. The deep forests around Baikal, once the sanctuary of indigenous hunters and shamans, were transformed into the backbone of the Soviet penal system. Across the decades, an estimated 18 million prisoners were absorbed into the vast network of gulags spread across the Siberian expanse. The forced insertion of European prisoners into the freezing, alien environment of the Asian taiga remains one of the great geographic and psychological traumas of the 20th century.",
          },
          {
            type: "prose",
            text: "While Baikal saw its shores industrialised and its surrounding forests turned into penal colonies, Khövsgöl experienced a very different 20th century. Sheltered just south of the border, the \"Mother Ocean\" of Mongolia was largely spared this mass demographic trauma. It was left in silence, allowing it to remain the pristine sanctuary of the old north.",
          },
        ],
      },
    ],
    epilogue: {
      quote:
        "The water is unusually transparent, so that you can look through it as through air... I have never in my life seen such richness of colour. It is a marvel.",
      attribution: "— A. Chekhov, On the Sister Lake of Baikal, 1890",
    },
    furtherReading: [
      {
        title:
          "The Letters of Anton Chekhov: Siberian Correspondence and Sakhalin Field Notes, 1890.",
        href: "https://www.gutenberg.org/ebooks/6408",
      },
      {
        title: "Presidential Library of Russia. The Treaty of Kyakhta, 1727.",
        href: "https://www.prlib.ru/en/history/619680",
      },
      {
        title: "Virtual Museum of the Gulag. Bamlag Archive, 1933.",
        href: "https://gulag.online/",
      },
      {
        title: "Helsinki Gulag Echoes. Bamlag Records by Dr. M. Nakonechnyi, 2021.",
        href: "https://blogs.helsinki.fi/gulagechoes/2021/06/03/bamlags-lingering-shadow/",
      },
      {
        title: "Radio Free Europe. Siberian Penal Network Expeditions, 2018.",
        href: "https://www.rferl.org/a/the-gulag-hunters-recording-what-remains-of-stalins-labor-camps/29574803.html",
      },
    ],
  },
];

import { ALMANAC_ARTICLES as MN_ARTICLES } from "./almanacArticles.mn";

export const ALMANAC_ARTICLE_SLUGS = ALMANAC_ARTICLES.map((article) => article.slug);

export function getAlmanacArticle(slug: string, locale?: string): AlmanacArticle | undefined {
  const articles = locale === "mn" ? MN_ARTICLES : ALMANAC_ARTICLES;
  return articles.find((article) => article.slug === slug);
}
