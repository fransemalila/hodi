"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scissors, MapPin, Smartphone, ChevronRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/barber/ui";
import { LangToggle } from "@/components/LangToggle";
import { useI18n, TKey } from "@/lib/i18n";
import { useStore } from "@/lib/store";

const slides: { icon: LucideIcon; title: TKey; description: TKey }[] = [
  { icon: Scissors, title: "ob1Title", description: "ob1Desc" },
  { icon: MapPin, title: "ob2Title", description: "ob2Desc" },
  { icon: Smartphone, title: "ob3Title", description: "ob3Desc" },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { t } = useI18n();
  const { completeOnboarding } = useStore();

  const finish = () => {
    completeOnboarding();
    router.push("/login");
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    else finish();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <div className="flex items-center justify-between p-6">
        <LangToggle />
        <button onClick={finish} className="text-gray-500 transition-colors hover:text-[#0F3D2E]">
          {t("skip")}
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 pb-12">
        <div className="mb-12 flex h-32 w-32 items-center justify-center rounded-full bg-[#0F3D2E]/5">
          <div key={currentSlide} className="flex h-24 w-24 animate-fade-up items-center justify-center rounded-full bg-[#0F3D2E]">
            <Icon className="h-12 w-12 text-[#C9A227]" strokeWidth={2} />
          </div>
        </div>
        <h2 key={slide.title} className="mb-4 animate-fade-up text-center text-3xl font-bold text-[#0F3D2E]">
          {t(slide.title)}
        </h2>
        <p className="max-w-sm text-center text-lg text-gray-600">{t(slide.description)}</p>
      </div>

      <div className="px-8 pb-12">
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-[#0F3D2E]" : "w-2 bg-gray-300"}`}
            />
          ))}
        </div>
        <Button onClick={handleNext} className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90">
          {currentSlide === slides.length - 1 ? t("getStarted") : t("next")}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
