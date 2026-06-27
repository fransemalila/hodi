"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scissors, MapPin, Smartphone, ChevronRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/barber/ui";

const slides: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Scissors, title: "Request a Barber Anytime", description: "Professional barbers at your fingertips, ready to serve you wherever you are." },
  { icon: MapPin, title: "Track Arrival to Your Door", description: "Real-time tracking so you know exactly when your barber will arrive." },
  { icon: Smartphone, title: "Pay Easily with Mobile Money", description: "M-Pesa, Airtel Money, Tigo Pesa - pay with your preferred method." },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    else router.push("/login");
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <div className="flex justify-end p-6">
        <button onClick={() => router.push("/login")} className="text-gray-500 transition-colors hover:text-[#0F3D2E]">
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 pb-12">
        <div className="mb-12 flex h-32 w-32 items-center justify-center rounded-full bg-[#0F3D2E]/5">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0F3D2E]">
            <Icon className="h-12 w-12 text-[#C9A227]" strokeWidth={2} />
          </div>
        </div>
        <h2 key={slide.title} className="mb-4 animate-fade-up text-center text-3xl font-bold text-[#0F3D2E]">{slide.title}</h2>
        <p className="max-w-sm text-center text-lg text-gray-600">{slide.description}</p>
      </div>

      <div className="px-8 pb-12">
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-[#0F3D2E]" : "w-2 bg-gray-300"}`}
            />
          ))}
        </div>
        <Button onClick={handleNext} className="h-14 w-full rounded-full bg-[#0F3D2E] text-lg text-white hover:bg-[#0F3D2E]/90">
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
