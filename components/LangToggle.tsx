"use client";

import { useI18n } from "@/lib/i18n";
import { cx } from "./ui";

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={cx(
        "inline-flex rounded-full border border-line bg-white p-0.5 text-2xs font-bold",
        className,
      )}
    >
      {(["sw", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cx(
            "rounded-full px-2.5 py-1 transition",
            lang === l ? "bg-brand-700 text-white shadow-xs" : "text-ink-muted",
          )}
        >
          {l === "sw" ? "SW" : "EN"}
        </button>
      ))}
    </div>
  );
}
