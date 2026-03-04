import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { attendance, message } = await req.json();

    const guest = await prisma.guest.findUnique({
      where: { token: params.slug },
    });
    if (!guest) return NextResponse.json({ error: "Tamu tidak ditemukan." }, { status: 404 });

    // Store RSVP response in Attendance table (reusing guestId) or just update guest status
    // We store hadir/tidak in attendance notes via upsert
    if (attendance === "hadir") {
      await prisma.attendance.upsert({
        where: { guestId: guest.id },
        update: { checkInTime: new Date() },
        create: { guestId: guest.id },
      });
    }

    // Log message if provided (could extend schema — for now just return success)
    console.log(`RSVP from ${guest.name}: ${attendance}. Message: ${message ?? ""}`);

    return NextResponse.json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
