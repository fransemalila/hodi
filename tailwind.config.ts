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
        // Hodi brand — deep Tanzanian green
        brand: {
          50: "#eefbf4",
          100: "#d6f5e3",
          200: "#b0e9cd",
          300: "#7dd7af",
          400: "#46bd8c",
          500: "#1fa471",
          600: "#10885d",
          700: "#0c6c4c",
          800: "#0d5640",
          900: "#0c4636",
          950: "#04271e",
        },
        accent: {
          50: "#fff8ed",
          100: "#ffefd3",
          200: "#fedba5",
          300: "#fdc06d",
          400: "#fb9d3a",
          500: "#f97e15",
          600: "#ea6109",
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
