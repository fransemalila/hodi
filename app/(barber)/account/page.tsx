"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Phone, Globe, MapPin, Plus, Trash2, Gift, Share2, Scissors, LayoutDashboard, RotateCcw, LogOut, ChevronRight, Check } from "lucide-react";
import { Button, Input } from "@/components/barber/ui";
import { BottomNav, Protected, Sheet } from "@/components/barber/shell";
import { LocationForm } from "@/components/barber/LocationForm";
import { LogoMark } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function AccountPage() {
  return (
    <Protected>
      <AccountScreen />
    </Protected>
  );
}

function referralCode(name: string, phone: string) {
  const letters = name.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  return `HODI-${letters}${phone.replace(/\D/g, "").slice(-3)}`;
}

function AccountScreen() {
  const router = useRouter();
  const { t, lang, setLang } = useI18n();
  const { profile, updateProfile, removeLocation, signOut, resetDemo } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);

  const code = referralCode(profile.name, profile.phone);
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const share = async () => {
    const text = `${t("referDesc")} ${code} · https://hodi.co.tz`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "HODI", text });
        return;
      }
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* user dismissed share sheet */
    }
  };

  const row = "flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-gray-50";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <div className="relative overflow-hidden rounded-b-[32px] bg-[#0F3D2E] px-6 pb-8 pt-12">
        <LogoMark tone="white" className="pointer-events-none absolute -right-10 -top-6 h-48 w-48 opacity-[0.05]" />
        <h1 className="mb-6 text-2xl font-bold text-white">{t("account")}</h1>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227] text-xl font-bold text-[#0F3D2E]">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-bold text-white">{profile.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-white/70">
              <Phone className="h-3.5 w-3.5" /> {profile.phone}
            </p>
          </div>
          <button
            onClick={() => {
              setName(profile.name);
              setEditing(true);
            }}
            aria-label={t("editProfile")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <Pencil className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-5 px-6 py-6">
        {/* Referral */}
        <section className="rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#b08d1f] p-5 text-[#0F3D2E] shadow-sm">
          <div className="mb-2 flex items-center gap-2 font-bold">
            <Gift className="h-5 w-5" /> {t("referAFriend")}
          </div>
          <p className="mb-4 text-sm text-[#0F3D2E]/80">{t("referDesc")}</p>
          <div className="flex items-center gap-2">
            <span className="flex-1 rounded-xl bg-white/40 px-4 py-3 font-mono font-bold tracking-wider">{code}</span>
            <Button onClick={share} className="h-12 rounded-xl bg-[#0F3D2E] px-4 text-sm text-white">
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? t("copied") : t("share")}
            </Button>
          </div>
        </section>

        {/* Language */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4">
            <Globe className="h-5 w-5 text-[#0F3D2E]" />
            <span className="flex-1 font-medium text-gray-800">{t("language")}</span>
            <div className="grid grid-cols-2 rounded-full bg-gray-100 p-1 text-sm font-semibold">
              {(["sw", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-3 py-1.5 transition ${lang === l ? "bg-[#0F3D2E] text-white" : "text-gray-500"}`}
                >
                  {l === "sw" ? "Kiswahili" : "English"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Locations */}
        <section id="locations" className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <h2 className="px-5 pb-1 pt-4 text-sm font-semibold uppercase tracking-wide text-gray-500">{t("myLocations")}</h2>
          <div className="divide-y divide-gray-100">
            {profile.locations.map((l) => {
              const isDefault = l.id === profile.defaultLocationId;
              return (
                <div key={l.id} className="flex items-start gap-3 px-5 py-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A227]" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-semibold text-[#0F3D2E]">
                      {l.label}
                      {isDefault && (
                        <span className="rounded-full bg-[#0F3D2E]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#0F3D2E]">{t("defaultLabel")}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{l.landmark}</p>
                    {!isDefault && (
                      <button onClick={() => updateProfile({ defaultLocationId: l.id })} className="mt-1 text-xs font-semibold text-[#a3801d]">
                        {t("makeDefault")}
                      </button>
                    )}
                  </div>
                  {profile.locations.length > 1 && (
                    <button onClick={() => removeLocation(l.id)} aria-label={t("remove")} className="rounded-full p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={() => setAdding(true)} className={`${row} border-t border-gray-100 font-semibold text-[#0F3D2E]`}>
            <Plus className="h-5 w-5" /> {t("addLocation")}
          </button>
        </section>

        {/* Demo surfaces */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <h2 className="px-5 pb-1 pt-4 text-sm font-semibold uppercase tracking-wide text-gray-500">{t("demoSurfaces")}</h2>
          <Link href="/provider" className={row}>
            <Scissors className="h-5 w-5 text-[#0F3D2E]" />
            <span className="flex-1">
              <span className="block font-medium text-gray-800">{t("providerApp")}</span>
              <span className="block text-xs text-gray-500">{t("providerAppDesc")}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
          <Link href="/admin" className={`${row} border-t border-gray-100`}>
            <LayoutDashboard className="h-5 w-5 text-[#0F3D2E]" />
            <span className="flex-1">
              <span className="block font-medium text-gray-800">{t("adminApp")}</span>
              <span className="block text-xs text-gray-500">{t("adminAppDesc")}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
          <button
            onClick={() => {
              resetDemo();
              router.replace("/");
            }}
            className={`${row} border-t border-gray-100 text-gray-700`}
          >
            <RotateCcw className="h-5 w-5" /> {t("resetDemo")}
          </button>
        </section>

        <button
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-semibold text-rose-600 shadow-sm hover:bg-rose-50"
        >
          <LogOut className="h-5 w-5" /> {t("logOut")}
        </button>

        <p className="text-center text-xs text-gray-400">HODI · v1.0 · {t("demoNote")}</p>
      </div>

      <BottomNav />

      <Sheet open={editing} onClose={() => setEditing(false)} title={t("editProfile")}>
        <label className="mb-1.5 block text-sm text-gray-600">{t("name")}</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="mb-5 h-12 rounded-xl border-gray-200 px-4" autoFocus />
        <Button
          onClick={() => {
            if (name.trim()) updateProfile({ name: name.trim() });
            setEditing(false);
          }}
          disabled={!name.trim()}
          className="h-12 w-full rounded-full bg-[#0F3D2E] text-white disabled:opacity-50"
        >
          {t("save")}
        </Button>
      </Sheet>

      <Sheet open={adding} onClose={() => setAdding(false)} title={t("addLocation")}>
        <LocationForm onSaved={() => setAdding(false)} />
      </Sheet>
    </div>
  );
}
