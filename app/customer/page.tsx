"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { services, categoryIcons } from "@/lib/mock-data";
import { ServiceCard, ProviderCard } from "@/components/cards";
import { LangToggle } from "@/components/LangToggle";
import { SectionLabel, cx } from "@/components/ui";
import { Icon, IconName } from "@/components/Icon";
import { localized } from "@/lib/format";
import type { ServiceCategory } from "@/lib/types";

export default function CustomerHome() {
  const { t, lang } = useI18n();
  const { profile, providers } = useStore();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<ServiceCategory | "all">("all");

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchCat = cat === "all" || s.category === cat;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        localized(s.name, lang).toLowerCase().includes(q) ||
        localized(s.name, lang === "sw" ? "en" : "sw").toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, cat, lang]);

  const nearby = useMemo(
    () =>
      providers
        .filter((p) => p.verification === "verified")
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 4),
    [providers],
  );

  const cats: { id: ServiceCategory | "all"; label: string; icon: IconName }[] = [
    { id: "all", label: t("seeAll"), icon: "grid" },
    { id: "barbering", label: t("barbering"), icon: categoryIcons.barbering as IconName },
    { id: "grooming", label: t("grooming"), icon: categoryIcons.grooming as IconName },
  ];

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-brand-700 px-5 pb-7 pt-5 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <button className="flex items-center gap-1.5 text-sm font-medium text-white/90">
            <Icon name="pin" size={16} />
            <span className="font-semibold">{profile.locations[0]?.label ?? "Dar es Salaam"}</span>
            <Icon name="chevronDown" size={14} className="text-white/70" />
          </button>
          <LangToggle />
        </div>

        <div className="relative mt-5">
          <div className="text-[13px] text-white/70">
            {t("greeting")}, {profile.name}
          </div>
          <h1 className="mt-1 text-[22px] font-extrabold tracking-tight">{t("whatService")}</h1>
        </div>

        <div className="relative mt-4 flex items-center gap-2.5 rounded-xl bg-white px-3.5 shadow-xs">
          <Icon name="search" size={18} className="text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
        </div>
      </div>

      <div className="px-5">
        {/* Categories */}
        <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cx(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition",
                cat === c.id
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-line bg-white text-ink-soft shadow-xs",
              )}
            >
              <Icon name={c.icon} size={16} />
              {c.label}
            </button>
          ))}
        </div>

        {/* Services */}
        <SectionLabel className="mb-2.5 mt-6">{t("categories")}</SectionLabel>
        <div className="grid gap-2.5">
          {filteredServices.map((s) => (
            <ServiceCard key={s.id} service={s} href={`/customer/book?service=${s.id}`} />
          ))}
        </div>

        {/* Nearby providers */}
        <div className="mb-2.5 mt-7 flex items-center justify-between">
          <SectionLabel>{t("nearbyProviders")}</SectionLabel>
        </div>
        <div className="grid gap-2.5">
          {nearby.map((p) => (
            <ProviderCard key={p.id} provider={p} href={`/customer/providers/${p.id}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
