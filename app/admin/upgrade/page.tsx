"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { RoleBadge } from "@/components/RoleGate";
import { ROLE_LABELS } from "@/lib/roles";
import type { Role } from "@/lib/roles";

const PLANS = [
  {
    role: "DIY_CLIENT" as Role,
    name: "DIY – Self Service",
    price: "Rp 299.000",
    period: "/ event",
    color: "indigo",
    icon: "edit_note",
    highlight: false,
    desc: "Kamu kelola sendiri — buat event, custom template, import tamu, blast WA.",
    features: [
      { ok: true,  text: "Dashboard & statistik" },
      { ok: true,  text: "Manajemen Event" },
      { ok: true,  text: "Editor Template Undangan" },
      { ok: true,  text: "Import & kelola tamu" },
      { ok: true,  text: "WA Blast Sender" },
      { ok: false, text: "Scanner QR (Usher Staff)" },
      { ok: false, text: "Full Service support" },
    ],
  },
  {
    role: "FULL_SERVICE_CLIENT" as Role,
    name: "Full Service",
    price: "Rp 799.000",
    period: "/ event",
    color: "purple",
    icon: "support_agent",
    highlight: true,
    desc: "Kami yang urus semuanya. Kamu tinggal konfirmasi dan pantau laporan.",
    features: [
      { ok: true,  text: "Dashboard & statistik" },
      { ok: true,  text: "Manajemen Event (dikelola tim)" },
      { ok: false, text: "Editor Template (dikunci)" },
      { ok: true,  text: "Import & kelola tamu" },
      { ok: true,  text: "WA Blast Sender" },
      { ok: true,  text: "Scanner QR + Usher Staff" },
      { ok: true,  text: "Dedicated account manager" },
    ],
  },
  {
    role: "USHER_STAFF" as Role,
    name: "Usher / Staff",
    price: "Gratis",
    period: "(diundang klien)",
    color: "amber",
    icon: "badge",
    highlight: false,
    desc: "Akses eksklusif ke scanner QR. Diberikan oleh klien untuk kru lapangan.",
    features: [
      { ok: false, text: "Dashboard & statistik" },
      { ok: false, text: "Manajemen Event" },
      { ok: false, text: "Editor Template" },
      { ok: false, text: "Import & kelola tamu" },
      { ok: false, text: "WA Blast Sender" },
      { ok: true,  text: "Scanner QR Check-In" },
      { ok: false, text: "Full Service support" },
    ],
  },
];

const COLOR = {
  indigo: {
    badge: "bg-indigo-100 text-indigo-700",
    btn: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
    icon: "text-indigo-500",
    border: "border-indigo-200",
    ring: "ring-indigo-500",
  },
  purple: {
    badge: "bg-purple-100 text-purple-700",
    btn: "bg-purple-600 hover:bg-purple-700 shadow-purple-200",
    icon: "text-purple-500",
    border: "border-purple-300",
    ring: "ring-purple-500",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700",
    btn: "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
    icon: "text-amber-500",
    border: "border-amber-200",
    ring: "ring-amber-400",
  },
};

export default function UpgradePage() {
  const { user, role, loading } = useRole();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState<Role | null>(null);
  const [done, setDone] = useState<Role | null>(null);

  async function handleUpgrade(targetRole: Role) {
    setUpgrading(targetRole);
    const r = await fetch("/api/user/role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: targetRole }),
    });
    if (r.ok) {
      setDone(targetRole);
      setTimeout(() => router.push("/admin/dashboard"), 1800);
    }
    setUpgrading(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upgrade Paket</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pilih paket yang sesuai kebutuhanmu.{" "}
          {role && (
            <span>
              Role kamu saat ini:{" "}
              <RoleBadge role={role} />
            </span>
          )}
        </p>
      </div>

      {/* BASIC_USER notice */}
      {role === "BASIC_USER" && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5">lock</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Akses Terbatas</p>
            <p className="text-amber-700 text-sm mt-0.5">
              Akun kamu belum aktif. Pilih salah satu paket di bawah untuk membuka fitur lengkap.
              <span className="ml-1 text-xs text-amber-500">(Demo: klik tombol langsung aktif)</span>
            </p>
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const c = COLOR[plan.color as keyof typeof COLOR];
          const isCurrentRole = role === plan.role;
          const isDone = done === plan.role;

          return (
            <div
              key={plan.role}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all ${
                plan.highlight
                  ? `ring-2 ${c.ring} border-transparent shadow-lg`
                  : `${c.border}`
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    ⭐ Paling Populer
                  </span>
                </div>
              )}

              {/* Icon + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`size-10 rounded-xl flex items-center justify-center bg-slate-50`}>
                  <span className={`material-symbols-outlined text-2xl ${c.icon}`}>{plan.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{plan.name}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                    {ROLE_LABELS[plan.role]}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                <span className="text-slate-400 text-sm ml-1">{plan.period}</span>
              </div>

              {/* Desc */}
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">{plan.desc}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className={`material-symbols-outlined text-base leading-none ${f.ok ? "text-emerald-500" : "text-slate-300"}`}>
                      {f.ok ? "check_circle" : "cancel"}
                    </span>
                    <span className={f.ok ? "text-slate-700" : "text-slate-400 line-through"}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrentRole ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-500">
                  <span className="material-symbols-outlined text-base leading-none">check_circle</span>
                  Paket Aktif
                </div>
              ) : isDone ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white">
                  <span className="material-symbols-outlined text-base leading-none">check_circle</span>
                  Berhasil! Mengalihkan…
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.role)}
                  disabled={upgrading !== null}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 ${c.btn}`}
                >
                  {upgrading === plan.role ? (
                    <>
                      <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Memproses…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base leading-none">bolt</span>
                      Pilih Paket (Demo)
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Demo disclaimer */}
      <p className="text-xs text-center text-slate-400">
        🔒 Ini adalah mode demo. Di production, tombol &quot;Pilih Paket&quot; akan mengarahkan ke payment gateway (Midtrans / Xendit).
        Role hanya diupdate setelah pembayaran dikonfirmasi.
      </p>
    </div>
  );
}
