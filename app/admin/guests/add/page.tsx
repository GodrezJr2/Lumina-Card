"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Event {
  id: number;
  name: string;
}

function AddGuestForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultEventId = searchParams.get("eventId") ?? "";

  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState(defaultEventId);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ inserted: number; total: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []));
  }, []);

  const lineCount = rawText.split("\n").filter((l) => l.trim()).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!eventId) { setError("Pilih event terlebih dahulu."); return; }
    if (!rawText.trim()) { setError("Textarea tidak boleh kosong."); return; }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const r = await fetch("/api/guests/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: Number(eventId), rawText }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Gagal mengimpor tamu.");
      setResult(d);
      setRawText("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Import Tamu</h1>
        <p className="text-sm text-slate-500 mt-1">
          Masukkan satu nama tamu per baris. Format: <code className="bg-slate-100 px-1 rounded text-xs">Nama | 08xxxxxxxx</code> (nomor WhatsApp opsional).
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        {/* Success */}
        {result && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-emerald-500 text-xl leading-none mt-0.5">check_circle</span>
            <div>
              <p className="font-semibold text-emerald-700 text-sm">Import berhasil!</p>
              <p className="text-emerald-600 text-sm mt-0.5">
                {result.inserted} dari {result.total} tamu berhasil ditambahkan.
              </p>
              <button
                onClick={() => router.push(`/admin/guests?eventId=${eventId}`)}
                className="mt-2 text-xs font-semibold text-emerald-600 underline"
              >
                Lihat daftar tamu →
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl p-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event picker */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Pilih Event
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec] bg-white"
            >
              <option value="">-- Pilih event --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>

          {/* Textarea with line counter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Daftar Tamu
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition ${lineCount > 0 ? "bg-[#13c8ec]/10 text-[#13c8ec]" : "bg-slate-100 text-slate-400"}`}>
                {lineCount} tamu
              </span>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={14}
              placeholder={`Budi Santoso | 081234567890\nSiti Rahayu\nAndi Wijaya | 089876543210\n...`}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec] leading-relaxed"
            />
            <p className="text-xs text-slate-400 mt-1">
              Pisahkan nama dan nomor WA dengan <code className="bg-slate-100 px-1 rounded">|</code>. Satu baris = satu tamu.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || lineCount === 0}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#13c8ec] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#0fb3d4] disabled:opacity-60 transition"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-base leading-none animate-spin">refresh</span>
                Mengimpor…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base leading-none">upload</span>
                Import {lineCount > 0 ? `${lineCount} Tamu` : "Tamu"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AddGuestPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading…</div>}>
      <AddGuestForm />
    </Suspense>
  );
}
