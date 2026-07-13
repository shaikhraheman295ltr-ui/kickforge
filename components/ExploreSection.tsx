"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import products from "@/server/products.json";

type Category = "all" | "running" | "lifestyle" | "training" | "outdoor" | "sale";
const FILTERS: Category[] = ["all", "running", "lifestyle", "training", "outdoor", "sale"];

export default function ExploreSection() {
  const [active, setActive] = useState<Category>("all");
  const [selected, setSelected] = useState<typeof products[0] | null>(null);
  const [modalState, setModalState] = useState<"closed" | "open" | "closing">("closed");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    if (modalState === "closing") {
      const timer = setTimeout(() => { setModalState("closed"); setSelected(null); }, 150);
      return () => clearTimeout(timer);
    }
  }, [modalState]);

  const openModal = (product: typeof products[0]) => {
    setSelected(product);
    setSelectedSize(product.sizes[0]);
    setModalState("open");
  };

  const closeModal = () => {
    if (modalState === "open") setModalState("closing");
  };

  const addAndClose = () => {
    if (!selected) return;
    addItem({ id: selected.id, name: selected.name, price: selected.salePrice ?? selected.price, image: selected.image, size: selectedSize ?? selected.sizes[0], quantity: 1 });
    openCart();
    closeModal();
  };

  const filtered = products.filter(p =>
    active === "all" ? true : active === "sale" ? p.onSale : p.category === active
  );

  return (
    <section id="explore" className="relative py-24 px-6 md:px-16" style={{ backgroundColor: "var(--surface)" }}>
      <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="t-stagger">
          <span className="t-stagger-line t-stagger-line--1" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase" }}>— 02 / FULL CATALOG</span>
          <h2 className="t-stagger-line t-stagger-line--2" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 8vw, 9rem)", lineHeight: 0.85, color: "var(--ink)", letterSpacing: "0.02em" }}>EXPLORE</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActive(f)} aria-pressed={active === f}
              className="px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer"
              style={{
                fontFamily: "var(--font-mono)",
                backgroundColor: active === f ? "var(--accent)" : "var(--surface-2)",
                color: active === f ? "#000" : "var(--muted)",
                border: active === f ? "none" : "1px solid var(--border)",
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden"
            style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}
            role="button" tabIndex={0} aria-label={`View ${product.name}`} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(product); } }}
            onClick={() => openModal(product)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--ink)", letterSpacing: "0.04em" }}>{product.name}</h3>
                {product.onSale && <span style={{ backgroundColor: "var(--accent-2)", color: "#fff", fontSize: "0.6rem", fontFamily: "var(--font-mono)", padding: "2px 8px", borderRadius: "4px", letterSpacing: "0.1em" }}>SALE</span>}
              </div>
              <div className="flex items-center gap-3 mt-1">
                {product.onSale && product.salePrice && <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: "0.95rem" }}>${product.salePrice}</span>}
                <span style={{ fontFamily: "var(--font-mono)", color: product.onSale ? "var(--muted)" : "var(--ink)", fontSize: "0.95rem", textDecoration: product.onSale ? "line-through" : "none" }}>${product.price}</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.4rem", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{product.category}</p>
            </div>
          </div>
        ))}
      </div>

      {modalState !== "closed" && selected && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 cursor-pointer" onClick={closeModal}
          style={{ backgroundColor: "rgba(5,5,8,0.85)", backdropFilter: "blur(12px)" }}>
          <div className={`t-modal relative w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col md:flex-row ${modalState === "open" ? "is-open" : "is-closing"}`}
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 aspect-square relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <button onClick={closeModal} aria-label="Close details" className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer z-20" style={{ backgroundColor: "var(--surface-2)", color: "var(--muted)" }}>
                  <X size={16} />
                </button>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--accent)", textTransform: "uppercase" }}>{selected.category}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", lineHeight: 0.9, color: "var(--ink)", letterSpacing: "0.04em", marginTop: "0.5rem" }}>{selected.name}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "1rem", lineHeight: 1.6 }}>{selected.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  {selected.onSale && selected.salePrice && <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: "2rem" }}>${selected.salePrice}</span>}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: selected.onSale ? "1.2rem" : "2rem", color: selected.onSale ? "var(--muted)" : "var(--ink)", textDecoration: selected.onSale ? "line-through" : "none" }}>${selected.price}</span>
                </div>
                <div className="mt-6">
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.75rem" }}>SELECT SIZE</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.sizes.map((s: number) => (
                      <button key={s} onClick={() => setSelectedSize(s)} aria-label={`Size ${s}`}
                        className="w-11 h-11 rounded-lg text-sm transition-all duration-200 cursor-pointer"
                        style={{
                          fontFamily: "var(--font-mono)",
                          border: selectedSize === s ? "1px solid var(--accent)" : "1px solid var(--border)",
                          color: selectedSize === s ? "var(--accent)" : "var(--muted)",
                          backgroundColor: selectedSize === s ? "rgba(139,92,246,0.12)" : "var(--surface-2)",
                          transform: selectedSize === s ? "scale(1.1)" : "scale(1)",
                          boxShadow: selectedSize === s ? "0 0 8px rgba(139,92,246,0.3)" : "none",
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={addAndClose}
                className="mt-6 w-full py-4 rounded-xl font-bold tracking-widest text-black transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "0.2em" }}>
                ADD TO BAG
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
