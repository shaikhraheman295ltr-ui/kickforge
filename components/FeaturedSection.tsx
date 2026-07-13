"use client";
import { useState, useRef } from "react";
import { useCartStore } from "@/lib/store";
import products from "@/server/products.json";

export default function FeaturedSection() {
  const { addItem, openCart } = useCartStore();

  const handleAddToBag = (product: typeof products[0], size: number) => {
    addItem({ id: product.id, name: product.name, price: product.salePrice ?? product.price, image: product.image, size, quantity: 1 });
    openCart();
  };

  return (
    <section id="featured" className="relative py-32 px-6 md:px-16" style={{ backgroundColor: "var(--background)" }}>
      <div className="mb-16 t-stagger">
        <span className="t-stagger-line t-stagger-line--1" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase" }}>
          — 01 / LATEST DROP
        </span>
        <h2 className="t-stagger-line t-stagger-line--2" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 9vw, 10rem)", lineHeight: 0.85, letterSpacing: "0.02em", color: "var(--ink)" }}>
          FEATURED
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.filter(p => p.featured).map(product => (
          <TiltCard key={product.id} product={product} onAddToBag={(size) => handleAddToBag(product, size)} />
        ))}
      </div>
    </section>
  );
}

function TiltCard({ product, onAddToBag }: { product: typeof products[0]; onAddToBag: (size: number) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.02)`;
  };

  const onMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    setHovered(false);
  };

  const hexToHue = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    if (max !== min) {
      const d = max - min;
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    }
    return h;
  };

  const baseHue = hexToHue(product.colors[0]);
  const targetHue = hexToHue(activeColor);
  const hueRotate = targetHue - baseHue;

  return (
    <div ref={cardRef} onMouseMove={onMouseMove} onMouseEnter={() => setHovered(true)} onMouseLeave={onMouseLeave}
      className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
      style={{ transition: "transform 0.1s ease", backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        style={{
          transform: hovered ? "scale(1.06)" : "scale(1)",
          filter: `hue-rotate(${hueRotate}deg) saturate(1.1)`,
        }} />

      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(5,5,8,0.85) 100%)" }} />

      <div className="absolute inset-0 rounded-xl transition-opacity duration-400"
        style={{ opacity: hovered ? 1 : 0, boxShadow: `inset 0 0 0 1px ${activeColor}40` }} />

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          #{String(product.id).padStart(2, "0")}
        </p>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", lineHeight: 0.9, color: "#fff", letterSpacing: "0.02em" }}>
          {product.name}
        </h3>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: "1.1rem", marginTop: "0.4rem" }}>
          ${product.salePrice ?? product.price}
        </p>

        {/* Color dots */}
        <div className="flex gap-2 mt-3">
          {product.colors.map(c => (
            <button key={c} onClick={(e) => { e.stopPropagation(); setActiveColor(c); }} aria-label={`Color ${c}`}
              className="w-5 h-5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: c,
                border: activeColor === c ? "2px solid #fff" : "2px solid transparent",
                boxShadow: activeColor === c ? `0 0 8px ${c}` : "none",
                transform: activeColor === c ? "scale(1.2)" : "scale(1)",
              }} />
          ))}
        </div>

        <div className="overflow-hidden" style={{ maxHeight: hovered ? "100px" : "0px", transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
          {/* Size selector */}
          <div className="flex flex-wrap gap-1 mt-3">
            {product.sizes.slice(0, 6).map(s => (
              <button key={s} onClick={(e) => { e.stopPropagation(); setSelectedSize(s); }} aria-label={`Size ${s}`}
                className="w-11 h-11 rounded text-xs transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily: "var(--font-mono)",
                  border: selectedSize === s ? "1px solid var(--accent)" : "1px solid var(--border)",
                  color: selectedSize === s ? "var(--accent)" : "var(--muted)",
                  backgroundColor: selectedSize === s ? "rgba(139,92,246,0.12)" : "var(--surface-2)",
                }} >
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => onAddToBag(selectedSize)}
            className="mt-2 w-full py-3 rounded-lg text-black font-bold text-xs tracking-widest transition-opacity cursor-pointer"
            style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-mono)", opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease 0.1s" }}>
            ADD TO BAG
          </button>
        </div>
      </div>
    </div>
  );
}
