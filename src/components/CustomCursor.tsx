"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// SVG Camera icon matching the Lucide "Camera" shape used in the logo
const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    style={{ display: "block" }}
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only show on non-touch devices
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // Camera icon follows cursor instantly (offset so icon centre is at pointer)
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: x - 10, // half of 20px icon
          y: y - 10,
          duration: 0.05,
          ease: "power2.out",
        });
      }

      // Outer ring lags slightly behind
      if (cursorRingRef.current) {
        gsap.to(cursorRingRef.current, {
          x: x - 22, // half of 44px ring
          y: y - 22,
          duration: 0.35,
          ease: "power3.out",
        });
      }
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

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
        if (cursorRingRef.current) {
          gsap.to(cursorRingRef.current, {
            scale: 1.6,
            borderColor: "#00f5ff",
            backgroundColor: "rgba(0, 245, 255, 0.08)",
            duration: 0.3,
          });
        }
        if (cursorRef.current) {
          gsap.to(cursorRef.current, { scale: 1.3, duration: 0.3 });
        }
      } else {
        setIsHovered(false);
        if (cursorRingRef.current) {
          gsap.to(cursorRingRef.current, {
            scale: 1,
            borderColor: "#00f5ff",
            backgroundColor: "transparent",
            duration: 0.3,
          });
        }
        if (cursorRef.current) {
          gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
        }
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
      {/* Outer ring — lagging */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-11 h-11 rounded-full border border-accent pointer-events-none z-[9999] mix-blend-screen"
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform",
        }}
      />

      {/* Camera icon — precise position */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] text-accent mix-blend-screen"
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform",
          filter: "drop-shadow(0 0 6px rgba(0,245,255,0.8))",
        }}
      >
        <CameraIcon />
      </div>
    </>
  );
}
