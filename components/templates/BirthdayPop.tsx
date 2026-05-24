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
 * BirthdayPop — fun colorful birthday/party template.
 * Vivid pink + cyan + yellow, confetti vibe, playful typography.
 */
export function BirthdayPopTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(64);

  const cleanGallery = gallery.filter(Boolean);
  const heroImg = cleanGallery[0] ?? "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80";

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden"
      style={{
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        background: "linear-gradient(135deg, #FFF1F8 0%, #E0F7FF 50%, #FFF8E0 100%)",
        color: "#1F1147",
      }}
    >
      {/* Floating confetti */}
      {[...Array(14)].map((_, i) => {
        const colors = ["#FF3D8B", "#3DD9F0", "#FFC83D", "#9D4DFF", "#3DFF9D"];
        const c = colors[i % colors.length];
        return (
          <motion.span
            key={i}
            className="fixed pointer-events-none rounded-sm z-0"
            style={{
              backgroundColor: c,
              width: 8 + (i % 3) * 4,
              height: 8 + (i % 3) * 4,
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 11.1) % 100}%`,
            }}
            animate={{
              y: ["0%", "20%", "0%"],
              rotate: [0, 180, 360],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 6 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}

      {/* ── HEADER ── */}
      <header
        className="sticky z-40 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 bg-white/85 backdrop-blur-md border-b-2 border-pink-300/40 border-dashed"
        style={{ top: "var(--preview-bar-height, 0px)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-full bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-pink-300/40 rotate-6">
            <span className="material-symbols-outlined text-[18px] leading-none">celebration</span>
          </span>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-pink-600">
            {coupleNames || eventName}
          </h2>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="h-10 px-5 sm:px-6 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 text-white text-xs sm:text-sm font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-pink-300/40"
        >
          🎉 RSVP
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-5 sm:px-8 py-12 overflow-hidden">
        <ParallaxDiv className="absolute inset-0 z-0" speedFactor={0.3}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url('${heroImg}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/85" />
          </motion.div>
        </ParallaxDiv>

        {/* Big balloon decorations */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute top-20 left-6 sm:left-16 text-pink-400 select-none pointer-events-none"
        >
          <span className="material-symbols-outlined text-7xl sm:text-9xl">cake</span>
        </motion.div>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [10, -10, 10] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute bottom-24 right-6 sm:right-16 text-cyan-400 select-none pointer-events-none"
        >
          <span className="material-symbols-outlined text-7xl sm:text-9xl">redeem</span>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-3xl mx-auto text-center space-y-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500 text-white text-xs font-black uppercase tracking-widest shadow-md"
          >
            🎂 You&apos;re Invited 🎉
          </motion.span>

          <h1 className="text-5xl sm:text-7xl md:text-[7rem] font-black leading-[0.95] tracking-tight">
            <span className="bg-gradient-to-br from-pink-500 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
              <SplitText text={coupleNames || eventName} staggerDelay={0.12} y={70} />
            </span>
          </h1>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 text-pink-500">
            <span className="text-2xl">🎈</span>
            <span className="h-px w-16 sm:w-24 bg-pink-300" />
            <span className="text-2xl">🎁</span>
            <span className="h-px w-16 sm:w-24 bg-pink-300" />
            <span className="text-2xl">🎂</span>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1">
            <p className="text-xs sm:text-sm font-black tracking-widest text-cyan-600 uppercase">Hai!</p>
            <p className="text-2xl sm:text-3xl font-black text-pink-600">
              {guestName}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto pt-4">
            {[
              { icon: "calendar_month", color: "from-pink-500 to-fuchsia-500", label: "Tanggal", value: dateStr.split(" ")[0] || dateStr },
              { icon: "schedule", color: "from-cyan-500 to-blue-500", label: "Jam", value: timeStr },
              { icon: "place", color: "from-amber-400 to-orange-500", label: "Tempat", value: (location.split(",")[0] ?? location).slice(0, 12) },
            ].map((it) => (
              <div key={it.label} className={`flex flex-col items-center gap-1 px-2 py-3 rounded-2xl bg-gradient-to-br ${it.color} text-white shadow-lg`}>
                <span className="material-symbols-outlined text-lg">{it.icon}</span>
                <p className="text-[10px] uppercase tracking-wider font-black opacity-90">{it.label}</p>
                <p className="text-xs font-black text-center leading-tight">{it.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={() => setRsvpOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 text-white rounded-full text-sm font-black tracking-wider uppercase hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-pink-300/40"
            >
              <span>🎉</span>
              Konfirmasi Hadir
              <span>🎂</span>
            </button>
            <Link href={`/inv/${token}/qr`} className="text-xs text-cyan-600 hover:text-pink-500 flex items-center gap-1.5 font-semibold transition">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              Lihat QR Tiket
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Marquee
        items={["Happy Birthday", "Pesta Seru", "Cake Time", "Let's Party"]}
        className="py-4 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 text-white text-sm font-black tracking-widest uppercase"
        speed={20}
        separator="🎂"
      />

      {/* ── DETAILS ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <ClipReveal className="aspect-square rounded-3xl shadow-2xl shadow-pink-300/30 overflow-hidden border-4 border-white">
          {cleanGallery[1] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={cleanGallery[1]} alt="Foto" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-300 via-fuchsia-300 to-amber-300 flex items-center justify-center">
              <span className="text-9xl">🎂</span>
            </div>
          )}
        </ClipReveal>

        <FloatIn className="space-y-5 text-center md:text-left" staggerDelay={0.12}>
          <span className="text-xs font-black tracking-[0.3em] text-pink-500 uppercase">─── Pesta Spesial</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
              Datang Yuk!
            </span>
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-700">
            {story || `Hai ${guestName}! Yuk meriahkan acara spesial kita dengan kue, balon, dan banyak kejutan! Ga akan seru tanpa kamu 🎉`}
          </p>
          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-pink-200">
            <div className="flex items-start gap-3">
              <span className="size-10 rounded-xl bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined">place</span>
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-pink-500 font-black">Lokasi</p>
                <p className="font-bold text-slate-800 mt-0.5">{location}</p>
                {venueAddress && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{venueAddress}</p>}
              </div>
            </div>
          </div>
        </FloatIn>
      </section>

      {/* ── GALLERY ── */}
      {cleanGallery.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <FloatIn className="text-center mb-10">
            <span className="text-xs font-black tracking-[0.3em] text-cyan-600 uppercase">─── Album Kenangan ───</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3">
              <span className="bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text text-transparent">
                Throwback Seru
              </span>
            </h2>
          </FloatIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {cleanGallery.map((url, i) => {
              const rotate = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1", "rotate-1"][i % 6];
              return (
                <ClipReveal key={i} className={`aspect-[4/5] rounded-2xl overflow-hidden shadow-lg transform ${rotate} hover:rotate-0 hover:scale-105 transition-transform duration-500 border-4 border-white`} delay={i * 0.06}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                </ClipReveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-400 text-white py-14 px-6 text-center">
        <span className="text-5xl">🎉🎂🎈</span>
        <h3 className="text-3xl sm:text-5xl font-black mt-4">
          {coupleNames || eventName}
        </h3>
        <p className="text-sm tracking-widest mt-2 opacity-90 uppercase font-bold">{dateStr} · {location}</p>
        <button
          onClick={() => setRsvpOpen(true)}
          className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-pink-600 text-xs font-black tracking-widest uppercase hover:scale-105 transition shadow-xl"
        >
          🎉 RSVP Sekarang 🎂
        </button>
        <p className="mt-10 text-xs opacity-80">
          Dibuat dengan ❤️ oleh <a href="/" className="font-bold underline">LuminaCard</a>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-pink-500 hover:bg-pink-600 shadow-pink-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#EC4899" />}
    </div>
  );
}
