"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleGate } from "@/components/RoleGate";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  _count: { guests: number };
}

interface Stats {
  totalGuests: number;
  checkedIn: number;
  opened: number;
  draft: number;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats>({ totalGuests: 0, checkedIn: 0, opened: 0, draft: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events ?? []);
        setStats(data.stats ?? { totalGuests: 0, checkedIn: 0, opened: 0, draft: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Tamu",    value: stats.totalGuests, icon: "group",           color: "bg-sky-500" },
    { label: "Check-In",      value: stats.checkedIn,   icon: "how_to_reg",      color: "bg-emerald-500" },
    { label: "Sudah Dibuka",  value: stats.opened,      icon: "mark_email_read", color: "bg-violet-500" },
    { label: "Belum Dikirim", value: stats.draft,       icon: "hourglass_empty", color: "bg-amber-500" },
  ];

  return (
    <RoleGate feature="dashboard">
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Selamat datang di panel admin ElegantInvites.</p>
        </div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 bg-[#13c8ec] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0fb3d4] transition"
        >
          <span className="material-symbols-outlined text-base leading-none">add</span>
          Event Baru
        </Link>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`${c.color} size-12 rounded-xl flex items-center justify-center text-white shrink-0`}>
                <span className="material-symbols-outlined text-2xl leading-none">{c.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{c.value}</p>
                <p className="text-xs text-slate-500">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Daftar Event</h2>
          <Link href="/admin/events" className="text-xs text-[#13c8ec] font-semibold hover:underline">
            Lihat semua →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Memuat data…</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300">event_busy</span>
            <p className="mt-3 text-slate-400 text-sm">Belum ada event. Buat event pertamamu!</p>
            <Link href="/admin/events" className="mt-4 inline-flex items-center gap-2 bg-[#13c8ec] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0fb3d4] transition">
              + Buat Event
            </Link>
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
                    <td className="px-6 py-4 text-center">
                      <Link href={`/admin/guests?eventId=${ev.id}`} className="text-[#13c8ec] text-xs font-semibold hover:underline">
                        Kelola Tamu
                      </Link>
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
