"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/lenis";
import { useCartStore, useAuthStore } from "@/lib/store";

const NAV_ITEMS = [
  { label: "HOME",    href: "#hero" },
  { label: "DROPS",   href: "#featured" },
  { label: "EXPLORE", href: "#explore" },
  { label: "SALE",    href: "#sale" },
];

export default function FloatingNav() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("hero");
  const [menuState, setMenuState] = useState<"closed" | "open" | "closing">("closed");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { items, openCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const cartCount = items.reduce((a, i) => a + i.quantity, 0);

  useEffect(() => { useAuthStore.getState().checkSession(); }, []);

  useEffect(() => {
    const closeMs = 150;
    if (menuState === "closing") {
      const timer = setTimeout(() => setMenuState("closed"), closeMs);
      return () => clearTimeout(timer);
    }
  }, [menuState]);

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

  const toggleMenu = () => {
    if (menuState === "closed") setMenuState("open");
    else if (menuState === "open") setMenuState("closing");
  };

  const closeMenu = () => {
    if (menuState === "open") setMenuState("closing");
  };

  const navTo = (href: string) => {
    const el = document.querySelector(href);
    if (!el) return;
    const lenis = getLenis();
    lenis ? lenis.scrollTo(el as HTMLElement, { duration: 1.8 }) : el.scrollIntoView({ behavior: "smooth" });
    closeMenu();
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
          <button key={item.href} onClick={() => navTo(item.href)} aria-label={`Navigate to ${item.label}`}
            className={cn("relative px-4 py-2 rounded-full text-[10px] font-medium tracking-[0.18em] transition-all duration-300 cursor-pointer",
              active === item.href.replace("#", "") ? "text-[var(--background)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
            )}
          >
            {active === item.href.replace("#", "") && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-full bg-[var(--accent)]" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
        <button onClick={() => router.push(isAuthenticated ? "/login" : "/login")} aria-label={isAuthenticated ? "Profile" : "Sign in"} className="relative ml-2 px-4 py-2 rounded-full text-[10px] font-medium tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer">
          {isAuthenticated && user ? (
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-black text-[9px] font-bold flex items-center justify-center">{user.name[0].toUpperCase()}</span>
            </span>
          ) : (
            "LOGIN"
          )}
        </button>
        <button onClick={openCart} aria-label={`Shopping bag${cartCount > 0 ? ` (${cartCount} items)` : ""}`} className="relative ml-3 px-4 py-2 rounded-full text-[10px] font-medium tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer">
          BAG
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent)] text-black text-[9px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
        </button>
      </div>

      <button className="md:hidden glass w-12 h-12 rounded-full flex items-center justify-center cursor-pointer" onClick={toggleMenu} aria-label={menuState === "open" ? "Close menu" : "Open menu"}>
        <div className="t-icon-swap" data-state={menuState === "open" ? "b" : "a"}>
          <span className="t-icon" data-icon="a" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Menu size={18} style={{ color: "var(--accent)" }} />
          </span>
          <span className="t-icon" data-icon="b" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} style={{ color: "var(--accent)" }} />
          </span>
        </div>
      </button>

      <div ref={dropdownRef} data-origin="top-right"
        className={`md:hidden absolute top-16 right-0 w-48 py-3 px-2 rounded-2xl glass t-dropdown ${menuState === "open" ? "is-open" : menuState === "closing" ? "is-closing" : ""}`}>
        {NAV_ITEMS.map(item => (
          <button key={item.href} onClick={() => navTo(item.href)} aria-label={`Navigate to ${item.label}`}
            className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-medium tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer">
            {item.label}
          </button>
        ))}
        <button onClick={() => { router.push("/login"); closeMenu(); }} aria-label={isAuthenticated ? "Profile" : "Sign in"}
          className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-medium tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer">
          {isAuthenticated && user ? `PROFILE (${user.name[0].toUpperCase()})` : "LOGIN"}
        </button>
        <button onClick={() => { openCart(); closeMenu(); }} aria-label="Open shopping bag" className="w-full text-left px-4 py-3 rounded-xl text-[11px] font-medium tracking-widest text-[var(--accent)] cursor-pointer">
          BAG {cartCount > 0 && `(${cartCount})`}
        </button>
      </div>
    </motion.nav>
  );
}
