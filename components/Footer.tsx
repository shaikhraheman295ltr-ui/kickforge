"use client";
import { Instagram, Github, Linkedin } from "lucide-react";

const links = [
  { label: "Instagram", href: "https://www.instagram.com/yolcu__raheman?igsh=YzA5eGJnaHNoZXRk", Icon: Instagram },
  { label: "GitHub", href: "https://github.com/shaikhraheman295ltr-ui", Icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shaikh-a-raheman-6015193a2?utm_source=share_via&utm_content=profile&utm_medium=member_android", Icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 md:px-16 border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--ink)", letterSpacing: "0.08em" }}>KICKFORGE</span>
        <div className="flex items-center gap-6">
          {links.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
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
