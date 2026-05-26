"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Menu, X, ArrowRight, Sparkles, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const platformLinks = [
    { label: "Shahine* Home", href: "/" },
    { label: "Specialization", href: "/#about" },
    { label: "Race Events", href: "/events" },
    { label: "About & Gear", href: "/about" },
  ];

  const resourcesLinks = [
    { label: "Photo Gallery", href: "/gallery" },
    { label: "Endurance Journal", href: "/blog" },
    { label: "Book Live Coverage", href: "/#book" },
  ];

  return (
    <>
      {/* Floating Header — Closed State */}
      <header className="fixed top-0 left-0 w-full h-20 z-40 bg-background/90 backdrop-blur-md border-b border-border transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

          {/* Logo — Left */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Camera className="h-5 w-5 text-accent group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-lg font-bold tracking-tight uppercase font-display text-foreground group-hover:text-accent transition-colors">
              Shahine<span className="text-accent"> Photography</span>
            </span>
          </Link>

          {/* Theme Toggle + Menu Toggle — Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted border border-border hover:border-accent/60 text-foreground hover:text-accent transition-all duration-300 cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 bg-muted border border-border hover:border-accent/60 text-foreground hover:text-accent px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
            >
              <Menu className="h-4 w-4" />
              <span>Menu</span>
            </button>
          </div>

        </div>
      </header>

      {/* Full-Screen Mega Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          style={{ boxShadow: "0 4px 60px rgba(59,91,219,0.08)" }}
          >
            {/* Overlay Header Bar */}
            <div className="h-20 border-b border-border w-full px-6 flex items-center justify-between max-w-7xl mx-auto shrink-0">
              {/* Logo Left */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <Camera className="h-5 w-5 text-accent group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-lg font-bold tracking-tight uppercase font-display text-foreground group-hover:text-accent transition-colors">
                  Shahine<span className="text-accent"> Photography</span>
                </span>
              </Link>

              {/* Close Button Right */}
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 bg-muted border border-border hover:border-accent/60 text-foreground hover:text-accent px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span>Close</span>
              </button>
            </div>

            {/* Menu Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-14 max-w-7xl mx-auto w-full flex flex-col justify-center">
              <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                
                {/* Column PLATFORM */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest font-mono border-b border-border pb-2.5">
                    Platform
                  </span>
                  <div className="flex flex-col gap-4">
                    {platformLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="text-2xl font-black uppercase tracking-tight text-foreground hover:text-accent transition-colors font-display"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column JOURNAL & WORK */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest font-mono border-b border-border pb-2.5">
                    Journal & Work
                  </span>
                  <div className="flex flex-col gap-4">
                    {resourcesLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="text-2xl font-black uppercase tracking-tight text-foreground hover:text-accent transition-colors font-display"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column FEATURED PROJECTS */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest font-mono border-b border-border pb-2.5">
                    Featured Chronicles
                  </span>
                  <div className="grid sm:grid-cols-2 gap-6">
                    
                    {/* Featured Card 1 */}
                    <Link
                      href="/events/boston-marathon"
                      className="group border border-slate-200 hover:border-accent/50 rounded-[1.5rem] bg-slate-50 p-6 flex flex-col justify-between h-64 overflow-hidden relative transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/30 via-teal-950/20 to-transparent opacity-40 group-hover:opacity-80 transition-opacity z-0" />
                      <div className="relative z-10 flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold text-accent border border-accent/20 bg-accent/5 px-2.5 py-1 rounded">
                          BOSTON
                        </span>
                        <Sparkles className="h-4.5 w-4.5 text-accent animate-pulse" />
                      </div>
                      <div className="relative z-10 mt-auto">
                        <h4 className="text-md font-bold uppercase text-slate-900 group-hover:text-accent transition-colors font-display">
                          Boston Marathon
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                          Finish line stagers & heartbreaks. Real-time media configurations.
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-accent mt-3">
                          <span>Explore study</span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>

                    {/* Featured Card 2 */}
                    <Link
                      href="/events/utmb-mont-blanc"
                      className="group border border-slate-200 hover:border-accent/50 rounded-[1.5rem] bg-slate-50 p-6 flex flex-col justify-between h-64 overflow-hidden relative transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/30 via-teal-950/20 to-transparent opacity-40 group-hover:opacity-80 transition-opacity z-0" />
                      <div className="relative z-10 flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold text-accent border border-accent/20 bg-accent/5 px-2.5 py-1 rounded">
                          CHAMONIX
                        </span>
                        <Camera className="h-4.5 w-4.5 text-accent" />
                      </div>
                      <div className="relative z-10 mt-auto">
                        <h4 className="text-md font-bold uppercase text-foreground group-hover:text-accent transition-colors font-display">
                          UTMB Mont Blanc
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                          Ridge running & sub-zero pass photography. Weather-proof configurations.
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-accent mt-3">
                          <span>Explore study</span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>

                  </div>
                </div>

              </div>
            </div>

            {/* Overlay Footer bottom bar */}
            <div className="h-16 border-t border-border w-full px-6 flex items-center justify-between max-w-7xl mx-auto shrink-0 text-[10px] text-muted-foreground font-mono">
              <span>Shahine Photography © 2026</span>
              <span>Chalk & Cobalt Navigation V2</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
