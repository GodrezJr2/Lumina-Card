"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleGate } from "@/components/RoleGate";

interface EventItem {
  id: number;
  name: string;
  date: string;
  location: string;
  user: { id: number; name: string | null; email: string };
  _count: { guests: number };
}

interface Stats {
  totalActive: number;
  guestsToday: number;
  upcoming: number;
  trendTotalActive: number | null;
  trendGuests: number | null;
  trendUpcoming: number | null;
}

function getEventTag(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("wedding") || lower.includes("nikah") || lower.includes("pernikahan")) return "Wedding";
  if (lower.includes("corp") || lower.includes("gala") || lower.includes("corporate") || lower.includes("launch")) return "Corporate";
  if (lower.includes("birthday") || lower.includes("ulang tahun")) return "Birthday";
  if (lower.includes("anniversary") || lower.includes("jubilee")) return "Anniversary";
  return "Event";
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date();
}

const TAG_COLORS: Record<string, string> = {
  Wedding:     "bg-pink-50 text-pink-700 ring-pink-200",
  Corporate:   "bg-blue-50 text-blue-700 ring-blue-200",
  Birthday:    "bg-amber-50 text-amber-700 ring-amber-200",
  Anniversary: "bg-purple-50 text-purple-700 ring-purple-200",
  Event:       "bg-slate-50 text-slate-600 ring-slate-200",
};

export default function AdminPanelPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<Stats>({ totalActive: 0, guestsToday: 0, upcoming: 0, trendTotalActive: null, trendGuests: null, trendUpcoming: null });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    fetch("/api/admin/panel")
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events ?? []);
        setStats(d.stats ?? { totalActive: 0, guestsToday: 0, upcoming: 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const TYPE_FILTERS = ["All", "Wedding", "Corporate", "Birthday", "Anniversary"];

  const filtered = events.filter((e) => {
    const tag = getEventTag(e.name);
    const matchType = typeFilter === "All" || tag === typeFilter;
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.user.name ?? e.user.email).toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <RoleGate feature="superAdmin">
      <div className="flex flex-col gap-8">

        {/* ── Page header ── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Semua Events</h1>
            <p className="text-slate-500 text-sm mt-0.5">Monitor dan kelola seluruh undangan digital yang aktif di platform.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-xl h-10 px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
              Kelola Users
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center gap-2 rounded-xl h-10 px-5 bg-primary hover:bg-yellow-400 text-slate-900 text-sm font-bold shadow-sm transition-all hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Buat Event Baru
            </Link>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Active Events", value: stats.totalActive, icon: "event_available", color: "text-emerald-600", bg: "bg-emerald-50", trend: stats.trendTotalActive },
            { label: "Total Tamu Terdaftar", value: stats.guestsToday, icon: "groups",          color: "text-blue-600",   bg: "bg-blue-50",    trend: stats.trendGuests },
            { label: "Upcoming (7 Hari)",    value: stats.upcoming,    icon: "upcoming",        color: "text-violet-600", bg: "bg-violet-50",  trend: stats.trendUpcoming },
          ].map(({ label, value, icon, color, bg, trend }) => {
            const hasTrend = trend !== null && trend !== undefined;
            const trendUp  = hasTrend && trend >= 0;
            return (
              <div key={label} className="flex flex-col justify-between rounded-2xl p-5 bg-white border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
                  <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                  </div>
                </div>
                <div className="flex items-end gap-2 mt-3">
                  <p className="text-slate-900 text-3xl font-bold">{loading ? "—" : value}</p>
                  {hasTrend && !loading && (
                    <span className={`text-xs font-bold mb-1.5 flex items-center px-1.5 py-0.5 rounded-full ${trendUp ? "text-emerald-700 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
                      <span className="material-symbols-outlined text-[13px]">{trendUp ? "trending_up" : "trending_down"}</span>
                      {trend > 0 ? "+" : ""}{trend}%
                    </span>
                  )}
                  {!hasTrend && !loading && (
                    <span className="text-xs font-medium mb-1.5 text-slate-400">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[20px]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
              placeholder="Cari nama event atau klien…"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                  typeFilter === t
                    ? "bg-primary text-slate-900 shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                }`}
              >
                {t === "All" ? "Semua Tipe" : t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
            Memuat events…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((event) => {
              const tag = getEventTag(event.name);
              const upcoming = isUpcoming(event.date);
              const clientName = event.user.name ?? event.user.email;
              const clientInitials = clientName.slice(0, 2).toUpperCase();
              const tagStyle = TAG_COLORS[tag] ?? TAG_COLORS["Event"];

              return (
                <div
                  key={event.id}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
                >
                  {/* Colour accent bar */}
                  <div className={`h-1.5 w-full rounded-t-2xl ${upcoming ? "bg-emerald-400" : "bg-slate-200"}`} />

                  {/* Body */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    {/* Status + tag */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ${tagStyle}`}>
                        {tag}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${upcoming ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-50 text-slate-500 ring-1 ring-slate-200"}`}>
                        {upcoming ? "Upcoming" : "Past"}
                      </span>
                    </div>

                    {/* Title & date */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {event.name}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(event.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-slate-400 text-xs truncate mt-0.5">{event.location}</p>
                    </div>

                    {/* Guest count */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-[16px] text-primary">group</span>
                      <span>{event._count.guests} tamu</span>
                    </div>

                    {/* Client */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-50 mt-auto">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                        {clientInitials}
                      </div>
                      <p className="text-xs font-medium text-slate-600 truncate">{clientName}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/dashboard?eventId=${event.id}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary hover:text-slate-900 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Dashboard</span>
                        <span className="material-symbols-outlined text-[14px] leading-none">arrow_forward</span>
                      </Link>
                      <Link
                        href={`/admin/guests?eventId=${event.id}`}
                        className="py-2 px-3 rounded-xl border border-slate-200 text-slate-500 text-xs hover:border-primary hover:text-primary transition-colors flex items-center"
                        title="Lihat Tamu"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none">group</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3 text-slate-200">event_busy</span>
                <p className="text-sm font-medium">Tidak ada event ditemukan.</p>
                <p className="text-xs mt-1 text-slate-300">Coba ubah filter atau kata kunci pencarian.</p>
              </div>
            )}

            {/* Create new card */}
            {typeFilter === "All" && search === "" && (
              <Link
                href="/admin/events"
                className="group flex flex-col items-center justify-center gap-4 bg-transparent border-2 border-dashed border-slate-200 rounded-2xl min-h-[220px] hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-slate-900">add</span>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-bold text-slate-700 group-hover:text-primary">Buat Event Baru</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Mulai dari awal atau template</p>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </RoleGate>
  );
}
