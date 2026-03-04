import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/guests/[id]/checkin  →  tandai Checked_In dan catat waktu
export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const guestId = Number(params.id);

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest) {
    return NextResponse.json({ error: "Tamu tidak ditemukan." }, { status: 404 });
  }

  const [updatedGuest] = await prisma.$transaction([
    prisma.guest.update({
      where: { id: guestId },
      data: { status: "Checked_In" },
    }),
    prisma.attendance.upsert({
      where: { guestId },
      create: { guestId, checkInTime: new Date() },
      update: { checkInTime: new Date() },
    }),
  ]);

  return NextResponse.json(updatedGuest);
}
