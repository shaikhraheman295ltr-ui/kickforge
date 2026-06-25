"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const FOLDER = "v1";
const FRAMES = 247;
const BATCH = 6;

const pad = (n: number) => String(n + 1).padStart(5, "0");
const frameUrl = (index: number) => `/frames/${FOLDER}/frame${pad(index)}.jpg`;

const COPY_SEQUENCE = [
  { text: "KICKFORGE",           type: "brand",  start: 0,  end: 20 },
  { text: "BUILT TO MOVE.",      type: "line",   start: 15, end: 35 },
  { text: "NOT TO MATCH.",       type: "line",   start: 30, end: 48 },
  { text: "Every step. Decided.", type: "italic", start: 40, end: 55 },
  { text: "BEFORE YOU TOOK IT.", type: "line",   start: 48, end: 60 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalRef = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>(new Array(FRAMES).fill(null));
  const currentFrame = useRef(0);
  const autoSpinRef = useRef<number>(0);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollingRef = useRef(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = images.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: cw, height: ch } = canvas;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cap = 1280;
    const resize = () => { canvas.width = Math.min(window.innerWidth, cap); canvas.height = Math.min(window.innerHeight, cap * 0.5625); drawFrame(currentFrame.current); };
    resize();
    window.addEventListener("resize", resize);

    let loaded = 0, cancelled = false;

    const loadImage = (index: number): Promise<void> => {
      return new Promise(resolve => {
        if (cancelled || images.current[index]) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          if (cancelled) { resolve(); return; }
          images.current[index] = img;
          loaded++;
          const pct = Math.round((loaded / FRAMES) * 100);
          setLoadProgress(pct);
          window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: pct } }));
          if (index === currentFrame.current) drawFrame(index);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(index);
      });
    };

    const preload = async () => {
      await loadImage(0);
      drawFrame(0);

      const coarse = Array.from({ length: Math.ceil(FRAMES / 12) }, (_, k) => k * 12);
      if (!cancelled) await Promise.all(coarse.map(loadImage));

      for (let batch = 1; batch < FRAMES && !cancelled; batch += BATCH) {
        const jobs = [];
        for (let j = batch; j < Math.min(batch + BATCH, FRAMES); j++) {
          if (!images.current[j]) jobs.push(loadImage(j));
        }
        if (jobs.length > 0) await Promise.all(jobs);
      }
    };
    preload();

    return () => { cancelled = true; window.removeEventListener("resize", resize); };
  }, [drawFrame]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const wrapper = document.getElementById("hero-root");
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper, start: "top top", end: "bottom bottom", scrub: true,
        onUpdate: (self) => {
          const target = Math.min(Math.floor(self.progress * (FRAMES - 1)), FRAMES - 1);
          let best = target;
          if (!images.current[target]) {
            for (let o = 1; o < FRAMES; o++) {
              const lo = target - o, hi = target + o;
              if (lo >= 0 && images.current[lo]) { best = lo; break; }
              if (hi < FRAMES && images.current[hi]) { best = hi; break; }
            }
          }
          if (best !== currentFrame.current) { currentFrame.current = best; drawFrame(best); }
        },
      });

      COPY_SEQUENCE.forEach((item, i) => {
        const el = copyRefs.current[i];
        if (!el) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: wrapper, start: `${item.start}% top`, end: `${item.end}% top`, scrub: 1 } });
        tl.fromTo(el, { opacity: 0, z: -1200, scale: 0.5, rotationX: 12 }, { opacity: 1, z: 0, scale: 1, rotationX: 0, duration: 0.4, ease: "power2.out" })
          .to(el, { opacity: 0, z: 1200, scale: 2, duration: 0.6, ease: "power2.in" });
      });

      if (finalRef.current) {
        gsap.fromTo(finalRef.current, { opacity: 0, y: 80 }, {
          opacity: 1, y: 0, ease: "power3.out",
          scrollTrigger: { trigger: wrapper, start: "75% top", end: "92% top", scrub: true },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [drawFrame]);

  // slow idle rotation
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let forward = true, tick = 0;
    const spin = () => {
      tick++;
      if (tick % 3 !== 0) { autoSpinRef.current = requestAnimationFrame(spin); return; }
      const step = forward ? 1 : -1;
      let next = currentFrame.current + step;
      if (next >= FRAMES || next < 0) { forward = !forward; next = currentFrame.current + (forward ? 1 : -1); }
      if (next >= 0 && next < FRAMES && images.current[next]) {
        currentFrame.current = next;
        drawFrame(next);
      }
      autoSpinRef.current = requestAnimationFrame(spin);
    };

    const onScroll = () => {
      scrollingRef.current = true;
      if (autoSpinRef.current) cancelAnimationFrame(autoSpinRef.current);
      if (idleRef.current) clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => { scrollingRef.current = false; autoSpinRef.current = requestAnimationFrame(spin); }, 4000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    idleRef.current = setTimeout(() => { autoSpinRef.current = requestAnimationFrame(spin); }, 4000);
    return () => { window.removeEventListener("scroll", onScroll); if (autoSpinRef.current) cancelAnimationFrame(autoSpinRef.current); if (idleRef.current) clearTimeout(idleRef.current); };
  }, [drawFrame]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ delay: 1.8 });
    if (overlayRef.current) tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0);
    if (copyRefs.current[0]) tl.fromTo(copyRefs.current[0], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0.2);
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="sticky top-0 w-full h-screen overflow-hidden" style={{ zIndex: 10 }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      <div ref={overlayRef} className="absolute inset-0 pointer-events-none z-[2]" aria-hidden="true"
        style={{ background: "linear-gradient(180deg, rgba(5,5,8,0.5) 0%, transparent 30%, transparent 60%, rgba(5,5,8,0.7) 100%), linear-gradient(90deg, rgba(5,5,8,0.3) 0%, transparent 20%, transparent 80%, rgba(5,5,8,0.3) 100%)" }} />

      <div className="absolute inset-0 pointer-events-none z-[3]" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 15%, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

      <div className="absolute inset-0 flex items-center justify-center z-[5]" style={{ perspective: "1000px" }}>
        <div className="relative w-full max-w-[90vw] text-center" style={{ transformStyle: "preserve-3d" }}>
          {COPY_SEQUENCE.map((item, i) => (
            <div key={i} ref={el => { copyRefs.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center opacity-0 will-change-transform"
              style={{ backfaceVisibility: "hidden" }}>
              {item.type === "brand" ? (
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(5rem, 15vw, 16rem)", lineHeight: 0.85, letterSpacing: "0.04em", color: "#FFFFFF", textShadow: "0 0 80px rgba(139,92,246,0.25), 0 4px 40px rgba(0,0,0,0.8)" }}>
                  {item.text}
                </h1>
              ) : item.type === "italic" ? (
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2rem, 5vw, 5rem)", fontStyle: "italic", color: "var(--accent)", fontWeight: 300, letterSpacing: "-0.02em", textShadow: "0 0 40px rgba(139,92,246,0.4)" }}>
                  {item.text}
                </p>
              ) : (
                <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 4rem)", letterSpacing: "0.12em", color: "#FFFFFF", textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}>
                  {item.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div ref={finalRef} className="absolute inset-0 flex flex-col items-center justify-center z-[6] opacity-0 pointer-events-none">
        <div className="text-center px-6">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 14rem)", lineHeight: 0.85, letterSpacing: "0.02em", color: "#FFFFFF" }}>
            MOVE WITH
          </h2>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 14rem)", lineHeight: 0.85, letterSpacing: "0.02em", color: "var(--accent)" }}>
            PURPOSE
          </h2>
          <p style={{ marginTop: "2rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            KICKFORGE — Where Motion Meets Craft
          </p>
        </div>
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
