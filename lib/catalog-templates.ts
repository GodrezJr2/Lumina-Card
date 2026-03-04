/**
 * SINGLE SOURCE OF TRUTH untuk template katalog.
 *
 * Cara menambah template baru:
 * 1. Buat komponen template baru di components/InvitationTemplates.tsx
 * 2. Tambah entry baru di CATALOG_TEMPLATES di bawah ini
 * 3. Catalog page & preview page akan otomatis menampilkan template baru
 * 4. Tambah juga mapping ID baru ke CATALOG_TO_EDITOR di app/admin/events/[id]/template/page.tsx
 */

import type { ComponentType } from "react";
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
  /** Nama komponen template di InvitationTemplates.tsx (untuk lazy import di preview) */
  componentName: "EtherealGardenTemplate" | "RoyalGoldTemplate" | "ModernCorporateTemplate" | "NeonNexusTemplate";
  /** Dummy preview props yang dipakai halaman /catalog/preview/[id] */
  previewProps: InvitationProps;
  /** Gradient warna untuk top bar di halaman preview */
  previewGradient: string;
  /** Internal editor template ID (dipakai CATALOG_TO_EDITOR) */
  editorId: "ethereal" | "royal" | "corporate" | "neon";
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
];

/** Lookup cepat by ID */
export const CATALOG_TEMPLATE_MAP = Object.fromEntries(
  CATALOG_TEMPLATES.map((t) => [t.id, t])
) as Record<string, CatalogTemplate>;

/** Semua ID yang valid (dipakai CATALOG_TO_EDITOR di template editor) */
export const CATALOG_IDS = CATALOG_TEMPLATES.map((t) => t.id);
