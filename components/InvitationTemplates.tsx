"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Reusable animation variants ──────────────────────────────────────────────
const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.8 } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

// Scroll-triggered wrapper
function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface InvitationProps {
  guestName: string;
  token: string;
  eventName: string;
  dateStr: string;
  timeStr: string;
  location: string;
  coupleNames: string;
  story: string;
  venueAddress: string;
  gallery: string[];
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. ETHEREAL GARDEN  (green / floral)
───────────────────────────────────────────────────────────────────────────── */
export function EtherealGardenTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans antialiased overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}>
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-emerald-100/50 bg-white/80 backdrop-blur-md px-6 py-4 lg:px-20">
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
            <Link href={`/inv/${token}/qr`} className="text-sm text-slate-500 hover:text-emerald-600 transition flex items-center gap-1">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              Lihat QR Tiket
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── DETAILS ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        {/* Story Section */}
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

        {/* Gallery */}
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
            Dibuat dengan ❤️ menggunakan <a href="/" className="text-emerald-500 font-semibold hover:underline">ElegantInvites</a>
          </p>
        </div>
      </footer>

      {/* ── RSVP MODAL ── */}
      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200" />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. ROYAL GOLD  (dark / luxury)
───────────────────────────────────────────────────────────────────────────── */
export function RoyalGoldTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);

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
        {/* Decorative borders */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: easeOut }}
          className="absolute inset-6 border border-yellow-400/30 pointer-events-none rounded"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: easeOut }}
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
            { icon: "favorite", title: "Lamaran", desc: story || `Sebuah momen indah yang menjadi awal dari perjalanan kita bersama selamanya.` },
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

        {/* Gallery */}
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

        {/* CTA */}
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
          <Link href={`/inv/${token}/qr`} className="text-slate-400 hover:text-yellow-400 transition text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
            Lihat QR Tiket
          </Link>
        </div>
        </Reveal>
      </div>

      <footer className="border-t border-slate-800 py-8 text-center">
        <p className="text-slate-500 text-sm">
          Dibuat dengan ❤️ menggunakan <a href="/" className="text-yellow-400 font-semibold hover:underline">ElegantInvites</a>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-yellow-400 hover:bg-yellow-300 text-slate-900 shadow-yellow-200" dark />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. MODERN CORPORATE  (clean / blue)
───────────────────────────────────────────────────────────────────────────── */
export function ModernCorporateTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden" style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-3 text-indigo-600">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{coupleNames || eventName}</h2>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-transform hover:scale-105 active:scale-95"
        >
          RSVP Now
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 lg:w-1/2"
          >
            <motion.div variants={fadeUp} className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <span className="size-2 rounded-full bg-indigo-500 animate-pulse" />
              Undangan Resmi
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl font-black leading-tight tracking-tighter text-slate-900 md:text-5xl lg:text-6xl">
              {coupleNames || eventName}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg leading-relaxed text-slate-600">
              {story || `Dengan hormat, kami mengundang ${guestName} untuk hadir pada acara spesial kami.`}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setRsvpOpen(true)}
                className="flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-8 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
              >
                RSVP Sekarang
              </button>
              <Link
                href={`/inv/${token}/qr`}
                className="flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-8 text-base font-bold text-slate-800 transition-all hover:bg-slate-50"
              >
                <span className="material-symbols-outlined mr-2 text-lg leading-none">qr_code_2</span>
                QR Tiket
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
            className="relative lg:w-1/2"
          >
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
              {gallery[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={gallery[0]} alt="Event" className="h-full w-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-8xl text-indigo-400">event</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border-2 border-dashed border-indigo-200" />
          </motion.div>
        </div>
      </section>

      {/* ── EVENT DETAILS ── */}
      <Reveal>
      <section className="border-y border-slate-100 bg-slate-50/50 px-6 py-12 md:px-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Timeline */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Rundown Acara</h2>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative border-l-2 border-slate-200 pl-8 space-y-8"
            >
              {[
                { icon: "login", label: "Registrasi Tamu", desc: "Check-in dan penyambutan tamu undangan", time: timeStr },
                { icon: "celebration", label: "Acara Utama", desc: `${coupleNames || eventName}`, time: "" },
                { icon: "restaurant", label: "Resepsi & Makan", desc: "Makan bersama dan sesi foto", time: "" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="relative">
                  <div className={`absolute -left-[41px] flex size-6 items-center justify-center rounded-full ${i === 0 ? "bg-indigo-600 text-white" : "bg-white border-2 border-slate-300 text-slate-400"} ring-4 ring-white`}>
                    <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                  </div>
                  <span className={`text-sm font-bold ${i === 0 ? "text-indigo-600" : "text-slate-400"}`}>{item.time}</span>
                  <h3 className="text-lg font-bold text-slate-900">{item.label}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Location card */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Lokasi</h2>
            <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg">
              <div className="relative h-40 w-full bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg animate-bounce">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{location}</h3>
                {venueAddress && <p className="mt-2 text-slate-500 text-sm">{venueAddress}</p>}
                <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-indigo-300 bg-indigo-50 p-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">Tamu Undangan</span>
                    <p className="text-sm font-medium text-slate-700 mt-0.5">{guestName}</p>
                  </div>
                  <Link href={`/inv/${token}/qr`} className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition">
                    <span className="material-symbols-outlined text-indigo-600">qr_code_2</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Gallery */}
      {gallery.filter(Boolean).length > 0 && (
        <Reveal>
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Galeri</h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {gallery.filter(Boolean).map((url, i) => (
              <motion.div key={i} variants={fadeUp} className="aspect-video rounded-xl overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </section>
        </Reveal>
      )}

      <footer className="border-t border-slate-100 bg-white py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-600 mb-4">
            <span className="material-symbols-outlined">rocket_launch</span>
            <span className="text-lg font-bold text-slate-900">{coupleNames || eventName}</span>
          </div>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">{dateStr} · {location}</p>
          <button
            onClick={() => setRsvpOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-indigo-700 transition"
          >
            RSVP Now
          </button>
          <p className="mt-8 text-xs text-slate-400">
            Dibuat dengan ❤️ menggunakan <a href="/" className="text-indigo-600 font-semibold hover:underline">ElegantInvites</a>
          </p>
        </div>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Shared RSVP Modal
───────────────────────────────────────────────────────────────────────────── */
interface RSVPModalProps {
  token: string;
  guestName: string;
  onClose: () => void;
  accentClass: string;
  dark?: boolean;
}

function RSVPModal({ token, guestName, onClose, accentClass, dark }: RSVPModalProps) {
  const [attendance, setAttendance] = useState<"hadir" | "tidak" | "">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const bg = dark ? "bg-slate-800 text-white" : "bg-white text-slate-900";
  const inputCls = dark
    ? "w-full border border-slate-600 bg-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
    : "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400";

  async function submit() {
    if (!attendance) { setError("Pilih konfirmasi kehadiran."); return; }
    setError("");
    setLoading(true);
    try {
      const r = await fetch(`/api/inv/${token}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendance, message }),
      });
      if (!r.ok) {
        const d = await r.json();
        throw new Error(d.error || "Gagal mengirim RSVP.");
      }
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
    <motion.div
      key="rsvp-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        key="rsvp-panel"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.35, ease: easeOut }}
        className={`${bg} rounded-2xl shadow-2xl w-full max-w-md p-6`}
      >
        {done ? (
          <div className="text-center py-4 space-y-4">
            <div className="size-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-500 text-3xl">check_circle</span>
            </div>
            <h3 className="text-xl font-bold">
              {attendance === "hadir" ? "Terima Kasih! 🎉" : "Terima Kasih!"}
            </h3>
            <p className={dark ? "text-slate-300 text-sm" : "text-slate-500 text-sm"}>
              {attendance === "hadir"
                ? "Kami senang Anda akan hadir. Sampai jumpa!"
                : "Kami menghormati keputusan Anda. Terima kasih telah merespons."}
            </p>
            <button onClick={onClose} className={`mt-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white ${accentClass}`}>
              Tutup
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Konfirmasi Kehadiran</h3>
                <p className={`text-sm mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>Halo, {guestName}!</p>
              </div>
              <button onClick={onClose} className={`size-8 flex items-center justify-center rounded-full ${dark ? "hover:bg-slate-700" : "hover:bg-slate-100"} transition`}>
                <span className="material-symbols-outlined text-xl leading-none">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Attendance choice */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${dark ? "text-slate-300" : "text-slate-700"}`}>Apakah Anda akan hadir?</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setAttendance("hadir")}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition ${
                      attendance === "hadir"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : dark ? "border-slate-600 text-slate-300 hover:border-emerald-400" : "border-slate-200 text-slate-600 hover:border-emerald-400"
                    }`}
                  >
                    ✅ Ya, Hadir
                  </button>
                  <button
                    onClick={() => setAttendance("tidak")}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition ${
                      attendance === "tidak"
                        ? "border-red-500 bg-red-500 text-white"
                        : dark ? "border-slate-600 text-slate-300 hover:border-red-400" : "border-slate-200 text-slate-600 hover:border-red-400"
                    }`}
                  >
                    ❌ Tidak Hadir
                  </button>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>
                  Pesan / Ucapan <span className={dark ? "text-slate-500 font-normal" : "text-slate-400 font-normal"}>(opsional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Tulis ucapan atau pesan untuk pasangan..."
                  className={inputCls + " resize-none"}
                />
              </div>

              {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

              <button
                onClick={submit}
                disabled={loading}
                className={`w-full py-3 rounded-xl text-sm font-bold text-white transition disabled:opacity-60 ${accentClass}`}
              >
                {loading ? "Mengirim…" : "Kirim RSVP"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. NEON NEXUS  (dark / high-tech / cyber)
───────────────────────────────────────────────────────────────────────────── */
export function NeonNexusTemplate(props: InvitationProps) {
  const {
    guestName, token, eventName, dateStr, timeStr,
    location, coupleNames, story, venueAddress,
  } = props;

  // RSVP state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "tidak">("hadir");
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRsvpStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, attendance, token }),
      });
      setRsvpStatus(res.ok ? "success" : "error");
    } catch {
      setRsvpStatus("error");
    }
  }

  // Timeline items derived from props
  const timeline = [
    { time: timeStr,      icon: "local_bar",  title: "Welcome Protocol",  desc: "Initialization sequence. Enjoy crafted cocktails and ambient networking." },
    { time: "19.00 WIB",  icon: "favorite",   title: "Main Execution",    desc: "The ceremonial merge. Vows rendered in high fidelity." },
    { time: "20.30 WIB",  icon: "music_note", title: "Infinite Loop Party", desc: "Synthesized beats, projections, and endless runtime." },
  ];

  // Scroll reveal ref helper
  function RevealSlide({ children, from }: { children: React.ReactNode; from: "left" | "right" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: from === "left" ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col font-display bg-[#0B132B] text-slate-100 antialiased overflow-x-hidden">

      {/* ── Sticky nav ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#0B132B]/80 backdrop-blur-md px-6 md:px-10 py-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#ecc813]">celebration</span>
          <span className="text-lg font-bold text-white tracking-tight">Tech Invite</span>
        </div>
        <nav className="hidden md:flex items-center gap-7">
          {["Event", "Timeline", "Location", "RSVP"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-slate-300 hover:text-[#ecc813] transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        <a
          href="#rsvp"
          className="flex items-center justify-center rounded-full h-9 px-5 bg-[#ecc813] text-[#0B132B] text-sm font-bold hover:bg-[#ecc813]/90 transition-colors shadow-[0_0_15px_rgba(236,200,19,0.3)]"
        >
          RSVP
        </a>
      </header>

      {/* ── Hero ── */}
      <section
        id="event"
        className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden"
      >
        {/* BG gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C2541]/50 to-[#0B132B] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(236,200,19,0.2)_0%,_transparent_70%)] pointer-events-none" />

        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center gap-8 max-w-4xl mx-auto"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="inline-flex items-center justify-center rounded-full border border-[#ecc813]/30 bg-[#ecc813]/10 px-4 py-1.5"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#ecc813]">
              {eventName}
            </span>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            className="text-6xl md:text-8xl font-black leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#ecc813] via-yellow-200 to-[#ecc813] drop-shadow-[0_0_30px_rgba(236,200,19,0.25)]"
          >
            {coupleNames}
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            className="text-xl md:text-2xl font-light leading-relaxed text-slate-300 max-w-2xl"
          >
            {story}
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 0.4 } } }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
          >
            {[
              { icon: "calendar_today", label: "Tanggal", value: dateStr },
              { icon: "schedule",       label: "Waktu",   value: timeStr },
              { icon: "location_on",    label: "Lokasi",  value: location },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-6 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[#ecc813]">{icon}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-bold text-white">{value}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5, delay: 0.8 } } }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <span className="text-sm font-medium text-slate-400">Scroll to explore</span>
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="material-symbols-outlined text-[#ecc813] text-3xl"
            >
              keyboard_double_arrow_down
            </motion.span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Timeline ── */}
      <section id="timeline" className="py-24 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Event Timeline</h2>
            <p className="text-slate-400">The sequence of our celebration.</p>
          </Reveal>

          <div className="relative">
            {/* Glowing vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ecc813]/10 via-[#ecc813]/50 to-[#ecc813]/10 -translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(236,200,19,0.5)]" />

            <div className="space-y-12">
              {timeline.map(({ time, icon, title, desc }, i) => {
                const fromSide = i % 2 === 0 ? "right" : "left";
                return (
                  <div
                    key={title}
                    className={`relative flex flex-col md:flex-row items-center justify-between ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}
                  >
                    <div className="hidden md:block w-5/12" />
                    {/* Circle */}
                    <div className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full bg-[#0B132B] border-2 border-[#ecc813] -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(236,200,19,0.4)]">
                      <span className="material-symbols-outlined text-[#ecc813] text-sm">{icon}</span>
                    </div>
                    {/* Card */}
                    <div className={`w-full md:w-5/12 pl-20 md:pl-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                      <RevealSlide from={fromSide}>
                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-[#ecc813]/50 transition-all">
                          <div className="text-[#ecc813] font-bold mb-1">{time}</div>
                          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                          <p className="text-slate-400 text-sm">{desc}</p>
                        </div>
                      </RevealSlide>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section id="location" className="py-24 px-4 bg-[#1C2541]/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <Reveal className="w-full md:w-1/2 space-y-6">
              <h2 className="text-4xl font-bold tracking-tight text-white">Coordinates</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#ecc813] mt-1">location_on</span>
                  <div>
                    <h4 className="font-semibold text-white text-lg">{location}</h4>
                    <p className="text-slate-400 text-sm">{venueAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#ecc813] mt-1">directions_car</span>
                  <div>
                    <h4 className="font-semibold text-white text-lg">Transport Logistics</h4>
                    <p className="text-slate-400 text-sm">Parkir tersedia. Harap tiba tepat waktu.</p>
                  </div>
                </div>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(venueAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-3 rounded-lg border border-[#ecc813] text-[#ecc813] hover:bg-[#ecc813]/10 transition-colors font-semibold tracking-wide text-sm"
              >
                Load Directions
              </a>
            </Reveal>

            <Reveal className="w-full md:w-1/2">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative h-[360px] bg-[#1C2541]">
                <iframe
                  title="map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(venueAddress)}&output=embed`}
                  className="w-full h-full grayscale opacity-80"
                  loading="lazy"
                />
                {/* Neon pin overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#ecc813] rounded-full shadow-[0_0_20px_rgba(236,200,19,0.9)] flex items-center justify-center pointer-events-none">
                  <div className="w-2 h-2 bg-[#0B132B] rounded-full" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section id="rsvp" className="py-32 px-4 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,200,19,0.08)_0%,transparent_70%)] pointer-events-none" />
        <Reveal className="w-full max-w-lg">
          <div className="p-8 md:p-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            {rsvpStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <span className="material-symbols-outlined text-5xl text-[#ecc813] mb-4 block">check_circle</span>
                <h3 className="text-2xl font-bold text-white mb-2">Transmission Received!</h3>
                <p className="text-slate-400">Terima kasih, {name}. Kami menantikan kehadiran Anda.</p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-3 text-white">Transmit RSVP</h2>
                  <p className="text-slate-400 text-sm">Konfirmasi kehadiran Anda untuk {eventName}</p>
                  {guestName !== "Tamu Undangan" && (
                    <p className="text-[#ecc813] text-sm mt-1 font-semibold">Kepada: {guestName}</p>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">User Identifier</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0B132B]/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ecc813] focus:ring-1 focus:ring-[#ecc813] transition-colors"
                      placeholder="Masukkan nama lengkap Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Communication Channel</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B132B]/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ecc813] focus:ring-1 focus:ring-[#ecc813] transition-colors"
                      placeholder="Masukkan alamat email Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Attendance Status</label>
                    <div className="grid grid-cols-2 gap-4">
                      {(["hadir", "tidak"] as const).map((val) => (
                        <label key={val} className="cursor-pointer">
                          <input
                            type="radio"
                            name="attendance"
                            value={val}
                            checked={attendance === val}
                            onChange={() => setAttendance(val)}
                            className="sr-only"
                          />
                          <div className={`rounded-lg border px-4 py-3 text-center transition-all text-sm font-medium ${
                            attendance === val
                              ? "border-[#ecc813] bg-[#ecc813]/10 text-[#ecc813]"
                              : "border-white/20 text-slate-400 hover:border-white/40"
                          }`}>
                            {val === "hadir" ? "✓ Accepting Merge" : "✗ Connection Failed"}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  {rsvpStatus === "error" && (
                    <p className="text-rose-400 text-sm text-center">Transmisi gagal. Coba lagi.</p>
                  )}
                  <button
                    type="submit"
                    disabled={rsvpStatus === "loading"}
                    className="w-full py-4 rounded-lg bg-[#ecc813] text-[#0B132B] font-bold text-lg hover:bg-[#ecc813]/90 transition-all shadow-[0_0_20px_rgba(236,200,19,0.4)] hover:shadow-[0_0_30px_rgba(236,200,19,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {rsvpStatus === "loading" ? "Transmitting…" : "Confirm Attendance"}
                  </button>
                </form>
              </>
            )}
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-[#0B132B] py-8 text-center text-slate-500 text-sm">
        <p>
          © 2026 {coupleNames}. Programmed with{" "}
          <span className="material-symbols-outlined text-[12px] text-[#ecc813] align-middle mx-1">favorite</span>
        </p>
      </footer>
    </div>
  );
}
