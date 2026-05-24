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
  { href: "/admin/events",     icon: "event",            label: "Events & Tamu",      feature: "events",      group: "common" },
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
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="4" y="11" width="28" height="19" rx="2.5" stroke="#C9A96E" strokeWidth="1.6" fill="none"/>
              <path d="M4 13.5L18 22L32 13.5" stroke="#C9A96E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M25 26 Q28 24 29 21" stroke="#C9A96E" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              <path d="M27 24.5 Q29.5 23.5 29 21" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <path d="M18 4 L19.1 7.9 L23 9 L19.1 10.1 L18 14 L16.9 10.1 L13 9 L16.9 7.9 Z" fill="#C9A96E"/>
              <line x1="18" y1="2" x2="18" y2="4" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
              <line x1="23.5" y1="4.5" x2="22.1" y2="5.9" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
              <line x1="12.5" y1="4.5" x2="13.9" y2="5.9" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            </svg>
            <div className="flex flex-col leading-none">
              <p className="text-[13px] font-black tracking-wider text-navy uppercase group-hover:text-navy-light transition-colors" style={{ letterSpacing: "0.12em" }}>Lumina Card</p>
              <p className="text-[7px] font-semibold tracking-[0.2em] text-gold uppercase mt-0.5">Online Invitations</p>
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
          <Link href="/" className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="4" y="11" width="28" height="19" rx="2.5" stroke="#C9A96E" strokeWidth="1.6" fill="none"/>
              <path d="M4 13.5L18 22L32 13.5" stroke="#C9A96E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M25 26 Q28 24 29 21" stroke="#C9A96E" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              <path d="M27 24.5 Q29.5 23.5 29 21" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <path d="M18 4 L19.1 7.9 L23 9 L19.1 10.1 L18 14 L16.9 10.1 L13 9 L16.9 7.9 Z" fill="#C9A96E"/>
              <line x1="18" y1="2" x2="18" y2="4" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
              <line x1="23.5" y1="4.5" x2="22.1" y2="5.9" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
              <line x1="12.5" y1="4.5" x2="13.9" y2="5.9" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            </svg>
            <span className="font-black text-xs text-navy uppercase tracking-wider">Lumina Card</span>
          </Link>
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

