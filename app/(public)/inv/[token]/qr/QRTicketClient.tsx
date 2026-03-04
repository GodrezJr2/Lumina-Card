"use client";

import { useEffect, useState } from "react";

interface Props {
  token: string;
}

export default function QRTicketClient({ token }: Props) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    const qrData = `${window.location.origin}/inv/${token}`;
    const primary = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}&color=0d191b&bgcolor=ffffff&margin=2`;
    const fallback = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=220&margin=2`;

    // Test primary URL
    const img = new Image();
    img.onload = () => {
      setQrUrl(primary);
      setStatus("loaded");
    };
    img.onerror = () => {
      // Try fallback
      const img2 = new Image();
      img2.onload = () => {
        setQrUrl(fallback);
        setStatus("loaded");
      };
      img2.onerror = () => setStatus("error");
      img2.src = fallback;
    };
    img.src = primary;
  }, [token]);

  if (status === "error") {
    return (
      <div
        className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 p-4 text-center gap-2"
        style={{ width: 220, height: 220 }}
      >
        <span className="material-symbols-outlined text-3xl text-slate-400">qr_code_2</span>
        <p className="text-xs text-slate-400 leading-tight">
          QR tidak dapat dimuat.<br />Pastikan ada koneksi internet.
        </p>
        <p className="text-xs font-mono text-slate-300 break-all">{token.slice(0, 16)}…</p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div
        className="size-[220px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-slate-300 text-4xl">qr_code_2</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-inner p-3 border border-slate-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrUrl!}
        alt="QR Code"
        width={220}
        height={220}
        style={{ borderRadius: 12, display: "block" }}
      />
    </div>
  );
}


