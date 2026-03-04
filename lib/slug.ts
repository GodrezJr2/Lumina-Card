/**
 * Slug generator untuk URL undangan publik.
 * Contoh: "Budi & Siti" → "budi-siti-2026" (+ suffix unik jika sudah ada)
 */

import prisma from "@/lib/prisma";

/**
 * Bersihkan string jadi slug: lowercase, ganti spasi → "-", hapus karakter non-alphanumeric
 */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")      // "Budi & Siti" → "budi-siti"
    .replace(/\s+/g, "-")          // spasi → -
    .replace(/[^a-z0-9-]/g, "")   // hapus karakter aneh
    .replace(/-+/g, "-")           // double dash → single
    .replace(/^-|-$/g, "");        // trim dash di awal/akhir
}

/**
 * Generate slug unik dari nama pasangan.
 * Jika "budi-siti-2026" sudah ada → coba "budi-siti-2026-2", "budi-siti-2026-3", dst.
 *
 * @param coupleNames  contoh: "Budi & Siti" atau null
 * @param brideName    contoh: "Siti"
 * @param groomName    contoh: "Budi"
 * @param year         tahun event (opsional, default tahun sekarang)
 * @param excludeId    event ID yang sedang diedit (agar tidak konflik dengan diri sendiri)
 */
export async function generateUniqueSlug(opts: {
  coupleNames?: string | null;
  brideName?:   string | null;
  groomName?:   string | null;
  year?:        number;
  excludeId?:   number;
}): Promise<string> {
  const { coupleNames, brideName, groomName, year, excludeId } = opts;

  // Pilih sumber nama terbaik
  const rawName =
    coupleNames ??
    (groomName && brideName ? `${groomName} ${brideName}` : null) ??
    groomName ??
    brideName ??
    "undangan";

  const y = year ?? new Date().getFullYear();
  const base = `${toSlug(rawName)}-${y}`;

  // Cek apakah base sudah ada
  let slug    = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.event.findUnique({
      where: { slugUrl: slug },
      select: { id: true },
    });

    // Tidak ada yang pakai slug ini, atau yang pakai adalah event kita sendiri
    if (!existing || existing.id === excludeId) break;

    counter++;
    slug = `${base}-${counter}`;
  }

  return slug;
}
