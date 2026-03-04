import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const actor = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { role: true, deletedAt: true },
    });
    if (!actor || actor.role !== "SUPER_ADMIN" || actor.deletedAt) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const events = await prisma.event.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { guests: true } },
      },
      orderBy: { date: "desc" },
    });

    const now = new Date();
    const in7Days  = new Date(now.getTime() + 7  * 24 * 60 * 60 * 1000);
    const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const ago7Days = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
    const ago14Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const totalGuests = await prisma.guest.count();

    // Event baru minggu ini vs minggu sebelumnya
    const eventsThisWeek = events.filter((e: { createdAt: Date }) => e.createdAt >= ago7Days).length;
    const eventsPrevWeek = events.filter((e: { createdAt: Date }) => e.createdAt >= ago14Days && e.createdAt < ago7Days).length;

    // Upcoming 7 hari vs 7-14 hari ke depan
    const upcomingNow  = events.filter((e: { date: Date }) => e.date > now && e.date <= in7Days).length;
    const upcomingPrev = events.filter((e: { date: Date }) => e.date > in7Days && e.date <= in14Days).length;

    // Hitung persentase perubahan
    const pctChange = (curr: number, prev: number): number | null => {
      if (prev === 0) return curr > 0 ? 100 : null;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const stats = {
      totalActive:      events.length,
      guestsToday:      totalGuests,
      upcoming:         upcomingNow,
      trendTotalActive: pctChange(eventsThisWeek, eventsPrevWeek),
      trendGuests:      pctChange(totalGuests, totalGuests - eventsThisWeek),
      trendUpcoming:    pctChange(upcomingNow, upcomingPrev),
    };

    return NextResponse.json({ events, stats });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
