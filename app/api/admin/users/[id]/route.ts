/**
 * PATCH  /api/admin/users/[id]         — update role atau data user
 * DELETE /api/admin/users/[id]         — soft delete user
 * PUT    /api/admin/users/[id]         — restore user (hapus deletedAt)
 * Hanya SUPER_ADMIN yang boleh akses
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logChange } from "@/lib/changelog";
import type { Role } from "@prisma/client";

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

// ── PATCH — update role / nama user ─────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const actorId = await getSuperAdminId(req);
  if (!actorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const targetId = parseInt(params.id);
  const body     = await req.json();
  const { role, name } = body;

  const existing = await prisma.user.findUnique({ where: { id: targetId } });
  if (!existing) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

  // Jangan bisa edit user yang sudah dihapus
  if (existing.deletedAt) {
    return NextResponse.json({ error: "User sudah dihapus. Restore dulu." }, { status: 400 });
  }

  // Tidak bisa ubah role diri sendiri
  if (targetId === actorId) {
    return NextResponse.json({ error: "Tidak dapat mengubah role akun sendiri." }, { status: 400 });
  }

  const updateData: { role?: Role; name?: string } = {};
  if (role) updateData.role = role as Role;
  if (name !== undefined) updateData.name = name;

  const updated = await prisma.user.update({
    where: { id: targetId },
    data:  updateData,
    select: { id: true, email: true, name: true, role: true },
  });

  if (role && role !== existing.role) {
    await logChange({
      actorId,
      category:    "user_role_change",
      description: `Role user ${existing.email} diubah: ${existing.role} → ${role}`,
      targetId,
      before: { role: existing.role },
      after:  { role },
    });
  }

  return NextResponse.json(updated);
}

// ── DELETE — soft delete ─────────────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const actorId = await getSuperAdminId(req);
  if (!actorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const targetId = parseInt(params.id);

  const existing = await prisma.user.findUnique({ where: { id: targetId } });
  if (!existing) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

  if (existing.deletedAt) {
    return NextResponse.json({ error: "User sudah dihapus sebelumnya." }, { status: 400 });
  }

  // Tidak boleh hapus diri sendiri
  if (targetId === actorId) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: targetId },
    data:  { deletedAt: new Date(), deletedBy: actorId },
  });

  await logChange({
    actorId,
    category:    "user_delete",
    description: `Akun ${existing.email} (${existing.role}) di-soft-delete oleh SuperAdmin`,
    targetId,
    before: { email: existing.email, role: existing.role },
  });

  return NextResponse.json({ success: true, message: `Akun ${existing.email} berhasil dihapus (soft delete).` });
}

// ── PUT — restore user ───────────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const actorId = await getSuperAdminId(req);
  if (!actorId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const targetId = parseInt(params.id);

  const existing = await prisma.user.findUnique({ where: { id: targetId } });
  if (!existing) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

  if (!existing.deletedAt) {
    return NextResponse.json({ error: "User tidak dalam status dihapus." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: targetId },
    data:  { deletedAt: null, deletedBy: null },
  });

  await logChange({
    actorId,
    category:    "user_restore",
    description: `Akun ${existing.email} dipulihkan oleh SuperAdmin`,
    targetId,
    after: { email: existing.email, role: existing.role },
  });

  return NextResponse.json({ success: true, message: `Akun ${existing.email} berhasil dipulihkan.` });
}
