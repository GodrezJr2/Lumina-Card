/**
 * useSmoothScroll — hook untuk smooth scrolling
 *
 * Pendekatan: CSS scroll-behavior: smooth (native, reliable, tidak jitter)
 * + scroll-margin-top pada section target untuk offset sticky header.
 *
 * Cara pakai:
 *   const { scrollTo } = useSmoothScroll();
 *   scrollTo("#rsvp");          // scroll ke element dengan id
 *   scrollTo(0);                // scroll ke top
 */

import { useCallback } from "react";

type ScrollTarget = string | number | HTMLElement;

interface SmoothScrollOptions {
  duration?: number;
  offset?: number;    // offset dari top (misal: tinggi header)
  easing?: (t: number) => number;
}

export function useSmoothScroll() {
  const scrollTo = useCallback(
    (target: ScrollTarget, options: SmoothScrollOptions = {}) => {
      const { offset = 72 } = options;

      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }

      let el: HTMLElement | null = null;
      if (typeof target === "string") {
        el = document.querySelector(target) as HTMLElement | null;
      } else if (target instanceof HTMLElement) {
        el = target;
      }

      if (!el) return;

      const rect = el.getBoundingClientRect();
      const targetY = Math.max(0, window.scrollY + rect.top - offset);
      window.scrollTo({ top: targetY, behavior: "smooth" });
    },
    []
  );

  return { scrollTo };
}

/**
 * initSmoothScrollLinks — intercept semua <a href="#..."> di halaman
 * agar pakai smooth scroll, sambil juga menghitung offset dari sticky header.
 * Dipanggil sekali saat komponen mount.
 */
export function initSmoothScrollLinks(offset = 72) {
  // Aktifkan CSS smooth scroll secara global
  document.documentElement.style.scrollBehavior = "smooth";

  // Set scroll-margin-top pada semua elemen yang punya id (section targets)
  function applyScrollMargins() {
    const elements = document.querySelectorAll("[id]");
    elements.forEach((el) => {
      (el as HTMLElement).style.scrollMarginTop = `${offset + 8}px`;
    });
  }

  applyScrollMargins();

  function handler(e: Event) {
    const anchor = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
    if (!anchor) return;

    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash) as HTMLElement | null;
    if (!target) return;

    e.preventDefault();

    const rect = target.getBoundingClientRect();
    const targetY = Math.max(0, window.scrollY + rect.top - offset);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  document.addEventListener("click", handler);
  return () => {
    document.removeEventListener("click", handler);
    document.documentElement.style.scrollBehavior = "";
  };
}
