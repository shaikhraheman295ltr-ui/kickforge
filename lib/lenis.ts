"use client";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  if (lenisInstance) return lenisInstance;
  lenisInstance = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.4,
  });
  return lenisInstance;
}

export function getLenis(): Lenis | null { return lenisInstance; }
export function destroyLenis(): void {
  if (lenisInstance) { lenisInstance.destroy(); lenisInstance = null; }
}
