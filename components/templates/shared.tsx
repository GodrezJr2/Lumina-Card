"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion, useInView, AnimatePresence,
  useScroll, useTransform, useSpring,
  type MotionValue,
} from "framer-motion";
import { initSmoothScrollLinks } from "@/hooks/useSmoothScroll";

// ── Easing & base variants ────────────────────────────────────────────────────
export const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const easeIn:  [number, number, number, number] = [0.55, 0, 1, 0.45];

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};
export const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.8 } },
};
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// ── Reveal (legacy, keep for backward compat) ─────────────────────────────────
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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

// ── FloatIn — tiap child float up satu per satu (ochi.design style) ───────────
/**
 * Wrap sekelompok elemen agar muncul satu per satu saat scroll.
 * Setiap child langsung di-stagger, tidak perlu variants.
 */
export function FloatIn({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
  y = 48,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: staggerDelay, delayChildren: delay },
    },
  };
  const item = {
    hidden: { opacity: 0, y, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.75, ease: easeOut },
    },
  };

  // Wrap each direct child in a motion.div automatically
  const kids = Array.isArray(children) ? children : [children];
  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {kids.map((child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── SplitText — split per word/char, muncul satu per satu ────────────────────
/**
 * Animasi teks ala ochi.design: setiap kata muncul slide up dari bawah.
 *
 * @example
 * <SplitText text="Nichols & Merlyn" className="text-6xl font-bold" />
 */
export function SplitText({
  text,
  className,
  delay = 0,
  staggerDelay = 0.07,
  y = 60,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  y?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-40px" });

  const words = text.split(" ");

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: staggerDelay, delayChildren: delay } },
  };
  const word = {
    hidden: { opacity: 0, y, rotateX: 30 },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.65, ease: easeOut },
    },
  };

  return (
    <motion.span
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className ?? ""}`}
      style={{ perspective: 600 }}
    >
      {words.map((w, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span variants={word} className="inline-block">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// ── TextReveal — teks "tertulis" karakter demi karakter (ochi style slow) ─────
export function TextReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const chars = text.split("");

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.03, delayChildren: delay } },
  };
  const char = {
    hidden: { opacity: 0, y: 12 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
  };

  return (
    <motion.span
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {chars.map((c, i) =>
        c === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <motion.span key={i} variants={char} className="inline-block">
            {c}
          </motion.span>
        )
      )}
    </motion.span>
  );
}

// ── ParallaxDiv — parallax container pakai useScroll ─────────────────────────
/**
 * Membungkus elemen dengan efek parallax vertical.
 * speedFactor 0.3 = bergerak 30% lebih lambat dari scroll (halus).
 */
export function ParallaxDiv({
  children,
  className,
  speedFactor = 0.35,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  speedFactor?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Smoothed progress to eliminate jank
  const smoothed = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const y = useTransform(smoothed, [0, 1], [`${-speedFactor * 100 * 0.5}%`, `${speedFactor * 100 * 0.5}%`]);

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`} style={style}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

// ── ClipReveal — gambar muncul dengan clip-path wipe dari bawah ───────────────
/**
 * Gambar/div muncul dengan efek wipe dari bawah (seperti reveal di situs premium).
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`} style={style}>
      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 }}
        animate={inView
          ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
          : { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 }}
        transition={{ duration: 0.9, ease: easeOut, delay }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── Marquee — infinite horizontal scroll text (ochi tagline ticker) ───────────
export function Marquee({
  items,
  className,
  speed = 30,
  separator = "✦",
}: {
  items: string[];
  className?: string;
  speed?: number;
  separator?: string;
}) {
  const text = items.join(` ${separator} `) + ` ${separator} `;
  // Duplicate for seamless loop
  const line = `${text}${text}`;

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ""}`}>
      <motion.span
        className="inline-block"
        animate={{ x: [0, "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {line}
      </motion.span>
    </div>
  );
}

// ── CountUp — angka naik saat masuk viewport ──────────────────────────────────
export function CountUp({
  to,
  suffix = "",
  className,
  duration = 1.5,
}: {
  to: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useSpring(0, { stiffness: 80, damping: 20, mass: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      motionVal.set(to);
    }
  }, [inView, motionVal, to]);

  useEffect(() => {
    const unsub = motionVal.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [motionVal]);

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  );
}

// ── useParallaxValue — utility hook to get a MotionValue from element scroll ──
export function useParallaxValue(
  ref: React.RefObject<HTMLElement | null>,
  outputRange: [string, string]
): MotionValue<string> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothed = useSpring(scrollYProgress, { stiffness: 60, damping: 18 });
  return useTransform(smoothed, [0, 1], outputRange);
}

/**
 * Hook — inisialisasi smooth scroll untuk semua anchor link di dalam template.
 */
export function useSmoothScrollInit(headerHeight = 72) {
  useEffect(() => {
    const previewWrapper = document.querySelector("[style*='--preview-bar-height']") as HTMLElement | null;
    const isInPreview = !!previewWrapper;
    const offset = isInPreview ? 56 + headerHeight : headerHeight;
    return initSmoothScrollLinks(offset);
  }, [headerHeight]);
}

// ── InvitationProps ───────────────────────────────────────────────────────────
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
  /** URL musik latar (mp3 langsung, YouTube embed URL, atau string kosong) */
  musicUrl?: string;
}

// ── RSVP Modal ────────────────────────────────────────────────────────────────
interface RSVPModalProps {
  token: string;
  guestName: string;
  onClose: () => void;
  accentClass: string;
  dark?: boolean;
}

export function RSVPModal({ token, guestName, onClose, accentClass, dark }: RSVPModalProps) {
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
