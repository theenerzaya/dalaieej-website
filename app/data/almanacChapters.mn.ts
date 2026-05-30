export type AlmanacChapter = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** Defaults to cover. Use contain to avoid cropping wide images on the index. */
  imageFit?: "cover" | "contain";
  /** Thumbnail width as a fraction of the column (e.g. 0.85 = 15% smaller). */
  imageScale?: number;
  imageCaption?: string;
  href?: string;
  ctaLabel?: string;
};

export const ALMANAC_CHAPTERS: AlmanacChapter[] = [
  {
    id: "chapter-i",
    eyebrow: "I Бүлэг",
    title: "Хөвсгөл рүү хэрхэн очих вэ?",
    description:
      "Улаанбаатараас нуурын зүүн эрэг, Хайчийн ам хүртэлх аяллын дэлгэрэнгүй хөтөч. Дотоодын нислэгээс эхлээд шөнийн унтлагын галт тэргээр өнгөрүүлэх кино мэт аялал хүртэл.",
    imageSrc:
      "/images/getting-here/david-bowie-trans-siberian-railway-1973.jpg",
    imageAlt:
      "Унтлагын галт тэрэгний купены архивын гэрэл зураг.",
    imageFit: "contain",
    imageCaption:
      "Английн алдарт рок од Дэвид Боуи Транс-Сибирийн төмөр замаар аялах үедээ, 1973 он. Гэрэл зургийг Жефф МакКормак.",
    href: "/getting-here",
    ctaLabel: "Унших",
  },
  {
    id: "chapter-ii",
    eyebrow: "II Бүлэг",
    title: "Хязгаарын өртөө: Мөрөн хотын тэмдэглэл",
    description:
      "Засмал зам дуусахаас өмнө Мөрөн хот угтана — дахин давтагдашгүй хэмнэлтэй, хойд хязгаарын хангамжийн түшиц, аянчны өртөө. Wes Anderson-ийн кино мэт нисэх буудлаас эхлээд Шүхэрч Гэлэнхүүгийн домог, нуур руу явах замд Далай Ээжийг угтах хүртэл.",
    imageSrc: "/images/almanac/murun/hero-wes-anderson-terminal.webp",
    imageAlt:
      "Accidentally Wes Anderson-ийн онцлон тэмдэглэсэн, өнгөрсөн зууны дунд үеийн хэв маяг бүхий Мөрөн нисэх онгоцны буудал.",
    imageFit: "contain",
    imageCaption:
      "Мөрөн нисэх онгоцны буудал (1956 онд байгуулагдсан). Accidentally Wes Anderson архивын каталогид орсон @kjphotos1022-ийн гэрэл зураг.",
    href: "/almanac/murun",
    ctaLabel: "Унших",
  },
  {
    id: "chapter-iii",
    eyebrow: "III Бүлэг",
    title: "Умард хязгаар: Торгон хил ба Нүргээнт он жилүүд",
    description:
      "Хөвсгөл нутгийн амар амгалан дүр төрх зүгээр ч нэг бүрэлдээгүй. Эзэнт гүрнүүдийн геополитик, 20-р зууны хүнд үйлдвэржилтийн давалгаанд зурагдсан Хатгалын түүх.",
    imageSrc: "/images/almanac/borders-and-industry/hero-sukhbaatar.jpeg",
    imageAlt: "Сүхбаатар хөлөг онгоцны түүхэн гэрэл зураг.",
    imageCaption:
      "Сүхбаатар хөлөг онгоц. 'Бидний сайхан Хөвсгөл' цахим архиваас авав.",
    href: "/almanac/borders-and-industry",
    ctaLabel: "Унших",
  },
  {
    id: "chapter-iv",
    eyebrow: "IV Бүлэг",
    title: "Тайга ба Тал хээр: Эртний зааг",
    description:
      "Хөвсгөл нуур эртний экологийн зааг дээр оршдог. Тал нутгийн нүүдэлчид болон хөвч тайгын ойн иргэдийн хоорондох оюун санааны, шашны хуваагдал.",
    imageSrc: "/images/almanac/forest-and-steppe/hero-deer-stones.jpg",
    imageAlt: "Тал нутгийн эртний босго болох Уушигийн өврийн буган чулуун хөшөө.",
    imageCaption:
      "Тал нутгийн эртний босгыг илтгэх Уушигийн өврийн буган чулуун хөшөө. Tour Mongolia-гаас авав.",
    href: "/almanac/forest-and-steppe",
    ctaLabel: "Унших",
  },
  {
    id: "chapter-v",
    eyebrow: "V Бүлэг",
    title: "Хоёр нуур, Нэг эзэнт гүрэн: Хөвсгөл ба Байгал",
    description:
      "Хөвсгөл нуурыг илүү гүнзгий мэдрэхийн тулд түүний эгч Байгал руу харах хэрэгтэй. Эзэнт гүрнүүдийн хил, Гулагийн эмгэнэл, Хөвсгөлийн онгон үлдсэн нь.",
    imageSrc: "/images/almanac/khovsgol-and-baikal/olkhon-island-shores.jpg",
    imageAlt: "Байгал нуур дахь Ольхон арлын эрэг.",
    imageCaption:
      "Хойд тайгын өвөг дээдсийн төв болох Байгал нуурын Ольхон арлын эрэг. Toute la Russie-с авав.",
    href: "/almanac/khovsgol-and-baikal",
    ctaLabel: "Унших",
  },
];