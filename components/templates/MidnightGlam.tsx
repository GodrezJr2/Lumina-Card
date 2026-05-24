"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  stagger, fadeUp, fadeIn,
  SplitText, FloatIn, ClipReveal, ParallaxDiv,
  RSVPModal, useSmoothScrollInit, type InvitationProps,
} from "./shared";
import MusicPlayer from "../MusicPlayer";

/**
 * MidnightGlam — dark luxury wedding template.
 * Deep midnight blue + gold dust particles, ultra-elegant, cinematic.
 * Uses canvas dust + parallax + magnetic hover.
 */
function GoldDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const dust: { x: number; y: number; r: number; vx: number; vy: number; o: number }[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      dust.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2 - 0.1,
        o: Math.random() * 0.7 + 0.3,
      });
    }

    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dust.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < -10) d.y = canvas.height + 10;
        if (d.x < -10) d.x = canvas.width + 10;
        if (d.x > canvas.width + 10) d.x = -10;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
        grad.addColorStop(0, `rgba(212, 175, 90, ${d.o})`);
        grad.addColorStop(1, "rgba(212, 175, 90, 0)");
        ctx.fillStyle = grad;
        ctx.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;
}

export function MidnightGlamTemplate(props: InvitationProps) {
  const { guestName, token, eventName, dateStr, timeStr, location, coupleNames, story, venueAddress, gallery, musicUrl } = props;
  const [rsvpOpen, setRsvpOpen] = useState(false);
  useSmoothScrollInit(64);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.15]), { stiffness: 80, damping: 25 });
  const heroOpacity = useSpring(useTransform(scrollYProgress, [0, 0.7], [1, 0]), { stiffness: 100, damping: 25 });

  const cleanGallery = gallery.filter(Boolean);
  const heroImg = cleanGallery[0] ?? "https://images.unsplash.com/photo-1469371670807-013ccf25cb87?w=1600&q=80";
  const portraitImg = cleanGallery[1] ?? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80";

  return (
    <div
      className="min-h-screen antialiased overflow-x-hidden"
      style={{
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        background: "#0A0E1A",
        color: "#F5E9D7",
      }}
    >
      <GoldDust />

      {/* ── HEADER ── */}
      <header
        className="sticky z-40 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 bg-[#0A0E1A]/70 backdrop-blur-xl border-b border-[#D4AF5A]/15"
        style={{ top: "var(--preview-bar-height, 0px)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-full border border-[#D4AF5A] flex items-center justify-center text-[#D4AF5A]">
            <span className="material-symbols-outlined text-[18px] leading-none">diamond</span>
          </span>
          <h2 className="text-lg sm:text-xl font-semibold tracking-[0.15em] text-[#F5E9D7]" style={{ fontFamily: "'Italianno', cursive", fontSize: "1.6rem" }}>
            {coupleNames || eventName}
          </h2>
        </div>
        <button
          onClick={() => setRsvpOpen(true)}
          className="h-10 px-5 sm:px-6 rounded-full border border-[#D4AF5A] bg-transparent text-[#D4AF5A] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF5A] hover:text-[#0A0E1A] transition-all"
        >
          RSVP
        </button>
      </header>

      {/* ── HERO — cinematic parallax ── */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImg}')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/60 via-[#0A0E1A]/75 to-[#0A0E1A]" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-3xl mx-auto text-center space-y-8 px-5 sm:px-8"
        >
          <motion.div variants={fadeIn} className="flex items-center justify-center gap-4 text-[#D4AF5A]">
            <span className="h-px w-16 sm:w-24 bg-[#D4AF5A]/60" />
            <span className="text-xs tracking-[0.4em] font-light uppercase">A Wedding Of</span>
            <span className="h-px w-16 sm:w-24 bg-[#D4AF5A]/60" />
          </motion.div>

          <h1
            className="text-6xl sm:text-8xl md:text-[10rem] leading-[0.9] text-[#F5E9D7]"
            style={{ fontFamily: "'Italianno', 'Cormorant Garamond', cursive" }}
          >
            <SplitText text={coupleNames || eventName} staggerDelay={0.15} y={80} />
          </h1>

          <motion.p variants={fadeUp} className="text-[#D4AF5A] text-xs sm:text-sm tracking-[0.5em] uppercase font-light">
            ✦ Two Souls, One Forever ✦
          </motion.p>

          <motion.div variants={fadeUp} className="space-y-1 pt-4">
            <p className="text-xs tracking-[0.4em] text-[#D4AF5A]/70 uppercase">Reserved For</p>
            <p className="text-3xl sm:text-4xl text-[#F5E9D7]" style={{ fontFamily: "'Italianno', cursive" }}>
              {guestName}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 pt-2">
            <div className="text-center">
              <p className="text-[10px] tracking-[0.3em] text-[#D4AF5A] uppercase mb-1">Date</p>
              <p className="text-base sm:text-lg text-[#F5E9D7]/90 font-light">{dateStr}</p>
            </div>
            <span className="hidden sm:block w-px h-8 bg-[#D4AF5A]/40" />
            <div className="text-center">
              <p className="text-[10px] tracking-[0.3em] text-[#D4AF5A] uppercase mb-1">Time</p>
              <p className="text-base sm:text-lg text-[#F5E9D7]/90 font-light">{timeStr}</p>
            </div>
            <span className="hidden sm:block w-px h-8 bg-[#D4AF5A]/40" />
            <div className="text-center">
              <p className="text-[10px] tracking-[0.3em] text-[#D4AF5A] uppercase mb-1">Venue</p>
              <p className="text-base sm:text-lg text-[#F5E9D7]/90 font-light">{(location.split(",")[0] ?? location)}</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 pt-6">
            <button
              onClick={() => setRsvpOpen(true)}
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#D4AF5A] text-[#0A0E1A] rounded-none text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#F5E9D7] transition-all duration-500 overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <span className="material-symbols-outlined text-base leading-none relative z-10">mail</span>
              <span className="relative z-10">Confirm Attendance</span>
            </button>
            <Link href={`/inv/${token}/qr`} className="text-xs text-[#D4AF5A]/70 hover:text-[#D4AF5A] flex items-center gap-1.5 tracking-wider transition mt-2">
              <span className="material-symbols-outlined text-base leading-none">qr_code_2</span>
              View QR Ticket
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-[#D4AF5A]/60"
        >
          <span className="material-symbols-outlined text-2xl">expand_more</span>
        </motion.div>
      </section>

      {/* ── STORY ── */}
      <section className="relative max-w-5xl mx-auto px-5 sm:px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center z-10">
        <ClipReveal className="aspect-[3/4] overflow-hidden border border-[#D4AF5A]/30 shadow-[0_30px_80px_rgba(212,175,90,0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portraitImg} alt="Pasangan" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
        </ClipReveal>

        <FloatIn className="space-y-6 text-center md:text-left" staggerDelay={0.12}>
          <span className="text-[#D4AF5A] text-xs tracking-[0.4em] uppercase font-light">─── Our Story</span>
          <h2 className="text-5xl sm:text-6xl text-[#F5E9D7]" style={{ fontFamily: "'Italianno', cursive" }}>
            From This Day, Forever
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#F5E9D7]/80 italic font-light">
            {story || `Dengan cinta yang melebihi kata-kata, kami mengundang ${guestName} untuk hadir dalam malam paling istimewa kami.`}
          </p>
          <div className="border border-[#D4AF5A]/30 px-6 py-5 bg-[#0A0E1A]/40">
            <p className="text-[10px] tracking-[0.35em] text-[#D4AF5A] uppercase">Venue</p>
            <p className="text-lg text-[#F5E9D7] font-light mt-1">{location}</p>
            {venueAddress && <p className="text-xs text-[#F5E9D7]/60 mt-2 italic">{venueAddress}</p>}
          </div>
        </FloatIn>
      </section>

      {/* ── GALLERY ── */}
      {cleanGallery.length > 0 && (
        <section className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 z-10">
          <FloatIn className="text-center mb-10">
            <span className="text-[#D4AF5A] text-xs tracking-[0.4em] uppercase font-light">─── Memories</span>
            <h2 className="text-5xl sm:text-6xl text-[#F5E9D7] mt-4" style={{ fontFamily: "'Italianno', cursive" }}>
              Captured Moments
            </h2>
          </FloatIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {cleanGallery.map((url, i) => (
              <ClipReveal
                key={i}
                className={`${i === 0 ? "col-span-2 row-span-2 aspect-[4/5]" : "aspect-[3/4]"} overflow-hidden border border-[#D4AF5A]/20`}
                delay={i * 0.08}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-110 transition-all duration-1000" />
              </ClipReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="relative border-t border-[#D4AF5A]/20 py-16 px-6 text-center z-10">
        <span className="material-symbols-outlined text-[#D4AF5A] text-3xl">diamond</span>
        <h3 className="text-6xl sm:text-7xl text-[#F5E9D7] mt-4" style={{ fontFamily: "'Italianno', cursive" }}>
          {coupleNames || eventName}
        </h3>
        <p className="text-xs tracking-[0.4em] text-[#D4AF5A] mt-3 uppercase">{dateStr}</p>
        <button
          onClick={() => setRsvpOpen(true)}
          className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 border border-[#D4AF5A] text-[#D4AF5A] text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#D4AF5A] hover:text-[#0A0E1A] transition"
        >
          <span className="material-symbols-outlined text-base leading-none">mail</span>
          RSVP
        </button>
        <p className="mt-12 text-[10px] tracking-widest text-[#D4AF5A]/50 uppercase">
          Crafted with elegance by <a href="/" className="hover:text-[#D4AF5A]">LuminaCard</a>
        </p>
      </footer>

      {rsvpOpen && <RSVPModal token={token} guestName={guestName} onClose={() => setRsvpOpen(false)} accentClass="bg-[#D4AF5A] hover:bg-[#F5E9D7] text-[#0A0E1A] shadow-amber-200" />}
      {musicUrl && <MusicPlayer musicUrl={musicUrl} accentColor="#D4AF5A" dark />}
    </div>
  );
}
