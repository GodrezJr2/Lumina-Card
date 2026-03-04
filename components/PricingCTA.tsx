"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PricingCTAProps {
  planName: string;
  price: string;
  label: string;
  ctaStyle: string;
  isEnterprise?: boolean;
  /** Tier paket ini (0=basic, 1=professional, dst.) */
  planTier: number;
  /** Tier paket yang sedang aktif user (dari server). -1 = belum login */
  currentTier: number;
  /** True jika user adalah SUPER_ADMIN */
  isSuperAdmin: boolean;
}

export default function PricingCTA({
  planName,
  price,
  label,
  ctaStyle,
  isEnterprise,
  planTier,
  currentTier,
  isSuperAdmin,
}: PricingCTAProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // SUPER_ADMIN tidak perlu beli apapun
  if (isSuperAdmin) {
    return (
      <div className="w-full text-center py-3.5 rounded-xl mb-6 text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center justify-center gap-2 cursor-default select-none">
        <span className="material-symbols-outlined text-base leading-none">verified</span>
        Akses Penuh (Admin)
      </div>
    );
  }

  // Paket ini sudah aktif (tier sama)
  if (currentTier === planTier) {
    return (
      <div className="w-full text-center py-3.5 rounded-xl mb-6 text-sm bg-gold/10 border border-gold/30 text-gold font-bold flex items-center justify-center gap-2 cursor-default select-none">
        <span className="material-symbols-outlined text-base leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        Paket Aktif
      </div>
    );
  }

  // Paket lebih rendah dari yang dimiliki → tidak ditampilkan (page sudah hide, tapi guard di sini juga)
  if (currentTier > planTier && currentTier >= 0) {
    return null;
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
        const params = new URLSearchParams({ plan: planName, price });
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
