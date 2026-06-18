/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Copy, Check, ChevronDown, ChevronUp, Smartphone, QrCode, Loader2, CreditCard } from "lucide-react";
import { useTranslations } from 'next-intl';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { withLocalePath } from "@/lib/localePath";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BankUrl {
  name: string;
  description: string;
  logo: string;
  link: string;
}

interface PaymentSessionDetails {
  reservationId: string;
  amountMnt: number;
  totalAmountMnt: number;
  currency: string;
  guestName: string;
  nights: number;
  expiresAt: number;
}

type PaymentMethod = "stripe" | "qpay";

/** Manual bank transfer (alternative to QPay QR) */
const MANUAL_TRANSFER_ACCOUNT = "MN180019009030008730";
const MANUAL_TRANSFER_ACCOUNT_NAME = "Г. Энэрзаяа";

function StripePaymentForm({ 
  amount, 
  bookingId, 
  guestName, 
  nights,
  totalAmount,
  paymentSession,
  returnPathPrefix,
  paymentLocale,
  editorialFont,
  onSuccess 
}: { 
  amount: string; 
  bookingId: string; 
  guestName: string;
  nights: string;
  totalAmount?: string;
  paymentSession: string;
  returnPathPrefix: string;
  paymentLocale: "en" | "mn";
  editorialFont: string;
  onSuccess: (paymentIntentId: string) => Promise<void> | void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const confirmReturn = new URLSearchParams({
        session: paymentSession,
        success: "true",
        source: "stripe",
      });

      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${returnPathPrefix}/payment?${confirmReturn.toString()}`,
        },
        redirect: "if_required",
      });

      if (submitError) {
        setError(submitError.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        await onSuccess(paymentIntent.id);
      } else if (paymentIntent) {
        setError(`Payment status: ${paymentIntent.status}`);
      } else {
        setError("Payment could not be verified. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formattedAmount = amount ? parseInt(amount).toLocaleString() : "0";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface-alt/10 rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-main/60 text-sm font-body">Booking Reference</span>
          <span className="text-main font-medium font-body">{bookingId}</span>
        </div>
        {guestName && (
          <div className="flex justify-between">
            <span className="text-main/60 text-sm font-body">Guest Name</span>
            <span className="text-main font-medium font-body">{guestName}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-main/60 text-sm font-body">{nights} {parseInt(nights) !== 1 ? 'nights' : 'night'}</span>
          <span className={`text-main ${editorialFont} italic text-xl`}>{formattedAmount} MNT</span>
        </div>
        {totalAmount && parseInt(totalAmount, 10) > parseInt(amount || "0", 10) && (
          <p className="text-main/50 text-xs font-body pt-2 border-t border-main/10">
            {paymentLocale === "mn"
              ? `Урьдчилгаа. Ирэхэд ${(parseInt(totalAmount, 10) - parseInt(amount, 10)).toLocaleString()} ₮ төлнө.`
              : `Deposit today. Balance ${(parseInt(totalAmount, 10) - parseInt(amount, 10)).toLocaleString()} MNT due on arrival.`}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl p-4">
        <PaymentElement 
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-300 text-sm text-center font-body">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3.5 font-cta uppercase tracking-[0.28em] text-xs transition-colors bg-main text-ink hover:bg-main/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay Now
          </>
        )}
      </button>
    </form>
  );
}

function PaymentContent() {
  const t = useTranslations('payment');
  const tBooking = useTranslations('booking');
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const currentLocale = pathname.startsWith('/mn') ? 'mn' : 'en';
  const localePrefix = withLocalePath(currentLocale, "/");
  const editorialFont = currentLocale === 'mn' ? 'font-editorial-mn' : 'font-editorial-en';
  
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [nights, setNights] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [bankUrls, setBankUrls] = useState<BankUrl[]>([]);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    currentLocale === "mn" ? "qpay" : "stripe"
  );
  const [copied, setCopied] = useState(false);
  const [manualExpanded, setManualExpanded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [bookingTotal, setBookingTotal] = useState("");
  const [fromCheckout, setFromCheckout] = useState(false);
  const [paymentSession, setPaymentSession] = useState("");
  const [sessionLoading, setSessionLoading] = useState(true);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [stripeLoading, setStripeLoading] = useState(false);
  const [invoiceToken, setInvoiceToken] = useState("");
  
  const hasAutoGenerated = useRef(false);
  const hasHandledStripeReturn = useRef(false);

  const selectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setError("");
    setPaymentStatus("");

    if (method === "stripe") {
      setQrCode("");
      setInvoiceId("");
      setInvoiceToken("");
      setBankUrls([]);
      hasAutoGenerated.current = false;
    } else {
      setClientSecret("");
    }
  };

  const paymentMethodSelector = (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-main/20 mb-5 grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => selectPaymentMethod("stripe")}
        className={`py-3 px-3 flex items-center justify-center gap-2 font-cta uppercase tracking-[0.22em] text-[10px] transition-colors ${
          paymentMethod === "stripe"
            ? "bg-main text-ink"
            : "text-main/65 hover:bg-white/[0.06]"
        }`}
      >
        <CreditCard className="w-4 h-4" />
        {currentLocale === "mn" ? "Карт" : "Card"}
      </button>
      <button
        type="button"
        onClick={() => selectPaymentMethod("qpay")}
        className={`py-3 px-3 flex items-center justify-center gap-2 font-cta uppercase tracking-[0.22em] text-[10px] transition-colors ${
          paymentMethod === "qpay"
            ? "bg-main text-ink"
            : "text-main/65 hover:bg-white/[0.06]"
        }`}
      >
        <QrCode className="w-4 h-4" />
        QPay
      </button>
    </div>
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const urlSession = searchParams.get("session") || "";
    const success = searchParams.get("success");
    const paymentIntentId =
      searchParams.get("payment_intent") || searchParams.get("paymentIntentId");

    if (!urlSession) {
      setSessionLoading(false);
      setFromCheckout(false);
      setError(
        currentLocale === "mn"
          ? "Төлбөрийн холбоос буруу эсвэл хугацаа дууссан байна."
          : "This payment link is invalid or expired."
      );
      return;
    }

    let cancelled = false;
    setPaymentSession(urlSession);
    setSessionLoading(true);
    setError("");

    async function loadPaymentSession() {
      try {
        const response = await fetch("/api/payment/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session: urlSession }),
        });
        const data = (await response.json()) as
          | (PaymentSessionDetails & { success: true })
          | { error?: string };

        if (!response.ok || !("success" in data)) {
          const message =
            "error" in data && typeof data.error === "string"
              ? data.error
              : "Payment session could not be verified";
          throw new Error(message);
        }
        if (cancelled) return;

        setBookingId(data.reservationId);
        setAmount(String(data.amountMnt));
        setBookingTotal(String(data.totalAmountMnt));
        setNights(String(data.nights));
        setGuestName(data.guestName);
        setFromCheckout(true);
        setTermsAccepted(true);

        if (success === "true" && paymentIntentId && !hasHandledStripeReturn.current) {
          hasHandledStripeReturn.current = true;
          const confirmResponse = await fetch("/api/stripe/confirm-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentIntentId,
              session: urlSession,
            }),
          });
          const confirmData = await confirmResponse.json();
          if (!confirmResponse.ok) {
            throw new Error(
              confirmData.error || "Payment verified but reservation confirmation failed"
            );
          }

          const confirmParams = new URLSearchParams({
            bookingId: data.reservationId,
            guestName: data.guestName,
            nights: String(data.nights),
            amount: String(data.amountMnt),
            totalAmount: String(data.totalAmountMnt),
            source: "stripe",
            paymentIntentId,
            verified: "1",
          });
          router.replace(`${localePrefix}/booking/confirmation?${confirmParams.toString()}`);
        }
      } catch (err) {
        if (cancelled) return;
        setFromCheckout(false);
        setError(err instanceof Error ? err.message : "Payment session could not be verified");
      } finally {
        if (!cancelled) setSessionLoading(false);
      }
    }

    void loadPaymentSession();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (paymentMethod === 'qpay' && fromCheckout && paymentSession && bookingId && amount && !hasAutoGenerated.current && !qrCode) {
      hasAutoGenerated.current = true;
      setAutoGenerating(true);
      generateQPayQR();
    }
  }, [paymentMethod, fromCheckout, paymentSession, bookingId, amount, qrCode]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (paymentMethod === 'stripe' && fromCheckout && paymentSession && bookingId && amount && !clientSecret) {
      fetchStripeClientSecret();
    }
  }, [paymentMethod, fromCheckout, paymentSession, bookingId, amount, clientSecret]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const fetchStripeClientSecret = async () => {
    setStripeLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: paymentSession,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialise payment");
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setStripeLoading(false);
    }
  };

  const generateQPayQR = async () => {
    if (!paymentSession) {
      setError(
        currentLocale === "mn"
          ? "Төлбөрийн холбоос буруу байна."
          : "Payment session is missing."
      );
      setAutoGenerating(false);
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAutoGenerating(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/qpay/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: paymentSession,
          description: `Dalai Eej Resort - Booking ${bookingId}`,
          siteOrigin:
            typeof window !== "undefined"
              ? window.location.origin
              : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate payment");
      }

      setQrCode(data.qrCode);
      setInvoiceId(data.invoiceId);
      setInvoiceToken(data.invoiceToken || "");
      setBankUrls(data.bankUrls || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setAutoGenerating(false);
    }
  };

  const generateQR = async () => {
    if (!paymentSession) {
      setError(
        currentLocale === "mn"
          ? "Төлбөрийн холбоос буруу байна."
          : "Payment session is missing."
      );
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    setQrCode("");
    setBankUrls([]);

    try {
      await generateQPayQR();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const goToConfirmation = (
    source: "qpay" | "stripe",
    extraParams?: Record<string, string>
  ) => {
    const confirmParams = new URLSearchParams();
    if (bookingId) confirmParams.set("bookingId", bookingId);
    if (guestName) confirmParams.set("guestName", guestName);
    if (nights) confirmParams.set("nights", nights);
    if (amount) confirmParams.set("amount", amount);
    if (bookingTotal) confirmParams.set("totalAmount", bookingTotal);
    confirmParams.set("source", source);
    Object.entries(extraParams ?? {}).forEach(([key, value]) => {
      if (value) confirmParams.set(key, value);
    });
    router.replace(`${localePrefix}/booking/confirmation?${confirmParams.toString()}`);
  };

  const confirmStripePayment = async (paymentIntentId: string) => {
    const response = await fetch("/api/stripe/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId,
        session: paymentSession,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Payment verified but reservation confirmation failed");
    }

    goToConfirmation("stripe", {
      paymentIntentId,
      verified: "1",
    });
  };

  const pollCheckPayment = async (): Promise<"paid" | "pending" | "error"> => {
    if (!paymentSession || !invoiceToken) {
      setPaymentStatus(
        currentLocale === "mn"
          ? "Төлбөрийн мэдээлэл дутуу байна. QR-г дахин үүсгэнэ үү."
          : "Payment details are incomplete. Please generate a new QR."
      );
      return "error";
    }

    try {
      const response = await fetch("/api/qpay/check-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          session: paymentSession,
          invoiceToken,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setPaymentStatus(data.error || "Payment check failed. Please try again.");
        return "error";
      }
      if (data.paid) {
        goToConfirmation("qpay", {
          verified: data.reservationConfirmed ? "1" : "0",
        });
        return "paid";
      }
      return "pending";
    } catch {
      return "error";
    }
  };

  const checkPaymentStatus = async () => {
    if (!invoiceToken) return;
    
    setCheckingStatus(true);
    setPaymentStatus(currentLocale === 'mn' 
      ? "Төлбөрийн статусыг шалгаж байна..."
      : "Checking payment status...");

    const result = await pollCheckPayment();

    if (result === "error") {
      setPaymentStatus(currentLocale === 'mn' 
        ? "Статус шалгахад алдаа гарлаа. Дахин оролдоно уу."
        : "Error checking status. Please try again.");
    } else if (result === "pending") {
      setPaymentStatus(currentLocale === 'mn' 
        ? "Төлбөр хараахан баталгаажаагүй байна. Банкны апп-аас төлбөрөө хийнэ үү."
        : "Payment not yet confirmed. Please complete the payment in your bank app.");
    }
    setCheckingStatus(false);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!invoiceToken) return;

    let pollCount = 0;
    const maxPolls = 120;
    let consecutiveErrors = 0;

    const interval = setInterval(async () => {
      pollCount++;
      if (pollCount > maxPolls) {
        clearInterval(interval);
        setPaymentStatus(currentLocale === 'mn' 
          ? "Автомат шалгалтын хугацаа дууссан. \"Төлбөр шалгах\" товч дарна уу."
          : "Auto-check timed out. Please click \"Check Payment\" manually.");
        return;
      }

      const result = await pollCheckPayment();
      if (result === "paid") {
        clearInterval(interval);
      } else if (result === "error") {
        consecutiveErrors++;
        if (consecutiveErrors >= 5) {
          clearInterval(interval);
          setPaymentStatus(currentLocale === 'mn' 
            ? "Холболтын алдаа. \"Төлбөр шалгах\" товч дарна уу."
            : "Connection error. Please click \"Check Payment\" manually.");
        }
      } else {
        consecutiveErrors = 0;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [invoiceToken]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(MANUAL_TRANSFER_ACCOUNT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedAmount = amount ? parseInt(amount).toLocaleString() : "0";

  const payNowNum = amount ? parseInt(amount, 10) : 0;
  const bookingTotalNum = bookingTotal ? parseInt(bookingTotal, 10) : 0;
  const showPaymentSplit =
    bookingTotalNum > 0 && payNowNum > 0 && bookingTotalNum > payNowNum;
  const balanceOnArrival = showPaymentSplit ? bookingTotalNum - payNowNum : 0;

  if (sessionLoading) {
    return (
      <main className="min-h-screen bg-ink pt-28 md:pt-32 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Loader2 className="w-10 h-10 text-main animate-spin mx-auto mb-4" />
          <h1 className={`${editorialFont} italic text-3xl md:text-[2.25rem] leading-[1.35] text-main mb-2`}>
            {currentLocale === "mn" ? "Төлбөрийн холбоос шалгаж байна" : "Verifying Payment Link"}
          </h1>
          <p className="text-main/60 text-sm font-body">
            {currentLocale === "mn" ? "Түр хүлээнэ үү" : "Please wait a moment"}
          </p>
        </div>
      </main>
    );
  }

  if (!fromCheckout && error) {
    return (
      <main className="min-h-screen bg-ink pt-28 md:pt-32 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`${editorialFont} italic text-3xl md:text-[2.25rem] leading-[1.35] text-main mb-3 pb-1`}>
              {t('title')}
            </h1>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-main/20">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-300 text-sm text-center font-body">{error}</p>
            </div>
            <a
              href={`${localePrefix}/booking`}
              className="block w-full text-center py-3.5 font-cta uppercase tracking-[0.28em] text-xs bg-main text-ink hover:bg-main/90 cursor-pointer transition-colors"
            >
              {currentLocale === "mn" ? "Захиалга руу буцах" : "Return to Booking"}
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (autoGenerating || (paymentMethod === 'qpay' && fromCheckout && loading && !qrCode)) {
    return (
      <main className="min-h-screen bg-ink pt-28 md:pt-32 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`${editorialFont} italic text-3xl md:text-[2.25rem] leading-[1.35] text-main mb-3 pb-1`}>
              {t('title')}
            </h1>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-main/20 text-center">
            <Loader2 className="w-12 h-12 text-main animate-spin mx-auto mb-4" />
            <p className={`text-main ${editorialFont} italic text-xl mb-2`}>
              Төлбөрийн QR үүсгэж байна...
            </p>
            <p className="text-main/60 text-sm font-body">
              Түр хүлээнэ үү
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (paymentMethod === 'stripe' && fromCheckout) {
    if (stripeLoading) {
      return (
        <main className="min-h-screen bg-ink pt-28 md:pt-32 pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className={`${editorialFont} italic text-3xl md:text-[2.25rem] leading-[1.35] text-main mb-3 pb-1`}>
                {currentLocale === "mn" ? "Аюулгүй төлбөр" : "Secure Payment"}
              </h1>
            </div>
            {paymentMethodSelector}
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-main/20 text-center">
              <Loader2 className="w-12 h-12 text-main animate-spin mx-auto mb-4" />
              <p className={`text-main ${editorialFont} italic text-xl mb-2`}>
                Initialising Payment...
              </p>
              <p className="text-main/60 text-sm font-body">
                Please wait a moment
              </p>
            </div>
          </div>
        </main>
      );
    }

    if (error && !clientSecret) {
      return (
        <main className="min-h-screen bg-ink pt-28 md:pt-32 pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className={`${editorialFont} italic text-3xl md:text-[2.25rem] leading-[1.35] text-main mb-3 pb-1`}>
                {currentLocale === "mn" ? "Аюулгүй төлбөр" : "Secure Payment"}
              </h1>
            </div>
            {paymentMethodSelector}
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-main/20">
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm text-center font-body">{error}</p>
              </div>
              <button
                type="button"
                onClick={fetchStripeClientSecret}
                className="w-full py-3.5 font-cta uppercase tracking-[0.28em] text-xs bg-main text-ink hover:bg-main/90 cursor-pointer transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      );
    }

    if (clientSecret) {
      return (
        <main className="min-h-screen bg-ink pt-28 md:pt-32 pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className={`${editorialFont} italic text-3xl md:text-[2.25rem] leading-[1.35] text-main mb-3 pb-1`}>
                {currentLocale === "mn" ? "Аюулгүй төлбөр" : "Secure Payment"}
              </h1>
              <p className="font-body text-main/70 text-sm">
                {currentLocale === "mn"
                  ? "Захиалгаа картаар аюулгүй төлнө үү"
                  : "Complete your booking with a secure card payment"}
              </p>
            </div>
            {paymentMethodSelector}
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-main/20">
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#95794E",
                      borderRadius: "8px",
                    },
                  },
                }}
              >
                <StripePaymentForm 
                  amount={amount}
                  bookingId={bookingId}
                  guestName={guestName}
                  nights={nights}
                  totalAmount={bookingTotal || undefined}
                  paymentSession={paymentSession}
                  returnPathPrefix={localePrefix}
                  paymentLocale={currentLocale}
                  editorialFont={editorialFont}
                  onSuccess={confirmStripePayment}
                />
              </Elements>
            </div>

            <div className="mt-8 text-center">
              <a
                href={localePrefix}
                className="text-main/50 text-sm hover:text-main transition-colors font-body"
              >
                &larr; {tBooking('backToHome')}
              </a>
            </div>
          </div>
        </main>
      );
    }
  }

  return (
    <main className="min-h-screen bg-ink pt-28 md:pt-32 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`${editorialFont} italic text-3xl md:text-[2.25rem] leading-[1.35] text-main mb-3 pb-1`}>
            {t('title')}
          </h1>
          <p className="font-body text-main/70 text-sm">
            {t('subtitle')}
          </p>
        </div>
        {fromCheckout && paymentMethodSelector}

        {!qrCode && !loading ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-main/20">
            {fromCheckout && error ? (
              <div className="space-y-5">
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-300 text-sm text-center font-body">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => generateQPayQR()}
                  className="w-full py-3.5 font-cta uppercase tracking-[0.28em] text-xs bg-main text-ink hover:bg-main/90 cursor-pointer transition-colors"
                >
                  {currentLocale === 'mn' ? 'Дахин оролдох' : 'Try Again'}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block font-cta uppercase text-[10px] tracking-[0.22em] text-main/50 mb-2">
                    {t('bookingRef')}
                  </label>
                  <input
                    type="text"
                    value={bookingId}
                    readOnly
                    placeholder={t('enterBookingId')}
                    className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors placeholder:text-main/30"
                  />
                </div>

                <div>
                  <label className="block font-cta uppercase text-[10px] tracking-[0.22em] text-main/50 mb-2">
                    {t('amount')}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    readOnly
                    placeholder={t('enterAmount')}
                    className="w-full bg-transparent border-0 border-b border-main/30 focus:border-main text-main font-body py-2 focus:outline-none transition-colors placeholder:text-main/30"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center py-2 font-body">
                    {error}
                  </div>
                )}

                <div className="flex items-start gap-3 py-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-main/50 bg-transparent text-main focus:ring-surface-alt focus:ring-offset-0 cursor-pointer accent-surface-alt"
                  />
                  <label htmlFor="terms" className="text-main/80 text-sm font-body cursor-pointer leading-relaxed">
                    {currentLocale === 'mn' 
                      ? <>Би <a href={`${localePrefix}/terms`} className="underline hover:text-white transition-colors">Үйлчилгээний нөхцөл</a> болон <a href={`${localePrefix}/terms`} className="underline hover:text-white transition-colors">Цуцлалтын бодлого</a>-г зөвшөөрч байна</>
                      : <>I agree to the <a href={`${localePrefix}/terms`} className="underline hover:text-white transition-colors">Terms & Conditions</a> and <a href={`${localePrefix}/terms`} className="underline hover:text-white transition-colors">Cancellation Policy</a></>
                    }
                  </label>
                </div>

                <button
                  onClick={generateQR}
                  disabled={loading || !termsAccepted}
                  className={`w-full py-3.5 font-cta uppercase tracking-[0.28em] text-xs transition-colors ${
                    termsAccepted 
                      ? 'bg-main text-ink hover:bg-main/90 cursor-pointer' 
                      : 'bg-main/10 text-main/40 cursor-not-allowed'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? t('generating') : t('generatePayment')}
                </button>
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-main/20 text-center">
            <Loader2 className="w-8 h-8 text-main animate-spin mx-auto mb-3" />
            <p className="text-main font-body">{t('generating')}</p>
          </div>
        ) : (
          <>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-main/20 mb-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-main/70 text-xs font-body">{t('bookingRef')}</p>
                  <p className={`text-main ${editorialFont} italic`}>{bookingId}</p>
                </div>
                <div className="text-right">
                  <p className="text-main/70 text-xs font-body">{nights} {parseInt(nights) !== 1 ? tBooking('nights') : tBooking('night')}</p>
                  <p className="text-main/50 text-xs font-body mb-0.5">
                    {showPaymentSplit
                      ? (currentLocale === "mn" ? "Урьдчилгаа" : "Deposit")
                      : (currentLocale === "mn" ? "Дүн" : "Amount")}
                  </p>
                  <p className={`text-main ${editorialFont} italic text-xl`}>{formattedAmount} MNT</p>
                </div>
              </div>
              {showPaymentSplit && (
                <div className="mt-3 pt-3 border-t border-main/10 space-y-2 text-sm font-body">
                  <div className="flex justify-between text-main/80">
                    <span>{currentLocale === "mn" ? "Захиалгын нийт" : "Booking total"}</span>
                    <span>{bookingTotalNum.toLocaleString()} MNT</span>
                  </div>
                  <div className="flex justify-between text-main/80">
                    <span>{currentLocale === "mn" ? "Ирэхэд төлөх" : "Due on arrival"}</span>
                    <span>{balanceOnArrival.toLocaleString()} MNT</span>
                  </div>
                </div>
              )}
            </div>

            {bankUrls.length > 0 && (
              <div className="block md:hidden bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-main/20 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="w-5 h-5 text-main" />
                  <h2 className={`${editorialFont} italic text-lg text-main`}>{t('payWithApp')}</h2>
                </div>
                <p className="text-main/60 text-sm mb-4 font-body">
                  {t('tapBank')}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {bankUrls.map((bank, index) => (
                    <a
                      key={index}
                      href={bank.link}
                      className="flex flex-col items-center p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-main/10 hover:border-main/30"
                    >
                      {bank.logo ? (
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          className="w-12 h-12 object-contain mb-2 rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-surface-alt/20 rounded-lg mb-2 flex items-center justify-center">
                          <span className="text-main text-lg font-bold">
                            {bank.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-main text-xs text-center font-medium line-clamp-2 font-body">
                        {bank.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-main/20 mb-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <QrCode className="w-5 h-5 text-main" />
                <h2 className={`${editorialFont} italic text-lg text-main`}>{t('scanQR')}</h2>
              </div>
              <p className="text-main/60 text-sm mb-4 text-center hidden md:block font-body">
                {t('scanWithApp')}
              </p>
              <p className="text-main/60 text-sm mb-4 text-center md:hidden font-body">
                {t('scanOtherDevice')}
              </p>
              
              <div className="flex flex-col items-center">
                <div className="bg-white p-3 rounded-xl inline-block">
                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="QPay QR Code"
                    className="w-40 h-40 md:w-56 md:h-56"
                  />
                </div>
              </div>

              {invoiceId && (
                <p className="text-main/40 text-xs text-center mt-3 font-body">
                  Invoice: {invoiceId}
                </p>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-main/20 mb-4 overflow-hidden">
              <button
                onClick={() => setManualExpanded(!manualExpanded)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <div>
                  <h2 className={`${editorialFont} italic text-lg text-main`}>{t('manualTransfer')}</h2>
                  <p className="text-main/60 text-sm font-body">{t('alternativePayment')}</p>
                </div>
                {manualExpanded ? (
                  <ChevronUp className="w-5 h-5 text-main/70" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-main/70" />
                )}
              </button>
              
              {manualExpanded && (
                <div className="px-5 pb-5 space-y-4">
                  <div className="bg-surface-alt/10 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-main/60 text-xs uppercase tracking-wider font-body">{t('bank')}</p>
                      <p className="text-main font-medium font-body">
                        {currentLocale === "mn" ? "Транс Банк" : "Trans Bank"}
                      </p>
                    </div>
                    <div>
                      <p className="text-main/60 text-xs uppercase tracking-wider font-body">{t('accountNumber')}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-main font-mono text-sm sm:text-base break-all">{MANUAL_TRANSFER_ACCOUNT}</p>
                        <button
                          onClick={copyAccountNumber}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy account number"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-bark" />
                          ) : (
                            <Copy className="w-4 h-4 text-main/70" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-main/60 text-xs uppercase tracking-wider font-body">{t('accountName')}</p>
                      <p className="text-main font-medium font-body">{MANUAL_TRANSFER_ACCOUNT_NAME}</p>
                    </div>
                    <div>
                      <p className="text-main/60 text-xs uppercase tracking-wider font-body">{t('amount')}</p>
                      <p className={`text-main ${editorialFont} italic text-xl`}>{formattedAmount} MNT</p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
                    <p className="text-amber-200 text-sm font-body">
                      <strong>Important:</strong> {t('importantMemo')}: {bookingId}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={checkPaymentStatus}
                disabled={checkingStatus}
                className="w-full py-3.5 border border-main/40 text-main font-cta uppercase tracking-[0.28em] text-xs hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50"
              >
                {checkingStatus ? t('checking') : t('checkStatus')}
              </button>

              {paymentStatus && (
                <div className="text-main/70 text-sm text-center py-2 font-body">
                  {paymentStatus}
                </div>
              )}

              <button
                onClick={() => {
                  setQrCode("");
                  setInvoiceId("");
                  setInvoiceToken("");
                  setBankUrls([]);
                  setPaymentStatus("");
                  hasAutoGenerated.current = false;
                }}
                className="w-full text-main/50 text-sm hover:text-main transition-colors py-2 font-body"
              >
                {t('generateNew')}
              </button>
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <a
            href={localePrefix}
            className="text-main/50 text-sm hover:text-main transition-colors font-body"
          >
            &larr; {tBooking('backToHome')}
          </a>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-ink py-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-main animate-spin" />
      </main>
    }>
      <PaymentContent />
    </Suspense>
  );
}
