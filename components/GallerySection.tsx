"use client";
import AccordionGallery from "./AccordionGallery";

const items = [
  { image: "/images/19.jpg", label: "IRON CORE",     link: "/product/19", alt: "Iron Core training shoe" },
  { image: "/images/20.jpg", label: "APEX LEGEND",   link: "/product/20", alt: "Apex Legend running shoe" },
  { image: "/images/21.jpg", label: "SHADOW STRIKE", link: "/product/21", alt: "Shadow Strike training shoe" },
  { image: "/images/22.jpg", label: "CYBER WAVE",    link: "/product/22", alt: "Cyber Wave lifestyle shoe" },
  { image: "/images/23.jpg", label: "OBSIDIAN LOW",  link: "/product/23", alt: "Obsidian Low lifestyle shoe" },
  { image: "/images/24.jpg", label: "STORM FURY",    link: "/product/24", alt: "Storm Fury outdoor shoe" },
];

export default function GallerySection() {
  return (
    <section className="relative py-24 px-6 md:px-16" style={{ backgroundColor: "var(--background)" }}>
      <div className="mb-10 t-stagger">
        <span className="t-stagger-line t-stagger-line--1" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--accent)", textTransform: "uppercase" }}>
          — 03.6 / COLLECTION
        </span>
        <h2 className="t-stagger-line t-stagger-line--2" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 7vw, 8rem)", lineHeight: 0.85, color: "var(--ink)", letterSpacing: "0.02em" }}>
          THE LINEUP
        </h2>
      </div>

      <AccordionGallery
        items={items}
        defaultIndex={2}
        expandRatio={0.52}
        trigger="click"
        accentColor="#8B5CF6"
        overlayColor="#0A0A0F"
        textColor="#FFFFFF"
        height={460}
        gap={10}
        radius={16}
      />
    </section>
  );
}
