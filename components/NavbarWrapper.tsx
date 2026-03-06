"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const HIDDEN_ROUTES = ["/login"];

interface UserInfo {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

export default function NavbarWrapper() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  if (HIDDEN_ROUTES.includes(pathname) || pathname.startsWith("/admin")) return null;

  const displayName = user?.name ?? user?.email ?? "";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "U";

  const dashboardHref =
    user?.role === "ADMIN" ? "/admin/panel" : "/admin/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy/10 bg-white/90 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Lumina Card" className="h-8 w-auto" onError={(e) => { const t = e.target as HTMLImageElement; t.style.display="none"; t.nextElementSibling?.classList.remove("hidden"); }} />
          <div className="size-8 rounded-lg bg-navy hidden items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-gold text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              celebration
            </span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-navy group-hover:text-navy-light transition-colors">
            Lumina Card
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-semibold text-navy/70 hover:text-navy transition-colors">
            Features
          </Link>
          <Link href="/pricing" className={`text-sm font-semibold transition-colors ${pathname === "/pricing" ? "text-gold" : "text-navy/70 hover:text-navy"}`}>
            Pricing
          </Link>
          <Link href="/catalog" className={`text-sm font-semibold transition-colors ${pathname === "/catalog" ? "text-gold" : "text-navy/70 hover:text-navy"}`}>
            Templates
          </Link>
          <Link href="/#about" className="text-sm font-semibold text-navy/70 hover:text-navy transition-colors">
            About
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            /* ── Logged-in user profile ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2.5 rounded-full border border-navy/15 bg-white pl-1 pr-4 py-1 hover:border-navy/30 transition-all shadow-sm"
              >
                {/* Avatar */}
                <div className="size-8 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initials}
                </div>
                <span className="text-sm font-semibold text-navy max-w-[120px] truncate hidden sm:block">
                  {displayName}
                </span>
                <span className="material-symbols-outlined text-navy/50 text-base leading-none">
                  {dropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-navy/10 rounded-xl shadow-xl shadow-navy/10 overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-navy/8">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">
                      {user.role === "ADMIN" ? "Owner" : user.role === "CLIENT" ? "Client" : "Free"}
                    </p>
                    <p className="text-sm font-bold text-navy truncate">{displayName}</p>
                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                  </div>
                  {/* Links */}
                  <div className="py-1">
                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-gold/5 hover:text-gold transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg leading-none">dashboard</span>
                      Dashboard
                    </Link>
                    {user.role !== "USER" && (
                      <Link
                        href="/admin/events"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy hover:bg-gold/5 hover:text-gold transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg leading-none">event</span>
                        My Events
                      </Link>
                    )}
                    {user.role === "USER" && (
                      <Link
                        href="/pricing"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gold font-semibold hover:bg-gold/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg leading-none">upgrade</span>
                        Upgrade Plan
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-navy/8 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg leading-none">logout</span>
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest CTAs ── */
            <>
              <Link
                href="/admin/login"
                className="hidden sm:flex text-sm font-semibold text-navy px-4 py-2 hover:text-navy-light transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/admin/login"
                className="bg-navy text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-navy-light transition-all shadow-lg shadow-navy/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
