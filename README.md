# HODI — Frontend

_Tunakuletea kinyozi mlangoni_ — request a professional barber to your door in
Dar es Salaam. Mobile-first, deep-green (`#0F3D2E`) + gold (`#C9A227`) brand.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind**, deployable to Vercel.

## Surfaces
| Surface | Routes | Audience |
|---|---|---|
| **Customer app** | `/`, `/onboarding`, `/login`, `/home`, `/barber/[id]`, `/booking/[barberId]`, `/tracking/[bookingId]`, `/payment/[bookingId]`, `/rating/[bookingId]`, `/history` | Customers (the main app) |
| **Provider app** | `/provider`, `/provider/jobs`, `/provider/earnings` | Barbers |
| **Admin panel** | `/admin`, `/admin/providers`, `/admin/bookings`, `/admin/services`, `/admin/reports` | Ops team |

The customer app follows the HODI Figma prototype and is fully wired end to end:
**Splash → Onboarding → Phone + OTP login → Home → Barber profile → Booking →
Live tracking → Payment → Rating → Bookings → Receipt → Account**.

All three surfaces share one client-side store (persisted to `localStorage`
and synced across tabs). A booking made in the customer app shows up as an
incoming request in the provider app (`/provider`, logged in as Juma) and in
the admin bookings table; status changes made in either place reflect live in
the customer's tracking screen. Swahili is the default language, with English
via the SW/EN toggle.

**Demo notes:** any 6 digits pass OTP; the number `712 000 111` signs in as the
seeded customer "Asha" with booking history. On-demand bookings auto-advance
(accepted → on the way → arrived → in progress → completed) while the
tracking screen is open; the provider app can advance them manually too.
Mobile-money payment simulates an STK push. "Reset demo data" lives under
Account.

## Brand
The logo is traced 1:1 from `Hodi_Logo.pdf` (open-door "O" mark):
- React: `components/brand/Logo.tsx` → `<Wordmark />`, `<LogoMark />`, `<LogoTile />`
- Files: `public/brand/*.svg` (wordmark in green/white/mono, mark in gold/green/white)
- App icons: `public/icon*.png`, `apple-touch-icon.png`, `app/favicon.ico`; social card `public/og.png`
- Colours: green `#0F3D2E`, gold `#C9A227`. Font: Inter, self-hosted in `app/fonts/`.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and import `fransemalila/hodi`.
2. Framework is auto-detected as Next.js; keep the defaults (build `next build`,
   no env vars required). `vercel.json` pins the Cape Town region (`cpt1`,
   closest to Dar es Salaam) and adds security headers.
3. Deploy. Every push gets a preview URL; pushes to `main` go to production.

Optional: set `NEXT_PUBLIC_SITE_URL` to your custom domain (e.g.
`https://hodi.co.tz`) so social-share cards use it. Without it, Vercel's own
production URL is used automatically.

## Project layout
```
app/
  (barber)/             customer app: splash, onboarding, login, home, barber/[id],
                        booking, tracking, payment, rating, history, receipt, account
  provider/             provider app (dashboard, jobs, earnings)
  admin/                admin dashboard (overview, providers, bookings, services, reports)
components/
  brand/Logo.tsx        official HODI wordmark + door mark (SVG)
  barber/               customer-app UI: shell (nav, auth guard, sheet), LiveMap, forms
  ui.tsx, Icon.tsx, …   shared primitives for provider/admin
lib/
  store.tsx             shared state for all three apps (localStorage + cross-tab sync)
  mock-data.ts          services, providers, seed bookings & reviews
  simulation.ts         demo booking lifecycle until the backend pushes real events
  i18n.tsx              Swahili / English strings
```

## Not in the frontend (needs backend / integrations)
Real OTP/SMS, FCM push, payment settlement (Selcom / AzamPay STK push), live
GPS maps, auth/DB, provider auto-matching, NIDA verification. The store's
actions (`createBooking`, `payBooking`, `advanceStatus`, …) are the seams where
API calls go.
