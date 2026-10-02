"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scissors, Star, MapPin, Clock, ChevronDown, ChevronRight, Search, ShieldCheck, Check, Plus } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { BottomNav, Protected, ProviderPhoto, Sheet } from "@/components/barber/shell";
import { LogoTile } from "@/components/brand/Logo";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import { ACTIVE_STATUSES, useMyBookings, useStore } from "@/lib/store";
import { services } from "@/lib/mock-data";
import { localized, tzs } from "@/lib/format";
import { STATUS_TITLE } from "@/lib/status";


export default function HomePage() {
  return (
    <Protected>
      <HomeScreen />
    </Protected>
  );
}

function HomeScreen() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { providers, profile, updateProfile } = useStore();
  const myBookings = useMyBookings();
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [pickLocation, setPickLocation] = useState(false);

  const location = profile.locations.find((l) => l.id === profile.defaultLocationId) ?? profile.locations[0];
  const active = myBookings.find((b) => ACTIVE_STATUSES.includes(b.status));
  const awaitingPayment = myBookings.find((b) => b.status === "completed" && b.paymentStatus !== "paid");

  const verified = providers.filter((p) => p.verification === "verified");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rank = { online: 0, busy: 1, offline: 2 } as const;
    return verified
      .filter((p) => !serviceId || p.serviceIds.includes(serviceId))
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q))
      .sort((a, b) => rank[a.status] - rank[b.status] || a.distanceKm - b.distanceKm);
  }, [verified, serviceId, query]);

  const fromPrice = (sid: string) => {
    const prices = verified.map((p) => p.prices[sid]).filter((x): x is number => x != null);
    return prices.length ? Math.min(...prices) : undefined;
  };

  const quickBook = () => {
    const best = list.find((p) => p.status === "online");
    if (!best) return;
    router.push(`/booking/${best.id}${serviceId ? `?service=${serviceId}` : ""}`);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      {/* Header */}
      <div className="rounded-b-[32px] bg-[#0F3D2E] px-6 pb-8 pt-10">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoTile size={44} className="ring-1 ring-white/15" />
            <div>
              <p className="text-sm text-[#C9A227]">{t("karibu")}</p>
              <h1 className="text-2xl font-bold leading-tight text-white">{profile.name}</h1>
            </div>
          </div>
          <LangToggle />
        </div>

        <button
          onClick={() => setPickLocation(true)}
          className="mb-6 flex max-w-full items-center gap-2 rounded-full bg-white/10 py-2 pl-3 pr-4 text-left text-white/90 transition hover:bg-white/15"
        >
          <MapPin className="h-4 w-4 shrink-0 text-[#C9A227]" />
          <span className="truncate text-sm">
            {location ? `${location.label} · ${location.landmark}` : t("addLocation")}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </button>

        <Button
          onClick={quickBook}
          disabled={!list.some((p) => p.status === "online")}
          className="h-14 w-full rounded-full bg-[#C9A227] text-lg font-semibold text-[#0F3D2E] hover:bg-[#C9A227]/90 disabled:opacity-60"
        >
          <Scissors className="h-5 w-5" />
          {t("bookABarber")}
        </Button>
      </div>

      <div className="flex-1 px-6 py-6">
        {/* Active booking banner */}
        {(active || awaitingPayment) && (
          <Link
            href={active ? `/tracking/${active.id}` : `/payment/${awaitingPayment!.id}`}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-[#C9A227]/40 bg-[#C9A227]/10 p-4 animate-fade-up"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A227] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#C9A227]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a6d12]">
                {active ? t("activeBooking") : t("payNowShort")}
              </p>
              <p className="truncate font-semibold text-[#0F3D2E]">
                {active ? t(STATUS_TITLE[active.status]) : tzs(awaitingPayment!.total)}
              </p>
            </div>
            <span className="text-sm font-semibold text-[#0F3D2E]">{active ? t("track") : t("payNow")}</span>
            <ChevronRight className="h-4 w-4 text-[#0F3D2E]" />
          </Link>
        )}

        {/* Services */}
        <h2 className="mb-4 text-xl font-bold text-[#0F3D2E]">{t("servicesTitle")}</h2>
        <div className="no-scrollbar -mx-6 mb-6 flex gap-3 overflow-x-auto px-6 pb-1">
          <button
            onClick={() => setServiceId(null)}
            className={`flex w-24 shrink-0 flex-col items-center justify-center rounded-2xl p-3 shadow-sm transition ${
              serviceId === null ? "bg-[#0F3D2E] text-white" : "bg-white text-gray-700 hover:shadow-md"
            }`}
          >
            <div className="mb-2 text-2xl">💈</div>
            <p className="text-xs font-semibold">{t("all")}</p>
          </button>
          {services.map((s) => {
            const selected = serviceId === s.id;
            const from = fromPrice(s.id);
            return (
              <button
                key={s.id}
                onClick={() => setServiceId(selected ? null : s.id)}
                className={`flex w-28 shrink-0 flex-col rounded-2xl p-3 text-left shadow-sm transition ${
                  selected ? "bg-[#0F3D2E] text-white" : "bg-white text-gray-700 hover:shadow-md"
                }`}
              >
                <div className="mb-2 text-2xl">{s.emoji}</div>
                <p className="mb-1 line-clamp-2 min-h-[2rem] text-xs font-medium leading-tight">{localized(s.name, lang)}</p>
                {from != null && (
                  <p className={`text-xs font-semibold ${selected ? "text-[#C9A227]" : "text-[#a3801d]"}`}>
                    {t("from")} {from.toLocaleString()}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Barbers */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0F3D2E]">{t("availableBarbers")}</h2>
          <span className="text-sm text-gray-500">{list.length}</span>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchBarbers")}
            className="h-12 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/15"
          />
        </div>

        <div className="space-y-4">
          {list.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">{t("noMatch")}</div>
          )}
          {list.map((p) => {
            const price = serviceId ? p.prices[serviceId] : Math.min(...Object.values(p.prices));
            const statusLabel = p.status === "online" ? t("online") : p.status === "busy" ? t("busy") : t("offline");
            return (
              <Link
                key={p.id}
                href={`/barber/${p.id}${serviceId ? `?service=${serviceId}` : ""}`}
                className={`block rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${p.status === "offline" ? "opacity-70" : ""}`}
              >
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <ProviderPhoto provider={p} className="h-20 w-20 rounded-2xl text-xl" />
                    <span
                      className={`absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-white ${
                        p.status === "online" ? "bg-green-500" : p.status === "busy" ? "bg-amber-400" : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-1.5">
                      <h3 className="truncate font-semibold text-[#0F3D2E]">{p.name}</h3>
                      {p.nidaVerified && <ShieldCheck className="h-4 w-4 shrink-0 text-[#246b52]" aria-label={t("nidaVerified")} />}
                    </div>
                    <div className="mb-2 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
                      <span className="text-sm font-medium text-gray-700">{p.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({p.reviewCount})</span>
                      <span
                        className={`ml-1 text-xs font-semibold ${
                          p.status === "online" ? "text-green-700" : p.status === "busy" ? "text-amber-700" : "text-gray-500"
                        }`}
                      >
                        · {statusLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {p.distanceKm} km · {p.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {p.yearsExperience} {t("years")}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end justify-end">
                    {price != null && Number.isFinite(price) && (
                      <span className="text-right text-xs">
                        <span className="block text-gray-400">{t("from")}</span>
                        <span className="font-bold text-[#0F3D2E]">{tzs(price)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <BottomNav />

      <Sheet open={pickLocation} onClose={() => setPickLocation(false)} title={t("serviceAt")}>
        <div className="space-y-2">
          {profile.locations.map((l) => {
            const selected = l.id === location?.id;
            return (
              <button
                key={l.id}
                onClick={() => {
                  updateProfile({ defaultLocationId: l.id });
                  setPickLocation(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                  selected ? "border-[#0F3D2E] bg-[#0F3D2E]/5" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <MapPin className="h-5 w-5 shrink-0 text-[#C9A227]" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-[#0F3D2E]">{l.label}</span>
                  <span className="block truncate text-sm text-gray-600">{l.landmark}</span>
                </span>
                {selected && <Check className="h-5 w-5 text-[#0F3D2E]" />}
              </button>
            );
          })}
          <Link
            href="/account#locations"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-4 text-sm font-semibold text-[#0F3D2E] hover:border-[#0F3D2E]"
          >
            <Plus className="h-4 w-4" /> {t("addLocation")}
          </Link>
        </div>
      </Sheet>
    </div>
  );
}
