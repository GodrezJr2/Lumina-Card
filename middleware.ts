import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const userId   = req.cookies.get("user_id")?.value;
  const userRole = req.cookies.get("user_role")?.value;

  // ── Routes yang butuh login ────────────────────────────────────────────────
  const clientRoutes = [
    "/admin/dashboard",
    "/admin/events",
    "/admin/guests",
    "/admin/broadcast",
    "/admin/scanner",
    "/admin/upgrade",
  ];

  // Routes khusus SUPER_ADMIN
  const superAdminRoutes = ["/admin/panel", "/admin/users"];

  const isClientRoute = clientRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
  const isSuperAdminRoute = superAdminRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));

  if (isClientRoute || isSuperAdminRoute) {
    // Belum login → ke halaman login
    if (!userId) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // BASIC_USER (free, belum bayar) → arahkan ke pricing
    if (userRole === "BASIC_USER") {
      return NextResponse.redirect(new URL("/pricing", req.url));
    }

    // Bukan SUPER_ADMIN → tidak boleh akses superAdmin routes
    if (isSuperAdminRoute && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // Sudah login dan mencoba akses /admin/login → langsung ke dashboard
  if (pathname === "/admin/login" && userId) {
    const allowedRoles = ["DIY_CLIENT", "FULL_SERVICE_CLIENT", "USHER_STAFF", "SUPER_ADMIN"];
    if (allowedRoles.includes(userRole ?? "")) {
      const redirectTo = req.nextUrl.searchParams.get("redirect");
      const dest = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/admin/dashboard";
      return NextResponse.redirect(new URL(dest, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/events/:path*",
    "/admin/guests/:path*",
    "/admin/broadcast/:path*",
    "/admin/scanner/:path*",
    "/admin/upgrade/:path*",
    "/admin/panel/:path*",
    "/admin/users/:path*",
    "/admin/login",
  ],
};
