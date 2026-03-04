"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger, Reveal, RSVPModal, useSmoothScrollInit, type InvitationProps } from "./shared";
import MusicPlayer from "../MusicPlayer";

export function RoyalGoldTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(0); // RoyalGold tidak ada sticky nav di hero

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased overflow-x-hidden" style={{ fontFamily: "'Noto Serif', 'Georgia', serif" }}>
      {/* ── HERO ── */}
      <div
        className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 overflow-hidden"
        style={{
          backgroundImage: gallery[0]
            ? `linear-gradient(rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.85) 100%), url('${gallery[0]}')`
            : `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-6 border border-yellow-400/30 pointer-events-none rounded"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-8 border border-yellow-400/15 pointer-events-none rounded"
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-8"
        >
          <motion.span variants={fadeUp} className="text-yellow-400 tracking-[0.2em] text-sm uppercase font-bold">The Wedding Of</motion.span>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black leading-tight text-white drop-shadow-lg">
            {coupleNames || eventName}
          </motion.h1>
          <motion.div variants={fadeUp} className="w-24 h-px bg-yellow-400 mx-auto" />
          <motion.div variants={fadeUp}>
            <p className="text-slate-300 text-lg italic">Dengan hormat mengundang</p>
            <p className="text-2xl font-bold text-yellow-400">{guestName}</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-center gap-6 text-slate-300">
            <span className="flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-yellow-400 text-lg">calendar_month</span>
              {dateStr}
            </span>
            <span className="w-1 h-1 rounded-full bg-yellow-400/40" />
            <span className="flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-yellow-400 text-lg">schedule</span>
              {timeStr}
            </span>
          </motion.div>
          <motion.button
            variants={fadeUp}
            onClick={() => setRsvpOpen(true)}
            className="mt-4 px-8 py-4 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-base shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all hover:-translate-y-1"
          >
            RSVP Sekarang
          </motion.button>
        </motion.div>
      </div>

      {/* ── STORY CARDS ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        <Reveal>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent to-yellow-400/40 flex-1 max-w-32" />
              <span className="material-symbols-outlined text-yellow-400">favorite</span>
              <div className="h-px bg-gradient-to-l from-transparent to-yellow-400/40 flex-1 max-w-32" />
            </div>
            <h2 className="text-yellow-400 text-3xl font-bold mt-6 mb-4">Cerita Kami</h2>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: "favorite", title: "Lamaran", desc: story || "Sebuah momen indah yang menjadi awal dari perjalanan kita bersama selamanya." },
              { icon: "church", title: "Akad / Pemberkatan", desc: `${dateStr} pukul ${timeStr} di ${location}` },
              { icon: "wine_bar", title: "Resepsi", desc: venueAddress || location },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center gap-4 rounded-xl border border-yellow-400/20 bg-slate-800 p-6 hover:border-yellow-400/50 transition-colors">
                <div className="p-3 rounded-full bg-yellow-400/10 text-yellow-400">
                  <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                </div>
                <h3 className="text-white text-xl font-bold">{card.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {gallery.filter(Boolean).length > 0 && (
          <Reveal>
            <div>
              <h2 className="text-yellow-400 text-3xl font-bold text-center mb-8">Galeri Foto</h2>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl overflow-hidden"
              >
                {gallery.filter(Boolean).map((url, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className={`relative overflow-hidden group ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                    style={{ minHeight: i === 0 ? "300px" : "150px" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 absolute inset-0" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="w-16 h-16 rounded-full bg-yellow-400/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-yellow-400 text-3xl">mail</span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Konfirmasi Kehadiran</h3>
              <p className="text-slate-400 max-w-md mx-auto">Mohon konfirmasikan kehadiran Anda sebelum hari H.</p>
            </div>
            <button
              onClick={() => setRsvpOpen(true)}
              className="px-8 py-3 rounded-full border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900 font-bold text-base transition-all"
            >
              RSVP Online
            </button>
            <Link href={`/i/${token}/qr`} className="text-slate-400 hover:text-yellow-400 transition text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              Lihat QR Tiket
            </Link>
          </div>
        </Reveal>
      </div>

      <footer className="border-t border-slate-800 py-8 text-center">
        <p className="text-slate-500 text-sm">
          Dibuat dengan ❤️ menggunakan <a href="/" className="text-yellow-400 font-semibold hover:underline">LuminaCard</a>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-yellow-400 hover:bg-yellow-300 text-slate-900 shadow-yellow-200" dark />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#eab308" dark />}
    </div>
  );
}
