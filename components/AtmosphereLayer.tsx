"use client";
import { useEffect, useRef } from "react";

export default function AtmosphereLayer({ type, opacity = 0.3, speed = 1 }: { type: "dust" | "bloom"; opacity?: number; speed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const SCALE = 0.25;
    let w = Math.floor(canvas.offsetWidth * SCALE);
    let h = Math.floor(canvas.offsetHeight * SCALE);
    canvas.width = w; canvas.height = h;

    const particles = Array.from({ length: type === "dust" ? 24 : 8 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      size: type === "dust" ? Math.random() * 1.2 + 0.3 : Math.random() * 40 + 20,
      vx: (Math.random() - 0.5) * 0.12 * speed, vy: -Math.random() * 0.08 * speed,
      alpha: Math.random() * 0.5, dir: Math.random() > 0.5 ? 1 : -1,
    }));

    let frame = 0;
    const draw = () => {
      frame++;
      if (frame % 3 !== 0) { animRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.alpha += p.dir * 0.003;
        if (p.alpha > 0.55 || p.alpha < 0.02) p.dir *= -1;
        if (p.x < -p.size) p.x = w + p.size;
        if (p.x > w + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = h + p.size;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(139,92,246,${p.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(139,92,246,0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [type, speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }} aria-hidden="true" />;
}
