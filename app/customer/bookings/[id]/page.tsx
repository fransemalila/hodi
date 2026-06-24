"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { serviceById, avatarColors } from "@/lib/mock-data";
import { localized, tzs, formatDate } from "@/lib/format";
import { Avatar, Badge, Button, Card, SectionLabel, Stars } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ServiceIcon } from "@/components/cards";
import { TopBar } from "@/components/MobileShell";
import { StatusTimeline } from "@/components/StatusTimeline";
import { RatingSheet } from "@/components/RatingSheet";

export default function BookingTracking({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const sp = useSearchParams();
  const isNew = sp.get("new") === "1";
  const { t, lang } = useI18n();
  const { bookings, providers, advanceStatus } = useStore();
  const [showRating, setShowRating] = useState(false);

  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return (
      <div className="p-6">
        <TopBar back={() => router.push("/customer/bookings")} />
        <p className="text-ink-muted">Booking not found.</p>
      </div>
    );
  }

  const service = serviceById(booking.serviceId);
  const provider = providers.find((p) => p.id === booking.providerId)!;
  const pmLabel: Record<string, string> = {
    mpesa: "M-Pesa",
    tigopesa: "Tigo Pesa",
    airtel: "Airtel Money",
    cash: t("cashLabel"),
  };

  return (
    <div className="animate-fade-up">
      <TopBar title={t("trackBooking")} back={() => router.push("/customer/bookings")} />

      <div className="px-5">
        {isNew && (
          <Card className="mb-4 flex items-center gap-3 border-brand-200 bg-brand-50 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
              <Icon name="check" size={18} strokeWidth={2.5} />
            </span>
            <div>
              <div className="font-bold text-brand-800">{t("bookingConfirmed")}</div>
              {booking.status === "pending" && (
                <div className="text-[13px] text-brand-700">{t("waitingProvider")}</div>
              )}
            </div>
          </Card>
        )}

        {/* Provider */}
        <Card className="flex items-center gap-3 p-3.5">
          <Avatar name={provider.name} color={avatarColors[provider.photo]} size={52} />
          <div className="flex-1">
            <div className="font-semibold tracking-tight">{provider.name}</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-muted">
              <Stars rating={provider.rating} size={12} />
              <span className="text-ink-faint">·</span>
              <span>{provider.area}</span>
            </div>
          </div>
          <a
            href={`tel:${booking.customerPhone}`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-white transition active:scale-95"
            aria-label={t("callProvider")}
          >
            <Icon name="phone" size={19} />
          </a>
        </Card>

        {/* Service summary */}
        <Card className="mt-3 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <ServiceIcon serviceId={service.id} />
            </span>
            <div className="flex-1">
              <div className="font-semibold">{localized(service.name, lang)}</div>
              <div className="text-[13px] text-ink-muted">
                {booking.scheduledFor === "now" ? t("rightNow") : booking.scheduledFor}
              </div>
            </div>
            <div className="font-extrabold text-brand-700">{tzs(booking.total)}</div>
          </div>
          <div className="mt-3 flex items-start gap-1.5 border-t border-line pt-3 text-[13px] text-ink-soft">
            <Icon name="pin" size={15} className="mt-0.5 shrink-0 text-ink-faint" />
            <span>{booking.location.landmark}</span>
          </div>
          {booking.location.note && (
            <div className="mt-1 flex items-start gap-1.5 text-2xs text-ink-muted">
              <Icon name="note" size={14} className="mt-0.5 shrink-0" />
              <span>{booking.location.note}</span>
            </div>
          )}
          <div className="mt-2.5 flex items-center gap-2">
            <Badge tone={booking.paymentMethod === "cash" ? "amber" : "green"}>{pmLabel[booking.paymentMethod]}</Badge>
            <span className="text-2xs text-ink-faint">{formatDate(booking.createdAt, lang)}</span>
          </div>
        </Card>

        {/* Status */}
        <SectionLabel className="mb-3 mt-6">{t("updateStatus")}</SectionLabel>
        {booking.status === "cancelled" ? (
          <Badge tone="red">{t("statusCancelled")}</Badge>
        ) : (
          <StatusTimeline status={booking.status} />
        )}

        {/* Actions */}
        <div className="mt-4 grid gap-2.5 pb-6">
          {booking.status === "completed" && !booking.review && (
            <Button onClick={() => setShowRating(true)} size="lg">
              <Icon name="star" filled size={18} /> {t("rateService")}
            </Button>
          )}
          {booking.status === "completed" && booking.review && (
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Stars rating={booking.review.rating} />
                <span className="text-[13px] text-ink-muted">· {t("statusCompleted")}</span>
              </div>
              {booking.review.comment && <p className="mt-1.5 text-sm text-ink-soft">“{booking.review.comment}”</p>}
            </Card>
          )}
          {(booking.status === "pending" || booking.status === "accepted") && (
            <Button variant="ghost" onClick={() => advanceStatus(booking.id, "cancelled")} className="text-rose-600">
              {t("cancel")}
            </Button>
          )}
        </div>
      </div>

      {showRating && <RatingSheet bookingId={booking.id} onClose={() => setShowRating(false)} />}
    </div>
  );
}
