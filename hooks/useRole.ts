"use client";

import { useEffect, useState } from "react";
import type { Role } from "@/lib/roles";

interface MeUser {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  lockedTemplateId: string | null;
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

  return {
    user,
    role: user?.role ?? null,
    lockedTemplateId: user?.lockedTemplateId ?? null,
    /** Template-only buyer: DIY_CLIENT yang membeli 1 template spesifik (bukan Full Service) */
    isTemplateOnly: user?.role === "DIY_CLIENT" && !!user?.lockedTemplateId,
    loading,
  };
}
