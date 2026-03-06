/**
 * POST /api/sync/push
 *
 * Sync data check-in dari database lokal (XAMPP) ke TiDB Cloud production.
 * Dipakai saat event di gedung dengan koneksi buruk — operator scan lokal,
 * lalu tekan tombol "Sync ke Server" setelah acara / ketika ada koneksi.
 *
 * Yang di-sync:
 *   - Guest records (name, whatsapp, token, status, eventId)
 *   - Attendance records (checkInTime per guest)
 *
 * Strategy: UPSERT by token (guest.token adalah UUID unik global)
 *   - Guest ada di server → update status
 *   - Guest belum ada di server → insert
 *   - Attendance ada → update checkInTime
 *   - Attendance belum ada → insert
 *
 * Auth: hanya SUPER_ADMIN / FULL_SERVICE_CLIENT
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

// ── Prisma lokal (dari .env DATABASE_URL) ─────────────────────────────────
import prismaLocal from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const actor = await prismaLocal.user.findUnique({
      where: { id: Number(userId) },
      select: { role: true },
    });
    if (!actor || !["SUPER_ADMIN", "FULL_SERVICE_CLIENT"].includes(actor.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Ambil eventId dari body
    const body = await req.json().catch(() => null);
    const eventId: number | undefined = body?.eventId;
    if (!eventId) return NextResponse.json({ error: "eventId wajib diisi." }, { status: 400 });

    // ── Ambil semua guest + attendance dari DB lokal ──────────────────────
    const localGuests = await prismaLocal.guest.findMany({
      where: { eventId },
      include: { attendance: true },
    });

    if (localGuests.length === 0) {
      return NextResponse.json({ synced: 0, message: "Tidak ada data untuk di-sync." });
    }

    // ── Buat Prisma client ke TiDB Cloud production ───────────────────────
    const PROD_URL = process.env.PROD_DATABASE_URL;
    if (!PROD_URL) {
      return NextResponse.json(
        { error: "PROD_DATABASE_URL belum diset di environment variables." },
        { status: 500 }
      );
    }

    const prismaCloud = new PrismaClient({
      datasources: { db: { url: PROD_URL } },
    });

    let syncedGuests = 0;
    let syncedAttendances = 0;
    const errors: string[] = [];

    try {
      // Pastikan event ada di cloud (cek by id)
      const cloudEvent = await prismaCloud.event.findUnique({ where: { id: eventId } });
      if (!cloudEvent) {
        return NextResponse.json(
          { error: `Event #${eventId} tidak ditemukan di server. Pastikan event sudah dibuat di production.` },
          { status: 404 }
        );
      }

      // Sync tiap guest
      for (const guest of localGuests) {
        try {
          // UPSERT guest by token (token adalah UUID global unik)
          await prismaCloud.guest.upsert({
            where: { token: guest.token },
            create: {
              id:       guest.id,
              eventId:  guest.eventId,
              name:     guest.name,
              whatsapp: guest.whatsapp,
              token:    guest.token,
              status:   guest.status,
            },
            update: {
              name:     guest.name,
              whatsapp: guest.whatsapp,
              status:   guest.status,
            },
          });
          syncedGuests++;

          // Sync attendance jika ada
          if (guest.attendance) {
            const att = guest.attendance;
            // Cari guest di cloud by token (id mungkin berbeda)
            const cloudGuest = await prismaCloud.guest.findUnique({ where: { token: guest.token } });
            if (cloudGuest) {
              await prismaCloud.attendance.upsert({
                where: { guestId: cloudGuest.id },
                create: {
                  guestId:     cloudGuest.id,
                  checkInTime: att.checkInTime,
                },
                update: {
                  checkInTime: att.checkInTime,
                },
              });
              syncedAttendances++;
            }
          }
        } catch (guestErr) {
          errors.push(`Guest "${guest.name}" (token: ${guest.token}): ${guestErr instanceof Error ? guestErr.message : String(guestErr)}`);
        }
      }
    } finally {
      await prismaCloud.$disconnect();
    }

    return NextResponse.json({
      success: true,
      synced: syncedGuests,
      attendances: syncedAttendances,
      errors: errors.length > 0 ? errors : undefined,
      message: `Berhasil sync ${syncedGuests} tamu (${syncedAttendances} check-in) ke server.`,
    });
  } catch (err) {
    console.error("[sync/push] error:", err);
    return NextResponse.json({ error: "Gagal sync. Cek koneksi internet." }, { status: 500 });
  }
}
