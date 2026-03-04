import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Role } from "@/lib/roles";

/**
 * Urutan "tingkat" paket — semakin besar angkanya, semakin tinggi paket.
 * SUPER_ADMIN tidak bisa disentuh oleh flow payment sama sekali.
 */
const ROLE_TIER: Record<Role, number> = {
  BASIC_USER:           0,
  DIY_CLIENT:           1,
  FULL_SERVICE_CLIENT:  2,
  USHER_STAFF:          0, // bukan paket komersil
  SUPER_ADMIN:         99, // tidak boleh diubah via payment
};

// Map plan name (from /pricing page) to Role
function planToRole(planName: string): Role {
  const map: Record<string, Role> = {
    basic:        "DIY_CLIENT",
    professional: "FULL_SERVICE_CLIENT",
    enterprise:   "FULL_SERVICE_CLIENT",
  };
  return map[planName.toLowerCase()] ?? "DIY_CLIENT";
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }

    const id = parseInt(userId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "User tidak valid." }, { status: 400 });
    }

    // Ambil user dari DB — jangan percaya cookie role
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
    }

    // SUPER_ADMIN tidak boleh mengubah role via payment
    if (user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Super Admin tidak perlu membeli paket." },
        { status: 403 }
      );
    }

    // Read planName from request body
    let planName = "Professional";
    try {
      const body = await req.json();
      if (body?.plan) planName = body.plan;
    } catch {
      // body is optional — fallback to Professional
    }

    const newRole = planToRole(planName);

    // Blokir downgrade — tidak boleh beli paket yang lebih rendah dari role saat ini
    const currentTier = ROLE_TIER[user.role as Role] ?? 0;
    const newTier     = ROLE_TIER[newRole] ?? 0;

    if (newTier <= currentTier) {
      return NextResponse.json(
        {
          error: `Kamu sudah memiliki paket yang lebih tinggi (${user.role}). Tidak bisa downgrade.`,
          alreadyActive: true,
        },
        { status: 400 }
      );
    }

    // Upgrade user role
    await prisma.user.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { role: newRole as any },
    });

    const response = NextResponse.json({
      success: true,
      role: newRole,
      orderId: "EI-" + Date.now().toString(36).toUpperCase(),
    });

    // Update cookie role
    response.cookies.set("user_role", newRole, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Payment confirm error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}


