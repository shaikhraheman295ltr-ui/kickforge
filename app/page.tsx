"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { initLenis, destroyLenis } from "@/lib/lenis";
import CustomCursor from "@/components/CustomCursor";
import Crosshair from "@/components/Crosshair";
import Preloader from "@/components/Preloader";
import FloatingNav from "@/components/FloatingNav";
import HeroSection from "@/components/HeroSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import LoginModal from "@/components/LoginModal";
import dynamic from "next/dynamic";

// Below-the-fold sections are code-split so their JS is not part of the initial
// route bundle. They still render on the server (default ssr: true), so there is
// no SEO or layout-shift cost.
const FeaturedSection = dynamic(() => import("@/components/FeaturedSection"));
const StatsSection = dynamic(() => import("@/components/StatsSection"));
const ExploreSection = dynamic(() => import("@/components/ExploreSection"));
const SaleSection = dynamic(() => import("@/components/SaleSection"));
const AutoPlayFrames = dynamic(() => import("@/components/AutoPlayFrames"));
const GallerySection = dynamic(() => import("@/components/GallerySection"));

import AtmosphereLayer from "@/components/AtmosphereLayer";
import MarqueeBar from "@/components/MarqueeBar";
import ScrollProgress from "@/components/ScrollProgress";
import Starfield from "@/components/Starfield";

export default function Home() {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = isMobile || reduced ? null : initLenis();
    let raf: ((t: number) => void) | null = null;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 800);

    const staggerObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("is-shown"); staggerObs.unobserve(e.target); } });
    }, { threshold: 0.2 });
    const staggerEls = document.querySelectorAll(".t-stagger");
    staggerEls.forEach(el => staggerObs.observe(el));

    return () => { clearTimeout(refresh); if (raf) gsap.ticker.remove(raf); if (lenis) destroyLenis(); staggerObs.disconnect(); };
  }, []);

  return (
    <>
      <Starfield opacity={0.4} speed={0.12} />
      <Crosshair />
      <CustomCursor />
      <Preloader />
      <MarqueeBar />
      <ScrollProgress />
      <FloatingNav />
      <CartSidebar />
      <LoginModal />
      <AtmosphereLayer type="dust" opacity={0.08} speed={0.2} />
      <main id="main-content" className="relative z-10">
        <div id="hero-root" style={{ height: "400vh", position: "relative", marginTop: "40px" }}>
          <HeroSection />
        </div>
        <FeaturedSection />
        <StatsSection />
        <ExploreSection />
        <SaleSection />
        <AutoPlayFrames />
        <GallerySection />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
