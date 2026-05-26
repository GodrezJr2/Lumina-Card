# DEMO FLOW — Lumina Card UAS

> Skenario presentasi kelompok untuk dosen E-Business. Tujuannya: tunjukkan **alur bisnis end-to-end** + **diferensiator strategis** (souvenir tracking + hybrid offline-first), bukan sekadar tour fitur.

**Total durasi target: 12–15 menit** (5 skenario × ~2 menit + Q&A buffer).

---

## 0. PERSIAPAN — Sebelum Dosen Masuk

```bash
# 1) Pastikan DB up
npx prisma db push       # apply schema kalau belum

# 2) Reset & isi data demo (idempotent — aman re-run)
node scripts/seed-demo.mjs

# 3) Jalankan dev server
npm run dev              # http://localhost:3001

# 4) (Opsional) buka 2 browser/window:
#    - Window A: laptop presenter — buat narasi admin/landing
#    - Window B: HP via tunneling/wifi LAN — demo scanner + undangan publik
```

**Output `seed-demo.mjs`** → 5 akun + 2 event + 13 tamu siap pakai. Password semua: `123456`.

| Role | Email | Password | Untuk demo skenario |
|---|---|---|---|
| SUPER_ADMIN | `admin@luminacard.app` | 123456 | Skenario 4 (audit, user mgmt) |
| FULL_SERVICE_CLIENT | `fullservice@luminacard.app` | 123456 | Skenario 2, 3, 5 |
| DIY_CLIENT | `diy@luminacard.app` | 123456 | Skenario 1 |
| USHER_STAFF | `usher@luminacard.app` | 123456 | Skenario 3 (scanner) |
| BASIC_USER | `basic@luminacard.app` | 123456 | Skenario 1 (purchase flow) |

**Tab browser yang dibuka di awal** (atur urutan jadi shortcut waktu demo):

1. `http://localhost:3001/` — landing page
2. `http://localhost:3001/catalog` — katalog template
3. `http://localhost:3001/pricing` — paket absen
4. `http://localhost:3001/i/andi-maya-2026` — undangan publik DIY (Ethereal Garden)
5. `http://localhost:3001/i/bayu-nadira-2026` — undangan publik Full-service (Midnight Glam)
6. `http://localhost:3001/admin/login` — login admin
7. (di HP) `http://192.168.x.x:3001/admin/scanner` — scanner mode

---

## PEMBAGIAN ANGGOTA KELOMPOK (Saran)

Sesuaikan dengan jumlah anggota. Versi 4 orang:

| # | Anggota | Bagian | Skenario |
|---|---|---|---|
| 1 | Anggota A | Pembuka + landing/value proposition + Skenario 1 (Customer journey) | 0–4 |
| 2 | Anggota B | Skenario 2 (DIY editor) + Skenario 3 (Scanner souvenir) | 4–8 |
| 3 | Anggota C | Skenario 4 (Admin panel + RBAC + audit log) + Skenario 5 (Hybrid sync) | 8–12 |
| 4 | Anggota D | Tech stack overview + monetisasi + roadmap + jawab Q&A | 12–15 |

**Tip:** Anggota D pegang laptop kedua sebagai "viewer" — biar bisa overlay terminal, scanner HP, atau Prisma Studio saat anggota lain narasi.

---

## SKENARIO 1 — Customer Journey (BASIC_USER → DIY_CLIENT)

> **Cerita:** "Saya calon pengantin yang lagi nyari undangan digital. Saya browse, beli template, dan langsung dapat akses editor."

**Durasi:** ~2 menit. **Login awal:** `basic@luminacard.app`.

### Step-by-step

1. **Buka landing page (`/`)** — narasikan value proposition:
   - Hero: "Undangan Digital + Absensi Cerdas dalam Satu Platform"
   - Highlight 4 feature card (RSVP, Scanner, Real-time, Aman)
   - Scroll ke section Pricing — tunjukkan 3 paket (Basic Rp 299K, Professional Rp 799K, Enterprise Custom)

2. **Klik "Lihat Template" → `/catalog`**:
   - Tunjukkan **14 template** berbeda (editorial luxury, beach, Indo heritage, corporate, party)
   - Klik salah satu template → preview live (`/catalog/preview/ethereal-garden`)
   - Sebutkan: "Setiap template punya signature animation berbeda. Ini Sakura Dream pakai canvas falling petals lewat anime.js"

3. **Login sebagai `basic@luminacard.app`** → role-nya `BASIC_USER`. Tunjukkan dashboard kosong: "Belum punya event."

4. **Beli template** (jangan benar-benar checkout, cukup demo Snap pop-up):
   - `/catalog` → klik template → "Beli Template"
   - Snap Midtrans muncul — narasikan: "Checkout pakai Midtrans Snap, support VA, QRIS, e-wallet, kartu kredit. Sandbox di sini."
   - Tutup Snap (kita pakai akun yang sudah selesai purchase di seed: `diy@luminacard.app`)

5. **Logout, login ulang sebagai `diy@luminacard.app`** → tunjukkan:
   - Auto-redirect ke `/admin/events/[id]/template` (template editor)
   - Onboarding checklist 5 step (nama pasangan, tanggal, alamat, musik, slug)
   - Status checklist sudah hijau karena seed mengisi data

**Talking points:**
- "Webhook Midtrans verify SHA512, idempotent — bayar sekali tidak bisa di-replay"
- "Otomatis upgrade role BASIC → DIY_CLIENT setelah pembayaran settle"
- "Auto-create Event row default +30 hari supaya user langsung bisa edit"

---

## SKENARIO 2 — DIY Editor + Undangan Publik

> **Cerita:** "Sebagai DIY client, saya custom undangan saya sendiri — foto, musik, lokasi — lalu bagikan link ke tamu."

**Durasi:** ~2 menit. **Login:** `diy@luminacard.app` (lanjutan dari Skenario 1).

### Step-by-step

1. **Template editor `/admin/events/[id]/template`**:
   - Tunjukkan field: Couple Names, Story, Venue, Music URL (YouTube), Gallery (drag-drop Cloudinary)
   - Demo upload foto baru → progress bar → URL ter-set otomatis (Cloudinary CDN)
   - Klik "Simpan" → toast sukses

2. **Tab "Tamu"** di admin → `/admin/guests` (event picker):
   - Pilih event "Pernikahan Andi & Maya"
   - Tabel tamu: 5 orang (Budi, Citra, Dewi, Eko, Farhan)
   - Tunjukkan kolom **Status** + kolom **Souvenir** (badge amber/slate)
   - Klik tombol "Bagikan via WA" pada salah satu tamu → modal preview pesan + tombol kirim
   - Demo bulk import: paste `Nama Baru | 081234`<br>support pipe, tab (Excel paste), koma (CSV)

3. **Buka `/i/andi-maya-2026`** (public invitation):
   - Template Ethereal Garden render dengan musik YouTube auto-play (setelah klik di mana saja)
   - Scroll: hero → couple section → story → gallery → location map → RSVP form
   - Klik tombol QR → `/inv/[token]/qr` → tampil QR Code yang siap di-share

**Talking points:**
- "Image upload pakai Cloudinary free tier 25GB, auto-optimize ke webp/avif"
- "QR Code-nya UUID v4 — 122-bit entropy. Server validate via Prisma lookup, bukan client decode. Jadi tidak perlu AES."
- "WhatsApp distribusi pakai `wa.me/?text=` link — gratis, no API ban risk, manual click per tamu (atau template untuk jasa premium WA blast)"

---

## SKENARIO 3 — Hari-H: Scanner + Souvenir Tracking (KILLER FEATURE)

> **Cerita:** "Hari pernikahan tiba. Operator EO scan QR tamu, lalu switch mode untuk distribusi souvenir. Tidak bisa double-claim, tidak bisa ambil tanpa hadir."

**Durasi:** ~3 menit (paling lama — ini diferensiator utama). **Login:** `usher@luminacard.app` di HP/laptop kedua.

### Step-by-step

1. **Buka `/admin/scanner` di HP** (via WiFi LAN, IP laptop):
   - Pilih event "Pernikahan Andi & Maya"
   - Tampil 3 mode input: **Upload Foto**, **Input Manual**, **Kamera Live**
   - Tampil **toggle mode**: 🟢 Mode Check-In (default emerald) ↔ 🟡 Mode Souvenir (amber)

2. **Demo Mode Check-In:**
   - Buka tab `/admin/guests` di laptop, klik tombol QR pada tamu "Citra Lestari" (status: Sent)
   - Salin URL → paste ke "Input Manual" di scanner HP
   - Klik scan → muncul ✅ "Check-in berhasil! Citra Lestari"
   - Refresh tab `/admin/guests` → status Citra berubah jadi **Checked_In**

3. **Demo Edge Case 1 — Double check-in dicegah:**
   - Scan token Citra lagi → server response 409: "Tamu sudah pernah check-in sebelumnya."
   - Tampil di scanner UI dengan warning amber

4. **Demo Mode Souvenir** (toggle ke amber):
   - Scan Citra (yang baru check-in) → ✅ "Souvenir berhasil diberikan! Citra Lestari"
   - Tabel `/admin/guests` → kolom Souvenir badge "Sudah" + tooltip waktu pickup

5. **Demo Edge Case 2 — Souvenir tanpa check-in dicegah:**
   - Scan token "Dewi Anggraini" (status: Opened, belum check-in)
   - Server response 409: "Tamu belum check-in. Wajib check-in dulu sebelum ambil souvenir."

6. **Demo Edge Case 3 — Double souvenir dicegah:**
   - Scan Citra di mode Souvenir lagi → 409: "Tamu sudah pernah ambil souvenir."

7. **Buka `/admin/dashboard`** → 4 stat card real-time:
   - Total Tamu | Check-In | **Souvenir** | Sudah Dibuka
   - Counter naik sesuai aksi tadi

**Talking points (penting!):**
- "Souvenir tracking ini **tidak ada di kompetitor undangan digital Indonesia**. Cocok buat dijual ke EO/wedding organizer sebagai feature premium."
- "Validasi server-side — bukan client-side toggle. Jadi tidak bisa di-bypass dengan modifikasi browser."
- "Schema-nya: `Attendance.pickedUpSouvenir` Boolean + `souvenirTime` DateTime — audit trail per pickup ada timestamp."
- "Tiga rule yang server enforce: tidak bisa double check-in, tidak bisa double souvenir, tidak bisa ambil souvenir tanpa hadir."

---

## SKENARIO 4 — Admin Panel: RBAC + Audit Trail + Soft Delete

> **Cerita:** "Sebagai super admin, saya bisa kelola user, lihat audit log, soft-delete + restore akun. Semua aksi tercatat."

**Durasi:** ~2 menit. **Login:** `admin@luminacard.app`.

### Step-by-step

1. **Buka `/admin/users`**:
   - Tabel semua user (5 akun seed + jika ada user real)
   - Tunjukkan kolom: Email, Role, Service Plan, Locked Template, Status (Active/Deleted)
   - Filter dropdown: All / Active / Deleted

2. **Demo perubahan role**:
   - Klik user `basic@luminacard.app`
   - Ubah role: BASIC_USER → DIY_CLIENT
   - Konfirmasi → toast sukses

3. **Demo soft delete**:
   - Pada user yang sama → klik "Hapus" → konfirmasi
   - Status berubah jadi "Deleted" (tetap ada di tabel, baris abu)
   - Login ulang dengan akun itu di tab incognito → server tolak: "Akun ini telah dinonaktifkan."

4. **Demo restore**:
   - Filter ke "Deleted" → klik "Restore" → user aktif lagi

5. **Buka `/admin/panel`** (audit log):
   - Tampil ChangeLog: actor, kategori, deskripsi, before/after JSON, timestamp
   - Filter by category: `user_role_change`, `user_delete`, `user_restore`, `system`
   - Tunjukkan entry seed `system` + entry baru dari aksi tadi

**Talking points:**
- "5 tier RBAC: BASIC_USER → DIY_CLIENT → FULL_SERVICE_CLIENT → USHER_STAFF → SUPER_ADMIN"
- "Permission map di `lib/roles.ts` → setiap halaman dibungkus `<RoleGate>` component yang redirect kalau ga punya akses"
- "Soft delete > hard delete: data tetap ada untuk recovery + audit. `User.deletedAt` flag."
- "ChangeLog menyimpan `before`/`after` JSON — full audit trail untuk compliance UU PDP No. 27/2022"

---

## SKENARIO 5 — Hybrid Offline-First Sync (DIFERENSIATOR INFRA)

> **Cerita:** "Gedung pernikahan internetnya jelek? Gak masalah. Operator bisa scan offline ke MySQL lokal, lalu klik tombol sync setelah dapat WiFi."

**Durasi:** ~2 menit (boleh skip kalau waktu tipis — tunjukkan diagram saja). **Login:** `fullservice@luminacard.app`.

### Step-by-step

1. **Buka diagram di slide presentasi (atau jelaskan dengan tangan):**

```
   GEDUNG (Internet putus)              SETELAH ACARA (dapat WiFi)
   ┌─────────────────────┐              ┌─────────────────────────┐
   │ Laptop EO + XAMPP   │              │  /api/sync/push          │
   │ MySQL lokal         │  ────────►   │  - Read all local guests │
   │ Scan tamu offline   │   Klik       │  - Open koneksi TiDB     │
   │ (POST /api/checkin  │  "Sync ke    │  - UPSERT by token (UUID │
   │  ke localhost)      │   Server"    │    global unik = idempotent)
   └─────────────────────┘              │  - Forward souvenir flag │
                                        └─────────────────────────┘
                                                   │
                                                   ▼
                                        ┌─────────────────────────┐
                                        │ TiDB Cloud (Production) │
                                        │ Data tersinkron, dashboard│
                                        │ EO bisa lihat real-time  │
                                        └─────────────────────────┘
```

2. **Live demo (kalau XAMPP siap):**
   - Tunjukkan `.env` punya 2 connection string: `DATABASE_URL` (lokal) + `PROD_DATABASE_URL` (TiDB)
   - Buka Prisma Studio lokal: `npx prisma studio` — lihat tabel Attendance lokal
   - Klik tombol **"Sync ke Server"** di header `/admin/scanner`
   - Response: `{ synced: 2, attendances: 2, errors: [] }`

**Talking points:**
- "Token UUID v4 global unik → upsert idempotent. Bisa sync berkali-kali tanpa duplikat data."
- "Trade-off: event harus ada di production database **sebelum** hari-H (sync 404 kalau event ID belum ada di cloud)."
- "Kompetitor undangan digital semua fully online-dependent. Lumina Card punya jalur degraded mode yang predictable."
- "Bottleneck nyata di gedung adalah konektivitas, bukan latensi pesan. Makanya kami pilih offline-first daripada WebSocket."

---

## TECH STACK SUMMARY (1 menit — Anggota D)

| Layer | Pilihan | Alasan |
|---|---|---|
| Frontend | Next.js 14 App Router + React 18 + TS 5 | SSR + edge middleware, single repo |
| Database | TiDB Cloud (cloud) + MySQL/XAMPP (lokal) | MySQL-compatible distributed, free 5GB |
| ORM | Prisma 5.14 (`relationMode: prisma`) | TiDB tidak punya FK native |
| Auth | bcryptjs cost 10 + httpOnly cookie | Lightweight, no NextAuth boilerplate |
| Storage | Cloudinary (free 25GB) | Auto webp/avif, on-the-fly resize |
| Payment | Midtrans Snap (Sandbox + Prod) | VA, QRIS, e-wallet, kartu kredit |
| QR | `html5-qrcode` (camera) + `jsqr` (foto) | iOS Safari & Android Chrome compatible |
| Animation | Framer Motion 12 + anime.js 4 | Per-template signature animation |
| Hosting | Vercel free tier | Edge network, auto HTTPS, zero config |

**Cost MVP:** Rp 0/bulan (semua free tier) + Rp 192K/tahun domain. Variable cost Midtrans 2.9–3.5% per-tx.

---

## MONETISASI (30 detik)

```
PAKET ABSEN (per-event)              TEMPLATE KATALOG (one-time)
─ Basic Rp 299K  (200 tamu)          ─ 14 template Rp 149K – 399K
─ Premium Rp 799K (1000 tamu, WA)    ─ Roadmap: marketplace 70/30
─ Enterprise Custom (white-label)
```

Roadmap Q3 2026: subscription EO + WhatsApp blast via baileys di home server.

---

## CONTINGENCY — Kalau Demo Error

| Masalah | Recovery cepat |
|---|---|
| Scanner kamera blank di iOS | Pakai mode "Upload Foto" — paste screenshot QR |
| Cloudinary upload error | Tampilkan tab `/i/andi-maya-2026` — gallery sudah seeded |
| Midtrans Snap tidak load | Skip checkout demo, langsung login `diy@luminacard.app` |
| Sync error | Skip Skenario 5 live demo, jelaskan via diagram |
| DB lokal mati | Pastikan XAMPP MySQL running di port 3306 sebelum demo |

---

## Q&A — Antisipasi Pertanyaan Dosen

**"Kenapa pakai UUID v4, bukan AES-256 untuk QR Code?"**
> Token UUID v4 punya 122-bit entropy (~5×10³⁶ kombinasi). Brute-force impossible. Server validate via DB lookup, bukan client decode — jadi tidak perlu shared key untuk dekripsi. AES-256 cocok kalau kita kirim payload terenkripsi yang client perlu decode. Token-based simpler dan sama amannya.

**"Bedanya dengan kompetitor (canva-template, kawanmanten, weddinglust)?"**
> Tiga diferensiator: (1) Souvenir tracking server-enforced — kompetitor tidak ada. (2) Hybrid offline-first sync untuk gedung internet jelek. (3) 14 template dengan signature animation berbeda per tema, bukan template generik.

**"PCI-DSS compliance gimana?"**
> Kami tidak menyimpan data kartu sama sekali. Semua tokenisasi di sisi Midtrans (Level 1 PCI-DSS provider). Yang kami simpan: order_id, status, amount, type, userId.

**"Skala?"**
> MVP 0–1000 user di free tier. Saat 10k user, upgrade Vercel Pro + TiDB Scaler ~Rp 1.28 juta/bulan. Variable cost Midtrans 2.9–3.5% dibebankan ke harga paket.

**"Real-time gimana kalau tidak pakai WebSocket?"**
> Untuk konteks Lumina Card, real-time bukan kebutuhan utama — bottleneck adalah konektivitas gedung. Dashboard di-poll tiap render (Server Action + revalidate). Kalau scale ke EO besar, roadmap pakai TiDB CDC + SSE.

---

## CHECKLIST FINAL — Sebelum Dosen Masuk Ruang

- [ ] `node scripts/seed-demo.mjs` sudah dijalankan, output OK
- [ ] `npm run dev` running di port 3001
- [ ] HP usher sudah connect WiFi sama dengan laptop, bisa buka `/admin/scanner`
- [ ] Login test 5 akun (sekali per role)
- [ ] Tab browser sudah disusun urutan
- [ ] Slide tech stack + monetisasi sudah siap (atau pakai DEMO_FLOW.md ini)
- [ ] XAMPP MySQL running (untuk demo sync)
- [ ] Backup: screenshot semua skenario kalau internet/listrik mati

**Selamat presentasi! 🎓**

