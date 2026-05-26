"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { 
  Camera, 
  Flame, 
  Sliders, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Shield, 
  Cpu, 
  RefreshCw,
  HardDrive,
  Users
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Gear list structured for premium presentation
const GEAR_ITEMS = [
  {
    category: "Camera Bodies",
    items: [
      { name: "Sony Alpha 9 III", desc: "Global shutter sensor, 120 fps burst shooting, zero rolling shutter distortion for fast-moving runners." },
      { name: "Sony Alpha 1", desc: "50.1 MP resolution, 30 fps, dual processors. Used for ultra-high-res marketing prints and branding campaigns." }
    ]
  },
  {
    category: "Lenses",
    items: [
      { name: "Sony FE 70-200mm f/2.8 GM OSS II", desc: "Industry-standard sports lens. Pin-sharp focus tracking, excellent background separation." },
      { name: "Sony FE 400mm f/2.8 GM OSS", desc: "Super-telephoto lens for compressing perspective and isolating runners on trail ridges from distance." },
      { name: "Sony FE 24-70mm f/2.8 GM II", desc: "Standard zoom for wide-angle start line crowds and atmospheric race atmosphere." }
    ]
  },
  {
    category: "Field Operations & Backup",
    items: [
      { name: "Dual-Slot Redundancy", desc: "Every photo is written to two CFexpress cards simultaneously to guarantee zero data loss." },
      { name: "Mobile Satellite Upload", desc: "Real-time on-course uploads via satellite hotspots for instantaneous social media turnarounds." },
      { name: "Weatherproof Enclosures", desc: "All bodies and lenses are double-sealed against dust, mountain rain, and coastal spray." }
    ]
  }
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Entrance animations
    gsap.from(".about-header-anim", {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".about-card-anim", {
      scrollTrigger: {
        trigger: ".about-card-trigger",
        start: "top 80%"
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });

    gsap.from(".gear-section-anim", {
      scrollTrigger: {
        trigger: ".gear-trigger",
        start: "top 80%"
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".gear-card-anim", {
      scrollTrigger: {
        trigger: ".gear-trigger",
        start: "top 70%"
      },
      opacity: 0,
      y: 35,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-background text-foreground flex-1 flex flex-col font-sans">
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20">
        
        {/* Intro Hero banner */}
        <section className="relative py-28 px-6 border-b border-border bg-gradient-to-b from-muted/30 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-60" />
          
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-5 relative z-10 about-header-anim">
            <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono border border-accent/30 bg-accent/10 px-3 py-1 rounded-full">
              The Photographer
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-display leading-tight">
              Behind the Lens: Shahine
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              I document the boundary points of athletic capability. Having run trail ultra-marathons myself, I understand where the mental barriers break, where sponsors' logos get maximum exposure, and how to stay ahead of the pack to capture stories that convert.
            </p>
          </div>
        </section>

        {/* Operational Values Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto w-full about-card-trigger">
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="border border-border p-8 rounded-lg bg-muted/15 flex flex-col gap-4 about-card-anim">
              <div className="p-3 bg-muted border border-border rounded-md w-12 flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold uppercase font-display tracking-tight">Zero-Failure Protocol</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Race events have zero room for error. We run dual CFexpress slots for instant write backups, carry fully redundant weather-sealed bodies, and operate back-up batteries tested to sub-zero temperatures.
              </p>
            </div>

            <div className="border border-border p-8 rounded-lg bg-muted/15 flex flex-col gap-4 about-card-anim">
              <div className="p-3 bg-muted border border-border rounded-md w-12 flex items-center justify-center">
                <Cpu className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold uppercase font-display tracking-tight">Real-Time Media Pipeline</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Using built-in FTPS cameras and localized cellular-satellite nodes, we transmit high-res elite selection files directly from the course to your PR team's inbox while the race is still running.
              </p>
            </div>

            <div className="border border-border p-8 rounded-lg bg-muted/15 flex flex-col gap-4 about-card-anim">
              <div className="p-3 bg-muted border border-border rounded-md w-12 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold uppercase font-display tracking-tight">Sponsor-Centric Eye</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We design our compositions to frame the athlete's peak emotion alongside clearly readable race branding, bib sponsor logos, and partner banner visibility.
              </p>
            </div>

          </div>
        </section>

        {/* The Gear Section */}
        <section className="py-24 px-6 border-t border-border bg-muted/5 gear-trigger">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-14">
            
            <div className="flex flex-col gap-3 max-w-xl gear-section-anim">
              <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono">
                The Equipment
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase font-display">
                Professional Toolkit
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                High-shutter speed cameras, ultra-bright lenses, and rugged field gear. Here is the technical foundation that ensures crisp, sharp details under any lighting and weather conditions.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {GEAR_ITEMS.map((category, catIdx) => (
                <div key={catIdx} className="flex flex-col gap-6 gear-card-anim">
                  <div className="flex items-center gap-3 border-b border-border pb-3">
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <h3 className="text-sm uppercase tracking-wider font-bold text-muted-foreground font-display">
                      {category.category}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-5">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="border border-border p-5 rounded-lg bg-background/50 hover:bg-muted/10 transition-colors">
                        <h4 className="font-bold text-sm text-foreground uppercase tracking-tight">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Closing CTA Call */}
        <section className="py-24 px-6 border-t border-border bg-gradient-to-t from-muted/20 to-background text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase font-display tracking-tight">
              Ready to Capture Your Next Event?
            </h2>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Secure reliable, story-driven race-day coverage. Rates and packing configurations are built around registration size and branding deliverables.
            </p>
            <Link
              href="/#book"
              className="mt-4 px-8 py-4 bg-accent text-accent-foreground font-bold uppercase tracking-wide rounded hover:bg-accent/90 shadow-lg shadow-accent/20 cursor-pointer text-xs transition-transform hover:scale-102"
            >
              Inquire Booking & Rates
            </Link>
          </div>
        </section>

      </main>

    </div>
  );
}
