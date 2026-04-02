"use client";

import { useState, useEffect, useRef } from "react";
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

  const bookingId = searchParams.get("bookingId") || searchParams.get("reservation_id") || "";
  const guestName = searchParams.get("guestName") || "";
  const nights = searchParams.get("nights") || "";
  const amount = searchParams.get("amount") || "";
  const checkin = searchParams.get("checkin") || "";
  const checkout = searchParams.get("checkout") || "";
  const source = searchParams.get("source") || "";

  const hasConfirmed = useRef(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (hasConfirmed.current) return;
    if (!bookingId || bookingId.startsWith("booking-")) {
      setConfirmed(true);
      return;
    }

    if (source === "stripe") {
      hasConfirmed.current = true;
      fetch("/api/cloudbeds/confirm-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: bookingId }),
      })
        .then(() => setConfirmed(true))
        .catch(() => setConfirmed(true));
      return;
    }

    setConfirmed(true);
  }, [bookingId, source]);

  const formattedAmount = amount ? parseInt(amount).toLocaleString() : "";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(currentLocale === "mn" ? "mn-MN" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <main className="min-h-screen bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 to-leaf/60 pointer-events-none" />

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
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" strokeWidth={1.5} />
            </motion.div>

            <h1 className="font-serif text-4xl md:text-5xl text-main mb-4">
              {t("title")}
            </h1>
            <p className="font-sans text-main/70 text-lg max-w-md mx-auto">
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
                <p className="text-main/50 text-xs uppercase tracking-widest font-sans mb-2">
                  {t("bookingReference")}
                </p>
                <p className="font-serif text-3xl text-main tracking-wide">
                  {bookingId}
                </p>
              </div>
            )}

            <div className="px-8 py-6 space-y-4">
              {guestName && (
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-main/40 flex-shrink-0" />
                  <span className="text-main/50 text-sm font-sans">{t("guest")}</span>
                  <span className="text-main font-medium ml-auto">{guestName}</span>
                </div>
              )}

              {(checkin || checkout) && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-main/40 flex-shrink-0" />
                  <span className="text-main/50 text-sm font-sans">{t("dates")}</span>
                  <span className="text-main font-medium ml-auto">
                    {checkin && formatDate(checkin)}
                    {checkin && checkout && " — "}
                    {checkout && formatDate(checkout)}
                  </span>
                </div>
              )}

              {nights && (
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-main/40 flex-shrink-0" />
                  <span className="text-main/50 text-sm font-sans">{t("duration")}</span>
                  <span className="text-main font-medium ml-auto">
                    {nights} {parseInt(nights) !== 1 ? t("nights") : t("night")}
                  </span>
                </div>
              )}

              {formattedAmount && (
                <div className="flex items-center gap-3 pt-3 border-t border-main/10">
                  <span className="text-main/50 text-sm font-sans">{t("totalPaid")}</span>
                  <span className="text-main font-serif text-xl ml-auto">
                    {formattedAmount} MNT
                  </span>
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
            <h2 className="font-serif text-lg text-main mb-4">{t("whatNext")}</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-main/40 mt-1 flex-shrink-0" />
                <p className="text-main/70 text-sm font-sans">{t("emailNote")}</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-main/40 mt-1 flex-shrink-0" />
                <p className="text-main/70 text-sm font-sans">{t("locationNote")}</p>
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
              className="inline-block px-10 py-4 bg-surface-alt text-leaf font-serif uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
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
          <p className="text-main">{t("loading")}</p>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
