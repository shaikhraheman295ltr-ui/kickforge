"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const FOLDER = "v1";
const FRAMES = 247;

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
    let lastReportedMilestone = 0;
    let started = false;

    for (let i = 0; i < FRAMES; i++) {
      const img = new Image();
      img.onload = () => { loadedCount++; loaded[i] = img; const pct = Math.round((loadedCount / FRAMES) * 100); if (pct >= lastReportedMilestone + 5) { lastReportedMilestone = pct; setLoadProgress(pct); window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: pct } })); } drawPoster(); };
      img.onerror = () => { loadedCount++; };
      img.src = frameUrl(i);
      loaded[i] = img;
    }

    const drawPoster = () => {
      if (started) return;
      const firstLoaded = imagesRef.current.find(img => img && img.complete && img.naturalWidth > 0);
      if (!firstLoaded || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(firstLoaded, 0, 0, canvas.width, canvas.height);
    };

    let lastTime = 0;
    const draw = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;
      const speed = 0.4 * (dt / 16.67);
      if (!document.hidden && visibleRef.current) {
        const idx = Math.floor(idxRef.current) % FRAMES;
        const img = imagesRef.current[idx];
        if (img && img.complete && img.naturalWidth > 0) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            idxRef.current += speed;
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    const onStart = () => {
      started = true;
      idxRef.current = 0;
      lastTime = 0;
      animRef.current = requestAnimationFrame(draw);
    };
    window.addEventListener("hero-start", onStart, { once: true });
    const fallbackStart = setTimeout(onStart, 8000);

    return () => { obs.disconnect(); cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); window.removeEventListener("hero-start", onStart); clearTimeout(fallbackStart); };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const wrapper = document.getElementById("hero-root");
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const ctx = gsap.context(() => {
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
  }, []);

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
