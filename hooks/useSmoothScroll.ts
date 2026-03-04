/**
 * useSmoothScroll — hook untuk smooth scrolling pakai anime.js
 * 
 * Cara pakai:
 *   const { scrollTo } = useSmoothScroll();
 *   scrollTo("#rsvp");          // scroll ke element dengan id
 *   scrollTo(0);                // scroll ke top
 *   scrollTo(element, 800);     // custom duration
 */

import { useCallback } from "react";

type ScrollTarget = string | number | HTMLElement;

interface SmoothScrollOptions {
  duration?: number;
  offset?: number;    // offset dari top (misal: tinggi header)
  easing?: (t: number) => number;
}

// Easing functions
const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export function useSmoothScroll() {
  const scrollTo = useCallback(
    (target: ScrollTarget, options: SmoothScrollOptions = {}) => {
      const {
        duration = 900,
        offset = 72,
        easing = easeOutExpo,
      } = options;

      // Resolve target position
      let targetY = 0;

      if (typeof target === "number") {
        targetY = target;
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        targetY = window.scrollY + rect.top - offset;
      } else if (target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        targetY = window.scrollY + rect.top - offset;
      }

      targetY = Math.max(0, Math.min(targetY, document.body.scrollHeight - window.innerHeight));

      const startY = window.scrollY;
      const distance = targetY - startY;
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easing(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    },
    []
  );

  return { scrollTo, easeInOutQuart, easeOutExpo };
}

/**
 * initSmoothScrollLinks — intercept semua <a href="#..."> di halaman
 * agar pakai smooth scroll anime.js.
 * Dipanggil sekali saat komponen mount.
 */
export function initSmoothScrollLinks(offset = 72) {
  function handler(e: Event) {
    const anchor = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
    if (!anchor) return;

    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();

    const rect = target.getBoundingClientRect();
    const targetY = Math.max(0, window.scrollY + rect.top - offset);
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 900;
    const startTime = performance.now();

    function step(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      window.scrollTo(0, startY + distance * ease);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}
