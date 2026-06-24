"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { serviceById, avatarColors } from "@/lib/mock-data";
import { localized, tzs, formatDate } from "@/lib/format";
import { Avatar, Badge, Card, Stars, cx } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { ServiceIcon } from "@/components/cards";
import { TopBar } from "@/components/MobileShell";
import type { BookingStatus } from "@/lib/types";

const ACTIVE: BookingStatus[] = ["pending", "accepted", "on_the_way", "arrived", "in_progress"];

export default function BookingsList() {
  const { t, lang } = useI18n();
  const { bookings, providers } = useStore();
  const [tab, setTab] = useState<"active" | "past">("active");

  const filtered = bookings.filter((b) =>
    tab === "active" ? ACTIVE.includes(b.status) : b.status === "completed" || b.status === "cancelled",
  );

  const statusTone = (s: BookingStatus) =>
    s === "completed" ? "green" : s === "cancelled" ? "red" : "blue";
  const statusLabel: Record<BookingStatus, string> = {
    pending: t("statusPending"),
    accepted: t("statusAccepted"),
    on_the_way: t("statusOnTheWay"),
    arrived: t("statusArrived"),
    in_progress: t("statusInProgress"),
    completed: t("statusCompleted"),
    cancelled: t("statusCancelled"),
  };

  return (
    <div className="animate-fade-up">
      <TopBar title={t("myBookings")} />
      <div className="px-5">
        <div className="mb-4 inline-flex rounded-full border border-line bg-white p-1">
          {(["active", "past"] as const).map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={cx(
                "rounded-full px-5 py-1.5 text-[13px] font-bold transition",
                tab === tb ? "bg-brand-700 text-white shadow-xs" : "text-ink-muted",
              )}
            >
              {tb === "active" ? t("active") : t("past")}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-sunken text-ink-faint">
              <Icon name="receipt" size={26} />
            </span>
            <p className="mt-3 text-ink-muted">{t("noBookings")}</p>
            <Link href="/customer" className="mt-3 font-bold text-brand-700">
              {t("bookNow")}
            </Link>
          </div>
        )}

        <div className="grid gap-2.5">
          {filtered.map((b) => {
            const svc = serviceById(b.serviceId);
            const provider = providers.find((p) => p.id === b.providerId)!;
            return (
              <Link key={b.id} href={`/customer/bookings/${b.id}`}>
                <Card className="p-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={provider.name} color={avatarColors[provider.photo]} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <ServiceIcon serviceId={svc.id} size={15} />
                        <span className="truncate font-semibold tracking-tight">{localized(svc.name, lang)}</span>
                      </div>
                      <div className="mt-0.5 text-[13px] text-ink-muted">
                        {provider.name} · {formatDate(b.createdAt, lang)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-brand-700">{tzs(b.total)}</div>
                      <Badge tone={statusTone(b.status)} className="mt-1">
                        {statusLabel[b.status]}
                      </Badge>
                    </div>
                  </div>
                  {b.status === "completed" && (
                    <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2.5">
                      {b.review ? (
                        <Stars rating={b.review.rating} size={12} />
                      ) : (
                        <span className="flex items-center gap-1 text-2xs font-semibold text-accent-600">
                          <Icon name="star" filled size={13} /> {t("rate")}
                        </span>
                      )}
                      <span className="text-2xs font-bold text-brand-700">{t("bookAgain")}</span>
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
