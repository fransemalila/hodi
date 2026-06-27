import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hodi brand — deep barber green (#0F3D2E) + gold accent (#C9A227)
        brand: {
          50: "#eef5f1",
          100: "#d4e6dd",
          200: "#a9cdbb",
          300: "#76ac95",
          400: "#46896f",
          500: "#246b52",
          600: "#14543f",
          700: "#0F3D2E",
          800: "#0c3325",
          900: "#08231a",
          950: "#051712",
        },
        accent: {
          50: "#fbf7ea",
          100: "#f5ebc6",
          200: "#ecd88a",
          300: "#e0c155",
          400: "#d4ad33",
          500: "#C9A227",
          600: "#a3801d",
        },
        // Cool neutral scale for a calmer, more "product" surface
        ink: {
          DEFAULT: "#0c1512",
          soft: "#384944",
          muted: "#6a7a74",
          faint: "#9aa8a2",
        },
        line: {
          DEFAULT: "#e6ebe8",
          soft: "#eef2f0",
        },
        surface: {
          DEFAULT: "#ffffff",
          sunken: "#f4f7f5",
          raised: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        xs: "0 1px 2px rgba(12,21,18,0.05)",
        card: "0 1px 2px rgba(12,21,18,0.04), 0 2px 8px rgba(12,21,18,0.05)",
        raised: "0 2px 4px rgba(12,21,18,0.05), 0 12px 28px -8px rgba(12,21,18,0.14)",
        nav: "0 -1px 0 rgba(12,21,18,0.05), 0 -8px 24px -12px rgba(12,21,18,0.12)",
        focus: "0 0 0 3px rgba(16,136,93,0.18)",
      },
      borderRadius: {
        xl2: "1.125rem",
        "2xl": "1.375rem",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
