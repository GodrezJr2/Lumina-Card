"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { RoleGate } from "@/components/RoleGate";

interface Guest {
  id: number;
  name: string;
  whatsapp: string | null;
  token: string;
  status: string;
}

const STATUS_COLOR: Record<string, string> = {
  Draft:       "bg-slate-100 text-slate-500",
  Sent:        "bg-blue-100 text-blue-600",
  Opened:      "bg-violet-100 text-violet-600",
  Checked_In:  "bg-emerald-100 text-emerald-600",
};

export default function GuestsPage() {
  return (
    <RoleGate feature="guests">
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat...</div>}>
      <GuestsContent />
    </Suspense>
    </RoleGate>
  );
}

function GuestsContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [guests, setGuests]       = useState<Guest[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("ALL");
  const [search, setSearch]       = useState("");
  const [copied, setCopied]       = useState<number | null>(null);

  // Edit state
  const [editId, setEditId]       = useState<number | null>(null);
  const [editName, setEditName]   = useState("");
  const [editWa, setEditWa]       = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Delete state
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadGuests = useCallback(async () => {
    if (!eventId) { setLoading(false); return; }
    setLoading(true);
    const r = await fetch(`/api/guests?eventId=${eventId}`);
    const d = await r.json();
    setGuests(d.guests ?? []);
    setLoading(false);
  }, [eventId]);

  useEffect(() => { loadGuests(); }, [loadGuests]);

  function copyLink(guest: Guest) {
    const url = `${window.location.origin}/inv/${guest.token}`;

    // Modern clipboard API (HTTPS / localhost)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(guest.id);
        setTimeout(() => setCopied(null), 2500);
      }).catch(() => fallbackCopy(url, guest.id));
    } else {
      // Fallback untuk HTTP (misal akses via IP di HP)
      fallbackCopy(url, guest.id);
    }
  }

  function fallbackCopy(text: string, guestId: number) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      setCopied(guestId);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      // Jika semua cara gagal, tampilkan URL di prompt
      window.prompt("Salin link undangan:", text);
    } finally {
      document.body.removeChild(textarea);
    }
  }

  function startEdit(g: Guest) {
    setEditId(g.id);
    setEditName(g.name);
    setEditWa(g.whatsapp ?? "");
  }

  async function saveEdit(id: number) {
    setEditLoading(true);
    const r = await fetch(`/api/guests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, whatsapp: editWa }),
    });
    if (r.ok) {
      setEditId(null);
      loadGuests();
    }
    setEditLoading(false);
  }

  async function confirmDelete(id: number) {
    setDeleteLoading(true);
    await fetch(`/api/guests/${id}`, { method: "DELETE" });
    setDeleteId(null);
    setDeleteLoading(false);
    loadGuests();
  }

  const filtered = guests.filter((g) => {
    const matchStatus = filter === "ALL" || g.status === filter;
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">

      {/* ── Delete Confirmation Modal ── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-xl leading-none">delete</span>
              </div>
              <div>
                <p className="font-bold text-slate-800">Hapus Tamu?</p>
                <p className="text-xs text-slate-500">Aksi ini tidak bisa dibatalkan.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => confirmDelete(deleteId)}
                disabled={deleteLoading}
                className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 transition text-sm disabled:opacity-60"
              >
                {deleteLoading ? "Menghapus…" : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guest List</h1>
          <p className="text-sm text-slate-500 mt-1">
            {eventId ? `Event ID: ${eventId} — ${guests.length} tamu terdaftar` : "Pilih event dari halaman Events untuk melihat tamu."}
          </p>
        </div>
        {eventId && (
          <a
            href={`/admin/guests/add?eventId=${eventId}`}
            className="inline-flex items-center gap-2 bg-[#13c8ec] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0fb3d4] transition"
          >
            <span className="material-symbols-outlined text-base leading-none">person_add</span>
            Import Tamu
          </a>
        )}
      </div>

      {!eventId ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300">group</span>
          <p className="mt-3 text-slate-400 text-sm">Buka halaman Events dan klik &quot;Tamu&quot; pada event yang diinginkan.</p>
          <a href="/admin/events" className="mt-4 inline-flex items-center gap-2 bg-[#13c8ec] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0fb3d4] transition">
            Ke Halaman Events
          </a>
        </div>
      ) : (
        <>
          {/* Filter bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Cari nama tamu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-48 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec]"
            />
            <div className="flex gap-2 flex-wrap">
              {["ALL", "Draft", "Sent", "Opened", "Checked_In"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    filter === s ? "bg-[#13c8ec] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {s === "ALL" ? "Semua" : s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-slate-400 text-sm">Memuat data…</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300">person_off</span>
                <p className="mt-3 text-slate-400 text-sm">Tidak ada tamu ditemukan.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-5 py-3 text-left w-10">#</th>
                      <th className="px-5 py-3 text-left">Nama</th>
                      <th className="px-5 py-3 text-left">WhatsApp</th>
                      <th className="px-5 py-3 text-center">Status</th>
                      <th className="px-5 py-3 text-center">Link</th>
                      <th className="px-5 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((g, i) => (
                      <tr key={g.id} className={`transition ${editId === g.id ? "bg-[#13c8ec]/5" : "hover:bg-slate-50"}`}>
                        <td className="px-5 py-3 text-slate-400">{i + 1}</td>

                        {/* Name — editable */}
                        <td className="px-5 py-3">
                          {editId === g.id ? (
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full border border-[#13c8ec] rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium text-slate-800">{g.name}</span>
                          )}
                        </td>

                        {/* WhatsApp — editable */}
                        <td className="px-5 py-3">
                          {editId === g.id ? (
                            <input
                              value={editWa}
                              onChange={(e) => setEditWa(e.target.value)}
                              placeholder="08xxxxxxxxxx"
                              className="w-full border border-[#13c8ec] rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30"
                            />
                          ) : (
                            <span className={g.whatsapp ? "text-[#13c8ec] font-medium" : "text-slate-400"}>
                              {g.whatsapp || "—"}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3 text-center">
                          <span className={`${STATUS_COLOR[g.status] ?? "bg-slate-100 text-slate-500"} text-xs font-semibold px-2 py-1 rounded-full`}>
                            {g.status.replace("_", " ")}
                          </span>
                        </td>

                        {/* Copy Link */}
                        <td className="px-5 py-3 text-center">
                          <button
                            onClick={() => copyLink(g)}
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                              copied === g.id
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-slate-100 text-slate-600 hover:bg-[#13c8ec]/10 hover:text-[#13c8ec]"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm leading-none">
                              {copied === g.id ? "check" : "link"}
                            </span>
                            {copied === g.id ? "Tersalin!" : "Copy"}
                          </button>
                        </td>

                        {/* Edit / Delete / Save / Cancel */}
                        <td className="px-5 py-3 text-center">
                          {editId === g.id ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => saveEdit(g.id)}
                                disabled={editLoading}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-60"
                              >
                                <span className="material-symbols-outlined text-sm leading-none">check</span>
                                {editLoading ? "…" : "Simpan"}
                              </button>
                              <button
                                onClick={() => setEditId(null)}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                              >
                                <span className="material-symbols-outlined text-sm leading-none">close</span>
                                Batal
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => startEdit(g)}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                              >
                                <span className="material-symbols-outlined text-sm leading-none">edit</span>
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteId(g.id)}
                                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                              >
                                <span className="material-symbols-outlined text-sm leading-none">delete</span>
                                Hapus
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
