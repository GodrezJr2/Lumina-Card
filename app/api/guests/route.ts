import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/guests?eventId=1
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "eventId wajib diisi." }, { status: 400 });
  }

  const guests = await prisma.guest.findMany({
    where: { eventId: Number(eventId) },
    include: { attendance: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json({ guests });
}
