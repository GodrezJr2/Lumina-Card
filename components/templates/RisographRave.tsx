"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  stagger, fadeUp, fadeIn,
  SplitText, FloatIn, ClipReveal, Marquee,
  RSVPModal, useSmoothScrollInit, type InvitationProps,
} from "./shared";
import MusicPlayer from "../MusicPlayer";

/**
 * RisographRave — duotone print/risograph aesthetic for birthday/party.
 * Cyan + Magenta on cream paper, halftone overlay, tape-rotated photos.
 * Bricolage Grotesque display + JetBrains Mono.
 */
export function RisographRaveTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(64);

  const cleanGallery = gallery.filter(Boolean);
  const heroImg = cleanGallery[0] ?? "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80";

  // Halftone background (CSS pattern)
  const halftone = {
    backgroundImage: "radial-gradient(#FF2D87 1px, transparent 1.2px), radial-gradient(#00D5E8 1px, transparent 1.2px)",
    backgroundSize: "16px 16px, 16px 16px",
    backgroundPosition: "0 0, 8px 8px",
  };

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden relative"
      style={{
        fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif",
        background: "#F5F0E8",
        color: "#1A1A2E",
      }}
    >
      {/* Halftone overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.08] z-0" style={halftone} />

      {/* ── HEADER ── */}
      <header
        className="sticky z-40 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 bg-[#F5F0E8]/85 backdrop-blur-md border-b-2 border-[#1A1A2E]"
        style={{ top: "var(--preview-bar-height, 0px)" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative size-9">
            <div className="absolute inset-0 bg-[#FF2D87] rounded-full" />
            <div className="absolute inset-0 bg-[#00D5E8] rounded-full mix-blend-multiply translate-x-1 translate-y-1" />
            <span className="absolute inset-0 flex items-center justify-center text-[#1A1A2E] font-black text-base">!</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontVariationSettings: "'wdth' 100, 'opsz' 96" }}>
            {coupleNames || eventName}
          </h2>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="h-10 px-5 sm:px-6 bg-[#1A1A2E] text-[#F5F0E8] text-xs sm:text-sm font-black tracking-wider uppercase hover:bg-[#FF2D87] transition-all border-2 border-[#1A1A2E] hover:border-[#FF2D87]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          [ RSVP ]
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-5 sm:px-10 py-16 overflow-hidden">
        {/* Big duotone shape */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-0 size-[80vw] sm:size-[60vw] max-w-[700px] max-h-[700px] rounded-full mix-blend-multiply opacity-90"
          style={{ background: "radial-gradient(circle, #FF2D87 0%, #FF2D87 60%, transparent 65%)" }}
        />
        <motion.div
          initial={{ scale: 0, rotate: 0, x: -200 }}
          animate={{ scale: 1, rotate: -360, x: 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-0 size-[70vw] sm:size-[50vw] max-w-[600px] max-h-[600px] rounded-full mix-blend-multiply opacity-80"
          style={{ background: "radial-gradient(circle, #00D5E8 0%, #00D5E8 60%, transparent 65%)", left: "10%" }}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-3xl mx-auto text-center space-y-7"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[#1A1A2E] bg-[#F5F0E8] -rotate-2"
          >
            <span className="size-2 rounded-full bg-[#FF2D87] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ▷ It&apos;s a party
            </span>
            <span className="size-2 rounded-full bg-[#00D5E8] animate-pulse" />
          </motion.div>

          <h1
            className="text-6xl sm:text-8xl md:text-[10rem] leading-[0.9] font-black tracking-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontVariationSettings: "'wdth' 75, 'opsz' 96" }}
          >
            <span className="block text-[#1A1A2E]">
              <SplitText text={coupleNames || eventName} staggerDelay={0.13} y={80} />
            </span>
          </h1>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 flex-wrap">
            <span className="px-3 py-1 bg-[#FF2D87] text-[#F5F0E8] text-xs font-black tracking-wider uppercase rotate-[-1.5deg]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {dateStr}
            </span>
            <span className="px-3 py-1 bg-[#00D5E8] text-[#1A1A2E] text-xs font-black tracking-wider uppercase rotate-[1.5deg]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {timeStr}
            </span>
            <span className="px-3 py-1 bg-[#1A1A2E] text-[#F5F0E8] text-xs font-black tracking-wider uppercase rotate-[-1deg]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {(location.split(",")[0] ?? location).slice(0, 16)}
            </span>
          </motion.div>

          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-[#1A1A2E]/85 max-w-xl mx-auto">
            <span className="font-mono text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{`{ guest: `}</span>
            <span className="font-black">&ldquo;{guestName}&rdquo;</span>
            <span className="font-mono text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{` }`}</span>
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={() => setRsvpOpen(true)}
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#1A1A2E] text-[#F5F0E8] text-sm font-black tracking-[0.2em] uppercase hover:-translate-x-1 hover:-translate-y-1 transition-transform"
              style={{ fontFamily: "'JetBrains Mono', monospace", boxShadow: "8px 8px 0 #FF2D87" }}
            >
              ▶ Confirm Hadir
            </button>
            <Link
              href={`/inv/${token}/qr`}
              className="text-xs text-[#1A1A2E]/70 hover:text-[#FF2D87] underline decoration-2 decoration-dotted underline-offset-4 font-bold tracking-wider"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              ↳ View QR ticket
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Marquee
        items={["LET'S CELEBRATE", "BIG MOOD", "PARTY MODE: ON", "CAKE & CHILL"]}
        className="py-3 bg-[#1A1A2E] text-[#00D5E8] text-sm font-black tracking-[0.3em] uppercase border-y-2 border-[#1A1A2E]"
        speed={20}
        separator="✦"
      />

      {/* ── DETAILS ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 sm:px-10 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative">
          <ClipReveal className="aspect-square overflow-hidden rotate-[-2.5deg] hover:rotate-0 transition-transform duration-500" style={{ boxShadow: "12px 12px 0 #00D5E8" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImg} alt="Party" className="w-full h-full object-cover" />
          </ClipReveal>
          {/* tape decoration */}
          <span className="absolute -top-3 left-12 w-20 h-6 bg-[#FF2D87]/70 rotate-[-8deg] shadow-md" />
          <span className="absolute -bottom-3 right-12 w-20 h-6 bg-[#00D5E8]/70 rotate-[5deg] shadow-md" />
        </div>

        <FloatIn className="space-y-5" staggerDelay={0.12}>
          <span className="inline-block font-mono text-xs px-3 py-1 bg-[#1A1A2E] text-[#00D5E8] tracking-[0.3em] uppercase rotate-[-1.5deg]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ── about/the/vibe
          </span>
          <h2 className="text-4xl sm:text-6xl font-black leading-[0.95] tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontVariationSettings: "'wdth' 75, 'opsz' 96" }}>
            <span className="text-[#1A1A2E]">come pull up</span>{" "}
            <span className="bg-[#FF2D87] text-[#F5F0E8] px-2 inline-block -rotate-1">we have cake</span>
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#1A1A2E]/85">
            {story || `Hey ${guestName}! No formalities, just good vibes. Datang ya, biar ulang tahun kita lebih seru. Will be sad if you don't.`}
          </p>
          <div className="flex items-start gap-3 pt-3 border-t-2 border-dashed border-[#1A1A2E]/30">
            <span className="size-10 bg-[#00D5E8] flex items-center justify-center text-[#1A1A2E] font-black shrink-0 rotate-[-3deg]">
              <span className="material-symbols-outlined">place</span>
            </span>
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#FF2D87]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>↳ where</p>
              <p className="text-base font-black mt-0.5">{location}</p>
              {venueAddress && <p className="text-xs text-[#1A1A2E]/60 mt-1">{venueAddress}</p>}
            </div>
          </div>
        </FloatIn>
      </section>

      {/* ── GALLERY: TAPED PHOTOS ── */}
      {cleanGallery.length > 0 && (
        <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10 py-16">
          <FloatIn className="text-center mb-12">
            <span className="font-mono text-xs px-3 py-1 bg-[#FF2D87] text-[#F5F0E8] tracking-[0.3em] uppercase inline-block rotate-[-1deg]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ── photo/dump
            </span>
            <h2 className="text-5xl sm:text-7xl font-black mt-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontVariationSettings: "'wdth' 75" }}>
              the good ones
            </h2>
          </FloatIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {cleanGallery.map((url, i) => {
              const rotations = ["rotate-[-3deg]", "rotate-[2deg]", "rotate-[-1.5deg]", "rotate-[3deg]", "rotate-[-2deg]", "rotate-[1deg]"];
              const tapeColors = ["#FF2D87", "#00D5E8", "#1A1A2E", "#FF2D87", "#00D5E8", "#1A1A2E"];
              return (
                <div key={i} className="relative">
                  <ClipReveal className={`aspect-[4/5] bg-[#F5F0E8] p-2 ${rotations[i % 6]} hover:rotate-0 hover:scale-105 transition-transform duration-500 overflow-hidden`} style={{ boxShadow: "8px 8px 0 #1A1A2E" }} delay={i * 0.06}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </ClipReveal>
                  <span className="absolute -top-3 left-8 w-16 h-5 opacity-80" style={{ background: tapeColors[i % 6], transform: `rotate(${i % 2 ? -8 : 8}deg)` }} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="relative z-10 bg-[#1A1A2E] text-[#F5F0E8] py-16 px-6 text-center border-t-4 border-[#FF2D87]">
        <span className="font-mono text-xs px-3 py-1 bg-[#00D5E8] text-[#1A1A2E] tracking-[0.3em] uppercase inline-block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          ── see/u/there
        </span>
        <h3 className="text-5xl sm:text-7xl font-black mt-5 leading-[0.95]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontVariationSettings: "'wdth' 75" }}>
          {coupleNames || eventName}
        </h3>
        <p className="font-mono text-xs tracking-[0.3em] mt-4 uppercase opacity-80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          ↳ {dateStr} · {(location.split(",")[0] ?? location)}
        </p>
        <button
          onClick={() => setRsvpOpen(true)}
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-[#FF2D87] text-[#F5F0E8] text-xs font-black tracking-[0.3em] uppercase hover:bg-[#00D5E8] hover:text-[#1A1A2E] transition"
          style={{ fontFamily: "'JetBrains Mono', monospace", boxShadow: "8px 8px 0 #00D5E8" }}
        >
          ▶ RSVP NOW
        </button>
        <p className="mt-12 font-mono text-[10px] tracking-widest opacity-60" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          made w/ chaos by <a href="/" className="underline hover:text-[#FF2D87]">LuminaCard</a>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-[#FF2D87] hover:bg-[#1A1A2E] shadow-pink-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#FF2D87" />}
    </div>
  );
}
