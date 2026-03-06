"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RoleGate } from "@/components/RoleGate";
import { useRole } from "@/hooks/useRole";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  coupleNames: string | null;
  story: string | null;
  venueAddress: string | null;
  musicUrl: string | null;
  slugUrl: string | null;
  _count: { guests: number };
}

interface Stats {
  totalGuests: number;
  checkedIn: number;
  opened: number;
  draft: number;
}

// ── Onboarding Checklist untuk template buyer ─────────────────────────────
function OnboardingChecklist({ event }: { event: Event }) {
  const steps = [
    {
      id: "coupleNames",
      label: "Isi nama pasangan",
      desc: "Nama yang akan tampil di undangan sebagai judul utama.",
      done: !!event.coupleNames?.trim(),
      href: `/admin/events/${event.id}/template`,
      icon: "favorite",
    },
    {
      id: "date",
      label: "Tanggal & waktu event",
      desc: "Pastikan tanggal sudah benar — akan ditampilkan di undangan.",
      done: !!event.date && new Date(event.date) > new Date(2000, 0, 1),
      href: `/admin/events/${event.id}/template`,
      icon: "calendar_today",
    },
    {
      id: "venueAddress",
      label: "Alamat venue lengkap",
      desc: "Tamu akan melihat alamat ini di halaman undangan.",
      done: !!event.venueAddress?.trim() && event.venueAddress !== "Belum diisi",
      href: `/admin/events/${event.id}/template`,
      icon: "location_on",
    },
    {
      id: "music",
      label: "Tambahkan musik latar",
      desc: "Opsional — musik otomatis saat tamu membuka undangan.",
      done: !!event.musicUrl?.trim(),
      href: `/admin/events/${event.id}/template`,
      icon: "music_note",
      optional: true,
    },
    {
      id: "slug",
      label: "Link undangan sudah aktif",
      desc: event.slugUrl
        ? `Link kamu: /i/${event.slugUrl}`
        : "Simpan nama pasangan untuk generate link otomatis.",
      done: !!event.slugUrl,
      href: `/admin/events/${event.id}/template`,
      icon: "link",
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const requiredSteps = steps.filter((s) => !s.optional);
  const allRequiredDone = requiredSteps.every((s) => s.done);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header progress */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Checklist Persiapan Undangan</h2>
            <p className="text-xs text-slate-500 mt-0.5">Selesaikan langkah berikut agar undangan kamu siap dibagikan.</p>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            allRequiredDone ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}>
            {doneCount}/{steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#13c8ec] to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-slate-100">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition group ${
              step.done ? "opacity-75" : ""
            }`}
          >
            {/* Icon status */}
            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
              step.done
                ? "bg-emerald-100"
                : "bg-slate-100 group-hover:bg-[#13c8ec]/10"
            }`}>
              {step.done ? (
                <span className="material-symbols-outlined text-emerald-600 text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              ) : (
                <span className={`material-symbols-outlined text-xl leading-none ${
                  step.done ? "text-emerald-600" : "text-slate-400 group-hover:text-[#13c8ec]"
                }`}>{step.icon}</span>
              )}
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${step.done ? "text-slate-500 line-through" : "text-slate-800"}`}>
                {step.label}
                {step.optional && <span className="ml-1.5 text-xs font-normal text-slate-400">(opsional)</span>}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{step.desc}</p>
            </div>

            {/* Arrow */}
            {!step.done && (
              <span className="material-symbols-outlined text-slate-300 group-hover:text-[#13c8ec] transition shrink-0">arrow_forward_ios</span>
            )}
          </Link>
        ))}
      </div>

      {/* CTA jika semua done */}
      {allRequiredDone && (
        <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-800">Undangan siap dibagikan! 🎉</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Bagikan link ke tamu atau{" "}
                <Link href="/pricing" className="font-bold underline">beli paket absen</Link> untuk kelola tamu + QR scanner.
              </p>
            </div>
            {event.slugUrl && (
              <a
                href={`/i/${event.slugUrl}`}
                target="_blank"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                <span className="material-symbols-outlined text-sm leading-none">open_in_new</span>
                Buka Link
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { isTemplateOnly, hasService, loading: roleLoading } = useRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats>({ totalGuests: 0, checkedIn: 0, opened: 0, draft: 0 });
  const [loading, setLoading] = useState(true);

  // Template-only buyer (belum punya service plan) → tampilkan dashboard onboarding, bukan redirect
  // Template + service → dashboard normal
  // Hanya redirect jika belum punya apa-apa (seharusnya tidak terjadi karena middleware)

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

  if (!roleLoading && isTemplateOnly) {
    // Dashboard khusus template-only buyer
    const event = events[0] ?? null;
    return (
      <RoleGate feature="dashboard">
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kamu punya template undangan. Lengkapi detail di bawah agar undangan siap disebar!
          </p>
        </div>

        {/* Banner info paket */}
        <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4">
          <span className="material-symbols-outlined text-blue-500 text-xl shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <div>
            <p className="text-sm font-semibold text-blue-900">Kamu punya Template Undangan Digital</p>
            <p className="text-sm text-blue-700 mt-0.5">
              Link undangan bisa dibagikan ke semua tamu sekaligus. Butuh kelola tamu + QR check-in?{" "}
              <Link href="/pricing" className="font-bold underline">Tambah Paket Absen</Link> mulai Rp 299K — bisa dikombinasikan dengan template kamu!
            </p>
          </div>
        </div>

        {/* Checklist onboarding */}
        {loading ? (
          <div className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
        ) : event ? (
          <OnboardingChecklist event={event} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300">event_busy</span>
            <p className="mt-3 text-slate-400 text-sm">Belum ada event. Klik tombol di bawah untuk mulai.</p>
            <Link href="/admin/events" className="mt-4 inline-flex items-center gap-2 bg-[#13c8ec] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0fb3d4] transition">
              Mulai Setup
            </Link>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href={`/admin/events/${event?.id}/template`}
            className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-[#13c8ec]/30 hover:shadow-md transition"
          >
            <div className="size-10 rounded-xl bg-[#13c8ec]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#13c8ec] text-xl leading-none">palette</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Edit Template</p>
              <p className="text-xs text-slate-400">Kustomisasi tampilan undangan</p>
            </div>
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-violet-200 hover:shadow-md transition"
          >
            <div className="size-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-violet-500 text-xl leading-none">upgrade</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Tambah Paket Absen</p>
              <p className="text-xs text-slate-400">Kelola tamu + QR scanner</p>
            </div>
          </Link>
        </div>
      </div>
      </RoleGate>
    );
  }

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
