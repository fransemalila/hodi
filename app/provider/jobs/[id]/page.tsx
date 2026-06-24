"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { serviceById } from "@/lib/mock-data";
import { localized, tzs } from "@/lib/format";
import { Avatar, Badge, Button, Card, SectionLabel } from "@/components/ui";
import { Icon, IconName } from "@/components/Icon";
import { TopBar } from "@/components/MobileShell";
import { StatusTimeline } from "@/components/StatusTimeline";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import type { BookingStatus } from "@/lib/types";

const NEXT: Record<string, { status: BookingStatus; key: any; icon: IconName }> = {
  accepted: { status: "on_the_way", key: "markOnTheWay", icon: "navigation" },
  on_the_way: { status: "arrived", key: "markArrived", icon: "pin" },
  arrived: { status: "in_progress", key: "markInProgress", icon: "scissors" },
  in_progress: { status: "completed", key: "markCompleted", icon: "checkCircle" },
};

export default function ProviderJob({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { t, lang } = useI18n();
  const { bookings, advanceStatus } = useStore();
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="p-6">
        <TopBar back={() => router.push("/provider/jobs")} />
        <p className="text-ink-muted">Job not found.</p>
      </div>
    );
  }

  const svc = serviceById(booking.serviceId);
  const next = NEXT[booking.status];
  const mapsUrl = `https://maps.google.com/?q=${booking.location.lat},${booking.location.lng}`;
  const isCash = booking.paymentMethod === "cash";

  return (
    <div className="animate-fade-up">
      <TopBar title={localized(svc.name, lang)} back={() => router.push("/provider/jobs")} />

      <div className="px-5">
        {/* Customer + price */}
        <Card className="flex items-center gap-3 p-3.5">
          <Avatar name={booking.customerName} size={48} color="blue" />
          <div className="flex-1">
            <div className="font-semibold tracking-tight">{booking.customerName}</div>
            <Badge tone={isCash ? "amber" : "green"} className="mt-1">
              {isCash ? t("cashLabel") : booking.paymentMethod.toUpperCase()}
            </Badge>
          </div>
          <div className="font-extrabold text-brand-700">{tzs(booking.servicePrice)}</div>
        </Card>

        {/* Location / map */}
        <Card className="mt-3 overflow-hidden">
          <MapPlaceholder landmark={booking.location.landmark} className="rounded-none border-0 border-b border-line" />
          <div className="p-4">
            {booking.location.note && (
              <div className="flex items-start gap-1.5 text-[13px] text-ink-soft">
                <Icon name="note" size={15} className="mt-0.5 shrink-0 text-ink-faint" />
                <span>{booking.location.note}</span>
              </div>
            )}
            {booking.notes && (
              <div className="mt-1.5 flex items-start gap-1.5 text-[13px] text-ink-soft">
                <Icon name="chat" size={15} className="mt-0.5 shrink-0 text-ink-faint" />
                <span>“{booking.notes}”</span>
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary" className="w-full"><Icon name="navigation" size={17} /> {t("openInMaps")}</Button>
              </a>
              <a href={`tel:${booking.customerPhone}`}>
                <Button variant="secondary" className="w-full"><Icon name="phone" size={17} /> {t("callCustomer")}</Button>
              </a>
            </div>
          </div>
        </Card>

        {/* Status */}
        <SectionLabel className="mb-3 mt-6">{t("updateStatus")}</SectionLabel>
        {booking.status === "cancelled" ? (
          <Badge tone="red">{t("statusCancelled")}</Badge>
        ) : (
          <StatusTimeline status={booking.status} />
        )}
      </div>

      {/* Action footer */}
      {next && (
        <div className="sticky bottom-0 border-t border-line bg-white/90 p-4 backdrop-blur-lg">
          {booking.status === "in_progress" && isCash ? (
            <Button variant="accent" size="lg" className="w-full" onClick={() => advanceStatus(booking.id, "completed")}>
              <Icon name="banknote" size={18} /> {t("cashReceived")} · {tzs(booking.total)}
            </Button>
          ) : (
            <Button size="lg" className="w-full" onClick={() => advanceStatus(booking.id, next.status)}>
              <Icon name={next.icon} size={18} /> {t(next.key)}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
