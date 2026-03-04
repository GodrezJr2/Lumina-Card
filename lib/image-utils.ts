/**
 * normalizeImageUrl — konversi berbagai format URL gambar ke URL yang bisa di-embed.
 *
 * Mendukung:
 * - Google Drive share link: https://drive.google.com/file/d/FILE_ID/view?...
 * - Google Drive open link: https://drive.google.com/open?id=FILE_ID
 * - Google Drive uc link: https://drive.google.com/uc?id=FILE_ID
 * - URL biasa (imgur, cloudinary, dll): dikembalikan apa adanya
 *
 * CATATAN: Pakai format lh3.googleusercontent.com/d/FILE_ID karena
 * uc?export=view sering diblokir CORS oleh Google untuk domain eksternal.
 */
export function normalizeImageUrl(url: string): string {
  if (!url || !url.trim()) return url;

  try {
    // Ekstrak Google Drive file ID dari berbagai format
    let fileId: string | null = null;

    // Format: https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) fileId = fileMatch[1];

    // Format: https://drive.google.com/open?id=FILE_ID
    if (!fileId) {
      const openMatch = url.match(/drive\.google\.com\/open\?.*id=([a-zA-Z0-9_-]+)/);
      if (openMatch) fileId = openMatch[1];
    }

    // Format: https://drive.google.com/uc?id=FILE_ID
    if (!fileId && url.includes("drive.google.com/uc")) {
      const u = new URL(url);
      fileId = u.searchParams.get("id");
    }

    // Format: https://drive.google.com/thumbnail?id=FILE_ID
    if (!fileId) {
      const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?.*id=([a-zA-Z0-9_-]+)/);
      if (thumbMatch) fileId = thumbMatch[1];
    }

    if (fileId) {
      // Pakai lh3.googleusercontent.com/d/FILE_ID — ini bypass CORS restriction
      // dan tidak perlu file jadi "public" secara eksplisit di Google Drive
      return `https://lh3.googleusercontent.com/d/${fileId}`;
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
