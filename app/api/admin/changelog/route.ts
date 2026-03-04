/**
 * GET /api/admin/changelog — list semua change log
 * Hanya SUPER_ADMIN yang boleh akses
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const actor = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: { role: true, deletedAt: true },
  });
  if (!actor || actor.role !== "SUPER_ADMIN" || actor.deletedAt) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "50");
  const page  = parseInt(searchParams.get("page")  ?? "1");

  const [logs, total] = await Promise.all([
    prisma.changeLog.findMany({
      orderBy: { createdAt: "desc" },
      take:    limit,
      skip:    (page - 1) * limit,
      include: {
        actor: { select: { id: true, email: true, name: true } },
      },
    }),
    prisma.changeLog.count(),
  ]);

  return NextResponse.json({ logs, total, page, limit });
}
