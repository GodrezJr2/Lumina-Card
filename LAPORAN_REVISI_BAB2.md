# LAPORAN REVISI — BAB 2 (Infrastructure)

> Lanjutan dari `LAPORAN_REVISI.md` — patch untuk Bab 2.2 sampai 2.5.

---

## REVISI Bab 2.2 — Infrastruktur Jaringan dan Performa

### a) Kebutuhan Bandwidth (TETAP — angka masih valid)

Asumsi 10.000 active users:
- 500 tamu/event × 20 event/bulan = 10.000 akses undangan
- Halaman undangan: 2-5 MB (foto, video Cloudinary auto-webp + lazy load)
- Total bandwidth: 50-100 GB/bulan (dalam batas Vercel + Cloudinary free tier)

### b) Detail Biaya Infrastruktur — REVISI ANGKA

**[BEFORE — Tabel biaya bulanan lama]**
```
Vercel Pro              $20  (Rp 320.000)
Database TiDB           $40  (Rp 640.000)
Cloudflare R2           $5   (Rp 80.000)
WhatsApp API WANotify   $15  (Rp 240.000)
Resend Email            $0-20
Total Operasional       ~$80/bulan (Rp 1.280.000)
```

**[AFTER — Real cost MVP]**
```
┌─────────────────────────┬──────────┬─────────────────┐
│ Item                    │ Cost USD │ Cost IDR        │
├─────────────────────────┼──────────┼─────────────────┤
│ Vercel Hobby (free)     │ $0       │ Rp 0            │
│ TiDB Cloud (free 5GB)   │ $0       │ Rp 0            │
│ Cloudinary (free 25GB)  │ $0       │ Rp 0            │
│ WhatsApp distribusi     │ $0       │ Rp 0 (wa.me)    │
│ Email                   │ $0       │ Rp 0 (skip MVP) │
│ Domain .com (annual)    │ $12/yr   │ Rp 192.000/yr   │
│ Midtrans                │ Per-tx   │ Rp 3.500-5.000  │
├─────────────────────────┼──────────┼─────────────────┤
│ TOTAL Bulanan MVP       │ ~$0      │ Rp 0            │
│ TOTAL Setup tahunan     │ $12      │ Rp 192.000      │
└─────────────────────────┴──────────┴─────────────────┘
```

**Catatan strategis:**
- MVP berjalan **gratis** karena setiap stack provider menyediakan free tier yang generous untuk penggunaan awal (≤1.000 users).
- Saat scale ke 10.000 users, biaya naik ~Rp 1.280.000/bulan (sesuai estimasi awal) karena upgrade Vercel Pro + TiDB Scaler + Cloudinary upgrade.
- Variable cost Midtrans 2.9-3.5% per-transaksi tetap sama, dibebankan ke harga paket.

### c) Skalabilitas Infrastruktur — TETAP VALID

Tidak ada perubahan asumsi tier scaling. Tabel skala 0-1k / 1k-10k / 10k-50k / 50k+ tetap akurat.

---

## REVISI Bab 2.3 — Mekanisme QR Code dan Hardware

### REVISI POINT BY POINT

**[BEFORE]**
```
1. Generation: QR Code unik dihasilkan menggunakan library qrcode (Node.js)
   dengan enkripsi AES-256
2. Distribution: QR Code dikirim via WhatsApp Blast (WANotify API) atau
   email (Resend API)
3. Validation: Scanner menggunakan smartphone EO/staf dengan web-based
   QR scanner (library html5-qrcode)
4. Synchronization: Real-time sync ke database TiDB menggunakan
   WebSocket (Pusher/Socket.io)
```

**[AFTER]**
```
1. Generation: Setiap tamu mendapat token unik UUID v4 (122-bit entropy,
   ~5×10³⁶ kombinasi). Token disimpan di tabel `Guest.token` dan
   di-encode menjadi QR Code di halaman /inv/[token]/qr.
   Keamanan: token unik per-tamu + lookup database server-side
   (tidak butuh AES karena server validate, bukan client decode).

2. Distribution: Operator membuka modal "Bagikan via WA" di /admin/guests,
   sistem generate `wa.me/?text=` link dengan template pesan
   personal + URL undangan, lalu klik per-tamu membuka
   WhatsApp dengan pesan terisi (tanpa biaya API per-msg).

3. Validation: Scanner web-based dengan 3 mode:
   • Upload Foto QR — decode pakai jsqr (offline-capable, no HTTPS)
   • Input Token Manual — paste UUID/URL undangan
   • Kamera Live — html5-qrcode dengan Html5Qrcode low-level API
     (iOS Safari & Android Chrome compatible)

4. Synchronization (Hybrid Offline-First): Saat acara di gedung dengan
   internet buruk, operator scan ke MySQL lokal (XAMPP). Setelah
   acara/dapat koneksi, klik tombol "Sync ke Server" → /api/sync/push
   melakukan UPSERT idempotent ke TiDB Cloud berdasarkan
   guest.token (UUID global unik). Tidak ada WebSocket karena
   bottleneck nyata adalah konektivitas gedung, bukan latensi pesan.

5. Souvenir Tracking (NEW): Scanner punya toggle Mode Check-In ↔ Mode
   Souvenir. Mode Souvenir akan reject tamu yang belum check-in
   dengan pesan "Wajib check-in dulu sebelum ambil souvenir",
   dan reject tamu yang sudah pernah ambil souvenir.
   Disimpan di kolom Attendance.pickedUpSouvenir + souvenirTime.
```

---

## REVISI Bab 2.4 — Software Development Tools (TAMBAHAN)

Tabel tools tetap, **tambah baris** di bawah:

```
┌──────────────────┬────────────────────────────────────────────┐
│ Cloudinary       │ Image storage + CDN + auto-optimize        │
│ Console          │ (free 25GB tier)                           │
├──────────────────┼────────────────────────────────────────────┤
│ Prisma Studio    │ DB GUI — `npx prisma studio`               │
│                  │ Cek raw data Attendance, Guest, dst.       │
├──────────────────┼────────────────────────────────────────────┤
│ Cloudflare       │ Optional: bila domain pakai Cloudflare DNS │
│ Tunnel           │ (untuk dev preview public)                 │
└──────────────────┴────────────────────────────────────────────┘
```

---

## REVISI Bab 2.5 — Keamanan & Compliance

### Tabel ASLI vs REAL

**[BEFORE]**
```
Aspek             │ Implementasi
──────────────────┼──────────────────────────────────────────
Enkripsi Data     │ HTTPS/SSL (Cloudflare), enkripsi AES-256
                  │ untuk QR Code
Autentikasi       │ NextAuth.js (OAuth 2.0), 2FA untuk akun EO
Proteksi DDoS     │ Cloudflare WAF
Backup Data       │ Automated daily backup (TiDB Cloud)
Compliance        │ UU PDP No. 27/2022, PCI-DSS (via Midtrans)
```

**[AFTER]**
```
Aspek             │ Implementasi Aktual
──────────────────┼─────────────────────────────────────────────────
Enkripsi Transit  │ HTTPS/SSL bawaan Vercel + Let's Encrypt (auto)
                  │ TiDB Cloud connection: SSL strict mode
                  │ (?sslaccept=strict)
Hash Password     │ bcryptjs (cost factor 10) — replace SHA256
                  │ legacy. Migration commit: 15b110b
Autentikasi       │ Cookie-based session (httpOnly, 7 hari)
                  │ — userId + role disimpan terpisah, validate
                  │ tiap request via middleware.ts
Authorization     │ Role-based (5 tier): BASIC_USER, DIY_CLIENT,
                  │ FULL_SERVICE_CLIENT, USHER_STAFF, SUPER_ADMIN
                  │ Permission map di lib/roles.ts → 8 fitur gate
QR Token          │ UUID v4 (122-bit) — token-bound di DB.
                  │ Scanner validate via prisma.guest.findUnique
                  │ ({ where: { token } })
Soft Delete       │ User.deletedAt — akun ga hilang permanent,
                  │ bisa di-restore SUPER_ADMIN
Audit Log         │ ChangeLog table — record actor, category,
                  │ before/after JSON, target — semua aksi
                  │ SUPER_ADMIN tercatat
Backup Data       │ TiDB Cloud automated daily snapshot
                  │ (default plan, 7-day retention)
Webhook Security  │ Midtrans signature SHA512 verification
                  │ via SDK (snap.transaction.notification)
Compliance        │ UU PDP No. 27/2022 alignment,
                  │ PCI-DSS dipenuhi via Midtrans (kami tidak
                  │ store card data sama sekali)
```

**[NEW] Subsection 2.5.x — Hybrid Offline-First Architecture**

> **Diferensiator strategis** vs kompetitor.

Lumina Card mendukung **operasi gedung tanpa internet**:

1. Operator install MySQL lokal (XAMPP) di laptop yang dipakai scan.
2. Saat acara, scanner POST ke `/api/checkin` lokal — data tersimpan di MySQL local.
3. Setelah acara/dapat koneksi WiFi venue/3G, operator klik tombol "Sync ke Server" di header `/admin/scanner`.
4. Endpoint `/api/sync/push` (auth: SUPER_ADMIN | FULL_SERVICE_CLIENT):
   - Read all `Guest + Attendance` dari `prismaLocal` (XAMPP)
   - Open koneksi ke TiDB Cloud via `PROD_DATABASE_URL` env var
   - Verify event exists di cloud (else 404)
   - Loop guest: UPSERT by `token` (UUID global unik — idempotent multi-run safe)
   - Forward `pickedUpSouvenir` + `souvenirTime` ke cloud
5. Return `{ synced, attendances, errors[] }` — parsial-fail safe (per-guest error tertangkap, loop tetap lanjut).

**Manfaat:**
- Operator EO tidak khawatir gedung mati internet di hari-H
- Data tetap terjaga di lokal — kalau laptop dicuri, recovery dari TiDB
- Idempotent → bisa sync berkali-kali tanpa duplikasi data

**Trade-off (ditambahkan untuk transparansi):**
- Event harus dibuat di production database **sebelum** hari H (sync 404 kalau event ID belum ada di cloud)
- Tidak real-time WebSocket — tapi konteks Lumina Card adalah offline-friendly, bukan livestream

---

[Lanjut di `LAPORAN_REVISI_BAB5_6.md` — Security/Availability + Revenue]
