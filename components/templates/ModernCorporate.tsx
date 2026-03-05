"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeUp, stagger,
  SplitText, FloatIn, ClipReveal, Marquee,
  Reveal, RSVPModal, useSmoothScrollInit, type InvitationProps,
} from "./shared";
import MusicPlayer from "../MusicPlayer";

export function ModernCorporateTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(72);

  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden" style={{ fontFamily: "'Manrope', 'Segoe UI', sans-serif" }}>
      {/* ── NAV ── */}
      <header className="sticky z-50 flex w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md md:px-10" style={{ top: "var(--preview-bar-height, 0px)" }}>
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
            {/* Split-word hero title */}
            <h1 className="text-4xl font-black leading-tight tracking-tighter text-slate-900 md:text-5xl lg:text-6xl">
              <SplitText text={coupleNames || eventName} staggerDelay={0.07} y={50} delay={0.2} />
            </h1>
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
          {/* ClipReveal on hero image */}
          <ClipReveal className="relative lg:w-1/2 aspect-video rounded-2xl shadow-2xl">
            {gallery[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={gallery[0]} alt="Event" className="h-full w-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-indigo-400">event</span>
              </div>
            )}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border-2 border-dashed border-indigo-200" />
          </ClipReveal>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee
        items={["Wedding Day", "RSVP Now", "Hari Pernikahan", "Undangan Resmi"]}
        className="py-3 bg-indigo-50 text-indigo-400 text-xs font-bold tracking-widest uppercase border-y border-indigo-100"
        speed={22}
        separator="◆"
      />

      {/* ── EVENT DETAILS ── */}
      <section className="border-y border-slate-100 bg-slate-50/50 px-6 py-12 md:px-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <FloatIn staggerDelay={0.12}>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Rundown Acara</h2>
            <div className="relative border-l-2 border-slate-200 pl-8 space-y-8">
              {[
                { icon: "login", label: "Registrasi Tamu", desc: "Check-in dan penyambutan tamu undangan", time: timeStr },
                { icon: "celebration", label: "Acara Utama", desc: `${coupleNames || eventName}`, time: "" },
                { icon: "restaurant", label: "Resepsi & Makan", desc: "Makan bersama dan sesi foto", time: "" },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[41px] flex size-6 items-center justify-center rounded-full ${i === 0 ? "bg-indigo-600 text-white" : "bg-white border-2 border-slate-300 text-slate-400"} ring-4 ring-white`}>
                    <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                  </div>
                  <span className={`text-sm font-bold ${i === 0 ? "text-indigo-600" : "text-slate-400"}`}>{item.time}</span>
                  <h3 className="text-lg font-bold text-slate-900">{item.label}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </FloatIn>
          <Reveal>
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
          </Reveal>
        </div>
      </section>

      {gallery.filter(Boolean).length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <FloatIn className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Galeri</h2>
          </FloatIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.filter(Boolean).map((url, i) => (
              <ClipReveal key={i} className="aspect-video rounded-xl" delay={i * 0.07}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </ClipReveal>
            ))}
          </div>
        </section>
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
            Dibuat dengan ❤️ menggunakan <a href="/" className="text-indigo-600 font-semibold hover:underline">LuminaCard</a>
          </p>
        </div>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#4f46e5" />}
    </div>
  );
}
