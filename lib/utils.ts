import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clampVal = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
export const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  ((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;
