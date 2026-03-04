"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RoleGate } from "@/components/RoleGate";

interface ScanResult {
  token: string;
  name: string;
  status: string;
  message: string;
  success: boolean;
}

type Mode = "upload" | "manual" | "camera";

export default function ScannerPage() {
  const [mode, setMode] = useState<Mode>("upload");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [lastToken, setLastToken] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [processing, setProcessing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<{ clear: () => Promise<void> } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSecureCtx = typeof window !== "undefined" ? window.isSecureContext : false;

  const playBeep = useCallback((success: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = success ? 880 : 300;
      osc.type = success ? "sine" : "square";
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch { /* silent */ }
  }, []);

  const doCheckin = useCallback(async (rawText: string) => {
    if (rawText === lastToken) return;
    setLastToken(rawText);
    setResult(null);
    setProcessing(true);

    let token = rawText.trim();
    try {
      const url = new URL(token);
      const parts = url.pathname.split("/").filter(Boolean);
      const invIdx = parts.indexOf("inv");
      if (invIdx !== -1 && parts[invIdx + 1]) token = parts[invIdx + 1];
    } catch { /* raw token */ }

    try {
      const r = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await r.json();
      setResult({
        token,
        name: d.name ?? "",
        status: d.status ?? "Unknown",
        message: d.message ?? (r.ok ? "Check-in berhasil!" : d.error ?? "Gagal check-in."),
        success: r.ok,
      });
      playBeep(r.ok);
    } catch {
      setResult({ token, name: "", status: "Error", message: "Gagal terhubung ke server.", success: false });
      playBeep(false);
    }

    setProcessing(false);
    setTimeout(() => setLastToken(""), 3000);
  }, [lastToken, playBeep]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setProcessing(true);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx2d = canvas.getContext("2d")!;
      ctx2d.drawImage(bitmap, 0, 0);
      const imageData = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
      const jsQR = (await import("jsqr")).default;
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        await doCheckin(code.data);
      } else {
        setError("QR tidak terdeteksi. Coba foto lebih dekat & pencahayaan cukup.");
        playBeep(false);
      }
    } catch (err) {
      setError("Gagal memproses gambar: " + String(err));
    }
    setProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualToken.trim()) return;
    await doCheckin(manualToken.trim());
    setManualToken("");
  }

  useEffect(() => {
    if (mode !== "camera" || !scanning) return;
    let scanner: { clear: () => Promise<void> } | null = null;
    import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
      const s = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 }, false);
      s.render((text: string) => doCheckin(text), () => {});
      scanner = s;
      scannerRef.current = s;
    }).catch(() => setError("Gagal memuat library kamera."));
    return () => { scanner?.clear().catch(() => {}); };
  }, [mode, scanning, doCheckin]);

  function stopCamera() {
    scannerRef.current?.clear().catch(() => {});
    scannerRef.current = null;
    setScanning(false);
    setResult(null);
    setLastToken("");
  }

  function switchMode(m: Mode) {
    stopCamera();
    setMode(m);
    setResult(null);
    setError("");
  }

  const tabs: { id: Mode; label: string; icon: string }[] = [
    { id: "upload", label: "Upload Foto", icon: "add_a_photo" },
    { id: "manual", label: "Input Token", icon: "keyboard" },
    { id: "camera", label: "Kamera Live", icon: "videocam" },
  ];

  return (
    <RoleGate feature="scanner">
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">QR Scanner</h1>
        <p className="text-sm text-slate-500 mt-1">Check-in tamu dengan scan QR Code tiket mereka.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchMode(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition ${
                mode === tab.id
                  ? "bg-[#13c8ec]/10 text-[#13c8ec] border-b-2 border-[#13c8ec]"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined text-xl leading-none">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {mode === "upload" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Foto QR tiket tamu lalu upload di sini. Bekerja tanpa HTTPS maupun kamera realtime.</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="qr-file-input" />
              <label
                htmlFor="qr-file-input"
                className={`w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-14 cursor-pointer transition ${
                  processing ? "border-slate-200 bg-slate-50 cursor-wait" : "border-[#13c8ec]/40 hover:border-[#13c8ec] hover:bg-[#13c8ec]/5"
                }`}
              >
                {processing ? (
                  <>
                    <span className="material-symbols-outlined text-5xl text-slate-300 animate-spin">refresh</span>
                    <span className="text-sm font-semibold text-slate-400">Memproses gambar</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-5xl text-[#13c8ec]/60">add_a_photo</span>
                    <span className="text-sm font-semibold text-slate-600">Klik untuk ambil foto / pilih gambar</span>
                    <span className="text-xs text-slate-400">JPG, PNG, WEBP  Pastikan QR terlihat jelas</span>
                  </>
                )}
              </label>
            </div>
          )}

          {mode === "manual" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Masukkan token UUID tamu atau paste URL undangan.</p>
              <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Token UUID atau URL undangan tamu"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/40"
                />
                <button
                  type="submit"
                  disabled={!manualToken.trim() || processing}
                  className="inline-flex items-center justify-center gap-2 bg-[#13c8ec] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#0fb3d4] disabled:opacity-50 transition"
                >
                  {processing ? (
                    <span className="material-symbols-outlined text-base leading-none animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-base leading-none">how_to_reg</span>
                  )}
                  {processing ? "Memproses" : "Check-In Tamu"}
                </button>
              </form>
            </div>
          )}

          {mode === "camera" && (
            <div className="space-y-4">
              {!isSecureCtx && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                  <span className="material-symbols-outlined text-lg leading-none shrink-0 mt-0.5">warning</span>
                  <div>
                    <p className="font-semibold">Kamera mungkin tidak tersedia</p>
                    <p className="text-xs mt-0.5">Browser memblokir kamera di koneksi non-HTTPS (IP address). Gunakan tab <strong>Upload Foto</strong> sebagai alternatif.</p>
                  </div>
                </div>
              )}
              {!scanning ? (
                <button onClick={() => setScanning(true)} className="w-full inline-flex items-center justify-center gap-2 bg-[#13c8ec] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#0fb3d4] transition">
                  <span className="material-symbols-outlined text-base leading-none">videocam</span>
                  Aktifkan Kamera
                </button>
              ) : (
                <>
                  <button onClick={stopCamera} className="w-full inline-flex items-center justify-center gap-2 bg-rose-100 text-rose-600 font-semibold text-sm py-2 rounded-xl hover:bg-rose-200 transition">
                    <span className="material-symbols-outlined text-base leading-none">stop_circle</span>
                    Stop Kamera
                  </button>
                  <div id="qr-reader" className="w-full rounded-xl overflow-hidden" />
                </>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl p-3">
              <span className="material-symbols-outlined text-base leading-none shrink-0 mt-0.5">error</span>
              {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className={`rounded-2xl border p-5 flex items-start gap-4 ${result.success ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
          <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${result.success ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"}`}>
            <span className="material-symbols-outlined text-2xl leading-none">{result.success ? "how_to_reg" : "cancel"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-lg leading-tight ${result.success ? "text-emerald-700" : "text-rose-600"}`}>
              {result.success ? "Check-In Berhasil!" : "Check-In Gagal"}
            </p>
            <p className="font-semibold text-slate-800 mt-1">{result.name}</p>
            <p className={`text-sm mt-0.5 ${result.success ? "text-emerald-600" : "text-rose-500"}`}>{result.message}</p>
            <p className="text-xs text-slate-400 mt-1 truncate">Token: {result.token}</p>
          </div>
        </div>
      )}
    </div>
    </RoleGate>
  );
}
