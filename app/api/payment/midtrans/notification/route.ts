import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { snap } from "@/lib/midtrans";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// Map catalog templateId → internal editor template key
const CATALOG_TO_EDITOR: Record<string, string> = {
  "ethereal-garden":  "ethereal",
  "royal-gold":       "royal",
  "corporate-modern": "corporate",
  "cyber-tech":       "neon",
  "golden-elegance":  "ethereal",
  "noir-luxe":        "royal",
  "modern-summit":    "corporate",
  "tech-forward":     "corporate",
};

/**
 * POST /api/payment/midtrans/notification
 *
 * Webhook dari Midtrans — dipanggil otomatis saat status transaksi berubah.
 * Tidak memerlukan autentikasi user (dipanggil oleh server Midtrans).
 *
 * Setelah verifikasi signature, endpoint ini:
 * - Jika type=template → jalankan logika yang sama dengan /api/catalog/purchase
 * - Jika type=pricing  → jalankan logika yang sama dengan /api/pricing/purchase
 *
 * Konfigurasi di Midtrans Dashboard:
 *   Settings → Configuration → Payment Notification URL:
 *   https://your-domain.com/api/payment/midtrans/notification
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok: false }, { status: 400 });

    // ── Verifikasi notifikasi dengan Midtrans SDK ─────────────────────────
    // SDK akan throw jika signature tidak valid
    const statusResponse = await snap.transaction.notification(body);

    const { order_id, transaction_status, fraud_status } = statusResponse;

    // Hanya proses jika pembayaran berhasil
    const isSuccess =
      transaction_status === "capture" && fraud_status === "accept" ||
      transaction_status === "settlement";

    if (!isSuccess) {
      // Log status lain (pending, cancel, deny) tapi tidak perlu tindakan
      console.log(`[midtrans/notification] order=${order_id} status=${transaction_status} fraud=${fraud_status}`);
      return NextResponse.json({ ok: true, message: "Notifikasi diterima, tidak ada aksi." });
    }

    // ── Baca metadata dari custom_field ──────────────────────────────────
    const type       = statusResponse.custom_field1 as string;       // "template" | "pricing"
    const metaRaw    = statusResponse.custom_field2 as string;       // JSON string
    const userIdStr  = statusResponse.custom_field3 as string;       // userId

    const userId = parseInt(userIdStr);
    if (isNaN(userId)) {
      console.error("[midtrans/notification] userId tidak valid:", userIdStr);
      return NextResponse.json({ ok: false, error: "userId tidak valid" }, { status: 400 });
    }

    let meta: Record<string, string> = {};
    try { meta = JSON.parse(metaRaw); } catch { /* kosong */ }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error("[midtrans/notification] user tidak ditemukan:", userId);
      return NextResponse.json({ ok: false, error: "user tidak ditemukan" }, { status: 404 });
    }

    // ── Proses berdasarkan tipe pembelian ─────────────────────────────────
    if (type === "template") {
      const { templateId, templateTitle, processingMethod = "self" } = meta;

      const isFreeAccess = user.role === "FULL_SERVICE_CLIENT" || user.role === "SUPER_ADMIN";

      // Update purchasedTemplates
      let purchased: string[] = [];
      try { purchased = JSON.parse(user.purchasedTemplates ?? "[]"); } catch { purchased = []; }
      if (!purchased.includes(templateId)) purchased.push(templateId);

      const updateData: Record<string, unknown> = {
        purchasedTemplates: JSON.stringify(purchased),
      };
      if (!isFreeAccess) {
        updateData.lockedTemplateId = templateId;
        if (user.role === "BASIC_USER") updateData.role = "DIY_CLIENT";
      }
      await db.user.update({ where: { id: userId }, data: updateData });

      // Buat / temukan event per template (idempotent)
      const existingEvent = await (prisma as any).event.findFirst({
        where: { userId, templateId },
        select: { id: true },
      });
      if (!existingEvent) {
        const editorTemplateId = CATALOG_TO_EDITOR[templateId] ?? "ethereal";
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        await prisma.event.create({
          data: {
            userId,
            name:       templateTitle,
            date:       defaultDate,
            location:   "Belum diisi",
            template:   editorTemplateId,
            templateId: templateId,
          },
        });
      }
      console.log(`[midtrans/notification] ✅ template purchase fulfilled — user=${userId} template=${templateId}`);
    } else if (type === "pricing") {
      const { plan } = meta; // "basic" | "professional"

      const roleMap: Record<string, string> = {
        basic:        "DIY_CLIENT",
        professional: "FULL_SERVICE_CLIENT",
      };
      const newRole = roleMap[plan];
      if (!newRole) {
        console.error("[midtrans/notification] plan tidak dikenali:", plan);
        return NextResponse.json({ ok: false, error: "plan tidak dikenali" }, { status: 400 });
      }

      // Hanya upgrade role jika belum lebih tinggi
      const TIER: Record<string, number> = {
        BASIC_USER: 0, DIY_CLIENT: 1, FULL_SERVICE_CLIENT: 2, SUPER_ADMIN: 3,
      };
      const currentTier = TIER[user.role] ?? 0;
      const newTier     = TIER[newRole] ?? 0;

      const updateData: Record<string, unknown> = { servicePlan: plan };
      if (newTier > currentTier) updateData.role = newRole;

      await db.user.update({ where: { id: userId }, data: updateData });
      console.log(`[midtrans/notification] ✅ pricing purchase fulfilled — user=${userId} plan=${plan}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[midtrans/notification] error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
