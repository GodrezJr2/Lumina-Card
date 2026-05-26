<div align="center">

# ✨ Lumina Card

### Premium Digital Invitations + Smart Guest Management Platform

> Bukan sekadar undangan digital. **Lumina Card** adalah end-to-end SaaS yang menyatukan undangan editorial-grade, RSVP online, QR scanner check-in, dan **souvenir tracking** — fitur yang tidak ada di kompetitor undangan digital Indonesia.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![TiDB](https://img.shields.io/badge/TiDB_Cloud-MySQL_compat-0066FF?logo=mysql&logoColor=white)](https://tidbcloud.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel)](https://vercel.com)
[![Midtrans](https://img.shields.io/badge/Midtrans-Snap-1F2937?logo=stripe&logoColor=white)](https://midtrans.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com)

[**🚀 Live Demo**](https://lumina-card.vercel.app) · [**📖 Demo Flow Script**](./DEMO_FLOW.md) · [**🎓 Final Report**](./LAPORAN_REVISI.md) · [**📱 Sample Invitation**](https://lumina-card.vercel.app/i/andi-maya-2026)

</div>

---

## 📑 Table of Contents

- [Why Lumina Card](#-why-lumina-card)
- [Killer Features](#-killer-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Demo Accounts](#-demo-accounts)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Security Model](#-security-model)
- [Monetization](#-monetization)
- [Roadmap](#-roadmap)
- [Built By](#-built-by)

---

## 🎯 Why Lumina Card

Wedding & event invitations in Indonesia rely on a fragmented mix of WhatsApp Word docs, Canva-generated PNGs, and Google Forms RSVP. The big pain points:

| Pain Point | Lumina Card Solution |
|---|---|
| 📄 Static images, no RSVP | Dynamic invitation pages with built-in RSVP form |
| 🤷 No way to track who showed up | QR Code check-in + real-time dashboard |
| 🎁 Souvenir double-claim chaos | **Server-enforced souvenir tracking** with mode toggle |
| 📡 Internet jelek di gedung | **Hybrid offline-first sync** (XAMPP local → TiDB Cloud) |
| 💸 SaaS subscription mahal | Pay-per-event (Rp 79K) or one-time template (Rp 149-399K) |
| 🎨 Generic AI-aesthetic templates | 14 hand-crafted templates with signature animations |

---

## 🔥 Killer Features

### 1. 🎁 Souvenir Tracking (Industry First)
A scanner mode toggle that prevents three abuse patterns at the database layer:
- **Double check-in** → 409 Conflict response
- **Souvenir without attendance** → server rejects
- **Double souvenir claim** → audit trail with timestamps

```
┌────────────────────┐    ┌────────────────────┐
│ ✓ Mode Check-In    │ ↔  │ 🎁 Mode Souvenir   │
│   (default emerald)│    │   (amber)          │
└────────────────────┘    └────────────────────┘
```

> **No competitor in the Indonesian digital invitation space has this.**

### 2. 📡 Hybrid Offline-First Sync
Wedding venues with bad WiFi? No problem. Operators scan to local MySQL (XAMPP) during the event, then click "Sync to Server" after — data UPSERTs to TiDB Cloud by UUID token (idempotent, multi-run safe).

```
GEDUNG (no internet)              POST-EVENT (WiFi)
┌──────────────────┐              ┌─────────────────────────┐
│ Laptop + XAMPP   │              │  /api/sync/push          │
│ MySQL local      │  ─click──►   │  - Read local guests     │
│ Scanner offline  │  "Sync"      │  - Open TiDB connection  │
│ (POST /checkin   │              │  - UPSERT by token (UUID │
│  to localhost)   │              │    = idempotent)         │
└──────────────────┘              └─────────────────────────┘
                                            │
                                            ▼
                                  ┌─────────────────────────┐
                                  │ TiDB Cloud (Production) │
                                  └─────────────────────────┘
```

### 3. 🎨 14 Editorial Templates with Signature Animations
Each template has its own typography pairing **and** unique animation:

| Template | Aesthetic | Signature Animation |
|---|---|---|
| Sakura Dream | Japanese soft pink | Falling petals canvas (anime.js) |
| Golden Hour | Beach editorial | Gold particle dust |
| Midnight Glam | Dark luxury | Gold shimmer canvas + parallax |
| Ocean Drift | Beach magazine | Animated SVG wave morph |
| Terra Cotta | Indo heritage | Animated batik motif draw |
| Risograph Rave | Duotone print | Rotating tape-shadow boxes |
| Birthday Pop | Colorful party | Confetti float |
| Royal Gold | Editorial luxury | Italianno cursive + gold borders |
| Minimal Ivory | Clean wedding | Mosaic gallery |
| Rustic Boho | Outdoor | Asymmetric photo grid |
| Modern Corporate | Conference | CountUp stats |
| Seminar Pro | Event/agenda | Agenda timeline |
| Ethereal Garden | Soft floral | Botanical SVG fade |
| Neon Nexus | Tech/cyber | Glitch text + scanline |

### 4. 💳 Real Payment Integration — Midtrans Snap
- **Sandbox + Production** togglable via `MIDTRANS_IS_PRODUCTION` env var
- Supports: VA (BCA, BNI, Mandiri, Permata), QRIS, GoPay, ShopeePay, Credit Card
- **Webhook idempotent** — replay-safe via SHA512 signature verify
- **PCI-DSS** compliant (zero card data stored on our side)

### 5. 🔐 Production-Grade Auth
- **bcryptjs** cost factor 10 password hashing
- **httpOnly cookie** session (7-day TTL)
- **5-tier RBAC**: BASIC_USER → DIY_CLIENT → FULL_SERVICE_CLIENT → USHER_STAFF → SUPER_ADMIN
- **Permission map** in `lib/roles.ts` — every page wrapped with `<RoleGate>` redirect
- **Soft delete + restore** with full audit trail (`ChangeLog` table)
- **UUID v4 QR tokens** (122-bit entropy, server-side validation, no AES needed)

---

## 🛠 Tech Stack

<table>
<tr>
<td>

**Frontend**
- Next.js 14.2 (App Router)
- React 18 + TypeScript 5
- Tailwind CSS 3.4
- Framer Motion 12
- anime.js 4 (canvas particles)
- Lenis (smooth scroll)

</td>
<td>

**Backend**
- Next.js API Routes
- Prisma 5.14 ORM
- bcryptjs (password hash)
- httpOnly cookie session
- Zod-style validation

</td>
<td>

**Database**
- TiDB Cloud (production)
- MySQL 8 / XAMPP (local dev)
- Prisma `relationMode: prisma`
- Auto daily snapshot backup

</td>
</tr>
<tr>
<td>

**Infrastructure**
- Vercel Edge Network
- Cloudinary CDN (free 25GB)
- Auto webp/avif transform
- HTTPS via Let's Encrypt

</td>
<td>

**Payments**
- Midtrans Snap
- Webhook signature SHA512
- Idempotent transaction
- PCI-DSS compliant

</td>
<td>

**Scanner Stack**
- html5-qrcode (camera live)
- jsqr (photo decode)
- Html5Qrcode low-level API
- iOS Safari + Android compat

</td>
</tr>
</table>

### Why these choices

| Decision | Rationale |
|---|---|
| **Next.js App Router** vs Pages | Server Components reduce client JS; route handlers consolidate API + page logic |
| **TiDB Cloud** vs PlanetScale | Free 5GB tier, MySQL-compatible, distributed (no shard lock-in), branch deploys via env |
| **Cloudinary** vs Cloudflare R2 | 25GB free tier with on-the-fly auto-optimize (webp/avif) — saves CDN config work |
| **bcryptjs + cookies** vs NextAuth | Zero boilerplate for single-tenant SaaS; cookie middleware enables route guard without DB hit |
| **UUID v4** vs AES-256 QR | 122-bit entropy is brute-force impossible; server-side validate via DB lookup, no shared key needed |
| **Manual sync** vs WebSocket | The real bottleneck is venue connectivity, not message latency |

---

## 🏗 Architecture

```
                          ┌─────────────────────────────────────┐
                          │         lumina-card.vercel.app      │
                          │       (Next.js 14 App Router)       │
                          └────┬───────────────┬────────────┬───┘
                               │               │            │
              Public Routes ◄──┘               │            └──► Admin Routes
              ─────────────                    │                ────────────
              GET /              GET /api/auth/me              GET /admin/dashboard
              GET /catalog       POST /api/auth/login          GET /admin/events
              GET /pricing       POST /api/checkin             GET /admin/scanner
              GET /i/[slug]      POST /api/sync/push           GET /admin/users
              GET /inv/[token]   POST /api/payment/midtrans/   GET /admin/panel
                                      create
                                                                    │
                                                                    ▼
              ┌─────────────────────┐    ┌────────────────────────────────┐
              │  Cloudinary CDN     │    │  TiDB Cloud (MySQL-compatible) │
              │  (free 25GB)        │    │  ──────────────────────────────│
              │  webp/avif auto     │    │  User · Event · Guest          │
              │  ↑ /api/upload      │    │  Attendance · ChangeLog        │
              └─────────────────────┘    └────────────────────────────────┘
                       ▲                              ▲
                       │                              │
              ┌────────┴──────────┐           ┌───────┴───────────┐
              │  Midtrans Snap    │           │  /api/sync/push   │
              │  (Sandbox + Prod) │           │  ◄── XAMPP local  │
              │  Webhook SHA512   │           │      MySQL 8      │
              └───────────────────┘           └───────────────────┘
```

**Request lifecycle (typical guest check-in):**

1. Operator scans QR at venue → `POST /api/checkin` with `{ token, mode: "checkin" }`
2. `prisma.guest.findUnique({ where: { token } })` validates the UUID
3. If `status === "Checked_In"` → 409 (no double check-in)
4. Else → `$transaction([ Guest.update({ status: "Checked_In" }), Attendance.upsert(...) ])`
5. Dashboard re-renders stats on next nav (Server Component re-fetches)


---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- (Optional for offline-first) XAMPP / MySQL 8 running on `localhost:3306`
- TiDB Cloud free account ([sign up](https://tidbcloud.com))
- Cloudinary free account ([sign up](https://cloudinary.com))
- Midtrans Sandbox account ([sign up](https://midtrans.com))

### 1. Clone & install
```bash
git clone https://github.com/GodrezJr2/Lumina-Card.git
cd Lumina-Card
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Fill in:
```env
# DB (cloud OR local — both supported)
DATABASE_URL="mysql://user:pass@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/db?sslaccept=strict"
PROD_DATABASE_URL="..."        # for hybrid sync (optional, only if running offline-first)

# Midtrans
MIDTRANS_SERVER_KEY="SB-Mid-server-..."
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-..."
MIDTRANS_IS_PRODUCTION="false"

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 3. Push schema + seed
```bash
npx prisma generate
npx prisma db push
node scripts/seed-demo.mjs   # 5 demo users + 2 events + 13 guests
```

### 4. Run dev server
```bash
npm run dev
# → http://localhost:3001
```

---

## 👤 Demo Accounts

After running `seed-demo.mjs`, login with **password: `123456`** for any of these:

| Role | Email | Use Case |
|---|---|---|
| 🛡 SUPER_ADMIN | `admin@luminacard.app` | Audit log, user mgmt, soft-delete demo |
| 💼 FULL_SERVICE_CLIENT | `fullservice@luminacard.app` | Premium plan + Midnight Glam template |
| 🎨 DIY_CLIENT | `diy@luminacard.app` | Self-service + Ethereal Garden template |
| 📋 USHER_STAFF | `usher@luminacard.app` | Scanner-only role at the venue |
| 🆕 BASIC_USER | `basic@luminacard.app` | Fresh user for purchase flow demo |

**Public invitation pages (no login):**
- https://lumina-card.vercel.app/i/andi-maya-2026 (Ethereal Garden)
- https://lumina-card.vercel.app/i/bayu-nadira-2026 (Midnight Glam)

---

## 📁 Project Structure

```
wedding-app/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                # Landing page
│   │   ├── catalog/                # Template catalog + preview
│   │   ├── pricing/                # Pricing tiers + Midtrans checkout
│   │   ├── i/[slug]/               # Public invitation page (per couple)
│   │   └── inv/[token]/qr/         # QR code for sharing
│   ├── admin/
│   │   ├── dashboard/              # Stats overview (4 cards)
│   │   ├── events/                 # Event mgmt + template editor
│   │   ├── guests/                 # Guest list with souvenir column
│   │   ├── scanner/                # QR scanner (3 modes + souvenir toggle)
│   │   ├── broadcast/              # WhatsApp blast helper
│   │   ├── users/                  # SUPER_ADMIN user mgmt + soft delete
│   │   ├── panel/                  # Audit log viewer
│   │   └── upgrade/                # Plan upgrade page
│   └── api/
│       ├── auth/{login,me,logout}/ # Cookie-based session
│       ├── events/                 # Event CRUD
│       ├── guests/                 # Guest CRUD + bulk import (pipe/tab/CSV)
│       ├── checkin/                # POST {token, mode} — server validation
│       ├── sync/push/              # Hybrid offline-first sync endpoint
│       ├── upload/                 # Cloudinary multipart upload
│       └── payment/midtrans/       # Snap create + webhook SHA512 verify
├── components/
│   ├── templates/                  # 14 invitation templates
│   ├── ImageUpload.tsx             # Drag-drop Cloudinary uploader
│   ├── MusicPlayer.tsx             # YouTube + MP3 with autoplay-on-gesture
│   ├── RoleGate.tsx                # Permission-based render gate
│   └── ...
├── lib/
│   ├── prisma.ts                   # Prisma singleton
│   ├── prisma-local.ts             # XAMPP client (offline mode)
│   ├── cloudinary.ts               # Server-side upload helper
│   ├── roles.ts                    # 5-tier RBAC permission map
│   └── catalog-templates.ts        # 14 template metadata
├── prisma/schema.prisma            # User · Event · Guest · Attendance · ChangeLog
├── scripts/
│   ├── seed-demo.mjs               # Reset + seed demo data (idempotent)
│   ├── seed-passwords.mjs          # Reset all passwords to "123456"
│   └── list-users.mjs              # CLI table dump
├── DEMO_FLOW.md                    # 5-scenario presentation script (12-15 min)
└── LAPORAN_REVISI.md               # Final UAS report patches
```


---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login with email + password (sets `user_id` + `user_role` cookies) |
| `POST` | `/api/auth/logout` | Clear session cookies |
| `GET` | `/api/auth/me` | Current user (used by `useRole()` hook) |

### Events & Guests

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | List user's events + aggregate stats |
| `POST` | `/api/events` | Create event with auto-generated slug |
| `GET` | `/api/guests?eventId={id}` | Guests for an event with attendance |
| `POST` | `/api/guests/bulk` | Bulk import (supports `pipe`, `tab`, `comma` separators) |

### Check-in & Sync

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/checkin` | `{ token, mode: "checkin" \| "souvenir" }` — server validates state |
| `POST` | `/api/sync/push` | Hybrid offline-first: push local DB → TiDB Cloud (idempotent UPSERT) |

### Payment (Midtrans)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payment/midtrans/create` | Create Snap transaction (template OR pricing plan) |
| `POST` | `/api/payment/midtrans/notification` | Webhook (SHA512 verify) — auto-upgrades user role + plan |

### Upload

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Multipart → 8MB limit, MIME whitelist, streams to Cloudinary |

### Sample Request — Bulk Import

```bash
POST /api/guests/bulk
Content-Type: application/json

{
  "eventId": 210001,
  "rawText": "Budi Hartono | 081234567001\nCitra Lestari\t081234567002\nDewi,081234567003"
}
```

```json
{ "inserted": 3, "total": 3 }
```

### Sample Request — Souvenir Mode Check-in

```bash
POST /api/checkin
Content-Type: application/json

{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "mode": "souvenir"
}
```

**Response (success)** — `200 OK`:
```json
{
  "name": "Citra Lestari",
  "status": "Checked_In",
  "mode": "souvenir",
  "pickedUpSouvenir": true,
  "message": "Souvenir berhasil diberikan!"
}
```

**Response (not checked-in yet)** — `409 Conflict`:
```json
{
  "name": "Dewi Anggraini",
  "status": "Opened",
  "message": "Tamu belum check-in. Wajib check-in dulu sebelum ambil souvenir."
}
```

---

## 🗄 Database Schema

```prisma
User    1 ─────── N  Event
Event   1 ─────── N  Guest
Guest   1 ─────── 1  Attendance
User    1 ─────── N  ChangeLog (audit log)
```

### Guest Status Lifecycle

```
   ┌─────┐    send WA    ┌──────┐   open link  ┌────────┐   scan QR    ┌─────────────┐
   │Draft│ ────────────► │ Sent │ ───────────► │ Opened │ ───────────► │ Checked_In  │
   └─────┘               └──────┘              └────────┘              └─────────────┘
                                                                              │
                                                              scan in        ▼
                                                              souvenir mode  ┌─────────┐
                                                                  ──────────►│Souvenir │
                                                                             │ Picked  │
                                                                             └─────────┘
```

### Tables

```prisma
User
 ├─ id, email (unique), password (bcrypt), name
 ├─ role (5-tier enum)
 ├─ servicePlan (null | basic | professional)
 ├─ lockedTemplateId (catalog purchase)
 ├─ purchasedTemplates (JSON history)
 └─ deletedAt + deletedBy (soft delete)

Event
 ├─ id, userId, name, date, location
 ├─ slugUrl (unique) — public route /i/[slug]
 ├─ template, templateId
 ├─ brideName, groomName, story, venueAddress
 ├─ gallery (JSON array of Cloudinary URLs)
 ├─ themeConfig (JSON)
 └─ musicUrl (YouTube or MP3)

Guest
 ├─ id, eventId, name, whatsapp
 ├─ token (UUID v4 unique) — QR Code source
 └─ status (Draft | Sent | Opened | Checked_In)

Attendance (1:1 with Guest)
 ├─ id, guestId (unique)
 ├─ checkInTime (default now)
 ├─ pickedUpSouvenir (Boolean)
 └─ souvenirTime (DateTime?)

ChangeLog (audit trail)
 ├─ actorId (User), category, description
 ├─ before, after (JSON snapshots)
 └─ targetId, createdAt
```


---

## 🔐 Security Model

| Layer | Implementation |
|---|---|
| Transport | HTTPS/TLS 1.3 (Vercel + Let's Encrypt auto-renewal) |
| DB Connection | TiDB Cloud SSL strict (`?sslaccept=strict`) |
| Password | bcryptjs cost factor 10 (~100ms per hash) |
| Session | httpOnly cookie + 7-day TTL + path scope |
| Authorization | 5-tier RBAC + `<RoleGate>` per route |
| QR Token | UUID v4 (122-bit entropy) + DB-bound validation |
| Webhook | Midtrans signature SHA512 verify (replay-safe) |
| Audit Log | `ChangeLog` table records actor + before/after JSON |
| Soft Delete | `User.deletedAt` flag, restorable by SUPER_ADMIN |
| PCI-DSS | Zero card data stored — Midtrans handles tokenization (Level 1 PCI-DSS) |

### Why no AES-256 on QR tokens?

The classic answer is "encrypt sensitive data." The actual answer is: **the QR token is not the secret — the database lookup is.**

- UUID v4 has 122-bit entropy (~5×10³⁶ combinations) — brute-force takes longer than the heat death of the universe
- Server validates via `prisma.guest.findUnique({ where: { token } })` — random tokens not in DB return 404
- AES requires a shared key; if leaked, every QR ever generated is decryptable. Token-based has no such weakness.

---

## 💰 Monetization

```
PAKET ABSEN (Pay-per-event)
┌─────────────┬──────────────┬────────────────────────────┐
│ Basic       │ Rp 79.000    │ 200 tamu, 1 staff          │
│ Professional│ Rp 199.000   │ 1.000 tamu, unlimited staff│
│ Enterprise  │ Custom quote │ White-label, API, SLA      │
└─────────────┴──────────────┴────────────────────────────┘

TEMPLATE CATALOG (One-time purchase)
┌──────────────────────┬─────────────┐
│ 14 templates ready   │ Rp 149K-399K│
│ Editor + ownership   │ Forever     │
└──────────────────────┴─────────────┘

VARIABLE COSTS
─ Midtrans: 2.9-3.5% per transaction
─ Domain: Rp 192K/year (single .com)
─ Operational: Rp 0/month at MVP scale (free tier all the way)
```

**Roadmap pricing (post-MVP):**
- Subscription EO partner — Rp 500K-2M/month (Q3 2026)
- WhatsApp blast add-on via baileys self-hosted (Q4 2026)
- Photo book post-event premium add-on (Q1 2027)

---

## 🚧 Roadmap

### ✅ MVP (Done)
- [x] 14 hand-crafted templates with signature animations
- [x] Hybrid offline-first sync (XAMPP + TiDB Cloud)
- [x] Souvenir tracking with mode toggle
- [x] Cloudinary image upload
- [x] Midtrans Snap (sandbox + production)
- [x] 5-tier RBAC + audit log
- [x] iOS Safari camera scanner support
- [x] WhatsApp `wa.me/?text=` link generator

### 🟡 Q3 2026
- [ ] RSVP response tracking (Hadir/Tidak/Mungkin + plus-ones)
- [ ] Live scanner stats dashboard (real-time counter)
- [ ] CSV file upload (drag-drop, not textarea)
- [ ] Mobile drawer navigation for admin
- [ ] EO subscription billing
- [ ] Custom domain self-service

### 🟠 Q4 2026
- [ ] WhatsApp blast via baileys (self-hosted, no API ban risk)
- [ ] Email receipt via Resend
- [ ] 2FA for SUPER_ADMIN accounts
- [ ] Template marketplace for independent designers (70/30 split)

### 🔵 Q1 2027+
- [ ] Photo book post-event add-on
- [ ] Multi-event analytics for EO
- [ ] White-label EO portal
- [ ] WebSocket real-time dashboard for live events

---

## 📚 Documentation

- [`DEMO_FLOW.md`](./DEMO_FLOW.md) — 5-scenario presentation script (12-15 min)
- [`LAPORAN_REVISI.md`](./LAPORAN_REVISI.md) — Final UAS report — tech stack overview
- [`LAPORAN_REVISI_BAB2.md`](./LAPORAN_REVISI_BAB2.md) — Infrastructure deep-dive
- [`LAPORAN_REVISI_BAB5_6.md`](./LAPORAN_REVISI_BAB5_6.md) — Security + monetization
- [`LAPORAN_REVISI_NEW_SECTIONS.md`](./LAPORAN_REVISI_NEW_SECTIONS.md) — Souvenir tracking design

---

## 🧪 Testing

```bash
# Reset DB + seed demo data
node scripts/seed-demo.mjs

# List all users with role + plan
node scripts/list-users.mjs

# Reset all passwords to "123456"
node scripts/seed-passwords.mjs
```

---

## 🤝 Built By

This project was built as a final exam (UAS) for **E-Business** course at **Universitas Multimedia Nusantara (UMN)** — Semester 4.

**Repository:** [GodrezJr2/Lumina-Card](https://github.com/GodrezJr2/Lumina-Card)
**Live Demo:** [lumina-card.vercel.app](https://lumina-card.vercel.app)
**Course:** E-Business — Sistem Informasi UMN
**Year:** 2026

---

## 📜 License

MIT — feel free to fork, learn from, and adapt. If you build something cool, drop a ⭐ on the repo.

---

<div align="center">

### Made with ☕ + Next.js + TiDB Cloud + Cloudinary

If you found this useful, leave a ⭐ — it helps the project get discovered.

[⬆ Back to top](#-lumina-card)

</div>
