"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, RSVPModal, useSmoothScrollInit, type InvitationProps } from "./shared";
import MusicPlayer from "../MusicPlayer";

/* ─────────────────────────────────────────────────────────────────────────────
   SAKURA DREAM  — Tema bunga sakura Jepang, animasi kelopak jatuh + fade kanji
   Palet: rose pink + warm ivory + deep mauve
   Animasi: anime.js untuk falling petals canvas + header character reveal
───────────────────────────────────────────────────────────────────────────── */

/** Kelopak sakura yang jatuh di canvas */
function SakuraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let petals: Petal[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Petal {
      x: number; y: number; r: number; speed: number;
      wind: number; rot: number; rotSpeed: number; opacity: number;
      constructor() {
        this.x = Math.random() * (canvas?.width ?? 800);
        this.y = -20;
        this.r = Math.random() * 8 + 4;
        this.speed = Math.random() * 1.5 + 0.8;
        this.wind = (Math.random() - 0.5) * 0.8;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.opacity = Math.random() * 0.6 + 0.3;
      }
      update() {
        this.y += this.speed;
        this.x += this.wind + Math.sin(this.y / 30) * 0.5;
        this.rot += this.rotSpeed;
        if (canvas && this.y > canvas.height + 20) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }
      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rot);
        c.globalAlpha = this.opacity;
        c.beginPath();
        // Simple petal shape using bezier
        c.moveTo(0, 0);
        c.bezierCurveTo(this.r, -this.r, this.r * 2, 0, 0, this.r * 2);
        c.bezierCurveTo(-this.r * 2, 0, -this.r, -this.r, 0, 0);
        c.fillStyle = `hsl(${340 + Math.random() * 20}, 80%, ${75 + Math.random() * 10}%)`;
        c.fill();
        c.restore();
      }
    }

    resize();
    window.addEventListener("resize", resize);

    // Spawn petals
    for (let i = 0; i < 60; i++) {
      const p = new Petal();
      p.y = Math.random() * (canvas.height ?? 600);
      petals.push(p);
    }

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => { p.update(); p.draw(ctx); });
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      petals = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}

/** Animated character-by-character text reveal */
function CharReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function SakuraDreamTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(72);

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden"
      style={{
        fontFamily: "'Noto Serif JP', 'Georgia', serif",
        background: "linear-gradient(180deg, #fff5f7 0%, #fdf2f4 50%, #fff5f7 100%)",
        color: "#3b0a1e",
      }}
    >
      <SakuraCanvas />

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 lg:px-20 bg-rose-50/70 backdrop-blur-md border-b border-rose-200/40">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌸</span>
          <span className="text-lg font-bold text-rose-800" style={{ fontFamily: "'Noto Serif JP', serif" }}>
            {coupleNames || eventName}
          </span>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="flex h-10 items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 px-6 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-all"
        >
          出席確認
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 text-center overflow-hidden">
        {/* Hero bg image */}
        {gallery[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[0]} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-rose-50/85 via-rose-50/60 to-rose-50/95" />
          </motion.div>
        )}

        {/* Decorative circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-[500px] h-[500px] rounded-full border border-rose-300/30 pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-[380px] h-[380px] rounded-full border border-rose-400/20 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-300/50 text-rose-600 text-xs font-bold uppercase tracking-widest"
          >
            🌸 &nbsp; Wedding Invitation &nbsp; 🌸
          </motion.div>

          {/* Big cursive name */}
          <h1
            className="text-5xl md:text-7xl font-bold text-rose-900 leading-tight"
            style={{ fontFamily: "'Great Vibes', cursive", letterSpacing: "0.02em" }}
          >
            <CharReveal text={coupleNames || eventName} delay={0.5} />
          </h1>

          {/* Japanese calligraphy decorative */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-rose-300 text-4xl tracking-widest"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            結婚式
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.7 }}
            className="text-rose-700 text-center space-y-1"
          >
            <p className="text-base font-light">Kepada Yth.</p>
            <p className="text-xl font-bold">{guestName}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.7 }}
            className="flex items-center gap-6 text-rose-600"
          >
            <span className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-rose-400">calendar_month</span>
              <span className="text-sm font-medium">{dateStr}</span>
            </span>
            <span className="text-rose-300 text-2xl">·</span>
            <span className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-rose-400">schedule</span>
              <span className="text-sm font-medium">{timeStr}</span>
            </span>
            <span className="text-rose-300 text-2xl">·</span>
            <span className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-rose-400">location_on</span>
              <span className="text-sm font-medium max-w-[120px] text-center">{location}</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.7 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={() => setRsvpOpen(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-base shadow-xl shadow-rose-200 hover:-translate-y-1 transition-all duration-200"
            >
              <span>🌸</span>
              Konfirmasi Kehadiran
              <span>🌸</span>
            </button>
            <Link href={`/i/${token}/qr`} className="text-sm text-rose-400 hover:text-rose-600 transition flex items-center gap-1">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              Lihat QR Tiket
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STORY ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-24 relative">
        {/* Divider */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent to-rose-300 flex-1" />
          <span className="text-3xl">🌸</span>
          <div className="h-px bg-gradient-to-l from-transparent to-rose-300 flex-1" />
        </div>

        <Reveal>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: "1px solid rgba(244,63,94,0.15)" }}
            >
              {gallery[1] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={gallery[1]} alt="Pasangan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 flex flex-col items-center justify-center gap-4">
                  <span className="text-7xl">🌸</span>
                  <p className="text-rose-400 text-sm font-medium">Foto Kami</p>
                </div>
              )}
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-rose-700 text-xs font-bold shadow-md">
                💕 {coupleNames}
              </div>
            </div>

            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-4xl font-bold text-rose-800" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3rem" }}>
                Cerita Kami
              </h2>
              <p className="text-rose-700/80 leading-relaxed text-base">
                {story || `Dengan penuh rasa syukur dan kebahagiaan, kami mengundang ${guestName} untuk turut hadir merayakan momen sakura dalam hidup kami.`}
              </p>

              {/* Sakura info cards */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: "location_on", label: "Venue", value: location, sub: venueAddress },
                  { icon: "calendar_month", label: "Tanggal", value: dateStr, sub: timeStr },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                    <div className="flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-500 flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rose-400 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-bold text-rose-800">{item.value}</p>
                      {item.sub && <p className="text-xs text-rose-400">{item.sub}</p>}
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
                <h2 className="text-rose-800 mb-2" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "3rem" }}>Galeri</h2>
                <p className="text-rose-400 text-sm">Momen berharga kami 🌸</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.filter(Boolean).map((url, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`overflow-hidden rounded-2xl shadow-lg group ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Countdown-ish closing */}
        <Reveal>
          <div className="text-center py-12 space-y-6">
            <p className="text-rose-300 text-5xl">🌸 🌸 🌸</p>
            <h2 className="text-rose-800 text-2xl font-bold">Kami Menantikan Kehadiran Anda</h2>
            <p className="text-rose-600 max-w-md mx-auto text-sm leading-relaxed">
              Kehadiran Anda adalah mahkota dalam hari bahagia kami. Bersama, mari kita rayakan cinta ini.
            </p>
            <button
              onClick={() => setRsvpOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-base shadow-xl shadow-rose-200 hover:-translate-y-1 transition-all"
            >
              🌸 RSVP Sekarang
            </button>
          </div>
        </Reveal>
      </main>

      <footer className="border-t border-rose-200 bg-rose-50 py-10 text-center relative">
        <p className="text-4xl mb-3" style={{ fontFamily: "'Great Vibes', cursive" }}>
          {coupleNames}
        </p>
        <p className="text-rose-400 text-sm">{dateStr} · {location}</p>
        <p className="mt-6 text-xs text-rose-300">
          Dibuat dengan 🌸 menggunakan <a href="/" className="text-rose-500 font-semibold hover:underline">LuminaCard</a>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-rose-500 hover:bg-rose-600 shadow-rose-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#f43f5e" />}
    </div>
  );
}
