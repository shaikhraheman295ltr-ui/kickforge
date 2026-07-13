"use client";
import { useRef, useState } from "react";
import { Check } from "lucide-react";
import AtmosphereLayer from "./AtmosphereLayer";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section ref={sectionRef} id="cta" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      <AtmosphereLayer type="dust" opacity={0.15} speed={0.3} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto t-stagger">
        <span className="t-stagger-line t-stagger-line--1" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase" }}>— 04 / JOIN THE MOVEMENT</span>
        <h2 className="t-stagger-line t-stagger-line--2" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 12vw, 13rem)", lineHeight: 0.85, color: "var(--ink)", letterSpacing: "0.02em", marginTop: "1rem" }}>
          FIRST TO THE DROP
        </h2>
        <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "1.1rem", maxWidth: "36ch", margin: "1.5rem auto 0", lineHeight: 1.6 }}>
          Get early access to new drops, exclusive colorways, and sale alerts before anyone else.
        </p>
        {submitted ? (
          <div className="flex flex-col items-center gap-4 mt-10">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.15)", border: "1px solid var(--accent)" }}>
              <Check size={24} style={{ color: "var(--accent)" }} />
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--accent)", letterSpacing: "0.1em" }}>YOU&apos;RE ON THE LIST</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>First drops. Your inbox. No spam. Ever.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center mt-10 max-w-md mx-auto" noValidate>
            <label htmlFor="cta-email" className="sr-only">Email address</label>
            <input id="cta-email" type="email" placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
              autoComplete="email" aria-invalid={!!error}
              className="flex-1 px-5 py-4 rounded-xl bg-transparent text-sm outline-none cursor-pointer"
              style={{ border: `1px solid ${error ? "var(--accent-2)" : "var(--border)"}`, color: "var(--ink)", fontFamily: "var(--font-mono)", caretColor: "var(--accent)" }} />
            <button type="submit" disabled={loading} className="px-8 py-4 rounded-xl font-bold text-black text-xs tracking-widest transition-all hover:opacity-90 disabled:opacity-60 cursor-pointer"
              style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
              {loading ? "JOINING..." : "JOIN DROP LIST"}
            </button>
          </form>
        )}
        {error && !submitted && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent-2)", letterSpacing: "0.15em", marginTop: "0.75rem", textAlign: "center", textTransform: "uppercase" }}>{error}</p>
        )}
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.15em", marginTop: "1rem", textTransform: "uppercase" }}>
          © {new Date().getFullYear()} KICKFORGE. NO SPAM. EVER.
        </p>
      </div>
    </section>
  );
}
