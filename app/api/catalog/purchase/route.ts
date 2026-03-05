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
 * Logic:
 * - Update role → DIY_CLIENT & lock template
 * - Auto-create event jika user belum punya event (template-only buyer)
 * - Return eventId agar frontend bisa redirect langsung ke template editor
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

    const id = parseInt(userId);
    if (isNaN(id)) return NextResponse.json({ error: "User tidak valid." }, { status: 400 });

    const body = await req.json();
    const { templateId, templateTitle, processingMethod = "self" } = body;
    if (!templateId || !templateTitle)
      return NextResponse.json({ error: "templateId dan templateTitle wajib diisi." }, { status: 400 });

    const user = await userModel.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

    const freeRole = user.role === "FULL_SERVICE_CLIENT" || user.role === "SUPER_ADMIN";

    // Update purchase history
    let purchased: string[] = [];
    try { purchased = JSON.parse(user.purchasedTemplates ?? "[]"); } catch { purchased = []; }
    if (!purchased.includes(templateId)) purchased.push(templateId);

    const updateData: Record<string, unknown> = {
      purchasedTemplates: JSON.stringify(purchased),
    };
    if (!freeRole) {
      updateData.lockedTemplateId = templateId;
      if (user.role === "BASIC_USER") updateData.role = "DIY_CLIENT";
    }

    await userModel.update({ where: { id }, data: updateData });

    // ── Auto-create event jika user belum punya event ──────────────────────
    let eventId: number | null = null;
    const existingEvents = await prisma.event.findMany({
      where: { userId: id },
      select: { id: true },
      take: 1,
    });

    if (existingEvents.length === 0) {
      // Buat event default dengan nama template sebagai placeholder
      const editorTemplateId = CATALOG_TO_EDITOR[templateId] ?? "ethereal";
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30); // 30 hari ke depan sebagai default

      const newEvent = await prisma.event.create({
        data: {
          userId:     id,
          name:       templateTitle, // nama event = nama template, bisa diubah nanti
          date:       defaultDate,
          location:   "Belum diisi",
          template:   editorTemplateId,
          templateId: templateId,
        },
        select: { id: true },
      });
      eventId = newEvent.id;
    } else {
      eventId = existingEvents[0].id;
    }
    // ──────────────────────────────────────────────────────────────────────

    const orderId = "EI-TPL-" + Date.now().toString(36).toUpperCase();
    const newRole = !freeRole && user.role === "BASIC_USER" ? "DIY_CLIENT" : user.role;

    const response = NextResponse.json({
      success: true,
      orderId,
      locked: !freeRole,
      lockedTemplateId: !freeRole ? templateId : null,
      role: newRole,
      processingMethod,
      eventId, // ← dikirim ke frontend untuk redirect langsung
    });

    if (!freeRole && user.role === "BASIC_USER") {
      response.cookies.set("user_role", "DIY_CLIENT", {
        httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7,
      });
    }
    response.cookies.set("locked_template", !freeRole ? templateId : "", {
      httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (err) {
    console.error("Catalog purchase error:", err);
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
      select: { lockedTemplateId: true, purchasedTemplates: true, role: true },
    });

    if (!user) return NextResponse.json({ lockedTemplateId: null, purchased: [], freeAccess: false });

    let purchased: string[] = [];
    try { purchased = JSON.parse(user.purchasedTemplates ?? "[]"); } catch { purchased = []; }

    return NextResponse.json({
      lockedTemplateId: user.lockedTemplateId ?? null,
      purchased,
      role: user.role,
      freeAccess: user.role === "FULL_SERVICE_CLIENT" || user.role === "SUPER_ADMIN",
    });
  } catch {
    return NextResponse.json({ lockedTemplateId: null, purchased: [], freeAccess: false });
  }
}
