"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { RoleBadge } from "@/components/RoleGate";
import { can } from "@/lib/roles";

const NAV_ALL = [
  { href: "/admin/panel",      icon: "manage_accounts",  label: "All Events (Owner)", feature: "superAdmin",  group: "admin" },
  { href: "/admin/dashboard",  icon: "dashboard",        label: "Overview",           feature: "dashboard",   group: "common" },
  { href: "/admin/events",     icon: "event",            label: "Events",             feature: "events",      group: "common" },
  { href: "/admin/guests",     icon: "group",            label: "Guest List",         feature: "guests",      group: "service" },
  { href: "/admin/guests/add", icon: "person_add",       label: "Add Guest",          feature: "guests",      group: "service" },
  { href: "/admin/broadcast",  icon: "send",             label: "WA Sender",          feature: "broadcast",   group: "service" },
  { href: "/admin/scanner",    icon: "qr_code_scanner",  label: "QR Scanner",         feature: "scanner",     group: "service" },
  { href: "/admin/upgrade",    icon: "bolt",             label: "Upgrade Paket",      feature: "upgrade",     group: "common" },
] as const;

/** Nav untuk template-only (punya template, belum punya service plan) */
const NAV_TEMPLATE_ONLY = [
  { href: "/admin/dashboard",  icon: "dashboard",  label: "Dashboard",            feature: "dashboard", group: "common" },
  { href: "/admin/events",     icon: "palette",    label: "Kustomisasi Template", feature: "events",    group: "common" },
  { href: "/admin/upgrade",    icon: "bolt",       label: "Tambah Paket Absen",   feature: "upgrade",   group: "common" },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, servicePlan, isTemplateOnly, hasTemplate, hasService } = useRole();
  const [pendingCount, setPendingCount] = useState(0);

  // Hitung berapa checklist item yang belum selesai (untuk badge di sidebar dashboard)
  useEffect(() => {
    if (!isTemplateOnly) return;
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        const ev = data.events?.[0];
        if (!ev) { setPendingCount(5); return; }
        let pending = 0;
        if (!ev.coupleNames?.trim()) pending++;
        if (!ev.date || new Date(ev.date) <= new Date(2000, 0, 1)) pending++;
        if (!ev.venueAddress?.trim() || ev.venueAddress === "Belum diisi") pending++;
        if (!ev.musicUrl?.trim()) pending++;   // opsional tapi tetap hitung
        if (!ev.slugUrl) pending++;
        setPendingCount(pending);
      })
      .catch(() => {});
  }, [isTemplateOnly]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  // Login page is full-screen — skip sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Pilih nav sesuai kombinasi hasTemplate + hasService
  const baseNav: { href: string; icon: string; label: string; feature: string; group: string }[] =
    isTemplateOnly
      ? (NAV_TEMPLATE_ONLY as unknown as { href: string; icon: string; label: string; feature: string; group: string }[])
      : (NAV_ALL as unknown as { href: string; icon: string; label: string; feature: string; group: string }[]);

  const visibleNav = baseNav.filter(({ feature }) => !role || can(role, feature as Parameters<typeof can>[1], servicePlan ?? null));

  return (
    <div className="flex min-h-screen bg-[#f8fbfc]">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex w-64 flex-col fixed h-full bg-white border-r border-slate-200 z-20">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-9 text-[#13c8ec] group-hover:text-[#0fb3d4] transition-colors">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-none group-hover:text-[#13c8ec] transition-colors">Lumina Card</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isTemplateOnly ? "Template Panel" : hasService ? "Service Panel" : "Admin Panel"}
              </p>
            </div>
          </Link>
        </div>

        {/* Template-only info banner */}
        {isTemplateOnly && (
          <div className="mx-3 mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-700">
            <p className="font-semibold mb-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              Template Only
            </p>
            <p className="text-amber-600">Punya template undangan.{" "}
              <Link href="/admin/upgrade" className="font-bold underline">Tambah paket absen</Link> untuk fitur kelola tamu.
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          {visibleNav.map(({ href, icon, label }) => {
            const active = pathname === href || (href !== "/admin/guests" && pathname.startsWith(href + "/")) || (href === "/admin/guests" && pathname === "/admin/guests");
            const showBadge = href === "/admin/dashboard" && isTemplateOnly && pendingCount > 0;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-[#13c8ec]/10 text-[#13c8ec]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="material-symbols-outlined text-xl leading-none">{icon}</span>
                <span className="flex-1">{label}</span>
                {showBadge && (
                  <span className="size-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {/* User info + role badge */}
          {user && (
            <div className="flex items-center gap-2 px-2">
              <div className="size-7 rounded-full bg-[#13c8ec]/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#13c8ec] text-base leading-none">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">{user.name || user.email}</p>
                {role && <RoleBadge role={role} />}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <span className="material-symbols-outlined text-xl leading-none">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-10">
          <Link href="/" className="font-bold text-sm text-slate-800">Lumina Card</Link>
          <div className="flex gap-1">
            {visibleNav.map(({ href, icon }) => (
              <Link
                key={href}
                href={href}
                className={`size-9 flex items-center justify-center rounded-lg transition ${
                  pathname === href ? "bg-[#13c8ec]/10 text-[#13c8ec]" : "text-slate-400 hover:text-[#13c8ec]"
                }`}
              >
                <span className="material-symbols-outlined text-lg leading-none">{icon}</span>
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 p-5 md:p-8 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

