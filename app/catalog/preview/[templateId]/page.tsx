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
    <div className="min-h-screen">
      {/* ── Top bar — sticky, full-width, putih dengan gradient tipis ── */}
      <div
        className="sticky top-0 z-[100] w-full"
        style={{ "--preview-bar-height": "52px" } as React.CSSProperties}
      >
        <div className={`w-full bg-gradient-to-r ${previewGradient} text-white shadow-xl`}>
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span className="hidden sm:inline">Katalog</span>
              </button>
              <span className="text-white/40">|</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-white/70">visibility</span>
                <span className="text-sm font-semibold">Preview: {title}</span>
              </div>
              <span className="hidden md:inline text-xs text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full">
                Data contoh
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
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
      </div>

      {/* ── Template render — langsung di bawah bar, full viewport ── */}
      <div style={{ "--preview-bar-height": "52px" } as React.CSSProperties}>
        <Template {...previewProps} />
      </div>
    </div>
  );
}
