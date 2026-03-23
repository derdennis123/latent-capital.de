# CLAUDE.md — Latent Capital Development Notes

## Project Overview

- **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **CMS**: Ghost (headless, self-hosted on Railway)
- **Payments**: Stripe (connected via Ghost's native Stripe integration)
- **Email**: Mailgun (EU endpoint: `api.eu.mailgun.net`)
- **Auth**: Custom JWT sessions (`jose` library), magic links via Mailgun
- **Hosting**: Railway (3 services: `web`, `ghost`, `mysql`)

## Railway Project

- **Project ID**: `ac216b6a-a64e-4179-8cff-d51faadd1c16`
- **Environment**: `production` (`03bbaf85-567b-4037-9b5c-a198fc88ff16`)
- **Services**:
  - `web` (Next.js): `8d9c21fd-3a03-4314-b482-184bd61437da`
  - `ghost`: `ac313ef7-be88-483a-88c7-dab09c6ea1b4`
  - `mysql`: `aeb000d2-409f-47cf-a5a7-7f3ee0881c41`
- **Railway API Token**: `0849c8dc-ec70-4285-a29b-40ed09bed47c`
- **Ghost internal URL**: `https://ghost-production-69bc.up.railway.app`
- **Frontend URL**: `https://www.latent-capital.de`

## Critical Architecture Decisions

### Ghost URL = Frontend URL (IMPORTANT)

Ghost's `url` environment variable is set to `https://www.latent-capital.de/` (the frontend, NOT Ghost's Railway URL). This is intentional so that:
- Magic link URLs in Ghost emails point to the frontend
- Unsubscribe links point to the frontend
- All member-facing URLs go to the correct domain

**Consequence**: Ghost registers its Stripe webhook at `https://www.latent-capital.de/members/webhooks/stripe/` — which is the frontend, not Ghost itself. A **proxy route** in Next.js (`/members/webhooks/stripe/`) forwards these requests to Ghost's actual Railway URL. This proxy is essential and must not be removed.

### Stripe Webhook Architecture

Two Stripe webhook endpoints exist:

1. **Ghost's webhook** (auto-registered by Ghost):
   - Stripe ID: `we_1TE75UL2AhX45KRgOwp0u4xR`
   - URL: `https://www.latent-capital.de/members/webhooks/stripe/`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_succeeded`
   - Proxied by Next.js → Ghost handles member status updates (free→paid)

2. **Our custom webhook**:
   - Stripe ID: `we_1TE7x6L2AhX45KRgVLMULYTB`
   - URL: `https://www.latent-capital.de/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Sends magic link emails via Mailgun after successful checkout
   - Signing secret: stored as `STRIPE_WEBHOOK_SECRET` env var

### Auth & Session System

- Sessions are JWT tokens stored in `lc_session` cookie (httpOnly, 30 days)
- Payload: `{ memberId, email, name?, status: "free" | "paid" | "comped" }`
- Signed with `AUTH_SECRET` env var (HS256)
- Magic links use a separate secret (`AUTH_SECRET` + `"_magic"` suffix)
- `/api/auth/me` re-checks Ghost member status on each request and auto-updates the session cookie if status changed (catches upgrades/downgrades)

### Checkout Flow (Free → Paid Upgrade)

1. User clicks checkout button → POST `/api/checkout`
2. `/api/checkout` calls Ghost's `/members/api/create-stripe-checkout-session/`
3. If user is logged in, their email is passed as `customerEmail` for Stripe pre-fill
4. User completes Stripe checkout → redirected to `/membership?success=true`
5. Stripe sends webhook to Ghost (via proxy) → Ghost updates member to "paid"
6. Stripe sends webhook to our endpoint → we send magic link email
7. On success page: if user was logged in, session auto-refreshes from Ghost; if not logged in, they enter email to receive magic link

### Ghost Admin API

- Key format: `{id}:{hex_secret}` (e.g., `69bf2bbf...:350401ba...`)
- JWT: HS256, audience `/admin/`, 5 min expiry, kid = key id
- Endpoint: `{GHOST_URL}/ghost/api/admin/{resource}/`
- Content API key: separate, used for public data with `?key=` query param

## Environment Variables (Web Service)

```
GHOST_URL                  # Ghost Railway URL (internal, NOT the frontend URL)
GHOST_CONTENT_API_KEY      # Ghost Content API key
GHOST_ADMIN_API_KEY        # Ghost Admin API key (id:secret format)
NEXT_PUBLIC_SITE_URL       # Frontend URL (https://www.latent-capital.de)
AUTH_SECRET                # JWT signing secret (min 32 chars)
MAILGUN_API_KEY            # Mailgun API key
MAILGUN_DOMAIN             # mg.latent-capital.de
MAILGUN_FROM               # Sender address
STRIPE_SECRET_KEY          # For billing portal only
STRIPE_WEBHOOK_SECRET      # For /api/webhooks/stripe signature verification
REVALIDATE_SECRET          # For ISR revalidation webhook
```

## Key File Locations

### API Routes
- `/src/app/api/checkout/route.ts` — Stripe checkout initiation
- `/src/app/api/auth/me/route.ts` — Session check (auto-refreshes from Ghost)
- `/src/app/api/auth/refresh/route.ts` — Explicit session refresh
- `/src/app/api/auth/verify/route.ts` — Magic link verification
- `/src/app/api/auth/send-magic-link/route.ts` — Send magic link email
- `/src/app/api/webhooks/stripe/route.ts` — Our Stripe webhook (magic link sender)
- `/src/app/members/webhooks/stripe/route.ts` — **Proxy** for Ghost's Stripe webhook
- `/src/app/api/account/portal/route.ts` — Stripe billing portal

### Auth & Members
- `/src/lib/auth/session.ts` — JWT session create/verify/cookie
- `/src/lib/auth/magic-link.ts` — Magic link token + Mailgun email
- `/src/lib/members/api.ts` — Ghost Admin API wrapper (members, tiers, checkout, portal)
- `/src/components/auth/AuthProvider.tsx` — React context for client-side auth state
- `/src/components/auth/Paywall.tsx` — Blur overlay for paid content
- `/src/middleware.ts` — Route protection for `/account`

### Pages
- `/src/app/membership/page.tsx` — Pricing page (auth-aware)
- `/src/app/membership/MembershipContent.tsx` — Auth-aware pricing/confirmation
- `/src/app/membership/CheckoutBanner.tsx` — Post-checkout success/cancel handler
- `/src/app/membership/CheckoutButton.tsx` — Checkout trigger button
- `/src/app/account/page.tsx` — Account management
- `/src/app/login/page.tsx` — Magic link login

### Layout
- `/src/components/layout/Navbar.tsx` — Auth-aware navigation

## Common Gotchas

1. **Ghost redeploy resets Stripe webhook URL** — Ghost re-registers its webhook on boot using its `url` config. Since that points to the frontend, the proxy route at `/members/webhooks/stripe/` must exist in Next.js.

2. **Session says "free" after payment** — The JWT session caches member status. `/api/auth/me` auto-refreshes from Ghost, but there can be a delay (1-10s) while Ghost processes the Stripe webhook. The CheckoutBanner has retry logic for this.

3. **Ghost Admin API key rotation** — If the Ghost Admin API key changes, update `GHOST_ADMIN_API_KEY` on the `web` service in Railway. The key is in `{id}:{hex_secret}` format.

4. **Mailgun EU endpoint** — Mailgun is configured with the EU endpoint (`api.eu.mailgun.net`), not the US one.

5. **Ghost Content API returns `html: null` for paid posts** — Use the Admin API to fetch full HTML for preview/teaser generation (see `splitHtmlForPreview` in `/src/lib/utils/splitHtml.ts`).

## Git Workflow

- **Development branch**: `claude/latent-capital-website-EVDLf`
- Always push to this branch, never directly to main/master
