"use client";
import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
          // Write straight to the DOM: no React re-render per scroll frame.
          if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div className="fixed top-9 left-0 w-full h-[2px] z-[300] hidden sm:block"
         style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
      <div ref={barRef} className="h-full origin-left will-change-transform" style={{ transform: "scaleX(0)", backgroundColor: "var(--accent)", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
    </div>
  );
}
