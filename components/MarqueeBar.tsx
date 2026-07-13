"use client";

const ANNOUNCEMENTS = [
  "FREE SHIPPING ON ORDERS $200+",
  "NEW DROP EVERY FRIDAY",
  "LIMITED EDITION COLORWAYS AVAILABLE",
  "VIP MEMBERS GET EARLY ACCESS",
];

export default function MarqueeBar() {
  return (
    <div className="fixed top-0 left-0 w-full z-[300] h-8 overflow-hidden" style={{ backgroundColor: "var(--accent)" }} role="marquee" aria-live="off">
      <div className="flex h-full items-center gap-12 animate-marquee" style={{ whiteSpace: "nowrap", width: "max-content" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="text-black text-[10px] font-bold tracking-[0.25em] uppercase flex items-center gap-3" style={{ fontFamily: "var(--font-mono)" }}>
            <span aria-hidden="true" className="text-black/60 text-[7px]">◆</span> {ANNOUNCEMENTS[i % ANNOUNCEMENTS.length]}
          </span>
        ))}
      </div>
    </div>
  );
}
