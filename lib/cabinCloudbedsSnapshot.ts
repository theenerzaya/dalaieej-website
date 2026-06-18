import type { CabinSlug } from "./cabinCatalog";

type Localized = { en: string; mn: string };

export type CabinCloudbedsFact = {
  slug: CabinSlug;
  roomTypeID: string;
  name: string;
  maxGuests: number;
  roomSizeLabel?: Localized;
  guestLabel: Localized;
  bedLabel: Localized;
  bathroomLabel: Localized;
  showerLabel: Localized;
  heatingLabel: Localized;
  viewLabel: Localized;
  shortDescription: Localized;
  description: Localized;
  features: string[];
};

const INCLUDED_SERVICES =
  "Өглөөний цай | Саун болон Каяк завиар хязгааргүй үйлчлүүлэх эрх | Иогийн хичээл | \"Далай ээж\" хойгт нэвтрэх эрх";

const INCLUDED_SERVICES_EN =
  "Breakfast, unlimited sauna and kayak access, morning yoga, and Dalai Eej peninsula access are included.";

export const CABIN_CLOUDBEDS_FACTS: Record<CabinSlug, CabinCloudbedsFact> = {
  "superior-cabin": {
    slug: "superior-cabin",
    roomTypeID: "198039847624896",
    name: "Их Өргөө",
    maxGuests: 5,
    roomSizeLabel: { en: "50 m²", mn: "50 м²" },
    guestLabel: { en: "Up to 5 guests", mn: "5 хүн хүртэл" },
    bedLabel: { en: "Family layout", mn: "Гэр бүлийн зохион байгуулалт" },
    bathroomLabel: { en: "Toilet and washbasin inside", mn: "Дотроо 00, угаалтууртай" },
    showerLabel: { en: "Shared shower", mn: "Нийтийн шүршүүр ашиглана" },
    heatingLabel: { en: "Wood-burning stove", mn: "Галлагаатай зуух" },
    viewLabel: { en: "Lake view", mn: "Нуурын харагдац" },
    shortDescription: {
      en: "A one-of-a-kind large family stay for guests who want extra space, with toilet and washbasin inside.",
      mn: "Тав тух, орон зайг эрхэмлэдэг том гэр бүлд зориулсан, дотроо 00 болон угаалтууртай цор ганц загвар.",
    },
    description: {
      en: `${INCLUDED_SERVICES_EN} This is the largest one-off stay in the current Cloudbeds room list, prepared for larger families and groups who value space and comfort. It sleeps up to 5 guests and has a toilet and washbasin inside.`,
      mn: `${INCLUDED_SERVICES}. Олуулаа яваа гэр бүлд тохиромжтой. Цор ганц загвар. Тав тух, орон зайг эрхэмлэдэг том гэр бүлд зориулан тусгайлан бэлтгэсэн манай хамгийн том байр. 5 хүн чөлөөтэй багтах зайтай, дотроо бие засах суултуур, угаалтууртай.`,
    },
    features: [
      "Галлагаатай зуух",
      "Дотроо 00, угаалтууртай",
      "Нийтийн шүршүүр ашиглана",
      "Нуурын харагдац",
      "Минибар",
      "Өглөөний цай багтсан",
      "Саун үнэгүй",
      "Каяк завь үнэгүй",
      "Өглөөний иог",
    ],
  },
  "triple-traditional-cabin": {
    slug: "triple-traditional-cabin",
    roomTypeID: "196467430240449",
    name: "Тухтай Хаус (Галлагаатай)",
    maxGuests: 3,
    roomSizeLabel: { en: "25-30 m²", mn: "25-30 м²" },
    guestLabel: { en: "Up to 3 guests", mn: "3 хүн хүртэл" },
    bedLabel: { en: "1 double + 1 single bed", mn: "1 өргөн ор + 1 нарийн ор" },
    bathroomLabel: { en: "Toilet and washbasin inside", mn: "Дотроо 00, угаалтууртай" },
    showerLabel: { en: "Shared shower", mn: "Нийтийн шүршүүр ашиглана" },
    heatingLabel: { en: "Wood-burning stove", mn: "Галлагаатай зуух" },
    viewLabel: { en: "Lake view", mn: "Нуурын харагдац" },
    shortDescription: {
      en: "A wood-fired comfort house for couples or small families, with one double bed, one single bed, and toilet/washbasin inside.",
      mn: "Тав тухыг эрхэмлэгч хосууд болон цөөн ам бүлтэй гэр бүлд тохиромжтой, нэг өргөн ба нэг нарийн ортой галлагаатай хаус.",
    },
    description: {
      en: `${INCLUDED_SERVICES_EN} A comfort-focused wood-fired house for couples and small families. It sleeps up to 3 guests with one double bed and one single bed, and has a toilet and washbasin inside.`,
      mn: `${INCLUDED_SERVICES}. Тав тухыг эрхэмлэгч хосууд болон цөөн ам бүлтэй гэр бүлүүдэд тохиромжтой. Тав тух, хувийн орон зайг бүрэн мэдрэх сонголт. Энэхүү байр нь дотроо ариун цэврийн өрөө тул танд гэртээ байгаа мэт тав тухыг мэдрүүлнэ. Нэг өргөн ор болон нэг нарийн ортой.`,
    },
    features: [
      "Галлагаатай зуух",
      "Дотроо 00, угаалтууртай",
      "Нуурын харагдац",
      "Минибар",
      "Өглөөний цай багтсан",
      "Саун үнэгүй",
      "Каяк завь үнэгүй",
      "Өглөөний иог",
    ],
  },
  "lakeside-cabin": {
    slug: "lakeside-cabin",
    roomTypeID: "198020352975040",
    name: "Эрэг дээрх Хаус",
    maxGuests: 2,
    roomSizeLabel: { en: "40 m²", mn: "40 м²" },
    guestLabel: { en: "Up to 2 guests", mn: "2 хүн хүртэл" },
    bedLabel: { en: "Couple layout", mn: "Хосуудад тохиромжтой" },
    bathroomLabel: { en: "Shared facilities", mn: "Нийтийн ариун цэврийн байгууламж" },
    showerLabel: { en: "Shared shower", mn: "Нийтийн шүршүүр ашиглана" },
    heatingLabel: { en: "Wood-burning stove", mn: "Галлагаатай зуух" },
    viewLabel: { en: "Closest to the lake", mn: "Нуурын эрэгт хамгийн ойр" },
    shortDescription: {
      en: "A lakefront wood-fired house for up to 2 guests, closest to the water, using shared bathroom and shower facilities.",
      mn: "Нуурын эрэгт хамгийн ойр байрлах, 2 хүн хүртэлх багтаамжтай, нийтийн ариун цэврийн байгууламж ашигладаг галлагаатай хаус.",
    },
    description: {
      en: `${INCLUDED_SERVICES_EN} A wood-fired lakeside house for couples and nature lovers. It is among the closest stays to the water and uses the shared modern bathroom and shower facilities.`,
      mn: `${INCLUDED_SERVICES}. Хосууд, байгальд дурлагсдад тохиромжтой. Нуурын эрэгт хамгийн ойр байрлалтай эдгээр модон хаусууд нь цонхоороо байгалийн сайхныг тольдох хамгийн төгс харагдацтай. Ажилтан галлаж өгдөг уламжлалт модон зуухтай. Энэхүү байр нь дотроо ариун цэврийн өрөөгүй бөгөөд нийтийн боловсон ариун цэврийн байгууламж ашиглана.`,
    },
    features: [
      "Галлагаатай зуух",
      "Нийтийн шүршүүр ашиглана",
      "Нуурын харагдац",
      "Минибар",
      "Өглөөний цай багтсан",
      "Саун үнэгүй",
      "Каяк завь үнэгүй",
      "Өглөөний иог",
    ],
  },
  "triple-electric-cabin": {
    slug: "triple-electric-cabin",
    roomTypeID: "198036698427584",
    name: "Тухтай Хаус (Цахилгаан халаалт)",
    maxGuests: 5,
    roomSizeLabel: { en: "20 m²", mn: "20 м²" },
    guestLabel: { en: "Up to 5 guests", mn: "5 хүн хүртэл" },
    bedLabel: { en: "Family layout", mn: "Гэр бүлийн зохион байгуулалт" },
    bathroomLabel: { en: "Toilet and washbasin inside", mn: "Дотроо 00, угаалтууртай" },
    showerLabel: { en: "Shared shower", mn: "Нийтийн шүршүүр ашиглана" },
    heatingLabel: { en: "Electric heating", mn: "Цахилгаан халаалт" },
    viewLabel: { en: "Lake view", mn: "Нуурын харагдац" },
    shortDescription: {
      en: "An electric-heated comfort house for up to 5 guests, with toilet and washbasin inside and shared showers nearby.",
      mn: "5 хүн хүртэлх багтаамжтай, дотроо 00 болон угаалтууртай, цахилгаан халаалттай тухтай хаус.",
    },
    description: {
      en: `${INCLUDED_SERVICES_EN} An electric-heated comfort house for couples and small families who want stable warmth and private toilet/washbasin facilities inside. Showers are in the shared modern facilities.`,
      mn: `${INCLUDED_SERVICES}. Тав тухыг эрхэмлэгч хосууд, цөөн ам бүлтэй гэр бүлд тохиромжтой. Энэхүү байр нь дотроо бие засах суултуур болон угаалтууртай тул шөнө орой гадагшаа гарах шаардлагагүй. Шүршүүрт нийтийн боловсон ариун цэврийн байгууламжид орно.`,
    },
    features: [
      "Цахилгаан халаалт",
      "Дотроо 00, угаалтууртай",
      "Нийтийн шүршүүр ашиглана",
      "Нуурын харагдац",
      "Телевиз",
      "Минибар",
      "Өглөөний цай багтсан",
      "Саун үнэгүй",
      "Каяк завь үнэгүй",
      "Өглөөний иог",
    ],
  },
  "signature-cabin": {
    slug: "signature-cabin",
    roomTypeID: "197943412437120",
    name: "Энгийн Байр",
    maxGuests: 2,
    guestLabel: { en: "Up to 2 adults", mn: "2 том хүн хүртэл" },
    bedLabel: { en: "Couple / solo layout", mn: "Хос болон ганцаарчилсан аялагчид" },
    bathroomLabel: { en: "Shared facilities", mn: "Нийтийн ариун цэврийн байгууламж" },
    showerLabel: { en: "Shared shower", mn: "Нийтийн шүршүүр ашиглана" },
    heatingLabel: { en: "Electric heating", mn: "Цахилгаан халаалт" },
    viewLabel: { en: "Near the lake", mn: "Нуурын эрэгтэй ойр" },
    shortDescription: {
      en: "A simple warm stay for couples or solo travellers, close to the lake, using shared bathroom and shower facilities.",
      mn: "Хосууд болон ганцаарчилсан аялагчдад тохиромжтой, нуурын эрэгтэй ойр, нийтийн ариун цэврийн байгууламж ашигладаг дулаахан байр.",
    },
    description: {
      en: `${INCLUDED_SERVICES_EN} A simple classic stay for couples or solo travellers who want to be close to the lake and nature. It sleeps up to 2 adults and uses the shared modern bathroom and shower facilities.`,
      mn: `${INCLUDED_SERVICES}. Хосууд болон ганцаарчилсан аялагчид тохиромжтой. Хөвсгөл далайн байгалийн сайхныг мэдрэх хамгийн сонгодог сонголт. Модон хийцтэй, дулаахан энэхүү байр нь нуурын эрэгтэй ойр байрлалтай тул байгальтай ойр байхыг хүссэн аялагчдад тохиромжтой. Орчин үеийн шийдэл бүхий нийтийн боловсон ариун цэврийн байгууламжтай.`,
    },
    features: [
      "Цахилгаан халаалт",
      "Нийтийн шүршүүр ашиглана",
      "Өглөөний цай багтсан",
      "Саун үнэгүй",
      "Каяк завь үнэгүй",
      "Өглөөний иог",
    ],
  },
  "quad-electric-cabin": {
    slug: "quad-electric-cabin",
    roomTypeID: "198046100787328",
    name: "Гэр Бүлийн Хаус (Цахилгаан халаалт)",
    maxGuests: 5,
    roomSizeLabel: { en: "25 m²", mn: "25 м²" },
    guestLabel: { en: "Up to 5 guests", mn: "5 хүн хүртэл" },
    bedLabel: { en: "2 double beds", mn: "2 дабл хэмжээтэй ор" },
    bathroomLabel: { en: "Toilet and washbasin inside", mn: "Дотроо 00, угаалтууртай" },
    showerLabel: { en: "Shared shower", mn: "Нийтийн шүршүүр ашиглана" },
    heatingLabel: { en: "Electric heating", mn: "Цахилгаан халаалт" },
    viewLabel: { en: "Lake view", mn: "Нуурын харагдац" },
    shortDescription: {
      en: "A smaller but warm electric-heated family house with two double beds and toilet/washbasin inside.",
      mn: "Бага насны хүүхэдтэй гэр бүлд тохиромжтой, 2 дабл ортой, цахилгаан халаалттай, дотроо 00-тэй дулаахан хаус.",
    },
    description: {
      en: `${INCLUDED_SERVICES_EN} A smaller but consistently warm family house for guests travelling with young children. It has electric heating, two double beds, and a toilet and washbasin inside.`,
      mn: `${INCLUDED_SERVICES}. Бага насны хүүхэдтэй гэр бүлд тохиромжтой. Энэхүү байр нь талбайн хувьд бага боловч цахилгаан халаалттай тул шөнө гал түлэх шаардлагагүй, тогтмол дулаахан байна. Ор: 2 дабл хэмжээтэй ор. Дотроо 00-тэй.`,
    },
    features: [
      "Цахилгаан халаалт",
      "Дотроо 00, угаалтууртай",
      "Нуурын харагдац",
      "Минибар",
      "Өглөөний цай багтсан",
      "Саун үнэгүй",
      "Каяк завь үнэгүй",
      "Өглөөний иог",
    ],
  },
  "grand-peninsula-suite": {
    slug: "grand-peninsula-suite",
    roomTypeID: "198038298677377",
    name: "Гэр Бүлийн Хаус (Галлагаатай)",
    maxGuests: 5,
    roomSizeLabel: { en: "35 m²", mn: "35 м²" },
    guestLabel: { en: "Up to 5 guests", mn: "5 хүн хүртэл" },
    bedLabel: { en: "2 double beds", mn: "2 өргөн ор" },
    bathroomLabel: { en: "Toilet and washbasin inside", mn: "Дотроо 00, угаалтууртай" },
    showerLabel: { en: "Shared shower", mn: "Нийтийн шүршүүр ашиглана" },
    heatingLabel: { en: "Wood-burning stove", mn: "Галлагаатай зуух" },
    viewLabel: { en: "Lake view", mn: "Нуурын харагдац" },
    shortDescription: {
      en: "A wood-fired family house for up to 5 guests, with two double beds and toilet/washbasin inside.",
      mn: "Хоёр өргөн ортой, 5 хүн хүртэлх багтаамжтай, дотроо 00 болон угаалтууртай галлагаатай гэр бүлийн хаус.",
    },
    description: {
      en: `${INCLUDED_SERVICES_EN} A wood-fired family house for guests who want to stay together in a warm shared space. It has two double beds plus a toilet and washbasin inside. Showers are in the shared modern facilities.`,
      mn: `${INCLUDED_SERVICES}. 4 ам бүлтэй гэр бүлд тохиромжтой. Гэр бүлээрээ нэг дор, халуун дулаан уур амьсгалд амарна. Хоёр том хос ортой. Дотроо бие засах суултуур, угаалтууртай тул хүүхэд багачуудтай явахад нэн тохиромжтой. Шүршүүрт нийтийн боловсон ариун цэврийн байгууламжид орно.`,
    },
    features: [
      "Галлагаатай зуух",
      "Дотроо 00, угаалтууртай",
      "Нийтийн шүршүүр ашиглана",
      "Нуурын харагдац",
      "Телевиз",
      "Минибар",
      "Өглөөний цай багтсан",
      "Саун үнэгүй",
      "Каяк завь үнэгүй",
      "Өглөөний иог",
    ],
  },
  camping: {
    slug: "camping",
    roomTypeID: "198042256253056",
    name: "Аялагчийн Отог",
    maxGuests: 12,
    guestLabel: { en: "Up to 12 guests", mn: "12 хүн хүртэл" },
    bedLabel: { en: "Tent or vehicle camping", mn: "Майхан болон машинтай аялагчид" },
    bathroomLabel: { en: "Shared facilities", mn: "Нийтийн ариун цэврийн байгууламж" },
    showerLabel: { en: "Shared shower", mn: "Нийтийн шүршүүр ашиглана" },
    heatingLabel: { en: "Outdoor setup", mn: "Гадаа байрлал" },
    viewLabel: { en: "Secure camping grounds", mn: "Хамгаалалттай кемпийн бүс" },
    shortDescription: {
      en: "A secure private camping area for tents or vehicles, with access to hot showers, fresh water, and resort services.",
      mn: "Майхан болон машинтай аялагчдад зориулсан, халуун шүршүүр, цэвэр ус болон амралтын үйлчилгээ ашиглах боломжтой хамгаалалттай отоглох хэсэг.",
    },
    description: {
      en: `${INCLUDED_SERVICES_EN} A secure private camping area for travellers arriving with tents or vehicles. Hot showers, fresh water, and camping support services are available. Contact the resort for bookings above 3 guests.`,
      mn: `${INCLUDED_SERVICES}. Майхан болон машинтай аялагчид тохиромжтой. Та манай хувийн эзэмшлийн, харуул хамгаалалттай бүсэд аюулгүй хоноглох боломжтой. Бид танд халуун шүршүүр, цэвэр ус болон кемпийн бусад үйлчилгээг санал болгож байна. 3-с дээш хүний захиалга өгөхөөр бол холбогдоно уу.`,
    },
    features: [
      "\"Далай Ээж\" хойгт нэвтрэх эрх",
      "Нийтийн шүршүүр ашиглана",
      "Өглөөний цай багтсан",
      "Саун үнэгүй",
      "Каяк завь үнэгүй",
      "Өглөөний иог",
    ],
  },
};

export function getCabinCloudbedsFact(slug: string): CabinCloudbedsFact | undefined {
  return CABIN_CLOUDBEDS_FACTS[slug as CabinSlug];
}
