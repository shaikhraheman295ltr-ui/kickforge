# KICKFORGE — Where Motion Meets Craft

A premium 3D shoe e-commerce experience built with **Next.js 14**, **GSAP**, **Lenis**, and **Three.js**. Features a scroll-driven hero with 300 frame-scrubbed 360° shoe animations, a violet dark theme, and cinematic section transitions.

## ✨ Features

- **Scroll-Scrubbed Hero** — 300 frames across 2 angles, scrubbed via Lenis + GSAP ScrollTrigger, with auto 360° spin on idle
- **3D Product Cards** — Tilt-powered featured section with color variant switcher
- **Masonry Explore Grid** — Filterable gallery with quick-add modal
- **Sale Countdown** — Live timer with limited-time deals
- **Auto-Playing Frame Gallery** — 3 side-by-side canvas loops (513 frames across 3 angles)
- **Cart System** — Zustand-powered sidebar cart with persistent state
- **Premium UI** — Custom cursor, noise overlay, floating nav, marquee ticker, starfield background, scroll progress bar, split-text reveals, magnetic buttons

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
├── components/       # React components (Hero, Featured, Sale, etc.)
│   └── ui/           # Reusable UI primitives
├── lib/              # GSAP config, Lenis, Zustand store, utilities
├── public/
│   ├── frames/       # 813 frame images across 5 angle folders
│   │   ├── v1/       # Angle 1 (150 frames)
│   │   ├── v2/       # Angle 2 (150 frames)
│   │   ├── 2.1/      # Angle 3 (150 frames)
│   │   ├── 2.2/      # Angle 4 (150 frames)
│   │   └── 2.3/      # Angle 5 (213 frames)
│   └── images/       # Product & asset images
├── server/           # Express API & product data
└── package.json
```

## 🌐 Live Demo

[View Live](https://kickforge-xi.vercel.app)

## 📸 Preview

> *Scroll-driven hero with 300-frame 360° shoe rotation, violet dark theme, and cinematic UI*

## 👤 Author

**Shaikh A Raheman**

- [Instagram](https://www.instagram.com/yolcu__raheman?igsh=YzA5eGJnaHNoZXRk)
- [GitHub](https://github.com/shaikhraheman295ltr-ui)
- [LinkedIn](https://www.linkedin.com/in/shaikh-a-raheman-6015193a2?utm_source=share_via&utm_content=profile&utm_medium=member_android)

## 📄 License

MIT
