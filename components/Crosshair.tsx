"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const getMousePos = (e: MouseEvent, container: HTMLElement | null) => {
  if (container) {
    const bounds = container.getBoundingClientRect();
    return { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
  }
  return { x: e.clientX, y: e.clientY };
};

interface CrosshairProps {
  color?: string;
  containerRef?: React.RefObject<HTMLElement | null> | null;
}

const Crosshair = ({ color = "var(--accent)", containerRef = null }: CrosshairProps) => {
  const lineHorizontalRef = useRef<HTMLDivElement>(null);
  const lineVerticalRef = useRef<HTMLDivElement>(null);
  const filterXRef = useRef<SVGElement>(null);
  const filterYRef = useRef<SVGElement>(null);

  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.style.cursor = "none";

    const handleMouseMove = (ev: Event) => {
      const me = ev as MouseEvent;
      mouse.current = getMousePos(me, containerRef?.current ?? null);

      if (containerRef?.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        if (
          me.clientX < bounds.left || me.clientX > bounds.right ||
          me.clientY < bounds.top || me.clientY > bounds.bottom
        ) {
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 0 });
        } else {
          gsap.to([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 1 });
        }
      }
    };

    const target = containerRef?.current || window;
    target.addEventListener("mousemove", handleMouseMove);

    const renderedStyles = {
      tx: { previous: 0, current: 0, amt: 0.15 },
      ty: { previous: 0, current: 0, amt: 0.15 },
    };

    gsap.set([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 0 });

    const onMouseMove = () => {
      renderedStyles.tx.previous = renderedStyles.tx.current = mouse.current.x;
      renderedStyles.ty.previous = renderedStyles.ty.current = mouse.current.y;

      gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
        duration: 0.9,
        ease: "power3.out",
        opacity: 1,
      });

      requestAnimationFrame(render);
      target.removeEventListener("mousemove", onMouseMove);
    };

    target.addEventListener("mousemove", onMouseMove);

    const primitiveValues = { turbulence: 0 };

    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = "url(#filter-noise-x)";
        if (lineVerticalRef.current) lineVerticalRef.current.style.filter = "url(#filter-noise-y)";
      },
      onUpdate: () => {
        if (filterXRef.current && filterYRef.current) {
          filterXRef.current.setAttribute("baseFrequency", String(primitiveValues.turbulence));
          filterYRef.current.setAttribute("baseFrequency", String(primitiveValues.turbulence));
        }
      },
      onComplete: () => {
        if (lineHorizontalRef.current) lineHorizontalRef.current.style.filter = "none";
        if (lineVerticalRef.current) lineVerticalRef.current.style.filter = "none";
      },
    }).to(primitiveValues, {
      duration: 0.5,
      ease: "power1",
      startAt: { turbulence: 1 },
      turbulence: 0,
    });

    const enter = () => tl.restart();
    const leave = () => tl.progress(1).kill();

    const render = () => {
      renderedStyles.tx.current = mouse.current.x;
      renderedStyles.ty.current = mouse.current.y;

      for (const key in renderedStyles) {
        renderedStyles[key as keyof typeof renderedStyles].previous = lerp(
          renderedStyles[key as keyof typeof renderedStyles].previous,
          renderedStyles[key as keyof typeof renderedStyles].current,
          renderedStyles[key as keyof typeof renderedStyles].amt
        );
      }

      gsap.set(lineVerticalRef.current, { x: renderedStyles.tx.previous });
      gsap.set(lineHorizontalRef.current, { y: renderedStyles.ty.previous });

      requestAnimationFrame(render);
    };

    const links = containerRef?.current
      ? containerRef.current.querySelectorAll("a, button, [role='button']")
      : document.querySelectorAll("a, button, [role='button']");

    links.forEach((link) => {
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
    });

    return () => {
      target.removeEventListener("mousemove", handleMouseMove);
      target.removeEventListener("mousemove", onMouseMove);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", enter);
        link.removeEventListener("mouseleave", leave);
      });
      document.body.style.cursor = "auto";
    };
  }, [containerRef]);

  return (
    <div
      style={{
        position: containerRef ? "absolute" as const : "fixed" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterXRef as React.RefObject<SVGFETurbulenceElement>} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence type="fractalNoise" baseFrequency="0.000001" numOctaves="1" ref={filterYRef as React.RefObject<SVGFETurbulenceElement>} />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>
      <div
        ref={lineHorizontalRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "1px",
          background: color,
          pointerEvents: "none",
          transform: "translateY(50%)",
          opacity: 0,
        }}
      />
      <div
        ref={lineVerticalRef}
        style={{
          position: "absolute",
          height: "100%",
          width: "1px",
          background: color,
          pointerEvents: "none",
          transform: "translateX(50%)",
          opacity: 0,
        }}
      />
    </div>
  );
};

export default Crosshair;
