// HODI brand marks, traced 1:1 from the official logo artwork (Hodi_Logo.pdf).
// The "O" is the open-door mark: a gold disc with a door swinging open.

export const BRAND_GREEN = "#0F3D2E";
export const BRAND_GOLD = "#C9A227";

const H =
  "M527.48 377.7 475.68 377.93 475.7 269.37 351.87 269.36 351.84 377.84 300.47 377.84 300.48 118.81 351.86 118.82 351.92 222.54 475.64 222.54 475.62 118.71 527.43 118.77Z";
const I = "M1215.55 377.89H1162.52V118.61H1215.55Z";
const D =
  "M1063.04 289.48C1049.82 316.56 1023.85 332.7 993.63 334.46L931.08 334.95 931.06 163.4 991.19 163.53C1007.54 163.57 1022.54 169.17 1036.34 177.31 1072.11 202.38 1081.57 251.48 1063.04 289.48M1112.96 195.47C1100.16 165.25 1076.65 142.2 1046.71 129.43 1029.06 122.5 1011.58 118.95 992.33 118.93L878.89 118.81 878.93 377.81 993.55 377.77C1014.56 377.76 1033.77 373.55 1052.77 365.33 1116.19 334.69 1139.98 259.28 1112.96 195.47";
const DOOR =
  "M691.63 280.38C696.72 280.38 700.85 284.5 700.85 289.59 700.85 294.69 696.72 298.81 691.63 298.81 686.54 298.81 682.41 294.69 682.41 289.59 682.41 284.5 686.54 280.38 691.63 280.38M793.85 147C738.09 95.34 651.71 100.55 601.39 157.39 585.89 174.88 574.29 195.4 568.8 218.84 557.26 268.17 574.15 318.25 612.1 351.58 628.46 365.95 647.27 375.65 667.86 383.09L707.16 394.93C708.46 395.32 710.13 394.88 710.79 394.43 711.88 393.66 712.54 391.98 712.55 390.16L712.63 374.29 712.44 194.63 647.47 158.21C646.18 157.48 645.55 157.23 645.59 156.03 645.66 154.48 646.88 154.19 648.73 154.39L674.34 157.25 721.49 161.87 758.65 161.91 759.02 374.07C780.99 364.61 800.3 347.72 814.51 327.7 855.4 270.07 844.63 194.04 793.85 147";

type Tone = "green" | "white" | "gold";

const TEXT: Record<Tone, string> = { green: BRAND_GREEN, white: "#FFFFFF", gold: BRAND_GOLD };

/** Full "HODI" wordmark. `tone` colours the letters; the door "O" stays gold unless `mono`. */
export function Wordmark({
  tone = "green",
  mono = false,
  className,
  title = "HODI",
}: {
  tone?: Tone;
  mono?: boolean;
  className?: string;
  title?: string;
}) {
  const text = TEXT[tone];
  return (
    <svg viewBox="300 111 916 285" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <g fill={text}>
        <path d={H} />
        <path d={I} />
        <path d={D} />
      </g>
      <path d={DOOR} fill={mono ? text : BRAND_GOLD} />
    </svg>
  );
}

/** The open-door mark on its own. */
export function LogoMark({
  tone = "gold",
  className,
  style,
  title = "HODI",
}: {
  tone?: Tone;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}) {
  return (
    <svg viewBox="565 111 275 285" className={className} style={style} role="img" aria-label={title}>
      <title>{title}</title>
      <path d={DOOR} fill={TEXT[tone]} />
    </svg>
  );
}

/** Square app-icon style tile: mark centred on a brand-green rounded square. */
export function LogoTile({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: BRAND_GREEN,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <LogoMark tone="gold" style={{ width: "62%", height: "62%" }} />
    </span>
  );
}
