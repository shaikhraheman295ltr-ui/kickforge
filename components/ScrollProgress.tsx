"use client";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-8 left-0 w-full h-[2px] z-[300]" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
      <div className="h-full transition-all duration-150 ease-out" style={{ width: `${progress * 100}%`, backgroundColor: "var(--accent)", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
    </div>
  );
}
