/**
 * POST /api/upload
 *
 * Multipart form upload → stream to Cloudinary → return secure URL.
 *
 * Body: FormData with field "file" (single image)
 * Optional: "folder" field to specify Cloudinary folder (default "lumina/events")
 *
 * Auth: must be logged in (any role).
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { uploadBuffer } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Hard limits — Cloudinary free tier is generous but be safe
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const userId = cookies().get("user_id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized — silakan login dulu." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder = typeof folderRaw === "string" && folderRaw ? `lumina/${folderRaw}` : "lumina/events";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan dalam request." }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `Ukuran file melebihi batas ${MAX_FILE_BYTES / 1024 / 1024}MB.` },
        { status: 413 }
      );
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipe file ${file.type} tidak didukung. Gunakan JPG/PNG/WEBP/GIF.` },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { url, publicId } = await uploadBuffer(buffer, folder);

    return NextResponse.json({
      success: true,
      url,
      publicId,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error("[upload] error:", err);
    const msg = err instanceof Error ? err.message : "Upload gagal.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
