# Netbrandit — Growth Website & Admin Portal

Production-minded marketing website and content-management portal for **Netbrandit**, built to generate qualified leads from small-business owners.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** with the Redline Growth Engine design system
- **MongoDB** + **Mongoose** (`netbrandit` database)
- **NextAuth** credentials auth for admin
- **GSAP** + **ScrollTrigger**, **Lenis** smooth scroll
- **TipTap** rich text, **dnd-kit**, **Sharp** uploads, **Nodemailer** email
- **Vitest** unit tests, **Playwright** e2e tests

## Prerequisites

- **Node.js** 20+ (tested on 24.x)
- **MongoDB** running locally or a remote URI
- **MongoDB Compass** (optional GUI — connects to the same URI as the app)

## Quick start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — see Environment variables below

# 3. Start MongoDB (local example)
# Windows: start MongoDB service or run mongod
# macOS: brew services start mongodb-community

# 4. Seed database (creates admin user + all content)
npm run seed

# 5. Run development server
npm run dev
```

Open:

- **Website:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

## MongoDB & Compass

Connection URI (default):

```
mongodb://127.0.0.1:27017/netbrandit
```

In **MongoDB Compass**, paste the same URI. After `npm run seed`, collections appear including `sitesettings`, `pages`, `services`, `leads`, `bookings`, etc.

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `AUTH_SECRET` | Yes | Random secret for NextAuth (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Seed only | First admin email |
| `ADMIN_PASSWORD` | Seed only | First admin password (hashed on seed) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL (e.g. `http://localhost:3000`) |
| `HOST_TIME_ZONE` | No | Default `America/Toronto` |
| `DEFAULT_CURRENCY` | No | Default `CAD` |
| `UPLOAD_DIR` | No | Default `public/uploads` |
| `SMTP_*` | Optional | Email notifications & booking confirmations |

## Seed command

```bash
npm run seed
```

Idempotent — safe to run multiple times. Creates:

- Site settings with contact: `ak_2123@hotmail.com`, `416-700-2656`
- All system pages with CMS sections
- 8 services (Custom Web Design from CAD 99, etc.)
- Pricing packages, gallery categories, FAQs
- 3 draft blog posts, draft testimonial placeholders
- Default discovery-call meeting type + Mon–Fri 9–5 availability
- Admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`

Does **not** create fake leads, bookings, or approved testimonials.

## First admin login

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`
2. Run `npm run seed`
3. Sign in at `/admin/login`

## Public routes

| Route | Nav label |
|-------|-----------|
| `/` | Home |
| `/about` | About |
| `/services` | Services |
| `/services/[slug]` | Service detail |
| `/gallery` | Work |
| `/gallery/[slug]` | Project detail |
| `/pricing` | Pricing |
| `/blog` | Insights |
| `/blog/[slug]` | Article |
| `/testimonials` | — |
| `/faqs` | — |
| `/booking` | — |
| `/contact` | Contact |
| `/privacy`, `/terms` | Legal |

## Admin routes

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard (live MongoDB stats) |
| `/admin/pages` | Page CMS (section editor) |
| `/admin/services` | Services (Overview + Detail Page tabs) |
| `/admin/pricing` | Pricing packages |
| `/admin/blog` | Blog / Insights |
| `/admin/gallery` | Gallery / Work |
| `/admin/testimonials` | Testimonial moderation |
| `/admin/faqs` | FAQs |
| `/admin/leads` | Lead pipeline |
| `/admin/bookings` | Booking calendar |
| `/admin/uploads` | Media library |
| `/admin/settings` | Site settings (single source of truth for contact) |

## Publishing content

1. Edit content in admin (Pages, Services, Blog, etc.)
2. Click **Save and Publish**
3. Frontend updates via `revalidatePath` — no rebuild required

### Add a service

1. Go to **Admin → Services → Add New**
2. Fill **Overview** tab (card data) and **Detail Page** tab
3. Publish — `/services/[slug]` is available immediately

## Local uploads

- Files stored in `public/uploads/` (year/month subfolders)
- Metadata in MongoDB `mediaassets` collection
- **Production:** use a persistent disk mount; serverless ephemeral filesystems will lose uploads unless you swap the storage adapter to S3-compatible storage later

## SMTP configuration

Set in `.env.local`:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-user
SMTP_PASSWORD=your-password
SMTP_FROM="Netbrandit <noreply@yourdomain.com>"
```

Without SMTP, forms and bookings still save to MongoDB; the UI shows a development notice instead of pretending email was sent.

## Booking availability

- Host timezone: `HOST_TIME_ZONE` (default `America/Toronto`)
- Edit meeting types, availability rules, and blackout dates in **Admin → Settings → Booking**
- Visitor timezone detected client-side; timestamps stored in UTC
- Double-booking prevented by unique slot constraint + server check

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright e2e tests
npm run seed         # Database seed
```

## Backup & restore

- **MongoDB:** `mongodump --uri="mongodb://127.0.0.1:27017/netbrandit" --out=./backup`
- **Uploads:** copy `public/uploads/` directory

## Owner decisions before launch

Confirm with the business owner:

- Final domain and trademark check
- CAD pricing confirmation and exact $99 website scope
- Final logo/favicon (code wordmark provided as fallback; `public/brand/logo.png` uploaded)
- Real portfolio projects, images, and client permissions
- Approved testimonials
- Social media URLs
- Business location / service area display
- Discovery-call availability and notice policy
- SMTP provider selection
- Privacy & Terms legal review
- Final brand/team photography

## Brand

- **Colours:** Void Black `#050505`, Signal Red `#F21D2F`, Warm White `#F7F4EF`
- **Wordmark:** NETBRAND (warm white) + IT (signal red) — editable in Site Settings
- **Positioning:** One-stop growth partner for small businesses

---

Built for Netbrandit. Contact: ak_2123@hotmail.com · 416-700-2656
