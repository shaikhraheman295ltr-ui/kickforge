"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/lenis";
import { useCartStore } from "@/lib/store";

const NAV_ITEMS = [
  { label: "HOME",    href: "#hero" },
  { label: "DROPS",   href: "#featured" },
  { label: "EXPLORE", href: "#explore" },
  { label: "SALE",    href: "#sale" },
];

export default function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, openCart } = useCartStore();
  const cartCount = items.reduce((a, i) => a + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 80);
      const sections = ["hero", "featured", "explore", "sale", "cta"];
      const pos = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= pos) { setActive(sections[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navTo = (href: string) => {
    const el = document.querySelector(href);
    if (!el) return;
    const lenis = getLenis();
    lenis ? lenis.scrollTo(el as HTMLElement, { duration: 1.8 }) : el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -16 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-12 left-1/2 -translate-x-1/2 z-[500] pointer-events-auto"
    >
      <div className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full glass">
        <span className="font-mono text-[var(--accent)] text-xs tracking-widest px-3 mr-2 font-bold" style={{ fontFamily: "var(--font-display)", fontSize: "18px" }}>KF</span>
        {NAV_ITEMS.map(item => (
          <button key={item.href} onClick={() => navTo(item.href)}
            className={cn("relative px-4 py-2 rounded-full text-[10px] font-medium tracking-[0.18em] transition-all duration-300",
              active === item.href.replace("#", "") ? "text-[var(--background)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
            )}
          >
            {active === item.href.replace("#", "") && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-full bg-[var(--accent)]" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
        <button onClick={openCart} className="relative ml-3 px-4 py-2 rounded-full text-[10px] font-medium tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
          BAG
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent)] text-black text-[9px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
        </button>
      </div>

      <button className="md:hidden glass w-12 h-12 rounded-full flex items-center justify-center" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="text-[var(--accent)] font-mono text-xs font-bold">KF</span>
      </button>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }}
            className="md:hidden absolute top-16 right-0 w-48 py-3 px-2 rounded-2xl glass">
            {NAV_ITEMS.map(item => (
              <button key={item.href} onClick={() => navTo(item.href)}
                className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-medium tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
                {item.label}
              </button>
            ))}
            <button onClick={openCart} className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-medium tracking-widest text-[var(--accent)]">
              BAG {cartCount > 0 && `(${cartCount})`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
