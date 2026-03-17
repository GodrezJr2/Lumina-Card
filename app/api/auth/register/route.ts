import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
  }

  // Hash password dengan bcryptjs (salt rounds: 10)
  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "BASIC_USER" as Role,
    },
  });

  return NextResponse.json(
    { id: user.id, email: user.email, name: user.name },
    { status: 201 }
  );
}
