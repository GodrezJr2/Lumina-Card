"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RoleGate } from "@/components/RoleGate";
import { normalizeImageUrl } from "@/lib/image-utils";

// Map catalog templateId → internal template id (editor template)
const CATALOG_TO_EDITOR: Record<string, string> = {
  "ethereal-garden":  "ethereal",
  "royal-gold":       "royal",
  "corporate-modern": "corporate",
  "cyber-tech":       "neon",
  // legacy IDs (backward compatibility)
  "golden-elegance":  "ethereal",
  "noir-luxe":        "royal",
  "modern-summit":    "corporate",
  "tech-forward":     "corporate",
  "confetti-blast":   "ethereal",
  "little-cloud":     "ethereal",
  "sacred-gold":      "royal",
  "neon-nights":      "ethereal",
};

const TEMPLATES = [
  {
    id: "ethereal",
    name: "Ethereal Garden",
    desc: "Elegan, floral, romantis — cocok untuk pernikahan outdoor taman",
    color: "from-green-50 to-emerald-100",
    accent: "text-emerald-600",
    border: "border-emerald-300",
    icon: "local_florist",
    preview: "🌸",
  },
  {
    id: "royal",
    name: "Royal Gold",
    desc: "Mewah, gelap, bernuansa emas — cocok untuk resepsi formal dan elegan",
    color: "from-slate-800 to-slate-900",
    accent: "text-yellow-400",
    border: "border-yellow-400",
    icon: "diamond",
    preview: "👑",
    dark: true,
  },
  {
    id: "corporate",
    name: "Modern Corporate",
    desc: "Bersih, profesional, modern — cocok untuk event bisnis atau seminar",
    color: "from-blue-50 to-indigo-100",
    accent: "text-indigo-600",
    border: "border-indigo-300",
    icon: "rocket_launch",
    preview: "🚀",
  },
  {
    id: "neon",
    name: "Neon Nexus",
    desc: "Futuristik, dark, berkilau neon — cocok untuk event tech atau pernikahan modern",
    color: "from-[#0B132B] to-slate-800",
    accent: "text-[#ecc813]",
    border: "border-[#ecc813]",
    icon: "bolt",
    preview: "⚡",
    dark: true,
  },
];

interface EventData {
  id: number;
  name: string;
  date: string;
  location: string;
  template: string;
  coupleNames: string | null;
  story: string | null;
  venueAddress: string | null;
  gallery: string | null;
  musicUrl: string | null;
  slugUrl: string | null;
}

export default function TemplatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Template lock state
  const [lockedTemplateId, setLockedTemplateId] = useState<string | null>(null);
  const [freeAccess, setFreeAccess] = useState(false);

  // Form fields
  const [selectedTemplate, setSelectedTemplate] = useState("ethereal");
  const [coupleNames, setCoupleNames] = useState("");
  const [story, setStory] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [gallery, setGallery] = useState<string[]>(["", "", "", ""]);
  const [musicUrl, setMusicUrl] = useState("");

  // Link publik
  const [slugUrl, setSlugUrl] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch event data
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((d) => {
        const ev = d.event;
        setEvent(ev);
        setSelectedTemplate(ev.template || "ethereal");
        setCoupleNames(ev.coupleNames || "");
        setStory(ev.story || "");
        setVenueAddress(ev.venueAddress || "");
        setMusicUrl(ev.musicUrl || "");
        setSlugUrl(ev.slugUrl ?? null);
        if (ev.gallery) {
          try {
            const arr = JSON.parse(ev.gallery);
            const padded = [...arr, "", "", "", ""].slice(0, 4);
            setGallery(padded);
          } catch {
            setGallery(["", "", "", ""]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch locked template info
    fetch("/api/catalog/purchase")
      .then((r) => r.json())
      .then((d) => {
        setLockedTemplateId(d.lockedTemplateId ?? null);
        setFreeAccess(d.freeAccess ?? false);
      })
      .catch(() => {});
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const cleanGallery = gallery.filter((g) => g.trim() !== "");
    const r = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: selectedTemplate,
        coupleNames,
        story,
        venueAddress,
        gallery: cleanGallery,
        musicUrl: musicUrl.trim() || null,
      }),
    });
    setSaving(false);
    if (r.ok) {
      const data = await r.json();
      // Update slug URL dari response (muncul setelah nama pasangan diisi)
      if (data.event?.slugUrl) setSlugUrl(data.event.slugUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  function copyPublicLink() {
    const url = `${window.location.origin}/i/${slugUrl}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2500);
      });
    } else {
      // Fallback
      if (linkInputRef.current) {
        linkInputRef.current.select();
        document.execCommand("copy");
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2500);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin size-8 border-4 border-[#13c8ec] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <RoleGate feature="templateEditor">
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/events" className="hover:text-[#13c8ec] transition">Events</Link>
            <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
            <span className="text-slate-700 font-medium">{event?.name}</span>
            <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
            <span className="text-[#13c8ec] font-medium">Template</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Pilih & Kustomisasi Template</h1>
          <p className="text-sm text-slate-500 mt-1">Tampilan undangan yang akan dilihat tamu saat membuka link.</p>
        </div>
        <div className="flex gap-3">
          <a
            href={`/inv/preview/${id}`}
            target="_blank"
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            <span className="material-symbols-outlined text-base leading-none">open_in_new</span>
            Preview
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#13c8ec] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0fb3d4] transition disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base leading-none">
              {saved ? "check_circle" : saving ? "hourglass_empty" : "save"}
            </span>
            {saved ? "Tersimpan!" : saving ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#13c8ec]">palette</span>
          Pilih Template
        </h2>
        {/* Lock info banner */}
        {!freeAccess && lockedTemplateId && (
          <div className="mb-4 mt-2 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            <span className="material-symbols-outlined text-amber-500 text-base shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <span>
              Kamu hanya bisa menggunakan template yang sudah dibeli.
              Ingin bebas pakai semua template?{" "}
              <Link href="/pricing" className="font-bold underline">Upgrade ke Full Service</Link>.
            </span>
          </div>
        )}
        {!freeAccess && !lockedTemplateId && (
          <div className="mb-4 mt-2 flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
            <span className="material-symbols-outlined text-blue-500 text-base shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <span>
              Beli template dari <Link href="/catalog" className="font-bold underline">katalog</Link> untuk menggunakan template pilihan, 
              atau <Link href="/pricing" className="font-bold underline">upgrade ke Full Service</Link> untuk akses semua template.
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => {
            // Determine if this template is accessible
            const allowedEditorId = lockedTemplateId ? CATALOG_TO_EDITOR[lockedTemplateId] : null;
            const isLocked = !freeAccess && lockedTemplateId !== null && allowedEditorId !== t.id;
            const isAccessible = freeAccess || !lockedTemplateId || allowedEditorId === t.id;

            return (
            <button
              key={t.id}
              onClick={() => isAccessible && setSelectedTemplate(t.id)}
              disabled={isLocked}
              title={isLocked ? "Template tidak tersedia. Beli template ini dari katalog atau upgrade paket." : t.name}
              className={`relative rounded-2xl p-5 text-left transition-all border-2 ${
                isLocked
                  ? "border-slate-200 opacity-50 cursor-not-allowed grayscale"
                  : selectedTemplate === t.id
                  ? `${t.border} shadow-lg scale-[1.02]`
                  : "border-transparent hover:border-slate-200"
              } bg-gradient-to-br ${t.color}`}
            >
              {selectedTemplate === t.id && isAccessible && (
                <div className="absolute top-3 right-3 size-6 bg-[#13c8ec] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm leading-none">check</span>
                </div>
              )}
              {isLocked && (
                <div className="absolute top-3 right-3 size-6 bg-slate-400 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm leading-none">lock</span>
                </div>
              )}
              <div className="text-3xl mb-3">{t.preview}</div>
              <h3 className={`font-bold text-sm mb-1 ${t.dark ? "text-white" : "text-slate-800"}`}>{t.name}</h3>
              <p className={`text-xs leading-relaxed ${t.dark ? "text-slate-300" : "text-slate-500"}`}>{t.desc}</p>
              {isLocked && (
                <Link
                  href="/catalog"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#13c8ec] transition underline"
                >
                  Beli di katalog
                </Link>
              )}
            </button>
            );
          })}
        </div>
      </div>

      {/* Content Customization */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#13c8ec]">edit_note</span>
          Kustomisasi Konten
        </h2>

        {/* Couple Names */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Nama Pasangan
            <span className="ml-1 text-xs text-slate-400 font-normal">(ditampilkan sebagai judul utama)</span>
          </label>
          <input
            type="text"
            value={coupleNames}
            onChange={(e) => setCoupleNames(e.target.value)}
            placeholder='Contoh: "Rian &amp; Dewi" atau "Sarah &amp; James"'
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec]"
          />
        </div>

        {/* Story */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Cerita / Deskripsi
            <span className="ml-1 text-xs text-slate-400 font-normal">(cerita singkat tentang pasangan atau acara)</span>
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={4}
            placeholder="Tuliskan cerita singkat tentang pasangan, atau deskripsi acara..."
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec] resize-none"
          />
        </div>

        {/* Venue Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Alamat Lengkap Venue
            <span className="ml-1 text-xs text-slate-400 font-normal">(akan ditampilkan di detail lokasi)</span>
          </label>
          <input
            type="text"
            value={venueAddress}
            onChange={(e) => setVenueAddress(e.target.value)}
            placeholder="Contoh: Jl. Sudirman No. 10, Jakarta Pusat, DKI Jakarta 10220"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec]"
          />
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#13c8ec]">photo_library</span>
          Galeri Foto
        </h2>
        <p className="text-xs text-slate-400 mb-2">Masukkan URL gambar (bisa dari Google Drive, Imgur, Cloudinary, dll). Kosongkan jika tidak ingin menampilkan.</p>
        <div className="mb-5 flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2.5 text-xs text-blue-700">
          <span className="material-symbols-outlined text-blue-400 text-base shrink-0 mt-0.5">tips_and_updates</span>
          <span>
            <strong>Google Drive:</strong> Buka file → klik kanan → <em>Dapatkan link</em> → ubah akses ke <strong>Siapa saja yang memiliki link</strong> → tempel URL-nya di sini. URL akan otomatis dikonversi.
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gallery.map((url, idx) => {
            const previewUrl = normalizeImageUrl(url);
            return (
            <div key={idx} className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Foto {idx + 1}</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    const next = [...gallery];
                    next[idx] = e.target.value;
                    setGallery(next);
                  }}
                  placeholder="https://..."
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec]"
                />
                {url && (
                  <button
                    onClick={() => {
                      const next = [...gallery];
                      next[idx] = "";
                      setGallery(next);
                    }}
                    className="shrink-0 size-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition"
                  >
                    <span className="material-symbols-outlined text-base leading-none">close</span>
                  </button>
                )}
              </div>
              {url && (
                <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".img-error-msg")) {
                        const msg = document.createElement("div");
                        msg.className = "img-error-msg absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400";
                        msg.innerHTML = `<span class="material-symbols-outlined text-2xl">broken_image</span><span class="text-xs">Gambar tidak dapat dimuat.<br/>Pastikan akses Google Drive sudah publik.</span>`;
                        parent.appendChild(msg);
                      }
                    }}
                  />
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Music */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#13c8ec]">music_note</span>
          Musik Latar Belakang
        </h2>
        <p className="text-xs text-slate-400 mb-3">
          Musik akan diputar otomatis saat tamu membuka undangan. Mendukung YouTube, SoundCloud, atau link MP3 langsung.
        </p>
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3 py-2.5 text-xs text-blue-700">
          <span className="material-symbols-outlined text-blue-400 text-base shrink-0 mt-0.5">tips_and_updates</span>
          <div className="space-y-1">
            <p><strong>YouTube:</strong> Tempel URL video YouTube biasa, contoh: <code className="bg-blue-100 px-1 rounded">https://www.youtube.com/watch?v=xxxxx</code></p>
            <p><strong>MP3 langsung:</strong> URL file .mp3 yang bisa diakses publik, contoh dari Google Drive atau Dropbox.</p>
            <p><strong>Kosongkan</strong> jika tidak ingin ada musik.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            value={musicUrl}
            onChange={(e) => setMusicUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... atau https://link-ke-file.mp3"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#13c8ec]/30 focus:border-[#13c8ec]"
          />
          {musicUrl && (
            <button
              onClick={() => setMusicUrl("")}
              className="shrink-0 size-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition"
              title="Hapus musik"
            >
              <span className="material-symbols-outlined text-base leading-none">close</span>
            </button>
          )}
        </div>
        {musicUrl && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="material-symbols-outlined text-base leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Musik aktif — akan diputar saat tamu membuka undangan.
          </p>
        )}
      </div>

      {/* Link Undangan Publik */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#13c8ec]">link</span>
          Link Undangan Publik
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Link bersih berbasis nama pasangan — bisa dibagikan ke siapa saja tanpa token.
          Link akan otomatis terbuat setelah kamu mengisi <strong>Nama Pasangan</strong> dan menekan Simpan.
        </p>

        {slugUrl ? (
          <div className="space-y-3">
            {/* Link display */}
            <div className="flex gap-2 items-center">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                <span className="material-symbols-outlined text-[#13c8ec] text-base leading-none shrink-0">public</span>
                <input
                  ref={linkInputRef}
                  type="text"
                  readOnly
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/i/${slugUrl}`}
                  className="flex-1 bg-transparent text-sm text-slate-700 font-mono outline-none select-all cursor-pointer"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
              <button
                onClick={copyPublicLink}
                className={`shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl transition ${
                  linkCopied
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-[#13c8ec]/10 text-[#13c8ec] border border-[#13c8ec]/20 hover:bg-[#13c8ec]/20"
                }`}
              >
                <span className="material-symbols-outlined text-base leading-none">
                  {linkCopied ? "check_circle" : "content_copy"}
                </span>
                {linkCopied ? "Tersalin!" : "Salin"}
              </button>
              <a
                href={`/i/${slugUrl}`}
                target="_blank"
                className="shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                <span className="material-symbols-outlined text-base leading-none">open_in_new</span>
                Buka
              </a>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-slate-400 text-sm leading-none">info</span>
              Link ini bisa dibagikan ke semua tamu sekaligus (grup WA, story, dll). Tidak ada tracking individual.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3.5">
            <span className="material-symbols-outlined text-amber-500 text-xl shrink-0 mt-0.5">pending</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Link belum tersedia</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Isi <strong>Nama Pasangan</strong> di bagian Kustomisasi Konten, lalu klik <strong>Simpan Perubahan</strong>.
                Link akan otomatis dibuat berdasarkan nama kalian.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RSVP Info */}
      <div className="bg-[#13c8ec]/5 border border-[#13c8ec]/20 rounded-2xl p-5 flex gap-4">
        <span className="material-symbols-outlined text-[#13c8ec] text-2xl shrink-0 mt-0.5">info</span>
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-1">RSVP sudah aktif secara otomatis</p>
          <p className="text-sm text-slate-600">
            Setiap template sudah dilengkapi tombol RSVP. Tamu bisa mengisi konfirmasi kehadiran dan pesan langsung dari halaman undangan mereka.
            Hasilnya bisa dilihat di halaman <Link href="/admin/guests" className="text-[#13c8ec] font-semibold hover:underline">Guest List</Link>.
          </p>
        </div>
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#13c8ec] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#0fb3d4] transition text-sm disabled:opacity-60 shadow-lg shadow-[#13c8ec]/20"
        >
          <span className="material-symbols-outlined text-base leading-none">
            {saved ? "check_circle" : "save"}
          </span>
          {saved ? "Tersimpan!" : saving ? "Menyimpan…" : "Simpan Perubahan"}
        </button>
      </div>
    </div>
    </RoleGate>
  );
}
