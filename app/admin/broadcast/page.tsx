"use client";

import { useEffect, useState } from "react";
import { RoleGate } from "@/components/RoleGate";

interface Event {
  id: number;
  name: string;
}

interface Guest {
  id: number;
  name: string;
  whatsapp: string | null;
  token: string;
  status: string;
}

export default function BroadcastPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState(
    "Assalamualaikum *{nama}*,\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nLihat undangan digital Anda di sini:\n{link}\n\nTerima kasih 🙏"
  );
  const [sending, setSending] = useState<number | null>(null);

  // Blast mode state
  const [blastActive, setBlastActive] = useState(false);
  const [blastIdx, setBlastIdx] = useState(0);
  const [sentIds, setSentIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []));
  }, []);

  async function loadGuests(id: string) {
    setEventId(id);
    if (!id) { setGuests([]); return; }
    setLoadingGuests(true);
    const r = await fetch(`/api/guests?eventId=${id}`);
    const d = await r.json();
    setGuests((d.guests ?? []).filter((g: Guest) => g.whatsapp));
    setLoadingGuests(false);
  }

  function buildMessage(guest: Guest) {
    const link = `${window.location.origin}/inv/${guest.token}`;
    return messageTemplate
      .replace("{nama}", guest.name)
      .replace("{link}", link);
  }

  function sendWA(guest: Guest) {
    setSending(guest.id);
    const phone = guest.whatsapp!.replace(/\D/g, "").replace(/^0/, "62");
    const msg = encodeURIComponent(buildMessage(guest));
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");

    // Update status → Sent (only if still Draft)
    if (guest.status === "Draft") {
      fetch(`/api/guests/${guest.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Sent" }),
      }).then(() => {
        // Reflect in local state so badge updates without reload
        setGuests((prev) =>
          prev.map((g) => (g.id === guest.id ? { ...g, status: "Sent" } : g))
        );
      });
    }

    setTimeout(() => setSending(null), 1000);
  }

  // Blast mode helpers
  function startBlast() {
    setSentIds(new Set());
    setBlastIdx(0);
    setBlastActive(true);
  }

  function blastSendCurrent() {
    const guest = guests[blastIdx];
    const phone = guest.whatsapp!.replace(/\D/g, "").replace(/^0/, "62");
    const msg = encodeURIComponent(buildMessage(guest));
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    setSentIds((prev) => new Set(prev).add(guest.id));
  }

  function blastNext() {
    if (blastIdx < guests.length - 1) {
      setBlastIdx((i) => i + 1);
    } else {
      setBlastActive(false);
    }
  }

  function blastSendAndNext() {
    blastSendCurrent();
    setTimeout(() => blastNext(), 600);
  }

  const blastGuest = blastActive ? guests[blastIdx] : null;

  return (
    <RoleGate feature="broadcast">
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">WA Sender</h1>
        <p className="text-sm text-slate-500 mt-1">Kirim undangan via WhatsApp ke setiap tamu.</p>
      </div>

      {/* ── BLAST MODE MODAL ── */}
      {blastActive && blastGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Mode Blast</span>
              <span className="text-xs font-bold text-[#13c8ec]">{blastIdx + 1} / {guests.length}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#13c8ec] rounded-full transition-all duration-300"
                style={{ width: `${((blastIdx + 1) / guests.length) * 100}%` }}
              />
            </div>

            {/* Guest info */}
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
              <div className="size-10 rounded-full bg-[#13c8ec]/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#13c8ec]">person</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{blastGuest.name}</p>
                <p className="text-xs text-slate-400">{blastGuest.whatsapp}</p>
              </div>
              {sentIds.has(blastGuest.id) && (
                <span className="ml-auto text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm leading-none">check_circle</span>
                  Terkirim
                </span>
              )}
            </div>

            {/* Preview pesan */}
            <div className="bg-[#dcf8c6] rounded-xl p-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto font-sans">
              {buildMessage(blastGuest)}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setBlastActive(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition"
              >
                Stop
              </button>
              {!sentIds.has(blastGuest.id) ? (
                <button
                  onClick={blastSendAndNext}
                  className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#1ebe5d] transition flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base leading-none">send</span>
                  Kirim &amp; Lanjut
                </button>
              ) : (
                <button
                  onClick={blastNext}
                  className="flex-1 py-2.5 rounded-xl bg-[#13c8ec] text-white text-sm font-bold hover:bg-[#0fb3d4] transition flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base leading-none">
                    {blastIdx < guests.length - 1 ? "arrow_forward" : "check"}
                  </span>
                  {blastIdx < guests.length - 1 ? "Tamu Berikutnya" : "Selesai"}
                </button>
              )}
            </div>

            {blastIdx === guests.length - 1 && sentIds.has(blastGuest.id) && (
              <p className="text-center text-xs text-emerald-600 font-semibold">
                🎉 Semua {guests.length} tamu sudah dikirim!
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Config */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
            <h2 className="font-semibold text-slate-800">Konfigurasi</h2>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Pilih Event</label>
              <select
                value={eventId}
                onChange={(e) => loadGuests(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec] bg-white"
              >
                <option value="">-- Pilih event --</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Template Pesan</label>
              <textarea
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                rows={10}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec] font-mono leading-relaxed"
              />
              <p className="text-xs text-slate-400 mt-1">
                Gunakan <code className="bg-slate-100 px-1 rounded">{"{nama}"}</code> dan{" "}
                <code className="bg-slate-100 px-1 rounded">{"{link}"}</code> sebagai placeholder.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Guest list */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-800">Daftar Tamu</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {guests.length} tamu dengan nomor WA tersedia
                </p>
              </div>
              {guests.length > 0 && (
                <button
                  onClick={startBlast}
                  className="inline-flex items-center gap-2 bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-emerald-600 transition"
                >
                  <span className="material-symbols-outlined text-sm leading-none">send</span>
                  Kirim Semua ({guests.length})
                </button>
              )}
            </div>

            {loadingGuests ? (
              <div className="p-10 text-center text-slate-400 text-sm">Memuat tamu…</div>
            ) : !eventId ? (
              <div className="p-10 text-center text-slate-400 text-sm">Pilih event untuk melihat daftar tamu.</div>
            ) : guests.length === 0 ? (
              <div className="p-10 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300">phone_disabled</span>
                <p className="mt-2 text-slate-400 text-sm">Tidak ada tamu dengan nomor WhatsApp.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
                {guests.map((g) => (
                  <div key={g.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2 min-w-0">
                      {sentIds.has(g.id) && (
                        <span className="material-symbols-outlined text-emerald-500 text-base leading-none shrink-0">check_circle</span>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800">{g.name}</p>
                        <p className="text-xs text-slate-400">{g.whatsapp}</p>
                      </div>
                      <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        g.status === "Opened" ? "bg-purple-100 text-purple-600" :
                        g.status === "Sent"   ? "bg-blue-100 text-blue-600" :
                        g.status === "Checked_In" ? "bg-emerald-100 text-emerald-600" :
                        "bg-slate-100 text-slate-400"
                      }`}>{g.status}</span>
                    </div>
                    <button
                      onClick={() => sendWA(g)}
                      disabled={sending === g.id}
                      className={`inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shrink-0 ${
                        sentIds.has(g.id)
                          ? "bg-emerald-400 hover:bg-emerald-500"
                          : "bg-[#25D366] hover:bg-[#1ebe5d]"
                      } disabled:opacity-60`}
                    >
                      <span className="material-symbols-outlined text-sm leading-none">send</span>
                      {sending === g.id ? "Membuka…" : sentIds.has(g.id) ? "Kirim Lagi" : "Kirim"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </RoleGate>
  );
}
