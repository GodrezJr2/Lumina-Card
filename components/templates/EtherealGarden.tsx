"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, stagger, Reveal, RSVPModal, useSmoothScrollInit, type InvitationProps } from "./shared";
import MusicPlayer from "../MusicPlayer";

export function EtherealGardenTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(72);

  return (
    <div className="min-h-screen font-sans antialiased overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}>
      {/* ── HEADER ── */}
      <header className="sticky z-50 flex items-center justify-between border-b border-emerald-100/50 bg-white/80 backdrop-blur-md px-6 py-4 lg:px-20" style={{ top: "var(--preview-bar-height, 0px)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <span className="material-symbols-outlined">local_florist</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{coupleNames || eventName}</h2>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="flex h-10 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all"
        >
          RSVP
        </button>
      </header>

      {/* ── HERO ── */}
      <div className="relative flex flex-col items-center justify-center min-h-[85vh] w-full px-4 overflow-hidden">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: gallery[0]
              ? `url('${gallery[0]}')`
              : `url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/90" />
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-8"
        >
          <motion.span variants={fadeUp} className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-widest">
            You Are Invited
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-bold italic text-slate-800 leading-tight drop-shadow-sm" style={{ fontFamily: "'Great Vibes', 'Georgia', cursive" }}>
            {coupleNames || eventName}
          </motion.h1>
          <motion.div variants={fadeUp}>
            <p className="text-xl font-light text-slate-700">{guestName}</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-slate-600">
              <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
                <span className="material-symbols-outlined text-emerald-500 text-lg">calendar_month</span>
                {dateStr}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/40" />
              <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
                <span className="material-symbols-outlined text-emerald-500 text-lg">schedule</span>
                {timeStr}
              </span>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={() => setRsvpOpen(true)}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-xl shadow-emerald-200 hover:-translate-y-1 transition-all duration-200"
            >
              <span className="mr-2 material-symbols-outlined">favorite</span>
              Konfirmasi Kehadiran
            </button>
            <Link href={`/i/${token}/qr`} className="text-sm text-slate-500 hover:text-emerald-600 transition flex items-center gap-1">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              Lihat QR Tiket
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── DETAILS ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        <Reveal>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {gallery[1] ? (
              <div className="aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gallery[1]} alt="Pasangan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ) : (
              <div className="aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-emerald-400">favorite</span>
              </div>
            )}
            <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
              <span className="text-emerald-500 text-4xl md:text-5xl italic font-bold" style={{ fontFamily: "'Great Vibes', cursive" }}>Cerita Kami</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Undangan Spesial</h2>
              <p className="text-slate-600 leading-relaxed">
                {story || `Dengan segala kebahagiaan, kami mengundang ${guestName} untuk turut hadir merayakan momen istimewa kami.`}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-emerald-50 p-5 rounded-2xl">
                  <span className="material-symbols-outlined text-3xl text-emerald-500 mb-2">location_on</span>
                  <h3 className="font-bold text-sm mb-1">Venue</h3>
                  <p className="text-xs text-slate-500">{location}</p>
                  {venueAddress && <p className="text-xs text-slate-400 mt-1">{venueAddress}</p>}
                </div>
                <div className="bg-emerald-50 p-5 rounded-2xl">
                  <span className="material-symbols-outlined text-3xl text-emerald-500 mb-2">calendar_month</span>
                  <h3 className="font-bold text-sm mb-1">Tanggal</h3>
                  <p className="text-xs text-slate-500">{dateStr}</p>
                  <p className="text-xs text-slate-400 mt-1">{timeStr}</p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {gallery.filter(Boolean).length > 0 && (
          <Reveal>
            <section>
              <div className="text-center mb-8">
                <h2 className="text-5xl italic font-bold text-emerald-500" style={{ fontFamily: "'Great Vibes', cursive" }}>Galeri</h2>
                <p className="text-slate-500 mt-2">Momen-momen berharga kami</p>
              </div>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {gallery.filter(Boolean).map((url, i) => (
                  <motion.div key={i} variants={fadeUp} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </Reveal>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-white py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="material-symbols-outlined text-emerald-500 text-3xl">local_florist</span>
          <h2 className="text-4xl italic font-bold text-slate-800 mt-4 mb-4" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {coupleNames || eventName}
          </h2>
          <p className="text-slate-500 text-sm mb-6">{dateStr} · {location}</p>
          <button
            onClick={() => setRsvpOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition"
          >
            <span className="material-symbols-outlined text-base leading-none">favorite</span>
            RSVP Sekarang
          </button>
          <p className="mt-8 text-xs text-slate-400">
            Dibuat dengan ❤️ menggunakan <a href="/" className="text-emerald-500 font-semibold hover:underline">LuminaCard</a>
          </p>
        </div>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#10b981" />}
    </div>
  );
}
