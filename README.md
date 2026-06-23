# KICKFORGE â€” Where Motion Meets Craft

A premium 3D shoe e-commerce experience built with **Next.js 14**, **GSAP**, **Lenis**, and **Three.js**. Features a scroll-driven hero with 300 frame-scrubbed 360Â° shoe animations, a violet dark theme, and cinematic section transitions.

## âœ¨ Features

- **Scroll-Scrubbed Hero** â€” 300 frames across 2 angles, scrubbed via Lenis + GSAP ScrollTrigger, with auto 360Â° spin on idle
- **3D Product Cards** â€” Tilt-powered featured section with color variant switcher
- **Masonry Explore Grid** â€” Filterable gallery with quick-add modal
- **Sale Countdown** â€” Live timer with limited-time deals
- **Auto-Playing Frame Gallery** â€” 3 side-by-side canvas loops (513 frames across 3 angles)
- **Cart System** â€” Zustand-powered sidebar cart with persistent state
- **Premium UI** â€” Custom cursor, noise overlay, floating nav, marquee ticker, starfield background, scroll progress bar, split-text reveals, magnetic buttons

## ðŸ›  Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Animation | GSAP + ScrollTrigger, Lenis |
| 3D | Three.js, react-three-fiber, @react-three/drei |
| State | Zustand |
| Styling | Tailwind CSS + CSS Variables |
| Icons | Lucide React |
| Server | Express (products API on :3001) |

## ðŸš€ Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev        # â†’ http://localhost:8000

# In a separate terminal, start the products API
node server/server.js  # â†’ http://localhost:3001
```

## ðŸ“ Project Structure

```
kickforge/
â”œâ”€â”€ app/              # Next.js App Router pages & layout
â”œâ”€â”€ components/       # React components (Hero, Featured, Sale, etc.)
â”‚   â””â”€â”€ ui/           # Reusable UI primitives
â”œâ”€â”€ lib/              # GSAP config, Lenis, Zustand store, utilities
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ frames/       # 813 frame images across 5 angle folders
â”‚   â”‚   â”œâ”€â”€ v1/       # Angle 1 (150 frames)
â”‚   â”‚   â”œâ”€â”€ v2/       # Angle 2 (150 frames)
â”‚   â”‚   â”œâ”€â”€ 2.1/      # Angle 3 (150 frames)
â”‚   â”‚   â”œâ”€â”€ 2.2/      # Angle 4 (150 frames)
â”‚   â”‚   â””â”€â”€ 2.3/      # Angle 5 (213 frames)
â”‚   â””â”€â”€ images/       # Product & asset images
â”œâ”€â”€ server/           # Express API & product data
â””â”€â”€ package.json
```

## ðŸŒ Live Demo

[View Live](https://kickforge-xi.vercel.app)

## ðŸ“¸ Preview

> *Scroll-driven hero with 300-frame 360Â° shoe rotation, violet dark theme, and cinematic UI*

## ðŸ‘¤ Author

**Shaikh A Raheman**

- [Instagram](https://www.instagram.com/yolcu__raheman?igsh=YzA5eGJnaHNoZXRk)
- [GitHub](https://github.com/shaikhraheman295ltr-ui)
- [LinkedIn](https://www.linkedin.com/in/shaikh-a-raheman-6015193a2?utm_source=share_via&utm_content=profile&utm_medium=member_android)

## ðŸ“„ License

MIT
