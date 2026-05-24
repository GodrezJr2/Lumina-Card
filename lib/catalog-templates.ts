/**
 * SINGLE SOURCE OF TRUTH untuk template katalog.
 *
 * Cara menambah template baru:
 * 1. Buat komponen template baru di components/InvitationTemplates.tsx
 * 2. Tambah entry baru di CATALOG_TEMPLATES di bawah ini
 * 3. Catalog page & preview page akan otomatis menampilkan template baru
 * 4. Tambah juga mapping ID baru ke CATALOG_TO_EDITOR di app/admin/events/[id]/template/page.tsx
 */

import type { InvitationProps } from "@/components/InvitationTemplates";

// ── Dummy preview data ────────────────────────────────────────────────────────

const WEDDING_PREVIEW: InvitationProps = {
  guestName: "Tamu Undangan",
  token: "preview",
  eventName: "Pernikahan Rizky & Nadya",
  dateStr: "14 Juni 2026",
  timeStr: "10.00 WIB",
  location: "Villa Taman Eden, Bogor",
  coupleNames: "Rizky & Nadya",
  musicUrl: "https://youtu.be/RZvs6RYakNs?si=vQnrWqRUVWSrIt_Z",
  story:
    "Kami pertama bertemu di sebuah kedai kopi kecil di Bandung, suatu sore yang cerah di tahun 2021. " +
    "Sebuah percakapan kecil berubah menjadi persahabatan yang indah, " +
    "dan kini menjadi cinta yang kami jaga selamanya. " +
    "Dengan penuh syukur, kami mengundang kalian untuk menjadi bagian dari hari bahagia kami.",
  venueAddress: "Jl. Raya Puncak No. 88, Cisarua, Bogor, Jawa Barat 16750",
  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
  ],
};

const CORPORATE_PREVIEW: InvitationProps = {
  guestName: "Tamu Undangan",
  token: "preview",
  eventName: "Annual Gala Dinner 2026",
  dateStr: "20 April 2026",
  timeStr: "18.00 WIB",
  location: "Ballroom Hotel Mulia, Jakarta",
  coupleNames: "Annual Gala Dinner 2026",
  musicUrl: "https://youtu.be/RZvs6RYakNs?si=vQnrWqRUVWSrIt_Z",
  story:
    "PT Maju Bersama dengan bangga mengundang Anda untuk hadir dalam Annual Gala Dinner 2026. " +
    "Malam ini merupakan perayaan pencapaian luar biasa yang telah kita raih bersama sepanjang tahun. " +
    "Mari kita sambut tahun baru dengan semangat dan visi yang lebih besar.",
  venueAddress: "Ballroom Lt. 5, Hotel Mulia, Jl. Asia Afrika No. 8, Jakarta Pusat 10270",
  gallery: [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
  ],
};

// ── Template definition ───────────────────────────────────────────────────────

export interface CatalogTemplate {
  /** Unique ID — juga dipakai di CATALOG_TO_EDITOR map di template editor */
  id: string;
  /** Nama tampil di katalog */
  title: string;
  /** Kategori event yang cocok */
  category: string;
  /** Harga tampil (string, untuk display saja) */
  price: string;
  /** Badge label, null = tidak tampil */
  badge: string | null;
  /** Tailwind classes untuk warna badge */
  badgeColor: string;
  /** URL gambar thumbnail untuk grid katalog */
  src: string;
  /** Nama komponen template (untuk lazy import di preview) */
  componentName: "EtherealGardenTemplate" | "RoyalGoldTemplate" | "ModernCorporateTemplate" | "NeonNexusTemplate" | "SakuraDreamTemplate" | "GoldenHourTemplate" | "MinimalIvoryTemplate" | "RusticBohoTemplate" | "SeminarProTemplate" | "BirthdayPopTemplate" | "MidnightGlamTemplate" | "OceanDriftTemplate" | "RisographRaveTemplate" | "TerraCottaTemplate";
  /** Dummy preview props yang dipakai halaman /catalog/preview/[id] */
  previewProps: InvitationProps;
  /** Gradient warna untuk top bar di halaman preview */
  previewGradient: string;
  /** Internal editor template ID (dipakai CATALOG_TO_EDITOR) */
  editorId: "ethereal" | "royal" | "corporate" | "neon" | "sakura" | "golden" | "ivory" | "boho" | "seminar" | "birthday" | "midnight" | "ocean" | "riso" | "terra";
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DAFTAR TEMPLATE KATALOG
 *  Tambah template baru di sini — semua halaman akan otomatis ikut update.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const CATALOG_TEMPLATES: CatalogTemplate[] = [
  {
    id: "ethereal-garden",
    title: "Ethereal Garden",
    category: "Wedding • Floral",
    price: "Rp 150.000",
    badge: "Best Seller",
    badgeColor: "bg-primary/90 text-slate-900",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    componentName: "EtherealGardenTemplate",
    previewProps: WEDDING_PREVIEW,
    previewGradient: "from-emerald-600 to-teal-700",
    editorId: "ethereal",
  },
  {
    id: "royal-gold",
    title: "Royal Gold",
    category: "Wedding • Luxury",
    price: "Rp 250.000",
    badge: "Premium",
    badgeColor: "bg-white/90 text-slate-900",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    componentName: "RoyalGoldTemplate",
    previewProps: WEDDING_PREVIEW,
    previewGradient: "from-amber-700 to-yellow-800",
    editorId: "royal",
  },
  {
    id: "corporate-modern",
    title: "Modern Corporate",
    category: "Corporate • Professional",
    price: "Rp 180.000",
    badge: "New",
    badgeColor: "bg-green-400/90 text-slate-900",
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    componentName: "ModernCorporateTemplate",
    previewProps: CORPORATE_PREVIEW,
    previewGradient: "from-blue-700 to-indigo-800",
    editorId: "corporate",
  },

  // ── Tambah template baru di sini ──────────────────────────────────────────
  {
    id: "cyber-tech",
    title: "Neon Nexus",
    category: "Wedding • Tech",
    price: "Rp 299.000",
    badge: "New",
    badgeColor: "bg-[#ecc813]/90 text-slate-900",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    componentName: "NeonNexusTemplate",
    previewProps: {
      guestName: "Tamu Undangan",
      token: "preview",
      eventName: "Pernikahan John & Jane",
      dateStr: "14 Juni 2026",
      timeStr: "17.00 WIB",
      location: "The Neon Nexus, Jakarta",
      coupleNames: "John & Jane",
      musicUrl: "https://youtu.be/RZvs6RYakNs?si=vQnrWqRUVWSrIt_Z",
      story:
        "Sebuah pertemuan di era digital yang mengubah segalanya. " +
        "Dua jiwa yang bertemu lewat layar, kini menyatu dalam satu ikatan abadi. " +
        "Bergabunglah dalam perayaan cinta kami yang penuh inovasi dan teknologi.",
      venueAddress: "Jl. Cyber Avenue No. 128, Silicon District, Jakarta Selatan 12190",
      gallery: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&q=80",
      ],
    },
    previewGradient: "from-[#0B132B] to-slate-800",
    editorId: "neon",
  },
  {
    id: "sakura-dream",
    title: "Sakura Dream",
    category: "Wedding • Japanese",
    price: "Rp 199.000",
    badge: "New ✨",
    badgeColor: "bg-rose-400/90 text-white",
    src: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&q=80",
    componentName: "SakuraDreamTemplate",
    previewProps: {
      guestName: "Tamu Undangan",
      token: "preview",
      eventName: "Pernikahan Hana & Ryo",
      dateStr: "3 April 2027",
      timeStr: "11.00 WIB",
      location: "Taman Sakura, Bandung",
      coupleNames: "Hana & Ryo",
      musicUrl: "https://youtu.be/RZvs6RYakNs?si=vQnrWqRUVWSrIt_Z",
      story:
        "Di bawah hujan kelopak sakura yang memukau, kami menemukan satu sama lain. " +
        "Cinta yang tumbuh bersama musim semi — abadi seperti tradisi yang kami jaga. " +
        "Bergabunglah dalam perayaan sakura kehidupan kami.",
      venueAddress: "Jl. Raya Lembang No. 28, Bandung Barat, Jawa Barat 40791",
      gallery: [
        "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&q=80",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
        "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
      ],
    },
    previewGradient: "from-rose-600 to-pink-700",
    editorId: "sakura",
  },
  {
    id: "golden-hour",
    title: "Golden Hour",
    category: "Wedding • Luxury",
    price: "Rp 349.000",
    badge: "Premium ✦",
    badgeColor: "bg-amber-400/90 text-amber-950",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    componentName: "GoldenHourTemplate",
    previewProps: {
      guestName: "Tamu Undangan",
      token: "preview",
      eventName: "Pernikahan Arya & Lara",
      dateStr: "8 Agustus 2026",
      timeStr: "16.00 WIB",
      location: "The Golden Ballroom, Surabaya",
      coupleNames: "Arya & Lara",
      musicUrl: "https://youtu.be/RZvs6RYakNs?si=vQnrWqRUVWSrIt_Z",
      story:
        "Seperti matahari terbenam yang memancarkan keemasan, cinta kami tumbuh hangat dan abadi. " +
        "Di antara butiran debu emas yang berterbangan, kami menemukan takdir yang indah. " +
        "Hadiri momen golden hour terbaik dalam hidup kami.",
      venueAddress: "Jl. Pemuda No. 31-37, Surabaya Pusat, Jawa Timur 60271",
      gallery: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
        "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
      ],
    },
    previewGradient: "from-amber-700 to-orange-900",
    editorId: "golden",
  },
  {
    id: "minimal-ivory",
    title: "Minimal Ivory",
    category: "Wedding • Editorial",
    price: "Rp 220.000",
    badge: "New",
    badgeColor: "bg-stone-100 text-stone-800",
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
    componentName: "MinimalIvoryTemplate",
    previewProps: WEDDING_PREVIEW,
    previewGradient: "from-stone-700 to-stone-900",
    editorId: "ivory",
  },
  {
    id: "rustic-boho",
    title: "Rustic Boho",
    category: "Wedding • Outdoor",
    price: "Rp 199.000",
    badge: "Trending",
    badgeColor: "bg-orange-200 text-orange-900",
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    componentName: "RusticBohoTemplate",
    previewProps: WEDDING_PREVIEW,
    previewGradient: "from-orange-700 to-amber-800",
    editorId: "boho",
  },
  {
    id: "seminar-pro",
    title: "Seminar Pro",
    category: "Corporate • Conference",
    price: "Rp 250.000",
    badge: "B2B",
    badgeColor: "bg-indigo-200 text-indigo-900",
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    componentName: "SeminarProTemplate",
    previewProps: CORPORATE_PREVIEW,
    previewGradient: "from-indigo-700 to-slate-900",
    editorId: "seminar",
  },
  {
    id: "birthday-pop",
    title: "Birthday Pop",
    category: "Birthday • Party",
    price: "Rp 149.000",
    badge: "Fun",
    badgeColor: "bg-pink-200 text-pink-900",
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    componentName: "BirthdayPopTemplate",
    previewProps: {
      guestName: "Tamu Undangan",
      token: "preview",
      eventName: "Birthday Party Aira",
      dateStr: "5 Mei 2026",
      timeStr: "16.00 WIB",
      location: "The Party House, Jakarta",
      coupleNames: "Sweet 17 Aira",
      musicUrl: "https://youtu.be/RZvs6RYakNs?si=vQnrWqRUVWSrIt_Z",
      story:
        "Yuk meriahkan ulang tahun ke-17 Aira! Akan ada cake, balon, photobooth seru, dan banyak kejutan menanti. Jangan sampai ketinggalan momen spesial ini!",
      venueAddress: "Jl. Pesta Riang No. 17, Jakarta Selatan 12110",
      gallery: [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=600&q=80",
      ],
    },
    previewGradient: "from-pink-500 to-amber-500",
    editorId: "birthday",
  },
  {
    id: "midnight-glam",
    title: "Midnight Glam",
    category: "Wedding • Luxury Dark",
    price: "Rp 399.000",
    badge: "Premium ★",
    badgeColor: "bg-amber-300/90 text-amber-950",
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25cb87?w=600&q=80",
    componentName: "MidnightGlamTemplate",
    previewProps: WEDDING_PREVIEW,
    previewGradient: "from-slate-900 to-amber-900",
    editorId: "midnight",
  },
  {
    id: "ocean-drift",
    title: "Ocean Drift",
    category: "Wedding • Beach Editorial",
    price: "Rp 280.000",
    badge: "Editorial",
    badgeColor: "bg-teal-200 text-teal-900",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    componentName: "OceanDriftTemplate",
    previewProps: WEDDING_PREVIEW,
    previewGradient: "from-teal-800 to-orange-700",
    editorId: "ocean",
  },
  {
    id: "risograph-rave",
    title: "Risograph Rave",
    category: "Birthday • Print",
    price: "Rp 169.000",
    badge: "Bold",
    badgeColor: "bg-pink-300 text-pink-950",
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
    componentName: "RisographRaveTemplate",
    previewProps: {
      guestName: "Tamu Undangan",
      token: "preview",
      eventName: "Birthday Bash Aira",
      dateStr: "5 Mei 2026",
      timeStr: "20.00 WIB",
      location: "The Loft, Jakarta",
      coupleNames: "Aira's 22nd",
      musicUrl: "https://youtu.be/RZvs6RYakNs?si=vQnrWqRUVWSrIt_Z",
      story: "Yuk drop by buat birthday party-nya Aira. Drinks, music, photobooth — semua udah siap. Cuma kurang kamu doang.",
      venueAddress: "Jl. Senopati No. 22, Jakarta Selatan 12190",
      gallery: [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=600&q=80",
      ],
    },
    previewGradient: "from-pink-600 to-cyan-600",
    editorId: "riso",
  },
  {
    id: "terra-cotta",
    title: "Terra Cotta",
    category: "Wedding • Cultural Indo",
    price: "Rp 299.000",
    badge: "Heritage",
    badgeColor: "bg-red-200 text-red-950",
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    componentName: "TerraCottaTemplate",
    previewProps: WEDDING_PREVIEW,
    previewGradient: "from-red-900 to-emerald-900",
    editorId: "terra",
  },
];

/** Lookup cepat by ID */
export const CATALOG_TEMPLATE_MAP = Object.fromEntries(
  CATALOG_TEMPLATES.map((t) => [t.id, t])
) as Record<string, CatalogTemplate>;

/** Semua ID yang valid (dipakai CATALOG_TO_EDITOR di template editor) */
export const CATALOG_IDS = CATALOG_TEMPLATES.map((t) => t.id);
