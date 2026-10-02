"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, MessageSquare, Navigation, MapPin, Scissors, CheckCircle2, XCircle, CalendarClock, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { Protected, ProviderPhoto, Sheet } from "@/components/barber/shell";
import { LiveMap } from "@/components/barber/LiveMap";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useBookingSimulation } from "@/lib/simulation";
import { serviceById } from "@/lib/mock-data";
import { formatWhen, localized, tzs } from "@/lib/format";
import { STATUS_LABEL, STATUS_TITLE } from "@/lib/status";
import type { BookingStatus } from "@/lib/types";

const STEPS: BookingStatus[] = ["accepted", "on_the_way", "arrived", "in_progress", "completed"];
const CANCELLABLE: BookingStatus[] = ["pending", "accepted", "on_the_way"];

export default function TrackingPage({ params }: { params: { bookingId: string } }) {
  return (
    <Protected>
      <TrackingScreen id={params.bookingId} />
    </Protected>
  );
}

function TrackingScreen({ id }: { id: string }) {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { bookings, providers, profile, cancelBooking, advanceStatus } = useStore();
  const booking = bookings.find((b) => b.id === id && b.customerPhone === profile.phone);
  const { progress, etaMin } = useBookingSimulation(booking);
  const [confirmCancel, setConfirmCancel] = useState(false);

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

  const barber = providers.find((p) => p.id === booking.providerId)!;
  const service = serviceById(booking.serviceId);
  const status = booking.status;
  const scheduledWaiting = booking.scheduledFor !== "now" && status === "accepted";
  const stepIndex = STEPS.indexOf(status);
  const when = booking.scheduledFor === "now" ? t("rightNow") : formatWhen(booking.scheduledFor, lang);

  const headline =
    status === "on_the_way" ? `${etaMin} ${t("minutes")}` :
    status === "arrived" ? t("readyToServe") :
    status === "in_progress" ? t("enjoy") :
    status === "accepted" ? (scheduledWaiting ? when : t("getsReady")) :
    status === "completed" ? tzs(booking.total) :
    status === "cancelled" ? "" : "…";

  const StatusIcon =
    status === "pending" ? Search :
    status === "on_the_way" ? Navigation :
    status === "arrived" ? MapPin :
    status === "in_progress" ? Scissors :
    status === "completed" ? CheckCircle2 :
    status === "cancelled" ? XCircle : CalendarClock;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      {/* Map */}
      <div className="relative h-[44vh] min-h-[280px] shrink-0">
        <LiveMap provider={barber} progress={progress} showRoute={status !== "cancelled"} />

        {status === "pending" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F3D2E]/30 backdrop-blur-[1px]">
            <span className="relative flex h-24 w-24 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#C9A227]/40" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#0F3D2E] shadow-xl">
                <Search className="h-7 w-7 text-[#C9A227]" />
              </span>
            </span>
          </div>
        )}

        <button
          onClick={() => router.push("/home")}
          aria-label={t("back")}
          className="absolute left-5 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
        >
          <ArrowLeft className="h-5 w-5 text-[#0F3D2E]" />
        </button>

        {/* Status card */}
        <div className="absolute left-5 right-5 top-20 rounded-2xl bg-white p-4 shadow-lg animate-fade-up" key={status}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-0.5 text-sm text-gray-600">{t(scheduledWaiting ? "scheduledTitle" : STATUS_TITLE[status])}</p>
              <p className="truncate text-2xl font-bold text-[#0F3D2E]">{headline}</p>
            </div>
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${status === "cancelled" ? "bg-rose-50" : "bg-[#C9A227]/10"}`}>
              <StatusIcon className={`h-7 w-7 ${status === "cancelled" ? "text-rose-500" : "text-[#C9A227]"}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="relative -mt-6 flex-1 rounded-t-[32px] bg-white px-6 pb-8 pt-6 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300" />

        {/* Progress */}
        {status !== "cancelled" && status !== "pending" && (
          <div className="mb-6">
            <div className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= stepIndex ? "bg-[#0F3D2E]" : "bg-gray-200"}`} />
              ))}
            </div>
            <p className="mt-2 text-xs font-medium text-gray-500">{t(STATUS_LABEL[status])}</p>
          </div>
        )}

        <div className="mb-5 flex items-center gap-4">
          <ProviderPhoto provider={barber} className="h-16 w-16 rounded-2xl text-lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-[#0F3D2E]">{barber.name}</h3>
            <p className="truncate text-sm text-gray-600">{barber.vehicle ?? barber.area}</p>
            <p className="text-xs text-gray-500">★ {barber.rating.toFixed(1)} · {barber.reviewCount} {t("reviews")}</p>
          </div>
          {status !== "cancelled" && status !== "completed" && (
            <div className="flex gap-2">
              <a
                href={`tel:${(barber.phone ?? "").replace(/\s/g, "")}`}
                aria-label={t("callProvider")}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F3D2E] transition-colors hover:bg-[#0F3D2E]/90"
              >
                <Phone className="h-5 w-5 text-white" />
              </a>
              <a
                href={`sms:${(barber.phone ?? "").replace(/\s/g, "")}`}
                aria-label={t("message")}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227] transition-colors hover:bg-[#C9A227]/90"
              >
                <MessageSquare className="h-5 w-5 text-white" />
              </a>
            </div>
          )}
        </div>

        <div className="mb-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-sm">
          <Row label={t("service")} value={localized(service.name, lang)} />
          <Row label={t("time")} value={when} />
          <Row label={t("location")} value={`${booking.location.label} · ${booking.location.landmark}`} />
          <Row label={t("total")} value={tzs(booking.total)} />
        </div>

        <div className="space-y-3">
          {status === "completed" && booking.paymentStatus !== "paid" && (
            <Button onClick={() => router.push(`/payment/${booking.id}`)} className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90">
              {t("proceedToPayment")} · {tzs(booking.total)}
            </Button>
          )}
          {status === "completed" && booking.paymentStatus === "paid" && !booking.review && (
            <Button onClick={() => router.push(`/rating/${booking.id}`)} className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90">
              {t("rateNow")}
            </Button>
          )}
          {scheduledWaiting && (
            <button
              onClick={() => advanceStatus(booking.id, "on_the_way")}
              className="w-full rounded-xl border border-dashed border-[#C9A227] py-3 text-sm font-medium text-[#8a6d12]"
            >
              ▶ Demo: {t("onTheWayTitle")}
            </button>
          )}
          {CANCELLABLE.includes(status) && (
            <Button
              onClick={() => setConfirmCancel(true)}
              className="h-14 w-full rounded-full border-2 border-[#0F3D2E] text-lg text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
            >
              {t("cancelBooking")}
            </Button>
          )}
          {(status === "cancelled" || (status === "completed" && booking.paymentStatus === "paid")) && (
            <Button
              onClick={() => router.push("/home")}
              className="h-14 w-full rounded-full border-2 border-[#0F3D2E] text-lg text-[#0F3D2E] hover:bg-[#0F3D2E]/5"
            >
              {t("backHome")}
            </Button>
          )}
        </div>
      </div>

      <Sheet open={confirmCancel} onClose={() => setConfirmCancel(false)} title={t("cancelBooking")}>
        <p className="mb-6 text-gray-600">{t("cancelConfirm")}</p>
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => setConfirmCancel(false)} className="h-12 rounded-full border-2 border-gray-200 text-gray-700">
            {t("keepBooking")}
          </Button>
          <Button
            onClick={() => {
              cancelBooking(booking.id, "customer");
              setConfirmCancel(false);
            }}
            className="h-12 rounded-full bg-rose-600 text-white hover:bg-rose-700"
          >
            {t("yesCancel")}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-gray-600">{label}</span>
      <span className="text-right font-semibold text-[#0F3D2E]">{value}</span>
    </div>
  );
}
