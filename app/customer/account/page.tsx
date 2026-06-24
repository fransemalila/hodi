"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Avatar, Badge, Button, Card, SectionLabel } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { LangToggle } from "@/components/LangToggle";
import { TopBar } from "@/components/MobileShell";

export default function Account() {
  const { t } = useI18n();
  const router = useRouter();
  const { profile, isAuthed, signOut } = useStore();
  const [copied, setCopied] = useState(false);

  const referral = profile.referralCode || "ASHA255";

  return (
    <div className="animate-fade-up">
      <TopBar title={t("account")} />
      <div className="px-5">
        <Card className="flex items-center gap-4 p-4">
          <Avatar name={profile.name} size={56} />
          <div className="flex-1">
            <div className="text-lg font-extrabold tracking-tight">{profile.name}</div>
            <div className="text-[13px] text-ink-muted">{profile.phone}</div>
            {isAuthed && (
              <Badge tone="green" className="mt-1.5">
                <Icon name="shieldCheck" size={12} /> {t("verify")}
              </Badge>
            )}
          </div>
        </Card>

        {/* Referral */}
        <Card className="mt-3 overflow-hidden border-accent-200">
          <div className="bg-gradient-to-br from-accent-400 to-accent-500 p-4 text-white">
            <div className="flex items-center gap-1.5 text-[13px] font-bold">
              <Icon name="gift" size={16} /> {t("referAFriend")}
            </div>
            <div className="mt-2.5 flex items-center justify-between rounded-xl bg-white/90 px-3.5 py-2.5">
              <span className="font-mono text-lg font-extrabold tracking-[0.2em] text-ink">{referral}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(referral);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="flex items-center gap-1 text-[13px] font-bold text-brand-700"
              >
                <Icon name={copied ? "check" : "copy"} size={15} strokeWidth={copied ? 2.5 : 1.75} />
                {copied ? "" : "Copy"}
              </button>
            </div>
          </div>
        </Card>

        {/* Locations */}
        <SectionLabel className="mb-2.5 mt-6">{t("myLocations")}</SectionLabel>
        <div className="grid gap-2.5">
          {profile.locations.map((loc) => (
            <Card key={loc.id} className="flex items-center gap-3 p-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon name="pin" size={18} />
              </span>
              <div className="flex-1">
                <div className="font-semibold">{loc.label}</div>
                <div className="text-[13px] text-ink-muted">{loc.landmark}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Settings */}
        <SectionLabel className="mb-2.5 mt-6">{t("account")}</SectionLabel>
        <div className="grid gap-2.5 pb-6">
          <Card className="flex items-center justify-between p-4">
            <span className="flex items-center gap-2 font-medium">
              <Icon name="globe" size={18} className="text-ink-muted" />
              {t("language")}
            </span>
            <LangToggle />
          </Card>
          {isAuthed ? (
            <Button variant="secondary" onClick={signOut} className="text-rose-600">
              <Icon name="logout" size={18} /> {t("logOut")}
            </Button>
          ) : (
            <Button onClick={() => router.push("/customer/auth")}>{t("signIn")}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
