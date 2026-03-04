import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== hashPassword(password)) {
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
}
