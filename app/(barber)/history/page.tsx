"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Calendar, MapPin, CalendarX } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { BottomNav, Protected, ProviderPhoto } from "@/components/barber/shell";
import { useI18n } from "@/lib/i18n";
import { ACTIVE_STATUSES, useMyBookings, useStore } from "@/lib/store";
import { serviceById } from "@/lib/mock-data";
import { formatDate, formatWhen, localized } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/status";
import type { Booking } from "@/lib/types";

export default function HistoryPage() {
  return (
    <Protected>
      <HistoryScreen />
    </Protected>
  );
}

function HistoryScreen() {
  const { t } = useI18n();
  const mine = useMyBookings();
  const active = mine.filter((b) => ACTIVE_STATUSES.includes(b.status) || (b.status === "completed" && b.paymentStatus !== "paid"));
  const past = mine.filter((b) => !active.includes(b));
  const [tab, setTab] = useState<"active" | "past">(active.length ? "active" : "past");
  const list = tab === "active" ? active : past;

  const completed = mine.filter((b) => b.status === "completed" && b.paymentStatus === "paid");
  const totalSpent = completed.reduce((sum, b) => sum + b.total + (b.tip ?? 0), 0);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <div className="rounded-b-[32px] bg-[#0F3D2E] px-6 pb-6 pt-12">
        <h1 className="text-2xl font-bold text-white">{t("myBookings")}</h1>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-2xl font-bold text-white">{mine.length}</p>
            <p className="text-xs text-white/70">{t("totalBookings")}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-2xl font-bold text-[#C9A227]">{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-white/70">{t("totalSpent")} (TZS)</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="mb-5 grid grid-cols-2 rounded-full bg-white p-1 shadow-sm">
          {(["active", "past"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full py-2.5 text-sm font-semibold transition ${tab === k ? "bg-[#0F3D2E] text-white" : "text-gray-500"}`}
            >
              {t(k)} {k === "active" && active.length > 0 && `(${active.length})`}
            </button>
          ))}
        </div>

        {list.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl bg-white p-10 text-center shadow-sm">
            <CalendarX className="mb-3 h-10 w-10 text-gray-300" />
            <p className="font-semibold text-[#0F3D2E]">{t("noBookings")}</p>
            <p className="mt-1 text-sm text-gray-500">{t("bookFirst")}</p>
          </div>
        )}

        <div className="space-y-4">
          {list.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { providers } = useStore();
  const barber = providers.find((p) => p.id === booking.providerId)!;
  const service = serviceById(booking.serviceId);
  const isActive = ACTIVE_STATUSES.includes(booking.status);
  const unpaid = booking.status === "completed" && booking.paymentStatus !== "paid";
  const when = booking.scheduledFor === "now" ? formatDate(booking.createdAt, lang) : formatWhen(booking.scheduledFor, lang);

  const badge =
    booking.status === "completed"
      ? "bg-green-100 text-green-700"
      : booking.status === "cancelled"
        ? "bg-rose-100 text-rose-700"
        : "bg-amber-100 text-amber-700";

  const primary = "h-11 flex-1 rounded-full bg-[#0F3D2E] text-sm text-white hover:bg-[#0F3D2E]/90";
  const secondary = "h-11 flex-1 rounded-full border-2 border-[#0F3D2E] text-sm text-[#0F3D2E] hover:bg-[#0F3D2E]/5";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-4">
        <ProviderPhoto provider={barber} className="h-14 w-14 shrink-0 rounded-xl text-sm" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-[#0F3D2E]">{barber.name}</h3>
          <p className="mb-1.5 truncate text-sm font-medium text-gray-700">{localized(service.name, lang)}</p>
          {booking.review ? (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < booking.review!.rating ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-300"}`} />
              ))}
            </div>
          ) : (
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge}`}>
              {unpaid ? t("unpaid") : t(STATUS_LABEL[booking.status])}
            </span>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-[#0F3D2E]">{booking.total.toLocaleString()}</p>
          <p className="text-xs text-gray-600">TZS</p>
        </div>
      </div>

      <div className="mb-4 space-y-2 rounded-xl bg-gray-50 p-3.5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4 shrink-0 text-gray-500" />
          <span>{when}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
          <span className="truncate">{booking.location.landmark}</span>
        </div>
      </div>

      <div className="flex gap-3">
        {isActive && (
          <Button onClick={() => router.push(`/tracking/${booking.id}`)} className={primary}>
            {t("track")}
          </Button>
        )}
        {unpaid && (
          <Button onClick={() => router.push(`/payment/${booking.id}`)} className={primary}>
            {t("payNowShort")}
          </Button>
        )}
        {!isActive && !unpaid && (
          <>
            {booking.status === "completed" && !booking.review ? (
              <Button onClick={() => router.push(`/rating/${booking.id}`)} className={primary}>
                {t("rateNow")}
              </Button>
            ) : (
              <Button onClick={() => router.push(`/booking/${barber.id}?service=${booking.serviceId}`)} className={primary}>
                {t("rebook")}
              </Button>
            )}
            {booking.status === "completed" && (
              <Button onClick={() => router.push(`/receipt/${booking.id}`)} className={secondary}>
                {t("receipt")}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
