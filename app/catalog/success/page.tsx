"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CatalogSuccessContent() {
  const params = useSearchParams();
  const orderId         = params.get("orderId") || "EI-TPL-" + Math.random().toString(36).slice(2, 10).toUpperCase();
  const title           = params.get("title") || "Template Undangan";
  const total           = params.get("total") || "Gratis";
  const locked          = params.get("locked") === "true";
  const processingMethod = params.get("processingMethod") || "self";
  const eventId         = params.get("eventId"); // ← event yang auto-dibuat saat purchase

  const processingLabel: Record<string, string> = {
    self:    "Input Sendiri",
    regular: "Terima Beres – Reguler (1–2 hari)",
    express: "Terima Beres – Express (12 jam)",
  };

  const date = new Date().toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background-light font-display flex flex-col items-center justify-center px-4 py-12">

      {/* Icon */}
      <div className="relative mb-8">
        <div className="size-28 rounded-full bg-gold/10 flex items-center justify-center">
          <div className="size-20 rounded-full bg-navy flex items-center justify-center shadow-xl shadow-navy/20">
            <span className="material-symbols-outlined text-gold text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-ping" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-navy mb-3 text-center">Template Berhasil Dibeli!</h1>
      <p className="text-text-secondary text-center mb-10 max-w-sm leading-relaxed">
        Template <strong className="text-navy">{title}</strong> sudah aktif di akun kamu.
        {locked
          ? " Template ini dikunci khusus untuk kamu."
          : " Kamu bisa menggunakan semua template karena paket kamu."}
      </p>

      {/* Order card */}
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl shadow-navy/10 bg-white border border-navy/10">
        <div className="bg-navy px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-gold text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
            <span className="font-bold">Lumina Card</span>
          </div>
          <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full tracking-wide uppercase">Lunas</span>
        </div>
        <div className="px-6 py-6 divide-y divide-navy/[0.07]">
          {[
            { label: "Order ID",      value: orderId,          mono: true },
            { label: "Tanggal",       value: date,             mono: false },
            { label: "Template",      value: title,            mono: false },
            { label: "Pengerjaan",    value: processingLabel[processingMethod] ?? processingMethod, mono: false },
            { label: "Total Dibayar", value: total,            bold: true },
          ].map(({ label, value, mono, bold }) => (
            <div key={label} className="flex justify-between items-center py-3">
              <span className="text-sm text-text-secondary">{label}</span>
              <span className={`text-sm text-navy ${bold ? "font-black text-base" : "font-semibold"} ${mono ? "font-mono tracking-wide" : ""}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
          {locked ? (
            <Link
              href={eventId ? `/admin/events/${eventId}/template` : "/admin/events"}
              className="w-full text-center bg-navy text-white font-bold py-3.5 rounded-xl hover:bg-navy-light transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
              Mulai Kustomisasi Template
            </Link>
          ) : (
            <Link
              href="/catalog"
              className="w-full text-center bg-navy text-white font-bold py-3.5 rounded-xl hover:bg-navy-light transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
              Jelajahi Template Lainnya
            </Link>
          )}
          <Link
            href={locked && eventId ? `/admin/events/${eventId}/template` : "/admin/dashboard"}
            className="w-full text-center border-2 border-navy/20 text-navy font-bold py-3.5 rounded-xl hover:border-navy hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            {locked && eventId ? "Edit Template Sekarang" : "Pergi ke Dashboard"}
          </Link>
        </div>
      </div>

      {/* Info locked */}
      {locked && (
        <div className="mt-8 max-w-md text-center bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <p className="text-sm text-amber-800 mt-2 leading-relaxed">
            Template ini dikunci khusus untuk akun kamu. Untuk akses semua template tanpa batas,{" "}
            <Link href="/pricing" className="font-bold underline">upgrade ke Full Service</Link>.
          </p>
        </div>
      )}

      <p className="text-xs text-text-secondary mt-6 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm text-primary">mail</span>
        Invoice sudah dikirim ke email yang terdaftar.
      </p>

      <Link href="/catalog" className="mt-4 text-sm text-text-secondary hover:text-navy transition-colors flex items-center gap-1">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Kembali ke Katalog
      </Link>
    </div>
  );
}

export default function CatalogSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-navy font-bold">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>Memuat...
      </div>
    }>
      <CatalogSuccessContent />
    </Suspense>
  );
}
