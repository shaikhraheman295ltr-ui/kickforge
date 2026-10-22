"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { writeAuthCookie } from "@/lib/authCookie";

type Mode = "login" | "signup";
type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};
type Status = "idle" | "loading" | "success";

const MIN_PASSWORD = 6;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address.";
  return "";
}

function validatePassword(value: string, mode: Mode): string {
  if (!value) return "Password is required.";
  if (value.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters.`;
  if (mode === "signup" && !/\d/.test(value)) return "Include at least one number.";
  return "";
}

/**
 * Where to go after signing in. The middleware puts the page the visitor was
 * trying to reach in `?next=`, so deep links survive the login detour. Only
 * same-site paths are honoured — anything else would be an open redirect.
 */
function safeNext(): string {
  if (typeof window === "undefined") return "/";
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export default function BrutalistLogin() {
  const router = useRouter();
  const { login, signup, isAuthenticated, checkSession } = useAuthStore();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [alert, setAlert] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  /* Restore an existing session, and bounce out if already signed in.
     After a submit we skip the bounce so the success screen gets its full beat
     instead of being yanked away the instant `isAuthenticated` flips — that is
     what the 1.2s redirect timer below is for. */
  const justAuthedRef = useRef(false);
  useEffect(() => { checkSession(); }, [checkSession]);
  useEffect(() => {
    if (isAuthenticated && !justAuthedRef.current) router.replace(safeNext());
  }, [isAuthenticated, router]);

  const loading = status === "loading";
  const isSignup = mode === "signup";

  /* ------------------------------------------------------------------- mode */

  const switchMode = useCallback((next: Mode) => {
    setMode((prev) => {
      if (prev === next) return prev;
      setErrors({});
      setAlert("");
      setStatus("idle");
      setPassword("");
      setConfirm("");
      return next;
    });
  }, []);

  /* ------------------------------------------------------------- validation */

  /* Clear a field's error as soon as the value becomes valid. */
  const clearIfFixed = useCallback(
    (field: keyof FieldErrors, value: string) => {
      setErrors((prev) => {
        if (!prev[field]) return prev;
        let stillBad = false;
        if (field === "name") stillBad = !value.trim();
        else if (field === "email") stillBad = !!validateEmail(value);
        else if (field === "password") stillBad = !!validatePassword(value, mode);
        else if (field === "confirm") stillBad = value !== password;
        return stillBad ? prev : { ...prev, [field]: undefined };
      });
    },
    [mode, password],
  );

  const bind =
    (field: keyof FieldErrors, setter: (v: string) => void) =>
    (value: string) => {
      setter(value);
      setAlert("");
      clearIfFixed(field, value);
    };

  /* Validate on blur, but only once the field has been touched. */
  const blurValidate = (field: keyof FieldErrors, value: string) => {
    if (!value) return;
    let message = "";
    if (field === "name") message = value.trim() ? "" : "Name is required.";
    else if (field === "email") message = validateEmail(value);
    else if (field === "password") message = validatePassword(value, mode);
    else if (field === "confirm") message = value === password ? "" : "Passwords do not match.";
    if (message) setErrors((prev) => ({ ...prev, [field]: message }));
  };

  /* ------------------------------------------------------------------ submit */

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAlert("");

    const next: FieldErrors = {};
    if (isSignup && !name.trim()) next.name = "Name is required.";
    next.email = validateEmail(email) || undefined;
    next.password = validatePassword(password, mode) || undefined;
    if (isSignup && password !== confirm) next.confirm = "Passwords do not match.";

    /* Drop undefined so the object is clean for the "any error?" check. */
    const filled = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v),
    ) as FieldErrors;

    if (Object.keys(filled).length > 0) {
      setErrors(filled);
      // Focus the first invalid field in document order.
      const order: Array<[keyof FieldErrors, React.RefObject<HTMLInputElement>]> = [
        ["name", nameRef],
        ["email", emailRef],
        ["password", passwordRef],
        ["confirm", confirmRef],
      ];
      const first = order.find(([key]) => filled[key]);
      first?.[1].current?.focus();
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      justAuthedRef.current = true;
      const ok = isSignup
        ? await signup(name, email, password)
        : await login(email, password);

      if (!ok) throw new Error("Authentication failed");

      setStatus("success");
      window.setTimeout(() => router.push(safeNext()), 1200);
    } catch (err) {
      justAuthedRef.current = false;
      setStatus("idle");
      setAlert(
        err instanceof Error && err.message !== "Authentication failed"
          ? err.message
          : isSignup
            ? "We could not create your account. Please try again."
            : "Invalid email or password. Please try again.",
      );
      setPassword("");
      passwordRef.current?.focus();
    }
  };

  /* ------------------------------------------------------------------ social */

  const onSocial = async (provider: "google" | "apple") => {
    setAlert("");
    setStatus("loading");
    try {
      justAuthedRef.current = true;
      await login(`${provider}@kickforge.com`, "social");
      setStatus("success");
      window.setTimeout(() => router.push(safeNext()), 1200);
    } catch {
      justAuthedRef.current = false;
      setStatus("idle");
      setAlert(`${provider === "google" ? "Google" : "Apple"} sign-in is unavailable right now.`);
    }
  };

  /* ------------------------------------------------------------------- skip */

  const onSkip = () => {
    // The gate requires a cookie; mint a guest session so middleware lets us through.
    writeAuthCookie({ name: "Guest", email: "guest@kickforge.local" });
    if (typeof window !== "undefined") {
      localStorage.setItem("kf-auth", JSON.stringify({ name: "Guest", email: "guest@kickforge.local" }));
    }
    router.push("/");
  };

  const onForgot = () =>
    setAlert("Password reset is not connected in this demo.");

  /* ---------------------------------------------------------------- success */

  if (status === "success") {
    return (
      <div className="success">
        <div className="success__box" aria-hidden="true">
          <svg className="success__svg" viewBox="0 0 24 24">
            <path d="M4 12.5l5.5 5.5L20 6.5" />
          </svg>
        </div>
        <p className="success__msg" role="status" aria-live="polite">
          Welcome to KICKFORGE
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="panel__head">
        <p className="eyebrow">&mdash; 00 / {isSignup ? "CREATE ACCOUNT" : "SIGN IN"}</p>
        <h1 className="title">{isSignup ? "SIGN UP" : "SIGN IN"}</h1>
        <p className="lede">
          {isSignup
            ? "Create an account for member-only drops and early access."
            : "Welcome back. Enter your details to continue."}
        </p>
      </header>

      {/* Top-level auth error */}
      <div
        className="alert"
        id="form-alert"
        role="alert"
        aria-live="assertive"
        hidden={!alert}
      >
        {alert}
      </div>

      <div className="tabs" role="group" aria-label="Sign in or create an account">
        <button
          type="button"
          className="tab"
          aria-pressed={!isSignup}
          onClick={() => switchMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className="tab"
          aria-pressed={isSignup}
          onClick={() => switchMode("signup")}
        >
          Sign up
        </button>
      </div>

      <form className="login-form" onSubmit={onSubmit} noValidate>
        {/* Name (signup only) */}
        {isSignup && (
          <div className={`field${errors.name ? " is-invalid" : ""}`} id="field-name">
            <label className="label" htmlFor="name">
              Full name <abbr className="req" title="required">*</abbr>
            </label>
            <input
              className="input"
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby="name-error"
              placeholder="Alex Mercer"
              value={name}
              onChange={(e) => bind("name", setName)(e.target.value)}
              onBlur={() => blurValidate("name", name)}
              ref={nameRef}
            />
            <p className="field-error" id="name-error" hidden={!errors.name}>
              {errors.name}
            </p>
          </div>
        )}

        {/* Email */}
        <div className={`field${errors.email ? " is-invalid" : ""}`} id="field-email">
          <label className="label" htmlFor="email">
            Email <abbr className="req" title="required">*</abbr>
          </label>
          <input
            className="input"
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete={isSignup ? "email" : "username"}
            spellCheck={false}
            required
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby="email-hint email-error"
            placeholder="you@kickforge.com"
            value={email}
            onChange={(e) => bind("email", setEmail)(e.target.value)}
            onBlur={() => blurValidate("email", email)}
            ref={emailRef}
          />
          <p className="hint" id="email-hint">
            {isSignup ? "We only use this for orders and drop alerts." : "Use the email address on your account."}
          </p>
          <p className="field-error" id="email-error" hidden={!errors.email}>
            {errors.email}
          </p>
        </div>

        {/* Password */}
        <div className={`field${errors.password ? " is-invalid" : ""}`} id="field-password">
          <label className="label" htmlFor="password">
            Password <abbr className="req" title="required">*</abbr>
          </label>
          <div className="pw">
            <input
              className="input"
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              aria-required="true"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby="password-hint password-error"
              placeholder="••••••••"
              value={password}
              onChange={(e) => bind("password", setPassword)(e.target.value)}
              onBlur={() => blurValidate("password", password)}
              ref={passwordRef}
            />
            <button
              className="pw__toggle"
              type="button"
              aria-pressed={showPw}
              aria-controls="password"
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw((v) => !v)}
            >
              <svg className="ico ico--eye" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
                <circle cx="12" cy="12" r="2.6" />
              </svg>
              <svg className="ico ico--eye-off" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 3l18 18M10.6 6.2A9.6 9.6 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.4 4M6.2 7.6A16.6 16.6 0 0 0 2 12s3.6 6 10 6c1.2 0 2.3-.2 3.3-.5" />
              </svg>
            </button>
          </div>
          <p className="hint" id="password-hint">
            {isSignup ? `At least ${MIN_PASSWORD} characters, including a number.` : "Never share this with anyone."}
          </p>
          <p className="field-error" id="password-error" hidden={!errors.password}>
            {errors.password}
          </p>
        </div>

        {/* Confirm password (signup only) */}
        {isSignup && (
          <div className={`field${errors.confirm ? " is-invalid" : ""}`} id="field-confirm">
            <label className="label" htmlFor="confirm">
              Confirm password <abbr className="req" title="required">*</abbr>
            </label>
            <input
              className="input"
              id="confirm"
              name="confirm"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={errors.confirm ? true : undefined}
              aria-describedby="confirm-error"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => bind("confirm", setConfirm)(e.target.value)}
              onBlur={() => blurValidate("confirm", confirm)}
              ref={confirmRef}
            />
            <p className="field-error" id="confirm-error" hidden={!errors.confirm}>
              {errors.confirm}
            </p>
          </div>
        )}

        {/* Row: remember + forgot */}
        <div className="row">
          <label className="check" htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="check__box" aria-hidden="true" />
            <span className="check__text">Remember me</span>
          </label>
          {!isSignup && (
            <button type="button" className="link linkbtn" onClick={onForgot}>
              Forgot password?
            </button>
          )}
        </div>

        <button
          className="btn btn--primary"
          id="submit-btn"
          type="submit"
          data-loading={loading}
          disabled={loading}
        >
          <span className="btn__label">
            {loading ? (isSignup ? "Creating" : "Signing in") : isSignup ? "Create account" : "Sign in"}
          </span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="square" />
          </svg>
        </button>
      </form>

      <p className="divider"><span>OR</span></p>

      <div className="social">
        <button className="btn btn--ghost" type="button" disabled={loading} onClick={() => onSocial("google")}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M12 11v2.6h4.3a3.7 3.7 0 0 1-1.6 2.4l2.6 2a7.9 7.9 0 0 0 2.4-5.8A7.7 7.7 0 0 0 12 4.4V7a5 5 0 0 1 0 4Z" />
            <path fill="currentColor" d="M12 20a7.6 7.6 0 0 0 5.3-1.9l-2.6-2A4.8 4.8 0 0 1 7.4 13H4.7A7.9 7.9 0 0 0 12 20Z" />
            <path fill="currentColor" d="M7.4 13a4.7 4.7 0 0 1 0-3V7.4H4.7a7.9 7.9 0 0 0 0 9.2L7.4 13Z" />
            <path fill="currentColor" d="M12 7a4.3 4.3 0 0 1 3-.9l2.3-2.3A7.7 7.7 0 0 0 4.7 7.4L7.4 10A4.8 4.8 0 0 1 12 7Z" />
          </svg>
          Google
        </button>
        <button className="btn btn--ghost" type="button" disabled={loading} onClick={() => onSocial("apple")}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M16.2 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.7-2.2c.9-1.3 1.2-2.5 1.2-2.6 0 0-2.3-.9-2.3-3.4ZM14 6.2c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.8 1 .1 2-.5 2.7-1.3Z" />
          </svg>
          Apple
        </button>
      </div>

      {/* Skip — leave without signing in */}
      <button className="btn btn--skip" type="button" onClick={onSkip} id="skip-btn">
        Continue as guest
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="square" />
        </svg>
      </button>

      <p className="footer-note">
        {isSignup ? "Already have an account?" : "No account yet?"}
        <button
          type="button"
          className="link link--bold linkbtn"
          onClick={() => switchMode(isSignup ? "login" : "signup")}
        >
          {isSignup ? "Sign in" : "Create account"}
        </button>
      </p>

      <p className="demo-note">
        Demo &mdash; any email and a {MIN_PASSWORD}+ character password will sign you in.
      </p>
    </>
  );
}
