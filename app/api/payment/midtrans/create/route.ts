import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { snap } from "@/lib/midtrans";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/**
 * POST /api/payment/midtrans/create
 *
 * Membuat transaksi Midtrans Snap dan mengembalikan snapToken + redirectUrl.
 *
 * Body (template):
 * {
 *   type: "template",
 *   templateId: string,
 *   templateTitle: string,
 *   processingMethod: "self"|"regular"|"express",
 *   amount: number           ← total dalam Rupiah (sudah include fee & tax)
 * }
 *
 * Body (pricing / absen service):
 * {
 *   type: "pricing",
 *   plan: "basic"|"professional",
 *   amount: number
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });

    const id = parseInt(userId);
    if (isNaN(id)) return NextResponse.json({ error: "User tidak valid." }, { status: 400 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Request body tidak valid." }, { status: 400 });

    const { type, amount } = body;
    if (!type || !amount) return NextResponse.json({ error: "type dan amount wajib diisi." }, { status: 400 });

    // Ambil data user
    const user = await db.user.findUnique({
      where: { id },
      select: { email: true, name: true },
    });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });

    // ── Build order_id ────────────────────────────────────────────────────
    const prefix = type === "template" ? "TPL" : "SVC";
    const orderId = `EI-${prefix}-${Date.now().toString(36).toUpperCase()}`;

    // ── Build item details ────────────────────────────────────────────────
    let itemDetails: object[] = [];
    let orderName = "";

    if (type === "template") {
      const { templateTitle, processingMethod = "self" } = body;
      const methodLabel =
        processingMethod === "express" ? "Express (12 jam)" :
        processingMethod === "regular" ? "Regular (1–2 hari)" : "Self";
      orderName = `Template: ${templateTitle}`;
      itemDetails = [
        { id: body.templateId, price: amount - 5000 - Math.round((amount - 5000) * 0.11 / 1.11), quantity: 1, name: templateTitle },
        { id: "processing", price: 0, quantity: 1, name: `Metode Pengisian: ${methodLabel}` },
        { id: "platform-fee", price: 5000, quantity: 1, name: "Platform Fee" },
        { id: "tax", price: amount - (amount - 5000 - Math.round((amount - 5000) * 0.11 / 1.11)) - 5000, quantity: 1, name: "PPN 11%" },
      ];
    } else if (type === "pricing") {
      const { plan } = body;
      const planLabel = plan === "professional" ? "Professional" : "Basic";
      orderName = `Paket Absen Service: ${planLabel}`;
      itemDetails = [
        { id: `plan-${plan}`, price: amount - 5000 - Math.round((amount - 5000) * 0.11 / 1.11), quantity: 1, name: `Absen Service ${planLabel}` },
        { id: "platform-fee", price: 5000, quantity: 1, name: "Platform Fee" },
        { id: "tax", price: amount - (amount - 5000 - Math.round((amount - 5000) * 0.11 / 1.11)) - 5000, quantity: 1, name: "PPN 11%" },
      ];
    } else {
      return NextResponse.json({ error: "type tidak dikenali." }, { status: 400 });
    }

    // ── Snap transaction parameter ────────────────────────────────────────
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: itemDetails,
      customer_details: {
        email: user.email,
        first_name: user.name ?? "User",
      },
      credit_card: { secure: true },
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/catalog/success?orderId=${orderId}`,
        error:  `${process.env.NEXTAUTH_URL}/catalog/checkout?error=payment_failed`,
        pending: `${process.env.NEXTAUTH_URL}/catalog/checkout?pending=1`,
      },
      // Simpan metadata purchase di custom_field untuk dipakai webhook
      custom_field1: type,
      custom_field2: type === "template"
        ? JSON.stringify({ templateId: body.templateId, templateTitle: body.templateTitle, processingMethod: body.processingMethod ?? "self" })
        : JSON.stringify({ plan: body.plan }),
      custom_field3: String(id), // userId
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId,
      orderName,
    });
  } catch (err) {
    console.error("[midtrans/create] error:", err);
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan server.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
