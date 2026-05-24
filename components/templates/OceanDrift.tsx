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
 * OceanDrift — beach destination wedding template.
 * Editorial magazine layout, SVG wave divider, deep teal + sand + coral.
 * Fraunces display + DM Mono numerals. Animated SVG wave morph.
 */
export function OceanDriftTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(64);

  const cleanGallery = gallery.filter(Boolean);
  const heroImg = cleanGallery[0] ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80";
  const portraitImg = cleanGallery[1] ?? "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80";

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden"
      style={{
        fontFamily: "'Fraunces', 'Georgia', serif",
        background: "#F5EFE0",
        color: "#0D3B47",
      }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky z-40 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 bg-[#F5EFE0]/85 backdrop-blur-md border-b border-[#0D3B47]/15"
        style={{ top: "var(--preview-bar-height, 0px)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-full bg-[#0D3B47] flex items-center justify-center text-[#F5EFE0]">
            <span className="material-symbols-outlined text-[18px] leading-none">waves</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontVariationSettings: "'opsz' 144" }}>
            {coupleNames || eventName}
          </h2>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="h-10 px-5 sm:px-6 rounded-none bg-[#E8704F] text-[#F5EFE0] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase hover:bg-[#0D3B47] transition-all shadow-md"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          ↳ RSVP
        </button>
      </header>

      {/* ── HERO — split editorial ── */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 min-h-[88vh] overflow-hidden">
        {/* Left text */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 lg:col-span-7 flex flex-col justify-center px-5 sm:px-10 lg:px-16 py-16 lg:py-24 space-y-6"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 text-[#E8704F]">
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
              N° 001 · 2026
            </span>
            <span className="h-px flex-1 max-w-24 bg-[#E8704F]/40" />
          </motion.div>

          <h1
            className="text-[12vw] sm:text-[10vw] lg:text-[7.5rem] xl:text-[9rem] leading-[0.85] font-light tracking-tight italic"
            style={{ fontFamily: "'Fraunces', serif", fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
          >
            <SplitText text={coupleNames || eventName} staggerDelay={0.15} y={80} />
          </h1>

          <motion.div variants={fadeUp} className="flex items-center gap-4 pt-2">
            <span className="size-10 rounded-full bg-[#E8704F]/15 flex items-center justify-center text-[#E8704F]">
              <span className="material-symbols-outlined text-base">favorite</span>
            </span>
            <p className="text-base sm:text-lg italic font-light text-[#0D3B47]/80">
              are getting married by the sea
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-0 max-w-md border-t border-b border-[#0D3B47]/15 divide-x divide-[#0D3B47]/15">
            <div className="px-3 py-4">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#E8704F] font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>Date</p>
              <p className="text-sm font-semibold mt-1">{dateStr}</p>
            </div>
            <div className="px-3 py-4">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#E8704F] font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>Time</p>
              <p className="text-sm font-semibold mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>{timeStr}</p>
            </div>
            <div className="px-3 py-4">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#E8704F] font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>Place</p>
              <p className="text-sm font-semibold mt-1 truncate">{(location.split(",")[0] ?? location)}</p>
            </div>
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm tracking-widest text-[#0D3B47]/60 italic">
            Reserved for · <span className="text-[#0D3B47] font-semibold not-italic">{guestName}</span>
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setRsvpOpen(true)}
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#0D3B47] text-[#F5EFE0] rounded-none text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#E8704F] transition-all duration-300"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span>Confirm Attendance</span>
              <span className="material-symbols-outlined text-base leading-none transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
            <Link href={`/inv/${token}/qr`} className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#0D3B47]/20 text-[#0D3B47] text-xs tracking-widest uppercase hover:bg-[#0D3B47] hover:text-[#F5EFE0] transition" style={{ fontFamily: "'DM Mono', monospace" }}>
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              QR
            </Link>
          </motion.div>
        </motion.div>

        {/* Right image */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="relative lg:col-span-5 min-h-[50vh] lg:min-h-full overflow-hidden"
        >
          <ParallaxDiv className="absolute inset-0" speedFactor={0.4}>
            <div className="absolute inset-0 bg-cover bg-center scale-110" style={{ backgroundImage: `url('${heroImg}')` }} />
          </ParallaxDiv>
          <div className="absolute top-4 right-4 lg:top-8 lg:right-8 px-3 py-1.5 bg-[#F5EFE0]/90 backdrop-blur-sm font-mono text-[10px] tracking-[0.25em] uppercase text-[#0D3B47]" style={{ fontFamily: "'DM Mono', monospace" }}>
            ↳ destination · {(location.split(",").pop() ?? "Bali").trim().slice(0, 12)}
          </div>
        </motion.div>
      </section>

      {/* ── ANIMATED WAVE DIVIDER ── */}
      <div className="relative h-24 sm:h-32 bg-[#0D3B47] overflow-hidden">
        <svg viewBox="0 0 1200 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <motion.path
            initial={{ d: "M0,50 Q300,20 600,50 T1200,50 V100 H0 Z" }}
            animate={{ d: ["M0,50 Q300,20 600,50 T1200,50 V100 H0 Z", "M0,50 Q300,80 600,50 T1200,50 V100 H0 Z", "M0,50 Q300,20 600,50 T1200,50 V100 H0 Z"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            fill="#F5EFE0"
          />
        </svg>
      </div>

      {/* ── STORY ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        <ClipReveal className="md:col-span-5 aspect-[3/4] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portraitImg} alt="Pasangan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
        </ClipReveal>

        <FloatIn className="md:col-span-7 space-y-6" staggerDelay={0.12}>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#E8704F]" style={{ fontFamily: "'DM Mono', monospace" }}>
            ─── chapter ii · the story
          </span>
          <h2 className="text-5xl sm:text-7xl italic font-light leading-[0.95] tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontVariationSettings: "'opsz' 144" }}>
            Where the tide<br/>brought us together
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#0D3B47]/80 max-w-2xl italic">
            {story || `Dengan deburan ombak sebagai saksi, kami mengundang ${guestName} untuk hadir dalam upacara cinta kami di tepi pantai. Mari rayakan awal perjalanan baru bersama hangatnya pasir dan angin laut.`}
          </p>
          <div className="flex items-start gap-4 pt-2 border-t border-[#0D3B47]/15">
            <span className="material-symbols-outlined text-[#E8704F] text-3xl mt-2">place</span>
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E8704F]" style={{ fontFamily: "'DM Mono', monospace" }}>Venue</p>
              <p className="text-lg font-semibold mt-1">{location}</p>
              {venueAddress && <p className="text-sm text-[#0D3B47]/60 mt-1 italic">{venueAddress}</p>}
            </div>
          </div>
        </FloatIn>
      </section>

      {/* ── GALLERY ── */}
      {cleanGallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-10 pb-20">
          <FloatIn className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#E8704F]" style={{ fontFamily: "'DM Mono', monospace" }}>
                ─── chapter iii · moments
              </span>
              <h2 className="text-5xl sm:text-6xl italic font-light leading-tight mt-2" style={{ fontFamily: "'Fraunces', serif" }}>
                Postcards from us
              </h2>
            </div>
            <span className="font-mono text-xs tracking-widest text-[#0D3B47]/40" style={{ fontFamily: "'DM Mono', monospace" }}>
              {cleanGallery.length.toString().padStart(3, "0")} photos
            </span>
          </FloatIn>
          <div className="grid grid-cols-12 gap-3 md:gap-4">
            {cleanGallery.slice(0, 6).map((url, i) => {
              const layouts = [
                "col-span-12 md:col-span-7 aspect-[16/10]",
                "col-span-6 md:col-span-5 aspect-square",
                "col-span-6 md:col-span-4 aspect-[3/4]",
                "col-span-12 md:col-span-8 aspect-[16/9]",
                "col-span-6 md:col-span-6 aspect-square",
                "col-span-6 md:col-span-6 aspect-square",
              ];
              return (
                <ClipReveal key={i} className={`${layouts[i] ?? "col-span-6 aspect-square"} overflow-hidden`} delay={i * 0.06}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                </ClipReveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ── FOOTER CTA ── */}
      <footer className="relative bg-[#0D3B47] text-[#F5EFE0] py-20 px-6 text-center overflow-hidden">
        <svg viewBox="0 0 1200 100" className="absolute top-0 inset-x-0 w-full h-16" preserveAspectRatio="none">
          <path d="M0,50 Q300,20 600,50 T1200,50 V0 H0 Z" fill="#F5EFE0" />
        </svg>
        <div className="relative z-10">
          <span className="font-mono text-xs tracking-[0.4em] uppercase text-[#E8704F]" style={{ fontFamily: "'DM Mono', monospace" }}>
            ─── See you there
          </span>
          <h3 className="text-5xl sm:text-7xl italic font-light leading-tight mt-4" style={{ fontFamily: "'Fraunces', serif" }}>
            {coupleNames || eventName}
          </h3>
          <p className="text-xs tracking-[0.4em] mt-3 uppercase opacity-70" style={{ fontFamily: "'DM Mono', monospace" }}>
            {dateStr} · {(location.split(",").pop() ?? location).trim()}
          </p>
          <button
            onClick={() => setRsvpOpen(true)}
            className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-[#E8704F] text-[#F5EFE0] text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#F5EFE0] hover:text-[#0D3B47] transition shadow-xl"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ↳ Confirm Attendance
          </button>
          <p className="mt-12 text-[10px] tracking-widest opacity-60" style={{ fontFamily: "'DM Mono', monospace" }}>
            crafted by <a href="/" className="underline decoration-[#E8704F]/60 hover:text-[#E8704F]">LuminaCard</a>
          </p>
        </div>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-[#0D3B47] hover:bg-[#E8704F] shadow-teal-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#E8704F" />}
    </div>
  );
}
