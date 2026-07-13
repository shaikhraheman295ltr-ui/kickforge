# 🥾 KICKFORGE — Where Motion Meets Craft

<div align="center">

**A cinematic, scroll-driven premium shoe e-commerce experience**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88ce02?logo=greensock)](https://gsap.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://kickforge-xi.vercel.app)

[🔗 Live Demo](https://kickforge-xi.vercel.app) · [🐛 Report Bug](#-known-bugs--limitations) · [✨ Features](#-features)

</div>

---

## 📖 About

**KICKFORGE** is a fully-animated premium shoe e-commerce storefront. It features a 247-frame scroll-scrubbed 3D product rotation in the hero, a cinematic full-screen V2 finale, a multi-angle auto-play motion gallery, and a complete cart system — all wrapped in a dark violet glassmorphism design system.

> Built as a showcase of modern web animation techniques using GSAP, Lenis, Framer Motion, and raw HTML5 Canvas.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎬 **Scroll-Scrubbed Hero** | 247 JPEG frames rendered to canvas, scrubbed via GSAP ScrollTrigger. Idle auto-spin after 4s inactivity |
| 🏁 **Cinematic V2 Finale** | 231-frame auto-play full-screen canvas with GSAP text reveal timeline |
| 🎥 **Motion Gallery** | 3 side-by-side canvas loops (150/150/213 frames), pauses when off-screen |
| 🃏 **3D Product Cards** | Real-time mouse tilt, hue-rotate color preview, reveal-on-hover add-to-bag |
| 🗂️ **Masonry Explore Grid** | 25 products, filterable by category, quick-view modal with size grid |
| ⏰ **Sale Countdown** | Live countdown timer with percentage-off badges |
| 🛒 **Cart Sidebar** | Zustand-powered, slide-in cart with quantity controls and running total |
| ✨ **Ambient FX** | Starfield background, atmospheric particle dust, scroll progress bar, marquee ticker |
| 🖱️ **Custom Cursor** | Branded custom cursor |
| 🧭 **Floating Nav** | Scroll-activated glassmorphism nav with animated active pill, mobile dropdown |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + CSS Custom Properties |
| **Scroll Animation** | GSAP 3.12 + ScrollTrigger |
| **Smooth Scroll** | Lenis 1.1 |
| **UI Animation** | Framer Motion 11 |
| **State Management** | Zustand 4.5 |
| **Icons** | Lucide React |
| **Backend API** | Express.js (port 3001) |
| **Fonts** | Bebas Neue · Inter · Space Mono (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shaikhraheman295ltr-ui/kickforge.git
cd kickforge

# 2. Install dependencies
npm install
```

### Running Locally

```bash
# Start the Next.js dev server  (http://localhost:3000)
npm run dev

# In a separate terminal — start the Express products API  (http://localhost:3001)
npm run server
```

> **Note:** The Next.js frontend currently imports product data directly from `server/products.json`. The Express server is a standalone REST API that can be used for future backend integration.

### Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
kickforge/
├── app/
│   ├── layout.tsx          # Root layout — Google Fonts, metadata, viewport
│   ├── page.tsx            # Main page — Lenis init, GSAP setup, all sections
│   └── globals.css         # Design tokens (CSS vars), global resets, Lenis rules
│
├── components/
│   ├── HeroSection.tsx     # 247-frame scroll-scrubbed canvas hero
│   ├── FeaturedSection.tsx # 3D tilt product cards with color switcher
│   ├── StatsSection.tsx    # Animated counters (GSAP ScrollTrigger)
│   ├── ExploreSection.tsx  # Masonry catalog with filter tabs + quick-view modal
│   ├── SaleSection.tsx     # Sale grid with live countdown timer
│   ├── AutoPlayFrames.tsx  # 3-panel auto-play canvas motion gallery
│   ├── FinalCTA.tsx        # Email capture CTA section
│   ├── V2Section.tsx       # Full-screen autoplay canvas finale
│   ├── Footer.tsx          # Footer with social links
│   ├── CartSidebar.tsx     # Framer Motion slide-in cart
│   ├── FloatingNav.tsx     # Scroll-activated floating navigation
│   ├── Preloader.tsx       # Frame-load progress screen
│   ├── MarqueeBar.tsx      # Fixed top announcement ticker
│   ├── ScrollProgress.tsx  # Page scroll progress bar
│   ├── CustomCursor.tsx    # Custom cursor
│   ├── Starfield.tsx       # Animated star canvas background
│   └── AtmosphereLayer.tsx # Dust/bloom particle canvas layer
│
├── lib/
│   ├── gsap.ts             # GSAP + ScrollTrigger singleton export
│   ├── lenis.ts            # Lenis smooth scroll singleton
│   ├── store.ts            # Zustand cart store (CartItem, CartStore)
│   └── utils.ts            # cn(), lerp(), mapRange(), prefersReducedMotion()
│
├── server/
│   ├── server.js           # Express REST API (GET /api/products, POST /api/order)
│   └── products.json       # 25 products (source of truth)
│
└── public/
    ├── images/             # 26 product images (1.jpg – 25.jpg)
    └── frames/             # ~991 animation frames across 5 folders
        ├── v1/             # Hero scroll sequence     — 247 frames
        ├── v2/             # V2 cinematic autoplay    — 231 frames
        ├── 2.1/            # Motion gallery angle 01  — 150 frames
        ├── 2.2/            # Motion gallery angle 02  — 150 frames
        └── 2.3/            # Motion gallery angle 03  — 213 frames
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0A0A0F` | Page background |
| `--surface` | `#12121A` | Cards, sections |
| `--surface-2` | `#1E1E2A` | Raised UI elements |
| `--accent` | `#8B5CF6` | Primary purple — buttons, highlights |
| `--accent-2` | `#EC4899` | Sale / secondary pink |
| `--ink` | `#FFFFFF` | Primary text |
| `--muted` | `#6B7280` | Secondary text |

### Typography

| Token | Font | Used For |
|---|---|---|
| `--font-display` | Bebas Neue | All section headings |
| `--font-body` | Inter | Body copy |
| `--font-mono` | Space Mono | Labels, prices, UI tags |

---

## 🗄️ Data Model

Each product in `server/products.json`:

```json
{
  "id": 1,
  "name": "PHANTOM X1",
  "price": 189,
  "salePrice": null,
  "onSale": false,
  "category": "running",
  "featured": true,
  "colors": ["#E8FF00", "#FF2D2D", "#FFFFFF"],
  "sizes": [6, 7, 8, 9, 10, 11, 12],
  "image": "/images/1.jpg",
  "description": "Engineered for velocity. Carbon-fibre plate, responsive foam stack."
}
```

**Categories:** `running` · `lifestyle` · `training` · `outdoor`  
**Total Products:** 25 (10 featured, 9 on sale)  
**Price Range:** $119 – $299

---

## 🌐 Express API

The standalone Express server runs on **port 3001**.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | All products. Query: `?category=running`, `?sale=true`, `?featured=true` |
| `GET` | `/api/products/:id` | Single product by ID |
| `POST` | `/api/order` | Order stub — logs items and returns order ID |

```bash
# Example requests
curl http://localhost:3001/api/products?category=running
curl http://localhost:3001/api/products/1
curl -X POST http://localhost:3001/api/order \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":1,"quantity":1}],"total":189}'
```

---

## ⚡ Performance Optimisations

- **Canvas cap** — Hero canvas capped at 1280px to limit GPU memory
- **3-phase frame loading** — Frame 0 immediately → coarse every-12th pass → full sequential batch (6 at a time)
- **Intersection Observer** — AutoPlay canvases pause rendering when scrolled off-screen
- **Tab visibility** — All canvas animations pause when the browser tab is hidden
- **Atmosphere downscale** — `AtmosphereLayer` renders at 25% resolution, upscaled by CSS
- **Frame-skip** — Atmosphere only redraws every 4th RAF tick
- **`content-visibility: auto`** — Applied to all major sections for off-screen paint savings
- **`prefers-reduced-motion`** — All GSAP and canvas animations fully disabled for accessibility

---

## 🐛 Known Bugs & Limitations

> These are current limitations of the project. Contributions to fix them are welcome!

### 🔴 High Priority

| # | Component | Bug |
|---|---|---|
| 1 | `ExploreSection` | **Size picker is UI-only** — clicking a size doesn't select it. "ADD TO BAG" always adds `sizes[0]` |
| 2 | `FeaturedSection` | **No size selection** before adding to bag — defaults to first size in array |

### 🟡 Medium Priority

| # | Component | Bug |
|---|---|---|
| 3 | `CartSidebar` | **"CHECKOUT →" button has no handler** — no payment integration yet |
| 4 | `FinalCTA` | **Email form has no submit handler** — doesn't call any API |
| 5 | `V2Section` | **Animation plays immediately on mount** (with `delay:1`) regardless of scroll position — should be scroll-triggered |
| 6 | `SaleSection` | **Countdown resets every page reload** — target is `Date.now() + 3 days`, not server-persisted |
| 7 | `server.js` | **Express API is disconnected from Next.js** — frontend imports JSON directly instead of fetching the API |

### 🟠 Low Priority

| # | Component | Issue |
|---|---|---|
| 8 | `MarqueeBar`, `HeroSection` | Uses `<style jsx>` (styled-jsx) which is not natively supported in the Next.js App Router without extra Babel config — styles work but are not properly scoped |
| 9 | `next.config.js` | `images.formats: ["image/webp"]` is set but all `<img>` tags are used instead of `next/image` — WebP optimisation is inactive |
| 10 | `AutoPlayFrames` | `onVisibility` handler is a no-op (`if (!document.hidden) return` does nothing useful) |
| 11 | `package.json` | `three`, `@react-three/fiber`, `@react-three/drei` are installed but not used — adds unused bundle weight |

---

## 🗺️ Roadmap

- [ ] Fix size selection state in Explore modal and Featured cards
- [ ] Integrate Stripe or Razorpay for real checkout
- [ ] Wire email form to a mailing list API (Mailchimp / Resend)
- [ ] Connect Next.js frontend to the Express API (or migrate to Next.js API Routes)
- [ ] Add product detail pages with routing (`/product/[id]`)
- [ ] Persist sale countdown via server or `localStorage`
- [ ] Migrate `<img>` tags to `next/image` for automatic WebP + lazy loading
- [ ] Add wishlist functionality
- [ ] Add search and price-range filters
- [ ] Replace `<style jsx>` blocks with proper `globals.css` `@keyframes`
- [ ] Remove unused Three.js dependencies or build a 3D product viewer with them

---

## 👤 Author

**Shaikh A Raheman**

[![Instagram](https://img.shields.io/badge/Instagram-@yolcu__raheman-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/yolcu__raheman?igsh=YzA5eGJnaHNoZXRk)
[![GitHub](https://img.shields.io/badge/GitHub-shaikhraheman295ltr--ui-181717?logo=github)](https://github.com/shaikhraheman295ltr-ui)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Shaikh%20A%20Raheman-0A66C2?logo=linkedin)](https://www.linkedin.com/in/shaikh-a-raheman-6015193a2?utm_source=share_via&utm_content=profile&utm_medium=member_android)

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

<div align="center">

Made with 💜 by **Shaikh A Raheman** · KICKFORGE © 2026

</div>
