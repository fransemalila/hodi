"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { avatarColors } from "@/lib/mock-data";
import { Avatar, Badge, Button, Card, Stars, cx } from "@/components/ui";
import { Icon } from "@/components/Icon";
import type { Provider } from "@/lib/types";

export default function AdminProviders() {
  const { t, lang } = useI18n();
  const { providers, setVerification } = useStore();
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "suspended">("all");
  const [nidaFor, setNidaFor] = useState<Provider | null>(null);

  const filtered = providers.filter((p) => filter === "all" || p.verification === filter);

  const vBadge = (v: Provider["verification"]) =>
    v === "verified" ? (
      <Badge tone="green"><Icon name="shieldCheck" size={12} /> {lang === "sw" ? "Imethibitishwa" : "Verified"}</Badge>
    ) : v === "pending" ? (
      <Badge tone="amber"><Icon name="clock" size={12} /> {lang === "sw" ? "Inasubiri" : "Pending"}</Badge>
    ) : (
      <Badge tone="red"><Icon name="x" size={12} /> {lang === "sw" ? "Imesimamishwa" : "Suspended"}</Badge>
    );

  const filters = [
    { id: "all", label: t("seeAll") },
    { id: "pending", label: lang === "sw" ? "Wanaosubiri" : "Pending" },
    { id: "verified", label: lang === "sw" ? "Waliothibitishwa" : "Verified" },
    { id: "suspended", label: lang === "sw" ? "Waliosimamishwa" : "Suspended" },
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">{t("providers")}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cx(
              "rounded-full border px-4 py-1.5 text-[13px] font-semibold transition",
              filter === f.id ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-ink-soft shadow-xs",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-2.5">
        {filtered.map((p) => (
          <Card key={p.id} className="flex flex-wrap items-center gap-3 p-4">
            <Avatar name={p.name} color={avatarColors[p.photo]} size={48} />
            <div className="min-w-[160px] flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight">{p.name}</span>
                {p.verification === "verified" && <Stars rating={p.rating} size={12} />}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-2xs text-ink-muted">
                <Icon name="pin" size={12} /> {p.area} · {p.completedJobs} {t("jobsDone")} · {p.yearsExperience} {t("yearsExp")}
              </div>
            </div>
            {vBadge(p.verification)}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setNidaFor(p)}>
                <Icon name="shield" size={14} /> NIDA
              </Button>
              {p.verification !== "verified" && (
                <Button size="sm" onClick={() => setVerification(p.id, "verified")}>
                  {lang === "sw" ? "Thibitisha" : "Approve"}
                </Button>
              )}
              {p.verification === "verified" && (
                <Button variant="secondary" size="sm" onClick={() => setVerification(p.id, "suspended")} className="text-rose-600">
                  {lang === "sw" ? "Simamisha" : "Suspend"}
                </Button>
              )}
              {p.verification === "suspended" && (
                <Button size="sm" onClick={() => setVerification(p.id, "verified")}>
                  {lang === "sw" ? "Rejesha" : "Reinstate"}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* NIDA modal */}
      {nidaFor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setNidaFor(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl2 bg-white p-5 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold tracking-tight">{lang === "sw" ? "Uthibitisho wa NIDA" : "NIDA verification"}</h2>
              <button onClick={() => setNidaFor(null)} className="text-ink-muted"><Icon name="x" size={18} /></button>
            </div>
            <div className="mt-4 rounded-xl bg-gradient-to-br from-brand-700 to-brand-800 p-4 text-white">
              <div className="label-caps flex items-center gap-1.5 text-2xs font-semibold text-white/70">
                <Icon name="shieldCheck" size={13} /> {lang === "sw" ? "Kitambulisho cha Taifa" : "National ID (NIDA)"}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Avatar name={nidaFor.name} color="bg-white/20" size={48} />
                <div>
                  <div className="font-bold">{nidaFor.name}</div>
                  <div className="font-mono text-sm tracking-widest text-white/80">
                    1990{nidaFor.id.length}-•••••-•••••-{nidaFor.id.slice(-2).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <Button
                variant="secondary"
                className="text-rose-600"
                onClick={() => {
                  setVerification(nidaFor.id, "suspended");
                  setNidaFor(null);
                }}
              >
                {lang === "sw" ? "Kataa" : "Reject"}
              </Button>
              <Button
                onClick={() => {
                  setVerification(nidaFor.id, "verified");
                  setNidaFor(null);
                }}
              >
                {lang === "sw" ? "Thibitisha" : "Approve"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
