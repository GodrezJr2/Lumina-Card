"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  EtherealGardenTemplate,
  RoyalGoldTemplate,
  ModernCorporateTemplate,
  NeonNexusTemplate,
  SakuraDreamTemplate,
  GoldenHourTemplate,
} from "@/components/InvitationTemplates";
import type { InvitationProps } from "@/components/InvitationTemplates";
import { CATALOG_TEMPLATE_MAP } from "@/lib/catalog-templates";

// Map componentName string → komponen React yang sebenarnya
// Ketika nambah template baru, tambah juga entry di sini
const COMPONENT_MAP: Record<string, React.ComponentType<InvitationProps>> = {
  EtherealGardenTemplate,
  RoyalGoldTemplate,
  ModernCorporateTemplate,
  NeonNexusTemplate,
  SakuraDreamTemplate,
  GoldenHourTemplate,
};

export default function CatalogPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.templateId as string;

  const template = CATALOG_TEMPLATE_MAP[templateId];

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="material-symbols-outlined text-5xl text-slate-300">error</span>
        <p className="text-slate-500 text-lg">Template tidak ditemukan.</p>
        <Link href="/catalog" className="text-primary font-semibold hover:underline">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const Template = COMPONENT_MAP[template.componentName];
  const { title, price, category, previewProps, previewGradient } = template;

  const checkoutParams = new URLSearchParams({
    templateId,
    title,
    price,
    category,
    img: template.src,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top bar ── */}
      <div className={`sticky top-0 z-50 bg-gradient-to-r ${previewGradient} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Katalog
            </button>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-white/70">visibility</span>
              <span className="text-sm font-semibold">Preview: {title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-xs text-white/70 font-medium bg-white/10 px-3 py-1 rounded-full">
              Data contoh — bukan data asli
            </span>
            <Link
              href={`/catalog/checkout?${checkoutParams.toString()}`}
              className="flex items-center gap-2 bg-white text-slate-900 font-bold text-sm px-4 py-2 rounded-lg hover:bg-white/90 shadow-md transition-all hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              Gunakan Template
            </Link>
          </div>
        </div>
      </div>

      {/* ── Notice banner ── */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
          <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">info</span>
          <p>
            <strong>Ini adalah halaman preview.</strong> Template ditampilkan dengan data dummy untuk keperluan demonstrasi.
            Data asli (nama, tanggal, lokasi, dll.) akan disesuaikan saat Anda menggunakan template ini untuk event Anda.
          </p>
        </div>
      </div>

      {/* ── Template render ── */}
      {/* previewOffset = tinggi notice banner (~80px) + mt-6 (24px) supaya
          template sticky header nempel tepat di bawah catalog top bar */}
      <div className="mt-6 pb-24" style={{ "--preview-bar-height": "56px", "--template-scroll-offset": "120px" } as React.CSSProperties}>
        <Template {...previewProps} />
      </div>

      {/* ── Bottom CTA ── */}
      <div className={`fixed bottom-0 inset-x-0 z-50 bg-gradient-to-r ${previewGradient} text-white py-4 px-6 shadow-2xl`}>
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-bold text-lg">{title}</p>
            <p className="text-sm text-white/70">Suka dengan template ini?</p>
          </div>
          <Link
            href={`/catalog/checkout?${checkoutParams.toString()}`}
            className="flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-white/90 shadow-lg transition-all hover:scale-[1.02] whitespace-nowrap"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Gunakan Template Ini
          </Link>
        </div>
      </div>
    </div>
  );
}
