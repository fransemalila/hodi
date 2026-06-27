"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/onboarding"), 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#0F3D2E] px-6">
      <div className="flex flex-col items-center gap-6 animate-fade-up">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-[#C9A227]/30 blur-xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#C9A227]">
            <Scissors className="h-12 w-12 text-[#0F3D2E]" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-6xl font-bold tracking-wider text-white">HODI</h1>
        <p className="mt-2 text-center text-lg text-[#C9A227]">Tunakuletea kinyozi mlangoni</p>
      </div>
    </div>
  );
}
