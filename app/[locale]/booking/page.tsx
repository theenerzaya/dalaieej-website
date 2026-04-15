"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Users, Check, Tag, Loader2, Plus, Minus, AlertTriangle, ChevronDown, ChevronUp, Trash2, Moon, ArrowRight, ShieldCheck } from "lucide-react";
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function calculateNights(checkinDate: string, checkoutDate: string): number {
  if (!checkinDate || !checkoutDate) return 1;
  const start = new Date(checkinDate);
  const end = new Date(checkoutDate);
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
    'non-refundable': 'Буцаан олгогдохгүй',
    'dalai eej base': 'Үндсэн үнэ',
    'standard rate': 'Үндсэн үнэ',
    'base rate': 'Үндсэн үнэ'
  };
  const lowerName = name.toLowerCase().trim();
  return map[lowerName] || name;
}

function BookingContent() {
  const t = useTranslations('booking');
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentLocale = pathname.startsWith('/mn') ? 'mn' : 'en';
  const localePrefix = currentLocale === 'mn' ? '/mn' : '';

  const getRoomDetailPath = (roomTypeName: string) => {
    const name = (roomTypeName || '').toLowerCase();
    if (name.includes('cabin') || name.includes('байшин') || name.includes('шинэс') || name.includes('larch')) {
      return `${localePrefix}/cabins`;
    }
    return `${localePrefix}/accommodation`;
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
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
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
              ? "Энэ үнэ буцаан олгогдохгүй."
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
              ? `Ирэхээс ${c.daysBeforeArrival} хоногийн өмнө хүртэл цуцлах боломжтой (Cloudbeds).`
              : `Cancel free up to ${c.daysBeforeArrival} days before arrival (Cloudbeds).`,
        });
      } else if (c?.policyText?.trim()) {
        lines.push({ label, text: stripHtml(c.policyText.trim()) });
      }
    }
    return lines;
  }, [cart, rooms, currentLocale]);

  const cartKey = (roomTypeID: string, rateID: string) => `${roomTypeID}__${rateID}`;

  const toggleExpand = (roomTypeName: string) => {
    setExpandedRooms(prev => {
      const next = new Set(prev);
      if (next.has(roomTypeName)) next.delete(roomTypeName);
      else next.add(roomTypeName);
      return next;
    });
  };

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
    return Array.from(groups.values());
  }, [rooms]);

  useEffect(() => {
    if (cart.length > 0 && cartCapacity < totalGuests) {
      const remaining = totalGuests - cartCapacity;
      setCapacityError(
        currentLocale === 'mn' 
          ? `Таны сонголтод ${cartCapacity} зочин багтах боломжтой. ${remaining} зочинд нэмэлт өрөө сонгоно уу.`
          : `Your selection fits ${cartCapacity} guests. Please select rooms for ${remaining} more guest${remaining > 1 ? 's' : ''}.`
      );
    } else {
      setCapacityError("");
    }
  }, [cart, totalGuests, cartCapacity, currentLocale]);

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
    fetchAvailability(effectiveCheckin, effectiveCheckout, urlPromo || "", parsedAdults, parsedChildren);
  }, [searchParams]);
  
  const fetchAvailability = async (checkInDate: string, checkOutDate: string, promo: string = "", adults: number = totalAdults, children: number = totalChildren) => {
    setLoading(true);
    setError("");
    setRooms([]);
    setPropertyTermsAndConditions(null);

    try {
      let url = `/api/cloudbeds/availability?checkin=${checkInDate}&checkout=${checkOutDate}&adults=${adults}&children=${children}`;

      if (promo) {
        url += `&promo=${encodeURIComponent(promo)}`;
      }

      const response = await fetch(url);
      const data: AvailabilityData = await response.json();

      if (!response.ok) {
        throw new Error((data as any).error || "Failed to fetch availability");
      }

      setRooms(data.rooms || []);
      setPropertyTermsAndConditions(data.propertyTermsAndConditions ?? null);
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
    fetchAvailability(checkin, checkout, appliedPromo, totalAdults, totalChildren);
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

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      setError(currentLocale === 'mn' ? "Өрөө сонгоно уу" : "Please select a room");
      return;
    }
    if (cartCapacity < totalGuests) return;

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

    const distributedCart = distributeGuests();
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
  };

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  const placeholderImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=80",
  ];

  const getRestrictionMessages = (restrictions: RoomRestrictions | null | undefined): string[] => {
    if (!restrictions) return [];
    const msgs: string[] = [];
    if (restrictions.closedToArrival) {
      msgs.push(currentLocale === 'mn'
        ? `${formatDate(checkin)} өдөр бүртгүүлэх боломжгүй`
        : `Check-in not available on ${formatDate(checkin)}`);
    }
    if (restrictions.closedToDeparture) {
      msgs.push(currentLocale === 'mn'
        ? `${formatDate(checkout)} өдөр гарах боломжгүй`
        : `Check-out not available on ${formatDate(checkout)}`);
    }
    if (restrictions.minLos > 0 && restrictions.minLos > numberOfNights) {
      msgs.push(currentLocale === 'mn'
        ? `Хамгийн багадаа ${restrictions.minLos} шөнө байх шаардлагатай`
        : `Minimum ${restrictions.minLos}-night stay required`);
    }
    if (restrictions.maxLos > 0 && restrictions.maxLos < numberOfNights) {
      msgs.push(currentLocale === 'mn'
        ? `Хамгийн ихдээ ${restrictions.maxLos} шөнө байх боломжтой`
        : `Maximum ${restrictions.maxLos}-night stay`);
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
      <div key={rate.rateID} className={`px-5 md:px-6 py-4 ${isInCart ? 'bg-bark/5' : (otherRateInCart || blocked) ? 'opacity-50' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-ink text-sm font-body">{translateRateName(rate.rateName, currentLocale)}</p>
            {otherRateInCart && !blocked && (
              <p className="text-red-500 text-xs font-body mt-1">
                {currentLocale === 'mn' ? 'Сагсанд байгаа бараатай хамт авах боломжгүй' : 'Not available with items in your cart'}
              </p>
            )}
            {restrictionMsgs.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {restrictionMsgs.map((msg, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded px-2 py-0.5 font-body">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                    {msg}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {perNight > 0 && (
              <div className="text-right">
                <p className="text-ink/40 text-xs font-body">{currentLocale === 'mn' ? 'Нэг шөнийн үнэ' : 'Price from'}</p>
                {originalPerNight && originalPerNight > perNight && (
                  <p className="font-serif text-sm text-red-400 line-through">{originalPerNight.toLocaleString()}</p>
                )}
                <p className="font-serif text-lg font-bold text-ink">{perNight.toLocaleString()}</p>
              </div>
            )}
            {isInCart ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-surface-alt rounded-lg px-2 py-1">
                  <button onClick={() => updateRoomQuantity(rate.roomTypeID, rate.rateID, -1)} className="w-7 h-7 border border-ink/20 rounded-full flex items-center justify-center hover:bg-white transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-6 text-center font-semibold text-ink text-sm font-body">{rateCartItem.quantity}</span>
                  <button onClick={() => updateRoomQuantity(rate.roomTypeID, rate.rateID, 1)} disabled={rateCartItem.quantity >= rate.roomsAvailable} className="w-7 h-7 border border-ink/20 rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30"><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <button onClick={() => toggleRoomSelection(rate)} className="px-4 py-2 bg-bark text-white text-sm font-serif font-medium rounded-lg hover:bg-bark/80 transition-colors flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  {currentLocale === 'mn' ? 'Сонгосон' : 'Added'}
                </button>
              </div>
            ) : (otherRateInCart || blocked) ? (
              <button disabled className="px-5 py-2 bg-gray-200 text-gray-400 text-sm font-serif font-medium rounded-full cursor-not-allowed">
                {currentLocale === 'mn' ? 'Нэмэх' : 'Add'}
              </button>
            ) : (
              <button onClick={() => toggleRoomSelection(rate)} className="px-5 py-2 bg-bark text-white text-sm font-serif font-medium rounded-lg hover:bg-bark/80 transition-colors">
                {currentLocale === 'mn' ? 'Нэмэх' : 'Add'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main id="main-content" className="min-h-screen bg-surface-alt pt-24 md:pt-16 pb-32 lg:pb-8">
      <div className="bg-ink py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-main mb-4">{t('findRoom')}</h1>
          <p className="font-body text-main/70 mb-8">{t('selectDates')}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-4xl mx-auto flex-wrap">
            <div className="flex flex-col">
              <label htmlFor="checkin-date" className="text-main/70 text-xs uppercase tracking-wider mb-1 font-body text-left">{t('checkIn')}</label>
              <input id="checkin-date" type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} min={minDate} className="px-4 py-3 bg-white/10 border border-main/50 text-main rounded-lg focus:outline-none focus:border-main transition-colors font-body" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="checkout-date" className="text-main/70 text-xs uppercase tracking-wider mb-1 font-body text-left">{t('checkOut')}</label>
              <input id="checkout-date" type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} min={checkin || minDate} className="px-4 py-3 bg-white/10 border border-main/50 text-main rounded-lg focus:outline-none focus:border-main transition-colors font-body" />
            </div>

            <div className="flex flex-col">
              <span id="adults-label" className="text-main/70 text-xs uppercase tracking-wider mb-1 font-body text-left">{currentLocale === 'mn' ? 'Насанд хүрэгчид' : 'Adults'}</span>
              <div className="flex items-center gap-2 bg-white/10 border border-main/50 rounded-lg px-3 py-2" role="group" aria-labelledby="adults-label">
                <button onClick={() => setTotalAdults(Math.max(1, totalAdults - 1))} aria-label={currentLocale === 'mn' ? 'Насанд хүрэгчдийг хасах' : 'Decrease adults'} className="w-8 h-8 flex items-center justify-center text-main hover:bg-white/10 rounded transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center text-main font-semibold font-body" aria-live="polite">{totalAdults}</span>
                <button onClick={() => setTotalAdults(Math.min(20, totalAdults + 1))} aria-label={currentLocale === 'mn' ? 'Насанд хүрэгчдийг нэмэх' : 'Increase adults'} className="w-8 h-8 flex items-center justify-center text-main hover:bg-white/10 rounded transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex flex-col">
              <span id="children-label" className="text-main/70 text-xs uppercase tracking-wider mb-1 font-body text-left">{currentLocale === 'mn' ? 'Хүүхдүүд' : 'Children'}</span>
              <div className="flex items-center gap-2 bg-white/10 border border-main/50 rounded-lg px-3 py-2" role="group" aria-labelledby="children-label">
                <button onClick={() => setTotalChildren(Math.max(0, totalChildren - 1))} aria-label={currentLocale === 'mn' ? 'Хүүхдүүдийг хасах' : 'Decrease children'} className="w-8 h-8 flex items-center justify-center text-main hover:bg-white/10 rounded transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center text-main font-semibold font-body" aria-live="polite">{totalChildren}</span>
                <button onClick={() => setTotalChildren(Math.min(10, totalChildren + 1))} aria-label={currentLocale === 'mn' ? 'Хүүхдүүдийг нэмэх' : 'Increase children'} className="w-8 h-8 flex items-center justify-center text-main hover:bg-white/10 rounded transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <button onClick={handleSearch} disabled={loading} className="mt-6 sm:mt-6 px-8 py-3 bg-bark text-white font-serif uppercase tracking-widest hover:bg-bark/80 transition-all cursor-pointer rounded-lg font-semibold disabled:opacity-50">
              {loading ? t('loading') : t('searchRooms')}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <label htmlFor="promo-code" className="sr-only">{t('promoCode')}</label>
              <Tag className="w-4 h-4 text-main/70" aria-hidden="true" />
              <input id="promo-code" type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder={t('enterPromo')} className="flex-1 px-3 py-2 bg-white/10 border border-main/30 text-main rounded-lg focus:outline-none focus:border-main transition-colors placeholder:text-main/30 text-sm uppercase tracking-wider font-body" />
            </div>
            <button onClick={handleApplyPromo} disabled={promoLoading || !promoCode.trim()} className="px-4 py-2 bg-surface-alt/20 text-main text-sm uppercase tracking-wider hover:bg-surface-alt/30 transition-all cursor-pointer rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-body">
              {promoLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('apply')}
            </button>
          </div>
          {appliedPromo && (
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-bark/20 text-bark text-sm rounded-full font-body">
                <Check className="w-4 h-4" />
                {t('promoApplied')} ({appliedPromo})
              </span>
            </div>
          )}
          {error && <div className="mt-4 text-red-300 text-sm font-body">{error}</div>}
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-bark" />
            <p className="text-ink/70 mt-4 font-body">{t('loading')}</p>
          </div>
        )}

        {!loading && searched && rooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-ink/70 text-lg font-body">{t('noRooms')}</p>
            <p className="text-ink/50 mt-2 font-body">{t('tryDifferent')}</p>
          </div>
        )}

        {!loading && rooms.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Room list */}
            <div className="flex-1 space-y-6 min-w-0">
              <p className="text-ink/60 text-sm font-body">
                {currentLocale === 'mn'
                  ? `${totalAdults} насанд хүрэгчдэд зориулсан хайлтын үр дүн`
                  : `Search results for ${totalAdults} adult${totalAdults > 1 ? 's' : ''}`}
                {totalChildren > 0 && (currentLocale === 'mn' ? `, ${totalChildren} хүүхэд` : ` and ${totalChildren} child${totalChildren > 1 ? 'ren' : ''}`)}
              </p>

              {(() => {
                const allRestrictions = rooms
                  .filter(r => r.restrictions)
                  .flatMap(r => getRestrictionMessages(r.restrictions));
                const uniqueRestrictions = [...new Set(allRestrictions)];
                if (uniqueRestrictions.length === 0) return null;
                return (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800 text-sm font-body mb-1">
                          {currentLocale === 'mn' ? 'Сонгосон огнооны хязгаарлалтууд' : 'Restrictions for selected dates'}
                        </p>
                        <ul className="space-y-0.5">
                          {uniqueRestrictions.map((msg, i) => (
                            <li key={i} className="text-orange-700 text-xs font-body">{msg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {groupedRooms
                .filter(group => (group.maxGuests || 0) >= totalGuests)
                .map((group, index) => {
                  const photos = group.photos || [];
                  const maxGuests = group.maxGuests || 2;
                  const isExpanded = expandedRooms.has(group.roomTypeName);
                  const hasCartItem = group.rates.some(r => cart.some(c => cartKey(c.roomTypeID, c.rateID) === cartKey(r.roomTypeID, r.rateID)));

                  return (
                    <div key={group.roomTypeName || index} className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all ${hasCartItem ? 'ring-2 ring-bark' : ''}`}>
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-64 lg:w-72 h-56 md:h-auto flex-shrink-0">
                          <img
                            src={photos[0] || placeholderImages[index % placeholderImages.length]}
                            alt={group.roomTypeName || "Room"}
                            className="w-full h-full object-cover"
                          />
                          {group.roomsAvailable && group.roomsAvailable <= 3 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-body">
                              {t('onlyLeft', { count: group.roomsAvailable })}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 p-5 md:p-6">
                          <h3 className="font-serif text-xl text-ink mb-1">
                            <Link href={getRoomDetailPath(group.roomTypeName)} className="hover:text-ink/70 underline underline-offset-4 decoration-ink/30 hover:decoration-ink/60 transition-colors">
                              {group.roomTypeName || "Room"}
                            </Link>
                          </h3>

                          <div className="flex items-center gap-1.5 text-sm text-ink/70 font-body mb-3">
                            <Users className="w-4 h-4" />
                            <span>{maxGuests}</span>
                          </div>

                          <div
                            className="text-ink/60 text-sm mb-4 line-clamp-2 font-body"
                            dangerouslySetInnerHTML={{ __html: group.description || "" }}
                          />

                          <Link href={getRoomDetailPath(group.roomTypeName)} className="text-sm text-bark hover:text-bark/80 font-medium font-body transition-colors">
                            {currentLocale === 'mn' ? 'Дэлгэрэнгүй' : 'View details'}
                          </Link>
                        </div>
                      </div>

                      {/* Rate plans */}
                      {(() => {
                        const defaultRate = group.rates.reduce((min, r) => (r.totalRate > 0 && r.totalRate < min.totalRate) || min.totalRate === 0 ? r : min, group.rates[0]);
                        const otherRates = group.rates.filter(r => r.rateID !== defaultRate.rateID);

                        return (
                          <div className="border-t border-ink/10">
                            {renderRateRow(defaultRate)}

                            {otherRates.length > 0 && (
                              <>
                                <div className="border-t border-ink/10">
                                  <button
                                    onClick={() => toggleExpand(group.roomTypeName)}
                                    className="w-full px-5 md:px-6 py-3 flex items-center justify-center gap-2 text-sm text-bark font-medium font-body hover:bg-surface-alt/50 transition-colors"
                                  >
                                    {isExpanded
                                      ? (currentLocale === 'mn' ? 'Саналуудыг хаах' : 'Hide offers')
                                      : (currentLocale === 'mn' ? 'Саналуудыг харах' : 'View offers')
                                    }
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </button>
                                </div>

                                {isExpanded && otherRates.map((rate) => (
                                  <div key={rate.rateID} className="border-t border-ink/10">
                                    {renderRateRow(rate)}
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
            </div>

            {/* Reservation Summary sidebar (desktop) */}
            {cart.length > 0 && (
              <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-ink/10">
                      <h3 className="font-serif text-lg font-semibold text-ink text-center">
                        {currentLocale === 'mn' ? 'Захиалгын хураангуй' : 'Reservation Summary'}
                      </h3>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between text-sm font-body mb-1">
                        <span className="text-ink">{formatDate(checkin)}</span>
                        <ArrowRight className="w-4 h-4 text-ink/40" />
                        <span className="text-ink">{formatDate(checkout)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-ink/60 font-body mb-5">
                        <Moon className="w-3.5 h-3.5" />
                        <span>{numberOfNights} {currentLocale === 'mn' ? 'шөнө' : `Night${numberOfNights > 1 ? 's' : ''}`}</span>
                      </div>

                      <div className="space-y-4 mb-5">
                        {cart.map((item) => (
                          <div key={cartKey(item.roomTypeID, item.rateID)} className="pb-4 border-b border-ink/10 last:border-0 last:pb-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-ink text-sm font-body">{item.roomTypeName}</p>
                                <p className="text-ink/50 text-xs font-body">{translateRateName(item.rateName, currentLocale)}</p>
                              </div>
                              <p className="font-serif text-sm font-semibold text-ink whitespace-nowrap">
                                {(item.pricePerNight * item.quantity * numberOfNights).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5 text-xs text-ink/60 font-body">
                                <Users className="w-3.5 h-3.5" />
                                <span>{item.quantity > 1 ? `${item.quantity} x ` : ''}{item.maxGuests}</span>
                              </div>
                              <button
                                onClick={() => toggleRoomSelection({ roomTypeID: item.roomTypeID, rateID: item.rateID, roomTypeName: item.roomTypeName, rateName: item.rateName, totalRate: item.pricePerNight * numberOfNights, currency: item.currency, maxGuests: item.maxGuests, roomsAvailable: 0, description: '', photos: [], features: [] })}
                                className="w-7 h-7 flex items-center justify-center rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-ink/10 pt-4 space-y-2">
                        <div className="flex justify-between text-sm font-body">
                          <span className="text-ink/70">{currentLocale === 'mn' ? 'Нийлбэр' : 'Subtotal'}</span>
                          <span className="text-ink">{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-body">
                          <span className="text-ink/70">{currentLocale === 'mn' ? 'Татвар, хураамж' : 'Taxes and fees'}</span>
                          <span className="text-ink">0.00</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-ink/10">
                          <span className="font-serif font-bold text-ink">{currentLocale === 'mn' ? 'Нийт' : 'Total'}</span>
                          <span className="font-serif font-bold text-ink">MNT {cartTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-ink/10">
                        <p className="text-xs text-ink/60 font-body font-medium uppercase tracking-wider mb-2">
                          {currentLocale === 'mn' ? 'Төлбөрийн хуваарь' : 'Payment Schedule'}
                        </p>
                        <div className="flex justify-between text-sm font-body">
                          <span className="text-ink/70">{currentLocale === 'mn' ? 'Урьдчилгаа (одоо)' : 'Deposit (pay now)'}</span>
                          <span className="text-ink">{depositDueNow.toLocaleString()}</span>
                        </div>
                        {balanceOnArrival > 0 && (
                          <div className="flex justify-between text-sm font-body mt-1.5">
                            <span className="text-ink/70">{currentLocale === 'mn' ? 'Ирэхэд төлөх' : 'Due on arrival'}</span>
                            <span className="text-ink">{balanceOnArrival.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {cart.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-ink/10">
                          <p className="text-xs text-ink/60 font-body font-medium uppercase tracking-wider mb-2">
                            {currentLocale === "mn" ? "Цуцлалт (Cloudbeds)" : "Cancellation (Cloudbeds)"}
                          </p>
                          <ul className="space-y-2 text-xs text-ink/80 font-body">
                            {cartCancellationNotes.map((row, i) => (
                              <li key={i}>
                                <span className="font-medium text-ink">{row.label}</span>
                                <span className="text-ink/70"> — {row.text}</span>
                              </li>
                            ))}
                            {cartCancellationNotes.length === 0 && (
                              <li className="text-ink/70">
                                {currentLocale === "mn"
                                  ? "Танай сонгосон үнэд зориулсан өдрийн тоо API-аас ирээгүй байна. Доорх нөхцөл эсвэл баталгаажуулах имэйлээ шалгана уу."
                                  : "No rate-level cancellation rule was returned by Cloudbeds for this search. Check the property terms below or your confirmation email."}
                              </li>
                            )}
                          </ul>
                          {propertyTermsAndConditions && (() => {
                            const plain = stripHtml(propertyTermsAndConditions);
                            const short = plain.length > 480 ? `${plain.slice(0, 480)}…` : plain;
                            return (
                              <p className="mt-3 text-xs text-ink/70 font-body leading-relaxed">
                                <span className="font-medium text-ink/80">
                                  {currentLocale === "mn" ? "Байршлын нөхцөл (Cloudbeds): " : "Property terms (Cloudbeds): "}
                                </span>
                                {short}
                              </p>
                            );
                          })()}
                        </div>
                      )}

                      {capacityError && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          <p className="text-orange-700 text-xs font-body">{capacityError}</p>
                        </div>
                      )}

                      <button
                        onClick={proceedToCheckout}
                        disabled={cartCapacity < totalGuests}
                        className={`w-full mt-5 py-3 font-serif font-semibold text-sm rounded-lg transition-colors ${cartCapacity >= totalGuests ? 'bg-bark text-white hover:bg-bark/80 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      >
                        {currentLocale === 'mn' ? 'Одоо захиалах' : 'Book Now'}
                      </button>

                      <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-ink/50 font-body">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{currentLocale === 'mn' ? 'Аюулгүй онлайн төлбөр' : 'Secure Online Payment'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {!searched && !loading && <div className="text-center py-12"><p className="text-ink/50 text-lg font-body">{t('selectDatesPrompt')}</p></div>}
      </div>

      <div className="py-8 text-center">
        <a href={localePrefix || "/"} className="text-ink/50 text-sm hover:text-ink transition-colors font-body">&larr; {t('backToHome')}</a>
      </div>

      {/* Mobile bottom bar */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-ink/10 shadow-2xl z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            {capacityError && (
              <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-orange-700 text-sm font-body">{capacityError}</p>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-ink font-body">
                <span className="font-medium">{totalRooms} {currentLocale === 'mn' ? 'өрөө' : 'Room(s)'}</span>
                <span className="text-ink/30">•</span>
                <span className="font-serif text-lg font-bold">{cartTotal.toLocaleString()} MNT</span>
              </div>
              <button onClick={proceedToCheckout} disabled={cartCapacity < totalGuests} className={`px-6 py-3 font-serif uppercase tracking-widest text-xs rounded-lg font-semibold transition-colors whitespace-nowrap ${cartCapacity >= totalGuests ? 'bg-bark text-white hover:bg-bark/80 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {currentLocale === 'mn' ? 'Захиалах' : 'Book Now'}
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
    <Suspense fallback={<main className="min-h-screen bg-surface-alt flex items-center justify-center"><p className="text-ink">{t('loading')}</p></main>}>
      <BookingContent />
    </Suspense>
  );
}
