"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const FOLDER = "v1";
const FRAMES = 247;

const pad = (n: number) => String(n + 1).padStart(5, "0");
const frameUrl = (index: number) => `/frames/${FOLDER}/frame${pad(index)}.jpg`;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const idxRef = useRef(0);
  const animRef = useRef(0);
  const visibleRef = useRef(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const cap = 1280;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const obs = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; }, { threshold: 0.1 });
    obs.observe(canvas);

    const resize = () => { canvas.width = Math.min(window.innerWidth, cap); canvas.height = Math.min(window.innerHeight, cap * 0.5625); };
    resize();
    window.addEventListener("resize", resize);

    const loaded: HTMLImageElement[] = new Array(FRAMES);
    imagesRef.current = loaded;
    let loadedCount = 0;

    for (let i = 0; i < FRAMES; i++) {
      const img = new Image();
      img.onload = () => { loadedCount++; loaded[i] = img; const pct = Math.round((loadedCount / FRAMES) * 100); setLoadProgress(pct); window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: pct } })); };
      img.onerror = () => { loadedCount++; };
      img.src = frameUrl(i);
      loaded[i] = img;
    }

    const draw = () => {
      if (!document.hidden && visibleRef.current) {
        const idx = Math.floor(idxRef.current) % FRAMES;
        const img = imagesRef.current[idx];
        if (img && img.complete && img.naturalWidth > 0) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        }
      }
      idxRef.current += 0.5;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => { obs.disconnect(); cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ delay: 1.8 });
    if (overlayRef.current) tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0);
    if (textRef.current) tl.fromTo(textRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0.2);
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      <div ref={overlayRef} className="absolute inset-0 pointer-events-none z-[2]" aria-hidden="true"
        style={{ background: "linear-gradient(180deg, rgba(5,5,8,0.5) 0%, transparent 30%, transparent 60%, rgba(5,5,8,0.7) 100%), linear-gradient(90deg, rgba(5,5,8,0.3) 0%, transparent 20%, transparent 80%, rgba(5,5,8,0.3) 100%)" }} />

      <div className="absolute inset-0 pointer-events-none z-[3]" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 15%, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

      <div ref={textRef} className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(5rem, 15vw, 16rem)", lineHeight: 0.85, letterSpacing: "0.04em", color: "#FFFFFF", textShadow: "0 0 80px rgba(139,92,246,0.25), 0 4px 40px rgba(0,0,0,0.8)" }}>
          KICKFORGE
        </h1>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[6] flex flex-col items-center gap-2">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>SCROLL</span>
        <div className="w-[1px] h-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[var(--accent)]" style={{ animation: "scrollPulse 2s ease-in-out infinite" }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(0.1); transform-origin: top; opacity: 0.2; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
        }
      `}</style>
    </section>
  );
}
