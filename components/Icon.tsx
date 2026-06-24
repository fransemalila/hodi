import { SVGProps } from "react";

// A small, consistent line-icon set (24px grid, 1.75 stroke, round caps).
// Using a curated inline set keeps the bundle tiny and avoids an icon dependency.
const paths: Record<string, JSX.Element> = {
  home: (
    <>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M9.5 19.5v-5h5v5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z" />
      <path d="M9 8h6M9 11.5h6M9 15h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 14.6c2 .6 3.5 2.3 3.5 4.9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21c4.5-4.3 7-7.6 7-11a7 7 0 1 0-14 0c0 3.4 2.5 6.7 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <path d="M6.6 3.5 9 4l1 3.5-1.8 1.4a12 12 0 0 0 5.4 5.4L15 12.5l3.5 1 .5 2.4a2 2 0 0 1-2 2.4A14.5 14.5 0 0 1 4.2 6a2 2 0 0 1 2.4-2.5z" />
  ),
  star: (
    <path d="m12 4 2.3 4.9 5.2.7-3.8 3.6 1 5.3L12 16.5 7.3 18.5l1-5.3-3.8-3.6 5.2-.7z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.8" />
    </>
  ),
  chevronRight: <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  chevronLeft: <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />,
  chevronDown: <path d="m5.5 9.5 6.5 6.5 6.5-6.5" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  zap: <path d="M13 3 5 13h5l-1 8 8-10h-5z" />,
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 9.5h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4.4 3 7.5 7 9 4-1.5 7-4.6 7-9V6z" />
      <path d="m9 12 2 2 4-4.2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" />
    </>
  ),
  gift: (
    <>
      <path d="M4.5 11h15v8.5h-15z" />
      <path d="M3.5 7.5h17V11h-17zM12 7.5v12" />
      <path d="M12 7.5C11 5 8 4.2 7 6c-1 1.8 2 1.7 5 1.5zM12 7.5c1-2.5 4-3.3 5-1.5 1 1.8-2 1.7-5 1.5z" />
    </>
  ),
  wallet: (
    <>
      <rect x="3.5" y="6" width="17" height="13" rx="2.5" />
      <path d="M3.5 9.5h12a2 2 0 0 1 0 4h-12" />
      <circle cx="15.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6.5" cy="7" r="2.5" />
      <circle cx="6.5" cy="17" r="2.5" />
      <path d="M8.7 8.4 20 17M8.7 15.6 20 7M12 12l-3 2.2" />
    </>
  ),
  razor: (
    <>
      <rect x="7" y="3.5" width="10" height="4.5" rx="1.5" />
      <path d="M8 8h8M11 8v3.5h2V8M11.8 11.5v8M12.2 11.5v8" />
    </>
  ),
  child: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 11h.01M15 11h.01" />
      <path d="M9.5 15c.7.8 1.6 1.2 2.5 1.2s1.8-.4 2.5-1.2" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 4c.4 2.8 1.2 3.6 4 4-2.8.4-3.6 1.2-4 4-.4-2.8-1.2-3.6-4-4 2.8-.4 3.6-1.2 4-4z" />
      <path d="M18.5 13.5c.2 1.4.6 1.8 2 2-1.4.2-1.8.6-2 2-.2-1.4-.6-1.8-2-2 1.4-.2 1.8-.6 2-2z" />
    </>
  ),
  barChart: (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-6M12 20V8M17 20v-9" />
    </>
  ),
  tag: (
    <>
      <path d="M4 4.5h7.5L20 13l-7 7-8.5-8.5z" />
      <circle cx="8.5" cy="9" r="1.4" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 8h10M18 8h2M4 16h2M10 16h10" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="8" cy="16" r="2" />
    </>
  ),
  navigation: <path d="M20 4 4 11l7 2 2 7z" />,
  power: (
    <>
      <path d="M12 4v8" />
      <path d="M7.5 7a7 7 0 1 0 9 0" />
    </>
  ),
  bell: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  arrowRight: <path d="M5 12h14M14 6l6 6-6 6" />,
  smartphone: (
    <>
      <rect x="6.5" y="3" width="11" height="18" rx="2.5" />
      <path d="M10.5 18h3" />
    </>
  ),
  banknote: (
    <>
      <rect x="3" y="6.5" width="18" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 9.5h.01M17.5 14.5h.01" />
    </>
  ),
  note: (
    <>
      <path d="M5 4.5h11l3 3V19.5H5z" />
      <path d="M15.5 4.5V8h3.2M8 12h8M8 15.5h5" />
    </>
  ),
  chat: (
    <path d="M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z" />
  ),
  logout: (
    <>
      <path d="M14 4.5H6v15h8" />
      <path d="M11 12h9M16 8l4 4-4 4" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M5 16V6a2 2 0 0 1 2-2h8" />
    </>
  ),
  filter: <path d="M4 6h16l-6 7v5l-4 1.5V13z" />,
  shield: (
    <path d="M12 3.5 5 6v5.5c0 4.4 3 7.5 7 9 4-1.5 7-4.6 7-9V6z" />
  ),
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 20,
  filled = false,
  className,
  strokeWidth = 1.75,
  ...rest
}: {
  name: IconName;
  size?: number;
  filled?: boolean;
  strokeWidth?: number;
} & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
