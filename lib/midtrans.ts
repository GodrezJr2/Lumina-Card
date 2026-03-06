/**
 * Midtrans Snap client (server-side only)
 * Docs: https://docs.midtrans.com/docs/snap-overview
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require("midtrans-client");

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY ?? "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY ?? "",
});

/** Client key — safe to expose to browser */
export const midtransClientKey = process.env.MIDTRANS_CLIENT_KEY ?? "";
export const midtransIsProduction = isProduction;
