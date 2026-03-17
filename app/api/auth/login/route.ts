import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Request body tidak valid." }, { status: 400 });

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    // Compare password dengan bcrypt
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    // Cek soft delete
    if (user.deletedAt) {
      return NextResponse.json({ error: "Akun ini telah dinonaktifkan. Hubungi administrator." }, { status: 403 });
    }

    // Simple session: set cookie dengan userId (production: pakai JWT/NextAuth)
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    response.cookies.set("user_id", String(user.id), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    // role cookie (readable by middleware for route guard)
    response.cookies.set("user_role", user.role, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("[login] error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server. Coba lagi." }, { status: 500 });
  }
}
