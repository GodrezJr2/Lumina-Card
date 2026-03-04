"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRole } from "@/hooks/useRole";
import type { Role, PermissionKey } from "@/lib/roles";
import { can, ROLE_LABELS, ROLE_BADGE } from "@/lib/roles";

interface RoleGateProps {
  /** Feature key dari PERMISSIONS map */
  feature?: PermissionKey;
  /** Atau langsung list role yang diizinkan */
  allow?: Role[];
  /**
   * Redirect override. Kalau tidak diisi:
   *  - BASIC_USER         → "/#pricing"  (belum beli apa-apa, lihat pricing dulu)
   *  - Role lain tapi kurang akses → "/admin/upgrade" (sudah bayar tapi butuh naik paket)
   */
  redirectTo?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGate({
  feature,
  allow,
  redirectTo,
  fallback,
  children,
}: RoleGateProps) {
  const { role, loading } = useRole();
  const router = useRouter();

  const hasAccess = (() => {
    if (loading || !role) return null;
    if (feature) return can(role, feature);
    if (allow) return allow.includes(role);
    return true;
  })();

  useEffect(() => {
    if (hasAccess === false) {
      // Tentukan tujuan redirect
      const dest = redirectTo
        ? redirectTo
        : role === "BASIC_USER"
        ? "/#pricing"
        : "/admin/upgrade";
      router.replace(dest);
    }
  }, [hasAccess, redirectTo, role, router]);

  if (loading || hasAccess === null) {
    return (
      fallback ?? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="size-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm">Memuat…</span>
          </div>
        </div>
      )
    );
  }

  if (!hasAccess) return null; // sedang redirect

  return <>{children}</>;
}

/**
 * Badge kecil untuk display role user
 */
export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}
