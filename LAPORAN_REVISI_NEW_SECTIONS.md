# LAPORAN REVISI — NEW SECTIONS & MEDIA

> Lanjutan dari `LAPORAN_REVISI_BAB5_6.md`. Bagian baru yang **belum ada** di laporan: Souvenir Tracking + Update Bab 11 (Online Media).

---

## [NEW SECTION] Bab 6.2.x — Souvenir Tracking System

> **Tambahkan section baru ini** setelah Bab 6.2.1 (Pain Relievers) dan sebelum 6.2.2 (Gain Creators). Atau bisa juga ditaruh sebagai sub-bab tersendiri di Bab 2.3 (Mekanisme QR).

### Latar Belakang

Penyelenggara acara, terutama wedding di Indonesia, lazim memberikan **souvenir** kepada tamu yang hadir. Manajemen distribusi souvenir secara manual sering bermasalah:
- Tamu mengambil souvenir lebih dari sekali (double-claim)
- Tamu mengambil souvenir tanpa hadir di acara (gatecrash souvenir)
- Sulit melacak souvenir yang sudah/belum diambil → pemborosan stok
- Tidak ada data akurat untuk laporan vendor souvenir

### Solusi Lumina Card

**Mode Toggle pada QR Scanner.** Operator dapat switch antara dua mode:

```
┌────────────────────┐ ┌────────────────────┐
│ ✓ Mode Check-In    │ │ 🎁 Mode Souvenir   │
│   (default emerald)│ │   (amber)          │
└────────────────────┘ └────────────────────┘
```

**Aturan Validasi (server-side enforced di `/api/checkin`):**

1. Mode Check-In:
   - Reject jika status guest sudah `Checked_In` → "Tamu sudah pernah check-in sebelumnya."
   - Else → set status `Checked_In`, create `Attendance.checkInTime`
2. Mode Souvenir:
   - Reject jika `guest.status !== "Checked_In"` → "Tamu belum check-in. Wajib check-in dulu."
   - Reject jika `attendance.pickedUpSouvenir === true` → "Tamu sudah pernah ambil souvenir."
   - Else → set `Attendance.pickedUpSouvenir = true` + `souvenirTime = now()`

### Schema Database (Prisma)

```prisma
model Attendance {
  id                Int       @id @default(autoincrement())
  guestId           Int       @unique
  checkInTime       DateTime  @default(now())
  pickedUpSouvenir  Boolean   @default(false)  // NEW
  souvenirTime      DateTime?                  // NEW
  guest             Guest     @relation(fields: [guestId], references: [id], onDelete: Cascade)
}
```

### Manfaat Bisnis

| Aspek | Manual | Lumina Card |
|---|---|---|
| Double-claim prevention | ❌ Manual list/centang | ✅ Server-side reject |
| Souvenir tanpa hadir | ❌ Tidak terdeteksi | ✅ Reject otomatis |
| Real-time stock tracking | ❌ Tidak ada | ✅ Counter di dashboard |
| Audit trail | ❌ Tidak ada | ✅ Timestamp per-pickup |
| Data untuk vendor | ❌ Manual rekap | ✅ Export tabel attendance |

### UI di Guest List (`/admin/guests`)

Kolom baru: **Souvenir** dengan badge:
- 🟡 **Sudah** (amber) — dengan tooltip waktu pickup `Diambil 14:23 — 25 Mei 2026`
- ⚪ **Belum** (slate) — pending

### Stat Card Dashboard

`/admin/dashboard` → 4 stat card real-time:
- Total Tamu
- Check-In (count `status === "Checked_In"`)
- Souvenir (count `attendance.pickedUpSouvenir === true`)  ← NEW
- Sudah Dibuka (count `status === "Opened"`)

### Diferensiator Kompetitif

Souvenir tracking **belum ada di kompetitor undangan digital** Indonesia (canva-template, kawanmanten, weddinglust, dll.). Hanya Lumina Card yang menyediakan kontrol distribusi souvenir di hari-H. Cocok dijual sebagai feature highlight di paket Premium/Enterprise.

---

## REVISI Bab 11.2 — Jenis Konten Digital pada Lumina Card

### Tambahan baris ke tabel "Jenis Konten Digital":

**[BEFORE — tabel saat ini]**
```
Teks, Foto/video, Audio/backsound, Animasi, Maps digital, QR Code
```

**[AFTER]**

```
┌──────────────────┬───────────────────────────────────────────────┐
│ Jenis Konten     │ Penerapan di Lumina Card                      │
├──────────────────┼───────────────────────────────────────────────┤
│ Teks Stylized    │ Display fonts: Italianno cursive (MidnightGlam│
│                  │ /Royal Gold), Fraunces editorial (OceanDrift),│
│                  │ Bricolage Grotesque ultra-bold (Risograph),   │
│                  │ Cormorant Infant (TerraCotta), Playfair       │
│                  │ Display (MinimalIvory). 10+ Google Fonts.     │
├──────────────────┼───────────────────────────────────────────────┤
│ Foto + Galeri    │ Cloudinary CDN. Auto webp/avif. Layout:       │
│                  │ mosaic (Ivory), tape-rotated (Risograph),     │
│                  │ asymmetric (Boho), grayscale-on-hover         │
│                  │ (MidnightGlam), sepia (TerraCotta).           │
├──────────────────┼───────────────────────────────────────────────┤
│ Animasi Custom   │ Per-template signature animation:             │
│                  │ • Sakura Dream — falling petals canvas        │
│                  │   (anime.js)                                  │
│                  │ • Golden Hour — gold particle dust            │
│                  │ • MidnightGlam — gold shimmer canvas          │
│                  │ • OceanDrift — animated SVG wave morph        │
│                  │ • TerraCotta — animated batik motif draw      │
│                  │ • Risograph — duotone shape rotation          │
│                  │ • Birthday Pop — confetti float               │
├──────────────────┼───────────────────────────────────────────────┤
│ Audio/backsound  │ MusicPlayer floating widget. Mendukung:       │
│                  │ • YouTube URL (auto-convert ke embed,         │
│                  │   loop trick via playlist param)              │
│                  │ • Direct MP3/OGG/WAV/AAC                      │
│                  │ Autoplay setelah first user gesture           │
│                  │ (browser policy compliant).                   │
├──────────────────┼───────────────────────────────────────────────┤
│ Maps Digital     │ Google Maps embed via iframe (template editor)│
│                  │ Coords / share link.                          │
├──────────────────┼───────────────────────────────────────────────┤
│ QR Code Tiket    │ Generated dari token UUID v4 di /inv/[token]/ │
│                  │ qr — html5-qrcode component, downloadable     │
│                  │ PNG/JPG, share-able via WA.                   │
├──────────────────┼───────────────────────────────────────────────┤
│ RSVP Form        │ Form modal dalam template — submit ke         │
│                  │ /api/inv/[slug]/rsvp → update Guest.status    │
│                  │ → reflect ke dashboard EO real-time.          │
└──────────────────┴───────────────────────────────────────────────┘
```

### Tambahan pernyataan tema desain

**[NEW PARAGRAPH]** Setelah deskripsi tabel, tambahkan:

> Lumina Card mengkurasi **14 template invitation** yang dibagi ke beberapa kategori distinct: editorial luxury (Minimal Ivory, Midnight Glam, Royal Gold), beach destination (Ocean Drift, Golden Hour), Indonesian heritage (Sakura Dream, Terra Cotta), corporate (Modern Corporate, Seminar Pro), tech-future (Neon Nexus), dan party (Rustic Boho, Birthday Pop, Risograph Rave, Ethereal Garden). Setiap template memiliki signature animation dan typography pairing yang berbeda — mendekati pengalaman editorial magazine dibanding template generik. Tema design intent: hindari generic AI aesthetic (purple gradient, default Inter font).

---

## REVISI Bab 11.3 — Model Pendapatan Konten Digital

Match dengan Bab 6.6 — pakai harga real:

**[REVISI poin "paid template"]**
> Model **paid template marketplace**: 14 template ready (Rp 149K-399K), one-time purchase per template. Saat user beli, otomatis dapat akses edit + assign ke event mereka. Template revenue split internal: 100% Lumina Card untuk template in-house. Future: marketplace untuk independent designer dengan 70/30 split.

**[REVISI poin "subscription"]**
> Model **paket jasa absen** (bukan subscription, tapi pay-per-event):
> - Basic Rp 299.000 — 1 event, hingga 200 tamu, scanner + dashboard
> - Premium Rp 799.000 — 1 event, hingga 1.000 tamu, WA blast helper, priority support
> - Enterprise — custom quote, white-label, multi-event
>
> Recurring subscription untuk EO partner: roadmap Q3 2026.

---

## REVISI Bab 11.4 — Perlindungan Konten Digital

**Tambahan teknik perlindungan aktual yang sudah diimplementasi:**

```
1. Watermark visual otomatis pada preview gratis
   (placeholder — implementasi lanjutan)
2. Lock template per-user via lockedTemplateId di User table
   (purchasedTemplates JSON history)
3. Akses template editor di-gate dgn permission map
   (lib/roles.ts → hanya DIY_CLIENT/SUPER_ADMIN)
4. Cloudinary signed URLs (optional Q2 future) untuk asset premium
5. SSL transit enforced — Vercel auto HTTPS
6. Trademark "Lumina Card" — registrable di DJKI kelas 9, 35, 41
```

---

## CHECKLIST Final untuk Editor Laporan

Sebelum print final laporan, cek:

- [ ] Bab 1.5 (Profil Produk) — tambah souvenir tracking ke list fitur utama
- [ ] Bab 2.1 — replace tabel komponen dengan versi REAL
- [ ] Bab 2.2 — replace tabel biaya bulanan
- [ ] Bab 2.3 — rewrite mekanisme QR (5 langkah baru + Sync hybrid)
- [ ] Bab 2.4 — tambah Cloudinary, Prisma Studio
- [ ] Bab 2.5 — replace tabel keamanan + tambah subsection 2.5.x Hybrid Offline-First
- [ ] Bab 5.1 — update Authenticity & Availability rows
- [ ] Bab 5.2 — replace 3-bullet jadi 8-bullet detail
- [ ] Bab 5.3 — expand jadi 5 subsection (gateway, flow, idempotency, PCI, faktur)
- [ ] Bab 6.2 — INSERT new section "Souvenir Tracking System"
- [ ] Bab 6.6 — replace pricing tabel + 14 template list
- [ ] Bab 6.7 — Cloudinary swap dari R2
- [ ] Bab 11.2 — replace tabel jenis konten dengan versi detail
- [ ] Bab 11.3 — pricing match Bab 6.6
- [ ] Bab 11.4 — tambah teknik perlindungan aktual

## Hapus / Flag sebagai Roadmap

Klaim laporan yang **belum diimplementasi** — flag sebagai roadmap atau hapus:

- ❌ NextAuth.js + 2FA → roadmap Q4 2026 atau hapus
- ❌ AES-256 QR encryption → ganti dengan UUID v4 explanation
- ❌ WebSocket Pusher/Socket.io → ganti dengan hybrid sync narrative
- ❌ WANotify/WATI API → ganti dengan wa.me link (atau roadmap)
- ❌ Resend Email API → roadmap atau hapus
- ❌ Cloudflare R2 → ganti Cloudinary
- ❌ EO Subscription Rp 500K/bulan → roadmap Q3 2026
- ❌ Custom domain feature → roadmap (technically optional)

---

## Kalimat Penutup untuk Tim (Optional)

> "Implementasi Lumina Card MVP berfokus pada **diferensiator strategis** yang tidak dimiliki kompetitor: hybrid offline-first sync untuk gedung berInternet buruk, dan souvenir tracking untuk kontrol distribusi hari-H. Stack teknologi dipilih dengan prioritas **biaya operasional Rp 0** di fase MVP via free tier provider (Vercel, TiDB Cloud, Cloudinary), dengan jalur upgrade jelas saat scale ke 10.000+ users."
