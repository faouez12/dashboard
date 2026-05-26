"use client";

import React, { useState, use, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles,
  Maximize2,
  X,
  ArrowLeft,
  Info,
  Clock,
  CloudSun
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Full detailed dataset for events
interface EventDetail {
  slug: string;
  title: string;
  location: string;
  date: string;
  runners: string;
  weather: string;
  gearUsed: string;
  gradient: string;
  intro: string;
  technicalLog: string;
  gallery: {
    id: number;
    title: string;
    category: "start" | "grit" | "finish" | "details";
    specs: string;
    gradient: string;
    description: string;
  }[];
}

const EVENTS_DETAILS: Record<string, EventDetail> = {
  "boston-marathon": {
    slug: "boston-marathon",
    title: "Boston Marathon",
    location: "Boston, USA",
    date: "April 2026",
    runners: "30,000+ Athletes",
    weather: "Cool, 12°C, Overcast",
    gearUsed: "Sony A9 III + 70-200mm f/2.8 GM II",
    gradient: "from-orange-950 via-amber-950 to-zinc-900",
    intro: "The Boston Marathon demands capturing raw energy over a long point-to-point course. From the nervous excitement of Hopkinton to the grueling elevation changes of Heartbreak Hill and the crowded tears near Copley Square.",
    technicalLog: "For this race, the high-speed global shutter of the Sony A9 III was crucial to capture runner stride mechanics without rolling shutter distortions. The 70-200mm GM II lens was used for isolating runners against compressed street backgrounds while preserving sponsor banner clarity.",
    gallery: [
      { id: 101, title: "The Preamble", category: "start", specs: "70mm • f/2.8 • 1/500s", gradient: "from-amber-900/60 to-zinc-900", description: "Corral packing in Hopkinton as final gear adjustments are made in the cool morning air." },
      { id: 102, title: "Heartbreak Climb", category: "grit", specs: "200mm • f/2.8 • 1/1600s", gradient: "from-orange-900/60 to-zinc-900", description: "Mid-race grit as runners battle the infamous incline, faces etched with effort." },
      { id: 103, title: "Boylston Scream", category: "finish", specs: "135mm • f/2.0 • 1/2000s", gradient: "from-red-900/60 to-zinc-900", description: "Finisher crossing the line with arms raised in victory, crowd out of focus in the background." },
      { id: 104, title: "Medals of honor", category: "details", specs: "50mm Macro • f/3.2 • 1/500s", gradient: "from-stone-900/60 to-zinc-900", description: "Finisher medals gleaming on the blue ribbons, stacked near the finish line tents." }
    ]
  },
  "utmb-mont-blanc": {
    slug: "utmb-mont-blanc",
    title: "UTMB Mont Blanc",
    location: "Chamonix, France",
    date: "August 2025",
    runners: "10,000+ Athletes",
    weather: "Alpine shifts, -2°C to 18°C",
    gearUsed: "Sony A1 + 400mm f/2.8 GM + 24-70mm GM II",
    gradient: "from-teal-950 via-zinc-950 to-zinc-900",
    intro: "UTMB is the pinnacle of trail running. It is a 170km loop around Mont Blanc with 10,000 meters of elevation change. Capturing this event requires scaling mountains to catch athletes battling night cold, steep peaks, and sunrise crossings.",
    technicalLog: "We packed lightweight weatherized carbon rigs to hike to remote alpine passes. The Sony Alpha 1's 50MP sensor allowed cropping into wide mountain panoramas to isolate runners on high ridge paths under variable morning lighting.",
    gallery: [
      { id: 201, title: "The Arc Lights", category: "start", specs: "24mm • f/2.8 • 1/120s", gradient: "from-teal-950/60 to-zinc-900", description: "Chamonix town center glows under floodlights as thousands of headlamps await the UTMB start signal." },
      { id: 202, title: "Col du Bonhomme Pass", category: "grit", specs: "400mm • f/2.8 • 1/1200s", gradient: "from-blue-900/60 to-zinc-900", description: "Runners scale the snowy alpine pass at 2,300m, Materhorn silhouettes visible in distant mist." },
      { id: 203, title: "Finisher Cheers", category: "finish", specs: "85mm • f/1.4 • 1/800s", gradient: "from-teal-900/60 to-zinc-900", description: "Finisher embraced by family in Chamonix plaza, bell towers ringing in background." },
      { id: 204, title: "Frozen Hydration", category: "details", specs: "90mm Macro • f/4.0 • 1/1000s", gradient: "from-sky-950/60 to-zinc-900", description: "Frozen ice particles forming on an athlete's collapsible hydration flask." }
    ]
  },
  "london-marathon": {
    slug: "london-marathon",
    title: "London Marathon",
    location: "London, UK",
    date: "April 2026",
    runners: "40,000+ Athletes",
    weather: "Mist clearing, 14°C",
    gearUsed: "Sony A9 III + 24-70mm f/2.8 GM II",
    gradient: "from-cyan-950 via-sky-950 to-zinc-900",
    intro: "The London Marathon features massive crowds and historic cityscapes. Our coverage prioritized capturing the dense packing of runners crossing Tower Bridge, side-by-side with brand integration and public celebration.",
    technicalLog: "Used high-contrast wide framing to emphasize sponsor branding visibility. The fast burst rates on the Sony A9 III allowed capturing clean action loops of the leading pack with zero shutter lag under changing bridge shadows.",
    gallery: [
      { id: 301, title: "The Morning Corrals", category: "start", specs: "35mm • f/4.0 • 1/250s", gradient: "from-teal-900/60 to-zinc-900", description: "Greenwich park corrals fill as thousands of runners stretch under early morning fog." },
      { id: 302, title: "Tower Bridge Crowd", category: "grit", specs: "24mm • f/5.6 • 1/500s", gradient: "from-sky-900/60 to-zinc-900", description: "A wall of runners crossing Tower Bridge, framed by historical towers and roaring spectators." },
      { id: 303, title: "Mall Finish", category: "finish", specs: "135mm • f/2.0 • 1/1600s", gradient: "from-rose-900/60 to-zinc-900", description: "Crossing the line under Buckingham Palace arches, arms pointing to the sky." },
      { id: 304, title: "The Foil Capes", category: "details", specs: "50mm • f/1.8 • 1/800s", gradient: "from-zinc-800/60 to-zinc-900", description: "Finisher capes catching morning light as volunteers wrap shivering runners." }
    ]
  }
};

interface GalleryItemType {
  id: number;
  title: string;
  category: "start" | "grit" | "finish" | "details";
  specs: string;
  gradient: string;
  description: string;
}

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const event = EVENTS_DETAILS[slug] || EVENTS_DETAILS["boston-marathon"];
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Gallery Filtering State
  const [activeTab, setActiveTab] = useState<"all" | "start" | "grit" | "finish" | "details">("all");
  
  // Tabs indication refs
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeIndicatorRef = useRef<HTMLDivElement>(null);

  // Lightbox Modal State
  const [selectedImage, setSelectedImage] = useState<GalleryItemType | null>(null);

  const filteredGallery = activeTab === "all"
    ? event.gallery
    : event.gallery.filter(item => item.category === activeTab);

  useGSAP(() => {
    // Entrance animations
    gsap.from(".event-header-anim", {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".event-panel-anim", {
      scrollTrigger: {
        trigger: ".event-panel-trigger",
        start: "top 80%"
      },
      opacity: 0,
      y: 35,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  // Stagger reveal cards when filter changes
  useGSAP(() => {
    gsap.fromTo(
      ".gallery-card-anim",
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );

    // Sliding indicator pill transition
    const activeButton = tabRefs.current[activeTab];
    if (activeButton && activeIndicatorRef.current) {
      gsap.to(activeIndicatorRef.current, {
        x: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
        duration: 0.35,
        ease: "power2.out"
      });
    }
  }, { dependencies: [activeTab], scope: containerRef });

  // Lightbox Modal Animation
  useEffect(() => {
    if (selectedImage) {
      gsap.fromTo(".modal-backdrop", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.fromTo(".modal-content", 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }
      );
    }
  }, [selectedImage]);

  return (
    <div ref={containerRef} className="bg-background text-foreground flex-1 flex flex-col font-sans">
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20">

        {/* Hero Section */}
        <section className="relative py-28 px-6 border-b border-border bg-gradient-to-b from-muted/30 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-60" />
          
          <div className="max-w-4xl mx-auto flex flex-col items-start gap-6 relative z-10 event-header-anim">
            <Link 
              href="/events" 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors group mb-2"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to all events</span>
            </Link>

            <span className="text-[10px] md:text-xs uppercase tracking-widest bg-accent/20 border border-accent/40 text-accent px-3.5 py-1 rounded-full font-bold">
              Race Narrative Study
            </span>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-display leading-tight">
              {event.title}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {event.intro}
            </p>
          </div>
        </section>

        {/* Metadata & Technical log panel */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full event-panel-trigger">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left side: specs card */}
            <div className="lg:col-span-5 flex flex-col gap-6 event-panel-anim">
              <h3 className="text-lg font-bold uppercase font-display tracking-tight border-b border-border pb-3">
                Race Log Metadata
              </h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-muted/20 border border-border p-4 rounded-lg">
                  <MapPin className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Location</div>
                    <div className="text-sm font-bold mt-0.5">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-muted/20 border border-border p-4 rounded-lg">
                  <Calendar className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Event Date</div>
                    <div className="text-sm font-bold mt-0.5">{event.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-muted/20 border border-border p-4 rounded-lg">
                  <Users className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Registration size</div>
                    <div className="text-sm font-bold mt-0.5">{event.runners}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-muted/20 border border-border p-4 rounded-lg">
                  <CloudSun className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Weather Conditions</div>
                    <div className="text-sm font-bold mt-0.5">{event.weather}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: tech logic details */}
            <div className="lg:col-span-7 flex flex-col gap-6 event-panel-anim">
              <h3 className="text-lg font-bold uppercase font-display tracking-tight border-b border-border pb-3 flex items-center gap-3">
                <Info className="h-5 w-5 text-accent" /> Technical Rationale
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed bg-muted/15 border border-border p-6 rounded-lg">
                {event.technicalLog}
              </p>
              <div className="border border-border p-6 rounded-lg bg-zinc-950/60 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                  <Camera className="h-4 w-4 text-accent" />
                  <span>Configured Gear: <span className="text-foreground font-bold">{event.gearUsed}</span></span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Narrative Photo Grid */}
        <section className="py-24 px-6 border-t border-border bg-muted/5">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-10">
            
            {/* Filter tab header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold uppercase font-display tracking-tight">Race Narrative Gallery</h3>
                <p className="text-xs text-muted-foreground">Filter this race case-study by its timeline checkpoints.</p>
              </div>

              {/* Tabs */}
              <div className="relative flex flex-wrap gap-2 bg-muted/40 p-1 rounded-lg border border-border">
                {/* Sliding indicator pill */}
                <div 
                  ref={activeIndicatorRef} 
                  className="absolute bg-accent rounded pointer-events-none z-0" 
                  style={{ height: "calc(100% - 8px)", top: "4px", left: 0, width: 0 }}
                />
                
                {(["all", "start", "grit", "finish", "details"] as const).map((tab) => (
                  <button
                    key={tab}
                    ref={(el) => { tabRefs.current[tab] = el; }}
                    onClick={() => setActiveTab(tab)}
                    className={`relative z-10 px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold rounded transition-colors duration-300 cursor-pointer ${
                      activeTab === tab
                        ? "text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative h-80 rounded-lg overflow-hidden border border-border bg-zinc-950 flex flex-col justify-end p-6 cursor-pointer hover:border-accent transition-all hover:-translate-y-1 gallery-card-anim"
                >
                  <div className={`absolute inset-0 bg-gradient-to-tr ${item.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                  
                  {/* Overlay technical specs */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 z-10">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-accent bg-accent/15 px-2.5 py-1 rounded border border-accent/20 self-start font-bold">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-white/95 font-mono mt-auto">
                      <Camera className="h-4 w-4 text-accent" />
                      <span>{item.specs}</span>
                    </div>
                  </div>

                  {/* Card base info */}
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-accent transition-colors font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-accent font-bold uppercase tracking-wider mt-2 group-hover:translate-x-1.5 transition-transform">
                      <span>View details</span>
                      <Maximize2 className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-md modal-backdrop opacity-0">
          <div className="relative max-w-4xl w-full bg-zinc-950 border border-border rounded-xl overflow-hidden flex flex-col modal-content opacity-0">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-accent transition-colors border border-white/10 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Simulated Image Box */}
            <div className={`h-[50vh] min-h-[320px] w-full bg-gradient-to-tr ${selectedImage.gradient} flex items-center justify-center relative p-8`}>
              <div className="absolute inset-0 bg-black/20" />
              <Camera className="h-16 w-16 text-white/10 relative z-10" />
            </div>

            {/* Modal Body Context */}
            <div className="p-6 md:p-8 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <span className="text-[10px] text-accent uppercase tracking-widest font-bold font-mono">
                    Narrative Stage: {selectedImage.category}
                  </span>
                  <h3 className="text-2xl font-bold uppercase tracking-tight mt-1 font-display">
                    {selectedImage.title}
                  </h3>
                </div>
                
                {/* Tech Specs */}
                <div className="flex items-center gap-2 bg-muted border border-border px-3.5 py-2.5 rounded-md font-mono text-xs text-muted-foreground self-start sm:self-center">
                  <Camera className="h-4 w-4 text-accent" />
                  <span>{selectedImage.specs}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Shot Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
