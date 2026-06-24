"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { CURRENT_PROVIDER_ID } from "@/lib/current";
import { serviceById, COMMISSION_RATE } from "@/lib/mock-data";
import { localized, tzs } from "@/lib/format";
import { Avatar, Badge, Button, Card, SectionLabel, cx } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ServiceIcon } from "@/components/cards";
import { LangToggle } from "@/components/LangToggle";
import type { Booking } from "@/lib/types";

export default function ProviderDashboard() {
  const { t, lang } = useI18n();
  const { providers, bookings, advanceStatus, setProviderStatus } = useStore();
  const me = providers.find((p) => p.id === CURRENT_PROVIDER_ID)!;
  const online = me.status !== "offline";

  const myBookings = bookings.filter((b) => b.providerId === CURRENT_PROVIDER_ID);
  const incoming = myBookings.filter((b) => b.status === "pending");
  const todays = myBookings.filter((b) =>
    ["accepted", "on_the_way", "arrived", "in_progress"].includes(b.status),
  );
  const completedToday = myBookings.filter((b) => b.status === "completed");
  const earnedNet = completedToday.reduce((sum, b) => sum + b.servicePrice * (1 - COMMISSION_RATE), 0);

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className={cx("relative overflow-hidden px-5 pb-7 pt-5 text-white transition-colors", online ? "bg-brand-700" : "bg-ink")}>
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={me.name} size={44} color="bg-white/20" />
            <div>
              <div className="font-bold tracking-tight">{me.name}</div>
              <div className="flex items-center gap-1 text-2xs text-white/70">
                <Icon name="pin" size={12} /> {me.area}
              </div>
            </div>
          </div>
          <LangToggle />
        </div>

        {/* Availability toggle */}
        <button
          onClick={() => setProviderStatus(me.id, online ? "offline" : "online")}
          className="relative mt-4 flex w-full items-center justify-between rounded-xl bg-white/10 p-3.5"
        >
          <span className="flex items-center gap-2 font-semibold">
            <Icon name="power" size={18} />
            {online ? t("goOnline") : t("goOffline")}
          </span>
          <span className={cx("relative h-7 w-12 rounded-full transition", online ? "bg-accent-500" : "bg-white/25")}>
            <span className={cx("absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all", online ? "left-[22px]" : "left-0.5")} />
          </span>
        </button>
      </div>

      <div className="px-5">
        {/* Quick stats */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Card className="p-4">
            <div className="flex items-center gap-1.5 text-2xs font-medium text-ink-muted">
              <Icon name="wallet" size={14} /> {t("todayEarnings")}
            </div>
            <div className="mt-1.5 text-xl font-extrabold tracking-tight text-brand-700">{tzs(Math.round(earnedNet))}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-1.5 text-2xs font-medium text-ink-muted">
              <Icon name="checkCircle" size={14} /> {t("jobsDone")}
            </div>
            <div className="mt-1.5 text-xl font-extrabold tracking-tight">{completedToday.length}</div>
          </Card>
        </div>

        {/* Incoming requests */}
        {incoming.length > 0 && (
          <>
            <SectionLabel className="mb-2.5 mt-6 text-accent-600">{t("newRequest")}</SectionLabel>
            <div className="grid gap-2.5">
              {incoming.map((b) => (
                <IncomingCard
                  key={b.id}
                  booking={b}
                  onAccept={() => advanceStatus(b.id, "accepted")}
                  onReject={() => advanceStatus(b.id, "cancelled")}
                />
              ))}
            </div>
          </>
        )}

        {/* Today's jobs */}
        <SectionLabel className="mb-2.5 mt-6">{t("todaysJobs")}</SectionLabel>
        {todays.length === 0 && (
          <Card className="p-6 text-center text-[13px] text-ink-muted">{t("noBookings")}</Card>
        )}
        <div className="grid gap-2.5 pb-6">
          {todays.map((b) => {
            const svc = serviceById(b.serviceId);
            return (
              <Link key={b.id} href={`/provider/jobs/${b.id}`}>
                <Card className="flex items-center gap-3 p-3.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <ServiceIcon serviceId={svc.id} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold tracking-tight">{localized(svc.name, lang)}</div>
                    <div className="truncate text-[13px] text-ink-muted">{b.customerName} · {b.location.landmark}</div>
                  </div>
                  <Badge tone="blue">{b.status.replace(/_/g, " ")}</Badge>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IncomingCard({ booking, onAccept, onReject }: { booking: Booking; onAccept: () => void; onReject: () => void }) {
  const { t, lang } = useI18n();
  const svc = serviceById(booking.serviceId);
  const [secs, setSecs] = useState(180);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <Card className="overflow-hidden border-accent-300 shadow-raised">
      <div className="flex items-center justify-between bg-accent-50 px-4 py-2">
        <span className="flex items-center gap-1.5 text-[13px] font-bold text-accent-600">
          <Icon name="clock" size={15} /> {mm}:{ss} {t("acceptWindow")}
        </span>
        <span className="font-extrabold text-brand-700">{tzs(booking.servicePrice)}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <ServiceIcon serviceId={svc.id} />
          </span>
          <div className="flex-1">
            <div className="font-semibold tracking-tight">{localized(svc.name, lang)}</div>
            <div className="text-[13px] text-ink-muted">
              {booking.customerName} · {booking.scheduledFor === "now" ? t("rightNow") : booking.scheduledFor}
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-surface-sunken p-3 text-[13px] text-ink-soft">
          <div className="flex items-start gap-1.5">
            <Icon name="pin" size={15} className="mt-0.5 shrink-0 text-ink-faint" />
            <span>{booking.location.landmark}</span>
          </div>
          {booking.location.note && (
            <div className="mt-1 flex items-start gap-1.5 text-2xs text-ink-muted">
              <Icon name="note" size={14} className="mt-0.5 shrink-0" />
              <span>{booking.location.note}</span>
            </div>
          )}
        </div>
        {booking.notes && (
          <div className="mt-2 flex items-start gap-1.5 text-2xs text-ink-muted">
            <Icon name="chat" size={14} className="mt-0.5 shrink-0" /> <span>“{booking.notes}”</span>
          </div>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Button variant="secondary" onClick={onReject} className="text-rose-600">{t("reject")}</Button>
          <Button variant="accent" onClick={onAccept}>{t("accept")}</Button>
        </div>
      </div>
    </Card>
  );
}
