"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { initLenis, destroyLenis } from "@/lib/lenis";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import FloatingNav from "@/components/FloatingNav";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import ExploreSection from "@/components/ExploreSection";
import SaleSection from "@/components/SaleSection";
import StatsSection from "@/components/StatsSection";
import AutoPlayFrames from "@/components/AutoPlayFrames";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import AtmosphereLayer from "@/components/AtmosphereLayer";
import MarqueeBar from "@/components/MarqueeBar";
import ScrollProgress from "@/components/ScrollProgress";
import Starfield from "@/components/Starfield";

export default function Home() {
  useEffect(() => {
    const lenis = initLenis();
    let raf: ((t: number) => void) | null = null;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => { clearTimeout(refresh); if (raf) gsap.ticker.remove(raf); destroyLenis(); };
  }, []);

  return (
    <>
      <Starfield opacity={0.4} speed={0.12} />
      <CustomCursor />
      <Preloader />
      <MarqueeBar />
      <ScrollProgress />
      <FloatingNav />
      <CartSidebar />
      <AtmosphereLayer type="dust" opacity={0.08} speed={0.2} />
      <main className="relative z-10">
        <div id="hero-root" style={{ height: "500vh", position: "relative", marginTop: "40px" }}>
          <HeroSection />
        </div>
        <FeaturedSection />
        <StatsSection />
        <ExploreSection />
        <SaleSection />
        <AutoPlayFrames />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
