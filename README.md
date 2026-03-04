# Wedding Guest Management System

Wedding Guest Management SaaS built with Next.js 14 (App Router), Prisma ORM, MySQL (XAMPP), dan Tailwind CSS.

## 🗂 Struktur Project

```
wedding-app/
├── app/
│   ├── layout.tsx                  # Shared layout + Navbar
│   ├── globals.css                 # Tailwind + Google Fonts
│   ├── page.tsx                    # Home/Landing page
│   ├── catalog/
│   │   └── page.tsx                # Template catalog
│   ├── dashboard/
│   │   └── page.tsx                # Dashboard + Bulk Import UI
│   ├── invitation/
│   │   └── [token]/
│   │       └── page.tsx            # Halaman undangan personal (Server Component)
│   └── api/
│       └── guests/
│           ├── route.ts            # GET /api/guests?eventId=1
│           ├── bulk/
│           │   └── route.ts        # POST /api/guests/bulk
│           └── [id]/
│               └── checkin/
│                   └── route.ts    # PATCH /api/guests/[id]/checkin
├── lib/
│   └── prisma.ts                   # Prisma singleton client
├── prisma/
│   └── schema.prisma               # Database schema
├── .env                            # Konfigurasi DB lokal
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Setup & Jalankan

### 1. Prerequisites
- Node.js ≥ 18
- XAMPP (MySQL aktif di port 3306)

### 2. Install dependencies
```bash
cd wedding-app
npm install
```

### 3. Buat database MySQL di phpMyAdmin
```sql
CREATE DATABASE wedding_gms;
```

### 4. Setup Prisma
```bash
npx prisma generate
npx prisma db push
```

### 5. Jalankan dev server
```bash
npm run dev
```

Buka: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/guests?eventId=1` | Ambil semua tamu suatu event |
| `POST` | `/api/guests/bulk` | Bulk import tamu dari textarea |
| `PATCH` | `/api/guests/[id]/checkin` | Check-in tamu (update status → Checked_In) |

### POST /api/guests/bulk — Request Body
```json
{
  "eventId": 1,
  "rawText": "Ahmad Fauzi\nSiti Rahayu\nBudi Santoso"
}
```

### Response
```json
{ "inserted": 3, "total": 3 }
```

---

## 🔗 Halaman Undangan Personal

Akses: `http://localhost:3000/invitation/{token}`

- Jika token **valid** → status diupdate ke `Opened`, tampilkan nama tamu + detail event
- Jika token **tidak ada** → return 404

---

## 🗄 Database Schema

```prisma
User    → Event  (1:N)
Event   → Guest  (1:N)
Guest   → Attendance (1:1)
```

### Guest Status Flow
```
Draft → Sent → Opened → Checked_In
```
