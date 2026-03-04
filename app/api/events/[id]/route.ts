import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { generateUniqueSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

// ── Helper: ambil userId & verifikasi ownership event ──────────────────────
async function getOwner(eventId: number): Promise<{ userId: number; event: { id: number; userId: number } } | null> {
  const cookieStore = cookies();
  const rawId = cookieStore.get("user_id")?.value;
  if (!rawId) return null;
  const userId = Number(rawId);

  const event = await prisma.event.findUnique({
    where:  { id: eventId },
    select: { id: true, userId: true },
  });
  if (!event) return null;

  // SuperAdmin boleh akses semua event
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user) return null;
  if (user.role !== "SUPER_ADMIN" && event.userId !== userId) return null;

  return { userId, event };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const owned = await getOwner(Number(params.id));
    if (!owned) return NextResponse.json({ error: "Not found atau bukan milik Anda." }, { status: 404 });

    const event = await prisma.event.findUnique({ where: { id: owned.event.id } });
    return NextResponse.json({ event });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const owned = await getOwner(Number(params.id));
    if (!owned) return NextResponse.json({ error: "Not found atau bukan milik Anda." }, { status: 404 });

    const body = await req.json();
    const {
      name, date, location, template, templateId,
      brideName, groomName, coupleNames,
      story, venueAddress, gallery, themeConfig,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (name        !== undefined) updateData.name        = name;
    if (date        !== undefined) updateData.date        = new Date(date);
    if (location    !== undefined) updateData.location    = location;
    if (template    !== undefined) updateData.template    = template;
    if (templateId  !== undefined) updateData.templateId  = templateId;
    if (brideName   !== undefined) updateData.brideName   = brideName;
    if (groomName   !== undefined) updateData.groomName   = groomName;
    if (coupleNames !== undefined) updateData.coupleNames = coupleNames;
    if (story       !== undefined) updateData.story       = story;
    if (venueAddress !== undefined) updateData.venueAddress = venueAddress;
    if (gallery     !== undefined) updateData.gallery     = Array.isArray(gallery) ? JSON.stringify(gallery) : gallery;
    if (themeConfig !== undefined) updateData.themeConfig = typeof themeConfig === "object" ? JSON.stringify(themeConfig) : themeConfig;

    // Regenerate slug jika nama pasangan berubah
    if (brideName !== undefined || groomName !== undefined || coupleNames !== undefined) {
      const current = await prisma.event.findUnique({
        where:  { id: owned.event.id },
        select: { brideName: true, groomName: true, coupleNames: true, date: true },
      });
      if (current) {
        updateData.slugUrl = await generateUniqueSlug({
          coupleNames: (coupleNames ?? current.coupleNames) as string | null,
          brideName:   (brideName   ?? current.brideName)   as string | null,
          groomName:   (groomName   ?? current.groomName)    as string | null,
          year:        new Date(date ?? current.date).getFullYear(),
          excludeId:   owned.event.id,
        });
      }
    }

    const event = await prisma.event.update({
      where: { id: owned.event.id },
      data:  updateData,
    });

    return NextResponse.json({ event });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const owned = await getOwner(Number(params.id));
    if (!owned) return NextResponse.json({ error: "Not found atau bukan milik Anda." }, { status: 404 });

    await prisma.event.delete({ where: { id: owned.event.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
