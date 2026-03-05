"use client";

/**
 * SmoothScrollProvider
 * --------------------
 * Virtual smooth scrolling menggunakan Lenis (LERP + requestAnimationFrame),
 * teknik yang sama dipakai ochi.design, Linear Interpolation per-frame
 * mencegat input mouse/trackpad dan menggeser halaman secara gradual.
 *
 * Cara kerja:
 *  1. Lenis menghitung "target scroll position" dari setiap wheel event
 *  2. Setiap frame (rAF), posisi scroll diinterpolasi: current += (target - current) * lerp
 *  3. Hasilnya gerakan smooth seperti mentega — tidak tick-by-tick lagi
 *
 * Diintegrasikan dengan Framer Motion via ScrollTrigger agar animasi
 * scroll-based (useScroll, ParallaxDiv, ClipReveal, dll) tetap sinkron.
 */

import { useEffect, useRef, createContext, useContext } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/** Hook untuk mengakses instance Lenis dari komponen child (opsional) */
export function useLenis() {
  return useContext(LenisContext);
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Init Lenis dengan konfigurasi ochi.design-style
    const lenis = new Lenis({
      duration: 1.2,          // Durasi inertia (detik) — lebih tinggi = lebih smooth
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease-out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,      // Smooth mouse wheel
      wheelMultiplier: 1,     // Speed wheel
      touchMultiplier: 2,     // Speed touch/trackpad
      infinite: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis dengan Framer Motion's scroll system
    // Framer Motion membaca window.scrollY — Lenis override ini via scroll event
    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      // Paksa window.scrollY agar Framer Motion useScroll terbaca nilai virtual scroll Lenis
      // Ini penting agar ParallaxDiv, ClipReveal, dll tetap akurat
      Object.defineProperty(window, "scrollY", {
        configurable: true,
        get: () => scroll,
      });
      // Dispatch synthetic scroll event agar Framer Motion useScroll tetap sinkron
      window.dispatchEvent(new Event("scroll", { bubbles: false }));
    });

    // rAF loop — jantung dari smooth scroll
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis saat ada modal/overlay terbuka (prevent double scroll)
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const handleModalOpen = () => lenis.stop();
    const handleModalClose = () => lenis.start();

    window.addEventListener("lenis:stop", handleModalOpen);
    window.addEventListener("lenis:start", handleModalClose);

    return () => {
      window.removeEventListener("lenis:stop", handleModalOpen);
      window.removeEventListener("lenis:start", handleModalClose);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
