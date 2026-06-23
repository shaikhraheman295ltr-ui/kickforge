"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const FOLDERS = ["v1", "v2"];
const FRAMES_PER_FOLDER = 150;
const TOTAL_FRAMES = FOLDERS.length * FRAMES_PER_FOLDER;

const pad = (n: number) => String(n).padStart(3, "0");
const frameUrl = (folderIdx: number, frameIdx: number) =>
  `/frames/${FOLDERS[folderIdx]}/frame_${pad(frameIdx + 1)}.jpg`;

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
  const images = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
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
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; drawFrame(currentFrame.current); };
    resize();
    window.addEventListener("resize", resize);

    let loaded = 0, cancelled = false;

    const loadImage = (absIdx: number): Promise<void> => {
      const folderIdx = Math.floor(absIdx / FRAMES_PER_FOLDER);
      const frameIdx = absIdx % FRAMES_PER_FOLDER;
      return new Promise(resolve => {
        if (cancelled || images.current[absIdx]) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          if (cancelled) { resolve(); return; }
          images.current[absIdx] = img;
          loaded++;
          const pct = Math.round((loaded / TOTAL_FRAMES) * 100);
          setLoadProgress(pct);
          window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: pct } }));
          if (absIdx === currentFrame.current) drawFrame(absIdx);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(folderIdx, frameIdx);
      });
    };

    const preload = async () => {
      await loadImage(0);
      drawFrame(0);

      const coarse = Array.from({ length: Math.ceil(TOTAL_FRAMES / 10) }, (_, k) => k * 10);
      if (!cancelled) await Promise.all(coarse.map(loadImage));

      for (let i = 0; i < TOTAL_FRAMES && !cancelled; i++) {
        await loadImage(i);
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
          const target = Math.min(Math.floor(self.progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
          let best = target;
          if (!images.current[target]) {
            for (let o = 1; o < TOTAL_FRAMES; o++) {
              const lo = target - o, hi = target + o;
              if (lo >= 0 && images.current[lo]) { best = lo; break; }
              if (hi < TOTAL_FRAMES && images.current[hi]) { best = hi; break; }
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
          scrollTrigger: { trigger: wrapper, start: "55% top", end: "75% top", scrub: true },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [drawFrame]);

  // 360° auto-spin on idle
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let forward = true;
    const startSpin = () => {
      cancelAnimationFrame(autoSpinRef.current);
      const spin = () => {
        const step = forward ? 1 : -1;
        let next = currentFrame.current + step;
        if (next >= TOTAL_FRAMES || next < 0) { forward = !forward; next = currentFrame.current + (forward ? 1 : -1); }
        if (next >= 0 && next < TOTAL_FRAMES && images.current[next]) {
          currentFrame.current = next;
          drawFrame(next);
        }
        autoSpinRef.current = requestAnimationFrame(spin);
      };
      autoSpinRef.current = requestAnimationFrame(spin);
    };

    const onScroll = () => {
      scrollingRef.current = true;
      cancelAnimationFrame(autoSpinRef.current);
      if (idleRef.current) clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => { scrollingRef.current = false; startSpin(); }, 3000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    idleRef.current = setTimeout(startSpin, 3000);
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(autoSpinRef.current); if (idleRef.current) clearTimeout(idleRef.current); };
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
            Scroll to explore the drop
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
