import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Mode = "checkin" | "souvenir";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token: string | undefined = body.token;
    const mode: Mode = body.mode === "souvenir" ? "souvenir" : "checkin";

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

    // ── Mode: SOUVENIR ───────────────────────────────────────────────────
    if (mode === "souvenir") {
      if (guest.status !== "Checked_In") {
        return NextResponse.json(
          {
            name: guest.name,
            status: guest.status,
            message: "Tamu belum check-in. Wajib check-in dulu sebelum ambil souvenir.",
          },
          { status: 409 }
        );
      }

      if (guest.attendance?.pickedUpSouvenir) {
        return NextResponse.json(
          {
            name: guest.name,
            status: guest.status,
            mode: "souvenir",
            pickedUpSouvenir: true,
            souvenirTime: guest.attendance.souvenirTime,
            message: "Tamu sudah pernah ambil souvenir.",
          },
          { status: 409 }
        );
      }

      await prisma.attendance.update({
        where: { guestId: guest.id },
        data: {
          pickedUpSouvenir: true,
          souvenirTime: new Date(),
        },
      });

      return NextResponse.json({
        name: guest.name,
        status: "Checked_In",
        mode: "souvenir",
        pickedUpSouvenir: true,
        message: "Souvenir berhasil diberikan!",
      });
    }

    // ── Mode: CHECK-IN (default) ─────────────────────────────────────────
    if (guest.status === "Checked_In") {
      return NextResponse.json(
        {
          name: guest.name,
          status: guest.status,
          mode: "checkin",
          message: "Tamu sudah pernah check-in sebelumnya.",
        },
        { status: 409 }
      );
    }

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
      mode: "checkin",
      message: "Check-in berhasil!",
    });
  } catch (err) {
    console.error("[checkin] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
