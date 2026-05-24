"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  stagger, fadeUp, fadeIn,
  SplitText, FloatIn, ClipReveal, ParallaxDiv,
  RSVPModal, useSmoothScrollInit, type InvitationProps,
} from "./shared";
import MusicPlayer from "../MusicPlayer";

/**
 * TerraCotta — Indonesian cultural wedding/wisuda template.
 * Maroon + ivory + emerald accent. Cormorant Infant + Familjen Grotesk.
 * Animated SVG batik motif, archive-style numbered sections.
 */

function BatikDivider() {
  return (
    <svg viewBox="0 0 1200 60" className="w-full h-12" preserveAspectRatio="none" aria-hidden="true">
      <motion.g
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        viewport={{ once: true }}
        stroke="#5C1F1F"
        strokeWidth="1"
        fill="none"
      >
        {[...Array(20)].map((_, i) => (
          <g key={i} transform={`translate(${i * 60}, 30)`}>
            <circle r="14" />
            <circle r="8" />
            <path d="M-14 0 Q0 -14 14 0 Q0 14 -14 0 Z" />
          </g>
        ))}
      </motion.g>
    </svg>
  );
}

export function TerraCottaTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(64);

  const cleanGallery = gallery.filter(Boolean);
  const heroImg = cleanGallery[0] ?? "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80";
  const portraitImg = cleanGallery[1] ?? "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80";

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden"
      style={{
        fontFamily: "'Familjen Grotesk', 'Inter', sans-serif",
        background: "#F5EDE0",
        color: "#3A0F0F",
      }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky z-40 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 bg-[#F5EDE0]/85 backdrop-blur-md border-b border-[#5C1F1F]/20"
        style={{ top: "var(--preview-bar-height, 0px)" }}
      >
        <div className="flex items-center gap-3">
          <span className="size-9 rounded-full bg-[#5C1F1F] flex items-center justify-center text-[#F5EDE0]">
            <span className="material-symbols-outlined text-[18px] leading-none">temple_hindu</span>
          </span>
          <h2
            className="text-lg sm:text-xl font-semibold tracking-tight italic"
            style={{ fontFamily: "'Cormorant Infant', 'Cormorant Garamond', serif" }}
          >
            {coupleNames || eventName}
          </h2>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="h-10 px-5 sm:px-6 rounded-full bg-[#5C1F1F] text-[#F5EDE0] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase hover:bg-[#1F5C42] transition-all shadow-md"
        >
          RSVP
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-5 sm:px-10 py-16 overflow-hidden">
        <ParallaxDiv className="absolute inset-0 z-0" speedFactor={0.35}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url('${heroImg}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5EDE0]/55 via-[#F5EDE0]/65 to-[#F5EDE0]/90" />
          </motion.div>
        </ParallaxDiv>

        {/* Decorative emerald frame */}
        <div className="absolute inset-x-6 sm:inset-x-12 top-20 sm:top-24 bottom-20 sm:bottom-24 border-2 border-[#1F5C42]/30 z-0" />
        <div className="absolute inset-x-8 sm:inset-x-14 top-22 sm:top-26 bottom-22 sm:bottom-26 border border-[#5C1F1F]/30 z-0" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-3xl mx-auto text-center space-y-7 px-4"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 text-[#5C1F1F]">
            <span className="text-2xl">❦</span>
            <span className="text-xs sm:text-sm tracking-[0.45em] uppercase font-medium">Pernikahan</span>
            <span className="text-2xl">❦</span>
          </motion.div>

          <h1
            className="text-6xl sm:text-8xl md:text-[9rem] leading-[0.9] italic font-medium text-[#3A0F0F]"
            style={{ fontFamily: "'Cormorant Infant', 'Cormorant Garamond', serif" }}
          >
            <SplitText text={coupleNames || eventName} staggerDelay={0.13} y={70} />
          </h1>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 pt-2">
            <span className="h-px w-16 sm:w-24 bg-[#5C1F1F]/40" />
            <span className="material-symbols-outlined text-[#1F5C42]">favorite</span>
            <span className="h-px w-16 sm:w-24 bg-[#5C1F1F]/40" />
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2 pt-2">
            <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-[#5C1F1F]/70">Kepada Yth.</p>
            <p
              className="text-3xl sm:text-4xl italic text-[#3A0F0F]"
              style={{ fontFamily: "'Cormorant Infant', serif" }}
            >
              {guestName}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-0 max-w-md mx-auto border-y-2 border-[#5C1F1F]/30 divide-x divide-[#5C1F1F]/30">
            <div className="px-2 py-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1F5C42] font-bold">Tanggal</p>
              <p className="text-sm font-semibold text-[#3A0F0F] mt-1">{dateStr.split(" ")[0] || dateStr}</p>
            </div>
            <div className="px-2 py-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1F5C42] font-bold">Waktu</p>
              <p className="text-sm font-semibold text-[#3A0F0F] mt-1">{timeStr}</p>
            </div>
            <div className="px-2 py-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1F5C42] font-bold">Tempat</p>
              <p className="text-sm font-semibold text-[#3A0F0F] mt-1 truncate">{(location.split(",")[0] ?? location).slice(0, 14)}</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={() => setRsvpOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#5C1F1F] text-[#F5EDE0] rounded-full text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#1F5C42] hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-[#5C1F1F]/30"
            >
              <span className="material-symbols-outlined text-base leading-none">favorite</span>
              Konfirmasi Kehadiran
            </button>
            <Link href={`/inv/${token}/qr`} className="text-xs text-[#5C1F1F]/70 hover:text-[#1F5C42] flex items-center gap-1.5 tracking-wider transition">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              Lihat QR Tiket
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <BatikDivider />

      {/* ── STORY · CHAPTER I ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-start">
        <div className="md:col-span-1 hidden md:block text-[#5C1F1F]/40 italic" style={{ fontFamily: "'Cormorant Infant', serif", fontSize: "5rem", lineHeight: 1 }}>
          I
        </div>
        <ClipReveal className="md:col-span-5 aspect-[3/4] overflow-hidden border border-[#5C1F1F]/15 shadow-2xl shadow-[#5C1F1F]/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portraitImg} alt="Pasangan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
        </ClipReveal>

        <FloatIn className="md:col-span-6 space-y-5" staggerDelay={0.12}>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#1F5C42] font-bold">─── Bab I · Cerita</span>
          <h2
            className="text-5xl sm:text-6xl italic font-medium leading-[1] text-[#3A0F0F]"
            style={{ fontFamily: "'Cormorant Infant', serif" }}
          >
            Bersatu dalam<br />ikatan suci.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#3A0F0F]/85 italic">
            {story || `Dengan rahmat Tuhan Yang Maha Esa, kami mengundang ${guestName} untuk hadir dan turut memberikan doa restu pada hari pernikahan kami.`}
          </p>
          <div className="flex items-start gap-4 pt-4 border-t border-[#5C1F1F]/20">
            <span className="material-symbols-outlined text-[#1F5C42] text-3xl mt-1">place</span>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#5C1F1F] font-bold">Lokasi Acara</p>
              <p className="text-base sm:text-lg font-semibold mt-1">{location}</p>
              {venueAddress && <p className="text-xs text-[#3A0F0F]/65 mt-1 italic">{venueAddress}</p>}
            </div>
          </div>
        </FloatIn>
      </section>

      <BatikDivider />

      {/* ── GALLERY · CHAPTER II ── */}
      {cleanGallery.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-10 py-16">
          <FloatIn className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#1F5C42] font-bold">─── Bab II · Galeri</span>
              <h2 className="text-5xl sm:text-6xl italic font-medium leading-tight mt-2" style={{ fontFamily: "'Cormorant Infant', serif" }}>
                Momen berharga.
              </h2>
            </div>
            <span className="text-xs tracking-widest text-[#5C1F1F]/50 italic">
              {cleanGallery.length.toString().padStart(2, "0")} kenangan terabadikan
            </span>
          </FloatIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {cleanGallery.map((url, i) => (
              <ClipReveal
                key={i}
                className={`${i === 0 ? "col-span-2 row-span-2 aspect-[4/5]" : "aspect-[3/4]"} overflow-hidden border border-[#5C1F1F]/20 shadow-lg`}
                delay={i * 0.06}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover sepia-[0.15] hover:sepia-0 hover:scale-105 transition-all duration-1000" />
              </ClipReveal>
            ))}
          </div>
        </section>
      )}

      <BatikDivider />

      {/* ── FOOTER ── */}
      <footer className="bg-[#5C1F1F] text-[#F5EDE0] py-16 px-6 text-center relative">
        <div className="absolute inset-x-6 top-6 bottom-6 border border-[#F5EDE0]/15 pointer-events-none" />
        <div className="relative">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#F5EDE0]/70 font-medium">─── Sampai Berjumpa</span>
          <h3
            className="text-5xl sm:text-7xl italic font-medium mt-4 leading-tight"
            style={{ fontFamily: "'Cormorant Infant', serif" }}
          >
            {coupleNames || eventName}
          </h3>
          <p className="text-xs tracking-[0.3em] mt-3 uppercase opacity-80">{dateStr} · {(location.split(",")[0] ?? location)}</p>
          <button
            onClick={() => setRsvpOpen(true)}
            className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#F5EDE0] text-[#5C1F1F] text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#1F5C42] hover:text-[#F5EDE0] transition shadow-xl"
          >
            <span className="material-symbols-outlined text-base leading-none">favorite</span>
            RSVP Sekarang
          </button>
          <p className="mt-12 text-[10px] tracking-widest opacity-60">
            Dirancang dengan ❦ oleh <a href="/" className="font-semibold hover:opacity-100 underline">LuminaCard</a>
          </p>
        </div>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-[#5C1F1F] hover:bg-[#1F5C42] shadow-red-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#5C1F1F" dark />}
    </div>
  );
}
