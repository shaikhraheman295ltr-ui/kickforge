"use client";
import { useEffect, useState, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onProgress = (e: CustomEvent<{ percent: number }>) => {
      setProgress(e.detail.percent);
      if (e.detail.percent >= 100) setDone(true);
    };
    window.addEventListener("hero-progress", onProgress as EventListener);
    const fallback = setTimeout(() => setDone(true), 6000);
    return () => { window.removeEventListener("hero-progress", onProgress as EventListener); clearTimeout(fallback); };
  }, []);

  useEffect(() => {
    if (!done || !containerRef.current) return;
    const tl = gsap.timeline();
    tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.5 }, 0.1)
      .to(barRef.current, { scaleX: 0, transformOrigin: "right", duration: 0.5 }, 0.1)
      .to(containerRef.current, { yPercent: -100, duration: 1.0, ease: "expo.inOut" }, 0.4);
  }, [done]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[99999] bg-[var(--background)] flex flex-col items-center justify-center pointer-events-none">
      <div ref={textRef} className="flex flex-col items-center gap-4">
        <div className="font-display text-[var(--accent)] text-4xl tracking-[0.4em]" style={{ fontFamily: "var(--font-display)" }}>
          KICKFORGE
        </div>
        <div className="text-[var(--muted)] text-xs tracking-widest font-mono">LOADING DROP...</div>
        <div className="w-56 h-[2px] bg-white/5 mt-4 relative overflow-hidden">
          <div ref={barRef} className="absolute top-0 left-0 h-full bg-[var(--accent)] transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-[var(--muted)] text-xs font-mono mt-1">{progress}%</div>
      </div>
    </div>
  );
}
