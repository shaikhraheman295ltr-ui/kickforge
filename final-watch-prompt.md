Create a minimalist 3D watch e-commerce landing page with the following specifications:

## Core Architecture
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Framer Motion + GSAP + ScrollTrigger for animations
- Lenis smooth scrolling (duration: 0.9, wheelMultiplier: 0.8)
- Minimalist aesthetic: clean whitespace, monochromatic palette, subtle interactions, no clutter

## Design System
```css
--background: #FAFAF9;
--surface: #FFFFFF;
--surface-2: #F5F5F4;
--accent: #1C1917;
--accent-2: #78716C;
--accent-3: #D6D3D1;
--ink: #1C1917;
--muted: #A8A29E;
--border: rgba(28,25,23,0.08);
--glass: rgba(255,255,255,0.7);
```
- Fonts: Inter (body, 300/400/500), Playfair Display (headings, serif), JetBrains Mono (accent)
- No gradients, no heavy shadows, no glows
- Generous whitespace (py-32+ sections), thin borders, light grays

## Frame-Based Auto-Play Canvas Sections
Each section plays JPEG image sequences on a canvas element. All must use:
- Delta-time speed: `0.3 * (dt / 16.67)` — frame-rate independent, slow meditative pace
- Index advances ONLY when frame successfully drawn (natural throttle)
- First loaded frame drawn as static poster immediately (no blank canvas)
- Canvas capped at 1280px width (hero/v2/v3) or 640px (gallery)
- IntersectionObserver pauses/resumes (advance index only when visible)
- Page Visibility API — pause when tab hidden
- prefers-reduced-motion: disable all animations

### Section 1 — Hero (v1 folder: frame00001.jpg to frame00XXX.jpg, 5-digit padding)
- Auto-play loop, starts ONLY after preloader dispatches "hero-start"
- 400vh wrapper with ScrollTrigger text phases (serif headings, minimal fade + translateY):
  - "LUMINARY" → "Crafted by time." → "Not by trend." → "Every gear. Decided." → "Before you wore it."
  - Each phase: GSAP timeline with scrub:1, subtle opacity + translateY (no 3D)
  - Final "Define your time." at 75-92% scroll
- Canvas overlay: linear gradient (max 0.15 opacity)
- Image preloading with progress events dispatched to Preloader

### Section 2 — V2 Section (v2 folder: frame00001.jpg to frame00XXX.jpg)
- Full-screen auto-play, IntersectionObserver start/stop
- GSAP timeline: "The Masterpiece" (serif) + italic subtitle → fade → "Timeless elegance"

### Section 3 — V3 Section (v3 folder, end of page before footer)
- Same auto-play canvas pattern, GSAP scroll-triggered text reveal

### Section 4 — Motion Gallery (folders 2.1, 2.2, 2.3)
- 3-column grid, rounded cards with minimal labels
- Each: auto-play loop, 640px canvas cap

## Preloader
- White background, brand name in serif
- Thin progress line (1px height, accent color) — no percentage text
- On complete: line fills, brief pause, content fades out
- Dispatches "hero-start" event after exit animation

## FloatingNav
- Transparent until scrolled → white with thin bottom border
- Items lowercase: heritage, collection, explore, offers
- Inter thin weight, generous letter-spacing
- Cart with minimal dot badge
- Mobile: icon-swap (hamburger/close) + simple fade dropdown

## Page Sections (in order)

### 1. MarqueeBar
- Thin bar, white bg, muted text
- Scrolling: "Free shipping on orders $500+" / "New arrival every monday" / "Limited edition pieces"

### 2. HeroSection (400vh wrapper)
- Canvas auto-play with scroll-triggered text phases

### 3. FeaturedSection
- 3-column grid, product cards
- Subtle hover: translateY(-2px), no 3D tilt
- Color dots as thin rings (2px border, no glow)
- Size/lug selector, clean "Add to bag" outlined button
- Products filtered by `featured: true`

### 4. StatsSection
- 4 minimal counters: 50k+ wrists, 120+ countries, 400+ designs, 99% satisfaction
- Thin divider lines between stats
- Animated count-up on scroll (GSAP ScrollTrigger, once: true)

### 5. ExploreSection
- Masonry grid catalog
- Category filters as underlined text: all / dress / diver / chrono / pilot / smart
- Product detail modal with simple opacity + scale transition (t-modal)
- Size selector, add to bag

### 6. SaleSection
- Countdown timer (days / hrs / min / sec) in thin sans-serif
- Sale products with discreet "sale" text tag (no badge)
- Minimal product cards, outlined "Add to bag"

### 7. AutoPlayFrames (Motion Gallery)
- 3 canvas loops side by side
- Each labeled minimally (angle 01, angle 02, angle 03)

### 8. FinalCTA
- "Be first to the window" heading (serif)
- Email input with thin bottom border only (no full border)
- Submit: text button with underline on hover (no background)
- Loading state, validation error in muted red
- Success: simple checkmark fade in

### 9. V2Section or V3Section

### 10. Footer
- Centered, minimal
- Brand name (serif) + social text links (instagram, github, linkedin)
- Tiny copyright, no borders

## Products — 25 Watches (server/products.json)
```json
[
  { "id":1, "name":"LUMINARY LEGACY", "price":2499, "salePrice":null, "onSale":false, "category":"dress", "featured":true, "colors":["#1C1917","#F5F5F4","#D6D3D1"], "sizes":[38,40,42,44], "image":"/images/1.jpg", "description":"Hand-wound mechanical. 18k gold-plated case, sapphire crystal, alligator strap." },
  { "id":2, "name":"ABYSS DIVER", "price":1899, "salePrice":null, "onSale":false, "category":"diver", "featured":true, "colors":["#1C1917","#78716C"], "sizes":[40,42,44,46], "image":"/images/2.jpg", "description":"300m water resistance, ceramic bezel, helium escape valve." },
  { "id":3, "name":"CHRONO RACER", "price":2199, "salePrice":1699, "onSale":true, "category":"chrono", "featured":true, "colors":["#1C1917","#D6D3D1"], "sizes":[40,42,44], "image":"/images/3.jpg", "description":"Automatic chronograph, tachymeter bezel, leather rally strap." },
  { "id":4, "name":"NIGHT HAWK", "price":1599, "salePrice":null, "onSale":false, "category":"pilot", "featured":true, "colors":["#0A0A0F","#78716C"], "sizes":[42,44,46], "image":"/images/4.jpg", "description":"GMT dual-time, Super-LumiNova dial, titanium case." },
  { "id":5, "name":"MINIMALIST", "price":1299, "salePrice":999, "onSale":true, "category":"dress", "featured":true, "colors":["#FAFAF9","#1C1917"], "sizes":[36,38,40], "image":"/images/5.jpg", "description":"Ultra-thin quartz, Milanese mesh bracelet, scratch-resistant crystal." },
  { "id":6, "name":"CARBON X", "price":2999, "salePrice":null, "onSale":false, "category":"chrono", "featured":true, "colors":["#1C1917","#F5F5F4"], "sizes":[42,44], "image":"/images/6.jpg", "description":"Forged carbon case, skeleton dial, exhibition caseback." },
  { "id":7, "name":"DEEP BLUE", "price":1799, "salePrice":null, "onSale":false, "category":"diver", "featured":false, "colors":["#1C1917","#78716C"], "sizes":[40,42,44], "image":"/images/7.jpg", "description":"200m WR, unidirectional bezel, rubber strap with deployment clasp." },
  { "id":8, "name":"SKELETON", "price":3499, "salePrice":null, "onSale":false, "category":"dress", "featured":true, "colors":["#D6D3D1","#1C1917"], "sizes":[40,42], "image":"/images/8.jpg", "description":"Open-heart automatic, rose gold indices, sapphire front and back." },
  { "id":9, "name":"FIELD COMMANDER", "price":1399, "salePrice":1099, "onSale":true, "category":"pilot", "featured":false, "colors":["#78716C","#1C1917"], "sizes":[40,42,44], "image":"/images/9.jpg", "description":"MIL-SPEC durability, 24hr dial, nylon NATO strap, lumed hands." },
  { "id":10, "name":"URBAN EDGE", "price":999, "salePrice":null, "onSale":false, "category":"smart", "featured":false, "colors":["#1C1917","#FAFAF9"], "sizes":[38,40,42], "image":"/images/10.jpg", "description":"Hybrid smartwatch, 14-day battery, activity tracking, analog face." },
  { "id":11, "name":"GOLDEN ERA", "price":4999, "salePrice":null, "onSale":false, "category":"dress", "featured":true, "colors":["#1C1917","#D6D3D1"], "sizes":[38,40], "image":"/images/11.jpg", "description":"Limited edition. Tourbillon movement, numbered dial, exhibition back." },
  { "id":12, "name":"STEALTH", "price":2199, "salePrice":null, "onSale":false, "category":"diver", "featured":false, "colors":["#0A0A0F","#1C1917"], "sizes":[42,44,46], "image":"/images/12.jpg", "description":"DLC-coated black steel, 600m WR, automatic movement." },
  { "id":13, "name":"MONACO SPIRIT", "price":2799, "salePrice":2299, "onSale":true, "category":"chrono", "featured":false, "colors":["#1C1917","#78716C"], "sizes":[40,42], "image":"/images/13.jpg", "description":"Square case racing chronograph, push-button clasp, leather strap." },
  { "id":14, "name":"ARCTIC EXPLORER", "price":1999, "salePrice":null, "onSale":false, "category":"pilot", "featured":false, "colors":["#FAFAF9","#1C1917"], "sizes":[42,44], "image":"/images/14.jpg", "description":"White dial explorer. 24hr bezel, anti-magnetic, 100m WR." },
  { "id":15, "name":"NOVA", "price":1499, "salePrice":null, "onSale":false, "category":"dress", "featured":false, "colors":["#1C1917","#F5F5F4"], "sizes":[36,38,40], "image":"/images/15.jpg", "description":"Roman numerals, sunburst dial, thin profile, deployant buckle." },
  { "id":16, "name":"RECON GMT", "price":1799, "salePrice":1499, "onSale":true, "category":"pilot", "featured":false, "colors":["#78716C","#1C1917"], "sizes":[42,44], "image":"/images/16.jpg", "description":"Tactical GMT, 24hr bezel, tritium tubes, sapphire crystal." },
  { "id":17, "name":"WAVE RUNNER", "price":1699, "salePrice":null, "onSale":false, "category":"diver", "featured":false, "colors":["#1C1917","#D6D3D1"], "sizes":[40,42,44], "image":"/images/17.jpg", "description":"Wave-pattern dial, 200m WR, ceramic bezel, automatic." },
  { "id":18, "name":"VINTAGE 59", "price":2399, "salePrice":null, "onSale":false, "category":"dress", "featured":false, "colors":["#D6D3D1","#78716C","#1C1917"], "sizes":[36,38,40], "image":"/images/18.jpg", "description":"Retro reissue. Hand-wound, domed acrylic crystal, aged lume." },
  { "id":19, "name":"TITAN EDGE", "price":1899, "salePrice":null, "onSale":false, "category":"chrono", "featured":false, "colors":["#F5F5F4","#1C1917"], "sizes":[42,44], "image":"/images/19.jpg", "description":"Grade 5 titanium, flyback chronograph, exhibition caseback." },
  { "id":20, "name":"CONNECT PRO", "price":799, "salePrice":null, "onSale":false, "category":"smart", "featured":false, "colors":["#1C1917","#FAFAF9"], "sizes":[38,40,42], "image":"/images/20.jpg", "description":"AMOLED display, GPS, heart rate, 7-day battery, always-on." },
  { "id":21, "name":"SHADOW STRIKE", "price":2599, "salePrice":null, "onSale":false, "category":"diver", "featured":false, "colors":["#0A0A0F","#78716C"], "sizes":[42,44,46], "image":"/images/21.jpg", "description":"Full black DLC, 1000m WR, helium valve, automatic." },
  { "id":22, "name":"CYBER WAVE", "price":1299, "salePrice":null, "onSale":false, "category":"smart", "featured":false, "colors":["#1C1917","#F5F5F4"], "sizes":[38,40], "image":"/images/22.jpg", "description":"Neon edge smartwatch, customizable dials, fitness suite." },
  { "id":23, "name":"OBSIDIAN", "price":3499, "salePrice":2799, "onSale":true, "category":"dress", "featured":false, "colors":["#1C1917","#D6D3D1"], "sizes":[38,40,42], "image":"/images/23.jpg", "description":"Black ceramic case, moonphase complication, alligator leather." },
  { "id":24, "name":"STORM FURY", "price":1999, "salePrice":null, "onSale":false, "category":"chrono", "featured":false, "colors":["#78716C","#1C1917"], "sizes":[42,44], "image":"/images/24.jpg", "description":"Limited chrono, carbon dial, exhibition caseback." },
  { "id":25, "name":"NOVA PRO", "price":4999, "salePrice":3999, "onSale":true, "category":"dress", "featured":true, "colors":["#1C1917","#FAFAF9"], "sizes":[40,42], "image":"/images/25.jpg", "description":"Flagship perpetual calendar. Platinum case, sapphire crystal, bracelet." }
]
```
Product images go in `/public/images/` as `1.jpg` through `25.jpg`.

## Cart (Zustand Store)
- State: items[], isOpen
- Actions: addItem, removeItem, updateQty, total, openCart, closeCart
- Each item: { id, name, price, image, size, quantity }
- CartSidebar: slides from right, spring animation
- Checkout: POST to `/api/order`, fallback local order ID
- Persistent sale end date in localStorage (3-day window)

## Components to Build

### `components/Preloader.tsx`
- White bg, brand serif text, 1px progress line
- Listens for "hero-progress" custom event
- On 100%: GSAP exit → dispatches "hero-start"

### `components/FloatingNav.tsx`
- Transparent → scrolled: white bg, thin border-bottom
- Desktop: horizontal links (heritage, collection, explore, offers) + cart
- Mobile: icon-swap (Menu/X via t-icon-swap) + simple fade dropdown
- CartStore integration: badge count

### `components/MarqueeBar.tsx`
- Thin white bar, muted scrolling text

### `components/HeroSection.tsx`
- Canvas auto-play (247 or whatever frames)
- 400vh wrapper, ScrollTrigger text phases
- Waits for "hero-start" event before starting RAF loop
- Delta-time speed, poster on first frame loaded

### `components/V2Section.tsx` & `components/V3Section.tsx`
- Same canvas pattern
- GSAP scroll-triggered text

### `components/FeaturedSection.tsx`
- 3-column grid, `product.featured` filter
- Card hover: translateY(-2px), subtle border change
- Color dots: 2px ring, active = filled
- Size selector, outlined "Add to bag"

### `components/StatsSection.tsx`
- 4 counters with GSAP ScrollTrigger animated count-up

### `components/ExploreSection.tsx`
- Masonry grid, category filters as underlined text
- Product detail modal with t-modal transition

### `components/SaleSection.tsx`
- Countdown timer hook (localStorage persistence)
- Sale product cards, discreet "sale" label

### `components/AutoPlayFrames.tsx`
- 3 AutoPlayer instances (folders 2.1, 2.2, 2.3)
- 640px canvas cap, poster drawing, delta-time

### `components/FinalCTA.tsx`
- Email input (thin bottom border), text button with hover underline
- Loading state, validation, success checkmark

### `components/Footer.tsx`
- Centered: brand + social links + copyright

### `components/CustomCursor.tsx`
- Minimal: thin ring + dot, hidden on touch

### `components/CartSidebar.tsx`
- Spring slide from right, item list, qty controls, total, checkout

### `components/ScrollProgress.tsx`
- Thin line at top of viewport

## Performance & UX Rules
- content-visibility: auto on sections
- Canvas capped resolution (1280px / 640px)
- Delta-time frame-rate independent animation
- Index only advances on successful drawImage
- Progressive frame rendering (no wait for all frames)
- prefers-reduced-motion: zero all transitions
- focus-visible outlines in accent color on all interactive
- aria-labels on icon-only buttons
- Touch targets minimum 44x44px
- SVG icons from lucide-react (thin stroke)
- cursor-pointer on buttons, links, clickable cards
- Loading/disabled state on async buttons
- No emojis as UI icons

## Transitions (adapted for minimalism)
- **Icon swap** (t-icon-swap): simple opacity crossfade, no blur/scale
- **Dropdown** (t-dropdown): simple opacity fade, no scale transform
- **Modal** (t-modal): simple opacity + subtle scale (0.98→1)
- **Section headings** (t-stagger): fade + 8px translateY, 400ms
- **Success check**: simple fade in checkmark, no rotation/bounce
- All with prefers-reduced-motion guards
