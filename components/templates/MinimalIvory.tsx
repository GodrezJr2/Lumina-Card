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
 * MinimalIvory — clean editorial wedding template.
 * Ivory background, serif accents, generous whitespace, mosaic gallery.
 * Mobile-first: single column under md, 2-col on md+.
 */
export function MinimalIvoryTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(64);

  const cleanGallery = gallery.filter(Boolean);
  const heroImg = cleanGallery[0] ?? "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
  const portraitImg = cleanGallery[1] ?? "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80";

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden"
      style={{
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        background: "#FBF8F3",
        color: "#2A2520",
      }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky z-40 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 bg-[#FBF8F3]/85 backdrop-blur-md border-b border-[#E8DDC9]/60"
        style={{ top: "var(--preview-bar-height, 0px)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="size-8 rounded-full bg-[#C9A96E]/15 flex items-center justify-center text-[#8C7148]">
            <span className="material-symbols-outlined text-[18px] leading-none">favorite</span>
          </span>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight" style={{ letterSpacing: "0.02em" }}>
            {coupleNames || eventName}
          </h2>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="h-10 px-5 sm:px-6 rounded-full bg-[#2A2520] text-[#FBF8F3] text-xs sm:text-sm font-semibold tracking-widest uppercase hover:bg-[#1A1612] transition-all"
          style={{ letterSpacing: "0.15em" }}
        >
          RSVP
        </button>
      </header>

      {/* ── HERO — full bleed editorial ── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-5 sm:px-8 py-16 overflow-hidden">
        <ParallaxDiv className="absolute inset-0 z-0" speedFactor={0.35}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url('${heroImg}')` }}
          >
            <div className="absolute inset-0 bg-[#FBF8F3]/72" />
          </motion.div>
        </ParallaxDiv>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-3xl mx-auto text-center space-y-7"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block text-[10px] sm:text-xs font-bold uppercase text-[#8C7148]"
            style={{ letterSpacing: "0.4em" }}
          >
            ── The Wedding Of ──
          </motion.span>

          <h1
            className="text-5xl sm:text-7xl md:text-8xl italic font-light leading-[1.05]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif", color: "#2A2520" }}
          >
            <SplitText text={coupleNames || eventName} staggerDelay={0.12} y={60} />
          </h1>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 text-[#8C7148]">
            <span className="h-px w-10 bg-[#C9A96E]" />
            <span className="material-symbols-outlined text-xl">spa</span>
            <span className="h-px w-10 bg-[#C9A96E]" />
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2 pt-2">
            <p className="text-sm sm:text-base font-medium tracking-wider" style={{ letterSpacing: "0.25em" }}>
              KEPADA YTH.
            </p>
            <p className="text-2xl sm:text-3xl font-semibold italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              {guestName}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4 text-sm sm:text-base">
            <span className="flex items-center gap-2 text-[#2A2520]/80">
              <span className="material-symbols-outlined text-[#C9A96E] text-lg">calendar_month</span>
              {dateStr}
            </span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#C9A96E]" />
            <span className="flex items-center gap-2 text-[#2A2520]/80">
              <span className="material-symbols-outlined text-[#C9A96E] text-lg">schedule</span>
              {timeStr}
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 pt-6">
            <button
              onClick={() => setRsvpOpen(true)}
              className="group inline-flex items-center gap-3 px-8 py-3.5 bg-[#2A2520] text-[#FBF8F3] rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#C9A96E] hover:text-[#FBF8F3] transition-all duration-300 shadow-xl"
              style={{ letterSpacing: "0.18em" }}
            >
              <span className="material-symbols-outlined text-base leading-none">favorite</span>
              Konfirmasi Kehadiran
            </button>
            <Link href={`/inv/${token}/qr`} className="text-xs text-[#8C7148] hover:text-[#2A2520] flex items-center gap-1.5 transition">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              Lihat QR Tiket
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="flex items-center justify-center gap-4 py-10 text-[#C9A96E]">
        <span className="h-px w-16 sm:w-24 bg-[#C9A96E]/40" />
        <span className="material-symbols-outlined">eco</span>
        <span className="h-px w-16 sm:w-24 bg-[#C9A96E]/40" />
      </div>

      {/* ── STORY + DETAILS ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <ClipReveal className="aspect-[3/4] rounded-sm shadow-2xl shadow-[#2A2520]/10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portraitImg} alt="Pasangan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </ClipReveal>

        <FloatIn className="space-y-6 text-center md:text-left" staggerDelay={0.12}>
          <span className="text-xs font-bold tracking-widest text-[#8C7148] uppercase" style={{ letterSpacing: "0.3em" }}>
            ─── Cerita Kami
          </span>
          <h2 className="text-4xl sm:text-5xl italic font-light text-[#2A2520]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dengan Penuh Sukacita
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#2A2520]/80 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {story || `Kami mengundang ${guestName} untuk hadir dan turut berbahagia dalam hari paling istimewa kami.`}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="border-l-2 border-[#C9A96E] pl-4 text-left">
              <span className="material-symbols-outlined text-[#C9A96E] text-2xl mb-1">place</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#8C7148]" style={{ letterSpacing: "0.2em" }}>
                Venue
              </h3>
              <p className="text-sm font-semibold text-[#2A2520] mt-1">{location}</p>
              {venueAddress && <p className="text-xs text-[#2A2520]/60 mt-1 leading-relaxed">{venueAddress}</p>}
            </div>
            <div className="border-l-2 border-[#C9A96E] pl-4 text-left">
              <span className="material-symbols-outlined text-[#C9A96E] text-2xl mb-1">event</span>
              <h3 className="text-xs font-bold tracking-widest uppercase text-[#8C7148]" style={{ letterSpacing: "0.2em" }}>
                Tanggal
              </h3>
              <p className="text-sm font-semibold text-[#2A2520] mt-1">{dateStr}</p>
              <p className="text-xs text-[#2A2520]/60 mt-1">{timeStr}</p>
            </div>
          </div>
        </FloatIn>
      </section>

      {/* ── GALLERY MOSAIC ── */}
      {cleanGallery.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <FloatIn className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-[#8C7148] uppercase" style={{ letterSpacing: "0.3em" }}>
              ─── Momen ───
            </span>
            <h2 className="text-4xl sm:text-5xl italic font-light text-[#2A2520] mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Galeri Cinta
            </h2>
          </FloatIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {cleanGallery.map((url, i) => {
              // Asymmetric mosaic: every 5th tall, every 7th wide
              const span = i % 5 === 0 ? "row-span-2 aspect-[3/5]" : i % 7 === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square";
              return (
                <ClipReveal key={i} className={`${span} rounded-sm shadow-md overflow-hidden`} delay={i * 0.05}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </ClipReveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ── FOOTER QUOTE ── */}
      <footer className="border-t border-[#E8DDC9]/60 py-14 px-6 text-center bg-[#F4EDE0]/40">
        <span className="material-symbols-outlined text-[#C9A96E] text-3xl">format_quote</span>
        <p className="max-w-xl mx-auto mt-4 text-lg sm:text-xl italic text-[#2A2520]/85 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
          &ldquo;Cinta adalah ketika dua jiwa menemukan ritme yang sama dan menari bersama selamanya.&rdquo;
        </p>
        <h3 className="text-3xl sm:text-4xl italic font-light mt-8 text-[#2A2520]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {coupleNames || eventName}
        </h3>
        <p className="text-xs tracking-widest text-[#8C7148] mt-2 uppercase" style={{ letterSpacing: "0.3em" }}>
          {dateStr}
        </p>
        <button
          onClick={() => setRsvpOpen(true)}
          className="mt-8 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2A2520] text-[#FBF8F3] text-xs font-bold tracking-widest uppercase hover:bg-[#C9A96E] transition"
          style={{ letterSpacing: "0.18em" }}
        >
          <span className="material-symbols-outlined text-base leading-none">favorite</span>
          RSVP
        </button>
        <p className="mt-10 text-xs text-[#8C7148]/70">
          Dibuat dengan ❤️ oleh <a href="/" className="font-semibold hover:text-[#2A2520]">LuminaCard</a>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-[#2A2520] hover:bg-[#1A1612] shadow-stone-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#C9A96E" />}
    </div>
  );
}
