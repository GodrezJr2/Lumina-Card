/**
 * Role definitions & permission map
 *
 * ARSITEKTUR 2 DIMENSI:
 * ─ role          : status akun (BASIC → DIY_CLIENT saat beli template, FULL_SERVICE_CLIENT via admin)
 * ─ servicePlan   : paket jasa absen yang dibeli (null | "basic" | "professional")
 * ─ lockedTemplateId : template yang dibeli dari katalog
 *
 * User bisa punya KOMBINASI, contoh:
 *   • Beli template saja       → role=DIY_CLIENT, servicePlan=null
 *   • Beli jasa absen saja     → role=BASIC_USER, servicePlan="basic"
 *   • Beli keduanya            → role=DIY_CLIENT, servicePlan="basic"
 *   • Full service (tim kami)  → role=FULL_SERVICE_CLIENT, servicePlan="professional"
 */

export type Role =
  | "BASIC_USER"
  | "DIY_CLIENT"
  | "FULL_SERVICE_CLIENT"
  | "USHER_STAFF"
  | "SUPER_ADMIN";

export type ServicePlan = null | "basic" | "professional";

/** Semua role yang dikenal sistem */
export const ALL_ROLES: Role[] = [
  "BASIC_USER",
  "DIY_CLIENT",
  "FULL_SERVICE_CLIENT",
  "USHER_STAFF",
  "SUPER_ADMIN",
];

/** Label display per role */
export const ROLE_LABELS: Record<Role, string> = {
  BASIC_USER: "Basic User",
  DIY_CLIENT: "DIY Client",
  FULL_SERVICE_CLIENT: "Full Service Client",
  USHER_STAFF: "Usher / Staff",
  SUPER_ADMIN: "Super Admin",
};

export const SERVICE_PLAN_LABELS: Record<string, string> = {
  basic:        "Paket Basic (200 tamu)",
  professional: "Paket Professional (1.000 tamu)",
};

/** Badge color per role (Tailwind classes) */
export const ROLE_BADGE: Record<Role, string> = {
  BASIC_USER: "bg-slate-100 text-slate-600",
  DIY_CLIENT: "bg-blue-100 text-blue-700",
  FULL_SERVICE_CLIENT: "bg-purple-100 text-purple-700",
  USHER_STAFF: "bg-amber-100 text-amber-700",
  SUPER_ADMIN: "bg-emerald-100 text-emerald-700",
};

/**
 * Cek apakah kombinasi role+servicePlan bisa akses suatu fitur.
 *
 * Aturan:
 *  - templateEditor  → punya lockedTemplateId (DIY_CLIENT) atau SUPER_ADMIN
 *  - guests          → punya servicePlan (basic/professional) ATAU FULL_SERVICE_CLIENT / SUPER_ADMIN
 *  - broadcast       → sama dengan guests
 *  - scanner         → sama dengan guests + USHER_STAFF
 *  - events          → punya lockedTemplateId ATAU servicePlan ATAU admin
 *  - dashboard       → punya lockedTemplateId ATAU servicePlan ATAU admin
 */
export const PERMISSIONS = {
  dashboard:      ["DIY_CLIENT", "FULL_SERVICE_CLIENT", "SUPER_ADMIN"] as Role[],
  events:         ["DIY_CLIENT", "FULL_SERVICE_CLIENT", "SUPER_ADMIN"] as Role[],
  guests:         ["DIY_CLIENT", "FULL_SERVICE_CLIENT", "SUPER_ADMIN"] as Role[],
  templateEditor: ["DIY_CLIENT", "SUPER_ADMIN"] as Role[],
  broadcast:      ["DIY_CLIENT", "FULL_SERVICE_CLIENT", "SUPER_ADMIN"] as Role[],
  scanner:        ["USHER_STAFF", "DIY_CLIENT", "FULL_SERVICE_CLIENT", "SUPER_ADMIN"] as Role[],
  superAdmin:     ["SUPER_ADMIN"] as Role[],
  upgrade:        ["BASIC_USER", "DIY_CLIENT", "FULL_SERVICE_CLIENT", "USHER_STAFF", "SUPER_ADMIN"] as Role[],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

/** Cek akses ke feature berdasarkan role + servicePlan (opsional) */
export function can(
  role: Role | undefined | null,
  feature: PermissionKey,
  servicePlan?: ServicePlan
): boolean {
  if (!role) return false;
  if (role === "SUPER_ADMIN") return true;

  // Fitur yang butuh servicePlan (jasa absen)
  if (feature === "guests" || feature === "broadcast" || feature === "scanner") {
    if (role === "FULL_SERVICE_CLIENT") return true;
    if (role === "USHER_STAFF" && feature === "scanner") return true;
    return !!servicePlan; // punya basic atau professional
  }

  return (PERMISSIONS[feature] as Role[]).includes(role);
}

/** Cek apakah role adalah SUPER_ADMIN */
export function isSuperAdmin(role: Role | undefined | null): boolean {
  return role === "SUPER_ADMIN";
}

/** Apakah user punya template (beli dari katalog) */
export function hasTemplate(lockedTemplateId: string | null | undefined): boolean {
  return !!lockedTemplateId;
}

/** Apakah user punya paket jasa absen */
export function hasServicePlan(servicePlan: ServicePlan | string | null | undefined): boolean {
  return !!servicePlan;
}

/** Batas tamu berdasarkan servicePlan */
export function guestLimit(servicePlan: ServicePlan | string | null | undefined): number {
  if (servicePlan === "professional") return 1000;
  if (servicePlan === "basic") return 200;
  return 0;
}
