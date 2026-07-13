"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Eye, EyeOff, Check, ArrowRight, Chrome, Apple } from "lucide-react";

type Mode = "login" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const { login, signup } = useAuthStore();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const [tabState, setTabState] = useState<"a" | "b">("a");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const switchMode = useCallback((m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setTabState(m === "login" ? "a" : "b");
    setError("");
    setStatus("idle");
  }, [mode]);

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
    if (!validate()) {
      setStatus("error");
      setShakeKey(k => k + 1);
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const ok = mode === "login" ? await login(email, password) : await signup(name, email, password);
      if (ok) {
        setStatus("success");
        setTimeout(() => router.push("/"), 1200);
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      setShakeKey(k => k + 1);
    }
  };

  const handleSocial = (_provider: "google" | "apple") => {
    setStatus("loading");
    setTimeout(async () => {
      await login("user@social.com", "social");
      setStatus("success");
      setTimeout(() => router.push("/"), 1200);
    }, 800);
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="checkmark-circle">
          <svg className="checkmark-svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle-bg" cx="26" cy="26" r="24" fill="none" />
            <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
          </svg>
        </div>
        <p className="text-center" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "0.2em", color: "var(--accent)" }}>
          WELCOME TO KICKFORGE
        </p>
      </div>
    );
  }

  return (
    <div className="login-glass" key={shakeKey}>
      {/* Mode Tabs */}
      <div className="flex mb-8 relative">
        <button onClick={() => switchMode("login")} aria-pressed={mode === "login"}
          className="flex-1 py-3 text-center text-sm font-bold tracking-widest cursor-pointer z-10"
          style={{ fontFamily: "var(--font-mono)", color: mode === "login" ? "#000" : "var(--muted)", letterSpacing: "0.2em" }}>
          SIGN IN
        </button>
        <button onClick={() => switchMode("signup")} aria-pressed={mode === "signup"}
          className="flex-1 py-3 text-center text-sm font-bold tracking-widest cursor-pointer z-10"
          style={{ fontFamily: "var(--font-mono)", color: mode === "signup" ? "#000" : "var(--muted)", letterSpacing: "0.2em" }}>
          SIGN UP
        </button>
        <span className="tab-indicator" data-state={tabState} />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Name (signup only) */}
        <div className={`floating-input-wrap ${mode === "signup" ? "visible" : "hidden"}`}>
          <div className="floating-input-inner">
            <input ref={nameRef} id="login-name" type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder=" " autoComplete="name"
              className="floating-input peer" />
            <label htmlFor="login-name" className="floating-label">Full Name</label>
          </div>
        </div>

        {/* Email */}
        <div className="floating-input-wrap visible">
          <div className="floating-input-inner">
            <input ref={emailRef} id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder=" " autoComplete="email"
              className="floating-input peer" />
            <label htmlFor="login-email" className="floating-label">Email</label>
          </div>
        </div>

        {/* Password */}
        <div className="floating-input-wrap visible">
          <div className="floating-input-inner">
            <input ref={passwordRef} id="login-password" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
              placeholder=" " autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="floating-input peer pr-12" />
            <label htmlFor="login-password" className="floating-label">Password</label>
            <button type="button" onClick={() => setShowPw(p => !p)} aria-label={showPw ? "Hide password" : "Show password"}
              className="password-toggle cursor-pointer">
              <div className="t-icon-swap" data-state={showPw ? "b" : "a"}>
                <span className="t-icon" data-icon="a" style={{ display: "flex" }}><Eye size={16} /></span>
                <span className="t-icon" data-icon="b" style={{ display: "flex" }}><EyeOff size={16} /></span>
              </div>
            </button>
          </div>
        </div>

        {/* Confirm (signup only) */}
        <div className={`floating-input-wrap ${mode === "signup" ? "visible" : "hidden"}`}>
          <div className="floating-input-inner">
            <input ref={confirmRef} id="login-confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder=" " autoComplete="new-password"
              className="floating-input peer" />
            <label htmlFor="login-confirm" className="floating-label">Confirm Password</label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="error-shake" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent-2)", letterSpacing: "0.1em" }}>
            {error}
          </p>
        )}

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
              className="remember-checkbox" />
            <span>Remember me</span>
          </label>
          {mode === "login" && (
            <button type="button" className="cursor-pointer" style={{ fontSize: "0.7rem", color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
              Forgot?
            </button>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={status === "loading"}
          className="login-cta cursor-pointer" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.25em" }}>
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" />
              {mode === "login" ? "SIGNING IN..." : "CREATING ACCOUNT..."}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
              <ArrowRight size={14} />
            </span>
          )}
        </button>

        {/* Social Divider */}
        <div className="flex items-center gap-3">
          <span className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.15em" }}>OR</span>
          <span className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
        </div>

        {/* Social Auth */}
        <div className="flex gap-3">
          <button type="button" onClick={() => handleSocial("google")} disabled={status === "loading"}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium transition-all hover:opacity-80 cursor-pointer disabled:opacity-50"
            style={{ border: "1px solid var(--border)", color: "var(--ink)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
            <Chrome size={16} /> Google
          </button>
          <button type="button" onClick={() => handleSocial("apple")} disabled={status === "loading"}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium transition-all hover:opacity-80 cursor-pointer disabled:opacity-50"
            style={{ border: "1px solid var(--border)", color: "var(--ink)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
            <Apple size={16} /> Apple
          </button>
        </div>

        {/* Skip */}
        <button type="button" onClick={() => router.push("/")}
          className="skip-link cursor-pointer">
          Continue as Guest &rarr;
        </button>
      </form>

      <style>{`
        .login-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          position: relative;
          overflow: hidden;
          animation: glassIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .login-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(236,72,153,0.15), transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        @keyframes glassIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Tab Indicator */
        .tab-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50%;
          height: 2px;
          background: var(--accent);
          border-radius: 1px;
          transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
          transform: translateX(0);
        }
        .tab-indicator[data-state="b"] {
          transform: translateX(100%);
        }

        /* Floating Inputs */
        .floating-input-wrap {
          overflow: hidden;
          transition: all 400ms cubic-bezier(0.22, 1, 0.36, 1);
          max-height: 0;
          opacity: 0;
        }
        .floating-input-wrap.visible {
          max-height: 64px;
          opacity: 1;
        }
        .floating-input-wrap.hidden {
          max-height: 0;
          opacity: 0;
          margin: 0;
        }
        .floating-input-inner {
          position: relative;
        }
        .floating-input {
          width: 100%;
          padding: 1rem 1rem 0.5rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: var(--ink);
          font-family: var(--font-body);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .floating-input:focus {
          border-color: var(--accent);
          background: rgba(139,92,246,0.06);
        }
        .floating-input.error {
          border-color: var(--accent-2);
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        .floating-label {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: var(--muted);
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .floating-input:focus ~ .floating-label,
        .floating-input:not(:placeholder-shown) ~ .floating-label {
          top: 0.5rem;
          transform: translateY(0) scale(0.7);
          color: var(--accent);
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--muted);
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        .password-toggle:hover { color: var(--ink); }

        .remember-checkbox {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .remember-checkbox:checked {
          background: var(--accent);
          border-color: var(--accent);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M13.78 4.22a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 011.06-1.06L5.5 10.94l7.22-7.22a.75.75 0 011.06 0z'/%3E%3C/svg%3E");
          background-size: 12px;
          background-position: center;
          background-repeat: no-repeat;
        }

        .login-cta {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          background: var(--accent);
          color: #000;
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.3s ease;
        }
        .login-cta:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(139,92,246,0.3); }
        .login-cta:active:not(:disabled) { transform: scale(0.98); }
        .login-cta:disabled { opacity: 0.5; cursor: not-allowed; }

        .skip-link {
          background: none;
          border: none;
          text-align: center;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: var(--muted);
          padding: 0.5rem;
          transition: color 0.2s;
        }
        .skip-link:hover { color: var(--ink); }

        /* Error Shake */
        .error-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        /* Spinner */
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success Checkmark */
        .checkmark-circle {
          width: 72px;
          height: 72px;
          animation: circleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .checkmark-svg { width: 100%; height: 100%; }
        .checkmark-circle-bg {
          stroke: var(--accent);
          stroke-width: 3;
          stroke-dasharray: 150;
          stroke-dashoffset: 150;
          animation: circleDraw 0.6s ease-out 0.2s forwards;
        }
        .checkmark-check {
          stroke: var(--accent);
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: checkDraw 0.4s ease-out 0.6s forwards;
        }
        @keyframes circleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes circleDraw { to { stroke-dashoffset: 0; } }
        @keyframes checkDraw { to { stroke-dashoffset: 0; } }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .login-glass { animation: none; }
          .checkmark-circle { animation: none; }
          .checkmark-circle-bg { animation: none; }
          .checkmark-check { animation: none; }
          .error-shake { animation: none; }
          .floating-input-wrap { transition: none; }
          .tab-indicator { transition: none; }
        }
      `}</style>
    </div>
  );
}
