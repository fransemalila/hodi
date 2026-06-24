"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { CURRENT_PROVIDER_ID } from "@/lib/current";
import { serviceById } from "@/lib/mock-data";
import { localized, tzs, formatDate } from "@/lib/format";
import { Badge, Card } from "@/components/ui";
import { ServiceIcon } from "@/components/cards";
import { TopBar } from "@/components/MobileShell";
import type { BookingStatus } from "@/lib/types";

export default function ProviderJobs() {
  const { t, lang } = useI18n();
  const { bookings } = useStore();
  const jobs = bookings
    .filter((b) => b.providerId === CURRENT_PROVIDER_ID && b.status !== "pending")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const tone = (s: BookingStatus) => (s === "completed" ? "green" : s === "cancelled" ? "red" : "blue");

  return (
    <div className="animate-fade-up">
      <TopBar title={t("pJobs")} />
      <div className="grid gap-2.5 px-5 pb-6">
        {jobs.length === 0 && (
          <Card className="p-6 text-center text-[13px] text-ink-muted">{t("noBookings")}</Card>
        )}
        {jobs.map((b) => {
          const svc = serviceById(b.serviceId);
          return (
            <Link key={b.id} href={`/provider/jobs/${b.id}`}>
              <Card className="flex items-center gap-3 p-3.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <ServiceIcon serviceId={svc.id} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold tracking-tight">{localized(svc.name, lang)}</div>
                  <div className="text-[13px] text-ink-muted">{b.customerName} · {formatDate(b.createdAt, lang)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-brand-700">{tzs(b.servicePrice)}</div>
                  <Badge tone={tone(b.status)} className="mt-1">{b.status.replace(/_/g, " ")}</Badge>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
