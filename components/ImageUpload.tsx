"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploadProps {
  /** Current image URL (single mode) or initial gallery URLs (multi mode) */
  value?: string | string[];
  /** Called with new URL(s) after successful upload */
  onChange: (urls: string | string[]) => void;
  /** Cloudinary subfolder (e.g. "events", "events/123") */
  folder?: string;
  /** Allow multiple images? Default false */
  multiple?: boolean;
  /** Max files (only if multiple). Default 8 */
  maxFiles?: number;
  /** Optional CSS class for outer wrapper */
  className?: string;
  /** Aspect ratio for preview. Default "aspect-video" */
  aspectClass?: string;
  /** Show URL text input fallback (paste link). Default true */
  allowUrlPaste?: boolean;
}

/**
 * ImageUpload — drag-drop or click-to-upload image picker.
 * Streams file to /api/upload (Cloudinary) and returns CDN URL.
 *
 * Backward-compat: also supports paste-URL mode for users who already have
 * an external image URL.
 */
export function ImageUpload({
  value,
  onChange,
  folder = "events",
  multiple = false,
  maxFiles = 8,
  className = "",
  aspectClass = "aspect-video",
  allowUrlPaste = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUrls: string[] = multiple
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (typeof value === "string" && value ? [value] : []);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const list = Array.from(files);
    if (list.length === 0) return;

    if (multiple && currentUrls.length + list.length > maxFiles) {
      setError(`Maksimal ${maxFiles} foto.`);
      return;
    }

    setUploading(true);
    setProgress(0);

    const uploaded: UploadedImage[] = [];
    let i = 0;
    for (const file of list) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload gagal");
        uploaded.push({ url: data.url, publicId: data.publicId });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload gagal");
        setUploading(false);
        return;
      }
      i++;
      setProgress(Math.round((i / list.length) * 100));
    }

    if (multiple) {
      onChange([...currentUrls, ...uploaded.map((u) => u.url)]);
    } else if (uploaded[0]) {
      onChange(uploaded[0].url);
    }

    setUploading(false);
    setProgress(0);
  }, [currentUrls, folder, maxFiles, multiple, onChange]);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      uploadFiles(e.target.files);
      e.target.value = ""; // reset so same file can be picked again
    }
  }

  function removeImage(idx: number) {
    if (multiple) {
      const next = currentUrls.filter((_, i) => i !== idx);
      onChange(next);
    } else {
      onChange("");
    }
  }

  function handleUrlPaste() {
    const url = urlInput.trim();
    if (!url) return;
    if (multiple) {
      onChange([...currentUrls, url]);
    } else {
      onChange(url);
    }
    setUrlInput("");
    setShowUrlInput(false);
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* ── Existing previews ── */}
      {currentUrls.length > 0 && (
        <div className={multiple ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" : ""}>
          {currentUrls.map((url, idx) => (
            <div key={`${url}-${idx}`} className={`relative group rounded-xl overflow-hidden bg-slate-100 ${aspectClass}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 size-7 rounded-full bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 flex items-center justify-center"
                title="Hapus"
              >
                <span className="material-symbols-outlined text-base leading-none">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Upload area (only show if not full) ── */}
      {(multiple || currentUrls.length === 0) && (multiple ? currentUrls.length < maxFiles : true) && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative ${aspectClass} border-2 border-dashed rounded-xl transition-all cursor-pointer ${
            uploading
              ? "border-[#13c8ec] bg-[#13c8ec]/5 cursor-wait"
              : dragOver
                ? "border-[#13c8ec] bg-[#13c8ec]/10"
                : "border-slate-300 bg-slate-50 hover:border-[#13c8ec] hover:bg-[#13c8ec]/5"
          }`}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={multiple}
            onChange={handleSelect}
            className="hidden"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
            {uploading ? (
              <>
                <span className="material-symbols-outlined text-4xl text-[#13c8ec] animate-spin">progress_activity</span>
                <p className="text-sm font-semibold text-[#13c8ec]">Mengunggah... {progress}%</p>
                <div className="w-full max-w-[180px] h-1.5 bg-[#13c8ec]/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#13c8ec] transition-all" style={{ width: `${progress}%` }} />
                </div>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-4xl text-slate-400">add_a_photo</span>
                <p className="text-sm font-semibold text-slate-700">
                  {dragOver ? "Lepas untuk upload" : "Tarik foto / klik pilih file"}
                </p>
                <p className="text-xs text-slate-400">
                  JPG, PNG, WEBP, GIF · Max 8MB
                  {multiple && ` · ${currentUrls.length}/${maxFiles}`}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg px-3 py-2 text-xs">
          <span className="material-symbols-outlined text-base leading-none shrink-0 mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* ── URL paste fallback ── */}
      {allowUrlPaste && (
        <div>
          {!showUrlInput ? (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#13c8ec] transition"
            >
              <span className="material-symbols-outlined text-sm leading-none">link</span>
              Atau tempel URL gambar
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://contoh.com/foto.jpg"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30"
              />
              <button
                type="button"
                onClick={handleUrlPaste}
                disabled={!urlInput.trim()}
                className="px-4 py-2 bg-[#13c8ec] text-white rounded-lg text-sm font-semibold hover:bg-[#0fb3d4] disabled:opacity-50 transition"
              >
                Tambah
              </button>
              <button
                type="button"
                onClick={() => { setShowUrlInput(false); setUrlInput(""); }}
                className="px-3 py-2 text-slate-400 text-sm hover:text-slate-600"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
