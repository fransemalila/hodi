"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { serviceById, COMMISSION_RATE } from "@/lib/mock-data";
import { localized, tzs, timeAgo } from "@/lib/format";
import { Badge, Card } from "@/components/ui";
import { Icon, IconName } from "@/components/Icon";
import { ServiceIcon } from "@/components/cards";

export default function AdminOverview() {
  const { t, lang } = useI18n();
  const { bookings, providers } = useStore();

  const completed = bookings.filter((b) => b.status === "completed");
  const gmv = completed.reduce((s, b) => s + b.total, 0);
  const revenue = Math.round(completed.reduce((s, b) => s + b.servicePrice * COMMISSION_RATE, 0));
  const activeProviders = providers.filter((p) => p.verification === "verified").length;
  const pending = providers.filter((p) => p.verification === "pending").length;

  const kpis: { label: string; value: string | number; sub: string; icon: IconName; delta?: string }[] = [
    { label: lang === "sw" ? "Oda zote" : "Total bookings", value: bookings.length, sub: lang === "sw" ? "wiki hii" : "this week", icon: "receipt", delta: "+12%" },
    { label: "GMV", value: tzs(gmv), sub: lang === "sw" ? "thamani ya oda" : "gross value", icon: "barChart", delta: "+8%" },
    { label: lang === "sw" ? "Mapato" : "Revenue", value: tzs(revenue), sub: `${Math.round(COMMISSION_RATE * 100)}% ${lang === "sw" ? "kamisheni" : "commission"}`, icon: "wallet", delta: "+15%" },
    { label: lang === "sw" ? "Watoa huduma" : "Active providers", value: activeProviders, sub: `${pending} ${lang === "sw" ? "wanasubiri" : "pending"}`, icon: "users" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">{t("overview")}</h1>
      <p className="mt-0.5 text-[13px] text-ink-muted">Dar es Salaam · {lang === "sw" ? "Toleo la onyesho" : "Demo data"}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon name={k.icon} size={18} />
              </span>
              {k.delta && (
                <span className="flex items-center gap-0.5 text-2xs font-bold text-brand-600">
                  <Icon name="arrowRight" size={12} className="-rotate-45" /> {k.delta}
                </span>
              )}
            </div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight">{k.value}</div>
            <div className="mt-0.5 text-2xs text-ink-muted">{k.label} · {k.sub}</div>
          </Card>
        ))}
      </div>

      {pending > 0 && (
        <Card className="mt-4 flex items-center justify-between border-accent-200 bg-accent-50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
              <Icon name="shield" size={18} />
            </span>
            <div className="text-[13px]">
              <span className="font-bold">{pending}</span>{" "}
              {lang === "sw" ? "mtoa huduma anasubiri uthibitisho wa NIDA" : "provider awaiting NIDA verification"}
            </div>
          </div>
          <Link href="/admin/providers" className="flex items-center gap-1 text-[13px] font-bold text-brand-700">
            {t("seeAll")} <Icon name="chevronRight" size={15} />
          </Link>
        </Card>
      )}

      {/* Recent bookings */}
      <h2 className="label-caps mb-3 mt-8 text-2xs font-bold text-ink-muted">
        {lang === "sw" ? "Shughuli za hivi karibuni" : "Recent activity"}
      </h2>
      <Card className="divide-y divide-line">
        {bookings.slice(0, 6).map((b) => {
          const svc = serviceById(b.serviceId);
          const provider = providers.find((p) => p.id === b.providerId)!;
          return (
            <Link key={b.id} href="/admin/bookings" className="flex items-center gap-3 p-4 transition hover:bg-surface-sunken">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <ServiceIcon serviceId={svc.id} size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{localized(svc.name, lang)} — {provider.name}</div>
                <div className="text-2xs text-ink-muted">{b.customerName} · {timeAgo(b.createdAt, lang)}</div>
              </div>
              <Badge tone={b.status === "completed" ? "green" : b.status === "cancelled" ? "red" : "blue"}>
                {b.status.replace(/_/g, " ")}
              </Badge>
              <span className="hidden w-20 text-right text-sm font-bold text-brand-700 sm:block">{tzs(b.total)}</span>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
