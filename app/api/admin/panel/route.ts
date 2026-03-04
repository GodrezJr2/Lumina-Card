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
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const stats = {
      totalActive: events.length,
      guestsToday: await prisma.guest.count(),
      upcoming: events.filter((e: { date: Date }) => e.date > now && e.date <= in7Days).length,
    };

    return NextResponse.json({ events, stats });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
