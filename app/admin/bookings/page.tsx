"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { serviceById, avatarColors } from "@/lib/mock-data";
import { localized, tzs, timeAgo } from "@/lib/format";
import { Avatar, Badge, Button, Card, cx } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ServiceIcon } from "@/components/cards";
import type { Booking, BookingStatus } from "@/lib/types";

const STATUS_FILTERS: (BookingStatus | "all")[] = [
  "all",
  "pending",
  "accepted",
  "in_progress",
  "completed",
  "cancelled",
];

export default function AdminBookings() {
  const { t, lang } = useI18n();
  const { bookings, providers, assignProvider, advanceStatus } = useStore();
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [intervene, setIntervene] = useState<Booking | null>(null);

  const filtered = bookings.filter((b) => filter === "all" || b.status === filter);
  const tone = (s: BookingStatus) =>
    s === "completed" ? "green" : s === "cancelled" ? "red" : s === "pending" ? "amber" : "blue";

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">{t("bookings")}</h1>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cx(
              "shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-semibold capitalize transition",
              filter === f ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-ink-soft shadow-xs",
            )}
          >
            {f === "all" ? t("seeAll") : f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-2.5">
        {filtered.map((b) => {
          const svc = serviceById(b.serviceId);
          const provider = providers.find((p) => p.id === b.providerId)!;
          return (
            <Card key={b.id} className="flex flex-wrap items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <ServiceIcon serviceId={svc.id} size={18} />
              </span>
              <div className="min-w-[180px] flex-1">
                <div className="font-semibold tracking-tight">{localized(svc.name, lang)}</div>
                <div className="mt-0.5 flex items-center gap-1 text-2xs text-ink-muted">
                  {b.customerName} <Icon name="arrowRight" size={12} /> {provider.name} · {timeAgo(b.createdAt, lang)}
                </div>
              </div>
              <Badge tone={tone(b.status)}>{b.status.replace(/_/g, " ")}</Badge>
              <div className="w-20 text-right font-bold text-brand-700">{tzs(b.total)}</div>
              <Button variant="secondary" size="sm" onClick={() => setIntervene(b)}>
                <Icon name="sliders" size={14} /> {lang === "sw" ? "Ingilia" : "Intervene"}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Intervention drawer */}
      {intervene && (
        <InterveneModal
          booking={intervene}
          onClose={() => setIntervene(null)}
          providers={providers}
          assignProvider={assignProvider}
          advanceStatus={advanceStatus}
        />
      )}
    </div>
  );
}

function InterveneModal({
  booking,
  onClose,
  providers,
  assignProvider,
  advanceStatus,
}: {
  booking: Booking;
  onClose: () => void;
  providers: import("@/lib/types").Provider[];
  assignProvider: (b: string, p: string) => void;
  advanceStatus: (b: string, s: BookingStatus) => void;
}) {
  const { lang } = useI18n();
  const svc = serviceById(booking.serviceId);
  const current = providers.find((p) => p.id === booking.providerId)!;
  const eligible = providers.filter(
    (p) => p.verification === "verified" && p.serviceIds.includes(booking.serviceId),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-xl2 bg-white p-5 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <ServiceIcon serviceId={svc.id} size={16} />
            </span>
            {lang === "sw" ? "Ingilia oda" : "Intervene"}
          </h2>
          <button onClick={onClose} className="text-ink-muted"><Icon name="x" size={18} /></button>
        </div>
        <div className="mt-1.5 text-[13px] text-ink-muted">
          {booking.customerName} · {tzs(booking.total)} · {booking.location.landmark}
        </div>

        {/* Contact both sides */}
        <h3 className="label-caps mb-2 mt-4 text-2xs font-bold text-ink-muted">
          {lang === "sw" ? "Wasiliana" : "Contact"}
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <a href={`tel:${booking.customerPhone}`}>
            <Button variant="secondary" size="sm" className="w-full">
              <Icon name="phone" size={15} /> {lang === "sw" ? "Mteja" : "Customer"}
            </Button>
          </a>
          <a href="tel:+255700000000">
            <Button variant="secondary" size="sm" className="w-full">
              <Icon name="phone" size={15} /> {lang === "sw" ? "Mtoa huduma" : "Provider"}
            </Button>
          </a>
        </div>

        {/* Reassign provider */}
        <h3 className="label-caps mb-2 mt-5 text-2xs font-bold text-ink-muted">
          {lang === "sw" ? "Badilisha mtoa huduma" : "Reassign provider"}
        </h3>
        <div className="grid gap-2">
          {eligible.map((p) => (
            <button
              key={p.id}
              onClick={() => assignProvider(booking.id, p.id)}
              className={cx(
                "flex items-center gap-3 rounded-xl border p-2.5 text-left transition",
                p.id === current.id ? "border-brand-600 bg-brand-50" : "border-line hover:bg-surface-sunken",
              )}
            >
              <Avatar name={p.name} color={avatarColors[p.photo]} size={36} />
              <div className="flex-1">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-2xs text-ink-muted">{p.area} · {p.distanceKm} km · {tzs(p.prices[booking.serviceId])}</div>
              </div>
              {p.id === current.id && <Icon name="checkCircle" size={18} className="text-brand-600" />}
            </button>
          ))}
        </div>

        {/* Status override / cancel */}
        <h3 className="label-caps mb-2 mt-5 text-2xs font-bold text-ink-muted">
          {lang === "sw" ? "Hatua" : "Actions"}
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {booking.status !== "completed" && (
            <Button size="sm" onClick={() => { advanceStatus(booking.id, "completed"); onClose(); }}>
              {lang === "sw" ? "Weka imekamilika" : "Mark completed"}
            </Button>
          )}
          {booking.status !== "cancelled" && (
            <Button variant="secondary" size="sm" className="text-rose-600" onClick={() => { advanceStatus(booking.id, "cancelled"); onClose(); }}>
              {lang === "sw" ? "Ghairi oda" : "Cancel booking"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
