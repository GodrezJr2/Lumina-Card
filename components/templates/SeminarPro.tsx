"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  stagger, fadeUp, fadeIn,
  SplitText, FloatIn, ClipReveal, ParallaxDiv, CountUp,
  RSVPModal, useSmoothScrollInit, type InvitationProps,
} from "./shared";
import MusicPlayer from "../MusicPlayer";

/**
 * SeminarPro — academic/corporate seminar/conference template.
 * Slate + indigo palette, structured grid, agenda + speakers section.
 */
export function SeminarProTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(64);

  const cleanGallery = gallery.filter(Boolean);
  const heroImg = cleanGallery[0] ?? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80";

  const stats = [
    { num: 500, label: "Peserta", suffix: "+" },
    { num: 12,  label: "Pembicara", suffix: "" },
    { num: 8,   label: "Sesi", suffix: "" },
  ];

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden bg-slate-50 text-slate-900"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky z-40 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 bg-white/85 backdrop-blur-md border-b border-slate-200"
        style={{ top: "var(--preview-bar-height, 0px)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <span className="material-symbols-outlined text-[18px] leading-none">school</span>
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">{eventName}</h2>
            <p className="text-[10px] uppercase tracking-widest text-indigo-600 font-semibold">Official Conference</p>
          </div>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="h-10 px-5 sm:px-6 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          Daftar
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[85vh] flex items-center px-5 sm:px-8 lg:px-16 py-12 overflow-hidden">
        <ParallaxDiv className="absolute inset-0 z-0" speedFactor={0.3}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url('${heroImg}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/55" />
          </motion.div>
        </ParallaxDiv>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-3xl text-white space-y-6"
        >
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-600/90 text-xs font-bold uppercase tracking-wider">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              Live Conference
            </span>
            <span className="text-xs tracking-widest text-slate-300 uppercase">{dateStr}</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight">
            <SplitText text={eventName} staggerDelay={0.08} y={50} />
          </h1>

          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-200 max-w-2xl leading-relaxed">
            {story || "Konferensi tahunan untuk profesional dan akademisi yang ingin terhubung, belajar, dan berkembang bersama."}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span className="material-symbols-outlined text-indigo-400">person</span>
            Untuk: <span className="text-white font-semibold">{guestName}</span>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md pt-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-black text-indigo-400">
                  <CountUp to={s.num} suffix={s.suffix} />
                </p>
                <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => setRsvpOpen(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-all shadow-xl shadow-indigo-900/40 hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-base leading-none">how_to_reg</span>
              Konfirmasi Kehadiran
            </button>
            <Link
              href={`/inv/${token}/qr`}
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition"
            >
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              QR Tiket
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── INFO STRIP ── */}
      <section className="bg-indigo-600 text-white py-6 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: "event", label: "Tanggal", value: dateStr },
            { icon: "schedule", label: "Waktu", value: timeStr },
            { icon: "place", label: "Lokasi", value: location },
          ].map((it) => (
            <div key={it.label} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15">
              <span className="material-symbols-outlined text-white/90 text-2xl shrink-0">{it.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">{it.label}</p>
                <p className="text-sm font-bold truncate">{it.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT + AGENDA ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <FloatIn className="space-y-5" staggerDelay={0.12}>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">─── About</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Tentang Konferensi
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-700">
            {story || "Bergabunglah dengan kami dalam acara konferensi tahunan untuk berbagi pengetahuan, mendengar dari pembicara terkemuka, dan memperluas jaringan profesional Anda di industri."}
          </p>
          {venueAddress && (
            <div className="bg-slate-100 rounded-xl p-5 border-l-4 border-indigo-600">
              <p className="text-xs uppercase tracking-widest text-indigo-600 font-bold mb-1">Alamat Venue</p>
              <p className="text-sm text-slate-700 leading-relaxed">{venueAddress}</p>
            </div>
          )}
        </FloatIn>

        <FloatIn className="space-y-3" staggerDelay={0.1}>
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">─── Agenda</span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Susunan Acara</h3>
          {[
            { time: "08.00", title: "Registrasi & Welcome Coffee" },
            { time: "09.00", title: "Opening Keynote" },
            { time: "10.30", title: "Panel Discussion" },
            { time: "12.00", title: "Lunch Break" },
            { time: "13.30", title: "Breakout Sessions" },
            { time: "16.00", title: "Closing & Networking" },
          ].map((item, i) => (
            <div key={i} className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 transition-all">
              <span className="font-mono text-sm font-bold text-indigo-600 w-12 shrink-0 pt-0.5">{item.time}</span>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-500 transition">arrow_forward</span>
            </div>
          ))}
        </FloatIn>
      </section>

      {/* ── GALLERY ── */}
      {cleanGallery.length > 0 && (
        <section className="bg-slate-900 text-white py-16 px-5 sm:px-8">
          <FloatIn className="max-w-6xl mx-auto text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">─── Highlights</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">Momen Konferensi</h2>
          </FloatIn>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {cleanGallery.map((url, i) => (
              <ClipReveal
                key={i}
                className={`${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"} rounded-xl overflow-hidden`}
                delay={i * 0.06}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </ClipReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA + FOOTER ── */}
      <section className="bg-indigo-600 text-white py-16 px-5 sm:px-8 text-center">
        <FloatIn>
          <span className="material-symbols-outlined text-4xl text-indigo-200">how_to_reg</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-4">Tempat Terbatas</h2>
          <p className="mt-3 text-indigo-100 max-w-md mx-auto">
            Daftarkan diri Anda sekarang sebelum kuota penuh. RSVP wajib untuk masuk venue.
          </p>
          <button
            onClick={() => setRsvpOpen(true)}
            className="mt-7 inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-indigo-700 text-sm font-bold uppercase tracking-wider hover:bg-indigo-50 transition shadow-xl"
          >
            <span className="material-symbols-outlined text-base leading-none">how_to_reg</span>
            Daftar Sekarang
          </button>
        </FloatIn>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-8 px-5 sm:px-8 text-center text-xs">
        © 2026 {eventName} · Powered by{" "}
        <a href="/" className="text-indigo-400 hover:text-white font-semibold">LuminaCard</a>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#6366f1" dark />}
    </div>
  );
}
