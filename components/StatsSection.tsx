"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const STATS = [
  { value: 50, suffix: "K+", label: "ATHLETES TRUSTED" },
  { value: 120, suffix: "+", label: "COUNTRIES SHIPPED" },
  { value: 400, suffix: "+", label: "DESIGNS DROPPED" },
  { value: 99, suffix: "%", label: "SATISFACTION" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) { setCount(target); return; }
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (animated.current) return;
          animated.current = true;
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 2,
            ease: "power3.out",
            onUpdate: () => setCount(Math.floor(obj.v)),
          });
        },
      });
    }, el);
    return () => ctx.revert();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative py-24 px-6 md:px-16 overflow-hidden" style={{ backgroundColor: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(stat => (
          <div key={stat.label} className="text-center">
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 5vw, 5rem)", lineHeight: 0.9, color: "var(--accent)", letterSpacing: "0.02em" }}>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.25em", color: "var(--muted)", marginTop: "0.75rem", textTransform: "uppercase" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
