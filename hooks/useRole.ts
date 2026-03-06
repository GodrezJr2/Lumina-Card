"use client";

import { useEffect, useState } from "react";
import type { Role, ServicePlan } from "@/lib/roles";
import { hasTemplate, hasServicePlan, guestLimit } from "@/lib/roles";

interface MeUser {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  lockedTemplateId: string | null;
  servicePlan: ServicePlan | null;
}

/** Hook untuk ambil user + role dari /api/auth/me */
export function useRole() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  const role = user?.role ?? null;
  const lockedTemplateId = user?.lockedTemplateId ?? null;
  const servicePlan = (user?.servicePlan ?? null) as ServicePlan;

  return {
    user,
    role,
    lockedTemplateId,
    servicePlan,
    /** Apakah user punya template dari katalog */
    hasTemplate: hasTemplate(lockedTemplateId),
    /** Apakah user punya paket jasa absen (basic/professional) */
    hasService: hasServicePlan(servicePlan),
    /** Batas tamu sesuai servicePlan (0 jika tidak punya) */
    guestLimit: guestLimit(servicePlan),
    /**
     * Template-only buyer: DIY_CLIENT yang punya lockedTemplateId tapi BELUM punya servicePlan.
     * Mereka dapat dashboard onboarding, bukan dashboard normal.
     */
    isTemplateOnly: role === "DIY_CLIENT" && !!lockedTemplateId && !servicePlan,
    loading,
  };
}
