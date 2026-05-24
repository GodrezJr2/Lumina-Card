"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  stagger, fadeUp, fadeIn,
  SplitText, FloatIn, ClipReveal, ParallaxDiv, Marquee,
  RSVPModal, useSmoothScrollInit, type InvitationProps,
} from "./shared";
import MusicPlayer from "../MusicPlayer";

/**
 * RusticBoho — terracotta + sage outdoor wedding template.
 * Warm earthy palette, hand-drawn feel, asymmetric photo blocks.
 */
export function RusticBohoTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(64);

  const cleanGallery = gallery.filter(Boolean);
  const heroImg = cleanGallery[0] ?? "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80";
  const portraitImg = cleanGallery[1] ?? "https://images.unsplash.com/photo-1469371670807-013ccf25cb87?w=900&q=80";

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden"
      style={{
        fontFamily: "'Lora', 'Georgia', serif",
        background: "linear-gradient(180deg, #FDF6EC 0%, #F8EBD7 100%)",
        color: "#3D2817",
      }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky z-40 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 bg-[#FDF6EC]/85 backdrop-blur-md border-b border-[#C97B5C]/20"
        style={{ top: "var(--preview-bar-height, 0px)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-full bg-[#C97B5C]/15 flex items-center justify-center text-[#C97B5C]">
            <span className="material-symbols-outlined text-[18px] leading-none">park</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {coupleNames || eventName}
          </h2>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="h-10 px-5 sm:px-6 rounded-full bg-[#C97B5C] text-white text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-[#A8634A] transition-all shadow-md shadow-[#C97B5C]/30"
        >
          RSVP
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-5 sm:px-8 py-12 overflow-hidden">
        <ParallaxDiv className="absolute inset-0 z-0" speedFactor={0.4}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url('${heroImg}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6EC]/60 via-[#F8EBD7]/55 to-[#FDF6EC]/85" />
          </motion.div>
        </ParallaxDiv>

        {/* Decorative leaves */}
        <motion.div
          initial={{ opacity: 0, rotate: -15, x: -50 }}
          animate={{ opacity: 0.6, rotate: 0, x: 0 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="absolute top-12 left-4 sm:left-12 text-[#7A8A6E] text-5xl sm:text-7xl select-none pointer-events-none"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "inherit" }}>eco</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: 15, x: 50 }}
          animate={{ opacity: 0.6, rotate: 0, x: 0 }}
          transition={{ delay: 1.2, duration: 1.5 }}
          className="absolute bottom-12 right-4 sm:right-12 text-[#7A8A6E] text-5xl sm:text-7xl select-none pointer-events-none"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "inherit" }}>local_florist</span>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-3xl mx-auto text-center space-y-6"
        >
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C97B5C]/10 text-[#A8634A] text-xs font-bold uppercase tracking-widest">
            <span>✦</span> Save Our Date <span>✦</span>
          </motion.span>

          <h1
            className="text-5xl sm:text-7xl md:text-[7.5rem] italic font-bold leading-[0.95] text-[#3D2817]"
            style={{ fontFamily: "'Playfair Display', 'Lora', serif" }}
          >
            <SplitText text={coupleNames || eventName} staggerDelay={0.13} y={70} />
          </h1>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 text-[#C97B5C] py-2">
            <span className="text-2xl">❀</span>
            <span className="h-px w-16 sm:w-24 bg-[#C97B5C]/40" />
            <span className="text-2xl">❀</span>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#A8634A] uppercase">Untuk</p>
            <p className="text-2xl sm:text-3xl italic font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {guestName}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2 sm:gap-6 max-w-md mx-auto pt-4">
            {[
              { icon: "calendar_month", label: "Tanggal", value: dateStr.split(" ")[0] || dateStr },
              { icon: "schedule", label: "Waktu", value: timeStr },
              { icon: "place", label: "Lokasi", value: (location.split(",")[0] ?? location).slice(0, 14) },
            ].map((it) => (
              <div key={it.label} className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl bg-white/40 backdrop-blur-sm border border-[#C97B5C]/15">
                <span className="material-symbols-outlined text-[#C97B5C] text-lg">{it.icon}</span>
                <p className="text-[10px] uppercase tracking-wider text-[#A8634A] font-bold">{it.label}</p>
                <p className="text-xs font-semibold text-[#3D2817] text-center leading-tight">{it.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={() => setRsvpOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C97B5C] text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#A8634A] hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-[#C97B5C]/40"
            >
              <span className="material-symbols-outlined text-base leading-none">favorite</span>
              Konfirmasi Kehadiran
            </button>
            <Link href={`/inv/${token}/qr`} className="text-xs text-[#A8634A] hover:text-[#3D2817] flex items-center gap-1.5 transition">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              Lihat QR Tiket
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Marquee
        items={["Outdoor Wedding", "Bohemian Vibes", "Cinta Sederhana", "Naturally In Love"]}
        className="py-4 bg-[#7A8A6E] text-[#FDF6EC] text-sm font-bold tracking-widest uppercase"
        speed={28}
        separator="❀"
      />

      {/* ── STORY ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
        <ClipReveal className="md:col-span-2 aspect-[3/4] rounded-3xl shadow-2xl shadow-[#C97B5C]/20 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portraitImg} alt="Pasangan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
        </ClipReveal>

        <FloatIn className="md:col-span-3 space-y-5 text-center md:text-left" staggerDelay={0.12}>
          <span className="text-xs font-bold tracking-[0.3em] text-[#A8634A] uppercase">─── Cerita Cinta ───</span>
          <h2 className="text-4xl sm:text-5xl italic font-bold text-[#3D2817]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Berawal dari secangkir kopi
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#3D2817]/85">
            {story || `Kami mengundang ${guestName} untuk menjadi saksi kisah cinta kami yang sederhana namun bermakna. Mari bersama merayakan komitmen kami di tengah alam terbuka.`}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#C97B5C]/20">
              <span className="material-symbols-outlined text-[#C97B5C]">place</span>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-[#A8634A] font-bold">Venue</p>
                <p className="text-sm font-semibold">{location}</p>
              </div>
            </div>
            {venueAddress && (
              <p className="text-xs text-[#3D2817]/60 italic w-full">{venueAddress}</p>
            )}
          </div>
        </FloatIn>
      </section>

      {/* ── ASYMMETRIC GALLERY ── */}
      {cleanGallery.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <FloatIn className="text-center mb-10">
            <span className="text-xs font-bold tracking-[0.3em] text-[#A8634A] uppercase">─── Album ───</span>
            <h2 className="text-4xl sm:text-5xl italic font-bold mt-3" style={{ fontFamily: "'Playfair Display', serif", color: "#3D2817" }}>
              Momen Hangat
            </h2>
          </FloatIn>

          <div className="grid grid-cols-6 grid-rows-2 gap-3 sm:gap-4 h-[60vh] sm:h-[70vh]">
            {cleanGallery.slice(0, 5).map((url, i) => {
              const layout = [
                "col-span-3 row-span-2",
                "col-span-3 row-span-1",
                "col-span-1 row-span-1",
                "col-span-1 row-span-1",
                "col-span-1 row-span-1",
              ][i] ?? "col-span-2 row-span-1";
              return (
                <ClipReveal key={i} className={`${layout} rounded-2xl shadow-md overflow-hidden`} delay={i * 0.08}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </ClipReveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-[#7A8A6E] text-[#FDF6EC] py-14 px-6 text-center">
        <span className="material-symbols-outlined text-4xl">eco</span>
        <h3 className="text-3xl sm:text-5xl italic font-bold mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          {coupleNames || eventName}
        </h3>
        <p className="text-sm tracking-widest mt-2 opacity-80 uppercase">{dateStr} · {location}</p>
        <button
          onClick={() => setRsvpOpen(true)}
          className="mt-8 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C97B5C] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#A8634A] transition shadow-lg"
        >
          <span className="material-symbols-outlined text-base leading-none">favorite</span>
          RSVP Sekarang
        </button>
        <p className="mt-10 text-xs opacity-60">
          Dibuat dengan ❤️ oleh <a href="/" className="font-semibold hover:opacity-100">LuminaCard</a>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-[#C97B5C] hover:bg-[#A8634A] shadow-orange-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#C97B5C" />}
    </div>
  );
}
