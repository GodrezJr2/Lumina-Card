import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PATCH /api/guests/[id]/status  { status: "Sent" }
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const guestId = Number(params.id);
  if (isNaN(guestId)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const { status } = await req.json();
  const allowed = ["Draft", "Sent", "Opened", "Checked_In"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  const guest = await prisma.guest.update({
    where: { id: guestId },
    data: { status },
  });

  return NextResponse.json({ ok: true, id: guest.id, status: guest.status });
}
