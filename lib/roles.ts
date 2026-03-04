/**
 * Role definitions & permission map
 * Sesuai struktur SaaS: Absen + Template-only
 */

export type Role =
  | "BASIC_USER"
  | "DIY_CLIENT"
  | "FULL_SERVICE_CLIENT"
  | "USHER_STAFF"
  | "SUPER_ADMIN";

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

/** Badge color per role (Tailwind classes) */
export const ROLE_BADGE: Record<Role, string> = {
  BASIC_USER: "bg-slate-100 text-slate-600",
  DIY_CLIENT: "bg-blue-100 text-blue-700",
  FULL_SERVICE_CLIENT: "bg-purple-100 text-purple-700",
  USHER_STAFF: "bg-amber-100 text-amber-700",
  SUPER_ADMIN: "bg-emerald-100 text-emerald-700",
};

/**
 * Permission map — setiap feature: siapa yang boleh akses
 */
export const PERMISSIONS = {
  // Dashboard utama
  dashboard:        ["DIY_CLIENT", "FULL_SERVICE_CLIENT", "SUPER_ADMIN"] as Role[],
  // Manajemen event (buat/edit event)
  events:           ["DIY_CLIENT", "SUPER_ADMIN"] as Role[],
  // Manajemen tamu
  guests:           ["DIY_CLIENT", "FULL_SERVICE_CLIENT", "SUPER_ADMIN"] as Role[],
  // Editor template undangan
  templateEditor:   ["DIY_CLIENT", "SUPER_ADMIN"] as Role[],
  // Broadcast WhatsApp
  broadcast:        ["DIY_CLIENT", "FULL_SERVICE_CLIENT", "SUPER_ADMIN"] as Role[],
  // Scanner QR check-in
  scanner:          ["USHER_STAFF", "DIY_CLIENT", "FULL_SERVICE_CLIENT", "SUPER_ADMIN"] as Role[],
  // Panel admin super (kelola semua user/tenant)
  superAdmin:       ["SUPER_ADMIN"] as Role[],
  // Upgrade/payment page — semua bisa lihat
  upgrade:          ["BASIC_USER", "DIY_CLIENT", "FULL_SERVICE_CLIENT", "USHER_STAFF", "SUPER_ADMIN"] as Role[],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

/** Cek apakah role punya akses ke feature tertentu */
export function can(role: Role | undefined | null, feature: PermissionKey): boolean {
  if (!role) return false;
  return (PERMISSIONS[feature] as Role[]).includes(role);
}

/** Cek apakah role adalah SUPER_ADMIN */
export function isSuperAdmin(role: Role | undefined | null): boolean {
  return role === "SUPER_ADMIN";
}
