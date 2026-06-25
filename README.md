# KICKFORGE — Where Motion Meets Craft

A premium 3D shoe e-commerce experience built with **Next.js 14**, **GSAP**, **Lenis**, and **Three.js**. Features a scroll-driven hero with 247 frame-scrubbed 360° shoe animation, a violet dark theme, auto-play frame gallery, and cinematic V2 finale.

## ✨ Features

- **Scroll-Scrubbed Hero** — 247 frames (v1), scrubbed via Lenis + GSAP ScrollTrigger, with auto 360° spin on idle (slow, every 3 frames)
- **V2 Cinematic Finale** — 231 frame auto-play full-screen canvas with GSAP text timeline (THE FINAL FRAME → MOVE WITH PURPOSE)
- **Auto-Playing Motion Gallery** — 3 side-by-side canvas loops (150/150/213 frames across 3 angles), pauses when offscreen
- **3D Product Cards** — Tilt-powered featured section with color variant switcher (dynamic `featured: true` filter)
- **Masonry Explore Grid** — Filterable gallery with quick-add modal (25 products)
- **Sale Countdown** — Fixed-date timer with limited-time deals
- **Cart System** — Zustand-powered sidebar cart with persistent state
- **Premium UI** — Custom cursor, floating nav, marquee ticker, starfield background, scroll progress bar, atmospheric particles, glassmorphism cards, split-text reveals, magnetic buttons

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Animation | GSAP + ScrollTrigger, Lenis |
| 3D | Three.js, react-three-fiber, @react-three/drei |
| State | Zustand |
| Styling | Tailwind CSS + CSS Variables |
| Icons | Lucide React |
| Server | Express (products API on :3001) |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev        # → http://localhost:8000

# In a separate terminal, start the products API
node server/server.js  # → http://localhost:3001
```

## 📁 Project Structure

```
kickforge/
├── app/              # Next.js App Router pages & layout
├── components/       # React components (Hero, V2, Featured, Sale, etc.)
│   └── ui/           # Reusable UI primitives
├── lib/              # GSAP config, Lenis, Zustand store, utilities
├── public/
│   ├── frames/       # 991 frame images across 5 folders
│   │   ├── v1/       # 247 frames (5-digit sequential)
│   │   ├── v2/       # 231 frames (5-digit sequential)
│   │   ├── 2.1/      # 150 frames (underscore naming)
│   │   ├── 2.2/      # 150 frames (underscore naming)
│   │   └── 2.3/      # 213 frames (ezgif prefix)
│   └── images/       # 26 product images
├── server/           # Express API & product data (25 products)
└── package.json
```

## 🌐 Live Demo

[View Live](https://kickforge-xi.vercel.app)

## ⚡ Performance Optimizations

- Canvas renders capped at 1280px resolution
- Frames preloaded in parallel batches of 6
- Auto-play canvases pause when offscreen (IntersectionObserver) or tab hidden
- Starfield: 60 stars, pauses when tab hidden
- Atmosphere: 14 particles, frame skip 4
- Lenis: duration 0.9, wheelMultiplier 0.8
- `content-visibility: auto` on sections
- Progressive frame drawing (draws first available frame immediately)

## 📸 Preview

> *Scroll-driven hero with 247-frame 360° shoe rotation, violet dark theme, auto-play motion gallery, and cinematic V2 finale*

## 👤 Author

**Shaikh A Raheman**

- [Instagram](https://www.instagram.com/yolcu__raheman?igsh=YzA5eGJnaHNoZXRk)
- [GitHub](https://github.com/shaikhraheman295ltr-ui)
- [LinkedIn](https://www.linkedin.com/in/shaikh-a-raheman-6015193a2?utm_source=share_via&utm_content=profile&utm_medium=member_android)

## 📄 License

MIT
