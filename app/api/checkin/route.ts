import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token tidak ditemukan." }, { status: 400 });
    }

    const guest = await prisma.guest.findUnique({
      where: { token },
      include: { attendance: true },
    });

    if (!guest) {
      return NextResponse.json({ error: "Tamu tidak ditemukan. QR Code tidak valid." }, { status: 404 });
    }

    if (guest.status === "Checked_In") {
      return NextResponse.json(
        { name: guest.name, status: guest.status, message: "Tamu sudah pernah check-in sebelumnya." },
        { status: 409 }
      );
    }

    // Do check-in
    await prisma.$transaction([
      prisma.guest.update({
        where: { token },
        data: { status: "Checked_In" },
      }),
      prisma.attendance.upsert({
        where: { guestId: guest.id },
        update: { checkInTime: new Date() },
        create: { guestId: guest.id },
      }),
    ]);

    return NextResponse.json({
      name: guest.name,
      status: "Checked_In",
      message: "Check-in berhasil!",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
