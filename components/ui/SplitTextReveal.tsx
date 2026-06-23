"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

interface SplitTextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  scrollTrigger?: boolean;
}

export default function SplitTextReveal({
  children, as: Tag = "h2", className = "", delay = 0, stagger = 0.04, scrollTrigger = false,
}: SplitTextRevealProps) {
  const elRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) return;

    if (!el.dataset.split) {
      const chars = children.split("").map(c => c === " " ? " " : `<span class="inline-block reveal-char">${c}</span>`).join("");
      el.innerHTML = chars;
      el.dataset.split = "true";
    }

    const spans = el.querySelectorAll(".reveal-char");
    const ctx = gsap.context(() => {
      gsap.fromTo(spans,
        { opacity: 0, y: 60, rotateX: -40 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 0.7, stagger,
          ease: "power3.out", delay,
          scrollTrigger: scrollTrigger ? { trigger: el, start: "top 80%", toggleActions: "play none none none" } : undefined,
        }
      );
    }, el);

    return () => ctx.revert();
  }, [children, delay, stagger, scrollTrigger]);

  return <Tag ref={elRef} className={className}>{children}</Tag>;
}
