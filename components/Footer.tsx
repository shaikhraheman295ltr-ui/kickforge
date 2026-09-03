"use client";
import { Instagram, Github, Linkedin } from "lucide-react";

const links = [
  { label: "Instagram", href: "https://instagram.com/kickforge", Icon: Instagram },
  { label: "GitHub", href: "https://github.com/kickforge", Icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/company/kickforge", Icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 md:px-16 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--ink)", letterSpacing: "0.08em" }}>KICKFORGE</span>
        <div className="flex items-center gap-6">
          {links.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="flex items-center gap-2 transition-opacity hover:opacity-70"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "0.05em" }}>
              <Icon size={16} style={{ color: "var(--muted)" }} />
              {label}
            </a>
          ))}
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.08em" }}>
          &copy; {new Date().getFullYear()} KICKFORGE
        </span>
      </div>
    </footer>
  );
}
