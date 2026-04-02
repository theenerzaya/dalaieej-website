"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Users, Check, Tag, Loader2, Plus, Minus, AlertTriangle } from "lucide-react";
import { useTranslations } from 'next-intl';

interface Room {
  roomTypeID: string;
  roomTypeName: string;
  roomsAvailable: number;
  rateID: string;
  rateName: string;
  totalRate: number;
  currency: string;
  description: string;
  maxGuests: number;
  photos: string[];
  features: string[];
}

interface CartItem {
  roomTypeID: string;
  roomTypeName: string;
  rateID: string;
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
}

function calculateNights(checkinDate: string, checkoutDate: string): number {
  if (!checkinDate || !checkoutDate) return 1;
  const start = new Date(checkinDate);
  const end = new Date(checkoutDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
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

  const totalGuests = totalAdults + totalChildren;
  const cartCapacity = cart.reduce((sum, item) => sum + (item.maxGuests * item.quantity), 0);

  // FIX: Removed guest multiplier. Price is simply Rate * Quantity * Nights.
  const cartTotal = cart.reduce((sum, item) => sum + (item.pricePerNight * item.quantity * numberOfNights), 0);
  const totalRooms = cart.reduce((sum, item) => sum + item.quantity, 0);

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

    if (urlCheckin) setCheckin(urlCheckin);
    if (urlCheckout) setCheckout(urlCheckout);
    if (urlPromo) {
      setPromoCode(urlPromo);
      setAppliedPromo(urlPromo);
    }

    // Fallback values for parsing
    const parsedAdults = urlAdults ? parseInt(urlAdults) : 2;
    const parsedChildren = urlChildren ? parseInt(urlChildren) : 0;

    if (urlAdults) setTotalAdults(parsedAdults);
    if (urlChildren) setTotalChildren(parsedChildren);

    if (urlCheckin && urlCheckout) {
      setNumberOfNights(calculateNights(urlCheckin, urlCheckout));
      // Now TypeScript knows these are safe numbers
      fetchAvailability(urlCheckin, urlCheckout, urlPromo || "", parsedAdults, parsedChildren);
    }
  }, [searchParams]);
  
  // RESTORED: We now pass the REAL guest count to the API.
  const fetchAvailability = async (checkInDate: string, checkOutDate: string, promo: string = "", adults: number = totalAdults, children: number = totalChildren) => {
    setLoading(true);
    setError("");
    setRooms([]);

    try {
      // Cloudbeds returns the TOTAL price for this specific number of adults.
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
    const existingIndex = cart.findIndex(item => item.roomTypeID === room.roomTypeID);
    if (existingIndex >= 0) {
      setCart(cart.filter(item => item.roomTypeID !== room.roomTypeID));
    } else {
      const newItem: CartItem = {
        roomTypeID: room.roomTypeID,
        roomTypeName: room.roomTypeName,
        rateID: room.rateID,
        maxGuests: room.maxGuests || 2,
        pricePerNight: numberOfNights > 0 ? (room.totalRate || 0) / numberOfNights : (room.totalRate || 0),
        currency: room.currency || 'MNT',
        adults: Math.min(totalAdults, room.maxGuests || 2),
        children: 0,
        quantity: 1,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateRoomQuantity = (roomTypeID: string, delta: number) => {
    const room = rooms.find(r => r.roomTypeID === roomTypeID);
    const maxAvailable = room?.roomsAvailable || 10;

    setCart(cart.map(item => {
      if (item.roomTypeID === roomTypeID) {
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

  return (
    <main className="min-h-screen bg-surface-alt pt-24 md:pt-16 pb-32">
      <div className="bg-leaf py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-main mb-4">{t('findRoom')}</h1>
          <p className="font-sans text-main/70 mb-8">{t('selectDates')}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-4xl mx-auto flex-wrap">
            <div className="flex flex-col">
              <label className="text-main/70 text-xs uppercase tracking-wider mb-1 font-sans text-left">{t('checkIn')}</label>
              <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} min={minDate} className="px-4 py-3 bg-white/10 border border-main/50 text-main rounded-lg focus:outline-none focus:border-main transition-colors" />
            </div>
            <div className="flex flex-col">
              <label className="text-main/70 text-xs uppercase tracking-wider mb-1 font-sans text-left">{t('checkOut')}</label>
              <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} min={checkin || minDate} className="px-4 py-3 bg-white/10 border border-main/50 text-main rounded-lg focus:outline-none focus:border-main transition-colors" />
            </div>

            <div className="flex flex-col">
              <label className="text-main/70 text-xs uppercase tracking-wider mb-1 font-sans text-left">{currentLocale === 'mn' ? 'Насанд хүрэгчид' : 'Adults'}</label>
              <div className="flex items-center gap-2 bg-white/10 border border-main/50 rounded-lg px-3 py-2">
                <button onClick={() => setTotalAdults(Math.max(1, totalAdults - 1))} className="w-8 h-8 flex items-center justify-center text-main hover:bg-white/10 rounded transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center text-main font-semibold">{totalAdults}</span>
                <button onClick={() => setTotalAdults(Math.min(20, totalAdults + 1))} className="w-8 h-8 flex items-center justify-center text-main hover:bg-white/10 rounded transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-main/70 text-xs uppercase tracking-wider mb-1 font-sans text-left">{currentLocale === 'mn' ? 'Хүүхдүүд' : 'Children'}</label>
              <div className="flex items-center gap-2 bg-white/10 border border-main/50 rounded-lg px-3 py-2">
                <button onClick={() => setTotalChildren(Math.max(0, totalChildren - 1))} className="w-8 h-8 flex items-center justify-center text-main hover:bg-white/10 rounded transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center text-main font-semibold">{totalChildren}</span>
                <button onClick={() => setTotalChildren(Math.min(10, totalChildren + 1))} className="w-8 h-8 flex items-center justify-center text-main hover:bg-white/10 rounded transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <button onClick={handleSearch} disabled={loading} className="mt-6 sm:mt-6 px-8 py-3 bg-surface-alt text-leaf font-serif uppercase tracking-widest hover:bg-white transition-all cursor-pointer rounded-lg font-semibold disabled:opacity-50">
              {loading ? t('loading') : t('searchRooms')}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <Tag className="w-4 h-4 text-main/70" />
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder={t('enterPromo')} className="flex-1 px-3 py-2 bg-white/10 border border-main/30 text-main rounded-lg focus:outline-none focus:border-main transition-colors placeholder:text-main/30 text-sm uppercase tracking-wider" />
            </div>
            <button onClick={handleApplyPromo} disabled={promoLoading || !promoCode.trim()} className="px-4 py-2 bg-surface-alt/20 text-main text-sm uppercase tracking-wider hover:bg-surface-alt/30 transition-all cursor-pointer rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {promoLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('apply')}
            </button>
          </div>
          {appliedPromo && (
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
                <Check className="w-4 h-4" />
                {t('promoApplied')} ({appliedPromo})
              </span>
            </div>
          )}
          {error && <div className="mt-4 text-red-300 text-sm">{error}</div>}
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4">
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-leaf" />
            <p className="text-leaf/70 mt-4">{t('loading')}</p>
          </div>
        )}

        {!loading && searched && rooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-leaf/70 text-lg">{t('noRooms')}</p>
            <p className="text-leaf/50 mt-2">{t('tryDifferent')}</p>
          </div>
        )}

        {!loading && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms
              // Filter logic remains to ensure rooms are big enough for the group
              .filter(room => (room.maxGuests || 0) >= totalGuests)
              .map((room, index) => {
                const perNightRate = room.totalRate && numberOfNights > 0 ? Number(room.totalRate) / numberOfNights : (Number(room.totalRate) || 0);
                const hasPrice = perNightRate > 0;
                const photos = room.photos || [];
                const features = room.features || [];
                const cartItem = cart.find(item => item.roomTypeID === room.roomTypeID);
                const isSelected = !!cartItem;
                const maxGuests = room.maxGuests || 2;

                return (
                  <div key={room.roomTypeID || index} className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${isSelected ? 'ring-2 ring-green-500' : ''}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img src={photos[0] || placeholderImages[index % placeholderImages.length]} alt={room.roomTypeName || "Room"} className="w-full h-full object-cover" />
                      {room.roomsAvailable && room.roomsAvailable <= 3 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {t('onlyLeft', { count: room.roomsAvailable })}
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          {currentLocale === 'mn' ? 'Сонгосон' : 'Selected'}
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-serif text-xl text-leaf mb-2">
                        <Link href={getRoomDetailPath(room.roomTypeName)} className="hover:text-leaf/70 underline underline-offset-4 decoration-leaf/30 hover:decoration-leaf/60 transition-colors">
                          {room.roomTypeName || "Room"}
                        </Link>
                      </h3>

                      <div 
                        className="text-leaf/60 text-sm mb-4 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: room.description || "Luxurious accommodation" }}
                      />

                      <div className="flex items-center gap-4 mb-4 text-sm text-leaf/70">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{currentLocale === 'mn' ? `${maxGuests} хүн хүртэл` : `Up to ${maxGuests} guests`}</span>
                        </div>
                      </div>

                      {features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {features.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="flex items-center gap-1 text-xs text-leaf/60 bg-surface-alt px-2 py-1 rounded">
                              <Check className="w-3 h-3" />{feature}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-4 border-t border-leaf/10">
                        {hasPrice ? (
                          <>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                {/* FIX: Display the API returned rate directly without frontend multiplication */}
                                <p className="font-serif text-2xl text-leaf font-bold">{perNightRate.toLocaleString()}</p>
                                <p className="text-leaf/50 text-xs">{room.currency || "MNT"} / {t('perNight')}</p>
                              </div>
                              {numberOfNights > 1 && (
                                <div className="text-right">
                                  <p className="text-sm text-leaf/70">{numberOfNights} {t('nights')}</p>
                                  {/* FIX: Only multiply by nights. Cloudbeds already handled the guest multiplier in perNightRate */}
                                  <p className="font-semibold text-leaf">{(perNightRate * numberOfNights).toLocaleString()} {room.currency}</p>
                                </div>
                              )}
                            </div>
                            {isSelected ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between bg-surface-alt rounded-lg p-3">
                                  <span className="text-sm text-leaf">{currentLocale === 'mn' ? 'Тоо хэмжээ' : 'Quantity'}</span>
                                  <div className="flex items-center gap-3">
                                    <button onClick={() => updateRoomQuantity(room.roomTypeID, -1)} className="w-8 h-8 border border-leaf/20 rounded-full flex items-center justify-center hover:bg-white transition-colors"><Minus className="w-4 h-4" /></button>
                                    <span className="w-8 text-center font-semibold text-leaf">{cartItem.quantity}</span>
                                    <button onClick={() => updateRoomQuantity(room.roomTypeID, 1)} disabled={cartItem.quantity >= room.roomsAvailable} className="w-8 h-8 border border-leaf/20 rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30"><Plus className="w-4 h-4" /></button>
                                  </div>
                                </div>
                                <button onClick={() => toggleRoomSelection(room)} className="w-full py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                                  <Check className="w-5 h-5" />{currentLocale === 'mn' ? 'Сонгосон' : 'Selected'}
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => toggleRoomSelection(room)} className="w-full py-3 bg-leaf text-white font-medium rounded-lg hover:bg-leaf/90 transition-colors">
                                {currentLocale === 'mn' ? 'Сонгох' : 'Select Room'}
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="text-center"><p className="font-serif text-lg text-leaf/50">{t('contactUs')}</p></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {!searched && !loading && <div className="text-center py-12"><p className="text-leaf/50 text-lg">{t('selectDatesPrompt')}</p></div>}
      </div>

      <div className="py-8 text-center">
        <a href={localePrefix || "/"} className="text-leaf/50 text-sm hover:text-leaf transition-colors">&larr; {t('backToHome')}</a>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-leaf/10 shadow-2xl z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            {capacityError && (
              <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-orange-700 text-sm">{capacityError}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-leaf">
                <span className="font-medium">{totalRooms} {currentLocale === 'mn' ? 'өрөө' : 'Room(s)'}</span>
                <span className="text-leaf/30">•</span>
                <span>{totalGuests} {currentLocale === 'mn' ? 'зочин' : 'Guests'}</span>
                <span className="text-leaf/30">•</span>
                <span>{numberOfNights} {currentLocale === 'mn' ? 'шөнө' : 'Night(s)'}</span>
                <span className="text-leaf/30">•</span>
                <span className="font-serif text-xl font-bold">{cartTotal.toLocaleString()} MNT</span>
              </div>
              <button onClick={proceedToCheckout} disabled={cartCapacity < totalGuests} className={`px-8 py-3 font-serif uppercase tracking-widest text-sm rounded-lg font-semibold transition-colors whitespace-nowrap ${cartCapacity >= totalGuests ? 'bg-leaf text-white hover:bg-leaf/90 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {currentLocale === 'mn' ? 'Захиалга үргэлжлүүлэх' : 'Complete Reservation'}
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
    <Suspense fallback={<main className="min-h-screen bg-surface-alt flex items-center justify-center"><p className="text-leaf">{t('loading')}</p></main>}>
      <BookingContent />
    </Suspense>
  );
}