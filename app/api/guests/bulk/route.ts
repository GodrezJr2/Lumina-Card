import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { eventId, rawText } = await req.json();

  if (!eventId || typeof rawText !== "string") {
    return NextResponse.json(
      { error: "eventId dan rawText wajib diisi." },
      { status: 400 }
    );
  }

  // Pisahkan per baris, buang baris kosong, trim spasi
  const lines = rawText
    .split("\n")
    .map((n: string) => n.trim())
    .filter((n: string) => n.length > 0);

  if (lines.length === 0) {
    return NextResponse.json({ error: "Tidak ada nama yang valid." }, { status: 400 });
  }

  // Cek event exist
  const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
  if (!event) {
    return NextResponse.json({ error: "Event tidak ditemukan." }, { status: 404 });
  }

  // Parse format "Nama | 08xxxxxxxx" atau hanya "Nama"
  const data = lines.map((line: string) => {
    const parts = line.split("|").map((p: string) => p.trim());
    const name = parts[0] || line.trim();
    const whatsapp = parts[1] ?? "";
    return {
      eventId: Number(eventId),
      name,
      whatsapp,
      token: uuidv4(),
      status: "Draft" as const,
    };
  });

  const result = await prisma.guest.createMany({ data, skipDuplicates: true });

  return NextResponse.json(
    { inserted: result.count, total: lines.length },
    { status: 201 }
  );
}
