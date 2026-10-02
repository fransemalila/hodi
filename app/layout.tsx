import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

// Inter (variable, latin subset) self-hosted so builds never depend on
// Google Fonts being reachable. OFL licence in app/fonts/Inter-LICENSE.txt.
const inter = localFont({
  src: "./fonts/InterVariable-latin.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});

// Absolute URLs for OG/Twitter cards. Vercel sets VERCEL_PROJECT_PRODUCTION_URL
// (production domain) and VERCEL_URL (per-deployment); fall back to localhost.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

const title = "HODI · Tunakuletea kinyozi mlangoni";
const description =
  "Book a professional, verified barber to your door in Dar es Salaam. Track arrival live and pay with M-Pesa, Airtel Money, Tigo Pesa, HaloPesa or cash.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s · HODI" },
  description,
  applicationName: "HODI",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: "HODI", statusBarStyle: "black-translucent" },
  openGraph: {
    type: "website",
    siteName: "HODI",
    title,
    description,
    locale: "sw_TZ",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "HODI" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0F3D2E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
