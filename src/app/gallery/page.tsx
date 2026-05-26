"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, MapPin, Calendar, Layers, Maximize2, X, Sparkles, Filter } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import AuroraBackground from "@/components/AuroraBackground";
import { EvervaultCard } from "@/components/ui/EvervaultCard";

interface GalleryItem {
  id: number;
  title: string;
  category: "road" | "trail" | "brand" | "action";
  location: string;
  specs: string;
  gradient: string;
  description: string;
  year: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 1,
    title: "Apex Stride",
    category: "road",
    location: "Berlin Marathon",
    specs: "85mm • f/2.0 • 1/2000s • ISO 100",
    gradient: "from-blue-900/60 to-slate-900",
    description: "An elite runner's foot strike capturing the exact moment of energy release on tarmac.",
    year: "2025"
  },
  {
    id: 2,
    title: "Summit Ridge Line",
    category: "trail",
    location: "UTMB Chamonix",
    specs: "400mm • f/2.8 • 1/1600s • ISO 200",
    gradient: "from-teal-900/60 to-slate-900",
    description: "Endurance athletes dwarfed by the massive granite spikes of the French Alps under high-contrast noon light.",
    year: "2025"
  },
  {
    id: 3,
    title: "Velocity Branding",
    category: "brand",
    location: "Zenith Footwear Campaign",
    specs: "50mm • f/1.4 • 1/4000s • ISO 50",
    gradient: "from-teal-900/60 to-slate-900",
    description: "Commercial campaign detailing shoe mechanics, mud sprays, and brand logo placement in active trail conditions.",
    year: "2026"
  },
  {
    id: 4,
    title: "Heartbreak Peak",
    category: "action",
    location: "Boston Marathon",
    specs: "135mm • f/1.8 • 1/1600s • ISO 100",
    gradient: "from-rose-900/60 to-slate-900",
    description: "Close-up portrait of extreme grit and sweat during the final incline pushes near Mile 21.",
    year: "2026"
  },
  {
    id: 5,
    title: "The Chamonix Glow",
    category: "trail",
    location: "Zermatt Ultra",
    specs: "24mm • f/4.0 • 1/80s • ISO 800",
    gradient: "from-amber-900/60 to-slate-900",
    description: "Headlamp trails of ultra runners winding up alpine switchbacks during the pre-dawn freezing hours.",
    year: "2025"
  },
  {
    id: 6,
    title: "Tower Pack Flow",
    category: "road",
    location: "London Marathon",
    specs: "70mm • f/2.8 • 1/1200s • ISO 100",
    gradient: "from-sky-900/60 to-slate-900",
    description: "Compressed perspective showing thousands of runners crossing the historic Tower Bridge.",
    year: "2026"
  },
  {
    id: 7,
    title: "Fluid Hydration",
    category: "brand",
    location: "HydraGel Commercial",
    specs: "90mm Macro • f/3.2 • 1/1000s • ISO 160",
    gradient: "from-blue-950/60 to-slate-900",
    description: "Micro details of ice and sweat droplets forming on an athlete's specialized hydration flask.",
    year: "2026"
  },
  {
    id: 8,
    title: "The Finish Leap",
    category: "action",
    location: "Berlin Finish Arch",
    specs: "50mm • f/1.8 • 1/2500s • ISO 200",
    gradient: "from-teal-900/60 to-slate-900",
    description: "Capturing the final, victorious step of an amateur marathoner leaping over the timer mat.",
    year: "2025"
  }
];

export default function GalleryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "road" | "trail" | "brand" | "action">("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeFilter === "all"
    ? GALLERY_DATA
    : GALLERY_DATA.filter(item => item.category === activeFilter);

  useGSAP(() => {
    // Header text entrance
    gsap.from(".gallery-header-anim", {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: "power4.out"
    });
  }, { scope: containerRef });

  // Grid fade and stagger when filter updates
  useGSAP(() => {
    gsap.fromTo(
      ".grid-item-anim",
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { dependencies: [activeFilter], scope: containerRef });

  // Lightbox animation triggers
  useEffect(() => {
    if (selectedItem) {
      gsap.fromTo(".modal-backdrop", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.fromTo(".modal-content", 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.2)" }
      );
    }
  }, [selectedItem]);

  return (
    <div ref={containerRef} className="bg-background text-foreground flex-1 flex flex-col font-sans">
      
      <main className="flex-1 flex flex-col pt-20">
        
        {/* Gallery Intro Banner with Aurora */}
        <section className="relative py-28 px-6 border-b border-border overflow-hidden">
          <AuroraBackground className="py-12">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6 relative z-10 gallery-header-anim">
              <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono border border-accent/20 bg-accent/5 px-4 py-1.5 rounded-full">
                MOMENTUM CHRONICLES
              </span>
              <h1 className="text-4xl md:text-7xl font-black uppercase font-display leading-[0.9] tracking-tighter">
                MEDIA ARCHIVE
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                A high-fidelity display of split-second endurance victories, camera configuration metadata, and raw race-day energy.
              </p>
              
              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-2 mt-8 bg-muted/40 p-1.5 rounded-xl border border-border">
                {([
                  { key: "all", label: "All Works" },
                  { key: "road", label: "Road Marathon" },
                  { key: "trail", label: "Trail / Mountain" },
                  { key: "brand", label: "Brand Campaigns" },
                  { key: "action", label: "Peak Action" }
                ] as const).map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
                      activeFilter === filter.key
                        ? "bg-accent text-accent-foreground shadow-lg shadow-accent/15"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </AuroraBackground>
        </section>

        {/* Masonry-Style Bento Grid */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative h-96 rounded-[2rem] overflow-hidden border border-border bg-muted/10 flex flex-col justify-end p-8 cursor-pointer hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 grid-item-anim"
              >
                {/* Visual Block Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${item.gradient} opacity-25 group-hover:opacity-40 transition-opacity duration-500 z-0`} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors pointer-events-none z-0" />

                {/* Tech Specs Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 z-10 rounded-[2rem]">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-accent bg-accent/10 px-3 py-1 rounded border border-accent/20 self-start font-bold">
                    {item.category}
                  </span>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-white font-mono">
                      <Camera className="h-4 w-4 text-accent" />
                      <span>{item.specs}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {item.location}
                    </span>
                  </div>
                </div>

                {/* Grid Item Bottom Details */}
                <div className="relative z-10 flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest font-mono">
                    {item.location}
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-accent transition-colors font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-1 text-[10px] text-accent font-black uppercase tracking-widest mt-2 group-hover:translate-x-1 transition-transform">
                    <span>Inspect Shot</span>
                    <Maximize2 className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-md modal-backdrop opacity-0">
          <div className="relative max-w-4xl w-full bg-muted/90 border border-border rounded-[2.5rem] overflow-hidden flex flex-col modal-content opacity-0 shadow-2xl shadow-black/80">
            
            {/* Modal Close */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 z-20 p-2.5 bg-black/60 text-white rounded-full hover:bg-accent transition-all border border-white/10 cursor-pointer"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image Placeholder Block */}
            <div className={`h-[50vh] min-h-[350px] w-full bg-gradient-to-tr ${selectedItem.gradient} flex items-center justify-center relative p-8`}>
              <div className="absolute inset-0 bg-black/25" />
              <Camera className="h-16 w-16 text-white/15 relative z-10 animate-pulse" />
              
              <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 bg-black/70 px-4 py-2 rounded-lg border border-white/10 text-[10px] font-mono text-white/95 uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                <span>RAW CAPTURE PROFILE</span>
              </div>
            </div>

            {/* Specs & Narrative body */}
            <div className="p-8 md:p-10 flex flex-col gap-6 bg-background">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border pb-6">
                <div>
                  <span className="text-[10px] text-accent uppercase tracking-widest font-mono font-bold">
                    Chronicle Year: {selectedItem.year}
                  </span>
                  <h3 className="text-3xl font-black uppercase tracking-tight mt-1.5 font-display text-white">
                    {selectedItem.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2.5 bg-muted border border-border px-4 py-3 rounded-xl font-mono text-xs text-muted-foreground self-start sm:self-center">
                  <Camera className="h-4.5 w-4.5 text-accent" />
                  <span>{selectedItem.specs}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold font-mono">Location & Context</span>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-4 w-4 text-accent" /> {selectedItem.location}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold font-mono">Artistic & Technical Direction</span>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                    {selectedItem.description} Focus is locked dynamic on runners center point, emphasizing biomechanical motion against blurred natural environment backgrounds.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
