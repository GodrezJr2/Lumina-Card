import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const VALID_PLANS = ["basic", "professional"] as const;

/**
 * POST /api/pricing/purchase
 * Body: { plan: "basic" | "professional" }
 *
 * Membeli paket jasa absen — TERPISAH dari pembelian template.
 * User bisa punya template (lockedTemplateId) DAN paket absen (servicePlan) sekaligus.
 *
 * Efek:
 * - Update user.servicePlan = plan
 * - Jika user sebelumnya BASIC_USER dan tidak punya template → set role ke DIY_CLIENT
 *   (agar bisa akses dashboard)
 * - Jika user sudah punya role lebih tinggi → tidak didowngrade
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

    const id = parseInt(userId);
    if (isNaN(id)) return NextResponse.json({ error: "User tidak valid." }, { status: 400 });

    const body = await req.json();
    const { plan } = body;

    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: "Plan tidak valid. Gunakan 'basic' atau 'professional'." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true, lockedTemplateId: true, servicePlan: true },
    });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

    const updateData: Record<string, unknown> = { servicePlan: plan };

    // Jika user sebelumnya BASIC_USER → naikkan ke DIY_CLIENT agar bisa akses dashboard
    // (DIY_CLIENT dengan servicePlan = bisa kelola tamu + template jika punya)
    if (user.role === "BASIC_USER") {
      updateData.role = "DIY_CLIENT";
    }
    // Jika sebelumnya DIY_CLIENT dan beli professional → upgrade ke FULL_SERVICE_CLIENT
    if (plan === "professional" && (user.role === "DIY_CLIENT" || user.role === "BASIC_USER")) {
      updateData.role = "FULL_SERVICE_CLIENT";
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, role: true, servicePlan: true },
    });

    const orderId = "EI-SVC-" + Date.now().toString(36).toUpperCase();

    const response = NextResponse.json({
      success: true,
      orderId,
      plan,
      role: updated.role,
      servicePlan: updated.servicePlan,
    });

    // Update cookie role
    response.cookies.set("user_role", updated.role, {
      httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Pricing purchase error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
