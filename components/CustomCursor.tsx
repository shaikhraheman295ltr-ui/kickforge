"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };

    const tick = () => {
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      dotPos.current.x += (mx - dotPos.current.x) * 0.28;
      dotPos.current.y += (my - dotPos.current.y) * 0.28;
      ringPos.current.x += (mx - ringPos.current.x) * 0.1;
      ringPos.current.y += (my - ringPos.current.y) * 0.1;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dotPos.current.x - 3}px, ${dotPos.current.y - 3}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); document.body.style.cursor = "auto"; };
  }, []);

  return (
    <>
      <div ref={ringRef} className="fixed top-0 left-0 w-9 h-9 border border-[var(--accent)] rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform opacity-70" />
      <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--accent)] rounded-full pointer-events-none z-[10000] will-change-transform" />
    </>
  );
}
