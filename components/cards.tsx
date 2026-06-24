"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Provider, Service } from "@/lib/types";
import { avatarColors, serviceIcons } from "@/lib/mock-data";
import { durationRange, localized, priceRange, tzs } from "@/lib/format";
import { Avatar, Badge, Card, Stars, StatusDot, cx } from "./ui";
import { Icon, IconName } from "./Icon";

export function ServiceIcon({ serviceId, size = 22 }: { serviceId: string; size?: number }) {
  return <Icon name={(serviceIcons[serviceId] ?? "scissors") as IconName} size={size} />;
}

export function ServiceCard({ service, href }: { service: Service; href: string }) {
  const { lang } = useI18n();
  return (
    <Link href={href}>
      <Card className="flex items-center gap-3.5 p-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <ServiceIcon serviceId={service.id} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold tracking-tight">{localized(service.name, lang)}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[13px]">
            <span className="font-semibold text-brand-700">{priceRange(service)}</span>
            <span className="text-ink-faint">·</span>
            <span className="text-ink-muted">{durationRange(service)}</span>
          </div>
        </div>
        <Icon name="chevronRight" size={18} className="text-ink-faint" />
      </Card>
    </Link>
  );
}

export function ProviderCard({
  provider,
  service,
  href,
}: {
  provider: Provider;
  service?: Service;
  href: string;
}) {
  const { t } = useI18n();
  const statusLabel =
    provider.status === "online" ? t("online") : provider.status === "busy" ? t("busy") : t("offline");
  const price = service ? provider.prices[service.id] : undefined;
  return (
    <Link href={href}>
      <Card className="flex items-center gap-3.5 p-3.5">
        <div className="relative">
          <Avatar name={provider.name} color={avatarColors[provider.photo]} size={52} />
          <span className="absolute -bottom-0.5 -right-0.5">
            <StatusDot status={provider.status} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-semibold tracking-tight">{provider.name}</span>
            {provider.nidaVerified && (
              <Icon name="shieldCheck" size={15} className="shrink-0 text-brand-600" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-muted">
            <Stars rating={provider.rating} size={12} />
            <span className="text-ink-faint">({provider.reviewCount})</span>
            <span className="text-ink-faint">·</span>
            <span>{provider.distanceKm} km</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-2xs font-medium text-ink-faint">
            <StatusDot status={provider.status} />
            <span className="ml-0.5">{statusLabel}</span>
          </div>
        </div>
        {price != null && (
          <div className="text-right">
            <div className="text-2xs text-ink-faint">{t("from")}</div>
            <div className="font-bold text-brand-700">{tzs(price)}</div>
          </div>
        )}
      </Card>
    </Link>
  );
}
