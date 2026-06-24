"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Button, Field, Input } from "@/components/ui";
import { TopBar } from "@/components/MobileShell";
import { LangToggle } from "@/components/LangToggle";

type Step = "phone" | "otp" | "profile";

export default function Auth() {
  const { t } = useI18n();
  const router = useRouter();
  const { signIn } = useStore();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("+255 ");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [referral, setReferral] = useState("");

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <TopBar back={() => (step === "phone" ? router.back() : setStep("phone"))} right={<LangToggle />} />

      <div className="flex flex-1 flex-col px-6 pt-4">
        <div className="mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-2xl font-extrabold text-white">
            H
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">{t("welcomeToHodi")}</h1>
          <p className="text-ink-muted">{t("signInToContinue")}</p>
        </div>

        {step === "phone" && (
          <div className="grid gap-4">
            <Field label={t("phoneNumber")}>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+255 712 345 678"
              />
            </Field>
            <Button onClick={() => setStep("otp")} disabled={phone.trim().length < 9}>
              {t("sendOtp")}
            </Button>
          </div>
        )}

        {step === "otp" && (
          <div className="grid gap-4">
            <p className="text-sm text-ink-muted">
              {t("otpSent")} → <span className="font-semibold text-ink">{phone}</span>
            </p>
            <Field label={t("enterOtp")}>
              <Input
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                className="text-center text-2xl tracking-[0.5em]"
              />
            </Field>
            <p className="text-xs text-ink-muted">Demo: weka namba yoyote / enter any 4–6 digits.</p>
            <Button onClick={() => setStep("profile")} disabled={otp.length < 4}>
              {t("verify")}
            </Button>
          </div>
        )}

        {step === "profile" && (
          <div className="grid gap-4">
            <Field label={t("yourName")}>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Asha Mwita" />
            </Field>
            <Field label={t("referralOptional")}>
              <Input
                value={referral}
                onChange={(e) => setReferral(e.target.value.toUpperCase())}
                placeholder="ASHA255"
              />
            </Field>
            <Button
              onClick={() => {
                signIn(name || "Asha", phone, referral || undefined);
                router.push("/customer");
              }}
              disabled={!name.trim()}
            >
              {t("continue")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
