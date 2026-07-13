"use client";
import { useEffect, useRef } from "react";

interface Orb {
  x: number; y: number; vx: number; vy: number; r: number; hue: number; alpha: number;
}

export default function LoginBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const orbs: Orb[] = Array.from({ length: 20 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 180 + 80,
      hue: Math.random() > 0.5 ? 260 : 320,
      alpha: Math.random() * 0.03 + 0.01,
    }));

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r || o.x > w + o.r) o.vx *= -1;
        if (o.y < -o.r || o.y > h + o.r) o.vy *= -1;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue}, 70%, 60%, ${o.alpha})`);
        g.addColorStop(1, `hsla(${o.hue}, 70%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />
  );
}
