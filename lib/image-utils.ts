/**
 * normalizeImageUrl — konversi berbagai format URL gambar ke URL yang bisa di-embed.
 *
 * Mendukung:
 * - Google Drive share link: https://drive.google.com/file/d/FILE_ID/view?...
 * - Google Drive open link: https://drive.google.com/open?id=FILE_ID
 * - Google Drive uc link (langsung): https://drive.google.com/uc?id=FILE_ID
 * - URL biasa (imgur, cloudinary, dll): dikembalikan apa adanya
 */
export function normalizeImageUrl(url: string): string {
  if (!url || !url.trim()) return url;

  try {
    // Google Drive: https://drive.google.com/file/d/FILE_ID/view
    // atau          https://drive.google.com/file/d/FILE_ID/edit
    const fileMatch = url.match(
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
    );
    if (fileMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
    }

    // Google Drive: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/drive\.google\.com\/open\?.*id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
    }

    // Google Drive: https://drive.google.com/uc?id=... (sudah benar, pastikan export=view ada)
    if (url.includes("drive.google.com/uc")) {
      const u = new URL(url);
      u.searchParams.set("export", "view");
      return u.toString();
    }

    // Google Drive thumbnail: https://drive.google.com/thumbnail?id=FILE_ID
    const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?.*id=([a-zA-Z0-9_-]+)/);
    if (thumbMatch) {
      return `https://drive.google.com/uc?export=view&id=${thumbMatch[1]}`;
    }
  } catch {
    // URL tidak valid, kembalikan apa adanya
  }

  return url;
}

/**
 * normalizeGallery — normalisasi array URL gallery
 */
export function normalizeGallery(gallery: string[]): string[] {
  return gallery.map(normalizeImageUrl);
}
