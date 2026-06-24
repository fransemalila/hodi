"use client";

import { Icon } from "./Icon";
import { cx } from "./ui";

/** Stylised street-map placeholder (no map API key needed for the demo). */
export function MapPlaceholder({ landmark, className }: { landmark: string; className?: string }) {
  return (
    <div className={cx("relative h-32 overflow-hidden rounded-xl2 border border-line bg-brand-50", className)}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="streets" width="56" height="56" patternUnits="userSpaceOnUse">
            <rect width="56" height="56" fill="#eefbf4" />
            <path d="M0 28h56M28 0v56" stroke="#cdeedd" strokeWidth="6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#streets)" />
        <path d="M-10 90 Q120 40 320 110" stroke="#7dd7af" strokeWidth="5" fill="none" />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-700">
        <span className="relative flex h-3 w-3">
          <span className="pulse-ring absolute inline-flex h-full w-full text-brand-500" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-600 ring-2 ring-white" />
        </span>
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-2xs font-semibold text-ink-soft shadow-xs">
        <Icon name="pin" size={13} className="shrink-0 text-brand-600" />
        <span className="truncate">{landmark}</span>
      </div>
    </div>
  );
}
