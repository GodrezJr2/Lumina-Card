import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import QRTicketClient from "./QRTicketClient";

interface Props {
  params: { token: string };
}

export default async function QRPage({ params }: Props) {
  const { token } = params;

  const guest = await prisma.guest.findUnique({
    where: { token },
    include: { event: true },
  });

  if (!guest) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfc] via-white to-[#e8f9fd] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#13c8ec]">QR Tiket Masuk</p>
          <h1 className="text-xl font-bold text-slate-900 mt-1">{guest.event.name}</h1>
        </div>

        {/* Ticket card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#13c8ec] via-[#7dd3fc] to-[#13c8ec]" />

          {/* QR code */}
          <div className="p-8 flex flex-col items-center gap-5">
            <QRTicketClient token={token} />

            <div className="w-full pt-2 border-t border-dashed border-slate-200 text-center space-y-1">
              <p className="font-bold text-slate-800 text-lg">{guest.name}</p>
              <p className="text-xs text-slate-400 font-mono">{token}</p>
            </div>

            <div className="w-full bg-[#f8fbfc] rounded-2xl p-4 text-center space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                {new Date(guest.event.date).toLocaleDateString("id-ID", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
              <p className="text-xs text-slate-400">{guest.event.location}</p>
            </div>

            {guest.status === "Checked_In" && (
              <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                <p className="text-sm font-semibold text-emerald-700 mt-1">Sudah Check-In</p>
              </div>
            )}
          </div>

          <div className="h-2 bg-gradient-to-r from-[#13c8ec] via-[#7dd3fc] to-[#13c8ec]" />
        </div>

        <div className="text-center">
          <Link href={`/inv/${token}`} className="text-xs text-slate-400 hover:text-[#13c8ec] transition">
            ← Kembali ke undangan
          </Link>
        </div>
      </div>
    </div>
  );
}
