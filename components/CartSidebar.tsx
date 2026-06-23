"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400]" style={{ backgroundColor: "rgba(5,5,8,0.6)", backdropFilter: "blur(8px)" }}
            onClick={closeCart} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[500] flex flex-col"
            style={{ backgroundColor: "var(--surface)", borderLeft: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "0.08em", color: "var(--ink)" }}>YOUR BAG</h2>
              <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: "var(--surface-2)", color: "var(--muted)" }}>✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.2em" }}>YOUR BAG IS EMPTY</p>
                  <button onClick={closeCart} style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.2em" }}>EXPLORE DROPS →</button>
                </div>
              )}
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 rounded-xl" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--ink)", letterSpacing: "0.04em" }}>{item.name}</h4>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em" }}>SIZE {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => item.quantity > 1 ? updateQty(item.id, item.size, item.quantity - 1) : removeItem(item.id, item.size)}
                          className="w-6 h-6 flex items-center justify-center rounded" style={{ backgroundColor: "var(--surface-2)", color: "var(--ink)" }}>-</button>
                        <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", minWidth: "1.5rem", textAlign: "center" }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded" style={{ backgroundColor: "var(--surface-2)", color: "var(--ink)" }}>+</button>
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontSize: "1rem" }}>${item.price * item.quantity}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id, item.size)} style={{ color: "var(--muted)", alignSelf: "flex-start", fontSize: "0.75rem" }}>✕</button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="p-6" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex justify-between mb-4">
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.15em" }}>TOTAL</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink)", fontSize: "1.2rem", fontWeight: 700 }}>${total()}</span>
                </div>
                <button className="w-full py-4 rounded-xl font-bold tracking-widest text-black transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "0.2em" }}>
                  CHECKOUT →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
