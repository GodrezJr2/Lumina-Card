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

export async function GET() {
  try {
    const userId = getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Hanya ambil event milik user sendiri
    const events = await prisma.event.findMany({
      where:   { userId },
      include: { _count: { select: { guests: true } } },
      orderBy: { date: "desc" },
    });

    const allGuests = await prisma.guest.findMany({
      where:  { event: { userId } },
      select: { status: true },
    });

    const stats = {
      totalGuests: allGuests.length,
      checkedIn:   allGuests.filter((g: { status: string }) => g.status === "Checked_In").length,
      opened:      allGuests.filter((g: { status: string }) => g.status === "Opened").length,
      draft:       allGuests.filter((g: { status: string }) => g.status === "Draft").length,
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
