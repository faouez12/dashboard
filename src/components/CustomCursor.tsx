"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if the device has a pointer/mouse (not just touch)
    const isTouchDevice = 
      "ontouchstart" in window || 
      navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
      return; // Do not initialize custom cursor on touch devices
    }

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // Animate dot instantly
      gsap.to(cursorDotRef.current, {
        x: x,
        y: y,
        duration: 0.05,
        ease: "power2.out",
      });

      // Lag animation for the ring
      gsap.to(cursorRingRef.current, {
        x: x - 16, // Center ring (32px width / 2)
        y: y - 16,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Expand cursor on hovering links/buttons
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest(".interactive") ||
        target.classList.contains("cursor-pointer");

      if (isInteractive) {
        setIsHovered(true);
        gsap.to(cursorRingRef.current, {
          scale: 1.8,
          borderColor: "#5865f2",
          backgroundColor: "rgba(88, 101, 242, 0.1)",
          duration: 0.3,
        });
        gsap.to(cursorDotRef.current, {
          scale: 0.5,
          duration: 0.3,
        });
      } else {
        setIsHovered(false);
        gsap.to(cursorRingRef.current, {
          scale: 1,
          borderColor: "#5865f2",
          backgroundColor: "transparent",
          duration: 0.3,
        });
        gsap.to(cursorDotRef.current, {
          scale: 1,
          duration: 0.3,
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent pointer-events-none z-[9999] transition-opacity duration-300 mix-blend-screen"
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />
      {/* Inner Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-accent pointer-events-none z-[9999] transition-opacity duration-300"
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />
    </>
  );
}
