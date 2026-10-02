"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, User, Gift } from "lucide-react";
import { Button, Input } from "@/components/barber/ui";
import { Wordmark } from "@/components/brand/Logo";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import { isValidTzPhone, normalizePhone, useStore } from "@/lib/store";

type Step = "phone" | "otp" | "name";
const OTP_LEN = 6;
const RESEND_SECS = 30;

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { profile, signIn, isAuthed, hydrated } = useStore();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LEN).fill(""));
  const [resendIn, setResendIn] = useState(RESEND_SECS);
  const [verifying, setVerifying] = useState(false);
  const [name, setName] = useState("");
  const [referral, setReferral] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (hydrated && isAuthed) router.replace("/home");
  }, [hydrated, isAuthed, router]);

  useEffect(() => {
    if (step !== "otp") return;
    const id = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [step]);

  const sendCode = () => {
    if (!isValidTzPhone(phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    setOtp(Array(OTP_LEN).fill(""));
    setResendIn(RESEND_SECS);
    setStep("otp");
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const setDigit = (i: number, v: string) => {
    const digits = v.replace(/\D/g, "");
    if (!digits) {
      setOtp((prev) => prev.map((d, j) => (j === i ? "" : d)));
      return;
    }
    // Support pasting the whole code into any box.
    setOtp((prev) => {
      const next = [...prev];
      digits
        .slice(0, OTP_LEN - i)
        .split("")
        .forEach((d, k) => (next[i + k] = d));
      return next;
    });
    otpRefs.current[Math.min(i + digits.length, OTP_LEN - 1)]?.focus();
  };

  const code = otp.join("");
  const fullPhone = normalizePhone(phone);
  const returning = fullPhone === profile.phone;

  const verify = () => {
    if (code.length !== OTP_LEN) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (returning) {
        signIn(profile.name, fullPhone);
        router.replace("/home");
      } else {
        setStep("name");
      }
    }, 900);
  };

  // auto-submit once all digits are in
  useEffect(() => {
    if (step === "otp" && code.length === OTP_LEN && !verifying) verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, step]);

  const finish = () => {
    if (!name.trim()) return;
    signIn(name.trim(), fullPhone, referral.trim() || undefined);
    router.replace("/home");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      {/* Header */}
      <div className="relative rounded-b-[40px] bg-[#0F3D2E] px-8 pb-32 pt-14">
        <div className="absolute right-6 top-6">
          <LangToggle className="border-white/20" />
        </div>
        {step !== "phone" && (
          <button
            onClick={() => setStep(step === "name" ? "otp" : "phone")}
            aria-label={t("back")}
            className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
        )}
        <div className="flex flex-col items-center">
          <Wordmark tone="white" className="mb-4 w-40" />
          <p className="text-sm text-[#C9A227]">{t("tagline")}</p>
        </div>
      </div>

      <div className="-mt-20 flex-1 px-6 pb-10">
        <div key={step} className="animate-fade-up rounded-3xl bg-white p-7 shadow-lg">
          {step === "phone" && (
            <>
              <h2 className="mb-2 text-2xl font-bold text-[#0F3D2E]">{t("welcomeBack")}</h2>
              <p className="mb-7 text-gray-600">{t("enterPhone")}</p>

              <label htmlFor="phone" className="mb-2 block text-sm text-gray-600">
                {t("phoneNumber")}
              </label>
              <div className="flex gap-3">
                <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <span className="font-medium text-[#0F3D2E]">+255</span>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="712 345 678"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && sendCode()}
                    className={`h-14 rounded-xl pl-12 text-lg ${phoneError ? "border-rose-400" : "border-gray-200"}`}
                  />
                </div>
              </div>
              {phoneError && <p className="mt-2 text-sm text-rose-600">{t("invalidPhone")}</p>}

              <Button
                onClick={sendCode}
                className="mt-6 h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90"
              >
                {t("sendOtp")}
              </Button>

              <p className="mt-7 text-center text-xs text-gray-500">
                {t("termsPrefix")} <span className="text-[#0F3D2E] underline">{t("terms")}</span> {t("and")}{" "}
                <span className="text-[#0F3D2E] underline">{t("privacy")}</span>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 className="mb-2 text-2xl font-bold text-[#0F3D2E]">{t("enterOtp")}</h2>
              <p className="mb-1 text-gray-600">{t("otpSentTo")}</p>
              <p className="mb-6 font-semibold text-[#0F3D2E]">{fullPhone}</p>

              <div className="flex justify-between gap-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    value={d}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${i + 1}`}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !d && i > 0) otpRefs.current[i - 1]?.focus();
                    }}
                    className="h-14 w-full min-w-0 rounded-xl border-2 border-gray-200 text-center text-xl font-bold text-[#0F3D2E] outline-none transition focus:border-[#0F3D2E]"
                  />
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-[#C9A227]/10 px-3 py-2 text-center text-xs font-medium text-[#8a6d12]">
                {t("demoOtpHint")}
              </p>

              <Button
                onClick={verify}
                disabled={code.length !== OTP_LEN || verifying}
                className="mt-6 h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90 disabled:opacity-50"
              >
                {verifying ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  t("verify")
                )}
              </Button>

              <div className="mt-5 flex items-center justify-between text-sm">
                <button onClick={() => setStep("phone")} className="font-medium text-gray-500 hover:text-[#0F3D2E]">
                  {t("changeNumber")}
                </button>
                {resendIn > 0 ? (
                  <span className="text-gray-400">
                    {t("resendIn")} 0:{String(resendIn).padStart(2, "0")}
                  </span>
                ) : (
                  <button onClick={sendCode} className="font-semibold text-[#C9A227]">
                    {t("resendCode")}
                  </button>
                )}
              </div>
            </>
          )}

          {step === "name" && (
            <>
              <h2 className="mb-2 text-2xl font-bold text-[#0F3D2E]">{t("whatsYourName")}</h2>
              <p className="mb-6 text-gray-600">{t("nameHint")}</p>

              <label htmlFor="name" className="mb-2 block text-sm text-gray-600">
                {t("yourName")}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  autoFocus
                  autoComplete="given-name"
                  placeholder="Asha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && finish()}
                  className="h-14 rounded-xl border-gray-200 pl-12 text-lg"
                />
              </div>

              <label htmlFor="ref" className="mb-2 mt-5 block text-sm text-gray-600">
                {t("referralOptional")}
              </label>
              <div className="relative">
                <Gift className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="ref"
                  placeholder="HODI-XXXX"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value.toUpperCase())}
                  className="h-14 rounded-xl border-gray-200 pl-12 text-lg uppercase"
                />
              </div>

              <Button
                onClick={finish}
                disabled={!name.trim()}
                className="mt-6 h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90 disabled:opacity-50"
              >
                {t("continue")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
