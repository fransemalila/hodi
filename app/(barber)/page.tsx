"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { hydrated, isAuthed, onboarded } = useStore();

  useEffect(() => {
    if (!hydrated) return;
    const dest = isAuthed ? "/home" : onboarded ? "/login" : "/onboarding";
    const timer = setTimeout(() => router.replace(dest), 2200);
    return () => clearTimeout(timer);
  }, [hydrated, isAuthed, onboarded, router]);

  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden bg-[#0F3D2E] px-6">
      <LogoMark tone="white" className="pointer-events-none absolute -right-24 -top-16 h-80 w-80 opacity-[0.04]" />
      <div className="flex flex-col items-center animate-fade-up">
        <Wordmark tone="white" className="w-60" />
        <p className="mt-6 text-center text-lg font-medium text-[#C9A227]">{t("tagline")}</p>
      </div>
      <div className="absolute bottom-14 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
