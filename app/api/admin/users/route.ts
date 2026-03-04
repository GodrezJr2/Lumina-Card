/**
 * GET  /api/admin/users  — list semua user (termasuk soft-deleted)
 * POST /api/admin/users  — buat user baru
 * Hanya SUPER_ADMIN yang boleh akses
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logChange } from "@/lib/changelog";
import { createHash } from "crypto";

function hashPassword(p: string) {
  return createHash("sha256").update(p).digest("hex");
}

async function getSuperAdminId(req: NextRequest): Promise<number | null> {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return null;
  const id = parseInt(userId);
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, deletedAt: true },
  });
  if (!user || user.role !== "SUPER_ADMIN" || user.deletedAt) return null;
  return user.id;
}

// ── GET — list semua user ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const actorId = await getSuperAdminId(req);
  if (!actorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id:                 true,
      email:              true,
      name:               true,
      role:               true,
      lockedTemplateId:   true,
      purchasedTemplates: true,
      createdAt:          true,
      deletedAt:          true,
      deletedBy:          true,
    },
  });

  return NextResponse.json(users);
}

// ── POST — buat user baru ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const actorId = await getSuperAdminId(req);
  if (!actorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, password, name, role } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashPassword(password),
      name:     name ?? null,
      role:     role ?? "BASIC_USER",
    },
    select: { id: true, email: true, name: true, role: true },
  });

  await logChange({
    actorId,
    category:    "user_create",
    description: `SuperAdmin membuat akun baru: ${user.email} (role: ${user.role})`,
    targetId:    user.id,
    after:       { email: user.email, role: user.role },
  });

  return NextResponse.json(user, { status: 201 });
}
