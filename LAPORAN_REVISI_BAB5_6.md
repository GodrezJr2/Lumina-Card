# LAPORAN REVISI — BAB 5 (Security + Payment) & BAB 6 (Business Model)

> Lanjutan dari `LAPORAN_REVISI_BAB2.md`. Patch untuk Bab 5 + Bab 6.

---

## REVISI Bab 5.1 — Dimensi Keamanan E-Commerce

Tabel 6-dimensi (Integrity, Nonrepudiation, Authenticity, Confidentiality, Privacy, Availability) sebagian besar TETAP, tapi:

### REVISI baris **Authenticity** dan **Availability**

**[BEFORE — Authenticity]**
> Lumina Card memverifikasi identitas tamu melalui QR Code unik **terenkripsi AES-256** serta autentikasi login untuk penyelenggara acara.

**[AFTER — Authenticity]**
> Lumina Card memverifikasi identitas tamu melalui QR Code yang berisi token UUID v4 unik (122-bit entropy) yang divalidasi server-side di tabel database. Tidak ada decode di sisi client — server lookup token via Prisma → return guest data jika valid, reject 404 jika tidak. Untuk penyelenggara, autentikasi pakai cookie session httpOnly + bcryptjs hash password (cost factor 10).

---

**[BEFORE — Availability]**
> Infrastruktur cloud hosting dan server yang skalabel memastikan platform tetap tersedia meskipun terjadi lonjakan akses.

**[AFTER — Availability]**
> Cloud infrastructure (Vercel + TiDB Cloud) menyediakan auto-scaling untuk lonjakan akses. **Selain itu**, Lumina Card mengimplementasikan arsitektur **hybrid offline-first** — operator di gedung dengan internet buruk dapat scan tamu ke MySQL lokal (XAMPP), lalu sync ke server cloud setelah dapat koneksi. Ini menjamin availability bahkan saat venue mengalami gangguan ISP — diferensiator strategis vs kompetitor yang fully online-dependent.

---

## REVISI Bab 5.2 — Security Implementation

**[BEFORE]**
- Data Encryption: HTTPS (SSL)
- Unique QR Authentication: AES-256 encrypted
- Secure Login: enkripsi kata sandi

**[AFTER]**

```
1. Transport Encryption
   • HTTPS/TLS 1.3 bawaan Vercel + Let's Encrypt auto-renewal
   • TiDB Cloud: SSL strict mode untuk koneksi database

2. Password Hashing
   • bcryptjs cost factor 10 (~100ms per hash, brute-force resistant)
   • Migrasi dari SHA256 legacy: commit security 15b110b

3. Token-Based QR Authentication
   • UUID v4 per-tamu (universally unique, 122-bit entropy)
   • Server-side validation: prisma.guest.findUnique({ token })
   • Token statefull (DB-bound) — token random tanpa entry di DB → 404
   • Reject double check-in: 409 Conflict
   • Reject souvenir tanpa check-in dulu: 409 Conflict

4. Cookie-Based Session Auth
   • httpOnly + path=/ + maxAge 7 hari
   • user_id + user_role disimpan terpisah agar middleware bisa
     gate routes tanpa hit DB tiap request
   • Soft delete: user.deletedAt diperiksa di /api/auth/login —
     akun nonaktif tidak bisa login

5. Role-Based Access Control (RBAC)
   • 5 tier: BASIC_USER → DIY_CLIENT → FULL_SERVICE_CLIENT →
            USHER_STAFF → SUPER_ADMIN
   • Permission map di lib/roles.ts
   • RoleGate component wrap halaman → redirect kalau ga punya akses

6. Webhook Signature Verification
   • Midtrans Snap notification → diverifikasi via SDK
     (snap.transaction.notification) yang melakukan SHA512 check
   • Reject notification dengan signature invalid

7. Audit Log
   • Tabel ChangeLog mencatat semua aksi SUPER_ADMIN
     (role change, user delete, restore) — actorId, before/after JSON

8. Soft Delete + Restore
   • User dihapus tidak terhapus permanent — flagged deletedAt + deletedBy
   • SUPER_ADMIN bisa restore via /admin/users panel
```

---

## REVISI Bab 5.3 — Payment Systems Implementation

**[BEFORE]**
- Payment Gateway integrasi (Midtrans/Xendit)
- Automated Verification

**[AFTER — lebih detail teknis]**

```
1. Payment Gateway: Midtrans Snap
   • Sandbox URL untuk testing: dashboard.sandbox.midtrans.com
   • Production toggle via env: MIDTRANS_IS_PRODUCTION
   • Mendukung: VA (BCA, BNI, Mandiri, Permata), QRIS (semua bank),
     E-wallet (GoPay, ShopeePay), Credit Card

2. Flow Pembelian (Dua jalur, sama-sama via Snap)
   A. Template Katalog
      /catalog → pilih template → /catalog/checkout
      → POST /api/payment/midtrans/create (type=template)
      → Snap popup → user bayar
      → Webhook /api/payment/midtrans/notification (auto)
      → Set lockedTemplateId, push purchasedTemplates JSON
      → Upgrade role BASIC_USER → DIY_CLIENT (kalau dari basic)
      → Auto-create Event row (idempotent, default +30 hari)

   B. Paket Jasa Absen (Basic / Professional)
      /pricing → /pricing/checkout
      → POST /api/payment/midtrans/create (type=pricing)
      → Snap → bayar → webhook
      → Set servicePlan = "basic" | "professional"
      → Upgrade role kalau tier baru lebih tinggi
        (basic → DIY_CLIENT, professional → FULL_SERVICE_CLIENT)

3. Webhook Idempotency
   • Webhook URL: /api/payment/midtrans/notification
   • Verify signature SHA512 via SDK
   • Cek transaction_status === "settlement" (atau capture+accept)
   • Idempotent: re-call webhook dengan order_id sama tidak duplicate
     (cek existing event/role sebelum update)

4. PCI-DSS Compliance
   • Lumina Card TIDAK menyimpan data kartu apapun
   • Semua tokenisasi kartu di sisi Midtrans (Level 1 PCI-DSS provider)
   • Kami hanya store: order_id, status, amount, type, userId

5. Faktur & Receipt
   • Email receipt dikirim Midtrans langsung ke email pembeli
   • Untuk PMSE: faktur pajak elektronik (PPN 11%) digenerate
     manual via dashboard Midtrans → ekspor ke pelanggan korporat
```

---

## REVISI Bab 6.6 — Revenue Streams

### REVISI Pricing & Volume Targets

**[BEFORE — angka di laporan lama]**
- Basic Rp 79.000/event
- Premium Rp 199.000/event
- Enterprise Rp 500K-2M/event

**[AFTER — sesuai implementasi UI sekarang]**

Cek harga di landing page (`/`) dan pricing (`/pricing`):

```
PAKET ABSEN (Sistem RSVP + Scanner + Dashboard)
┌────────────┬──────────────┬─────────────────────────────┐
│ Paket      │ Harga        │ Limit                       │
├────────────┼──────────────┼─────────────────────────────┤
│ Basic      │ Rp 299.000   │ 200 tamu, 1 staff           │
│ Premium    │ Rp 799.000   │ 1.000 tamu, unlimited staff │
│ Enterprise │ Custom quote │ White-label, API, dedicated │
└────────────┴──────────────┴─────────────────────────────┘

TEMPLATE KATALOG (Beli sekali, edit sendiri)
┌─────────────────────┬──────────────┐
│ Template            │ Harga        │
├─────────────────────┼──────────────┤
│ Ethereal Garden     │ Rp 150.000   │
│ Modern Corporate    │ Rp 180.000   │
│ Sakura Dream        │ Rp 199.000   │
│ Minimal Ivory       │ Rp 220.000   │
│ Royal Gold          │ Rp 250.000   │
│ Seminar Pro         │ Rp 250.000   │
│ Ocean Drift         │ Rp 280.000   │
│ Neon Nexus          │ Rp 299.000   │
│ Terra Cotta         │ Rp 299.000   │
│ Golden Hour         │ Rp 349.000   │
│ Midnight Glam       │ Rp 399.000   │
│ Birthday Pop        │ Rp 149.000   │
│ Risograph Rave      │ Rp 169.000   │
│ Rustic Boho         │ Rp 199.000   │
└─────────────────────┴──────────────┘
TOTAL: 14 templates ready (target 100+ di backlog post-MVP)
```

### REVISI Subscription Revenue (Bab 6.6.2)

**Status MVP:** belum diimplementasi. Recurring billing via Midtrans Recurring API memerlukan waktu integrasi tambahan (~2 minggu post-UAS). Saat ini semua transaksi pay-per-event/template.

Catatan untuk laporan: hapus klaim "EO Subscription Rp 500K/bulan" atau **flag sebagai roadmap Q3 2026**.

### REVISI Add-on (Bab 6.6.3)

Status MVP:
- ✅ **Custom domain** — secara teknis tidak perlu fitur, EO bisa CNAME ke Vercel
- ❌ **WhatsApp Blast Package** — replaced dengan free wa.me link generator
- ✅ **Premium Template Marketplace** — tervisualisasi di /catalog dengan 14 template
- ❌ **Priority Support** — manual via WhatsApp ke admin
- ❌ **Post-Event Photo Book** — out of scope MVP

---

## REVISI Bab 6.7 — Key Resources

### Update Physical Resources

**[BEFORE]**
- Storage: Cloudflare R2

**[AFTER]**
- Storage: Cloudinary (free 25GB tier untuk MVP) — auto-format webp/avif, on-the-fly resize, global CDN. Akan migrasi ke R2 atau S3-compatible storage saat scale >25GB.

---

[Lanjut di `LAPORAN_REVISI_NEW_SECTIONS.md` — Souvenir tracking section + Bab 11 update]
