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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pad = (n: number) => String(n).padStart(3, "0");
    const loaded: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < total; i++) {
      const img = new Image();
      img.onload = () => { loadedCount++; if (loadedCount === total) imagesRef.current = loaded; };
      img.onerror = () => { loadedCount++; };
      img.src = `/frames/${folder}/${prefix}${pad(i + 1)}.jpg`;
      loaded.push(img);
    }

    let speedFactor = speed;
    const draw = () => {
      if (loadedCount >= total && imagesRef.current.length > 0) {
        const idx = Math.floor(idxRef.current) % total;
        const img = imagesRef.current[idx];
        if (img && img.complete && img.naturalWidth > 0) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
            const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale;
            ctx.drawImage(img, (canvas.width - sw) / 2, (canvas.height - sh) / 2, sw, sh);
          }
        }
      }
      idxRef.current += 0.5 * speedFactor;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [folder, total, speed]);

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
      <canvas ref={canvasRef} className="w-full h-full" />
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
      <div className="mb-10">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase" }}>
          — 03.5 / MOTION GALLERY
        </span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 0.85, color: "var(--ink)", letterSpacing: "0.02em" }}>
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
