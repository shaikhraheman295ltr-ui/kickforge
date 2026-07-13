Create a minimalist 3D watch e-commerce landing page with the following specifications:

## Core Architecture
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Framer Motion + GSAP + ScrollTrigger for animations
- Lenis smooth scrolling (duration: 0.9, wheelMultiplier: 0.8)
- Minimalist aesthetic: clean whitespace, monochromatic palette, subtle interactions, no clutter

## Design System — Minimalist
```css
--background: #FAFAF9;      /* warm off-white */
--surface: #FFFFFF;
--surface-2: #F5F5F4;
--accent: #1C1917;          /* almost black */
--accent-2: #78716C;        /* warm gray */
--accent-3: #D6D3D1;
--ink: #1C1917;
--muted: #A8A29E;
--border: rgba(28,25,23,0.08);
--glass: rgba(255,255,255,0.7);
```
- Fonts: Inter (body, 300/400/500 weight), Playfair Display (headings, serif), JetBrains Mono (accent text)
- No gradients, no heavy shadows, no glows
- Every element must earn its place — if it doesn't add clarity, remove it
- Generous whitespace (py-32+ for sections)
- Low visual noise: thin borders (0.5px), light grays, no heavy backgrounds

## Frame-Based Auto-Play Canvas Sections
Each section plays JPEG image sequences on a canvas element. All must use:
- Delta-time based speed: `0.3 * (dt / 16.67)` — slower, meditative pace
- Index advances ONLY when the frame is successfully drawn (natural throttle)
- First loaded frame drawn as static poster immediately (no blank canvas)
- Canvas capped at 1280px width (v1, v2, v3) or 640px (gallery)
- IntersectionObserver pauses/resumes (only advance index when visible)
- Page Visibility API — pause when tab hidden
- prefers-reduced-motion: disable all animations

### Section 1 — Hero (v1 folder: frame00001.jpg to frame00XXX.jpg)
- Auto-play loop, starts after preloader finishes
- 400vh wrapper with ScrollTrigger text phases (inter serif, minimal fade):
  - "LUMINARY" → "Crafted by time." → "Not by trend." → "Every gear. Decided." → "Before you wore it."
  - Each phase: GSAP timeline with scrub:1, subtle opacity + translateY (no 3D perspective)
  - Final "Define your time." at 75-92% scroll (scrub:true)
- Canvas overlay: very subtle linear gradient (0.15 opacity max)
- Image preloading with progress events dispatched to Preloader

### Section 2 — V2 Section (v2 folder)
- Full-screen auto-play, IntersectionObserver start/stop
- GSAP timeline: "The Masterpiece" (serif) + subtitle → fade → "Timeless elegance"

### Section 3 — V3 Section (v3 folder, end of page)
- Same auto-play canvas pattern, before footer
- GSAP scroll-triggered text reveal

### Section 4 — Motion Gallery (folders 2.1, 2.2, 2.3)
- 3-column grid, rounded cards with minimal labels
- Each: auto-play loop, 640px canvas cap

## Preloader
- Pure white background, minimalist
- Shows brand name in serif + thin progress line (1px height)
- No percentage text, just a clean line that fills
- On complete: line fills, brief pause, then content fades in
- Dispatches "hero-start" after exit completes

## FloatingNav
- Transparent, no background until scrolled (then white with thin border)
- Items in lowercase: heritage, collection, explore, offers
- Sans-serif, thin weight, generous letter-spacing
- Cart with minimal badge

## Page Sections (in order)
1. FloatingNav + MarqueeBar (thin, subtle, muted text on white)
2. HeroSection (400vh wrapper)
3. FeaturedSection — 3-column grid, product cards with subtle hover lift (no 3D tilt, just translateY -2px), color dots as thin rings, clean typography
4. StatsSection — minimal numbers with thin divider lines (50k+, 120+, 400+, 99%)
5. ExploreSection — clean masonry grid, category filters as underlined text (not pills), product modal with scale transition
6. SaleSection — countdown in thin sans-serif, products with thin "sale" tag
7. AutoPlayFrames (Motion Gallery)
8. FinalCTA — email input with thin border, no button background (just text + underline on hover)
9. V2Section or V3Section
10. Footer — minimal text links, centered, tiny copyright

## Products (server/products.json) — 25 watches
Use the same product structure but adapt names to minimalist tone. Keep descriptions clean and direct.

## Performance & UX — Minimalist Principles
- No decorative elements that don't serve content
- No emojis, no heavy shadows, no dramatic gradients
- Content is the hero, not the UI
- White space is a feature, not empty space
- All interactions must feel intentional, not flashy
- focus-visible outlines in accent color
- aria-labels on icon-only buttons
- Touch targets minimum 44x44px
- SVG icons (Lucide) in thin stroke weight
- cursor-pointer on interactive elements
- Loading states on async buttons
- prefers-reduced-motion respected

## Transitions.dev patterns (adapted for minimalism)
- Icon swap on mobile nav (subtle opacity crossfade, no blur)
- Dropdown on mobile menu (simplified fade, no scale)
- Modal on product detail (simple opacity transition)
- Section heading reveal (subtle fade + 8px translateY)
- Success check on form (simple fade in)