"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap: any;
  }
}

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

const PLAN_FEATURES: Record<string, string[]> = {
  basic:        ["Check-in scanner", "Import tamu CSV", "Broadcast pesan", "1 event aktif"],
  professional: ["Semua fitur Basic", "Unlimited event", "Analytics dashboard", "Priority support", "Custom domain undangan"],
};

function CheckoutContent() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const planName    = searchParams.get("plan")  || "Professional";
  const planPrice   = searchParams.get("price") || "Rp 799K";

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const subtotal    = parsePriceToNumber(planPrice);
  const platformFee = 5000;
  const tax         = Math.round(subtotal * 0.11);
  const total       = subtotal + platformFee + tax;
  const features    = PLAN_FEATURES[planName.toLowerCase()] ?? PLAN_FEATURES["professional"];

  // Load Midtrans Snap.js (idempotent)
  useEffect(() => {
    const isProd  = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl = isProd
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    if (document.querySelector(`script[src="${snapUrl}"]`)) return;
    const script  = document.createElement("script");
    script.src    = snapUrl;
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "");
    script.async  = true;
    document.body.appendChild(script);
  }, []);

  async function handlePay() {
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/payment/midtrans/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ type: "pricing", plan: planName.toLowerCase(), amount: total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat transaksi.");
      if (!window.snap) throw new Error("Pembayaran belum siap, coba refresh halaman.");

      window.snap.pay(data.snapToken, {
        onSuccess: async (result: Record<string, string>) => {
          try {
            await fetch("/api/pricing/purchase", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({ plan: planName.toLowerCase() }),
            });
          } catch { /* webhook handles this */ }
          router.push(`/pricing/success?plan=${planName}&total=${encodeURIComponent(formatRp(total))}&orderId=${result.order_id ?? data.orderId}`);
        },
        onPending: (result: Record<string, string>) => {
          router.push(`/pricing/success?plan=${planName}&total=${encodeURIComponent(formatRp(total))}&orderId=${result.order_id ?? data.orderId}&status=pending`);
        },
        onError: (result: Record<string, string>) => {
          setError(result?.status_message ?? "Pembayaran gagal. Silakan coba lagi.");
          setLoading(false);
        },
        onClose: () => {
          setError("Popup ditutup. Klik Bayar Sekarang untuk mencoba lagi.");
          setLoading(false);
        },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-text-main flex flex-col">

      {/* â”€â”€ Header â”€â”€ */}
      <div className="bg-white border-b border-navy/10 px-6 py-5">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Lumina Card" className="h-8 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="font-black text-navy text-lg tracking-tight">Lumina Card</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/pricing" className="hover:text-navy transition-colors">Pricing</Link>
            <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
            <span className="text-navy font-semibold">Checkout</span>
          </div>
        </div>
      </div>

      {/* â”€â”€ Main â”€â”€ */}
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* â”€â”€ LEFT â”€â”€ */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Plan detail */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/10">
              <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                Paket yang Dipilih
              </h2>
              <div className="flex items-center gap-4 bg-navy/[0.03] rounded-xl p-4 mb-5">
                <div className="size-12 rounded-xl bg-navy flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-gold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-navy text-lg">Paket {planName}</p>
                  <p className="text-sm text-text-secondary">Lumina Card Event Management</p>
                </div>
                <span className="text-xl font-black text-navy">{planPrice}</span>
              </div>
              <ul className="space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className="material-symbols-outlined text-emerald-500 text-base leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment info â€” no selector, Midtrans handles it */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/10">
              <h2 className="text-xl font-bold text-navy mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                Metode Pembayaran
              </h2>
              <div className="bg-navy/[0.03] rounded-xl p-4 flex gap-3 text-sm text-text-secondary leading-relaxed">
                <span className="material-symbols-outlined text-navy/40 shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <p>Pilih metode pembayaran (VA, GoPay, QRIS, Kartu Kredit, dll) langsung di <strong className="text-navy">popup yang muncul setelah klik Bayar</strong>.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-text-secondary">Tersedia:</span>
                {[
                  { bg: "bg-blue-600",     label: "BCA" },
                  { bg: "bg-orange-500",   label: "BNI" },
                  { bg: "bg-blue-800",     label: "BRI" },
                  { bg: "bg-red-500",      label: "QRIS" },
                  { bg: "bg-emerald-500",  label: "GoPay" },
                  { bg: "bg-orange-600",   label: "ShopeePay" },
                ].map((p) => (
                  <span key={p.label} className={`${p.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>{p.label}</span>
                ))}
              </div>
            </div>

            {/* Billing info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-navy/10 flex items-center gap-3">
              <span className="material-symbols-outlined text-gold" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
              <div>
                <p className="font-bold text-navy text-sm">Informasi Penagihan</p>
                <p className="text-xs text-text-secondary mt-0.5">Data tagihan sesuai akun yang terdaftar.</p>
              </div>
            </div>
          </div>

          {/* â”€â”€ RIGHT: Summary + CTA â”€â”€ */}
          <div className="lg:col-span-2 sticky top-24">
            <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 border border-navy/10 overflow-hidden">
              <div className="bg-navy px-6 py-5">
                <h2 className="text-lg font-bold text-white mb-0.5">Ringkasan Pesanan</h2>
                <p className="text-xs text-white/50">Periksa kembali sebelum membayar</p>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Paket {planName}</span>
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
                <div className="flex justify-between items-center pt-4 border-t border-dashed border-navy/20">
                  <span className="text-sm font-bold text-text-secondary">Total</span>
                  <span className="text-2xl font-black text-navy">{formatRp(total)}</span>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                    <span className="material-symbols-outlined text-base leading-none shrink-0 mt-0.5">error</span>
                    <span>{error}</span>
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
                      Membuka Pembayaran...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                      Bayar Sekarang â€” {formatRp(total)}
                    </>
                  )}
                </button>
                <p className="text-xs text-text-secondary text-center mt-3">
                  Dengan melanjutkan, kamu menyetujui{" "}
                  <Link href="/" className="text-navy underline">Syarat & Ketentuan</Link> kami.
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  {[{ icon: "verified_user", label: "SSL" }, { icon: "security", label: "PCI DSS" }, { icon: "lock", label: "Encrypted" }].map((b) => (
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

      <footer className="bg-white border-t border-navy/10 py-6 px-6 mt-auto">
        <div className="max-w-[900px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-base" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <span>256-bit SSL Secure Checkout</span>
          </div>
          <span className="font-bold text-navy">Lumina Card</span>
          <p>Â© 2026 Lumina Card. All rights reserved.</p>
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
