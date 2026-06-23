"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import products from "@/server/products.json";

function useCountdown(targetDate: Date) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

export default function SaleSection() {
  const [target, setTarget] = useState<Date | null>(null);
  const time = useCountdown(target ?? new Date());
  const { addItem, openCart } = useCartStore();
  const saleProducts = products.filter(p => p.onSale);

  useEffect(() => { setTarget(new Date(Date.now() + 3 * 24 * 3600000)); }, []);

  return (
    <section id="sale" className="relative py-24 px-6 md:px-16" style={{ backgroundColor: "var(--background)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,45,45,0.08) 0%, transparent 70%)" }} />

      <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--accent-2)", textTransform: "uppercase" }}>— 03 / LIMITED TIME</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 9vw, 10rem)", lineHeight: 0.85, color: "var(--ink)", letterSpacing: "0.02em" }}>SALE</h2>
        </div>

        <div className="flex gap-4 items-end">
          {target ? [{ v: time.d, l: "DAYS" }, { v: time.h, l: "HRS" }, { v: time.m, l: "MIN" }, { v: time.s, l: "SEC" }].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 flex items-center justify-center rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--accent-2)", boxShadow: "0 0 20px rgba(255,45,45,0.15)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.6rem", fontWeight: 700, color: "var(--accent-2)" }}>{String(v).padStart(2, "0")}</span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.2em", color: "var(--muted)" }}>{l}</span>
            </div>
          )) : [{ l: "DAYS" }, { l: "HRS" }, { l: "MIN" }, { l: "SEC" }].map(({ l }) => (
            <div key={l} className="flex flex-col items-center gap-1">
              <div className="w-16 h-16 flex items-center justify-center rounded-xl" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--accent-2)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.6rem", fontWeight: 700, color: "var(--accent-2)" }}>--</span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.2em", color: "var(--muted)" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {saleProducts.map(p => (
          <div key={p.id} className="relative rounded-xl overflow-hidden cursor-pointer group" style={{ backgroundColor: "var(--surface)", border: "1px solid rgba(255,45,45,0.2)" }}>
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full" style={{ backgroundColor: "var(--accent-2)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#fff", letterSpacing: "0.1em" }}>
              -{Math.round(((p.price - (p.salePrice ?? p.price)) / p.price) * 100)}% OFF
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="p-6">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--ink)", letterSpacing: "0.04em" }}>{p.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-2)", fontSize: "1.4rem", fontWeight: 700 }}>${p.salePrice}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "0.95rem", textDecoration: "line-through" }}>${p.price}</span>
              </div>
              <button onClick={() => { addItem({ id: p.id, name: p.name, price: p.salePrice ?? p.price, image: p.image, size: p.sizes[0], quantity: 1 }); openCart(); }}
                className="mt-4 w-full py-3 rounded-lg font-bold text-xs tracking-widest transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--accent-2)", color: "#fff", fontFamily: "var(--font-mono)" }}>
                GRAB DEAL
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
