"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal, RSVPModal, useSmoothScrollInit, type InvitationProps } from "./shared";
import MusicPlayer from "../MusicPlayer";

export function NeonNexusTemplate(props: InvitationProps) {
  const {
    guestName, token, eventName, dateStr, timeStr,
    location, coupleNames, story, venueAddress, musicUrl,
  } = props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "tidak">("hadir");
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(72);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRsvpStatus("loading");
    try {
      const res = await fetch(`/api/inv/${token}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, attendance }),
      });
      setRsvpStatus(res.ok ? "success" : "error");
    } catch {
      setRsvpStatus("error");
    }
  }

  const timeline = [
    { time: timeStr,      icon: "local_bar",  title: "Welcome Protocol",  desc: "Initialization sequence. Enjoy crafted cocktails and ambient networking." },
    { time: "19.00 WIB",  icon: "favorite",   title: "Main Execution",    desc: "The ceremonial merge. Vows rendered in high fidelity." },
    { time: "20.30 WIB",  icon: "music_note", title: "Infinite Loop Party", desc: "Synthesized beats, projections, and endless runtime." },
  ];

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
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#0B132B]/80 backdrop-blur-md px-6 md:px-10 py-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#ecc813]">celebration</span>
          <span className="text-lg font-bold text-white tracking-tight">Tech Invite</span>
        </div>
        <nav className="hidden md:flex items-center gap-7">
          {["Event", "Timeline", "Location", "RSVP"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-300 hover:text-[#ecc813] transition-colors">
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
      <section id="event" className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
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
            <span className="text-xs font-semibold uppercase tracking-wider text-[#ecc813]">{eventName}</span>
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
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#ecc813]/10 via-[#ecc813]/50 to-[#ecc813]/10 -translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(236,200,19,0.5)]" />
            <div className="space-y-12">
              {timeline.map(({ time, icon, title, desc }, i) => {
                const fromSide = i % 2 === 0 ? "right" : "left" as "left" | "right";
                return (
                  <div key={title} className={`relative flex flex-col md:flex-row items-center justify-between ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                    <div className="hidden md:block w-5/12" />
                    <div className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full bg-[#0B132B] border-2 border-[#ecc813] -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(236,200,19,0.4)]">
                      <span className="material-symbols-outlined text-[#ecc813] text-sm">{icon}</span>
                    </div>
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
                href={`https://maps.google.com/?q=${encodeURIComponent(venueAddress || location)}`}
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
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(venueAddress || location)}&output=embed`}
                  className="w-full h-full grayscale opacity-80"
                  loading="lazy"
                />
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
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
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
                          <input type="radio" name="attendance" value={val} checked={attendance === val} onChange={() => setAttendance(val)} className="sr-only" />
                          <div className={`rounded-lg border px-4 py-3 text-center transition-all text-sm font-medium ${
                            attendance === val ? "border-[#ecc813] bg-[#ecc813]/10 text-[#ecc813]" : "border-white/20 text-slate-400 hover:border-white/40"
                          }`}>
                            {val === "hadir" ? "✓ Accepting Merge" : "✗ Connection Failed"}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  {rsvpStatus === "error" && <p className="text-rose-400 text-sm text-center">Transmisi gagal. Coba lagi.</p>}
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

      <footer className="border-t border-white/10 bg-[#0B132B] py-8 text-center text-slate-500 text-sm">
        <p>
          © 2026 {coupleNames}. Programmed with{" "}
          <span className="material-symbols-outlined text-[12px] text-[#ecc813] align-middle mx-1">favorite</span>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-[#ecc813] hover:bg-[#ecc813]/90 text-slate-900" dark />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#ecc813" dark />}
    </div>
  );
}
