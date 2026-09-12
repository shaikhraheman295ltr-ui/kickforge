"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useAuthStore, useCartStore, useLoginModalStore } from "@/lib/store";

type Mode = "login" | "signup";

export default function LoginModal() {
  const { isOpen, pendingItem, closeLogin } = useLoginModalStore();
  const { login, signup } = useAuthStore();
  const { addItem, openCart } = useCartStore();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setMode("login");
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
    setStatus("idle");
    setShowPw(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      return;
    }
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => { document.body.style.overflow = ""; document.body.style.paddingRight = ""; };
  }, [isOpen]);

  const handleClose = () => {
    closeLogin();
    setTimeout(resetForm, 300);
  };

  const validate = (): boolean => {
    if (!email.trim()) { setError("Email is required"); emailRef.current?.focus(); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email"); emailRef.current?.focus(); return false; }
    if (!password) { setError("Password is required"); passwordRef.current?.focus(); return false; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); passwordRef.current?.focus(); return false; }
    if (mode === "signup") {
      if (!name.trim()) { setError("Name is required"); nameRef.current?.focus(); return false; }
      if (password !== confirm) { setError("Passwords do not match"); confirmRef.current?.focus(); return false; }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { setStatus("error"); setShakeKey(k => k + 1); return; }
    setStatus("loading");
    setError("");
    try {
      const ok = mode === "login" ? await login(email, password) : await signup(name, email, password);
      if (ok) {
        setStatus("success");
        setTimeout(() => {
          if (pendingItem) { addItem(pendingItem); openCart(); }
          handleClose();
        }, 1000);
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      setShakeKey(k => k + 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] cursor-pointer" style={{ backgroundColor: "rgba(5,5,8,0.7)", backdropFilter: "blur(10px)" }}
            onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-0 z-[500] flex items-end md:items-center justify-center md:p-4 pointer-events-none"
            role="dialog" aria-modal="true" aria-labelledby="login-title">
            <div className="pointer-events-auto w-full md:max-w-[420px] md:rounded-2xl rounded-t-2xl rounded-b-none md:p-8 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] max-h-[100dvh] overflow-y-auto"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              key={shakeKey}>
              <div className="grabber md:hidden" aria-hidden="true" />
              <div className="flex items-center justify-between mb-6">
                <span id="login-title" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 5vw, 1.5rem)", letterSpacing: "0.08em", color: "var(--ink)" }}>
                  {mode === "login" ? "SIGN IN" : "SIGN UP"}
                </span>
                  <button onClick={handleClose} aria-label="Close sign in dialog" className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer" style={{ backgroundColor: "var(--surface-2)", color: "var(--muted)" }}>
                    <X size={15} />
                  </button>
                </div>

                {pendingItem && (
                  <div className="mb-4 p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image src={pendingItem.image} alt="" width={40} height={40} sizes="40px" loading="lazy" className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--ink)" }}>{pendingItem.name}</p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)" }}>${pendingItem.price}</p>
                    </div>
                  </div>
                )}

                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.15)" }}>
                      <Check size={24} style={{ color: "var(--accent)" }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.15em" }}>
                      WELCOME{name ? `, ${name.toUpperCase()}` : ""}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    {/* Tabs */}
                    <div className="flex relative mb-2" style={{ borderBottom: "1px solid var(--border)" }}>
                      <button type="button" onClick={() => { setMode("login"); setError(""); }} aria-pressed={mode === "login"}
                        className="flex-1 py-2.5 text-center text-xs font-bold tracking-widest cursor-pointer"
                        style={{ fontFamily: "var(--font-mono)", color: mode === "login" ? "var(--accent)" : "var(--muted)", letterSpacing: "0.2em", borderBottom: mode === "login" ? "2px solid var(--accent)" : "2px solid transparent" }}>
                        SIGN IN
                      </button>
                      <button type="button" onClick={() => { setMode("signup"); setError(""); }} aria-pressed={mode === "signup"}
                        className="flex-1 py-2.5 text-center text-xs font-bold tracking-widest cursor-pointer"
                        style={{ fontFamily: "var(--font-mono)", color: mode === "signup" ? "var(--accent)" : "var(--muted)", letterSpacing: "0.2em", borderBottom: mode === "signup" ? "2px solid var(--accent)" : "2px solid transparent" }}>
                        SIGN UP
                      </button>
                    </div>

                    {mode === "signup" && (
                      <input ref={nameRef} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                        autoComplete="name" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--ink)", fontFamily: "var(--font-mono)" }} />
                    )}
                    <input ref={emailRef} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                      autoComplete="email" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--ink)", fontFamily: "var(--font-mono)" }} />
                    <div className="relative">
                      <input ref={passwordRef} type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                        autoComplete={mode === "login" ? "current-password" : "new-password"} className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-12"
                        style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--ink)", fontFamily: "var(--font-mono)" }} />
                      <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: "var(--muted)" }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {mode === "signup" && (
                      <input ref={confirmRef} type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)}
                        autoComplete="new-password" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--ink)", fontFamily: "var(--font-mono)" }} />
                    )}

                    {error && (
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--accent-2)", letterSpacing: "0.1em", textAlign: "center" }}>{error}</p>
                    )}

                    <button type="submit" disabled={status === "loading"}
                      className="w-full py-3 rounded-xl font-bold text-sm tracking-widest text-black transition-all hover:opacity-90 disabled:opacity-60 cursor-pointer"
                      style={{ backgroundColor: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.25em" }}>
                      {status === "loading" ? (mode === "login" ? "SIGNING IN..." : "CREATING...") : (
                        <span className="flex items-center justify-center gap-2">{mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"} <ArrowRight size={14} /></span>
                      )}
                    </button>

                    <button type="button" onClick={() => { handleClose(); if (pendingItem) { addItem(pendingItem); openCart(); } }}
                      className="w-full text-center text-xs cursor-pointer py-2"
                      style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", letterSpacing: "0.1em" }}>
                      Continue as Guest →
                    </button>
                  </form>
                )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
