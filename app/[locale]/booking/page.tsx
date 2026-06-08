/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useMemo, type MouseEvent } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Users, Check, Loader2, Plus, Minus, AlertTriangle, ChevronRight, ChevronLeft, Trash2, Moon, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { useTranslations } from 'next-intl';
import { isNonRefundableRate, sumDepositDueForRoomLines } from "@/lib/deposit-policy";

interface RoomRestrictions {
  closedToArrival: boolean;
  closedToDeparture: boolean;
  minLos: number;
  maxLos: number;
}

interface RoomCancellation {
  daysBeforeArrival?: number;
  policyText?: string;
}

interface Room {
  roomTypeID: string;
  roomTypeName: string;
  roomsAvailable: number;
  rateID: string;
  rateName: string;
  totalRate: number;
  originalRate?: number;
  currency: string;
  description: string;
  maxGuests: number;
  photos: string[];
  features: string[];
  restrictions?: RoomRestrictions | null;
  cancellation?: RoomCancellation | null;
}

interface RoomTypeGroup {
  roomTypeName: string;
  roomsAvailable: number;
  description: string;
  maxGuests: number;
  photos: string[];
  features: string[];
  currency: string;
  rates: Room[];
}

interface CartItem {
  roomTypeID: string;
  roomTypeName: string;
  rateID: string;
  rateName: string;
  maxGuests: number;
  pricePerNight: number;
  currency: string;
  adults: number;
  children: number;
  quantity: number;
}

interface AvailabilityData {
  success: boolean;
  checkin: string;
  checkout: string;
  rooms: Room[];
  propertyTermsAndConditions?: string | null;
}

type RoomSlug =
  | "superior-cabin"
  | "triple-traditional-cabin"
  | "lakeside-cabin"
  | "triple-electric-cabin"
  | "signature-cabin"
  | "quad-electric-cabin"
  | "grand-peninsula-suite"
  | "camping";

const ROOM_GALLERIES: Record<RoomSlug, string[]> = {
  "superior-cabin": [
    "/images/rooms/superior-cabin/00.webp",
    "/images/rooms/superior-cabin/01.webp",
    "/images/rooms/superior-cabin/02.webp",
    "/images/rooms/superior-cabin/03.webp",
    "/images/rooms/superior-cabin/04.webp",
  ],
  "triple-traditional-cabin": [
    "/images/rooms/triple-traditional-cabin/00.webp",
    "/images/rooms/triple-traditional-cabin/01.webp",
    "/images/rooms/triple-traditional-cabin/02.webp",
    "/images/rooms/triple-traditional-cabin/03.webp",
    "/images/rooms/triple-traditional-cabin/04.webp",
  ],
  "lakeside-cabin": [
    "/images/rooms/lakeside-cabin/00.webp",
    "/images/rooms/lakeside-cabin/01.webp",
    "/images/rooms/lakeside-cabin/02.webp",
    "/images/rooms/lakeside-cabin/03.webp",
    "/images/rooms/lakeside-cabin/04.webp",
  ],
  "triple-electric-cabin": [
    "/images/rooms/triple-electric-cabin/00.webp",
    "/images/rooms/triple-electric-cabin/01.webp",
    "/images/rooms/triple-electric-cabin/02.webp",
    "/images/rooms/triple-electric-cabin/03.webp",
    "/images/rooms/triple-electric-cabin/04.webp",
  ],
  "signature-cabin": [
    "/images/rooms/signature-cabin/00.webp",
    "/images/rooms/signature-cabin/01.webp",
    "/images/rooms/signature-cabin/02.webp",
    "/images/rooms/signature-cabin/03.webp",
    "/images/rooms/signature-cabin/04.webp",
  ],
  "quad-electric-cabin": [
    "/images/rooms/quad-electric-cabin/00.webp",
    "/images/rooms/quad-electric-cabin/01.webp",
    "/images/rooms/quad-electric-cabin/02.webp",
    "/images/rooms/quad-electric-cabin/03.webp",
    "/images/rooms/quad-electric-cabin/04.webp",
  ],
  "grand-peninsula-suite": [
    "/images/rooms/grand-peninsula-suite/00.webp",
    "/images/rooms/grand-peninsula-suite/01.webp",
    "/images/rooms/grand-peninsula-suite/02.webp",
    "/images/rooms/grand-peninsula-suite/03.webp",
    "/images/rooms/grand-peninsula-suite/04.webp",
  ],
  camping: ["/images/rooms/camping.webp"],
};

// Update this map whenever Cloudbeds roomTypeID/accommodation codes change.
// Supports both numeric IDs and provider abbreviations when those are returned.
const ROOM_TYPE_ID_TO_SLUG: Record<string, RoomSlug> = {
  EST: "triple-traditional-cabin",
  LDG: "signature-cabin",
  SCW: "lakeside-cabin",
  ESH: "grand-peninsula-suite",
  C: "camping",
  "196467430240449": "triple-traditional-cabin",
  "197943412437120": "signature-cabin",
  "198020352975040": "lakeside-cabin",
  "198036698427584": "triple-electric-cabin",
  "198038298677377": "grand-peninsula-suite",
  "198039847624896": "superior-cabin",
  "198042256253056": "camping",
  "198046100787328": "quad-electric-cabin",
};

const ROOM_NAME_ALIASES: Array<{ matches: string[]; slug: RoomSlug }> = [
  { matches: ["superior", "их өргөө"], slug: "superior-cabin" },
  { matches: ["их оргоо"], slug: "superior-cabin" },
  { matches: ["triple", "traditional"], slug: "triple-traditional-cabin" },
  { matches: ["тухтай", "галлагаатай"], slug: "triple-traditional-cabin" },
  { matches: ["lakeside", "эрэг"], slug: "lakeside-cabin" },
  { matches: ["эрэг", "хаус"], slug: "lakeside-cabin" },
  { matches: ["triple", "electric"], slug: "triple-electric-cabin" },
  { matches: ["тухтай", "цахилгаан", "халаалт"], slug: "triple-electric-cabin" },
  { matches: ["signature"], slug: "signature-cabin" },
  { matches: ["энгийн", "байр"], slug: "signature-cabin" },
  { matches: ["quad", "electric"], slug: "quad-electric-cabin" },
  { matches: ["гэр", "булийн", "цахилгаан", "халаалт"], slug: "quad-electric-cabin" },
  { matches: ["grand", "peninsula"], slug: "grand-peninsula-suite" },
  { matches: ["гэр", "булийн", "галлагаатай"], slug: "grand-peninsula-suite" },
  { matches: ["camp"], slug: "camping" },
  { matches: ["аялагчийн", "отог"], slug: "camping" },
];

function normalizeRoomName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRoomTypeId(value: string): string {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.replace(/-\d+$/, "");
}

function resolveRoomSlug(roomTypeID: string, roomTypeName: string): RoomSlug | null {
  const normalizedId = normalizeRoomTypeId(roomTypeID);
  const byId = ROOM_TYPE_ID_TO_SLUG[normalizedId] || ROOM_TYPE_ID_TO_SLUG[normalizedId.toUpperCase()];
  if (byId) return byId;

  const normalized = normalizeRoomName(roomTypeName || "");
  for (const alias of ROOM_NAME_ALIASES) {
    if (alias.matches.every((token) => normalized.includes(token))) return alias.slug;
  }
  return null;
}

function BookingCardSlideshow({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const id = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3200);
    return () => clearInterval(id);
  }, [images, isPaused]);

  const src = images[currentIndex] || images[0] || "";
  const canSlide = images.length > 1;

  const goPrev = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.02]"
      />
      {canSlide && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-ink/55 hover:bg-ink/80 text-main transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.4} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-ink/55 hover:bg-ink/80 text-main transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.4} />
          </button>
        </>
      )}
    </div>
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function calculateNights(checkinDate: string, checkoutDate: string): number {
  if (!checkinDate || !checkoutDate) return 1;
  const start = new Date(checkinDate + "T00:00:00");
  const end = new Date(checkoutDate + "T00:00:00");
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

/** Jul 1–5 for the upcoming summer window (next year after Jul 5 has passed). */
function getDefaultJulyStayDates(): { checkin: string; checkout: string } {
  const now = new Date();
  let year = now.getFullYear();
  const afterWindow = now.getMonth() > 6 || (now.getMonth() === 6 && now.getDate() > 5);
  if (afterWindow) year += 1;
  return { checkin: `${year}-07-01`, checkout: `${year}-07-05` };
}

function translateRateName(name: string, locale: string): string {
  if (locale !== 'mn') return name;
  const map: Record<string, string> = {
    'non-refundable': 'Буцаан олголтгүй үнэ',
    'non-refundable rate': 'Буцаан олголтгүй үнэ',
    'dalai eej base': 'Үндсэн үнэ',
    'standard rate': 'Үндсэн үнэ',
    'base rate': 'Үндсэн үнэ',
    'default': 'Үндсэн үнэ',
    'early bird / shoulder': 'Засврын улирлын үнэ',
    'early bird / shoulder rate': 'Засврын улирлын үнэ',
    'early bird/shoulder': 'Засврын улирлын үнэ',
    'early bird/shoulder rate': 'Засврын улирлын үнэ',
    'early bird': 'Засврын улирлын үнэ',
    'shoulder': 'Засврын улирлын үнэ',
    'shoulder season': 'Засврын улирлын үнэ',
  };
  const lowerName = name.toLowerCase().trim();
  return map[lowerName] || name;
}

function restrictionFingerprint(restrictions: RoomRestrictions | null | undefined): string {
  if (!restrictions) return "";
  return `${restrictions.closedToArrival}|${restrictions.closedToDeparture}|${restrictions.minLos}|${restrictions.maxLos}`;
}

/** Same visible offer (Cloudbeds sometimes returns duplicate rows with different rateIDs). */
function rateDisplayFingerprint(room: Room, locale: string): string {
  const label = translateRateName(room.rateName, locale).toLowerCase().trim();
  const nrf = isNonRefundableRate(room.rateName) ? "1" : "0";
  const res = restrictionFingerprint(room.restrictions);
  const c = room.cancellation;
  const cPart = c
    ? `${c.daysBeforeArrival ?? ""}:${(c.policyText || "").replace(/\s+/g, " ").trim().slice(0, 160)}`
    : "";
  return `${nrf}|${label}|${room.totalRate}|${room.originalRate ?? ""}|${res}|${cPart}`;
}

/**
 * Cloudbeds getAvailableRoomTypes may repeat the same sellable offer (same terms/price)
 * under multiple rateIDs. Merge by rateID first, then collapse identical fingerprints.
 */
function dedupeRoomRates(rates: Room[], locale: string): Room[] {
  const byId = new Map<string, Room>();
  for (const r of rates) {
    const id = String(r.rateID);
    const prev = byId.get(id);
    if (!prev) byId.set(id, r);
    else
      byId.set(id, {
        ...prev,
        roomsAvailable: Math.max(prev.roomsAvailable, r.roomsAvailable),
      });
  }
  const mergedById = Array.from(byId.values());
  const byFp = new Map<string, Room>();
  for (const r of mergedById) {
    const fp = rateDisplayFingerprint(r, locale);
    const prev = byFp.get(fp);
    if (!prev) byFp.set(fp, r);
    else
      byFp.set(fp, {
        ...prev,
        roomsAvailable: Math.max(prev.roomsAvailable, r.roomsAvailable),
      });
  }
  return Array.from(byFp.values());
}

/** Refundable (flexible) rates first, then non-refundable; cheapest within each group. */
function sortRatesRefundableFirst(rates: Room[]): Room[] {
  const byPrice = (a: Room, b: Room) => {
    const ar = a.totalRate > 0 ? a.totalRate : Number.POSITIVE_INFINITY;
    const br = b.totalRate > 0 ? b.totalRate : Number.POSITIVE_INFINITY;
    if (ar !== br) return ar - br;
    return String(a.rateID).localeCompare(String(b.rateID));
  };
  const refundable = rates.filter((r) => !isNonRefundableRate(r.rateName)).sort(byPrice);
  const nonRefundable = rates.filter((r) => isNonRefundableRate(r.rateName)).sort(byPrice);
  return [...refundable, ...nonRefundable];
}

function BookingContent() {
  const t = useTranslations('booking');
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentLocale = pathname.startsWith('/mn') ? 'mn' : 'en';
  const localePrefix = currentLocale === 'mn' ? '/mn' : '';
  const editorialFont = currentLocale === 'mn' ? 'font-editorial-mn' : 'font-editorial-en';

  const getRoomDetailPath = (roomTypeName: string) => {
    const name = (roomTypeName || '').toLowerCase();
    if (name.includes('superior')) {
      return `${localePrefix}/superior-cabin`;
    }
    if (name.includes('cabin') || name.includes('байшин') || name.includes('шинэс') || name.includes('larch')) {
      return `${localePrefix}/cabins`;
    }
    return `${localePrefix}/cabins`;
  };

  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [totalAdults, setTotalAdults] = useState(2);
  const [totalChildren, setTotalChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [numberOfNights, setNumberOfNights] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [propertyTermsAndConditions, setPropertyTermsAndConditions] = useState<string | null>(null);

  const totalGuests = totalAdults + totalChildren;
  const cartCapacity = cart.reduce((sum, item) => sum + (item.maxGuests * item.quantity), 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.pricePerNight * item.quantity * numberOfNights), 0);
  const totalRooms = cart.reduce((sum, item) => sum + item.quantity, 0);

  const depositDueNow = useMemo(
    () =>
      sumDepositDueForRoomLines(
        cart.map((item) => ({
          rateName: item.rateName,
          pricePerNight: item.pricePerNight,
          quantity: item.quantity,
        })),
        numberOfNights
      ),
    [cart, numberOfNights]
  );
  const balanceOnArrival = Math.max(0, cartTotal - depositDueNow);

  const cartCancellationNotes = useMemo(() => {
    type Line = { label: string; text: string };
    const lines: Line[] = [];
    for (const item of cart) {
      const room = rooms.find((r) => r.roomTypeID === item.roomTypeID && r.rateID === item.rateID);
      const label =
        item.quantity > 1
          ? `${item.roomTypeName} (${item.quantity}×) · ${translateRateName(item.rateName, currentLocale)}`
          : `${item.roomTypeName} · ${translateRateName(item.rateName, currentLocale)}`;

      if (isNonRefundableRate(item.rateName)) {
        lines.push({
          label,
          text:
            currentLocale === "mn"
              ? "Энэ үнэ буцаан олголтгүй."
              : "This rate is non-refundable.",
        });
        continue;
      }

      const c = room?.cancellation;
      if (c?.daysBeforeArrival != null && c.daysBeforeArrival > 0) {
        lines.push({
          label,
          text:
            currentLocale === "mn"
              ? `Ирэхээс ${c.daysBeforeArrival} хоногийн өмнө үнэгүй цуцлах боломжтой.`
              : `Cancel free up to ${c.daysBeforeArrival} days before arrival.`,
        });
      } else if (c?.policyText?.trim()) {
        lines.push({ label, text: stripHtml(c.policyText.trim()) });
      }
    }
    return lines;
  }, [cart, rooms, currentLocale]);

  const cartKey = (roomTypeID: string, rateID: string) => `${roomTypeID}__${rateID}`;

  const groupedRooms = useMemo<RoomTypeGroup[]>(() => {
    const groups = new Map<string, RoomTypeGroup>();
    for (const room of rooms) {
      const key = room.roomTypeName;
      if (!groups.has(key)) {
        groups.set(key, {
          roomTypeName: room.roomTypeName,
          roomsAvailable: room.roomsAvailable,
          description: room.description,
          maxGuests: room.maxGuests,
          photos: room.photos,
          features: room.features,
          currency: room.currency,
          rates: [],
        });
      }
      groups.get(key)!.rates.push(room);
    }
    for (const g of groups.values()) {
      g.rates = dedupeRoomRates(g.rates, currentLocale);
      g.rates = sortRatesRefundableFirst(g.rates);
    }
    return Array.from(groups.values());
  }, [rooms, currentLocale]);

  useEffect(() => {
    if (cart.length > 0 && cartCapacity < totalGuests) {
      const remaining = totalGuests - cartCapacity;
      setCapacityError(
        currentLocale === 'mn' 
          ? `Сонгосон өрөөнд ${cartCapacity} зочин багтана. Үлдсэн ${remaining} зочинд зориулж нэмэлт өрөө сонгоно уу.`
          : `Your selection fits ${cartCapacity} guests. Please select rooms for ${remaining} more guest${remaining > 1 ? 's' : ''}.`
      );
    } else {
      setCapacityError("");
    }
  }, [cart, totalGuests, cartCapacity, currentLocale]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const urlCheckin = searchParams.get("checkin");
    const urlCheckout = searchParams.get("checkout");
    const urlPromo = searchParams.get("promo");
    const urlAdults = searchParams.get("adults");
    const urlChildren = searchParams.get("children");

    const defaults = getDefaultJulyStayDates();
    const effectiveCheckin = urlCheckin || defaults.checkin;
    const effectiveCheckout = urlCheckout || defaults.checkout;

    setCheckin(effectiveCheckin);
    setCheckout(effectiveCheckout);
    if (urlPromo) {
      setPromoCode(urlPromo);
      setAppliedPromo(urlPromo);
    }

    const parsedAdults = urlAdults ? parseInt(urlAdults) : 2;
    const parsedChildren = urlChildren ? parseInt(urlChildren) : 0;

    if (urlAdults) setTotalAdults(parsedAdults);
    if (urlChildren) setTotalChildren(parsedChildren);

    setNumberOfNights(calculateNights(effectiveCheckin, effectiveCheckout));
    fetchAvailability(effectiveCheckin, effectiveCheckout, urlPromo || "");
  }, [searchParams]);
  /* eslint-enable react-hooks/exhaustive-deps */
  
  const fetchAvailability = async (checkInDate: string, checkOutDate: string, promo: string = "") => {
    setLoading(true);
    setError("");
    setRooms([]);
    setPropertyTermsAndConditions(null);

    try {
      let url = `/api/cloudbeds/availability?checkin=${checkInDate}&checkout=${checkOutDate}&quoteAdults=2&quoteChildren=0`;

      if (promo) {
        url += `&promo=${encodeURIComponent(promo)}`;
      }

      const response = await fetch(url);
      const data: AvailabilityData = await response.json();

      if (!response.ok) {
        const maybeError = (data as unknown as { error?: unknown }).error;
        throw new Error(
          typeof maybeError === "string" && maybeError.length > 0
            ? maybeError
            : "Failed to fetch availability"
        );
      }

      const list = data.rooms || [];
      setRooms(list);
      setPropertyTermsAndConditions(data.propertyTermsAndConditions ?? null);
      const nights = calculateNights(checkInDate, checkOutDate);
      setCart((prev) =>
        prev.flatMap((item) => {
          const r = list.find((x) => x.roomTypeID === item.roomTypeID && x.rateID === item.rateID);
          if (!r) return [];
          const pricePerNight =
            nights > 0 ? (r.totalRate || 0) / nights : r.totalRate || 0;
          return [{ ...item, pricePerNight }];
        })
      );
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!checkin || !checkout) {
      setError(currentLocale === 'mn' ? "Ирэх, гарах огноогоо сонгоно уу" : "Please select both check-in and check-out dates");
      return;
    }
    setNumberOfNights(calculateNights(checkin, checkout));
    fetchAvailability(checkin, checkout, appliedPromo);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setAppliedPromo(promoCode.trim());
    if (checkin && checkout) {
      await fetchAvailability(checkin, checkout, promoCode.trim());
    }
    setPromoLoading(false);
  };

  const toggleRoomSelection = (room: Room) => {
    const key = cartKey(room.roomTypeID, room.rateID);
    const exists = cart.find(item => cartKey(item.roomTypeID, item.rateID) === key);
    if (exists) {
      setCart(cart.filter(item => cartKey(item.roomTypeID, item.rateID) !== key));
    } else {
      const newItem: CartItem = {
        roomTypeID: room.roomTypeID,
        roomTypeName: room.roomTypeName,
        rateID: room.rateID,
        rateName: room.rateName,
        maxGuests: room.maxGuests || 2,
        pricePerNight: numberOfNights > 0 ? (room.totalRate || 0) / numberOfNights : (room.totalRate || 0),
        currency: room.currency || 'MNT',
        adults: Math.min(totalAdults, room.maxGuests || 2),
        children: 0,
        quantity: 1,
      };
      const cartWithoutSameRoomType = cart.filter(item => item.roomTypeID !== room.roomTypeID);
      setCart([...cartWithoutSameRoomType, newItem]);
    }
  };

  const updateRoomQuantity = (roomTypeID: string, rateID: string, delta: number) => {
    const room = rooms.find(r => r.roomTypeID === roomTypeID && r.rateID === rateID);
    const maxAvailable = room?.roomsAvailable || 10;
    const key = cartKey(roomTypeID, rateID);

    setCart(cart.map(item => {
      if (cartKey(item.roomTypeID, item.rateID) === key) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        return { ...item, quantity: Math.min(maxAvailable, newQty) };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const distributeGuests = () => {
    const distributed: CartItem[] = [];
    let remainingAdults = totalAdults;
    let remainingChildren = totalChildren;

    for (const item of cart) {
      for (let i = 0; i < item.quantity; i++) {
        const roomCapacity = item.maxGuests;
        const adultsForRoom = Math.min(remainingAdults, roomCapacity);
        remainingAdults -= adultsForRoom;

        const spaceLeft = roomCapacity - adultsForRoom;
        const childrenForRoom = Math.min(remainingChildren, spaceLeft);
        remainingChildren -= childrenForRoom;

        const finalAdults = adultsForRoom > 0 ? adultsForRoom : (childrenForRoom > 0 ? 0 : 1);

        distributed.push({
          ...item,
          quantity: 1,
          adults: finalAdults,
          children: childrenForRoom,
        });
      }
    }
    return distributed;
  };

  const quoteCartLineRates = async (lines: CartItem[]) => {
    const nights = numberOfNights;
    return Promise.all(
      lines.map(async (item) => {
        try {
          let url = `/api/cloudbeds/availability?checkin=${checkin}&checkout=${checkout}&quoteAdults=${item.adults}&quoteChildren=${item.children}`;
          if (appliedPromo) url += `&promo=${encodeURIComponent(appliedPromo)}`;
          const response = await fetch(url);
          const data: AvailabilityData = await response.json();
          if (!response.ok || !data.rooms) return item;
          const match = data.rooms.find(
            (r) => r.roomTypeID === item.roomTypeID && r.rateID === item.rateID
          );
          if (!match) return item;
          return {
            ...item,
            pricePerNight:
              nights > 0 ? (match.totalRate || 0) / nights : match.totalRate || 0,
          };
        } catch {
          return item;
        }
      })
    );
  };

  const proceedToCheckout = async () => {
    if (cart.length === 0) {
      setError(currentLocale === 'mn' ? "Өрөө сонгоно уу" : "Please select a room");
      return;
    }
    if (cartCapacity < totalGuests) return;

    setCheckoutLoading(true);
    setError("");

    try {
      const distributedCart = await quoteCartLineRates(distributeGuests());
      const checkoutParams = new URLSearchParams({
        checkin,
        checkout,
        nights: String(numberOfNights),
        totalAdults: String(totalAdults),
        totalChildren: String(totalChildren),
        cart: encodeURIComponent(JSON.stringify(distributedCart)),
      });

      if (appliedPromo) checkoutParams.set('promo', appliedPromo);
      window.location.href = `${localePrefix}/checkout?${checkoutParams.toString()}`;
    } catch {
      setError(
        currentLocale === "mn"
          ? "Үнийг шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу."
          : "Could not refresh pricing. Please try again."
      );
      setCheckoutLoading(false);
    }
  };

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  const placeholderImages = [
    "/images/cabins/room-superior.webp",
    "/images/cabins/room-lakeside.webp",
    "/images/cabins/room-signature.webp",
  ];

  const getRestrictionMessages = (restrictions: RoomRestrictions | null | undefined): string[] => {
    if (!restrictions) return [];
    const msgs: string[] = [];
    if (restrictions.closedToArrival) {
      msgs.push(t("restrictionClosedToArrival", { date: formatDate(checkin) }));
    }
    if (restrictions.closedToDeparture) {
      msgs.push(t("restrictionClosedToDeparture", { date: formatDate(checkout) }));
    }
    if (restrictions.minLos > 0 && restrictions.minLos > numberOfNights) {
      msgs.push(t("restrictionMinLos", { nights: restrictions.minLos }));
    }
    if (restrictions.maxLos > 0 && restrictions.maxLos < numberOfNights) {
      msgs.push(t("restrictionMaxLos", { nights: restrictions.maxLos }));
    }
    return msgs;
  };

  const isRateBlocked = (restrictions: RoomRestrictions | null | undefined): boolean => {
    if (!restrictions) return false;
    if (restrictions.closedToArrival) return true;
    if (restrictions.closedToDeparture) return true;
    if (restrictions.minLos > 0 && restrictions.minLos > numberOfNights) return true;
    if (restrictions.maxLos > 0 && restrictions.maxLos < numberOfNights) return true;
    return false;
  };

  const renderRateRow = (rate: Room) => {
    const perNight = numberOfNights > 0 ? rate.totalRate / numberOfNights : rate.totalRate;
    const originalPerNight = rate.originalRate && numberOfNights > 0 ? rate.originalRate / numberOfNights : undefined;
    const rateCartItem = cart.find(c => cartKey(c.roomTypeID, c.rateID) === cartKey(rate.roomTypeID, rate.rateID));
    const isInCart = !!rateCartItem;
    const otherRateInCart = !isInCart && cart.some(c => c.roomTypeID === rate.roomTypeID);
    const blocked = isRateBlocked(rate.restrictions);
    const restrictionMsgs = getRestrictionMessages(rate.restrictions);

    return (
      <div
        key={rate.rateID}
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 ${
          isInCart ? 'bg-white/[0.04]' : (otherRateInCart || blocked) ? 'opacity-50' : ''
        }`}
      >
        <div className="min-w-0">
          <p className="font-body text-main text-sm">
            {translateRateName(rate.rateName, currentLocale)}
          </p>
          {isNonRefundableRate(rate.rateName) ? (
            <p className="mt-1.5 text-xs font-body text-orange-200/85">
              {currentLocale === "mn" ? "Буцаан олголтгүй үнэ." : "Non-refundable rate."}
            </p>
          ) : (
            <p className="mt-1.5 flex items-start gap-1.5 text-xs font-body text-emerald-200/85">
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-300/80" aria-hidden />
              <span>
                {rate.cancellation?.daysBeforeArrival != null && rate.cancellation.daysBeforeArrival > 0
                  ? currentLocale === "mn"
                    ? `Ирэхээс ${rate.cancellation.daysBeforeArrival} хоногийн өмнө үнэгүй цуцлах боломжтой.`
                    : `Free cancellation up to ${rate.cancellation.daysBeforeArrival} days before arrival.`
                  : rate.cancellation?.policyText?.trim()
                    ? stripHtml(rate.cancellation.policyText.trim())
                    : currentLocale === "mn"
                      ? "Уян хатан, буцаан олголттой үнэ."
                      : "Refundable / flexible rate."}
              </span>
            </p>
          )}
          {otherRateInCart && !blocked && (
            <p className="text-red-300 text-xs font-body mt-1">
              {currentLocale === 'mn' ? 'Сагсан дахь өрөөтэй хамт захиалах боломжгүй' : 'Not available with items in your cart'}
            </p>
          )}
          {restrictionMsgs.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {restrictionMsgs.map((msg, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs text-orange-200 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 font-body">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {msg}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {perNight > 0 && (
            <div className="text-right">
              {originalPerNight && originalPerNight > perNight && (
                <p className="font-body text-xs text-red-300/80 line-through">
                  {originalPerNight.toLocaleString()}
                </p>
              )}
              <p className={`${editorialFont} italic text-lg text-main leading-tight`}>
                {perNight.toLocaleString()}
              </p>
              <p className="font-cta uppercase text-[9px] tracking-[0.26em] text-main/40">
                {currentLocale === 'mn' ? '/ шөнө' : 'per night'}
              </p>
            </div>
          )}
          {isInCart ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border border-main/20 px-1.5 py-1">
                <button
                  onClick={() => updateRoomQuantity(rate.roomTypeID, rate.rateID, -1)}
                  className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors"
                  aria-label={currentLocale === 'mn' ? 'Хасах' : 'Decrease'}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-body text-main text-sm">{rateCartItem.quantity}</span>
                <button
                  onClick={() => updateRoomQuantity(rate.roomTypeID, rate.rateID, 1)}
                  disabled={rateCartItem.quantity >= rate.roomsAvailable}
                  className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors disabled:opacity-30"
                  aria-label={currentLocale === 'mn' ? 'Нэмэх' : 'Increase'}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => toggleRoomSelection(rate)}
                className="px-5 py-2.5 bg-main text-ink font-cta uppercase text-[11px] tracking-[0.26em] hover:bg-main/90 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                {currentLocale === 'mn' ? 'Нэмсэн' : 'Added'}
              </button>
            </div>
          ) : (otherRateInCart || blocked) ? (
            <button
              disabled
              className="px-6 py-2.5 bg-main/10 text-main/40 font-cta uppercase text-[11px] tracking-[0.26em] cursor-not-allowed"
            >
              {currentLocale === 'mn' ? 'Захиалах' : 'Book'}
            </button>
          ) : (
            <button
              onClick={() => toggleRoomSelection(rate)}
              className="px-6 py-2.5 bg-main text-ink font-cta uppercase text-[11px] tracking-[0.26em] hover:bg-main/90 transition-colors"
            >
              {currentLocale === 'mn' ? 'Захиалах' : 'Book'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const resultsCount = groupedRooms.length;

  const hasBlockedRatesInResults = useMemo(() => {
    return rooms.some((r) => {
      const x = r.restrictions;
      if (!x) return false;
      if (x.closedToArrival) return true;
      if (x.closedToDeparture) return true;
      if (x.minLos > 0 && x.minLos > numberOfNights) return true;
      if (x.maxLos > 0 && x.maxLos < numberOfNights) return true;
      return false;
    });
  }, [rooms, numberOfNights]);

  return (
    <main id="main-content" className="min-h-screen bg-ink pt-24 md:pt-20 pb-32 lg:pb-20 text-main">
      {/* Results header band */}
      <div className="px-6 pt-6 md:pt-10 pb-8 border-b border-main/10">
        <div className="max-w-7xl mx-auto">
          <h1 className={`${editorialFont} italic text-4xl md:text-5xl leading-tight text-main mb-3`}>
            {currentLocale === 'mn' ? 'Хайлтын үр дүн' : 'Search Results'}
          </h1>
          {!loading && searched && resultsCount > 0 && checkin && checkout && (
            <p className="font-body text-main/60 text-sm md:text-base">
              {currentLocale === 'mn'
                ? `${resultsCount} өрөө олдлоо · ${formatDate(checkin)} – ${formatDate(checkout)}`
                : `${resultsCount} accommodation${resultsCount === 1 ? "" : "s"} found from ${formatDate(checkin)} – till ${formatDate(checkout)}`}
            </p>
          )}
          {!searched && !loading && (
            <p className="font-body text-main/60 text-sm md:text-base">
              {currentLocale === 'mn'
                ? 'Баруун талын маягтад огноогоо оруулан сул байраа шалгаарай.'
                : 'Use the form to select your dates and check availability.'}
            </p>
          )}
          {error && <div className="mt-3 text-red-300 text-sm font-body">{error}</div>}
          {!loading && searched && rooms.length > 0 && hasBlockedRatesInResults && (
            <div
              className="mt-4 flex gap-3 rounded border border-main/15 bg-white/[0.03] px-4 py-3 max-w-3xl"
              role="note"
            >
              <Info className="w-5 h-5 shrink-0 text-main/45 mt-0.5" aria-hidden />
              <p className="text-sm font-body text-main/75 leading-relaxed">{t("restrictionsNotice")}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-12">
        {/* Sidebar — first in DOM so it appears on top on mobile */}
        <aside className="min-w-0 lg:order-2">
          {/* Bounded height + internal scroll: avoids tall sticky aside coupling page scroll
              to the bottom of this column (felt like "jumping" to the page end). */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overscroll-contain">
            {/* Book Your Stay form */}
            <section className="bg-white/[0.04] border border-main/10 p-6">
              <h2 className={`${editorialFont} italic text-2xl text-main mb-2`}>
                {currentLocale === 'mn' ? 'Амралтаа захиалах' : 'Book Your Stay'}
              </h2>
              <p className="font-body text-main/50 text-xs mb-5">
                {currentLocale === 'mn'
                  ? 'Заавал бөглөх талбарыг * тэмдгээр тэмдэглэв'
                  : 'Required fields are followed by *'}
              </p>

              <div className="space-y-5">
                <div>
                  <label htmlFor="checkin-date" className="block font-body text-main text-sm mb-1">
                    {t('checkIn')}: <span className="text-main/50">*</span>
                  </label>
                  <input
                    id="checkin-date"
                    type="date"
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    min={minDate}
                    className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-date" className="block font-body text-main text-sm mb-1">
                    {t('checkOut')}: <span className="text-main/50">*</span>
                  </label>
                  <input
                    id="checkout-date"
                    type="date"
                    value={checkout}
                    onChange={(e) => setCheckout(e.target.value)}
                    min={checkin || minDate}
                    className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors appearance-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span id="adults-label" className="block font-body text-main text-sm mb-1">
                      {currentLocale === 'mn' ? 'Насанд хүрэгч' : 'Adults'}:
                    </span>
                    <div className="flex items-center justify-between border border-main/20 px-1.5 py-1" role="group" aria-labelledby="adults-label">
                      <button
                        onClick={() => setTotalAdults(Math.max(1, totalAdults - 1))}
                        aria-label={currentLocale === 'mn' ? 'Хасах' : 'Decrease'}
                        className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-main font-body text-sm" aria-live="polite">{totalAdults}</span>
                      <button
                        onClick={() => setTotalAdults(Math.min(20, totalAdults + 1))}
                        aria-label={currentLocale === 'mn' ? 'Нэмэх' : 'Increase'}
                        className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span id="children-label" className="block font-body text-main text-sm mb-1">
                      {currentLocale === 'mn' ? 'Хүүхэд' : 'Children'}:
                    </span>
                    <div className="flex items-center justify-between border border-main/20 px-1.5 py-1" role="group" aria-labelledby="children-label">
                      <button
                        onClick={() => setTotalChildren(Math.max(0, totalChildren - 1))}
                        aria-label={currentLocale === 'mn' ? 'Хасах' : 'Decrease'}
                        className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-main font-body text-sm" aria-live="polite">{totalChildren}</span>
                      <button
                        onClick={() => setTotalChildren(Math.min(10, totalChildren + 1))}
                        aria-label={currentLocale === 'mn' ? 'Нэмэх' : 'Increase'}
                        className="w-7 h-7 flex items-center justify-center text-main/70 hover:text-main transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="font-body text-main/50 text-xs leading-relaxed">
                  {t("multiRoomHint")}
                </p>

                <div>
                  <label htmlFor="promo-code" className="block font-body text-main text-sm mb-1">
                    {t('promoCode')}:
                  </label>
                  <div className="flex items-stretch gap-2">
                    <input
                      id="promo-code"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder={t('enterPromo')}
                      className="flex-1 min-w-0 bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none placeholder:text-main/30 uppercase tracking-wider text-sm"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoCode.trim()}
                      className="px-3 py-2 border border-main/30 text-main text-[10px] font-cta uppercase tracking-[0.22em] hover:border-main transition-colors disabled:opacity-40 flex items-center gap-1.5"
                    >
                      {promoLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                      {t('apply')}
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1.5 text-bark text-xs font-body">
                        <Check className="w-3.5 h-3.5" />
                        {t('promoApplied')} ({appliedPromo})
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full py-3.5 bg-main text-ink font-cta uppercase tracking-[0.28em] text-xs hover:bg-main/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {loading ? t('loading') : (currentLocale === 'mn' ? 'Хайх' : 'Search')}
                </button>
              </div>
            </section>

            {/* Reservation summary (shown only when cart has items) */}
            {cart.length > 0 && (
              <section className="bg-white/[0.04] border border-main/10 p-6">
                <h2 className={`${editorialFont} italic text-2xl text-main text-center mb-5`}>
                  {currentLocale === 'mn' ? 'Захиалгын хураангуй' : 'Your Reservation'}
                </h2>

                <div className="flex items-center justify-between text-sm font-body text-main mb-1">
                  <span>{formatDate(checkin)}</span>
                  <ArrowRight className="w-4 h-4 text-main/40" />
                  <span>{formatDate(checkout)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-main/60 font-body mb-5">
                  <Moon className="w-3.5 h-3.5" />
                  <span>{numberOfNights} {currentLocale === 'mn' ? 'шөнө' : `Night${numberOfNights > 1 ? 's' : ''}`}</span>
                </div>

                <div className="space-y-4 mb-5">
                  {cart.map((item) => (
                    <div key={cartKey(item.roomTypeID, item.rateID)} className="pb-4 border-b border-main/10 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-main text-sm">{item.roomTypeName}</p>
                          <p className="text-main/50 text-xs font-body">{translateRateName(item.rateName, currentLocale)}</p>
                        </div>
                        <p className={`${editorialFont} italic text-sm text-main whitespace-nowrap`}>
                          {(item.pricePerNight * item.quantity * numberOfNights).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-main/60 font-body">
                          <Users className="w-3.5 h-3.5" />
                          <span>{item.quantity > 1 ? `${item.quantity} × ` : ''}{item.maxGuests}</span>
                        </div>
                        <button
                          onClick={() => toggleRoomSelection({ roomTypeID: item.roomTypeID, rateID: item.rateID, roomTypeName: item.roomTypeName, rateName: item.rateName, totalRate: item.pricePerNight * numberOfNights, currency: item.currency, maxGuests: item.maxGuests, roomsAvailable: 0, description: '', photos: [], features: [] })}
                          className="w-7 h-7 flex items-center justify-center border border-main/20 text-main/60 hover:border-red-400/60 hover:text-red-400 transition-colors"
                          aria-label={currentLocale === 'mn' ? 'Устгах' : 'Remove'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-main/15 pt-4 space-y-2 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-main/70">{currentLocale === 'mn' ? 'Дэд дүн' : 'Subtotal'}</span>
                    <span className="text-main">{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-main/70">{currentLocale === 'mn' ? 'Татвар, хураамж' : 'Taxes and fees'}</span>
                    <span className="text-main">0.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-main/15">
                    <span className={`${editorialFont} italic text-base text-main`}>
                      {currentLocale === 'mn' ? 'Нийт дүн' : 'Total'}
                    </span>
                    <span className={`${editorialFont} italic text-base text-main`}>
                      MNT {cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-main/15">
                  <p className="font-cta uppercase text-[10px] tracking-[0.22em] text-main/50 mb-2">
                    {currentLocale === 'mn' ? 'Төлбөрийн хуваарь' : 'Payment Schedule'}
                  </p>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-main/70">{currentLocale === 'mn' ? 'Урьдчилгаа (одоо төлөх)' : 'Deposit (pay now)'}</span>
                    <span className="text-main">{depositDueNow.toLocaleString()}</span>
                  </div>
                  {balanceOnArrival > 0 && (
                    <div className="flex justify-between text-sm font-body mt-1.5">
                      <span className="text-main/70">{currentLocale === 'mn' ? 'Ирэхэд төлөх үлдэгдэл' : 'Due on arrival'}</span>
                      <span className="text-main">{balanceOnArrival.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {cartCancellationNotes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-main/15">
                    <p className="font-cta uppercase text-[10px] tracking-[0.22em] text-main/50 mb-2">
                      {currentLocale === 'mn' ? 'Цуцлалтын нөхцөл' : 'Cancellation'}
                    </p>
                    <ul className="space-y-2 text-xs font-body">
                      {cartCancellationNotes.map((row, i) => (
                        <li key={i}>
                          <span className="text-main">{row.label}</span>
                          <span className="text-main/60"> — {row.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {propertyTermsAndConditions && (() => {
                  const plain = stripHtml(propertyTermsAndConditions);
                  const short = plain.length > 320 ? `${plain.slice(0, 320)}…` : plain;
                  return (
                    <p className="mt-3 text-xs text-main/50 font-body leading-relaxed">
                      <span className="text-main/70">
                        {currentLocale === 'mn' ? 'Газрын нөхцөл: ' : 'Property terms: '}
                      </span>
                      {short}
                    </p>
                  );
                })()}

                {capacityError && (
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-orange-200/80 text-xs font-body">{capacityError}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void proceedToCheckout()}
                  disabled={cartCapacity < totalGuests || checkoutLoading}
                  className={`hidden lg:block w-full mt-5 py-3.5 font-cta uppercase tracking-[0.28em] text-xs transition-colors ${
                    cartCapacity >= totalGuests && !checkoutLoading
                      ? 'bg-main text-ink hover:bg-main/90 cursor-pointer'
                      : 'bg-main/10 text-main/40 cursor-not-allowed'
                  }`}
                >
                  {checkoutLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {currentLocale === 'mn' ? 'Бэлтгэж байна...' : 'Preparing...'}
                    </span>
                  ) : (
                    currentLocale === 'mn' ? 'Одоо захиалах' : 'Book Now'
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-main/40 font-body">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentLocale === 'mn' ? 'Аюулгүй онлайн төлбөр' : 'Secure Online Payment'}</span>
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* Main column — accommodations */}
        <div className="min-w-0 lg:order-1 space-y-8">
          {loading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-main/70" />
              <p className="text-main/60 mt-4 font-body">{t('loading')}</p>
            </div>
          )}

          {!loading && searched && rooms.length === 0 && !error && (
            <div className="text-center py-16">
              <p className="text-main/80 text-lg font-body">{t('noRooms')}</p>
              <p className="text-main/50 mt-2 font-body">{t('tryDifferent')}</p>
            </div>
          )}

          {!loading && searched && rooms.length === 0 && error && (
            <div className="text-center py-16">
              <p className="text-main/60 text-lg font-body">
                {currentLocale === "mn"
                  ? "Сул байрны мэдээлэл ачаалж чадсангүй. Дээрх алдааг шалгаад дахин оролдоно уу."
                  : "We could not load availability. See the message above and try again."}
              </p>
            </div>
          )}

          {!searched && !loading && (
            <div className="text-center py-16">
              <p className="text-main/60 text-lg font-body">{t('selectDatesPrompt')}</p>
            </div>
          )}

          {!loading && rooms.length > 0 && (
            <>
              {/* Search-date restrictions banner */}
              {(() => {
                const allRestrictions = rooms
                  .filter(r => r.restrictions)
                  .flatMap(r => getRestrictionMessages(r.restrictions));
                const uniqueRestrictions = [...new Set(allRestrictions)];
                if (uniqueRestrictions.length === 0) return null;
                return (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/30">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-body text-orange-200 text-sm mb-1">
                          {currentLocale === 'mn' ? 'Сонгосон огноонд үйлчилж буй хязгаарлалт' : 'Restrictions for selected dates'}
                        </p>
                        <ul className="space-y-0.5">
                          {uniqueRestrictions.map((msg, i) => (
                            <li key={i} className="text-orange-200/70 text-xs font-body">{msg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {groupedRooms
                .map((group, index) => {
                  const photos = group.photos || [];
                  const primaryRoom = group.rates[0];
                  const mappedSlug = resolveRoomSlug(primaryRoom?.roomTypeID || "", group.roomTypeName || "");
                  const localGallery = mappedSlug ? ROOM_GALLERIES[mappedSlug] : [];
                  const slideshowImages = localGallery.length > 0
                    ? localGallery
                    : (photos.length > 0 ? photos : [placeholderImages[index % placeholderImages.length]]);
                  const maxGuests = group.maxGuests || 2;
                  const hasCartItem = group.rates.some(r => cart.some(c => cartKey(c.roomTypeID, c.rateID) === cartKey(r.roomTypeID, r.rateID)));

                  const perNightValues = group.rates
                    .filter((r) => r.totalRate > 0)
                    .map((r) => (numberOfNights > 0 ? r.totalRate / numberOfNights : r.totalRate));
                  const perNightFrom = perNightValues.length > 0 ? Math.min(...perNightValues) : 0;
                  const priceCurrency = group.rates[0]?.currency || group.currency || "MNT";
                  const hasBothRefundKinds =
                    group.rates.some((r) => !isNonRefundableRate(r.rateName)) &&
                    group.rates.some((r) => isNonRefundableRate(r.rateName));

                  const descriptionPlain = stripHtml(group.description || '');
                  const firstSentence = descriptionPlain.split(/(?<=\.)\s/)[0] || '';
                  const tagline = firstSentence.length > 160 ? `${firstSentence.slice(0, 160)}…` : firstSentence;

                  return (
                    <article
                      key={group.roomTypeName || index}
                      className={`bg-white/[0.03] border transition-colors ${hasCartItem ? 'border-main/50' : 'border-main/10'}`}
                    >
                      {/* Image */}
                      <Link
                        href={getRoomDetailPath(group.roomTypeName)}
                        className="relative block aspect-[21/10] md:aspect-[21/9] bg-black/40 overflow-hidden group"
                      >
                        <BookingCardSlideshow
                          key={slideshowImages.join("|")}
                          images={slideshowImages}
                          alt={group.roomTypeName || "Room"}
                        />
                        {group.roomsAvailable && group.roomsAvailable <= 3 && (
                          <div className="absolute top-4 right-4 bg-ink/80 text-main text-[10px] font-cta uppercase tracking-[0.22em] px-2.5 py-1 border border-main/20">
                            {t('onlyLeft', { count: group.roomsAvailable })}
                          </div>
                        )}
                      </Link>

                      <div className="p-6 md:p-8">
                        <h2 className={`${editorialFont} italic text-3xl md:text-[2.25rem] leading-tight text-main mb-2`}>
                          <Link
                            href={getRoomDetailPath(group.roomTypeName)}
                            className="hover:text-main/80 transition-colors"
                          >
                            {group.roomTypeName || 'Room'}
                          </Link>
                        </h2>

                        {tagline && (
                          <p className="text-main/60 text-sm font-body mb-6">{tagline}</p>
                        )}

                        <h3 className="font-cta uppercase text-[10px] tracking-[0.28em] text-main/50 mb-3">
                          {currentLocale === 'mn' ? 'Дэлгэрэнгүй' : 'Details'}
                        </h3>

                        <ul className="space-y-1.5 mb-6 text-sm text-main/80 font-body">
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-bark" />
                            <span>
                              <span className="text-main/50">
                                {currentLocale === 'mn' ? 'Багтаамж:' : 'Guests:'}
                              </span>{' '}
                              {currentLocale === 'mn' ? `${maxGuests} хүн хүртэл` : `Up to ${maxGuests}`}
                            </span>
                          </li>
                          {group.features && group.features.length > 0 && (
                            <li className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-bark" />
                              <span>
                                <span className="text-main/50">
                                  {currentLocale === 'mn' ? 'Тохижилт:' : 'Amenities:'}
                                </span>{' '}
                                {group.features.join(', ')}
                              </span>
                            </li>
                          )}
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-bark" />
                            <span>
                              <span className="text-main/50">
                                {currentLocale === 'mn' ? 'Сул:' : 'Availability:'}
                              </span>{' '}
                              {currentLocale === 'mn'
                                ? `${group.roomsAvailable} өрөө үлдсэн`
                                : `${group.roomsAvailable} ${group.roomsAvailable === 1 ? 'room' : 'rooms'} available`}
                            </span>
                          </li>
                        </ul>

                        {perNightFrom > 0 && (
                          <div className="space-y-1.5">
                            <p className="font-body text-main">
                              <span className="text-main/60">
                                {currentLocale === "mn" ? "Эхлэх үнэ:" : "Prices start at:"}
                              </span>
                              <span className={`${editorialFont} italic text-xl text-main ml-2`}>
                                {perNightFrom.toLocaleString()} {priceCurrency}
                              </span>
                              <span className="text-main/60 text-sm ml-1">
                                {currentLocale === "mn" ? "/ шөнө" : "per night"}
                              </span>
                            </p>
                            {hasBothRefundKinds && (
                              <p className="text-main/50 text-xs font-body leading-relaxed">
                                {currentLocale === "mn"
                                  ? "Эхэнд буцаан олголттой үнэ, доор нь буцаан олголтгүй хямд үнэ жагсаагдана."
                                  : "Refundable options are listed first; lower non-refundable rates may appear below."}
                              </p>
                            )}
                          </div>
                        )}

                        <Link
                          href={getRoomDetailPath(group.roomTypeName)}
                          className="inline-flex items-center gap-1.5 mt-3 font-cta uppercase text-[10px] tracking-[0.28em] text-bark hover:text-main transition-colors"
                        >
                          {currentLocale === 'mn' ? 'Дэлгэрэнгүй харах' : 'View Details'}
                          <ArrowRight className="w-3 h-3" />
                        </Link>

                        <div className="border-t border-main/10 mt-6 divide-y divide-main/10">
                          {group.rates.map((rate) => (
                            <div key={rate.rateID}>{renderRateRow(rate)}</div>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
            </>
          )}
        </div>
      </div>

      <div className="py-12 text-center">
        <a
          href={localePrefix || '/'}
          className="font-cta uppercase tracking-[0.28em] text-xs text-main/50 hover:text-main transition-colors"
        >
          &larr; {t('backToHome')}
        </a>
      </div>

      {/* Mobile sticky cart */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-ink border-t border-main/15 shadow-2xl z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            {capacityError && (
              <div className="mb-3 p-3 bg-orange-500/10 border border-orange-500/30 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <p className="text-orange-200/80 text-sm font-body">{capacityError}</p>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-main font-body">
                <span>{totalRooms} {currentLocale === 'mn' ? 'өрөө' : (totalRooms === 1 ? 'Room' : 'Rooms')}</span>
                <span className="text-main/30">•</span>
                <span className={`${editorialFont} italic text-lg text-main`}>{cartTotal.toLocaleString()} MNT</span>
              </div>
              <button
                type="button"
                onClick={() => void proceedToCheckout()}
                disabled={cartCapacity < totalGuests || checkoutLoading}
                className={`px-6 py-3 font-cta uppercase tracking-[0.28em] text-[11px] transition-colors whitespace-nowrap ${
                  cartCapacity >= totalGuests && !checkoutLoading
                    ? 'bg-main text-ink hover:bg-main/90 cursor-pointer'
                    : 'bg-main/10 text-main/40 cursor-not-allowed'
                }`}
              >
                {checkoutLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {currentLocale === 'mn' ? 'Бэлтгэж байна...' : 'Preparing...'}
                  </span>
                ) : (
                  currentLocale === 'mn' ? 'Одоо захиалах' : 'Book Now'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function BookingPage() {
  const t = useTranslations('common');
  return (
    <Suspense fallback={<main className="min-h-screen bg-ink flex items-center justify-center"><p className="text-main/70 font-body">{t('loading')}</p></main>}>
      <BookingContent />
    </Suspense>
  );
}
