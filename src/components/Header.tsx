"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Entrance animations for desktop header
  useGSAP(() => {
    gsap.from(".nav-link-anim", {
      y: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out"
    });
  }, { scope: headerRef });

  // Mobile menu GSAP slide animation
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      
      // Animate drawer sliding in and links staggering up
      const tl = gsap.timeline();
      tl.to(mobileMenuRef.current, {
        x: 0,
        duration: 0.5,
        ease: "power4.out"
      });
      tl.fromTo(
        ".mobile-nav-link",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" },
        "-=0.2"
      );
    } else {
      document.body.style.overflow = "";
      
      // Animate drawer sliding out
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in"
      });
    }
  }, [mobileMenuOpen]);

  // Magnetic Hover Effects
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(button, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    gsap.to(button, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { label: "Specialization", href: "/#about" },
    { label: "Race Events", href: "/events" },
    { label: "About & Gear", href: "/about" }
  ];

  return (
    <>
      <header ref={headerRef} className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            href="/" 
            ref={logoRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex items-center gap-3 group z-50 nav-link-anim"
          >
            <Camera className="h-6 w-6 text-accent group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold tracking-tight uppercase font-display text-foreground group-hover:text-accent transition-colors">
              Shahine<span className="text-accent">.</span>Sports
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith("/events") && link.href === "/events");
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`nav-link-anim hover:text-accent font-semibold transition-colors duration-200 ${
                    isActive ? "text-accent font-bold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <Link 
              href="/#book" 
              ref={ctaRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-black uppercase tracking-wide rounded-md transition-all shadow-lg shadow-accent/10 nav-link-anim cursor-pointer text-xs"
            >
              Book Coverage
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-foreground hover:text-accent z-50 transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Full Screen Menu Drawer */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-30 bg-background/95 backdrop-blur-xl border-l border-border/40 translate-x-full md:hidden flex flex-col justify-center px-12"
      >
        <div className="flex flex-col gap-8 text-left max-w-sm">
          <span className="text-[10px] text-accent font-bold uppercase tracking-widest font-mono border-b border-border pb-2">
            Navigation Menu
          </span>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith("/events") && link.href === "/events");
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={closeMenu}
                className={`mobile-nav-link text-3xl font-black uppercase tracking-tight font-display hover:text-accent transition-colors ${
                  isActive ? "text-accent" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <Link 
            href="/#book"
            onClick={closeMenu}
            className="mobile-nav-link mt-6 px-6 py-4 bg-accent text-accent-foreground text-center font-black uppercase tracking-wider rounded-md shadow-lg shadow-accent/15 cursor-pointer text-sm"
          >
            Book Coverage
          </Link>
        </div>
      </div>
    </>
  );
}
