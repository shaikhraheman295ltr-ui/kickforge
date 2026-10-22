import "./brutalist.css";
import BrutalistLogin from "./BrutalistLogin";

export const metadata = {
  title: "Sign in — KICKFORGE",
  description: "Sign in to your KICKFORGE account, or create one for early access to drops.",
};

export default function LoginPage() {
  return (
    <div className="kf-brutalist">
      <main className="shell" id="main-content">
        {/* ─────────────  Poster / brand side (decorative)  ───────────── */}
        <section className="poster" aria-hidden="true">
          <div className="poster__grid" />

          <div className="poster__top">
            {/* Decorative on purpose: this poster is aria-hidden, and a focusable
                link here would violate aria-hidden-focus. Navigation home is
                provided by the corner KF logo in the root layout. */}
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
          <BrutalistLogin />
        </section>
      </main>
    </div>
  );
}
