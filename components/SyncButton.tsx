"use client";

import { useState } from "react";

interface SyncResult {
  success?: boolean;
  synced?: number;
  attendances?: number;
  errors?: string[];
  message?: string;
  error?: string;
}

interface SyncButtonProps {
  eventId: number;
  /** Callback setelah sync berhasil (misal refresh data) */
  onSyncComplete?: () => void;
}

type SyncStatus = "idle" | "syncing" | "success" | "error" | "offline";

export function SyncButton({ eventId, onSyncComplete }: SyncButtonProps) {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [result, setResult] = useState<SyncResult | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  async function handleSync() {
    // Cek koneksi dulu
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }

    setStatus("syncing");
    setResult(null);

    try {
      const res = await fetch("/api/sync/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data: SyncResult = await res.json();
      setResult(data);

      if (res.ok && data.success) {
        setStatus("success");
        setLastSynced(new Date());
        onSyncComplete?.();
        // Auto-reset ke idle setelah 5 detik
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
      setResult({ error: "Tidak bisa terhubung ke server. Cek koneksi internet." });
    }
  }

  const btnConfig = {
    idle: {
      label: "Sync ke Server",
      icon: "cloud_upload",
      className: "bg-indigo-600 hover:bg-indigo-700 text-white",
    },
    syncing: {
      label: "Menyinkronkan...",
      icon: "sync",
      className: "bg-indigo-400 text-white cursor-not-allowed animate-pulse",
    },
    success: {
      label: "Sync Berhasil!",
      icon: "cloud_done",
      className: "bg-emerald-600 text-white",
    },
    error: {
      label: "Sync Gagal",
      icon: "cloud_off",
      className: "bg-rose-600 hover:bg-rose-700 text-white",
    },
    offline: {
      label: "Tidak Ada Internet",
      icon: "wifi_off",
      className: "bg-slate-500 text-white cursor-not-allowed",
    },
  }[status];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Tombol sync utama */}
        <button
          onClick={handleSync}
          disabled={status === "syncing" || status === "offline"}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${btnConfig.className}`}
        >
          <span
            className={`material-symbols-outlined text-base leading-none ${status === "syncing" ? "animate-spin" : ""}`}
          >
            {btnConfig.icon}
          </span>
          {btnConfig.label}
        </button>

        {/* Info last synced */}
        {lastSynced && status !== "syncing" && (
          <span className="text-xs text-slate-400">
            Terakhir: {lastSynced.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}

        {/* Toggle detail */}
        {result && (status === "success" || status === "error") && (
          <button
            onClick={() => setShowDetail((v) => !v)}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            {showDetail ? "Sembunyikan" : "Detail"}
          </button>
        )}
      </div>

      {/* Result detail */}
      {showDetail && result && (
        <div
          className={`rounded-xl border px-4 py-3 text-xs max-w-sm ${
            result.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {result.message && <p className="font-semibold mb-1">{result.message}</p>}
          {result.error && <p className="font-semibold">{result.error}</p>}
          {result.synced !== undefined && (
            <p>✅ {result.synced} tamu ter-sync</p>
          )}
          {result.attendances !== undefined && (
            <p>📋 {result.attendances} data check-in ter-sync</p>
          )}
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-rose-700 mb-1">⚠️ Error pada beberapa tamu:</p>
              <ul className="space-y-0.5 list-disc list-inside">
                {result.errors.slice(0, 5).map((e, i) => (
                  <li key={i} className="truncate">{e}</li>
                ))}
                {result.errors.length > 5 && (
                  <li className="text-rose-500">...dan {result.errors.length - 5} lainnya</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Offline warning */}
      {status === "offline" && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm leading-none">warning</span>
          Tidak ada koneksi internet. Hubungkan ke jaringan lalu coba lagi.
        </p>
      )}
    </div>
  );
}
