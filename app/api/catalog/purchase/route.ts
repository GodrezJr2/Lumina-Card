import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Cast prisma.user to any so new fields (lockedTemplateId, purchasedTemplates) are accessible
// before TypeScript picks up the regenerated client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userModel = (prisma as any).user;

// Map catalog templateId → internal editor template id
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
 * POST /api/catalog/purchase
 * Body: { templateId, templateTitle, processingMethod }
 *
 * ── Multi-template support ────────────────────────────────────────────────
 * - purchasedTemplates (JSON array) menyimpan SEMUA template yang pernah dibeli
 * - lockedTemplateId = template TERAKHIR dibeli (backward compat UI)
 * - Setiap pembelian template SELALU buat Event baru — satu event per template
 * - FULL_SERVICE_CLIENT & SUPER_ADMIN: tidak di-lock tapi tetap dapat event baru
 * - Idempotent: jika user sudah punya event dengan templateId yang sama, kembalikan
 *   eventId yang sudah ada (tidak duplikat event)
 *
 * ── Processing methods ────────────────────────────────────────────────────
 * - self    : user isi sendiri
 * - regular : tim kru isi dalam 1–2 hari
 * - express : tim kru isi dalam 12 jam
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

    const id = parseInt(userId);
    if (isNaN(id)) return NextResponse.json({ error: "User tidak valid." }, { status: 400 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Request body tidak valid." }, { status: 400 });

    const { templateId, templateTitle, processingMethod = "self" } = body;
    if (!templateId || !templateTitle)
      return NextResponse.json({ error: "templateId dan templateTitle wajib diisi." }, { status: 400 });

    const user = await userModel.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

    const isFreeAccess = user.role === "FULL_SERVICE_CLIENT" || user.role === "SUPER_ADMIN";

    // ── Update purchasedTemplates JSON array ──────────────────────────────
    let purchased: string[] = [];
    try { purchased = JSON.parse(user.purchasedTemplates ?? "[]"); } catch { purchased = []; }
    if (!purchased.includes(templateId)) purchased.push(templateId);

    const updateData: Record<string, unknown> = {
      purchasedTemplates: JSON.stringify(purchased),
    };
    // Untuk non-free user: tandai template terakhir & upgrade role jika perlu
    if (!isFreeAccess) {
      updateData.lockedTemplateId = templateId;
      if (user.role === "BASIC_USER") updateData.role = "DIY_CLIENT";
    }

    await userModel.update({ where: { id }, data: updateData });

    // ── Cari atau buat Event untuk template ini (per-template event) ───────
    // Idempotent: cek dulu apakah sudah ada event dengan templateId yang sama
    let eventId: number | null = null;

    const existingEventForTemplate = await (prisma as any).event.findFirst({
      where: { userId: id, templateId: templateId },
      select: { id: true },
    });

    if (existingEventForTemplate) {
      // Sudah ada event untuk template ini → pakai yang lama
      eventId = existingEventForTemplate.id;
    } else {
      // Buat event BARU untuk template ini (berlaku untuk semua role, termasuk FULL_SERVICE_CLIENT)
      const editorTemplateId = CATALOG_TO_EDITOR[templateId] ?? "ethereal";
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);

      const newEvent = await prisma.event.create({
        data: {
          userId:     id,
          name:       templateTitle,
          date:       defaultDate,
          location:   "Belum diisi",
          template:   editorTemplateId,
          templateId: templateId,
        },
        select: { id: true },
      });
      eventId = newEvent.id;
    }

    const orderId = "EI-TPL-" + Date.now().toString(36).toUpperCase();
    const newRole = !isFreeAccess && user.role === "BASIC_USER" ? "DIY_CLIENT" : user.role;

    const response = NextResponse.json({
      success: true,
      orderId,
      locked: !isFreeAccess,
      lockedTemplateId: !isFreeAccess ? templateId : null,
      purchasedTemplates: purchased,
      role: newRole,
      processingMethod,
      eventId,
    });

    if (!isFreeAccess && user.role === "BASIC_USER") {
      response.cookies.set("user_role", "DIY_CLIENT", {
        httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7,
      });
    }
    response.cookies.set("locked_template", !isFreeAccess ? templateId : "", {
      httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (err) {
    console.error("[catalog/purchase] error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}

/**
 * GET /api/catalog/purchase
 * Returns current user's locked template & purchase history
 */
export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ lockedTemplateId: null, purchased: [], freeAccess: false });

    const id = parseInt(userId);
    const user = await userModel.findUnique({
      where: { id },
      select: { lockedTemplateId: true, purchasedTemplates: true, role: true, servicePlan: true },
    });

    if (!user) return NextResponse.json({ lockedTemplateId: null, purchased: [], freeAccess: false });

    let purchased: string[] = [];
    try { purchased = JSON.parse(user.purchasedTemplates ?? "[]"); } catch { purchased = []; }

    const freeAccess = user.role === "FULL_SERVICE_CLIENT" || user.role === "SUPER_ADMIN";

    return NextResponse.json({
      lockedTemplateId: user.lockedTemplateId ?? null,
      purchased,
      role:        user.role,
      servicePlan: user.servicePlan ?? null,
      freeAccess,
    });
  } catch {
    return NextResponse.json({ lockedTemplateId: null, purchased: [], freeAccess: false });
  }
}
