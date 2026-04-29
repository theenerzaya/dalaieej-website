"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, MapPin, Calendar, Moon, Users, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

function ConfirmationContent() {
  const t = useTranslations("confirmation");
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentLocale = pathname.startsWith("/mn") ? "mn" : "en";
  const localePrefix = currentLocale === "mn" ? "/mn" : "";
  const editorialFont = currentLocale === "mn" ? "font-editorial-mn" : "font-editorial-en";

  const bookingId = searchParams.get("bookingId") || searchParams.get("reservation_id") || "";
  const guestName = searchParams.get("guestName") || "";
  const nights = searchParams.get("nights") || "";
  const amount = searchParams.get("amount") || "";
  const totalAmount = searchParams.get("totalAmount") || "";
  const checkin = searchParams.get("checkin") || "";
  const checkout = searchParams.get("checkout") || "";
  const source = searchParams.get("source") || "";

  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (hasConfirmed.current) return;
    if (!bookingId || bookingId.startsWith("booking-")) return;
    if (source !== "stripe") return;

    hasConfirmed.current = true;
    fetch("/api/cloudbeds/confirm-reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservationId: bookingId }),
    })
      .catch(() => {});
  }, [bookingId, source]);

  const paidNum = amount ? parseInt(amount, 10) : 0;
  const bookingTotalNum = totalAmount ? parseInt(totalAmount, 10) : 0;
  const showSplit =
    bookingTotalNum > 0 && paidNum > 0 && bookingTotalNum > paidNum;
  const balanceNum = showSplit ? bookingTotalNum - paidNum : 0;

  const formattedAmount = amount ? paidNum.toLocaleString() : "";
  const formattedBalance = showSplit ? balanceNum.toLocaleString() : "";
  const formattedBookingTotal = showSplit ? bookingTotalNum.toLocaleString() : "";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <main className="min-h-screen bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 to-ink/40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 pt-24 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle className="w-20 h-20 text-bark mx-auto mb-6" strokeWidth={1.5} />
            </motion.div>

            <h1 className={`${editorialFont} italic text-4xl md:text-5xl text-main mb-4`}>
              {t("title")}
            </h1>
            <p className="font-body text-main/70 text-lg max-w-md mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-main/20 overflow-hidden"
          >
            {bookingId && (
              <div className="bg-white/5 px-8 py-6 border-b border-main/10 text-center">
                <p className="font-cta uppercase text-[10px] tracking-[0.28em] text-main/50 mb-2">
                  {t("bookingReference")}
                </p>
                <p className={`${editorialFont} italic text-3xl text-main tracking-wide`}>
                  {bookingId}
                </p>
              </div>
            )}

            <div className="px-8 py-6 space-y-4">
              {guestName && (
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-main/40 flex-shrink-0" />
                  <span className="text-main/50 text-sm font-body">{t("guest")}</span>
                  <span className="text-main font-medium font-body ml-auto">{guestName}</span>
                </div>
              )}

              {(checkin || checkout) && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-main/40 flex-shrink-0" />
                  <span className="text-main/50 text-sm font-body">{t("dates")}</span>
                  <span className="text-main font-medium font-body ml-auto">
                    {checkin && formatDate(checkin)}
                    {checkin && checkout && " — "}
                    {checkout && formatDate(checkout)}
                  </span>
                </div>
              )}

              {nights && (
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-main/40 flex-shrink-0" />
                  <span className="text-main/50 text-sm font-body">{t("duration")}</span>
                  <span className="text-main font-medium font-body ml-auto">
                    {nights} {parseInt(nights) !== 1 ? t("nights") : t("night")}
                  </span>
                </div>
              )}

              {formattedAmount && !showSplit && (
                <div className="flex items-center gap-3 pt-3 border-t border-main/10">
                  <span className="text-main/50 text-sm font-body">{t("totalPaid")}</span>
                  <span className={`text-main ${editorialFont} italic text-xl ml-auto`}>
                    {formattedAmount} MNT
                  </span>
                </div>
              )}

              {formattedAmount && showSplit && (
                <div className="pt-3 border-t border-main/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-main/50 text-sm font-body">{t("bookingTotal")}</span>
                    <span className="text-main font-medium font-body ml-auto">
                      {formattedBookingTotal} MNT
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-main/50 text-sm font-body">{t("paidToday")}</span>
                    <span className={`text-main ${editorialFont} italic text-xl ml-auto`}>
                      {formattedAmount} MNT
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-main/50 text-sm font-body">{t("balanceOnArrival")}</span>
                    <span className="text-main font-medium font-body ml-auto">
                      {formattedBalance} MNT
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-main/10 px-8 py-6"
          >
            <h2 className={`${editorialFont} italic text-xl text-main mb-4`}>{t("whatNext")}</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-main/40 mt-1 flex-shrink-0" />
                <p className="text-main/70 text-sm font-body">{t("emailNote")}</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-main/40 mt-1 flex-shrink-0" />
                <p className="text-main/70 text-sm font-body">{t("locationNote")}</p>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-10 text-center"
          >
            <a
              href={localePrefix || "/"}
              className="inline-block px-10 py-4 bg-main text-ink font-cta uppercase tracking-[0.28em] text-xs hover:bg-main/90 transition-colors"
            >
              {t("backToHome")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  const t = useTranslations("common");

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-ink flex items-center justify-center">
          <p className="text-main font-body">{t("loading")}</p>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
