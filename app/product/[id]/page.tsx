"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import products from "@/server/products.json";
import { useCartStore } from "@/lib/store";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = products.find(p => p.id === parseInt(id, 10));
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? null);
  const { addItem, openCart } = useCartStore();
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="text-center">
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "4rem", color: "var(--muted)" }}>DROP NOT FOUND</h1>
          <button onClick={() => router.push("/")} className="mt-6 px-6 py-3 rounded-xl text-black font-bold text-xs tracking-widest cursor-pointer" style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            BACK TO HOME
          </button>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.salePrice ?? product.price, image: product.image, size: selectedSize ?? product.sizes[0], quantity: 1 });
    setAdded(true);
    setTimeout(() => { openCart(); setAdded(false); }, 400);
  };

  return (
    <main id="main-content" className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm cursor-pointer" style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", letterSpacing: "0.1em" }}>
          <ArrowLeft size={16} /> BACK
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--accent)", textTransform: "uppercase" }}>{product.category}</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 8vw, 8rem)", lineHeight: 0.85, color: "var(--ink)", letterSpacing: "0.02em", marginTop: "0.5rem" }}>{product.name}</h1>
            <p style={{ color: "var(--muted)", fontSize: "1rem", marginTop: "1.5rem", lineHeight: 1.7, fontFamily: "var(--font-body)", maxWidth: "45ch" }}>{product.description}</p>
            <div className="flex items-center gap-4 mt-6">
              {product.onSale && product.salePrice && (
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-2)", fontSize: "2.5rem", fontWeight: 700 }}>${product.salePrice}</span>
              )}
              <span style={{ fontFamily: "var(--font-mono)", fontSize: product.onSale ? "1.4rem" : "2.5rem", color: product.onSale ? "var(--muted)" : "var(--ink)", textDecoration: product.onSale ? "line-through" : "none" }}>
                ${product.price}
              </span>
            </div>
            {product.onSale && (
              <span className="inline-block mt-3 px-4 py-1 rounded-full text-xs tracking-widest" style={{ backgroundColor: "var(--accent-2)", color: "#fff", fontFamily: "var(--font-mono)" }}>
                -{Math.round(((product.price - (product.salePrice ?? product.price)) / product.price) * 100)}% OFF
              </span>
            )}

            {/* Colors */}
            <div className="mt-8">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.75rem" }}>COLORWAY</p>
              <div className="flex gap-3">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} aria-label={`Color ${c}`}
                    className="w-8 h-8 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor: c,
                      border: selectedColor === c ? "2px solid #fff" : "2px solid transparent",
                      boxShadow: selectedColor === c ? `0 0 12px ${c}` : "none",
                      transform: selectedColor === c ? "scale(1.15)" : "scale(1)",
                    }} />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.75rem" }}>SELECT SIZE</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: number) => (
                  <button key={s} onClick={() => setSelectedSize(s)} aria-label={`Size ${s}`}
                    className="w-12 h-12 rounded-lg text-sm transition-all duration-200 cursor-pointer"
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

            <button onClick={handleAdd} disabled={added}
              className="mt-10 w-full py-5 rounded-xl font-bold tracking-widest text-black transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-3"
              style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.9rem", letterSpacing: "0.2em" }}>
              <ShoppingBag size={18} />
              {added ? "ADDED!" : "ADD TO BAG"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
