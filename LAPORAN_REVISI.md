# LAPORAN REVISI — Match dengan Implementasi Aktual

> **Cara pakai:** Setiap section di bawah ada **"BAB X.X — REVISI"**. Buka laporan PDF Anda di Word, cari teks lama (BEFORE), ganti dengan teks baru (AFTER). Tambahan section baru ditandai **[NEW SECTION]**.

---

## Ringkasan Diferensiasi: Laporan Lama vs Implementasi Baru

| Aspek | Laporan Klaim | Implementasi Aktual | Action |
|---|---|---|---|
| Auth | NextAuth.js + OAuth + 2FA | Cookie session + bcryptjs | Update Bab 2.5 |
| QR Generation | AES-256 encrypted | UUID v4 token-bound DB | Update Bab 2.3, 5.2 |
| Real-time Sync | WebSocket Pusher/Socket.io | Manual button push (offline-first hybrid) | Update Bab 2.3 + tambah dimensi Availability |
| Storage | Cloudflare R2 | Cloudinary (free tier) | Update Bab 2.1 |
| WhatsApp | WANotify/WATI API | `wa.me/?text=` link generator (manual click) | Update Bab 2.1, 6.6 |
| Email | Resend API | Belum diimplementasi (manual share link) | Update Bab 2.1 atau hapus |
| Templates | "100+ templates" target | 14 template ready (dgn animasi unik per-tema) | Update Bab 6.6 |
| Souvenir Tracking | (tidak disebut) | Mode toggle scanner (check-in/souvenir) | **NEW SECTION** Bab 6.2 |
| Backup | Daily TiDB Cloud | Native TiDB Cloud auto-backup | OK match |
| Compliance | PCI-DSS via Midtrans | Midtrans Snap implemented | OK match |

---

## TECH STACK FINAL (Bab 2.1 — Tabel Komponen)

### REVISI Bab 2.1 — Komponen Teknologi

**[BEFORE]**
```
Frontend & Backend  → Next.js 14 + React 18 (SSR, edge middleware)
Database            → MySQL (TiDB Serverless / PlanetScale)
Object Storage      → Cloudflare R2
CDN & DNS           → Cloudflare
Hosting Platform    → Vercel Pro
Payment Gateway     → Midtrans
Communication API   → WANotify (WhatsApp) + Resend (Email)
```

**[AFTER]**
```
Frontend & Backend  → Next.js 14.2 (App Router) + React 18 + TypeScript 5
Database (Cloud)    → TiDB Cloud (MySQL-compatible, distributed, SSL strict)
Database (Local)    → MySQL 8 / XAMPP (untuk offline-first scanner di gedung)
ORM                 → Prisma 5.14 (relationMode: prisma — TiDB tanpa FK native)
Authentication      → bcryptjs + httpOnly cookie session (7 hari)
Object Storage      → Cloudinary (free 25GB, auto-optimize webp/avif, CDN)
CDN & DNS           → Vercel Edge Network + Cloudflare (optional)
Hosting Platform    → Vercel
Payment Gateway     → Midtrans Snap (Sandbox + Production toggle via env)
QR Code Library     → html5-qrcode (camera scanner) + jsqr (foto upload decode)
Animation           → Framer Motion 12 + anime.js 4 (Sakura petals, Gold dust)
Smooth Scroll       → Lenis 1.3
WhatsApp Distribution → wa.me link generator (manual share, no API cost)
```

**Rasional perubahan:**
- bcryptjs dipilih karena lightweight, no Next-Auth boilerplate. Cookie-based session lebih simple untuk single-tenant SaaS. 2FA tidak diimplementasi pada MVP karena UAS scope.
- UUID v4 sebagai QR token: 122-bit entropy (~5 × 10³⁶ kombinasi), brute-force impossible. Tidak butuh AES-256 karena token disimpan server-side dan dilookup saat scan.
- Manual sync dipilih atas WebSocket karena fokus Lumina Card adalah **offline-first untuk gedung dengan internet buruk** — operator scan offline, sync saat dapat koneksi.
- Cloudinary atas R2 karena free tier 25GB cukup untuk MVP + auto image transformation (webp/avif/thumbnail) bawaan.

---

[Lanjut di file revisi part 2 — BAB 2.2 dst]
