<div align="center">

# Lumina Card

### Digital Invitation + Guest Management — UAS E-Business Project

A Next.js 14 SaaS that combines digital wedding/event invitations with QR-code guest check-in, souvenir tracking, and a hybrid offline-first sync mode. Built as a final project for the E-Business course at Universitas Multimedia Nusantara.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![TiDB](https://img.shields.io/badge/TiDB_Cloud-MySQL-0066FF?logo=mysql&logoColor=white)](https://tidbcloud.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel)](https://vercel.com)

[Live Demo](https://lumina-card.vercel.app) · [Demo Flow](./DEMO_FLOW.md) · [Sample Invitation](https://lumina-card.vercel.app/i/andi-maya-2026)

</div>

---

## What it does

- **Digital invitation page** per couple/event at `/i/[slug]` (14 templates with different aesthetics & animations).
- **Guest list management** with WhatsApp share helper (`wa.me/?text=` link, no API).
- **QR check-in scanner** with three input modes (camera, photo upload, manual paste).
- **Souvenir tracking mode** — same scanner, toggle between check-in and souvenir distribution. Server enforces "must check-in before souvenir" and prevents double-claim.
- **Hybrid offline-first sync** — operator can scan to local MySQL during the event, then push to TiDB Cloud after WiFi is back.
- **Midtrans Snap** payment integration (sandbox toggle via env) for template purchases and per-event service plans.

## What it's not

- Not a finished product. This is an academic project built within ~3 weeks.
- Not load-tested. Numbers below are estimates from free-tier limits, not benchmarks.
- Not a replacement for an EO's full operational stack — there's no email automation, no real-time push, no recurring billing yet.
- Souvenir tracking appears uncommon in Indonesian digital-invitation tools we surveyed; we did not exhaustively verify the entire market.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Demo Accounts](#demo-accounts)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Security Notes](#security-notes)
- [Pricing](#pricing)
- [Known Limits & Roadmap](#known-limits--roadmap)
- [Documentation](#documentation)
- [License](#license)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14.2 (App Router) + React 18 + TypeScript 5 |
| Database | TiDB Cloud (production), MySQL 8 / XAMPP (local dev) |
| ORM | Prisma 5.14 (`relationMode: prisma`) |
| Auth | bcryptjs (cost 10) + httpOnly cookie session |
| Storage | Cloudinary (free tier, auto webp/avif) |
| Payments | Midtrans Snap (sandbox + production) |
| QR Scanner | html5-qrcode (camera) + jsqr (photo) |
| Animation | Framer Motion 12 + anime.js 4 |
| Hosting | Vercel free tier |

### Why these choices

| Decision | Reason |
|---|---|
| TiDB Cloud over PlanetScale | Free 5GB tier, MySQL-compatible, no shard lock-in. |
| Cloudinary over R2 | Free 25GB and on-the-fly transform — saves CDN config work for an MVP. |
| bcryptjs + cookies over NextAuth | Single-tenant SaaS doesn't need OAuth provider plumbing yet. |
| UUID v4 over AES-256 for QR | Token validated by DB lookup, not by client decode — no shared key to leak. |
| Manual sync over WebSocket | The bottleneck we observed is venue connectivity, not message latency. |

---

## Architecture

```
                     Vercel (Next.js 14 App Router)
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
   Public routes         API routes              Admin routes
   /, /catalog,          /api/checkin            /admin/dashboard
   /i/[slug],            /api/sync/push          /admin/scanner
   /inv/[token]          /api/payment/midtrans   /admin/users
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │  TiDB Cloud (MySQL-compatible)│
                  │  User · Event · Guest         │
                  │  Attendance · ChangeLog       │
                  └───────────────────────────────┘
                       ▲                  ▲
                       │                  │
              Cloudinary CDN       XAMPP MySQL (local)
              (image upload)       (offline scanner mode)
```

### Hybrid offline-first sync

```
Venue (no internet)              Post-event (WiFi)
─────────────────                ─────────────────
Laptop + XAMPP                   POST /api/sync/push
MySQL local            ─────►    1. Read local guests
Scanner posts to                 2. Open TiDB connection
localhost                        3. UPSERT by token (UUID = idempotent)
                                 4. Forward souvenir flags
```

Token-based UPSERT means re-running the sync is safe: each guest has a globally-unique UUID, and the merge resolves to the same row.

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- TiDB Cloud account ([free](https://tidbcloud.com))
- Cloudinary account ([free](https://cloudinary.com))
- Midtrans Sandbox account ([free](https://midtrans.com))
- Optional: XAMPP / MySQL 8 on `localhost:3306` for offline-first mode

### Install

```bash
git clone https://github.com/GodrezJr2/Lumina-Card.git
cd Lumina-Card
npm install
cp .env.example .env
# fill in DATABASE_URL, MIDTRANS_*, CLOUDINARY_*
npx prisma generate
npx prisma db push
node scripts/seed-demo.mjs        # 5 users + 2 events + 13 guests
npm run dev                       # http://localhost:3001
```

### Required env vars

```env
DATABASE_URL="mysql://user:pass@host:4000/db?sslaccept=strict"
PROD_DATABASE_URL="..."           # only needed for offline-first sync
MIDTRANS_SERVER_KEY="SB-Mid-server-..."
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-..."
MIDTRANS_IS_PRODUCTION="false"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

---

## Demo Accounts

For local development, use the seed scripts (excluded from this repo for credential hygiene). After running them, accounts cover all five RBAC tiers: SUPER_ADMIN, FULL_SERVICE_CLIENT, DIY_CLIENT, USHER_STAFF, and BASIC_USER.

Live deployment credentials are not published. Browse the public invitation pages above for a read-only view.

---

## Project Structure

```
wedding-app/
├── app/
│   ├── (public routes: /, /catalog, /pricing, /i/[slug], /inv/[token]/qr)
│   ├── admin/        — dashboard, events, guests, scanner, broadcast, users, panel
│   └── api/          — auth, events, guests, checkin, sync, upload, payment/midtrans
├── components/
│   ├── templates/    — 14 invitation templates
│   ├── ImageUpload.tsx
│   ├── MusicPlayer.tsx
│   └── RoleGate.tsx
├── lib/
│   ├── prisma.ts          — production client (TiDB)
│   ├── prisma-local.ts    — local client (XAMPP, for sync)
│   ├── cloudinary.ts
│   ├── roles.ts           — 5-tier RBAC permission map
│   └── catalog-templates.ts
├── prisma/schema.prisma   — User · Event · Guest · Attendance · ChangeLog
└── scripts/
    ├── seed-demo.mjs      — reset + seed (idempotent)
    ├── seed-passwords.mjs — reset all passwords to "123456"
    └── list-users.mjs     — CLI table dump
```

---

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Sets `user_id` + `user_role` cookies |
| `POST` | `/api/auth/logout` | Clear session |
| `GET` | `/api/auth/me` | Current user |

### Events & guests

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | List events + aggregate stats |
| `POST` | `/api/events` | Create event with auto-generated slug |
| `GET` | `/api/guests?eventId={id}` | Guests with attendance |
| `POST` | `/api/guests/bulk` | Bulk import (pipe / tab / comma separators) |

### Check-in & sync

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/checkin` | `{ token, mode: "checkin" \| "souvenir" }` |
| `POST` | `/api/sync/push` | Push local DB to TiDB Cloud (idempotent UPSERT) |

### Payment

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payment/midtrans/create` | Snap transaction (template OR plan) |
| `POST` | `/api/payment/midtrans/notification` | Webhook with SHA512 verify |

### Sample — souvenir mode check-in

```bash
POST /api/checkin
{ "token": "550e8400-e29b-...", "mode": "souvenir" }
```

Success — `200`:
```json
{ "name": "Citra", "status": "Checked_In", "mode": "souvenir",
  "pickedUpSouvenir": true, "message": "Souvenir berhasil diberikan!" }
```

Not yet checked in — `409`:
```json
{ "name": "Dewi", "status": "Opened",
  "message": "Tamu belum check-in. Wajib check-in dulu sebelum ambil souvenir." }
```


---

## Database Schema

```
User    1 ───── N  Event
Event   1 ───── N  Guest
Guest   1 ───── 1  Attendance
User    1 ───── N  ChangeLog (audit)
```

### Guest status flow

```
Draft ──send WA──► Sent ──open link──► Opened ──scan QR──► Checked_In
                                                               │
                                                  scan in     ▼
                                                  souvenir    Souvenir picked
                                                  mode
```

Schema details: see [`prisma/schema.prisma`](./prisma/schema.prisma).

---

## Security Notes

| Area | Implementation |
|---|---|
| Transport | HTTPS via Vercel + Let's Encrypt |
| DB | TiDB Cloud `?sslaccept=strict` |
| Password | bcryptjs cost 10 |
| Session | httpOnly cookie, 7-day TTL |
| Authorization | 5-tier RBAC, route-level `<RoleGate>` |
| QR token | UUID v4 (122-bit), validated against DB |
| Webhook | Midtrans SHA512 signature verify |
| Audit log | `ChangeLog` table records actor + before/after JSON |
| Soft delete | `User.deletedAt`, restorable by SUPER_ADMIN |
| Card data | None stored — Midtrans handles tokenization |

We don't claim formal compliance certifications. Card data flows entirely through Midtrans, which itself is PCI-DSS Level 1.

---

## Pricing

```
PER-EVENT SERVICE PLANS
─ Basic        Rp  79.000   200 guests, 1 staff
─ Professional Rp 199.000   1.000 guests, unlimited staff, WA blast
─ Enterprise   custom       white-label, API, SLA

TEMPLATE CATALOG (one-time)
─ 14 templates  Rp 149.000 – Rp 399.000
```

Operational costs at MVP scale: ~Rp 0/month (everything on free tiers) plus ~Rp 192K/year for the domain. Midtrans fees (2.9–3.5% per transaction) are passed through.

---

## Known Limits & Roadmap

### Known limits
- No real-time dashboard updates — admin pages re-fetch on navigation, not live push.
- Bulk import is textarea paste only (CSV file upload is on the roadmap).
- No 2FA on SUPER_ADMIN accounts.
- WhatsApp distribution is a `wa.me` link generator — no automated blast.
- Recurring subscription billing not implemented (everything is pay-per-event).

### Roadmap
- [ ] RSVP response tracking (Hadir/Tidak/Mungkin + plus-ones)
- [ ] Live scanner stats counter
- [ ] CSV file upload with header detection
- [ ] Mobile drawer nav for admin
- [ ] WhatsApp blast via baileys (self-hosted)
- [ ] EO subscription billing
- [ ] 2FA for SUPER_ADMIN

---

## Documentation

- [`DEMO_FLOW.md`](./DEMO_FLOW.md) — 5-scenario presentation script (12-15 min)
- [`LAPORAN_REVISI.md`](./LAPORAN_REVISI.md) — Final report — tech stack overview
- [`LAPORAN_REVISI_BAB2.md`](./LAPORAN_REVISI_BAB2.md) — Infrastructure
- [`LAPORAN_REVISI_BAB5_6.md`](./LAPORAN_REVISI_BAB5_6.md) — Security & monetization
- [`LAPORAN_REVISI_NEW_SECTIONS.md`](./LAPORAN_REVISI_NEW_SECTIONS.md) — Souvenir tracking design

---

## License

MIT. Fork it, learn from it, adapt it.

---

<div align="center">

Built as an E-Business UAS project at Universitas Multimedia Nusantara · 2026

[Live Demo](https://lumina-card.vercel.app) · [Repo](https://github.com/GodrezJr2/Lumina-Card)

</div>
