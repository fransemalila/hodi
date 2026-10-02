"use client";

import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { PageHeader, Protected } from "@/components/barber/shell";
import { Wordmark } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { serviceById } from "@/lib/mock-data";
import { formatDateTime, localized, receiptNo, tzs } from "@/lib/format";
import { paymentName } from "@/lib/payments";

export default function ReceiptPage({ params }: { params: { bookingId: string } }) {
  return (
    <Protected>
      <ReceiptScreen id={params.bookingId} />
    </Protected>
  );
}

function ReceiptScreen({ id }: { id: string }) {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { bookings, providers, profile } = useStore();
  const booking = bookings.find((b) => b.id === id && b.customerPhone === profile.phone);

  if (!booking) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-gray-600">{t("bookingNotFound")}</p>
        <Button onClick={() => router.push("/history")} className="h-12 rounded-full bg-[#0F3D2E] px-6 text-white">
          {t("myBookings")}
        </Button>
      </div>
    );
  }

  const barber = providers.find((p) => p.id === booking.providerId)!;
  const service = serviceById(booking.serviceId);
  const paid = booking.paymentStatus === "paid";
  const grand = booking.total + (booking.tip ?? 0);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50 print:bg-white">
      <div className="print:hidden">
        <PageHeader title={t("receipt")} />
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm print:shadow-none">
          <div className="mb-6 flex items-start justify-between">
            <Wordmark className="h-8 w-auto" />
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${paid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {paid ? t("paid") : t("unpaid")}
            </span>
          </div>

          <dl className="mb-5 grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-gray-500">{t("receiptNo")}</dt>
            <dd className="text-right font-mono font-semibold text-[#0F3D2E]">{receiptNo(booking.id)}</dd>
            <dt className="text-gray-500">{t("date")}</dt>
            <dd className="text-right font-medium text-gray-800">{formatDateTime(booking.paidAt ?? booking.createdAt, lang)}</dd>
            <dt className="text-gray-500">{t("customer")}</dt>
            <dd className="text-right font-medium text-gray-800">{booking.customerName}</dd>
            <dt className="text-gray-500">{t("barber")}</dt>
            <dd className="text-right font-medium text-gray-800">{barber.name}</dd>
            <dt className="text-gray-500">{t("location")}</dt>
            <dd className="text-right font-medium text-gray-800">{booking.location.landmark}</dd>
            {paid && (
              <>
                <dt className="text-gray-500">{t("paidWith")}</dt>
                <dd className="text-right font-medium text-gray-800">
                  {paymentName(booking.paymentMethod, lang)}
                  {booking.payerPhone && <span className="block text-xs text-gray-500">{booking.payerPhone}</span>}
                </dd>
              </>
            )}
          </dl>

          <div className="space-y-2 border-t border-dashed border-gray-300 pt-4 text-sm">
            <div className="flex justify-between text-gray-700">
              <span>{localized(service.name, lang)}</span>
              <span>{tzs(booking.servicePrice)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>{t("bookingCharge")}</span>
              <span>{tzs(booking.bookingCharge)}</span>
            </div>
            {booking.tip ? (
              <div className="flex justify-between text-gray-700">
                <span>{t("tip")}</span>
                <span>{tzs(booking.tip)}</span>
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="font-bold text-[#0F3D2E]">{t("total")}</span>
            <span className="text-2xl font-bold text-[#0F3D2E]">{tzs(grand)}</span>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">{t("thanksForChoosing")}</p>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6 print:hidden">
        <Button onClick={() => window.print()} className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90">
          <Printer className="h-5 w-5" /> {t("print")}
        </Button>
      </div>
    </div>
  );
}
