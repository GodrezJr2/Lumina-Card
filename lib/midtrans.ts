/**
 * Midtrans Snap client (server-side only)
 * Docs: https://docs.midtrans.com/docs/snap-overview
 *
 * Set MIDTRANS_IS_PRODUCTION="false" untuk Sandbox, "true" untuk Production.
 * Key Sandbox diambil dari: dashboard.sandbox.midtrans.com → Settings → Access Keys
 * Key Production diambil dari: dashboard.midtrans.com → Settings → Access Keys
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require("midtrans-client");

const serverKey    = process.env.MIDTRANS_SERVER_KEY ?? "";
const clientKey    = process.env.MIDTRANS_CLIENT_KEY ?? "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

/** Client key — safe to expose to browser */
export const midtransClientKey    = clientKey;
export const midtransIsProduction = isProduction;
