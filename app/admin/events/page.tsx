"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleGate } from "@/components/RoleGate";
import { useRole } from "@/hooks/useRole";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  _count: { guests: number };
}

export default function EventsPage() {
  const router = useRouter();
  const { isTemplateOnly, loading: roleLoading } = useRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", location: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadEvents() {
    setLoading(true);
    const r = await fetch("/api/events");
    const d = await r.json();
    const evList: Event[] = d.events ?? [];
    setEvents(evList);
    setLoading(false);

    // Template-only buyer dengan 1 event → langsung ke template editor
    if (!roleLoading && isTemplateOnly && evList.length === 1) {
      router.replace(`/admin/events/${evList[0].id}/template`);
    }
  }

  useEffect(() => { loadEvents(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!roleLoading && isTemplateOnly && events.length === 1) {
      router.replace(`/admin/events/${events[0].id}/template`);
    }
  }, [isTemplateOnly, roleLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const r = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Gagal membuat event.");
      setForm({ name: "", date: "", location: "" });
      setShowForm(false);
      loadEvents();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RoleGate feature="events">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isTemplateOnly ? "Kustomisasi Template" : "Events"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isTemplateOnly
              ? "Klik nama event untuk mengubah tampilan undangan kamu."
              : "Kelola semua event pernikahan kamu."}
          </p>
        </div>
        {/* Sembunyikan tombol buat event untuk template-only buyer */}
        {!isTemplateOnly && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-[#13c8ec] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0fb3d4] transition"
          >
            <span className="material-symbols-outlined text-base leading-none">{showForm ? "close" : "add"}</span>
            {showForm ? "Batal" : "Buat Event"}
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Event Baru</h2>
          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl p-3">{error}</div>
          )}
          <form onSubmit={handleCreate} className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Nama Event</label>
              <input
                type="text"
                placeholder="Contoh: Pernikahan Andi & Sari"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Tanggal</label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Lokasi</label>
              <input
                type="text"
                placeholder="Gedung, Kota"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec]"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#13c8ec] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0fb3d4] disabled:opacity-60 transition"
              >
                {saving ? "Menyimpan…" : "Simpan Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events list */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Memuat data…</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300">event_busy</span>
            <p className="mt-3 text-slate-400 text-sm">Belum ada event. Klik &quot;Buat Event&quot; untuk mulai.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Nama Event</th>
                  <th className="px-6 py-3 text-left">Tanggal</th>
                  <th className="px-6 py-3 text-left">Lokasi</th>
                  <th className="px-6 py-3 text-center">Tamu</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{ev.name}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{ev.location}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-[#13c8ec]/10 text-[#13c8ec] text-xs font-bold px-2 py-1 rounded-full">
                        {ev._count.guests}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-3">
                      {!isTemplateOnly && (
                        <>
                          <a href={`/admin/guests?eventId=${ev.id}`} className="text-[#13c8ec] text-xs font-semibold hover:underline">
                            Tamu
                          </a>
                          <a href={`/admin/guests/add?eventId=${ev.id}`} className="text-violet-500 text-xs font-semibold hover:underline">
                            + Import
                          </a>
                        </>
                      )}
                      <a
                        href={`/admin/events/${ev.id}/template`}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                      >
                        <span className="material-symbols-outlined text-sm leading-none">palette</span>
                        {isTemplateOnly ? "Edit Template" : "Template"}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </RoleGate>
  );
}
