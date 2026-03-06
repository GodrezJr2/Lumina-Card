"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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

// Compute price breakdown from raw price string like "Rp 299K"
function parsePriceToNumber(price: string): number {
  const match = price.replace(/\./g, "").match(/[\d]+/);
  if (!match) return 0;
  const num = parseInt(match[0]);
  if (price.toUpperCase().includes("K")) return num * 1000;
  return num;
}

function formatRp(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan") || "Professional";
  const planPrice = searchParams.get("price") || "Rp 799K";

  const [selectedMethod, setSelectedMethod] = useState("va");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = parsePriceToNumber(planPrice);
  const platformFee = 5000;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + platformFee + tax;

  // Load Midtrans Snap.js (sandbox atau production, idempotent)
  useEffect(() => {
    const isProd = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl = isProd
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    if (document.querySelector(`script[src="${snapUrl}"]`)) return;
    const script = document.createElement("script");
    script.src = snapUrl;
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "");
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handlePay() {
    setError("");
    setLoading(true);
    try {
      // Buat transaksi Midtrans
      const res = await fetch("/api/payment/midtrans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pricing",
          plan: planName.toLowerCase(),
          amount: total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat transaksi.");

      // Buka Midtrans Snap popup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const snapWindow = window as any;
      if (!snapWindow.snap) throw new Error("Midtrans Snap belum termuat, coba refresh halaman.");

      snapWindow.snap.pay(data.snapToken, {
        onSuccess: async (result: Record<string, string>) => {
          console.log("[snap] success", result);
          // Snap success → juga jalankan purchase logic langsung (fallback dari webhook)
          try {
            await fetch("/api/pricing/purchase", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan: planName.toLowerCase() }),
            });
          } catch { /* webhook sudah handle */ }

          const params = new URLSearchParams({
            plan: planName,
            total: formatRp(total),
            orderId: data.orderId,
          });
          router.push(`/pricing/success?${params.toString()}`);
        },
        onPending: (result: Record<string, string>) => {
          console.log("[snap] pending", result);
          setError("Pembayaran pending — selesaikan pembayaran di aplikasi bank / e-wallet kamu.");
          setLoading(false);
        },
        onError: (result: Record<string, string>) => {
          console.error("[snap] error", result);
          setError("Pembayaran gagal. Coba lagi atau pilih metode lain.");
          setLoading(false);
        },
        onClose: () => { setLoading(false); },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-text-main flex flex-col">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-navy/10 px-6 py-8">
        <div className="max-w-[1100px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
            <Link href="/pricing" className="hover:text-navy transition-colors">Pricing</Link>
            <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
            <span className="text-navy font-semibold">Checkout</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-navy tracking-tight">Checkout</h1>
          <p className="text-text-secondary mt-2">Selesaikan pembelian untuk mengaktifkan paket event kamu.</p>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="flex-1 py-10 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LEFT: Payment Methods ── */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/10">
              <div className="flex items-center justify-between mb-6">
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
                  <label key={method.id} className="group cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center gap-4 rounded-xl border p-5 transition-all ${
                        selectedMethod === method.id
                          ? "border-navy bg-navy/5 shadow-md"
                          : "border-navy/15 bg-white hover:border-navy/30"
                      }`}
                    >
                      {/* Radio dot */}
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          selectedMethod === method.id
                            ? "border-navy bg-navy"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedMethod === method.id && (
                          <div className="size-2 rounded-full bg-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-navy">{method.label}</span>
                          <div className="flex gap-1.5">
                            {method.badges.map((b) => (
                              <div
                                key={b.title}
                                title={b.title}
                                className={`h-5 w-8 rounded-sm ${b.color} opacity-80`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary">{method.desc}</p>
                      </div>
                    </div>

                    {/* Credit card form (only for cc) */}
                    {method.id === "cc" && selectedMethod === "cc" && (
                      <div className="mt-3 ml-9 grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-text-secondary mb-1">Nomor Kartu</label>
                          <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className="w-full rounded-xl border border-navy/20 bg-background-light px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary mb-1">Masa Berlaku</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full rounded-xl border border-navy/20 bg-background-light px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary mb-1">CVC</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full rounded-xl border border-navy/20 bg-background-light px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
                          />
                        </div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Billing Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                  Informasi Penagihan
                </h3>
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                <p className="text-navy font-semibold">Terdaftar sesuai akun kamu</p>
                <p>Data tagihan menggunakan informasi akun yang sudah kamu daftarkan.</p>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-navy/10 overflow-hidden">

              {/* Header */}
              <div className="bg-navy px-6 py-5">
                <h2 className="text-lg font-bold text-white mb-0.5">Ringkasan Pesanan</h2>
                <p className="text-xs text-white/50">Periksa kembali sebelum membayar</p>
              </div>

              {/* Product */}
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <div className="size-14 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-gold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      celebration
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-navy leading-tight mb-1">Paket {planName}</h3>
                    <p className="text-sm text-text-secondary mb-2">ElegantInvites Event Management</p>
                    <span className="inline-flex items-center gap-1 bg-gold/10 text-gold text-xs font-bold px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-xs leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Aktif setelah pembayaran
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-navy/[0.08] pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-semibold text-navy">{formatRp(subtotal)}</span>
                  </div>
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
                  <span className="text-2xl font-black text-navy">{formatRp(total)}</span>
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
                      Bayar Sekarang — {formatRp(total)}
                    </>
                  )}
                </button>

                <p className="text-xs text-text-secondary text-center mt-3">
                  Dengan melanjutkan, kamu menyetujui{" "}
                  <Link href="/" className="text-navy underline hover:text-gold transition-colors">
                    Syarat & Ketentuan
                  </Link>{" "}
                  kami.
                </p>

                {/* Trust badges */}
                <div className="flex justify-center gap-3 mt-4">
                  {[
                    { icon: "verified_user", label: "SSL Secure" },
                    { icon: "security", label: "PCI DSS" },
                    { icon: "lock", label: "Encrypted" },
                  ].map((badge) => (
                    <div
                      key={badge.label}
                      className="flex items-center gap-1 text-[10px] font-medium text-text-secondary border border-navy/15 rounded-lg px-2 py-1"
                    >
                      <span className="material-symbols-outlined text-xs leading-none text-gold">{badge.icon}</span>
                      {badge.label}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Help text */}
            <p className="text-center text-sm text-text-secondary mt-4">
              Butuh bantuan?{" "}
              <Link href="/" className="text-navy font-semibold hover:text-gold transition-colors">
                Hubungi Support
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-navy/10 py-8 px-6">
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-navy font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Memuat...
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
