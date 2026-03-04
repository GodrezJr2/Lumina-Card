import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/guests/[id] — update name & whatsapp
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });

  const body = await req.json();
  const { name, whatsapp } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Nama tidak boleh kosong." }, { status: 400 });
  }

  const updated = await prisma.guest.update({
    where: { id },
    data: { name: name.trim(), whatsapp: whatsapp?.trim() ?? "" },
  });

  return NextResponse.json({ guest: updated });
}

// DELETE /api/guests/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });

  await prisma.guest.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
