"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PricingCTAProps {
  planName: string;
  price: string;
  label: string;
  ctaStyle: string;
  isEnterprise?: boolean;
  /** "basic" | "professional" | "enterprise" */
  planSlug: string;
  /** servicePlan user saat ini dari server: null | "basic" | "professional" */
  currentPlan: string | null;
  /** True jika user adalah SUPER_ADMIN */
  isSuperAdmin: boolean;
}

const PLAN_ORDER: Record<string, number> = { basic: 1, professional: 2, enterprise: 3 };

export default function PricingCTA({
  planName,
  price,
  label,
  ctaStyle,
  isEnterprise,
  planSlug,
  currentPlan,
  isSuperAdmin,
}: PricingCTAProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (isSuperAdmin) {
    return (
      <div className="w-full text-center py-3.5 rounded-xl mb-6 text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center justify-center gap-2 cursor-default select-none">
        <span className="material-symbols-outlined text-base leading-none">verified</span>
        Akses Penuh (Admin)
      </div>
    );
  }

  // Paket ini sudah aktif
  if (currentPlan === planSlug) {
    return (
      <div className="w-full text-center py-3.5 rounded-xl mb-6 text-sm bg-gold/10 border border-gold/30 text-gold font-bold flex items-center justify-center gap-2 cursor-default select-none">
        <span className="material-symbols-outlined text-base leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        Paket Aktif
      </div>
    );
  }

  // Paket lebih rendah dari yang dimiliki → tampilkan tapi disabled
  const currentOrder = PLAN_ORDER[currentPlan ?? ""] ?? 0;
  const planOrder = PLAN_ORDER[planSlug] ?? 0;
  if (currentPlan && currentOrder >= planOrder) {
    return (
      <div className="w-full text-center py-3.5 rounded-xl mb-6 text-sm bg-slate-100 text-slate-400 font-semibold flex items-center justify-center gap-2 cursor-default select-none">
        <span className="material-symbols-outlined text-base leading-none">check</span>
        Sudah di-cover paket aktif
      </div>
    );
  }

  async function handleClick() {
    if (isEnterprise) {
      router.push("/admin/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        const params = new URLSearchParams({ plan: planName, price, planSlug });
        router.push(`/pricing/checkout?${params.toString()}`);
      } else {
        router.push("/admin/login?redirect=/pricing");
      }
    } catch {
      router.push("/admin/login?redirect=/pricing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`w-full text-center py-3.5 rounded-xl transition-all mb-6 block text-sm cursor-pointer disabled:opacity-60 ${ctaStyle}`}
    >
      {loading ? "Memuat..." : label}
    </button>
  );
}
