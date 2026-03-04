"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Payment methods (same as /pricing/checkout) ────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "va",
    label: "Virtual Account",
    desc: "Konfirmasi instan via BNI, Mandiri, atau BCA.",
    badges: [
      { color: "bg-blue-600", title: "BCA" },
      { color: "bg-blue-400", title: "Mandiri" },
      { color: "bg-orange-500", title: "BNI" },
    ],
  },
  {
    id: "cc",
    label: "Kartu Kredit / Debit",
    desc: "Pembayaran aman via Visa atau Mastercard.",
    badges: [
      { color: "bg-slate-800", title: "Visa" },
      { color: "bg-red-600", title: "Mastercard" },
    ],
  },
  {
    id: "ewallet",
    label: "E-Wallet / QRIS",
    desc: "Scan QR via OVO, Dana, GoPay, atau ShopeePay.",
    badges: [
      { color: "bg-purple-600", title: "OVO" },
      { color: "bg-blue-500", title: "Dana" },
      { color: "bg-red-500", title: "QRIS" },
    ],
  },
];

// ─── Processing methods (dari template menucheckout.html) ────────────────────
const PROCESSING_METHODS = [
  {
    id: "self",
    label: "Input Sendiri",
    desc: "Langsung jadi, kamu isi sendiri data undangan.",
    badge: "-Rp 20.000",
    badgeColor: "text-emerald-600",
    discount: -20000,
  },
  {
    id: "regular",
    label: "Terima Beres ~ Reguler",
    desc: "Tim kami bantu isi dalam 1–2 hari kerja.",
    badge: "Rp 0",
    badgeColor: "text-text-secondary",
    discount: 0,
  },
  {
    id: "express",
    label: "Terima Beres ~ Express",
    desc: "Selesai dalam 12 jam, hari ini.",
    badge: "+Rp 35.000",
    badgeColor: "text-rose-500",
    discount: 35000,
  },
];

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function parsePriceToNumber(price: string): number {
  if (!price || price === "Free" || price === "$0") return 0;
  // Handle Rp format: "Rp 150.000" or "Rp 150K"
  const clean = price.replace(/[^\d]/g, "");
  const num = parseInt(clean);
  if (isNaN(num)) return 0;
  if (price.toUpperCase().includes("K")) return num * 1000;
  // If it looks like USD (e.g. $12), convert to IDR approx
  if (price.includes("$")) return num * 15000;
  return num;
}

// ─── Main content ────────────────────────────────────────────────────────────
function CatalogCheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();

  const templateId    = params.get("templateId") || "1";
  const templateTitle = params.get("title") || "Template Undangan";
  const templatePrice = params.get("price") || "Rp 150.000";
  const templateImg   = params.get("img") || "";
  const templateCat   = params.get("category") || "Wedding";

  const [selectedPayment,    setSelectedPayment]    = useState("va");
  const [selectedProcessing, setSelectedProcessing] = useState("self");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const base         = parsePriceToNumber(templatePrice);
  const processingAdj = PROCESSING_METHODS.find(m => m.id === selectedProcessing)?.discount ?? 0;
  const platformFee  = 5000;
  const subtotal     = Math.max(0, base + processingAdj);
  const tax          = Math.round(subtotal * 0.11);
  const total        = subtotal + platformFee + tax;

  async function handlePay() {
    setError("");
    setLoading(true);
    try {
      // Check login first
      const me = await fetch("/api/auth/me");
      const meData = await me.json();
      if (!meData.user) {
        router.push(`/admin/login?redirect=/catalog/checkout?templateId=${templateId}&title=${encodeURIComponent(templateTitle)}&price=${encodeURIComponent(templatePrice)}&category=${encodeURIComponent(templateCat)}`);
        return;
      }

      const res = await fetch("/api/catalog/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          templateTitle,
          processingMethod: selectedProcessing,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Pembelian gagal.");

      // Redirect to success page
      const sp = new URLSearchParams({
        templateId,
        title: templateTitle,
        total: formatRp(total),
        orderId: data.orderId,
        locked: String(data.locked),
        processingMethod: selectedProcessing,
      });
      router.push(`/catalog/success?${sp.toString()}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-text-main flex flex-col">

      {/* ── Header ── */}
      <div className="bg-white border-b border-navy/10 px-6 py-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
            <Link href="/" className="hover:text-navy transition-colors">Home</Link>
            <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
            <Link href="/catalog" className="hover:text-navy transition-colors">Katalog</Link>
            <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
            <span className="text-navy font-semibold">Checkout Template</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-navy tracking-tight">Checkout Template</h1>
          <p className="text-text-secondary mt-2">Beli template undangan & langsung edit sesuai keinginanmu.</p>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="flex-1 py-10 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT col */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* ── Cara Pengerjaan ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/10">
              <h2 className="text-xl font-bold text-navy mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
                Cara Pengerjaan
              </h2>
              <div className="flex flex-col gap-3">
                {PROCESSING_METHODS.map((m) => (
                  <label key={m.id} className="cursor-pointer group">
                    <input
                      type="radio" name="processing" value={m.id}
                      checked={selectedProcessing === m.id}
                      onChange={() => setSelectedProcessing(m.id)}
                      className="sr-only"
                    />
                    <div className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                      selectedProcessing === m.id
                        ? "border-navy bg-navy/5 shadow-md"
                        : "border-navy/15 bg-white hover:border-navy/30"
                    }`}>
                      {/* Radio dot */}
                      <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedProcessing === m.id ? "border-navy bg-navy" : "border-slate-300"
                      }`}>
                        {selectedProcessing === m.id && <div className="size-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-navy">{m.label}</p>
                        <p className="text-sm text-text-secondary">{m.desc}</p>
                      </div>
                      <span className={`font-bold text-sm shrink-0 ${m.badgeColor}`}>{m.badge}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Metode Pembayaran ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                  Metode Pembayaran
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-text-secondary border border-navy/15 rounded-lg px-2.5 py-1">
                  <span className="material-symbols-outlined text-sm leading-none text-gold">lock</span>
                  SSL Secure
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className="cursor-pointer">
                    <input
                      type="radio" name="payment_method" value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="sr-only"
                    />
                    <div className={`flex items-center gap-4 rounded-xl border p-5 transition-all ${
                      selectedPayment === method.id
                        ? "border-navy bg-navy/5 shadow-md"
                        : "border-navy/15 bg-white hover:border-navy/30"
                    }`}>
                      <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedPayment === method.id ? "border-navy bg-navy" : "border-slate-300"
                      }`}>
                        {selectedPayment === method.id && <div className="size-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-navy">{method.label}</span>
                          <div className="flex gap-1.5">
                            {method.badges.map((b) => (
                              <div key={b.title} title={b.title}
                                className={`h-5 w-8 rounded-sm ${b.color} opacity-80`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary">{method.desc}</p>
                      </div>
                    </div>
                    {/* CC form */}
                    {method.id === "cc" && selectedPayment === "cc" && (
                      <div className="mt-3 ml-9 grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-text-secondary mb-1">Nomor Kartu</label>
                          <input type="text" placeholder="0000 0000 0000 0000"
                            className="w-full rounded-xl border border-navy/20 bg-background-light px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary mb-1">Masa Berlaku</label>
                          <input type="text" placeholder="MM/YY"
                            className="w-full rounded-xl border border-navy/20 bg-background-light px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary mb-1">CVC</label>
                          <input type="text" placeholder="123"
                            className="w-full rounded-xl border border-navy/20 bg-background-light px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10" />
                        </div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Billing note ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/10">
              <h3 className="text-lg font-bold text-navy flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-gold text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                Informasi Penagihan
              </h3>
              <p className="text-sm text-text-secondary">Data tagihan menggunakan informasi akun yang sudah kamu daftarkan.</p>
            </div>

          </div>

          {/* RIGHT col — Order summary */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-navy/10 overflow-hidden">

              {/* Header */}
              <div className="bg-navy px-6 py-5">
                <h2 className="text-lg font-bold text-white mb-0.5">Ringkasan Pesanan</h2>
                <p className="text-xs text-white/50">Periksa kembali sebelum membayar</p>
              </div>

              {/* Template preview */}
              <div className="p-6">
                <div className="flex gap-4 mb-6 items-start">
                  {/* Template thumbnail */}
                  {templateImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={templateImg} alt={templateTitle}
                      className="w-16 h-20 object-cover rounded-xl border border-navy/10 shrink-0" />
                  ) : (
                    <div className="w-16 h-20 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                      <span className="material-symbols-outlined text-gold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-navy leading-tight mb-1">{templateTitle}</h3>
                    <p className="text-sm text-text-secondary mb-2">{templateCat}</p>
                    {/* Lock badge */}
                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-xs leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                      Template eksklusif kamu
                    </span>
                  </div>
                </div>

                {/* Info box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-xs text-blue-700 leading-relaxed">
                  <span className="material-symbols-outlined text-sm align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                  Template ini akan <strong>dikunci khusus untuk akun kamu</strong>. 
                  Ingin akses semua template?{" "}
                  <Link href="/pricing" className="underline font-semibold">Upgrade ke Full Service</Link>.
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 border-t border-navy/[0.08] pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Harga Template</span>
                    <span className="font-semibold text-navy">{templatePrice === "Free" ? "Gratis" : templatePrice}</span>
                  </div>
                  {processingAdj !== 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {PROCESSING_METHODS.find(m => m.id === selectedProcessing)?.label}
                      </span>
                      <span className={`font-semibold ${processingAdj < 0 ? "text-emerald-600" : "text-rose-500"}`}>
                        {processingAdj < 0 ? "−" : "+"}{formatRp(Math.abs(processingAdj))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Platform Fee</span>
                    <span className="font-semibold text-navy">{formatRp(platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Pajak (11%)</span>
                    <span className="font-semibold text-navy">{formatRp(tax)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-dashed border-navy/20">
                  <span className="text-sm font-bold text-text-secondary">Total Pembayaran</span>
                  <span className="text-2xl font-black text-navy">
                    {total === 0 ? "Gratis" : formatRp(total)}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 pt-2">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base leading-none">error</span>
                    {error}
                  </div>
                )}
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy-light transition-all shadow-lg shadow-navy/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-xl leading-none animate-spin">progress_activity</span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                      {total === 0 ? "Dapatkan Gratis" : `Bayar — ${formatRp(total)}`}
                    </>
                  )}
                </button>

                <p className="text-xs text-text-secondary text-center mt-3">
                  Dengan melanjutkan, kamu menyetujui{" "}
                  <Link href="/" className="text-navy underline hover:text-gold transition-colors">Syarat & Ketentuan</Link> kami.
                </p>

                {/* Trust badges */}
                <div className="flex justify-center gap-3 mt-4">
                  {[
                    { icon: "verified_user", label: "SSL Secure" },
                    { icon: "security",      label: "PCI DSS" },
                    { icon: "lock",          label: "Encrypted" },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-1 text-[10px] font-medium text-text-secondary border border-navy/15 rounded-lg px-2 py-1">
                      <span className="material-symbols-outlined text-xs leading-none text-gold">{b.icon}</span>
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-text-secondary mt-4">
              Butuh bantuan?{" "}
              <Link href="/" className="text-navy font-semibold hover:text-gold transition-colors">Hubungi Support</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-navy/10 py-8 px-6 mt-auto">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-base" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <span>256-bit SSL Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-navy flex items-center justify-center">
              <span className="material-symbols-outlined text-gold text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
            </div>
            <span className="font-bold text-navy">ElegantInvites</span>
          </div>
          <p>© 2026 ElegantInvites Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function CatalogCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-navy font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Memuat...
        </div>
      </div>
    }>
      <CatalogCheckoutContent />
    </Suspense>
  );
}
