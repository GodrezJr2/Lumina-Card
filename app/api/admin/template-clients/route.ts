/**
 * GET /api/admin/template-clients
 *
 * Return semua user yang punya lockedTemplateId (beli template) —
 * dipakai di panel SUPER_ADMIN untuk melihat daftar klien template
 * dan status pengisian masing-masing, agar kru bisa langsung "Isi Template".
 *
 * Response tiap item:
 *   user { id, name, email, role, servicePlan, createdAt }
 *   lockedTemplateId
 *   event { id, name, date, location, coupleNames, venueAddress, musicUrl, slugUrl }
 *   checklist { coupleNames, date, venue, music, slug } — bool tiap step
 *   completedSteps  number (0-5)
 *   totalSteps      5
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// cast prisma agar field baru (servicePlan, lockedTemplateId, coupleNames, slugUrl) tidak error TypeScript
// sebelum prisma client di-regenerate di production
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import prisma from "@/lib/prisma";
const db = prisma as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const dynamic = "force-dynamic";

// Label template untuk tampil di UI
const TEMPLATE_LABELS: Record<string, string> = {
  "ethereal-garden":  "Ethereal Garden",
  "royal-gold":       "Royal Gold",
  "corporate-modern": "Corporate Modern",
  "cyber-tech":       "Cyber Tech",
  "golden-elegance":  "Golden Elegance",
  "noir-luxe":        "Noir Luxe",
  "modern-summit":    "Modern Summit",
  "tech-forward":     "Tech Forward",
  "ethereal":         "Ethereal",
  "royal":            "Royal Gold",
  "corporate":        "Corporate",
  "neon":             "Neon",
};

export async function GET() {
  try {
    // Auth — SUPER_ADMIN only
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const actor = await db.user.findUnique({
      where: { id: parseInt(userId) },
      select: { role: true, deletedAt: true },
    });
    if (!actor || actor.role !== "SUPER_ADMIN" || actor.deletedAt) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch semua user yang punya lockedTemplateId (beli template)
    const users = await db.user.findMany({
      where: {
        lockedTemplateId: { not: null },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        servicePlan: true,
        lockedTemplateId: true,
        createdAt: true,
        events: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true,
            coupleNames: true,
            venueAddress: true,
            musicUrl: true,
            slugUrl: true,
          },
          take: 1,
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = users.map((u: any) => {
      const event = u.events?.[0] ?? null;

      // Checklist status
      const checklist = {
        coupleNames: !!event?.coupleNames?.trim(),
        date: !!event?.date && new Date(event.date) > new Date(2000, 0, 1),
        venue: !!event?.venueAddress?.trim() && event.venueAddress !== "Belum diisi",
        music: !!event?.musicUrl?.trim(),
        slug:  !!event?.slugUrl,
      };
      const completedSteps = Object.values(checklist).filter(Boolean).length;

      return {
        user: {
          id:         u.id,
          name:       u.name,
          email:      u.email,
          role:       u.role,
          servicePlan: u.servicePlan,
          createdAt:  u.createdAt,
        },
        lockedTemplateId:    u.lockedTemplateId,
        templateLabel:       TEMPLATE_LABELS[u.lockedTemplateId] ?? u.lockedTemplateId,
        event: event ? {
          id:          event.id,
          name:        event.name,
          date:        event.date,
          location:    event.location,
          coupleNames: event.coupleNames,
          venueAddress:event.venueAddress,
          musicUrl:    event.musicUrl,
          slugUrl:     event.slugUrl,
        } : null,
        checklist,
        completedSteps,
        totalSteps: 5,
      };
    });

    return NextResponse.json({ clients: items });
  } catch (err) {
    console.error("[template-clients] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
