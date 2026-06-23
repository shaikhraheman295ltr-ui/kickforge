"use client";
import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import AtmosphereLayer from "./AtmosphereLayer";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" },
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      <AtmosphereLayer type="dust" opacity={0.15} speed={0.3} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase" }}>— 04 / JOIN THE MOVEMENT</span>
        <h2 ref={headingRef} style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 13rem)", lineHeight: 0.85, color: "var(--ink)", letterSpacing: "0.02em", marginTop: "1rem" }}>
          FIRST TO THE DROP
        </h2>
        <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "1.1rem", maxWidth: "36ch", margin: "1.5rem auto 0", lineHeight: 1.6 }}>
          Get early access to new drops, exclusive colorways, and sale alerts before anyone else.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10 max-w-md mx-auto">
          <input type="email" placeholder="your@email.com"
            className="flex-1 px-5 py-4 rounded-xl bg-transparent text-sm outline-none"
            style={{ border: "1px solid var(--border)", color: "var(--ink)", fontFamily: "var(--font-mono)", caretColor: "var(--accent)" }} />
          <button className="px-8 py-4 rounded-xl font-bold text-black text-xs tracking-widest transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
            JOIN DROP LIST
          </button>
        </div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.15em", marginTop: "1rem", textTransform: "uppercase" }}>
          © {new Date().getFullYear()} KICKFORGE. NO SPAM. EVER.
        </p>
      </div>
    </section>
  );
}
