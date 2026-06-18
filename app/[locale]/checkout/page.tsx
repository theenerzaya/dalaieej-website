/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { User, Mail, Phone, Globe, MessageSquare, Plus, Minus, Loader2, AlertCircle, Check, ChevronDown, ChevronUp, Bed, ShieldCheck } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import Link from "next/link";
import { sumDepositDueForRoomLines, depositPortionForAddonTotal } from "@/lib/deposit-policy";
import { normalizeCloudbedsRoomTypeID } from "@/lib/cloudbeds";
import { validateStayDates } from "@/lib/booking-guards";
import { formatIsoDateAsDots } from "@/lib/dateFormat";
import { withLocalePath } from "@/lib/localePath";
import {
  getCabinDisplayName,
  resolveCabinSlugFromCloudbeds,
  type CabinSlug,
} from "@/lib/cabinCatalog";
import { toPlainProviderText } from "@/lib/providerText";

interface CartRoom {
  id?: string;
  cabinSlug?: CabinSlug | null;
  providerRoomTypeName?: string;
  roomTypeID: string;
  roomTypeName: string;
  rateID: string;
  rateName?: string;
  maxGuests: number;
  pricePerNight: number;
  currency: string;
  adults: number;
  children: number;
  quantity: number;
}

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  priceType: string;
  category: string;
  image: string | null;
  maxQuantity: number;
}

interface SelectedAddon extends Addon {
  quantity: number;
}

function getOrCreateCheckoutAttemptId(): string {
  const key = "dalai-eej-checkout-attempt";
  if (typeof window === "undefined") return `attempt-${Date.now()}`;

  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.sessionStorage.setItem(key, id);
  return id;
}

function cleanCartRoomText(room: CartRoom): CartRoom {
  return {
    ...room,
    providerRoomTypeName: toPlainProviderText(room.providerRoomTypeName) || undefined,
    roomTypeName: toPlainProviderText(room.roomTypeName) || "Room",
    rateName: toPlainProviderText(room.rateName) || undefined,
  };
}

function cleanAddonText(addon: Addon): Addon {
  return {
    ...addon,
    name: toPlainProviderText(addon.name) || addon.name,
    description: toPlainProviderText(addon.description),
    category: toPlainProviderText(addon.category) || "other",
  };
}

function CheckoutContent() {
  const t = useTranslations('checkout');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.startsWith('/mn') ? 'mn' : 'en';
  const localePrefix = withLocalePath(currentLocale, "/");
  const editorialFont = currentLocale === 'mn' ? 'font-editorial-mn' : 'font-editorial-en';

  const [cartRooms, setCartRooms] = useState<CartRoom[]>([]);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [nights, setNights] = useState(1);
  const [promo, setPromo] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("MN");
  const [specialRequests, setSpecialRequests] = useState("");

  const [addons, setAddons] = useState<Addon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [loadingAddons, setLoadingAddons] = useState(false);
  const [addonsExpanded, setAddonsExpanded] = useState(true);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [repricingCart, setRepricingCart] = useState(false);
  const [error, setError] = useState("");
  const checkoutAttemptId = useMemo(getOrCreateCheckoutAttemptId, []);

  const repriceCartLines = async (
    checkIn: string,
    checkOut: string,
    lines: CartRoom[],
    nightCount: number,
    promo?: string | null
  ): Promise<CartRoom[]> => {
    return Promise.all(
      lines.map(async (item) => {
        let url = `/api/cloudbeds/availability?checkin=${checkIn}&checkout=${checkOut}&quoteAdults=${item.adults}&quoteChildren=${item.children}&repricing=true`;
        if (promo) url += `&promo=${encodeURIComponent(promo)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok || !data.rooms) {
          throw new Error(
            currentLocale === "mn"
              ? `${item.roomTypeName}: үнийг шалгаж чадсангүй`
              : `Could not verify price for ${item.roomTypeName}`
          );
        }
        const match = data.rooms.find(
          (r: { roomTypeID: string; rateID: string }) =>
            r.roomTypeID === item.roomTypeID && String(r.rateID) === String(item.rateID)
        ) as { roomTypeID: string; roomTypeName?: string; totalRate: number } | undefined;
        if (!match || !(match.totalRate > 0)) {
          throw new Error(
            currentLocale === "mn"
              ? `${item.roomTypeName} энэ зочид тоонд боломжгүй эсвэл үнэ олдсонгүй`
              : `${item.roomTypeName} is not available at this guest count or rate`
          );
        }
        const slug =
          resolveCabinSlugFromCloudbeds(match.roomTypeID, match.roomTypeName) ??
          item.cabinSlug ??
          null;
        return {
          ...item,
          cabinSlug: slug,
          providerRoomTypeName: toPlainProviderText(match.roomTypeName || item.providerRoomTypeName),
          roomTypeName:
            toPlainProviderText(
              getCabinDisplayName(
                slug,
                currentLocale,
                match.roomTypeName || item.providerRoomTypeName || item.roomTypeName
              )
            ) || item.roomTypeName,
          pricePerNight:
            nightCount > 0 ? match.totalRate / nightCount : match.totalRate,
        };
      })
    );
  };

  useEffect(() => {
    const urlCheckin = searchParams.get("checkin");
    const urlCheckout = searchParams.get("checkout");
    const urlNights = searchParams.get("nights");
    const urlCart = searchParams.get("cart");
    const urlPromo = searchParams.get("promo");

    if (urlCheckin) setCheckin(urlCheckin);
    if (urlCheckout) setCheckout(urlCheckout);
    setPromo(urlPromo || "");
    const stayDates = validateStayDates(urlCheckin, urlCheckout);
    const parsedUrlNights = urlNights ? parseInt(urlNights, 10) : 1;
    const nightCount = stayDates.ok
      ? stayDates.nights
      : Number.isFinite(parsedUrlNights) && parsedUrlNights > 0
        ? parsedUrlNights
        : 1;
    setNights(nightCount);

    if (urlCart) {
      try {
        const decodedCart = decodeURIComponent(urlCart);
        const parsedCart = (JSON.parse(decodedCart) as CartRoom[]).map(cleanCartRoomText);
        setCartRooms(parsedCart);

        if (urlCheckin && urlCheckout && parsedCart.length > 0) {
          fetchAddons(urlCheckin, urlCheckout, normalizeCloudbedsRoomTypeID(parsedCart[0].roomTypeID));
          setRepricingCart(true);
          setError("");
          void repriceCartLines(urlCheckin, urlCheckout, parsedCart, nightCount, urlPromo)
            .then(setCartRooms)
            .catch((e: unknown) => {
              setError(
                e instanceof Error
                  ? e.message
                  : currentLocale === "mn"
                    ? "Үнийг шинэчлэхэд алдаа гарлаа"
                    : "Could not refresh pricing"
              );
            })
            .finally(() => setRepricingCart(false));
        }
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when URL cart changes
  }, [searchParams]);

  const fetchAddons = async (checkIn: string, checkOut: string, roomType: string) => {
    setLoadingAddons(true);
    try {
      const response = await fetch(`/api/cloudbeds/addons?checkin=${checkIn}&checkout=${checkOut}&roomTypeId=${roomType}`);
      const data = await response.json();
      if (data.success && data.addons) {
        setAddons((data.addons as Addon[]).map(cleanAddonText));
      }
    } catch (err) {
      console.error("Failed to fetch add-ons:", err);
    } finally {
      setLoadingAddons(false);
    }
  };

  const toggleAddon = (addon: Addon) => {
    const existing = selectedAddons.find(a => a.id === addon.id);
    if (existing) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, { ...addon, quantity: 1 }]);
    }
  };

  const updateAddonQuantity = (addonId: string, delta: number) => {
    setSelectedAddons(selectedAddons.map(addon => {
      if (addon.id === addonId) {
        const newQty = Math.max(1, Math.min(addon.maxQuantity, addon.quantity + delta));
        return { ...addon, quantity: newQty };
      }
      return addon;
    }));
  };

  const calculateAddonsTotal = () => {
    return selectedAddons.reduce((total, addon) => {
      let addonPrice = addon.price * addon.quantity;
      if (addon.priceType === "per_night") {
        addonPrice *= nights;
      }
      return total + addonPrice;
    }, 0);
  };

  const addonsTotal = calculateAddonsTotal();
  const roomsTotal = cartRooms.reduce((sum, room) => sum + (room.pricePerNight * room.quantity * nights), 0);
  const totalPrice = roomsTotal + addonsTotal;
  const currency = cartRooms[0]?.currency || "MNT";

  const depositDueNow =
    sumDepositDueForRoomLines(
      cartRooms.map((r) => ({
        rateName: r.rateName ?? "",
        pricePerNight: r.pricePerNight,
        quantity: r.quantity,
      })),
      nights
    ) + depositPortionForAddonTotal(addonsTotal);
  const balanceOnArrival = Math.max(0, totalPrice - depositDueNow);

  const validateForm = () => {
    if (repricingCart) return currentLocale === "mn" ? "Үнийг шалгаж байна" : "Still checking the latest price";
    if (cartRooms.length === 0) return currentLocale === "mn" ? "Өрөө сонгоно уу" : "Please select at least one room";
    if (!validateStayDates(checkin, checkout).ok) return currentLocale === "mn" ? "Огноогоо дахин шалгана уу" : "Please check your stay dates";
    if (!(totalPrice > 0)) return currentLocale === "mn" ? "Захиалгын дүн буруу байна" : "Booking total is invalid";
    if (!firstName.trim()) return t('errorFirstName');
    if (!lastName.trim()) return t('errorLastName');
    if (!email.trim()) return t('errorEmail');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t('errorEmailInvalid');
    if (!termsAccepted) return t('errorTerms');
    return null;
  };

  const handleProceedToPayment = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const rooms = cartRooms.map(room => ({
        roomTypeID: room.roomTypeID,
        roomRateID: room.rateID,
        quantity: room.quantity,
        adults: room.adults,
        children: room.children,
      }));

      const response = await fetch("/api/cloudbeds/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rooms,
          checkin,
          checkout,
          guestFirstName: firstName,
          guestLastName: lastName,
          guestEmail: email,
          guestPhone: phone,
          guestCountry: country,
          specialRequests,
          addons: selectedAddons.map(a => ({ id: a.id, quantity: a.quantity })),
          totalAmount: totalPrice,
          promo,
          idempotencyKey: checkoutAttemptId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create reservation");
      }

      if (!data.paymentSession || typeof data.paymentSession !== "string") {
        throw new Error("Reservation created, but payment session was not returned");
      }

      const paymentParams = new URLSearchParams({
        session: data.paymentSession,
      });

      router.push(`${localePrefix}/payment?${paymentParams.toString()}`);
    } catch (err) {
      console.error("Reservation error:", err);
      setError(err instanceof Error ? err.message : "Failed to process booking");
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => formatIsoDateAsDots(dateStr);

  return (
    <main id="main-content" className="min-h-screen bg-ink text-main pt-24 md:pt-20 pb-20">
      <div className="px-6 pt-6 md:pt-10 pb-8 border-b border-main/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`${editorialFont} italic text-3xl md:text-[2.25rem] leading-tight text-main mb-2`}>
            {t('title')}
          </h1>
          <p className="font-body text-main/60 text-sm md:text-base">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.04] border border-main/10 p-6"
            >
              <h2 className={`${editorialFont} italic text-xl text-main mb-6 flex items-center gap-2`}>
                <Bed className="w-5 h-5 text-bark shrink-0" />
                {currentLocale === 'mn' ? 'Сонгосон өрөөнүүд' : 'Selected Rooms'}
              </h2>

              {cartRooms.length === 0 ? (
                <p className="text-main/50 font-body">{currentLocale === 'mn' ? 'Өрөө сонгоогүй байна' : 'No rooms selected'}</p>
              ) : (
                <div className="space-y-4">
                  {cartRooms.map((room, index) => (
                    <div key={`${room.roomTypeID}-${index}`} className="border border-main/15 bg-white/[0.02] p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h3 className={`${editorialFont} italic font-normal text-main`}>{room.roomTypeName}</h3>
                          <p className="text-sm text-main/60 font-body mt-1">
                            {room.adults} {currentLocale === 'mn' ? 'насанд хүрэгч' : (room.adults > 1 ? 'adults' : 'adult')}
                            {room.children > 0 && `, ${room.children} ${currentLocale === 'mn' ? 'хүүхэд' : (room.children > 1 ? 'children' : 'child')}`}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`${editorialFont} italic text-main`}>
                            {(room.pricePerNight * room.quantity * nights).toLocaleString()} {room.currency}
                          </p>
                          <p className="text-xs text-main/50 font-body mt-0.5">
                            {room.pricePerNight.toLocaleString()} × {nights} {currentLocale === 'mn' ? 'шөнө' : (nights === 1 ? 'night' : 'nights')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.04] border border-main/10 p-6"
            >
              <h2 className={`${editorialFont} italic text-xl text-main mb-6 flex items-center gap-2`}>
                <User className="w-5 h-5 text-bark shrink-0" />
                {t('guestInfo')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-main text-sm mb-1 font-body">
                    {t('firstName')} <span className="text-main/50">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t('firstNamePlaceholder')}
                    className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors placeholder:text-main/35"
                  />
                </div>
                <div>
                  <label className="block text-main text-sm mb-1 font-body">
                    {t('lastName')} <span className="text-main/50">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t('lastNamePlaceholder')}
                    className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors placeholder:text-main/35"
                  />
                </div>
                <div>
                  <label className="block text-main text-sm mb-1 flex items-center gap-1 font-body">
                    <Mail className="w-4 h-4 text-main/50" />
                    {t('email')} <span className="text-main/50">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors placeholder:text-main/35"
                  />
                </div>
                <div>
                  <label className="block text-main text-sm mb-1 flex items-center gap-1 font-body">
                    <Phone className="w-4 h-4 text-main/50" />
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors placeholder:text-main/35"
                  />
                </div>
                <div>
                  <label className="block text-main text-sm mb-1 flex items-center gap-1 font-body">
                    <Globe className="w-4 h-4 text-main/50" />
                    {t('country')}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="MN">{currentLocale === 'mn' ? 'Монгол' : 'Mongolia'}</option>
                    <option value="US">{currentLocale === 'mn' ? 'АНУ' : 'USA'}</option>
                    <option value="CN">{currentLocale === 'mn' ? 'Хятад' : 'China'}</option>
                    <option value="RU">{currentLocale === 'mn' ? 'Орос' : 'Russia'}</option>
                    <option value="KR">{currentLocale === 'mn' ? 'Өмнөд Солонгос' : 'South Korea'}</option>
                    <option value="JP">{currentLocale === 'mn' ? 'Япон' : 'Japan'}</option>
                    <option value="DE">{currentLocale === 'mn' ? 'Герман' : 'Germany'}</option>
                    <option value="GB">{currentLocale === 'mn' ? 'Их Британи' : 'UK'}</option>
                    <option value="FR">{currentLocale === 'mn' ? 'Франц' : 'France'}</option>
                    <option value="AU">{currentLocale === 'mn' ? 'Австрали' : 'Australia'}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-main text-sm mb-1 flex items-center gap-1 font-body">
                    <MessageSquare className="w-4 h-4 text-main/50" />
                    {t('specialRequests')}
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder={t('specialRequestsPlaceholder')}
                    rows={3}
                    className="w-full bg-transparent border border-main/20 focus:border-main text-main font-body px-3 py-2 focus:outline-none transition-colors resize-none placeholder:text-main/35 mt-1"
                  />
                </div>
              </div>
            </motion.div>

            {addons.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/[0.04] border border-main/10 p-6"
              >
                <button
                  type="button"
                  onClick={() => setAddonsExpanded(!addonsExpanded)}
                  className="w-full flex items-center justify-between mb-4 text-left"
                >
                  <h2 className={`${editorialFont} italic text-xl text-main flex items-center gap-2`}>
                    <Plus className="w-5 h-5 text-bark shrink-0" />
                    {t('addons')}
                  </h2>
                  {addonsExpanded ? <ChevronUp className="w-5 h-5 text-main/50 shrink-0" /> : <ChevronDown className="w-5 h-5 text-main/50 shrink-0" />}
                </button>

                {addonsExpanded && (
                  <div className="space-y-3">
                    {loadingAddons ? (
                      <div className="flex items-center gap-2 text-main/50 font-body">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {tCommon('loading')}
                      </div>
                    ) : (
                      addons.map((addon) => {
                        const isSelected = selectedAddons.some(a => a.id === addon.id);
                        const selectedAddon = selectedAddons.find(a => a.id === addon.id);

                        return (
                          <div
                            key={addon.id}
                            className={`border p-4 transition-colors cursor-pointer ${
                              isSelected ? 'border-main/40 bg-white/[0.06]' : 'border-main/15 hover:border-main/25'
                            }`}
                            onClick={() => toggleAddon(addon)}
                          >
                            <div className="flex items-start gap-4">
                              {addon.image && (
                                <div className="w-20 h-20 overflow-hidden flex-shrink-0 border border-main/15">
                                  <img
                                    src={addon.image}
                                    alt={addon.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 flex items-start justify-between gap-3 min-w-0">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                                      isSelected ? 'bg-main border-main' : 'border-main/30'
                                    }`}>
                                      {isSelected && <Check className="w-3 h-3 text-ink" />}
                                    </div>
                                    <h4 className={`${editorialFont} italic font-normal text-main`}>{addon.name}</h4>
                                  </div>
                                  {addon.description && (
                                    <p className="text-sm text-main/60 mt-1 ml-7 font-body">{addon.description}</p>
                                  )}
                                </div>
                                <div className="text-right shrink-0">
                                  <p className={`${editorialFont} italic text-main`}>
                                    {addon.price.toLocaleString()} {addon.currency}
                                  </p>
                                  <p className="text-xs text-main/50 font-body">
                                    {addon.priceType === "per_night" ? t('perNight') : t('oneTime')}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {isSelected && selectedAddon && (
                              <div className="mt-3 ml-7 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                <span className="text-sm text-main/70 font-body">{t('quantity')}:</span>
                                <button
                                  type="button"
                                  onClick={() => updateAddonQuantity(addon.id, -1)}
                                  className="w-7 h-7 border border-main/20 flex items-center justify-center hover:bg-white/[0.06] text-main"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center font-body text-main text-sm">{selectedAddon.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateAddonQuantity(addon.id, 1)}
                                  className="w-7 h-7 border border-main/20 flex items-center justify-center hover:bg-white/[0.06] text-main"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/[0.04] border border-main/10 p-6 lg:sticky lg:top-24"
            >
              <h2 className={`${editorialFont} italic text-xl text-main mb-4`}>
                {t('summary')}
              </h2>

              <div className="space-y-3 text-sm font-body">
                <div>
                  <p className="font-cta uppercase text-[10px] tracking-[0.22em] text-main/50 mb-1">{currentLocale === 'mn' ? 'Огноо' : 'Dates'}</p>
                  <p className="text-main">{formatDate(checkin)} - {formatDate(checkout)}</p>
                  <p className="text-main/60">{nights} {nights === 1 ? t('night') : t('nights')}</p>
                </div>

                <div className="border-t border-main/15 pt-3">
                  <p className="font-cta uppercase text-[10px] tracking-[0.22em] text-main/50 mb-2">{currentLocale === 'mn' ? 'Өрөөнүүд' : 'Rooms'}</p>
                  {cartRooms.map((room, index) => (
                    <div key={`summary-${room.roomTypeID}-${index}`} className="flex justify-between gap-2 mb-1">
                      <span className="text-main min-w-0">{room.roomTypeName}</span>
                      <span className="text-main shrink-0">{(room.pricePerNight * room.quantity * nights).toLocaleString()} {room.currency}</span>
                    </div>
                  ))}
                </div>

                {selectedAddons.length > 0 && (
                  <div className="border-t border-main/15 pt-3">
                    <p className="font-cta uppercase text-[10px] tracking-[0.22em] text-main/50 mb-2">{t('addons')}</p>
                    {selectedAddons.map((addon) => {
                      let addonTotal = addon.price * addon.quantity;
                      if (addon.priceType === "per_night") {
                        addonTotal *= nights;
                      }
                      return (
                        <div key={addon.id} className="flex justify-between gap-2 mb-1">
                          <span className="text-main min-w-0">
                            {addon.name} {addon.quantity > 1 && `×${addon.quantity}`}
                          </span>
                          <span className="text-main shrink-0">{addonTotal.toLocaleString()} {addon.currency}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="border-t border-main/15 pt-3 space-y-2">
                  <div className="flex justify-between text-sm font-body text-main">
                    <span className="text-main/70">
                      {currentLocale === "mn" ? "Урьдчилгаа (одоо төлөх)" : "Deposit (pay now)"}
                    </span>
                    <span>{depositDueNow.toLocaleString()} {currency}</span>
                  </div>
                  {balanceOnArrival > 0 && (
                    <div className="flex justify-between text-sm font-body text-main">
                      <span className="text-main/70">
                        {currentLocale === "mn" ? "Ирэхэд төлөх үлдэгдэл" : "Due on arrival"}
                      </span>
                      <span>{balanceOnArrival.toLocaleString()} {currency}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-main/15 pt-3">
                  <div className={`flex justify-between ${editorialFont} italic text-lg text-main`}>
                    <span>{t('total')}</span>
                    <span>{totalPrice.toLocaleString()} {currency}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5" />
                  <p className="text-orange-200/90 text-sm font-body">{error}</p>
                </div>
              )}

              <div className="mt-6">
                <div className="mb-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-main/40 bg-transparent text-bark focus:ring-main/30 focus:ring-offset-0 cursor-pointer accent-bark"
                    />
                    <span className="text-sm text-main/70 font-body">
                      {t('agreeToTerms')}{' '}
                      <a href="#" className="text-bark underline hover:text-main transition-colors">{t('termsLink')}</a>
                      {' '}{currentLocale === 'mn' ? 'болон' : 'and'}{' '}
                      <a href="#" className="text-bark underline hover:text-main transition-colors">{t('cancellationLink')}</a>.
                    </span>
                  </label>
                </div>

                <p className="mb-4 text-sm text-main/55 font-body leading-relaxed">
                  {t('arrivalNoteBefore')}{' '}
                  <Link
                    href={`${localePrefix}/getting-here`}
                    className="text-main/75 underline decoration-main/30 underline-offset-2 hover:text-main transition-colors"
                  >
                    {t('arrivalNoteLink')}
                  </Link>
                  .
                </p>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={loading || repricingCart || cartRooms.length === 0 || totalPrice <= 0 || !termsAccepted}
                  className={`w-full py-3.5 font-cta uppercase tracking-[0.28em] text-xs transition-colors flex items-center justify-center gap-2 ${
                    termsAccepted && !loading && !repricingCart && cartRooms.length > 0 && totalPrice > 0
                      ? 'bg-main text-ink hover:bg-main/90 cursor-pointer'
                      : 'bg-main/10 text-main/40 cursor-not-allowed'
                  }`}
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? t('processing') : t('proceedToPayment')}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-main/40 font-body text-center">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{t('securePaymentAssurance')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href={`${localePrefix}/booking?checkin=${checkin}&checkout=${checkout}`}
            className="font-cta uppercase tracking-[0.28em] text-[11px] text-main/50 hover:text-main transition-colors"
          >
            &larr; {t('backToRooms')}
          </a>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  const t = useTranslations('common');

  return (
    <Suspense fallback={
      <main className="min-h-screen bg-ink flex items-center justify-center px-4">
        <p className="text-main/70 font-body">{t('loading')}</p>
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
