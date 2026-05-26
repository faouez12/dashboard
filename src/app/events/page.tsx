"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Event items list
interface EventItem {
  id: number;
  slug: string;
  title: string;
  location: string;
  date: string;
  type: "marathon" | "trail" | "cycling";
  runners: string;
  gradient: string;
  desc: string;
  highlight: string;
}

const EVENTS_DATA: EventItem[] = [
  {
    id: 1,
    slug: "boston-marathon",
    title: "Boston Marathon",
    location: "Boston, USA",
    date: "April 2026",
    type: "marathon",
    runners: "30,000+ Runners",
    gradient: "from-blue-950/40 via-zinc-950 to-zinc-900",
    desc: "Elite road coverage focusing on key mile marks, historic pacing, and high-tension emotional finishes near Copley Square.",
    highlight: "Finish line stagers & heartbreaks"
  },
  {
    id: 2,
    slug: "utmb-mont-blanc",
    title: "UTMB Mont Blanc",
    location: "Chamonix, France",
    date: "August 2025",
    type: "trail",
    runners: "10,000+ Runners",
    gradient: "from-indigo-950/40 via-zinc-950 to-zinc-900",
    desc: "Physically demanding trail documentation covering remote ridges, alpine night stretches, and extreme altitude weather conditions.",
    highlight: "Ridge running & sub-zero mountain pass shots"
  },
  {
    id: 3,
    slug: "london-marathon",
    title: "London Marathon",
    location: "London, UK",
    date: "April 2026",
    type: "marathon",
    runners: "40,000+ Runners",
    gradient: "from-violet-950/40 via-zinc-950 to-zinc-900",
    desc: "Wide crowds and landmark framing. Highlighting brand sponsor placements along the River Thames and historic bridges.",
    highlight: "Tower Bridge pack dynamics & sponsor branding"
  },
  {
    id: 4,
    slug: "zermatt-mountain-marathon",
    title: "Zermatt Mountain Marathon",
    location: "Zermatt, Switzerland",
    date: "July 2025",
    type: "trail",
    runners: "3,000+ Runners",
    gradient: "from-sky-950/40 via-zinc-950 to-zinc-900",
    desc: "Sublime mountain backdrops framing high-intensity trail effort, shot on narrow paths with lightweight weatherized rigs.",
    highlight: "Matterhorn background compression portraits"
  },
  {
    id: 5,
    slug: "berlin-marathon",
    title: "Berlin Marathon",
    location: "Berlin, Germany",
    date: "September 2025",
    type: "marathon",
    runners: "45,000+ Runners",
    gradient: "from-neutral-900 via-zinc-950 to-neutral-900",
    desc: "Speed-focused documentation of the world's fastest course. Catching shoe strikes, stride mechanics, and historic gate crossings.",
    highlight: "Elite shoe macros & Brandenburg Gate finish"
  }
];

export default function EventsArchivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "marathon" | "trail" | "cycling">("all");

  // Filtering logic
  const filteredEvents = activeFilter === "all"
    ? EVENTS_DATA
    : EVENTS_DATA.filter(ev => ev.type === activeFilter);

  useGSAP(() => {
    // Header anims
    gsap.from(".events-header-anim", {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  // Stagger reveal cards when filter changes
  useGSAP(() => {
    gsap.fromTo(
      ".event-card-anim",
      { opacity: 0, scale: 0.96, y: 24 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { dependencies: [activeFilter], scope: containerRef });

  return (
    <div ref={containerRef} className="bg-background text-foreground flex-1 flex flex-col font-sans">
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20">

        {/* Hero Section */}
        <section className="relative py-28 px-6 border-b border-border bg-gradient-to-b from-muted/30 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-60" />
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10 events-header-anim">
            <div className="flex flex-col items-start gap-4">
              <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono border border-accent/30 bg-accent/10 px-3.5 py-1 rounded-full">
                Race Archives
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-display leading-tight">
                Case Study Galleries
              </h1>
              <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
                Click into any race archive below to explore our event narratives, camera gear logs, and on-course brand integration details.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2.5 border-t border-border pt-4 md:border-none md:pt-0 self-start md:self-end">
              {(["all", "marathon", "trail", "cycling"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4.5 py-2.5 text-[10px] uppercase tracking-wider font-bold rounded border transition-all cursor-pointer ${
                    activeFilter === filter
                      ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/15"
                      : "bg-muted border-border text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {filter === "all" ? "All races" : `${filter}s`}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Link
                href={`/events/${event.slug}`}
                key={event.id}
                className="group border border-border rounded-xl overflow-hidden bg-muted/10 hover:bg-muted/20 hover:border-accent transition-all flex flex-col justify-between h-96 event-card-anim opacity-0"
              >
                {/* Simulated Thumbnail */}
                <div className={`h-48 w-full bg-gradient-to-tr ${event.gradient} flex items-center justify-center p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                  <Camera className="h-10 w-10 text-white/10 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                  
                  <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded border border-white/10 text-[10px] font-mono text-white/90">
                    <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                    <span>{event.highlight}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col justify-between flex-grow gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-accent">
                      <span>{event.type}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {event.location}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-accent transition-colors font-display">
                      {event.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {event.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 text-xs font-bold text-muted-foreground uppercase tracking-wider group-hover:text-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {event.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {event.runners}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
