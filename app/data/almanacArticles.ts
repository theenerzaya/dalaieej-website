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
      size?: "default" | "compact" | "compactLarge" | "compactLargeSm" | "centered";
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
    };

export type AlmanacArticleSection = {
  id: string;
  tocLabel: string;
  title: string;
  /** Compact figure column: default right of intro prose; `left` puts images left of trailing prose. */
  compactAside?: "left" | "right";
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
  };
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
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
};

export const ALMANAC_ARTICLES: AlmanacArticle[] = [
  {
    slug: "murun",
    chapterEyebrow: "Chapter II",
    title: "The Northern Gateway: Mörön & Beyond",
    lede: [
      "Before the pavement ends and the wilderness of the Khaich Valley begins, there is Mörön. More than just a transit hub, the capital of Khövsgöl province is a town of unexpected charm, deep local heritage, and a slow, intentional pace of life.",
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
        id: "wes-anderson-airport",
        tocLabel: "The Wes Anderson Airport",
        title: "The Wes Anderson Airport",
        image: {
          src: "/images/almanac/murun/airport-exterior.jpg",
          alt: "Murun Airport terminal viewed from the tarmac, with the wing and steppe mountains beyond.",
          label: "Mörön Airport",
        },
        blocks: [
          {
            type: "prose",
            text: "For most of our guests, the journey north begins on the tarmac of Mörön Airport (MXV). Regarded as the finest of Mongolia's domestic airstrips, the terminal is a masterclass in mid-century provincial architecture.",
          },
          {
            type: "prose",
            text: "With its retro pastel facades and symmetrical, time-capsule interiors, the building was famously catalogued by Accidentally Wes Anderson for its cinematic aesthetic. It is a quiet, sunlit space that feels a world away from the frantic energy of modern international hubs. In fact, the airport is so woven into the daily fabric of the town that on quiet mornings, you will often see Mörön locals utilising the perimeter of the runway track for their morning runs.",
          },
        ],
      },
      {
        id: "first-aviator",
        tocLabel: "The First Aviator of the North",
        title: "The First Aviator of the North",
        image: {
          src: "/images/almanac/murun/gelenkhuu-statue.jpg",
          alt: "Statue of Khainzangiin Gelenkhüü outside Mörön Airport.",
          label: "Monument to Gelenkhüü",
          size: "compact",
        },
        blocks: [
          {
            type: "prose",
            text: "Just outside the terminal doors stands a monument that frequently sparks conversation among travellers: a statue of Khainzangiin Gelenkhüü, affectionately known as Shükhert Gelenkhüü (Parachute Gelenkhüü).",
          },
          {
            type: "prose",
            text: "A local Khövsgöl legend from the 1930s, Gelenkhüü was a rebel monk who became so captivated after seeing his first airplane that he built himself a pair of wings using sheepskin and eagle feathers, and jumped from a 170-meter cliff. He survived the fall (brilliantly, by driving his flock of sheep to the bottom of the cliff beforehand to act as a cushion). Stepping out of the terminal and passing his statue serves as a quiet nod to the daring, pioneering spirit of the province.",
          },
        ],
      },
      {
        id: "community-effort",
        tocLabel: "A Community Effort",
        title: "A Community Effort: The International Milestone",
        blocks: [
          {
            type: "prose",
            text: "Mörön is a place defined by its resourcefulness and community spirit. Recently, the airport celebrated a massive historic milestone: receiving its first-ever direct international flight from South Korea.",
          },
          {
            type: "prose",
            text: "Aviation regulations dictated that two fire engines had to be present on the tarmac to safely receive the international aircraft. The airport, equipped with only one, didn't view this as a setback. Instead, they simply borrowed the municipal fire engine from the town centre for the afternoon. The flight landed seamlessly—a testament to the grounded, collaborative nature of the north.",
          },
        ],
      },
      {
        id: "dalai-eej-namesake",
        tocLabel: "Finding Dalai Eej",
        title: "The Namesake: Finding 'Dalai Eej'",
        blocks: [
          {
            type: "prose",
            text: "As you drive through the streets of Mörön to provision for the lake, you may notice a recurring phrase on the town's signage. The largest, bustling central market in town is named Dalai Eej, and you will spot the same name painted across the facades of countless small, neighbourhood kiosks.",
          },
          {
            type: "prose",
            text: "Translating to \"Mother Ocean,\" Dalai Eej is the reverent title locals have given to Lake Khövsgöl for centuries. Seeing the name scattered throughout the town is a reminder that the lake is not just a destination on a map; it is the spiritual and economic gravity of the entire province.",
          },
          {
            type: "prose",
            text: "It is this exact reverence that we carry with us as you leave the town behind, navigating the final roads toward the pristine eastern shores and our namesake resort.",
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
      label: "Chapter II — Mörön & Beyond",
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
    },
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
    pullQuote: {
      eyebrow: "Chapter IV",
      title: "The Primary Carbon Sink",
      body: "While tropical rainforests dominate global ecological narratives, the Siberian taiga is a far more critical planetary stabiliser. Stretching from the shores of Lake Khövsgöl to the Arctic Circle, it is the largest continuous forest biome on Earth—spanning nearly twice the landmass of the Amazon. Because of the region’s permafrost and low temperatures, organic decay is drastically slowed. As a result, the taiga operates as the world's largest terrestrial carbon vault, securely trapping and sequestering significantly more global carbon in its freezing soils than all tropical rainforests combined.",
      image: {
        src: "/forest.webp",
        alt: "Dense Siberian taiga forest near Lake Khövsgöl.",
        objectPosition: "50% 40%",
      },
    },
    closingImage: {
      src: "/library-at-dalai-eej.jpg",
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
        epilogue: {
          quote:
            "The water is unusually transparent, so that you can look through it as through air... I have never in my life seen such richness of colour. It is a marvel.",
          attribution: "— A. Chekhov, On the Sister Lake of Baikal, 1890",
        },
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
            src: "/amos-chapple.jpg",
            alt: "Decaying remnants of a Soviet labour camp deep in the Siberian taiga.",
            caption:
              "The decaying remnants of a Soviet labour camp deep in the Siberian taiga. Photographed by Amos Chapple during a Czech expedition to document the vast penal network that permanently altered the northern frontier. Sourced via RFE/RL.",
            fit: "cover",
            size: "compactLarge",
            placement: "center",
          },
          {
            type: "prose",
            text: "As the Russian—and later Soviet—state tightened its grip on Siberia, the taiga was repurposed. The deep forests around Baikal, once the sanctuary of indigenous hunters and shamans, were transformed into the backbone of the Soviet penal system. Across the decades, an estimated 18 million prisoners were absorbed into the vast network of gulags spread across the Siberian expanse. The forced insertion of European prisoners into the freezing, alien environment of the Asian taiga remains one of the great geographic and psychological traumas of the 20th century.",
            placement: "aside-span",
          },
          {
            type: "prose",
            text: "While Baikal saw its shores industrialised and its surrounding forests turned into penal colonies, Khövsgöl experienced a very different 20th century. Sheltered just south of the border, the \"Mother Ocean\" of Mongolia was largely spared this mass demographic trauma. It was left in silence, allowing it to remain the pristine sanctuary of the old north.",
            placement: "aside-left",
          },
          {
            type: "image",
            src: "/bamlag.jpg",
            alt: "Prisoners of the Baikal-Amur Corrective Labor Camp, 1933.",
            caption:
              "Prisoners of the Baikal-Amur Corrective Labor Camp, 1933. Archival photograph via the Virtual Museum of the GULAG.",
            fit: "contain",
            size: "compactLargeSm",
            frameless: true,
            placement: "aside-right",
          },
        ],
      },
    ],
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

export const ALMANAC_ARTICLE_SLUGS = ALMANAC_ARTICLES.map((article) => article.slug);

export function getAlmanacArticle(slug: string): AlmanacArticle | undefined {
  return ALMANAC_ARTICLES.find((article) => article.slug === slug);
}
