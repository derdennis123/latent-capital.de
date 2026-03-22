# ARCHITECTURE.md — Latent Capital

> Zuletzt aktualisiert: 2026-03-22

## Tech Stack

| Layer | Technologie |
|-------|-------------|
| Framework | Next.js 16.2.1 (App Router, React 19) |
| Styling | Tailwind CSS 4, PostCSS |
| Animationen | Framer Motion 12 |
| CMS | Ghost (Content API + Admin API) |
| Auth | JWT via `jose` (Magic Link only) |
| E-Mail | Mailgun (EU endpoint) |
| Hosting | Railway |
| Domain | latent-capital.de (IONOS DNS, www → Railway CNAME) |
| Fonts | Playfair Display (serif), Inter (sans) |

---

## Projektstruktur

```
src/
├── app/
│   ├── (content)/              # Content-Seiten (Ghost-Posts)
│   │   ├── deep-dives/         # Deep Dive Artikel
│   │   │   ├── [slug]/page.tsx
│   │   │   └── page.tsx        # Listing
│   │   ├── interviews/
│   │   │   ├── [slug]/page.tsx
│   │   │   └── page.tsx
│   │   ├── startups/
│   │   │   ├── [slug]/page.tsx
│   │   │   ├── funding/page.tsx
│   │   │   ├── landscape/page.tsx
│   │   │   └── page.tsx
│   │   └── themen/
│   │       ├── [slug]/page.tsx
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   ├── send-magic-link/route.ts
│   │   │   └── verify/route.ts
│   │   ├── revalidate/route.ts   # ISR webhook from Ghost
│   │   └── subscribe/route.ts    # Newsletter signup → Ghost member
│   ├── about/page.tsx
│   ├── account/page.tsx          # Protected, shows user info
│   ├── datenschutz/page.tsx
│   ├── feed.xml/route.ts         # RSS Feed
│   ├── impressum/page.tsx
│   ├── layout.tsx                # Root layout mit Navbar + Footer
│   ├── login/page.tsx            # Magic Link login
│   ├── membership/page.tsx       # Premium-Pricing (€19/Mo, €149/Jahr)
│   ├── newsletter/page.tsx       # Newsletter signup + Archiv
│   ├── not-found.tsx
│   ├── page.tsx                  # Homepage
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── animations/
│   │   ├── FadeIn.tsx
│   │   └── GlassBlob.tsx
│   ├── auth/
│   │   ├── AuthProvider.tsx      # React Context, useAuth() hook
│   │   └── Paywall.tsx           # Paid-content gate mit Blur-Preview
│   ├── home/
│   │   ├── CategoryPreview.tsx
│   │   ├── HeroSection.tsx
│   │   └── NewsletterCTA.tsx
│   ├── layout/
│   │   ├── Container.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx            # Newsletter-Dropdown + Premium CTA / Avatar
│   ├── membership/
│   │   └── PricingCard.tsx
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostCardFeatured.tsx
│   │   ├── PostContent.tsx       # Ghost HTML renderer
│   │   ├── PostGrid.tsx
│   │   ├── PostHeader.tsx
│   │   ├── PostPagination.tsx
│   │   └── ShareButtons.tsx
│   ├── topics/
│   │   └── TopicCard.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── GlassCard.tsx
│       ├── NewsletterForm.tsx
│       └── Skeleton.tsx
├── lib/
│   ├── auth/
│   │   ├── magic-link.ts        # Magic Link Token-Erstellung + Mailgun-Versand
│   │   └── session.ts           # JWT Session (lc_session Cookie, 30 Tage)
│   ├── ghost/
│   │   ├── authors.ts
│   │   ├── client.ts            # Ghost Content API Wrapper
│   │   ├── index.ts             # Re-exports
│   │   ├── pages.ts
│   │   ├── posts.ts             # getPosts, getPostBySlug, getPostsByTag, etc.
│   │   ├── settings.ts
│   │   ├── tags.ts
│   │   └── types.ts             # GhostPost, GhostTag, GhostAuthor types
│   ├── members/
│   │   └── api.ts               # Ghost Admin API: Member CRUD
│   ├── seo/
│   │   ├── jsonld.ts
│   │   └── metadata.ts
│   ├── routing.ts               # URL-Generierung für Posts
│   └── utils.ts
└── middleware.ts                 # Schützt /account, prüft JWT
```

---

## Seiten & Routen

### Öffentlich
| Route | Beschreibung |
|-------|-------------|
| `/` | Homepage mit Hero, Kategorie-Previews, Newsletter-CTA |
| `/deep-dives` | Deep Dive Listing |
| `/deep-dives/[slug]` | Einzelner Deep Dive Artikel |
| `/interviews` | Interview Listing |
| `/interviews/[slug]` | Einzelnes Interview |
| `/startups` | Startup Listing |
| `/startups/[slug]` | Einzelner Startup-Artikel |
| `/startups/funding` | Funding-Übersicht |
| `/startups/landscape` | Startup-Landscape |
| `/themen` | Themen/Tags Übersicht |
| `/themen/[slug]` | Artikel eines Themas |
| `/newsletter` | Newsletter-Signup + Archiv |
| `/membership` | Premium-Pricing (€19/Mo, €149/Jahr) |
| `/login` | Magic Link Login |
| `/about` | Über uns |
| `/impressum` | Impressum |
| `/datenschutz` | Datenschutz |

### Geschützt (Middleware)
| Route | Beschreibung |
|-------|-------------|
| `/account` | Konto-Übersicht, Logout |

### API
| Route | Methode | Beschreibung |
|-------|---------|-------------|
| `/api/subscribe` | POST | Newsletter E-Mail → Ghost Free Member |
| `/api/auth/send-magic-link` | POST | Magic Link per Mailgun senden |
| `/api/auth/verify` | GET | Token validieren, Session erstellen |
| `/api/auth/me` | GET | Aktuellen User zurückgeben |
| `/api/auth/logout` | POST | Session-Cookie löschen |
| `/api/revalidate` | POST | ISR Revalidierung (Ghost Webhook) |
| `/feed.xml` | GET | RSS Feed |

---

## Ghost-Anbindung

### Content API (read-only, öffentlich)
- Holt Posts, Tags, Authors, Pages
- Revalidierung alle 300 Sekunden (ISR)
- Posts haben `visibility` Feld (`public` / `members` / `paid`)
- Routing basiert auf Primary Tag → Kategorie-Pfad

### Admin API (authentifiziert)
- Member erstellen/lesen/updaten
- JWT-Signing mit Key:Secret Format
- Verwendet für: Newsletter-Signup, Magic Link Verification

### Ghost Post → Frontend Routing
| Ghost Tag | Frontend Route |
|-----------|---------------|
| `deep-dive` | `/deep-dives/[slug]` |
| `interview` | `/interviews/[slug]` |
| `startup` | `/startups/[slug]` |
| andere Tags | `/themen/[slug]` |

---

## Auth-System

- **Nur Magic Link** (Google OAuth entfernt)
- JWT Token via `jose` (HS256)
- Cookie: `lc_session` (httpOnly, secure in prod, 30 Tage)
- Session-Payload: `memberId`, `email`, `name`, `status` (free/paid/comped)
- Magic Link: 15 Minuten gültig, gesendet via Mailgun EU
- Middleware schützt `/account`

### Zwei-Tier-Modell
| Tier | Zugang |
|------|--------|
| Besucher | Alle öffentlichen Artikel, Newsletter per E-Mail (kein Account nötig) |
| Paid Member (€19/Mo oder €149/Jahr) | Alles freigeschaltet + Premium-Newsletter |

---

## Navigation (Navbar)

### Nicht eingeloggt
```
LATENT CAPITAL    CURATED  INSIGHTS  LIBRARY    [Newsletter ✉]  [Premium werden →]
```
- **Newsletter**: Dropdown mit E-Mail-Feld (inline Subscribe)
- **Premium werden**: Lila CTA → `/membership`

### Eingeloggt (Paid Member)
```
LATENT CAPITAL    CURATED  INSIGHTS  LIBRARY    [DG]
```
- **Avatar-Circle**: Initialen, Dropdown mit E-Mail, "Mein Konto", "Abmelden"

---

## Newsletter-Konzept (geplant)

| Newsletter | Empfänger | Frequenz |
|-----------|-----------|----------|
| Latent Capital Weekly | Alle E-Mail-Subscriber (kostenlos) | Wöchentlich |
| Latent Capital Deep Dive | Nur Paid Members | Bei Veröffentlichung |

---

## Environment Variables

| Variable | Beschreibung | Pflicht |
|----------|-------------|---------|
| `NEXT_PUBLIC_GHOST_URL` | Ghost CMS URL | Ja |
| `GHOST_CONTENT_API_KEY` | Ghost Content API Key | Ja |
| `GHOST_ADMIN_API_KEY` | Ghost Admin API Key (key:secret) | Ja |
| `NEXT_PUBLIC_SITE_URL` | Öffentliche Site URL | Ja |
| `AUTH_SECRET` | JWT Secret (min. 32 Zeichen) | Ja |
| `MAILGUN_API_KEY` | Mailgun API Key | Ja |
| `MAILGUN_DOMAIN` | Mailgun Domain (z.B. mg.latent-capital.de) | Ja |
| `MAILGUN_FROM` | Absender E-Mail | Ja |
| `REVALIDATE_SECRET` | Secret für ISR Webhook | Ja |
| `GHOST_URL` | Fallback für Ghost URL (intern) | Nein |
| `NODE_ENV` | production/development | Auto |

---

## Was noch fehlt

### Prio 1 — Paid Membership Flow
- [ ] **Stripe Integration**: Checkout Sessions (monatlich + jährlich)
- [ ] **Stripe Webhook** → Ghost Paid Member erstellen
- [ ] **Paywall in Artikelseiten einbauen**: Ghost `visibility: "paid"` → Paywall-Komponente mit Blur-Preview
- [ ] **Ghost Portal/Stripe Connect** konfigurieren

### Prio 2 — Newsletter
- [ ] Zwei Newsletter-Tiers in Ghost einrichten (Weekly + Deep Dive)
- [ ] Newsletter-Signup ordnet Free-Newsletter zu
- [ ] Paid Members bekommen automatisch Deep Dive Newsletter

### Prio 3 — Content & UX
- [ ] Premium-Badge auf Paid-Artikeln in Listings (PostCard)
- [ ] Glassmorphism-Blur Paywall-Effekt (30–40% Teaser sichtbar)
- [ ] Mobile Navbar Newsletter-Formular optimieren
- [ ] Account-Seite: Abo verwalten / kündigen (Stripe Billing Portal)

### Prio 4 — Infrastruktur
- [ ] Ghost Webhook → `/api/revalidate` für ISR einrichten
- [ ] Mailgun Domain DNS Records verifizieren
- [ ] SSL für www.latent-capital.de (Railway Custom Domain)
- [ ] IONOS Root-Domain Redirect → https://www.latent-capital.de ✅
