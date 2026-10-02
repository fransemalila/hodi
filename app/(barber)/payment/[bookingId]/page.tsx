"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Smartphone, Phone } from "lucide-react";
import { Button, Input } from "@/components/barber/ui";
import { PageHeader, Protected } from "@/components/barber/shell";
import { useI18n } from "@/lib/i18n";
import { isValidTzPhone, normalizePhone, useStore } from "@/lib/store";
import { serviceById } from "@/lib/mock-data";
import { localized, tzs } from "@/lib/format";
import { PAYMENT_OPTIONS } from "@/lib/payments";
import type { PaymentMethod } from "@/lib/types";

type Phase = "select" | "push" | "done";

export default function PaymentPage({ params }: { params: { bookingId: string } }) {
  return (
    <Protected>
      <PaymentScreen id={params.bookingId} />
    </Protected>
  );
}

function PaymentScreen({ id }: { id: string }) {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { bookings, profile, payBooking } = useStore();
  const booking = bookings.find((b) => b.id === id && b.customerPhone === profile.phone);

  const [method, setMethod] = useState<PaymentMethod>(booking?.paymentMethod ?? "mpesa");
  const [payer, setPayer] = useState(profile.phone.replace(/^\+255\s?/, ""));
  const [phase, setPhase] = useState<Phase>("select");

  // Already settled (e.g. cash marked received by the barber): skip ahead.
  useEffect(() => {
    if (booking?.paymentStatus === "paid" && phase === "select") {
      router.replace(booking.review ? `/receipt/${booking.id}` : `/rating/${booking.id}`);
    }
  }, [booking, phase, router]);

  if (!booking) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-gray-600">{t("bookingNotFound")}</p>
        <Button onClick={() => router.push("/home")} className="h-12 rounded-full bg-[#0F3D2E] px-6 text-white">
          {t("backHome")}
        </Button>
      </div>
    );
  }

  const service = serviceById(booking.serviceId);
  const option = PAYMENT_OPTIONS.find((o) => o.id === method)!;
  const payerOk = !option.mobileMoney || isValidTzPhone(payer);

  const pay = () => {
    if (!payerOk) return;
    if (!option.mobileMoney) {
      payBooking(booking.id, "cash");
      setPhase("done");
      setTimeout(() => router.replace(`/rating/${booking.id}`), 1200);
      return;
    }
    // Simulated STK push: the customer approves on their handset.
    setPhase("push");
    setTimeout(() => {
      payBooking(booking.id, method, normalizePhone(payer));
      setPhase("done");
      setTimeout(() => router.replace(`/rating/${booking.id}`), 1200);
    }, 3200);
  };

  if (phase !== "select") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 text-center">
        {phase === "push" ? (
          <>
            <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#C9A227]/30" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#0F3D2E]">
                <Smartphone className="h-11 w-11 text-[#C9A227]" />
              </div>
            </div>
            <h1 className="mb-3 text-2xl font-bold text-[#0F3D2E]">{t("processing")}</h1>
            <p className="mb-2 text-gray-600">{t("checkPhone")}</p>
            <p className="font-semibold text-[#0F3D2E]">
              {option.name} · {normalizePhone(payer)}
            </p>
            <p className="mt-6 text-3xl font-bold text-[#0F3D2E]">{tzs(booking.total)}</p>
          </>
        ) : (
          <>
            <div className="mb-6 flex h-24 w-24 animate-fade-up items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-[#0F3D2E]">{t("paymentSuccess")}</h1>
            <p className="text-3xl font-bold text-[#0F3D2E]">{tzs(booking.total)}</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <PageHeader title={t("payment")} />

      <div className="flex-1 space-y-5 px-6 py-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">{t("paymentSummary")}</h2>
          <div className="mb-4 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>{localized(service.name, lang)}</span>
              <span className="font-medium">{tzs(booking.servicePrice)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>{t("bookingCharge")}</span>
              <span className="font-medium">{tzs(booking.bookingCharge)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-lg font-bold text-[#0F3D2E]">{t("totalAmount")}</span>
            <span className="text-2xl font-bold text-[#0F3D2E]">{tzs(booking.total)}</span>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#0F3D2E]">{t("selectPaymentMethod")}</h2>
          <div className="space-y-3">
            {PAYMENT_OPTIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => setMethod(o.id)}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                  method === o.id ? "border-[#0F3D2E] bg-[#0F3D2E]/5" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-extrabold text-white ${o.tile}`}>{o.short}</div>
                <span className="flex-1 text-left font-semibold text-gray-700">{o.id === "cash" ? t("cashLabel") : o.name}</span>
                {method === o.id && <CheckCircle2 className="h-6 w-6 text-[#0F3D2E]" />}
              </button>
            ))}
          </div>

          {option.mobileMoney && (
            <div className="mt-5 animate-fade-up">
              <label htmlFor="payer" className="mb-2 block text-sm text-gray-600">
                {t("mobileMoneyNumber")}
              </label>
              <div className="flex gap-3">
                <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 font-medium text-[#0F3D2E]">+255</div>
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="payer"
                    type="tel"
                    inputMode="numeric"
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className={`h-12 rounded-xl pl-11 ${payerOk ? "border-gray-200" : "border-rose-400"}`}
                  />
                </div>
              </div>
              {!payerOk && <p className="mt-2 text-sm text-rose-600">{t("invalidPhone")}</p>}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-[#C9A227]/10 p-5">
          <h3 className="mb-2 font-semibold text-[#0F3D2E]">{t("howToPay")}</h3>
          {option.mobileMoney ? (
            <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700">
              <li>{t("pay1")}</li>
              <li>{t("pay2")}</li>
              <li>{t("pay3")}</li>
              <li>{t("pay4")}</li>
            </ol>
          ) : (
            <p className="text-sm text-gray-700">{t("cashHint")}</p>
          )}
        </section>

        <section className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-[#0F3D2E]">{t("securePayment")}</h3>
            <p className="text-sm text-gray-600">{t("secureDesc")}</p>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 shadow-lg">
        <Button
          onClick={pay}
          disabled={!payerOk}
          className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90 disabled:opacity-50"
        >
          {option.mobileMoney ? `${t("payNow")} ${tzs(booking.total)}` : t("cashPaid")}
        </Button>
      </div>
    </div>
  );
}
