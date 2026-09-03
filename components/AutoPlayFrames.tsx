"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";

interface AutoPlayerProps {
  folder: string;
  frames: number;
  speed?: number;
  label?: string;
  prefix?: string;
}

function AutoPlayer({ folder, frames: total, speed = 1, label, prefix = "frame_" }: AutoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const idxRef = useRef(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    const cap = 640;
    const resize = () => { canvas.width = Math.min(canvas.offsetWidth, cap); canvas.height = Math.min(canvas.offsetHeight, cap * 0.75); };
    resize();
    window.addEventListener("resize", resize);

    const pad = (n: number) => String(n).padStart(3, "0");
    const loaded: HTMLImageElement[] = new Array(total);
    imagesRef.current = loaded;
    let drawnPoster = false;
    let isActive = false;
    const loadedChunks = new Set<number>();
    const CHUNK_SIZE = 25;

    const getChunk = (index: number) => Math.floor(index / CHUNK_SIZE);

    const drawPoster = () => {
      if (drawnPoster || !canvas || !visibleRef.current) return;
      const firstLoaded = imagesRef.current.find(img => img && img.complete && img.naturalWidth > 0);
      if (!firstLoaded) return;
      drawnPoster = true;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const scale = Math.max(canvas.width / firstLoaded.naturalWidth, canvas.height / firstLoaded.naturalHeight);
      ctx.drawImage(firstLoaded, (canvas.width - firstLoaded.naturalWidth * scale) / 2, (canvas.height - firstLoaded.naturalHeight * scale) / 2, firstLoaded.naturalWidth * scale, firstLoaded.naturalHeight * scale);
    };

    const loadChunk = (chunkIdx: number) => {
      if (loadedChunks.has(chunkIdx) || chunkIdx < 0 || chunkIdx >= Math.ceil(total / CHUNK_SIZE)) return;
      loadedChunks.add(chunkIdx);
      const start = chunkIdx * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, total);
      for (let i = start; i < end; i++) {
        if (loaded[i]) continue;
        const img = new Image();
        img.onload = () => { loaded[i] = img; drawPoster(); };
        img.onerror = () => {};
        img.src = `/frames/${folder}/${prefix}${pad(i + 1)}.jpg`;
        loaded[i] = img;
      }
    };

    const obs = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
      if (e.isIntersecting && !isActive) {
        isActive = true;
        loadChunk(0);
        loadChunk(1);
        animRef.current = requestAnimationFrame(draw);
      }
      if (!e.isIntersecting) {
        drawnPoster = false;
      }
      drawPoster();
    }, { threshold: 0 });
    obs.observe(canvas);

    let speedFactor = speed;
    let lastTime = 0;
    const draw = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;
      const advance = 0.4 * speedFactor * (dt / 16.67);
      if (!document.hidden && visibleRef.current) {
        const idx = Math.floor(idxRef.current) % total;
        const currentChunk = getChunk(idx);
        loadChunk(currentChunk + 1);
        loadChunk(currentChunk + 2);
        const img = imagesRef.current[idx];
        if (img && img.complete && img.naturalWidth > 0) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
            const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale;
            ctx.drawImage(img, (canvas.width - sw) / 2, (canvas.height - sh) / 2, sw, sh);
            idxRef.current += advance;
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    return () => { obs.disconnect(); cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [folder, total, speed]);

  const fallbackSrc = `/frames/${folder}/${prefix}${String(1).padStart(3, "0")}.jpg`;

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fallbackSrc} alt={label ? `${label} product animation` : "Product animation"} className="absolute inset-0 w-full h-full object-cover" />
      <canvas ref={canvasRef} className="relative w-full h-full" role="img" aria-label={label ? `${label} animation` : "Product animation"} />
      {label && (
        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>{label}</span>
        </div>
      )}
    </div>
  );
}

export default function AutoPlayFrames() {
  return (
    <section className="relative py-24 px-6 md:px-16" style={{ backgroundColor: "var(--background)" }}>
      <div className="mb-10 t-stagger">
        <span className="t-stagger-line t-stagger-line--1" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase" }}>
          — 03.5 / MOTION GALLERY
        </span>
        <h2 className="t-stagger-line t-stagger-line--2" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 0.85, color: "var(--ink)", letterSpacing: "0.02em" }}>
          IN MOTION
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AutoPlayer folder="2.1" frames={150} speed={1.0} label="ANGLE 01" />
        <AutoPlayer folder="2.2" frames={150} speed={1.2} label="ANGLE 02" />
        <AutoPlayer folder="2.3" frames={213} speed={0.8} label="ANGLE 03" prefix="ezgif-frame-" />
      </div>
    </section>
  );
}
