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
          {/* Lumina Card logo — SVG inline (no background issue) */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Envelope body */}
            <rect x="4" y="11" width="28" height="19" rx="2.5" stroke="#C9A96E" strokeWidth="1.6" fill="none"/>
            {/* Envelope flap open V */}
            <path d="M4 13.5L18 22L32 13.5" stroke="#C9A96E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Leaf sprig bottom-right */}
            <path d="M25 26 Q28 24 29 21" stroke="#C9A96E" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
            <path d="M27 24.5 Q29.5 23.5 29 21" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            {/* 4-pointed star above envelope */}
            <path d="M18 4 L19.1 7.9 L23 9 L19.1 10.1 L18 14 L16.9 10.1 L13 9 L16.9 7.9 Z" fill="#C9A96E"/>
            {/* Star glow rays */}
            <line x1="18" y1="2" x2="18" y2="4" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            <line x1="23.5" y1="4.5" x2="22.1" y2="5.9" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            <line x1="12.5" y1="4.5" x2="13.9" y2="5.9" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-black tracking-widest text-navy uppercase group-hover:text-navy-light transition-colors" style={{ letterSpacing: "0.12em" }}>Lumina Card</span>
            <span className="text-[8px] font-semibold tracking-[0.2em] text-gold uppercase mt-0.5">Online Invitations</span>
          </div>
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
