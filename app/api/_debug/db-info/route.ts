import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/_debug/db-info
 * Return info DB yang sedang connected — untuk indicator UI di scanner.
 * Tidak expose credentials, hanya hostname.
 */
export async function GET() {
  const url = process.env.DATABASE_URL ?? "";
  const prodUrl = process.env.PROD_DATABASE_URL ?? "";

  let host = "";
  let port = "";
  let database = "";

  try {
    const m = url.match(/@([^:/]+)(?::(\d+))?\/([^?]+)/);
    if (m) {
      host = m[1];
      port = m[2] ?? "3306";
      database = m[3];
    }
  } catch { /* silent */ }

  const isLocal =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("192.168.") ||
    host.startsWith("10.") ||
    host.endsWith(".local");

  const hasCloudFallback = !!prodUrl && prodUrl !== url;

  return NextResponse.json({
    isLocal,
    host,
    port,
    database,
    hasCloudFallback,
    label: isLocal ? "Local DB (offline mode)" : "Cloud DB (live)",
    canSync: isLocal && hasCloudFallback,
  });
}
