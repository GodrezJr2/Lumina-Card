"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RSVPPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "tidak" | "">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get guest name from API
    fetch(`/api/inv/${token}`)
      .then((r) => r.json())
      .then((d) => setGuestName(d.name ?? ""))
      .catch(() => {});
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!attendance) { setError("Pilih konfirmasi kehadiran."); return; }
    setError("");
    setLoading(true);
    try {
      const r = await fetch(`/api/inv/${token}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendance, message }),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.error || "Gagal mengirim RSVP.");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fbfc] via-white to-[#e8f9fd] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-5">
          <div className="size-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-4xl">check_circle</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {attendance === "hadir" ? "Terima Kasih! 🎉" : "Terima Kasih!"}
          </h1>
          <p className="text-slate-500">
            {attendance === "hadir"
              ? "Kami sangat senang Anda akan hadir. Sampai jumpa di hari bahagia kami!"
              : "Kami menghormati keputusan Anda. Terima kasih sudah merespons undangan kami."}
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => router.push(`/inv/${token}`)}
              className="bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-200 transition"
            >
              Kembali ke Undangan
            </button>
            {attendance === "hadir" && (
              <button
                onClick={() => router.push(`/inv/${token}/qr`)}
                className="bg-[#13c8ec] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#0fb3d4] transition"
              >
                Lihat QR Tiket
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbfc] via-white to-[#e8f9fd] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#13c8ec]">Konfirmasi Kehadiran</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">RSVP</h1>
          {guestName && <p className="text-slate-500 text-sm mt-1">Halo, <strong>{guestName}</strong>! 👋</p>}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl p-3">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Attendance choice */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">
                Apakah Anda akan hadir?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance("hadir")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition font-semibold text-sm ${
                    attendance === "hadir"
                      ? "border-[#13c8ec] bg-[#13c8ec]/10 text-[#13c8ec]"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">celebration</span>
                  Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance("tidak")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition font-semibold text-sm ${
                    attendance === "tidak"
                      ? "border-rose-400 bg-rose-50 text-rose-500"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
                  Tidak Hadir
                </button>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                Pesan & Ucapan <span className="font-normal normal-case text-slate-400">(opsional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Sampaikan ucapan & doa terbaik Anda untuk pengantin…"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !attendance}
              className="w-full bg-[#13c8ec] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#0fb3d4] disabled:opacity-60 transition"
            >
              {loading ? "Mengirim…" : "Kirim Konfirmasi"}
            </button>
          </form>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push(`/inv/${token}`)}
            className="text-xs text-slate-400 hover:text-[#13c8ec] transition"
          >
            ← Kembali ke undangan
          </button>
        </div>
      </div>
    </div>
  );
}
