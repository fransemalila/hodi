"use client";

import type { Provider } from "@/lib/types";

// Route through the stylised street grid, in viewBox units (400 x 520).
// Kept in the band that stays visible under the status card and sheet.
const ROUTE: [number, number][] = [
  [70, 250],
  [70, 330],
  [200, 330],
  [200, 400],
  [300, 400],
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

function pointAt(t: number): [number, number] {
  const segs = ROUTE.slice(1).map((p, i) => {
    const a = ROUTE[i];
    return { a, b: p, len: Math.hypot(p[0] - a[0], p[1] - a[1]) };
  });
  const total = segs.reduce((s, x) => s + x.len, 0);
  let d = Math.min(Math.max(t, 0), 1) * total;
  for (const s of segs) {
    if (d <= s.len) {
      const k = s.len === 0 ? 0 : d / s.len;
      return [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k];
    }
    d -= s.len;
  }
  return ROUTE[ROUTE.length - 1];
}

/**
 * Illustrative live-tracking map. `progress` 0..1 moves the barber from their
 * start point to the customer's door. Swap for Google Maps / Mapbox once the
 * backend streams real GPS.
 */
export function LiveMap({ provider, progress, showRoute = true }: { provider: Provider; progress: number; showRoute?: boolean }) {
  const [x, y] = pointAt(progress);
  const dest = ROUTE[ROUTE.length - 1];
  const routeD = "M" + ROUTE.map((p) => p.join(" ")).join(" L");

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eef1ec]">
      <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* ocean */}
        <path d="M340 0 C320 120 372 220 350 330 C335 420 360 470 380 520 L400 520 L400 0Z" fill="#cfe3ea" />
        {/* parks */}
        <rect x="100" y="230" width="80" height="80" rx="10" fill="#d6e8d2" />
        <rect x="230" y="40" width="70" height="120" rx="10" fill="#d6e8d2" />
        {/* blocks */}
        {[
          [10, 10, 40, 40], [90, 10, 90, 40], [10, 90, 40, 80], [90, 90, 90, 80], [220, 210, 60, 100],
          [10, 210, 40, 100], [10, 350, 40, 160], [90, 350, 90, 70], [90, 440, 90, 70], [220, 350, 60, 30],
          [220, 420, 60, 90], [320, 350, 20, 40],
        ].map(([bx, by, bw, bh], i) => (
          <rect key={i} x={bx} y={by} width={bw} height={bh} rx="6" fill="#e2e6df" />
        ))}
        {/* roads */}
        <g stroke="#ffffff" strokeLinecap="round" fill="none">
          <path d="M0 70 H340 M0 190 H345 M0 330 H340 M0 400 H350" strokeWidth="14" />
          <path d="M70 0 V520 M200 0 V520 M300 170 V520" strokeWidth="14" />
          <path d="M0 470 C120 450 220 500 400 470" strokeWidth="9" />
        </g>
        {/* route */}
        {showRoute && (
          <>
            <path d={routeD} stroke="#0F3D2E" strokeOpacity="0.18" strokeWidth="10" fill="none" strokeLinejoin="round" />
            <path d={routeD} stroke="#0F3D2E" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" fill="none" strokeLinejoin="round" />
          </>
        )}

        {/* destination pin */}
        <g transform={`translate(${dest[0]} ${dest[1]})`}>
          <line x1="0" y1="0" x2="0" y2="-12" stroke="#0F3D2E" strokeWidth="2.5" />
          <circle cy="-32" r="22" fill="#0F3D2E" stroke="#fff" strokeWidth="4" />
          <path d="M-9 -30 L0 -39 L9 -30 V-22 H-9Z" fill="#C9A227" />
        </g>

        {/* barber */}
        <g style={{ transform: `translate(${x}px, ${y}px)`, transition: "transform 1s linear" }}>
          <circle r="26" fill="#C9A227" opacity="0.35">
            <animate attributeName="r" values="26;44" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.45;0" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle r="28" fill="#fff" />
          <clipPath id="barber-clip">
            <circle r="24" />
          </clipPath>
          {provider.image ? (
            <image href={provider.image} x="-24" y="-24" width="48" height="48" preserveAspectRatio="xMidYMid slice" clipPath="url(#barber-clip)" />
          ) : (
            <>
              <circle r="24" fill="#0F3D2E" />
              <text textAnchor="middle" dy="6" fontSize="17" fontWeight="700" fill="#fff">
                {initials(provider.name)}
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
