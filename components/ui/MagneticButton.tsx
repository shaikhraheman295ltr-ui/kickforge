"use client";
import { useRef, useCallback } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
}

export default function MagneticButton({ children, onClick, className = "", style, strength = 0.4 }: MagneticButtonProps) {
  const elRef = useRef<HTMLButtonElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = elRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, [strength]);

  const onLeave = useCallback(() => {
    if (!elRef.current) return;
    elRef.current.style.transform = "translate3d(0, 0, 0)";
  }, []);

  return (
    <button
      ref={elRef}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`magnetic-area ${className}`}
      style={{ transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)", ...style }}
    >
      {children}
    </button>
  );
}
