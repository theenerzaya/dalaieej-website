export type LocalizedText = {
  en: string;
  mn: string;
};

export type TestimonialTag =
  | "homepage"
  | "booking"
  | "experiences"
  | "wellness"
  | "dining";

export type Testimonial = {
  id: string;
  quote: LocalizedText;
  author: string;
  location?: LocalizedText;
  source?: LocalizedText;
  date?: LocalizedText;
  tags?: readonly TestimonialTag[];
};

export const testimonials: readonly Testimonial[] = [
  {
    id: "saruul-family",
    quote: {
      en: "This is a place to bring your parents.",
      mn: "Эцэг эхээ заавал авч ирмээр газар.",
    },
    author: "Saruul",
    location: {
      en: "Mongolia",
      mn: "Монгол",
    },
    source: {
      en: "Guest note",
      mn: "Зочны сэтгэгдэл",
    },
    date: {
      en: "August 2025",
      mn: "2025 оны 8-р сар",
    },
    tags: ["homepage", "booking"],
  },
  {
    id: "ankita-silence",
    quote: {
      en: "There's pin-drop silence, and that's what we come for.",
      mn: "Энд зүү унахад ч сонсогдохоор нам гүм. Бид яг үүний төлөө ирдэг.",
    },
    author: "Ankita P.",
    location: {
      en: "Mumbai, India",
      mn: "Мумбай, Энэтхэг",
    },
    source: {
      en: "Cuddles Foundation visit",
      mn: "Cuddles Foundation-ийн айлчлал",
    },
    date: {
      en: "June 2026",
      mn: "2026 оны 6-р сар",
    },
    tags: ["homepage", "experiences", "wellness"],
  },
  {
    id: "andrii-jankhai",
    quote: {
      en: "Far superior to the commercialised tourist camps in Jankhai. This is essentially the best spot on Lake Khövsgöl—authentic, peaceful, and truly welcoming.",
      mn: "Жанхайн хэт худалдаажсан жуулчны баазуудтай харьцуулашгүй. Энэ бол Хөвсгөл нуурын хамгийн сайхан газар—жинхэнэ, амар тайван, маш зочломтгой.",
    },
    author: "Andrii L.",
    location: {
      en: "Ukraine",
      mn: "Украин",
    },
    source: {
      en: "Booking.com",
      mn: "Booking.com",
    },
    date: {
      en: "June 2026",
      mn: "2026 оны 6-р сар",
    },
    tags: ["homepage", "booking"],
  },
  {
    id: "michael-quiet-lake",
    quote: {
      en: "A peaceful, lovely stay on the quieter side of the lake. Family-run, with walking trails, a private sauna at the water's edge, and great food.",
      mn: "Нуурын нам гүм талд амар амгалан, сайхан амралт байлаа. Гэр бүлийн ажиллуулдаг, алхалтын замтай, эргийн хувийн саунтай, хоол нь үнэхээр сайхан.",
    },
    author: "Michael R.",
    source: {
      en: "Guest review",
      mn: "Зочны үнэлгээ",
    },
    tags: ["homepage", "dining", "wellness"],
  },
  {
    id: "makoto-hospitality",
    quote: {
      en: "The hospitality of the owner and staff was the most wonderful thing. I spent a quiet, peaceful time, a wonderful memory of Mongolia.",
      mn: "Эзэн болон ажилтнуудын зочломтгой байдал хамгийн гайхалтай нь байлаа. Нам гүм, амар тайван цагийг өнгөрүүлж, Монголын тухай сайхан дурсамжтай боллоо.",
    },
    author: "Makoto M.",
    source: {
      en: "Guest review",
      mn: "Зочны үнэлгээ",
    },
    tags: ["homepage", "experiences"],
  },
  {
    id: "werner-maria",
    quote: {
      en: "Maria was overwhelmed. Had a wonderful time with you and the family. Bless you.",
      mn: "Мария маш их догдолсон. Та бүхэнтэй, гэр бүлтэй чинь хамт гайхалтай цагийг өнгөрүүллээ. Та бүхэнд сайн сайхныг хүсье.",
    },
    author: "Werner & Maria",
    source: {
      en: "Guest note",
      mn: "Зочны сэтгэгдэл",
    },
    tags: ["homepage"],
  },
  {
    id: "billy-partner-trip",
    quote: {
      en: "Three unforgettable days with my partner. The setting beside the lake, the warmth of the owners, the quiet afternoons, easily the most memorable trip we've ever had.",
      mn: "Хостойгоо өнгөрүүлсэн мартагдашгүй гурван өдөр. Нуурын эргийн орчин, эздийн халуун дулаан хандлага, нам гүм үдээс хойш, бидний хамгийн дурсамжтай аялал байлаа.",
    },
    author: "Billy P.",
    source: {
      en: "Guest review",
      mn: "Зочны үнэлгээ",
    },
    tags: ["homepage", "booking"],
  },
];
