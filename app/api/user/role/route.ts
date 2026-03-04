import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const ALLOWED_UPGRADE_ROLES = ["DIY_CLIENT", "FULL_SERVICE_CLIENT", "USHER_STAFF"];

export async function PATCH(req: NextRequest) {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await req.json();

  if (!ALLOWED_UPGRADE_ROLES.includes(role)) {
    return NextResponse.json({ error: "Role tidak valid untuk upgrade." }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updated = await prisma.user.update({
    where: { id: Number(userId) },
    data: { role: role as any },
    select: { id: true, email: true, name: true, role: true },
  });

  const response = NextResponse.json({ user: updated });
  response.cookies.set("user_role", updated.role, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
