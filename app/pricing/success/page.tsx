"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "EI-" + Math.random().toString(36).slice(2, 10).toUpperCase();
  const plan = params.get("plan") || "Professional";
  const total = params.get("total") || "Rp 799.000";
  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background-light font-display flex flex-col items-center justify-center px-4 py-12">

      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="size-28 rounded-full bg-gold/10 flex items-center justify-center">
          <div className="size-20 rounded-full bg-navy flex items-center justify-center shadow-xl shadow-navy/20">
            <span className="material-symbols-outlined text-gold text-4xl">check_circle</span>
          </div>
        </div>
        {/* Ripple rings */}
        <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-black text-navy mb-3 text-center">Pembayaran Berhasil!</h1>
      <p className="text-text-secondary text-center mb-10 max-w-sm leading-relaxed">
        Terima kasih! Paket <strong className="text-navy">{plan}</strong> kamu sudah aktif. Mulai buat event pertamamu sekarang.
      </p>

      {/* Order Card */}
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl shadow-navy/10 bg-white border border-navy/10">
        {/* Card header */}
        <div className="bg-navy px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-gold text-xl">celebration</span>
            <span className="font-bold">ElegantInvites</span>
          </div>
          <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full tracking-wide uppercase">
            Lunas
          </span>
        </div>

        {/* Card body */}
        <div className="px-6 py-6 divide-y divide-navy/[0.07]">
          {[
            { label: "Order ID", value: orderId, mono: true },
            { label: "Tanggal", value: date, mono: false },
            { label: "Paket Dipilih", value: plan, mono: false },
            { label: "Total Dibayar", value: total, bold: true },
          ].map(({ label, value, mono, bold }) => (
            <div key={label} className="flex justify-between items-center py-3">
              <span className="text-sm text-text-secondary">{label}</span>
              <span
                className={`text-sm text-navy ${bold ? "font-black text-base" : "font-semibold"} ${mono ? "font-mono tracking-wide" : ""}`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Card footer */}
        <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
          <Link
            href="/admin/dashboard"
            className="w-full text-center bg-navy text-white font-bold py-3.5 rounded-xl hover:bg-navy-light transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            Pergi ke Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="w-full text-center border-2 border-navy/20 text-navy font-bold py-3.5 rounded-xl hover:border-navy hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg leading-none">download</span>
            Unduh Invoice
          </button>
        </div>
      </div>

      {/* Bottom note */}
      <p className="text-xs text-text-secondary mt-8 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm text-primary">mail</span>
        Invoice sudah dikirim ke email yang terdaftar.
      </p>

      {/* Back link */}
      <Link
        href="/pricing"
        className="mt-4 text-sm text-text-secondary hover:text-navy transition-colors flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Kembali ke Halaman Harga
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-navy font-bold">Memuat...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
