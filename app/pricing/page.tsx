import Link from "next/link";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import PricingCTA from "@/components/PricingCTA";
import { Role } from "@/lib/roles";

/**
 * Tier numerik per role — sama persis dengan yang ada di API
 * Semakin tinggi angka = semakin tinggi paket
 */
const ROLE_TIER: Record<Role, number> = {
  BASIC_USER:           0,
  DIY_CLIENT:           1,
  FULL_SERVICE_CLIENT:  2,
  USHER_STAFF:          0,
  SUPER_ADMIN:         99,
};

const PLANS = [
  {
    name: "Basic",
    price: "Rp 299K",
    per: "/event",
    desc: "Cocok untuk acara kecil dan intimate seperti arisan, gathering keluarga, atau pernikahan sederhana.",
    highlight: false,
    badge: null,
    cta: "Pilih Basic",
    ctaStyle: "border-2 border-navy text-navy font-bold hover:bg-navy hover:text-white",
    /** Tier paket ini — harus sesuai dengan ROLE_TIER */
    tier: 1, // DIY_CLIENT
    features: {
      devices: "1 Perangkat",
      guests: "200 Tamu",
      offline: false,
      export: false,
      branding: false,
      walkin: false,
      support: "Email",
    },
  },
  {
    name: "Professional",
    price: "Rp 799K",
    per: "/event",
    desc: "Solusi terlengkap untuk pernikahan dan acara formal dengan skala menengah hingga besar.",
    highlight: true,
    badge: "Paling Populer",
    cta: "Pilih Professional",
    ctaStyle: "bg-gold text-white font-bold hover:bg-gold-hover shadow-lg shadow-gold/25",
    tier: 2, // FULL_SERVICE_CLIENT
    features: {
      devices: "5 Perangkat",
      guests: "1.000 Tamu",
      offline: true,
      export: true,
      branding: false,
      walkin: true,
      support: "Priority 24/7",
    },
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "",
    desc: "Untuk event korporat berskala besar, gala dinner, atau konferensi dengan kebutuhan khusus.",
    highlight: false,
    badge: null,
    cta: "Hubungi Kami",
    ctaStyle: "bg-navy text-white font-bold hover:bg-navy-light shadow-md",
    tier: 2, // sama dengan Professional untuk sekarang
    features: {
      devices: "Unlimited",
      guests: "Unlimited",
      offline: true,
      export: true,
      branding: true,
      walkin: true,
      support: "Dedicated Manager",
    },
  },
];

const COMPARE_ROWS: {
  key: keyof typeof PLANS[0]["features"];
  label: string;
}[] = [
  { key: "devices", label: "Perangkat Scan" },
  { key: "guests", label: "Batas Tamu" },
  { key: "offline", label: "Mode Offline" },
  { key: "export", label: "Export Data (CSV/Excel)" },
  { key: "branding", label: "Custom Branding" },
  { key: "walkin", label: "Walk-in Registration" },
  { key: "support", label: "Support" },
];

function Tick({ ok, label }: { ok?: boolean | string; label?: string }) {
  if (typeof ok === "string") {
    return <span className="text-sm font-semibold text-text-main">{ok}</span>;
  }
  if (ok) {
    return (
      <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
    );
  }
  return (
    <span className="material-symbols-outlined text-slate-300 text-xl">remove</span>
  );
}

export default async function PricingPage() {
  // Fetch user dari DB via cookie — Server Component
  let currentTier = -1; // -1 = belum login
  let userIsSuperAdmin = false;

  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (userId) {
      const id = parseInt(userId);
      if (!isNaN(id)) {
        const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
        if (user) {
          userIsSuperAdmin = user.role === "SUPER_ADMIN";
          currentTier = ROLE_TIER[user.role as Role] ?? 0;
        }
      }
    }
  } catch {
    // Gagal fetch → treat as belum login
  }

  // Filter paket: sembunyikan paket yang tiernya <= currentTier
  // (kecuali super admin — tampilkan semua tapi dengan badge "Akses Penuh")
  const visiblePlans = userIsSuperAdmin
    ? PLANS
    : PLANS.filter((p) => p.tier > currentTier || currentTier < 0);

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-text-main">

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden bg-white border-b border-navy/10 py-20 px-6 text-center">
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 max-w-[700px] mx-auto">
          <span className="inline-block rounded-full bg-gold/10 border border-gold/30 px-4 py-1.5 text-xs font-bold text-gold uppercase tracking-widest mb-6">
            Harga
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-navy mb-5 leading-tight">
            Harga Sederhana &amp; Transparan
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
            Bayar hanya untuk event yang kamu adakan. Tidak ada biaya berlangganan bulanan, tidak ada biaya tersembunyi.
          </p>
          {/* Banner: paket aktif user */}
          {userIsSuperAdmin && (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-full">
              <span className="material-symbols-outlined text-base leading-none">verified</span>
              Kamu adalah Super Admin — semua fitur sudah aktif
            </div>
          )}
          {!userIsSuperAdmin && currentTier >= 1 && (
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold text-sm font-semibold px-5 py-2.5 rounded-full">
              <span className="material-symbols-outlined text-base leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              Paket aktifmu: {PLANS.find(p => p.tier === currentTier)?.name ?? "Pro"} — tampilkan hanya upgrade tersedia
            </div>
          )}
        </div>
      </section>

      {/* ───── PRICING CARDS ───── */}
      <section className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className={`grid gap-8 items-start ${visiblePlans.length === 1 ? "max-w-sm mx-auto" : visiblePlans.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" : "md:grid-cols-3"}`}>
            {visiblePlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-8 bg-white transition-all duration-300 ${
                  plan.highlight
                    ? "border-2 border-gold shadow-2xl shadow-gold/10 md:-translate-y-4 z-10"
                    : "border border-navy/10 shadow-sm hover:shadow-xl hover:border-gold/30"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mt-2 mb-6">
                  <h3 className="text-2xl font-black text-navy mb-1">{plan.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{plan.desc}</p>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-navy">{plan.price}</span>
                  {plan.per && (
                    <span className="text-text-secondary font-medium text-sm">{plan.per}</span>
                  )}
                </div>
                <PricingCTA
                  planName={plan.name}
                  price={plan.price}
                  label={plan.cta}
                  ctaStyle={plan.ctaStyle}
                  isEnterprise={plan.name === "Enterprise"}
                  planTier={plan.tier}
                  currentTier={currentTier}
                  isSuperAdmin={userIsSuperAdmin}
                />
                <ul className="space-y-3 mt-2">
                  {Object.entries(plan.features).map(([k, v]) => {
                    const row = COMPARE_ROWS.find((r) => r.key === k);
                    return (
                      <li key={k} className="flex items-center gap-3 text-sm">
                        {typeof v === "boolean" ? (
                          v ? (
                            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">check_circle</span>
                          ) : (
                            <span className="material-symbols-outlined text-slate-300 text-[18px] shrink-0">remove</span>
                          )
                        ) : (
                          <span className="material-symbols-outlined text-gold text-[18px] shrink-0">check_circle</span>
                        )}
                        <span className={typeof v === "boolean" && !v ? "text-slate-400" : "text-text-main"}>
                          {typeof v === "string" ? `${row?.label}: ${v}` : row?.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── COMPARISON TABLE ───── */}
      <section className="py-16 px-6 bg-white border-t border-navy/[0.08]">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl font-black text-navy mb-10 text-center">Perbandingan Fitur Lengkap</h2>
          <div className="overflow-x-auto rounded-2xl border border-navy/10 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-6 py-4 font-bold w-1/3">Fitur</th>
                  {visiblePlans.map((p) => (
                    <th
                      key={p.name}
                      className={`px-6 py-4 font-bold text-center ${p.highlight ? "text-gold" : ""}`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr
                    key={row.key}
                    className={`border-b border-navy/[0.06] ${i % 2 === 0 ? "bg-white" : "bg-background-light"}`}
                  >
                    <td className="px-6 py-4 font-medium text-text-main">{row.label}</td>
                    {visiblePlans.map((plan) => {
                      const val = plan.features[row.key];
                      return (
                        <td key={plan.name} className="px-6 py-4 text-center">
                          <Tick ok={val} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-text-secondary mt-4">
            * Semua paket sudah termasuk QR Code Check-in, RSVP online, dan WhatsApp blast sender.
          </p>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="py-16 px-6 bg-background-light">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl font-black text-navy mb-10 text-center">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {[
              {
                q: "Apakah harga berlaku per event atau per bulan?",
                a: "Harga berlaku per event. Kamu hanya membayar saat membuat event baru — tidak ada biaya berlangganan bulanan.",
              },
              {
                q: "Apakah ada masa percobaan gratis?",
                a: "Ya! Kamu bisa mendaftar gratis dan mencoba semua fitur Basic untuk 1 event pertama tanpa biaya.",
              },
              {
                q: "Bisakah saya upgrade paket di tengah event berlangsung?",
                a: "Bisa. Upgrade dapat dilakukan kapan saja dan akan langsung aktif setelah pembayaran dikonfirmasi.",
              },
              {
                q: "Apakah data tamu saya aman?",
                a: "Semua data dienkripsi dengan SSL dan disimpan di server yang aman. Kami tidak menjual atau berbagi data tamu kamu ke pihak ketiga.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="bg-white border border-navy/10 rounded-xl group">
                <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-semibold text-navy list-none">
                  {q}
                  <span className="material-symbols-outlined text-gold text-xl group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="px-6 pb-5 text-sm text-text-secondary leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative bg-navy py-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 size-64 bg-gold/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 size-64 bg-primary/20 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="relative max-w-[700px] mx-auto text-center text-white">
          <h2 className="text-3xl font-black mb-4">Mulai event pertamamu hari ini</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Daftar gratis, tidak perlu kartu kredit. Setup kurang dari 5 menit.
          </p>
          <Link
            href="/admin/login"
            className="inline-block bg-gold text-white font-bold px-10 py-4 rounded-full hover:bg-gold-hover transition-all shadow-xl shadow-gold/20"
          >
            Mulai Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-white border-t border-navy/10 py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold">celebration</span>
            <span className="font-bold text-navy">ElegantInvites</span>
          </div>
          <p>© 2026 ElegantInvites Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-navy transition-colors">Beranda</Link>
            <Link href="/catalog" className="hover:text-navy transition-colors">Template</Link>
            <Link href="/admin/login" className="hover:text-navy transition-colors">Masuk</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
