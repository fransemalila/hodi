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

The customer app is ported from the HODI Figma prototype and follows the full
flow: **Splash → Onboarding → Login → Home → Barber Profile → Booking → Live
Tracking → Payment → Rating → History**. Icons: `lucide-react`. Photos: Unsplash.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy to Vercel
Import the repo at [vercel.com/new](https://vercel.com/new) — auto-detected as
Next.js, no config or env vars needed. Pushes to `main` auto-deploy.

## Project layout
```
app/
  (barber)/             customer app — splash, onboarding, login, home,
                        barber/[id], booking, tracking, payment, rating, history
  provider/             provider app (dashboard, jobs, earnings)
  admin/                admin dashboard (overview, providers, bookings, services, reports)
components/
  barber/ui.tsx         Button / Input / Textarea for the customer screens
  ui.tsx, Icon.tsx, …   shared primitives for provider/admin
lib/
  barber-data.ts        services, barbers, reviews, history (customer app)
  store.tsx, i18n.tsx, mock-data.ts, …   state + data for provider/admin
```

## Not in the frontend (needs backend / integrations)
Real OTP/SMS, FCM push, payment settlement (Selcom / AzamPay STK push), live
maps, auth/DB, provider auto-matching, NIDA verification.
