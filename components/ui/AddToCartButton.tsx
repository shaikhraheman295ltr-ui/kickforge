"use client";
import MagneticButton from "./MagneticButton";

interface AddToCartButtonProps {
  onClick: () => void;
  label?: string;
}

export default function AddToCartButton({ onClick, label = "ADD TO BAG" }: AddToCartButtonProps) {
  return (
    <MagneticButton onClick={onClick}
      className="w-full py-4 rounded-xl font-bold tracking-widest text-black transition-all hover:opacity-90 active:scale-[0.97]"
      style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "0.2em" }}>
      {label}
    </MagneticButton>
  );
}
