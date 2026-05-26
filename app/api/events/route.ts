import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { generateUniqueSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

// ── Helper: ambil userId dari cookie, wajib login ───────────────────────────
function getAuthUserId(): number | null {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  return userId ? Number(userId) : null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const eventIdParam = searchParams.get("eventId");

    // Cek role pengguna — SUPER_ADMIN boleh lihat event milik klien lain
    const me = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isSuperAdmin = me?.role === "SUPER_ADMIN";

    let scopeWhere: { userId?: number; id?: number } = { userId };

    if (eventIdParam) {
      const eid = Number(eventIdParam);
      if (Number.isFinite(eid)) {
        if (isSuperAdmin) {
          // Admin: filter spesifik event saja, abaikan ownership
          scopeWhere = { id: eid };
        } else {
          // User biasa: tetap kunci ke ownership-nya, tambah filter id
          scopeWhere = { userId, id: eid };
        }
      }
    }

    const events = await prisma.event.findMany({
      where:   scopeWhere,
      include: { _count: { select: { guests: true } } },
      orderBy: { date: "desc" },
    });

    const guestWhere = eventIdParam
      ? { eventId: Number(eventIdParam) }
      : { event: isSuperAdmin && false ? {} : { userId } };

    const allGuests = await prisma.guest.findMany({
      where:  guestWhere,
      select: { status: true, rsvpStatus: true, attendance: { select: { pickedUpSouvenir: true } } },
    });

    const stats = {
      totalGuests:    allGuests.length,
      checkedIn:      allGuests.filter((g) => g.status === "Checked_In").length,
      opened:         allGuests.filter((g) => g.status === "Opened").length,
      draft:          allGuests.filter((g) => g.status === "Draft").length,
      souvenirsTaken: allGuests.filter((g) => g.attendance?.pickedUpSouvenir).length,
      rsvpHadir:      allGuests.filter((g) => g.rsvpStatus === "hadir").length,
      rsvpTidak:      allGuests.filter((g) => g.rsvpStatus === "tidak").length,
      rsvpPending:    allGuests.filter((g) => !g.rsvpStatus).length,
    };

    return NextResponse.json({ events, stats });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Belum login. Silakan login terlebih dahulu." }, { status: 401 });

    const body = await req.json();
    const { name, date, location, templateId, brideName, groomName, coupleNames, story, venueAddress, gallery, themeConfig } = body;

    if (!name || !date || !location) {
      return NextResponse.json({ error: "name, date, dan location wajib diisi." }, { status: 400 });
    }

    // Generate slug unik dari nama pasangan
    const slugUrl = await generateUniqueSlug({
      coupleNames,
      brideName,
      groomName,
      year: new Date(date).getFullYear(),
    });

    const event = await prisma.event.create({
      data: {
        userId,
        name,
        date:        new Date(date),
        location,
        templateId:  templateId  ?? null,
        slugUrl,
        brideName:   brideName   ?? null,
        groomName:   groomName   ?? null,
        coupleNames: coupleNames ?? null,
        story:       story       ?? null,
        venueAddress: venueAddress ?? null,
        gallery:     gallery ? (Array.isArray(gallery) ? JSON.stringify(gallery) : gallery) : null,
        themeConfig: themeConfig ? (typeof themeConfig === "object" ? JSON.stringify(themeConfig) : themeConfig) : null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
