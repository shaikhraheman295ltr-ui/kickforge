"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const FRAMES = 231;
const pad = (n: number) => String(n + 1).padStart(5, "0");
const frameUrl = (index: number) => `/frames/v2/frame${pad(index)}.jpg`;

export default function V2Section() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const idxRef = useRef(0);
  const animRef = useRef(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const obs = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; }, { threshold: 0.1 });
    obs.observe(canvas);

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const loaded: HTMLImageElement[] = new Array(FRAMES);
    imagesRef.current = loaded;
    for (let i = 0; i < FRAMES; i++) {
      const img = new Image();
      img.onload = () => { loaded[i] = img; };
      img.onerror = () => {};
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
            const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
            ctx.drawImage(img, (canvas.width - img.naturalWidth * scale) / 2, (canvas.height - img.naturalHeight * scale) / 2, img.naturalWidth * scale, img.naturalHeight * scale);
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
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1 });
      tl.fromTo("#v2-heading", { opacity: 0, y: 50, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" })
        .fromTo("#v2-sub", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
        .to("#v2-heading, #v2-sub", { opacity: 0, y: -40, duration: 0.8, ease: "power2.in" }, "+=3")
        .fromTo("#v2-final", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "-=0.4");
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none z-[2]" aria-hidden="true"
        style={{ background: "linear-gradient(180deg, rgba(5,5,8,0.3) 0%, transparent 30%, rgba(5,5,8,0.6) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none z-[3]" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 50% 30% at 50% 80%, rgba(236,72,153,0.08) 0%, transparent 60%)" }} />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-[5] px-6" id="v2-heading">
        <div className="text-center">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 13rem)", lineHeight: 0.85, letterSpacing: "0.04em", color: "#FFFFFF", textShadow: "0 0 80px rgba(236,72,153,0.2), 0 4px 40px rgba(0,0,0,0.8)" }}>
            THE FINAL FRAME
          </h1>
          <p id="v2-sub" style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(1.2rem, 3vw, 3rem)", fontStyle: "italic", color: "var(--accent-2)", marginTop: "1rem", textShadow: "0 0 40px rgba(236,72,153,0.4)" }}>
            This is where legends end.
          </p>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-[6] opacity-0 pointer-events-none" id="v2-final">
        <div className="text-center px-6">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 14rem)", lineHeight: 0.85, letterSpacing: "0.02em", color: "#FFFFFF" }}>
            MOVE WITH
          </h2>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 14rem)", lineHeight: 0.85, letterSpacing: "0.02em", color: "var(--accent-2)" }}>
            PURPOSE
          </h2>
          <p style={{ marginTop: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            KICKFORGE — Where Motion Meets Craft
          </p>
        </div>
      </div>
    </section>
  );
}
