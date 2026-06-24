"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { serviceById, avatarColors } from "@/lib/mock-data";
import { localized, tzs } from "@/lib/format";
import { Avatar, Badge, Button, Card, Stars } from "@/components/ui";
import { TopBar } from "@/components/MobileShell";

export default function ProviderProfile({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { t, lang } = useI18n();
  const { providers } = useStore();
  const provider = providers.find((p) => p.id === id);

  if (!provider) {
    return (
      <div className="p-6">
        <TopBar back={() => router.back()} />
        <p className="text-ink-muted">Provider not found.</p>
      </div>
    );
  }

  return (
    <div>
      <TopBar back={() => router.back()} />

      <div className="px-5">
        <div className="flex items-center gap-4">
          <Avatar name={provider.name} color={avatarColors[provider.photo]} size={72} />
          <div>
            <h1 className="text-xl font-extrabold">{provider.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
              <Stars rating={provider.rating} />
              <span>({provider.reviewCount} {t("reviews")})</span>
            </div>
            <div className="mt-1 text-sm text-ink-muted">📍 {provider.area} · {provider.distanceKm} km</div>
          </div>
        </div>

        {provider.nidaVerified && (
          <div className="mt-4">
            <Badge tone="green">🛡️ {t("nidaVerified")}</Badge>
          </div>
        )}

        <Card className="mt-4 grid grid-cols-3 divide-x divide-black/5 p-4 text-center">
          <div>
            <div className="text-lg font-extrabold">{provider.yearsExperience}</div>
            <div className="text-xs text-ink-muted">{t("yearsExp")}</div>
          </div>
          <div>
            <div className="text-lg font-extrabold">{provider.completedJobs}</div>
            <div className="text-xs text-ink-muted">{t("jobsDone")}</div>
          </div>
          <div>
            <div className="text-lg font-extrabold">{provider.rating.toFixed(1)}★</div>
            <div className="text-xs text-ink-muted">{provider.reviewCount} {t("reviews")}</div>
          </div>
        </Card>

        <p className="mt-4 text-sm text-ink-soft">{localized(provider.bio, lang)}</p>

        <h2 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide text-ink-muted">
          {t("servicesOffered")}
        </h2>
        <div className="grid gap-2.5">
          {provider.serviceIds.map((sid) => {
            const svc = serviceById(sid);
            return (
              <Link key={sid} href={`/customer/book?service=${sid}&provider=${provider.id}`}>
                <Card className="flex items-center gap-3 p-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                    {svc.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{localized(svc.name, lang)}</div>
                    <div className="text-xs text-ink-muted">{svc.durationMin}–{svc.durationMax} min</div>
                  </div>
                  <div className="font-bold text-brand-700">{tzs(provider.prices[sid])}</div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 mt-6 border-t border-black/5 bg-white/90 p-4 backdrop-blur">
        <Link href={`/customer/book?provider=${provider.id}&service=${provider.serviceIds[0]}`}>
          <Button className="w-full">{t("bookNow")}</Button>
        </Link>
      </div>
    </div>
  );
}
