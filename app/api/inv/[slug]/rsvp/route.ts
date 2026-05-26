import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { attendance, message } = await req.json();

    if (attendance !== "hadir" && attendance !== "tidak") {
      return NextResponse.json({ error: "attendance harus 'hadir' atau 'tidak'." }, { status: 400 });
    }

    const guest = await prisma.guest.findUnique({
      where: { token: params.slug },
    });
    if (!guest) return NextResponse.json({ error: "Tamu tidak ditemukan." }, { status: 404 });

    // Persist RSVP response on Guest
    await prisma.guest.update({
      where: { id: guest.id },
      data: {
        rsvpStatus:  attendance,
        rsvpMessage: typeof message === "string" ? message.slice(0, 500) : null,
        rsvpAt:      new Date(),
      },
    });

    // Hadir → bonus: pre-create attendance row (untuk dashboard counter)
    if (attendance === "hadir") {
      await prisma.attendance.upsert({
        where:  { guestId: guest.id },
        update: {},   // jangan reset checkInTime — itu untuk scan QR
        create: { guestId: guest.id },
      });
    }

    return NextResponse.json({ success: true, attendance });
  } catch (err) {
    console.error("[rsvp] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
