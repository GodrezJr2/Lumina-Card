"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, RSVPModal, useSmoothScrollInit, type InvitationProps } from "./shared";
import MusicPlayer from "../MusicPlayer";

/* ─────────────────────────────────────────────────────────────────────────────
   GOLDEN HOUR  — Warm sunset, floating gold particles, elegant serif
   Palet: amber + warm sand + deep burgundy
   Animasi: anime.js particle dust + scroll parallax header
───────────────────────────────────────────────────────────────────────────── */

/** Gold particle dust canvas using anime.js */
function GoldParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      x: number; y: number; r: number; vx: number; vy: number;
      opacity: number; life: number; maxLife: number;

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 800);
        this.y = Math.random() * (canvas?.height ?? 600);
        this.r = Math.random() * 3 + 1;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.6 + 0.2);
        this.maxLife = Math.random() * 200 + 100;
        this.life = Math.random() * this.maxLife;
        this.opacity = 0;
      }

      update() {
        this.life++;
        this.x += this.vx + Math.sin(this.life / 40) * 0.3;
        this.y += this.vy;

        // Fade in / out
        const halfLife = this.maxLife / 2;
        if (this.life < halfLife) {
          this.opacity = (this.life / halfLife) * 0.8;
        } else {
          this.opacity = ((this.maxLife - this.life) / halfLife) * 0.8;
        }

        if (this.life >= this.maxLife) {
          this.life = 0;
          this.x = Math.random() * (canvas?.width ?? 800);
          this.y = (canvas?.height ?? 600) + 10;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.opacity;
        // Gold shimmer
        const gradient = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 2);
        gradient.addColorStop(0, `rgba(255, 215, 80, 1)`);
        gradient.addColorStop(0.5, `rgba(245, 180, 40, 0.8)`);
        gradient.addColorStop(1, `rgba(200, 120, 10, 0)`);
        c.beginPath();
        c.arc(this.x, this.y, this.r * 2, 0, Math.PI * 2);
        c.fillStyle = gradient;
        c.fill();
        c.restore();
      }
    }

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(ctx); });
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      particles = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen", opacity: 0.6 }}
    />
  );
}

/** Animated number counter */
function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-1 px-4 py-5 rounded-2xl bg-amber-900/30 border border-amber-400/20 backdrop-blur-sm min-w-[70px]"
    >
      <span className="text-3xl font-black text-amber-300">{value}</span>
      <span className="text-xs text-amber-500 uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}

export function GoldenHourTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(72);

  // Parse date for countdown display
  const [countdown, setCountdown] = useState({ d: "—", h: "—", m: "—" });
  useEffect(() => {
    // Try to parse dateStr (e.g. "12 Juni 2026")
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      const diff = parsed.getTime() - Date.now();
      if (diff > 0) {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        setCountdown({ d: String(d), h: String(h), m: String(m) });
      } else {
        setCountdown({ d: "0", h: "0", m: "0" });
      }
    }
  }, [dateStr]);

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden"
      style={{
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        background: "linear-gradient(180deg, #1a0a00 0%, #2d1400 30%, #1a0a00 100%)",
        color: "#fdf3e7",
      }}
    >
      <GoldParticleCanvas />

      {/* ── NAV ── */}
      <header className="sticky z-50 flex items-center justify-between px-6 py-4 lg:px-20 bg-amber-950/80 backdrop-blur-md border-b border-amber-700/20" style={{ top: "var(--preview-bar-height, 0px)" }}>
        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-2xl">✦</span>
          <span className="text-lg font-bold text-amber-100 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {coupleNames || eventName}
          </span>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="flex h-10 items-center justify-center rounded-full px-6 text-sm font-bold text-amber-900 shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)" }}
        >
          RSVP
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-[92vh] px-4 text-center overflow-hidden">
        {/* BG */}
        {gallery[0] ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[0]} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(26,10,0,0.7) 0%, rgba(26,10,0,0.5) 40%, rgba(26,10,0,0.92) 100%)" }} />
          </motion.div>
        ) : (
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.15) 0%, transparent 60%)" }} />
        )}

        <div className="relative z-10 flex flex-col items-center gap-10 max-w-3xl mx-auto">
          {/* Top ornament */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 w-full max-w-xs"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400 text-xl">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-400/60" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-amber-400 text-sm uppercase tracking-[0.3em] font-light"
          >
            The Wedding Of
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold leading-tight"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              background: "linear-gradient(135deg, #fbbf24 0%, #fde68a 40%, #f59e0b 70%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: "drop-shadow(0 0 30px rgba(245,158,11,0.3))",
            }}
          >
            {coupleNames || eventName}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="flex items-center gap-3 w-full max-w-xs"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
            <span className="text-amber-600 text-sm">♦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="text-amber-200 space-y-1"
          >
            <p className="text-base font-light italic">Dengan hormat kami mengundang</p>
            <p className="text-xl font-bold text-amber-300">{guestName}</p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.7 }}
            className="flex gap-3"
          >
            <CountdownUnit value={countdown.d} label="Hari" />
            <CountdownUnit value={countdown.h} label="Jam" />
            <CountdownUnit value={countdown.m} label="Menit" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.7 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={() => setRsvpOpen(true)}
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base text-amber-950 hover:-translate-y-1 transition-all duration-200 shadow-2xl"
              style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)", boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}
            >
              <span>✦</span>
              Konfirmasi Kehadiran
              <span>✦</span>
            </button>
            <Link href={`/i/${token}/qr`} className="text-sm text-amber-500 hover:text-amber-300 transition flex items-center gap-1">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              Lihat QR Tiket
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── BODY ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-24 relative">
        {/* Ornamental divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(251,191,36,0.4))" }} />
          <span className="text-amber-400 text-2xl">✦ ✦ ✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(251,191,36,0.4))" }} />
        </div>

        {/* Story */}
        <Reveal>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div
                className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: "1px solid rgba(251,191,36,0.2)" }}
              >
                {gallery[1] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={gallery[1]} alt="Pasangan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #78350f, #92400e)" }}>
                    <span className="text-amber-400 text-8xl">✦</span>
                  </div>
                )}
              </div>
              {/* Gold corner ornaments */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-amber-400/50 rounded-tl" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-amber-400/50 rounded-tr" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-amber-400/50 rounded-bl" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-amber-400/50 rounded-br" />
            </div>

            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-amber-400" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3rem" }}>
                Our Story
              </h2>
              <p className="text-amber-200/80 leading-relaxed">
                {story || `Dengan penuh rasa syukur, kami mengundang ${guestName} untuk hadir dalam momen emas kehidupan kami.`}
              </p>

              <div className="space-y-3">
                {[
                  { icon: "location_on", label: "Venue", value: location, sub: venueAddress },
                  { icon: "calendar_month", label: "Tanggal", value: dateStr, sub: timeStr },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}
                  >
                    <div className="flex size-10 items-center justify-center rounded-full flex-shrink-0" style={{ background: "rgba(251,191,36,0.15)" }}>
                      <span className="material-symbols-outlined text-amber-400 text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-500 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-bold text-amber-200">{item.value}</p>
                      {item.sub && <p className="text-xs text-amber-500/70">{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Gallery */}
        {gallery.filter(Boolean).length > 0 && (
          <Reveal>
            <section>
              <div className="text-center mb-10">
                <h2 className="text-amber-400 mb-2" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3rem" }}>Galeri</h2>
                <p className="text-amber-600 text-sm">✦ Momen berharga kami ✦</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.filter(Boolean).map((url, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={`overflow-hidden rounded-xl group relative ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
                    style={{ border: "1px solid rgba(251,191,36,0.15)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {/* Gold shimmer overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.1), transparent)" }} />
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Closing */}
        <Reveal>
          <div className="text-center py-12 space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(251,191,36,0.4))" }} />
              <span className="text-amber-400">✦</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(251,191,36,0.4))" }} />
            </div>
            <p className="text-amber-200 max-w-lg mx-auto leading-relaxed italic">
              &ldquo;Kehadiran Anda menjadi cahaya emas yang melengkapi hari istimewa kami.&rdquo;
            </p>
            <button
              onClick={() => setRsvpOpen(true)}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base text-amber-950 hover:-translate-y-1 transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)", boxShadow: "0 0 30px rgba(245,158,11,0.3)" }}
            >
              ✦ RSVP Sekarang
            </button>
          </div>
        </Reveal>
      </main>

      <footer className="py-10 text-center relative" style={{ borderTop: "1px solid rgba(251,191,36,0.15)", background: "rgba(26,10,0,0.6)" }}>
        <p className="text-amber-400 text-2xl mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
          {coupleNames}
        </p>
        <p className="text-amber-600 text-sm">{dateStr} · {location}</p>
        <p className="mt-6 text-xs text-amber-800">
          Dibuat dengan ✦ menggunakan <a href="/" className="text-amber-500 font-semibold hover:underline">LuminaCard</a>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-amber-500 hover:bg-amber-400 text-amber-950" dark />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#f59e0b" dark />}
    </div>
  );
}
