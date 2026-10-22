"use client";

import { useCallback, useRef, useState } from "react";

/* Demo credentials — swap fakeSignIn() for the real API call. */
const DEMO = { email: "demo@kickforge.com", password: "forge2026" };
const MIN_PASSWORD = 6;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = { email?: string; password?: string };
type Status = "idle" | "loading" | "success";

function validateEmail(value: string): string {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address.";
  return "";
}

function validatePassword(value: string): string {
  if (!value) return "Password is required.";
  if (value.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters.`;
  return "";
}

/** Stand-in for the real API call. */
function fakeSignIn(email: string, password: string): Promise<boolean> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(
        email.trim().toLowerCase() === DEMO.email && password === DEMO.password,
      );
    }, 700);
  });
}

export default function BrutalistLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [alert, setAlert] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const loading = status === "loading" || status === "success";

  /* ------------------------------------------------------- live re-validation */

  const onEmailChange = useCallback((value: string) => {
    setEmail(value);
    setAlert("");
    // Clear the error as soon as the user fixes it.
    setErrors((prev) =>
      prev.email && !validateEmail(value) ? { ...prev, email: undefined } : prev,
    );
  }, []);

  const onPasswordChange = useCallback((value: string) => {
    setPassword(value);
    setAlert("");
    setErrors((prev) =>
      prev.password && !validatePassword(value)
        ? { ...prev, password: undefined }
        : prev,
    );
  }, []);

  /* Validate on blur, but only once the field has been touched. */
  const onEmailBlur = useCallback(() => {
    const message = email ? validateEmail(email) : "";
    if (message) setErrors((prev) => ({ ...prev, email: message }));
  }, [email]);

  const onPasswordBlur = useCallback(() => {
    const message = password ? validatePassword(password) : "";
    if (message) setErrors((prev) => ({ ...prev, password: message }));
  }, [password]);

  /* --------------------------------------------------------------- password toggle */

  const togglePassword = useCallback(() => {
    setShowPw((prev) => !prev);
    // Keep the caret where it was so typing is not interrupted.
    const input = passwordRef.current;
    if (input) {
      const end = input.value.length;
      input.focus();
      try {
        input.setSelectionRange(end, end);
      } catch {
        /* type=email edge case */
      }
    }
  }, []);

  /* ------------------------------------------------------------------- submit */

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setAlert("");

      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);

      if (emailError || passwordError) {
        setErrors({ email: emailError || undefined, password: passwordError || undefined });
        (emailError ? emailRef : passwordRef).current?.focus();
        return;
      }

      setErrors({});
      setStatus("loading");

      const ok = await fakeSignIn(email, password);

      if (ok) {
        setToast(true);
        setStatus("success");
        window.setTimeout(() => setStatus("idle"), 1600);
        return;
      }

      /* Error state: invalid credentials */
      setStatus("idle");
      setErrors({});
      setAlert("Invalid email or password. Please try again.");
      setPassword("");
      passwordRef.current?.focus();
    },
    [email, password],
  );

  /* Social buttons — placeholder wiring */
  const onSocial = useCallback((provider: string) => {
    setAlert(`${provider} sign-in is not connected in this demo.`);
  }, []);

  const submitLabel = status === "success" ? "Signed in" : "Sign in";

  return (
    <div className="kf-brutalist">
      <main className="shell" id="main-content">
        {/* ─────────────  Poster / brand side (decorative)  ───────────── */}
        <section className="poster" aria-hidden="true">
          <div className="poster__grid" />

          <div className="poster__top">
            <span className="brandmark">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 4v16M5 12l10-8M5 12l10 8" strokeLinecap="square" />
              </svg>
              KICKFORGE
            </span>
            <span className="poster__meta">EST. 2026 / DROP 04</span>
          </div>

          <h2 className="poster__type">
            <span>WHERE</span>
            <span className="is-accent">MOTION</span>
            <span>MEETS CRAFT</span>
          </h2>

          <div className="sticker">
            ACCOUNT
            <br />
            ACCESS
          </div>

          <ul className="poster__list">
            <li><b>01</b> Member-only drops</li>
            <li><b>02</b> Order tracking</li>
            <li><b>03</b> Early access windows</li>
          </ul>
        </section>

        {/* ─────────────  Form side  ───────────── */}
        <section className="panel">
          <header className="panel__head">
            <p className="eyebrow">&mdash; 00 / SIGN IN</p>
            <h1 className="title">SIGN IN</h1>
            <p className="lede">Welcome back. Enter your details to continue.</p>
          </header>

          {/* Top-level auth error (invalid credentials) */}
          <div
            className="alert"
            id="form-alert"
            role="alert"
            aria-live="assertive"
            hidden={!alert}
          >
            {alert}
          </div>

          <form className="login-form" onSubmit={onSubmit} noValidate>
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
                autoComplete="username"
                spellCheck={false}
                required
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby="email-hint email-error"
                placeholder="you@kickforge.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                onBlur={onEmailBlur}
                ref={emailRef}
              />
              <p className="hint" id="email-hint">Use the email address on your account.</p>
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
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby="password-error"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  onBlur={onPasswordBlur}
                  ref={passwordRef}
                />
                <button
                  className="pw__toggle"
                  id="toggle-password"
                  type="button"
                  aria-pressed={showPw}
                  aria-controls="password"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={togglePassword}
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
              <p className="field-error" id="password-error" hidden={!errors.password}>
                {errors.password}
              </p>
            </div>

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
              <a className="link" href="#forgot">Forgot password?</a>
            </div>

            <button
              className="btn btn--primary"
              id="submit-btn"
              type="submit"
              data-loading={loading}
              disabled={loading}
            >
              <span className="btn__label">{submitLabel}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="square" />
              </svg>
            </button>
          </form>

          <p className="divider"><span>OR</span></p>

          <div className="social">
            <button className="btn btn--ghost" type="button" onClick={() => onSocial("Google")}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M12 11v2.6h4.3a3.7 3.7 0 0 1-1.6 2.4l2.6 2a7.9 7.9 0 0 0 2.4-5.8A7.7 7.7 0 0 0 12 4.4V7a5 5 0 0 1 0 4Z" />
                <path fill="currentColor" d="M12 20a7.6 7.6 0 0 0 5.3-1.9l-2.6-2A4.8 4.8 0 0 1 7.4 13H4.7A7.9 7.9 0 0 0 12 20Z" />
                <path fill="currentColor" d="M7.4 13a4.7 4.7 0 0 1 0-3V7.4H4.7a7.9 7.9 0 0 0 0 9.2L7.4 13Z" />
                <path fill="currentColor" d="M12 7a4.3 4.3 0 0 1 3-.9l2.3-2.3A7.7 7.7 0 0 0 4.7 7.4L7.4 10A4.8 4.8 0 0 1 12 7Z" />
              </svg>
              Google
            </button>
            <button className="btn btn--ghost" type="button" onClick={() => onSocial("Apple")}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M16.2 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.7-2.2c.9-1.3 1.2-2.5 1.2-2.6 0 0-2.3-.9-2.3-3.4ZM14 6.2c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.8 1 .1 2-.5 2.7-1.3Z" />
              </svg>
              Apple
            </button>
          </div>

          <p className="footer-note">
            No account yet?
            <a className="link link--bold" href="#create">Create account</a>
          </p>

          <p className="demo-note">
            Demo &mdash; <code>demo@kickforge.com</code> / <code>forge2026</code>
          </p>
        </section>
      </main>

      {/* Success state, revealed by JS */}
      <div className="toast" id="success-toast" role="status" hidden={!toast}>
        <strong>Signed in.</strong> Redirecting to your account&hellip;
      </div>
    </div>
  );
}
