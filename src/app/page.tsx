"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Flame, 
  Sliders, 
  MapPin, 
  Calendar, 
  Users, 
  Award, 
  TrendingUp, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Maximize2,
  X
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Mock Data for Hero Slider
const HERO_SLIDES = [
  {
    id: 1,
    title: "THE FINISH LINE VICTORY",
    subtitle: "Endurance sports photography built on raw human emotion.",
    stat: "1/2000s shutter speed catches every tear, drop of sweat, and triumphant shout.",
    tag: "Finish Line",
    gradient: "from-lime-500/20 via-zinc-950 to-zinc-950"
  },
  {
    id: 2,
    title: "MID-RACE RESOLVE",
    subtitle: "Documenting the grit of backcountry trail marathons.",
    stat: "Shot in demanding, high-altitude alpine terrain under extreme light shifts.",
    tag: "Mid-Race Grit",
    gradient: "from-emerald-500/20 via-zinc-950 to-zinc-950"
  },
  {
    id: 3,
    title: "THE MORNING SURGE",
    subtitle: "Sponsor visibility matched with athlete energy at the start line.",
    stat: "Wide-angle capture of 30,000+ runners beginning their journey.",
    tag: "The Start Line",
    gradient: "from-cyan-500/20 via-zinc-950 to-zinc-950"
  }
];

// Mock Data for Specialization Cards
const SPECIALTIES = [
  {
    icon: <Flame className="h-6 w-6 text-accent" />,
    title: "Marathons & Road Races",
    desc: "Start lines, pack dynamics, elite pacing, and high-emotion finish arches. Engineered for race organizers needing quick media turnarounds."
  },
  {
    icon: <Sliders className="h-6 w-6 text-accent" />,
    title: "Trail & Ultra Running",
    desc: "Backcountry endurance events, steep vertical accents, and remote aid stations. Physically capable of covering remote trail points."
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-accent" />,
    title: "Athletic Brand Campaigns",
    desc: "Commercial-grade shots focused on footwear, apparel, and sponsor placements. Highlighting brand logos in live, unscripted race contexts."
  }
];

// Mock Data for Statistics
const STATS = [
  { value: "120+", label: "Races Covered" },
  { value: "80,000+", label: "Runners Captured" },
  { value: "15+", label: "International Brands" },
  { value: "12h", label: "Media Delivery Time" }
];

// Gallery Items
interface GalleryItem {
  id: number;
  title: string;
  event: string;
  category: "start" | "grit" | "finish" | "details";
  specs: string;
  gradient: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: "The Pre-Dawn Crowd",
    event: "Chamonix Ultra Trail",
    category: "start",
    specs: "24mm • f/2.8 • 1/125s • ISO 1600",
    gradient: "from-emerald-950 via-zinc-950 to-zinc-900",
    description: "The nervous tension of 2,500 runners illuminated under headlamps at the starting arch."
  },
  {
    id: 2,
    title: "Ridge Runner Grit",
    event: "Zermatt Mountain Marathon",
    category: "grit",
    specs: "70mm • f/4.0 • 1/1600s • ISO 200",
    gradient: "from-teal-950 via-zinc-950 to-zinc-900",
    description: "A trail runner pushes up a narrow ridge line at 3,000m altitude, glacier in background."
  },
  {
    id: 3,
    title: "Tears at the Finish",
    event: "Boston Marathon",
    category: "finish",
    specs: "200mm • f/2.8 • 1/2000s • ISO 400",
    gradient: "from-lime-950 via-zinc-950 to-zinc-900",
    description: "A runner collapses in tears of relief immediately after crossing the finish line tape."
  },
  {
    id: 4,
    title: "Carbon Fiber Flight",
    event: "Berlin Marathon",
    category: "details",
    specs: "105mm Macro • f/3.2 • 1/1000s • ISO 100",
    gradient: "from-neutral-900 via-zinc-950 to-neutral-900",
    description: "Macro focus on elite running shoes striking the asphalt at pace, sponsor logo visible."
  },
  {
    id: 5,
    title: "The Morning Pack",
    event: "London Marathon",
    category: "start",
    specs: "35mm • f/5.6 • 1/500s • ISO 200",
    gradient: "from-cyan-950 via-zinc-950 to-zinc-900",
    description: "Vibrant pack dynamics and colorful outfits flooding Tower Bridge in the early miles."
  },
  {
    id: 6,
    title: "Endurance Battle",
    event: "UTMB Mont Blanc",
    category: "grit",
    specs: "135mm • f/2.0 • 1/1200s • ISO 800",
    gradient: "from-emerald-950 via-zinc-950 to-zinc-900",
    description: "Grit and sweat etched on an athlete's face battling through the final miles of a 100-mile race."
  },
  {
    id: 7,
    title: "Medal Pride",
    event: "New York City Marathon",
    category: "finish",
    specs: "50mm • f/1.8 • 1/800s • ISO 100",
    gradient: "from-lime-950 via-zinc-950 to-zinc-900",
    description: "A runner proudly wears their finisher medal, steam rising off their shoulders in the air."
  },
  {
    id: 8,
    title: "Laced & Loaded",
    event: "Tokyo Marathon",
    category: "details",
    specs: "85mm • f/1.4 • 1/1600s • ISO 100",
    gradient: "from-zinc-900 via-stone-950 to-zinc-950",
    description: "Close-up of runner's custom bib number and pins before heading to the start corral."
  }
];

const TESTIMONIALS = [
  {
    quote: "Shahine delivers when the stakes are highest. Race day has zero second chances, and his photos capture both elite action and crowd energy while highlighting our primary sponsors perfectly.",
    author: "Marc Dupont",
    role: "Race Director, Alpine Trail Series"
  },
  {
    quote: "His turnaround speed is incredible. We had a curated selection of 50 high-resolution hero images in our inbox within 6 hours of the finish line, allowing us to hit major press outlets instantly.",
    author: "Elena Rostova",
    role: "PR Director, Zenith Athletics Brand"
  }
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Gallery Filtering State
  const [activeTab, setActiveTab] = useState<"all" | "start" | "grit" | "finish" | "details">("all");
  
  // Lightbox Modal State
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Tabs indication refs
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const activeIndicatorRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventDetails: "",
    date: "",
    runners: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Filtered gallery items
  const filteredGallery = activeTab === "all" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  // Handle Form Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormData({
        name: "",
        email: "",
        eventDetails: "",
        date: "",
        runners: "",
        message: ""
      });
    }, 1500);
  };

  // GSAP Animations
  useGSAP(() => {
    // 1. Initial Page Load Entrance
    gsap.from(".nav-anim", {
      y: -60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    });

    // 2. ScrollTrigger reveals for Specialty Section
    gsap.from(".spec-title-anim", {
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(".spec-card-anim", {
      scrollTrigger: {
        trigger: "#about",
        start: "top 70%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });

    // 3. ScrollTrigger reveals for Gallery Section
    gsap.from(".gallery-title-anim", {
      scrollTrigger: {
        trigger: "#gallery",
        start: "top 80%"
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out"
    });

    // 4. Testimonials ScrollTrigger
    gsap.from(".testimonial-card-anim", {
      scrollTrigger: {
        trigger: "#testimonials",
        start: "top 80%"
      },
      opacity: 0,
      scale: 0.95,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });

    // 5. Booking Form ScrollTrigger
    gsap.from(".form-card-anim", {
      scrollTrigger: {
        trigger: "#book",
        start: "top 80%"
      },
      opacity: 0,
      y: 45,
      duration: 1,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  // Slide changing animation
  useGSAP(() => {
    // Reset positions and animate the active slide text content
    gsap.fromTo(
      ".slide-active .hero-content-anim",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, { dependencies: [currentSlide], scope: containerRef });

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

  // Gallery grid change animation (when activeTab changes)
  useGSAP(() => {
    gsap.fromTo(
      ".gallery-item-anim",
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

  // Carousel timer progress bar animation
  useGSAP(() => {
    gsap.fromTo(
      ".carousel-progress-bar",
      { width: "0%" },
      { width: "100%", duration: 6, ease: "linear" }
    );
  }, { dependencies: [currentSlide], scope: containerRef });

  // Magnetic Button Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(button, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const button = e.currentTarget;
    gsap.to(button, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
  };

  return (
    <div ref={containerRef} className="bg-background text-foreground flex-1 flex flex-col font-sans">
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20">

        {/* Hero Section */}
        <section className="relative h-[85vh] min-h-[580px] bg-zinc-950 flex items-center overflow-hidden border-b border-border">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-all duration-1000 flex items-center px-6 md:px-16 ${
                idx === currentSlide ? "opacity-100 z-10 slide-active scale-100" : "opacity-0 z-0 scale-95"
              }`}
            >
              <div className="max-w-4xl mx-auto w-full flex flex-col items-start gap-4">
                <span className="text-[10px] md:text-xs uppercase tracking-widest bg-accent/20 border border-accent/40 text-accent px-3.5 py-1 rounded-full font-bold hero-content-anim opacity-0">
                  {slide.tag}
                </span>
                <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight uppercase max-w-3xl leading-none font-display hero-content-anim opacity-0">
                  {slide.title}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl font-medium hero-content-anim opacity-0">
                  {slide.subtitle}
                </p>
                <div className="flex items-center gap-3 text-xs md:text-sm text-accent/80 font-mono hero-content-anim opacity-0 mt-2">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                  <span>{slide.stat}</span>
                </div>
                <div className="mt-8 flex flex-wrap gap-4 hero-content-anim opacity-0">
                  <a
                    href="#book"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="flex items-center gap-2.5 px-7 py-4 bg-accent text-accent-foreground font-bold uppercase tracking-wide rounded-md transition-all hover:bg-accent/90 shadow-lg shadow-accent/20 cursor-pointer text-xs"
                  >
                    Inquire Event Coverage <ArrowRight className="h-4.5 w-4.5" />
                  </a>
                  <a
                    href="#gallery"
                    className="px-7 py-4 border border-border hover:bg-muted text-foreground font-bold uppercase tracking-wide rounded-md transition-colors text-xs"
                  >
                    View Narrative
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-10 bg-accent" : "w-3 bg-zinc-700 hover:bg-zinc-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Carousel Timer Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-accent/80 carousel-progress-bar z-20 pointer-events-none" style={{ width: "0%" }} />
        </section>

        {/* Specialty & Stats Section */}
        <section id="about" className="py-28 px-6 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Context */}
            <div className="lg:col-span-5 flex flex-col gap-6 spec-title-anim">
              <span className="text-accent text-xs font-bold uppercase tracking-widest">
                Specialization
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase leading-tight font-display">
                Built for High-Pressure Endurance Events
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Race organizers and brands cannot afford missed moments. In sports photography, there are no retakes. Our entire workflow—from technical planning to dynamic on-course capture—is engineered to deliver high-impact narrative assets and instant media delivery.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                {STATS.map((stat, idx) => (
                  <div key={idx} className="border border-border p-5 rounded-lg bg-muted/20 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent/40 group-hover:bg-accent transition-colors" />
                    <div className="text-3xl md:text-4xl font-extrabold text-accent tracking-tight font-display">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Cards */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {SPECIALTIES.map((spec, idx) => (
                <div 
                  key={idx} 
                  className="border border-border p-7 rounded-lg bg-muted/15 hover:bg-muted/30 transition-colors flex gap-6 items-start spec-card-anim"
                >
                  <div className="p-3.5 bg-muted rounded-md border border-border shrink-0">
                    {spec.icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold uppercase tracking-tight font-display">{spec.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{spec.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Narrative Event Galleries */}
        <section id="gallery" className="py-28 px-6 border-y border-border bg-muted/5">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 gallery-title-anim">
              <div className="flex flex-col gap-3">
                <span className="text-accent text-xs font-bold uppercase tracking-widest">
                  The Race Narrative
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase font-display">
                  Curated Work Portfolio
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
                  Events are story arcs. Filter by the key stages of an endurance event to see how we document the complete race narrative.
                </p>
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

            {/* Gallery Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative h-80 rounded-lg overflow-hidden border border-border bg-zinc-950 flex flex-col justify-end p-6 cursor-pointer hover:border-accent hover:shadow-[0_0_30px_rgba(204,255,0,0.15)] transition-all hover:-translate-y-1 gallery-item-anim"
                >
                  <div className={`absolute inset-0 bg-gradient-to-tr ${item.gradient} opacity-25 group-hover:opacity-45 transition-opacity duration-500`} />
                  
                  {/* Overlay technical card details */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 z-10">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-accent bg-accent/15 px-2.5 py-1 rounded border border-accent/20 self-start font-bold">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-white/95 font-mono mt-auto">
                      <Camera className="h-4 w-4 text-accent" />
                      <span>{item.specs}</span>
                    </div>
                  </div>

                  {/* Base content card */}
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <span className="text-xs text-accent font-semibold tracking-wider uppercase">
                      {item.event}
                    </span>
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

        {/* Trust & Testimonials */}
        <section id="testimonials" className="py-28 px-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-14">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <span className="text-accent text-xs font-bold uppercase tracking-widest">
                Trust & Delivery
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase font-display">
                What Directors Say
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((test, idx) => (
                <div 
                  key={idx} 
                  className="border border-border p-8 rounded-lg bg-muted/15 relative flex flex-col justify-between testimonial-card-anim"
                >
                  <MessageSquare className="absolute top-6 right-6 h-10 w-10 text-accent/5" />
                  <p className="text-muted-foreground italic leading-relaxed text-sm md:text-base mb-8 relative z-10">
                    "{test.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-full bg-accent/15 border border-accent/35 flex items-center justify-center font-bold text-accent uppercase font-display text-sm shrink-0">
                      {test.author[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm uppercase tracking-wider text-foreground font-display">{test.author}</div>
                      <div className="text-xs text-muted-foreground font-bold mt-0.5">{test.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Event Booking Form */}
        <section id="book" className="py-28 px-6 border-t border-border bg-muted/5">
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-10">
            
            <div className="text-center flex flex-col gap-3">
              <span className="text-accent text-xs font-bold uppercase tracking-widest">
                Inquire Coverage
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase font-display">
                Secure Your Event Date
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                Endurance race schedules fill up fast. Fill out the details below, and I will get back to you with custom packaging rates.
              </p>
            </div>

            <div className="border border-border rounded-xl bg-background p-8 md:p-10 shadow-2xl shadow-black/40 form-card-anim">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
                  <div className="h-16 w-16 bg-accent/15 border border-accent/40 text-accent rounded-full flex items-center justify-center">
                    <Check className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide font-display">Inquiry Received Successfully</h3>
                  <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                    Thank you for your request. I am reviewing your event schedule and will respond with coverage options within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-6 px-5 py-2.5 border border-border hover:bg-muted text-xs font-bold uppercase tracking-wide rounded transition-colors cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-muted/40 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3.5 text-sm text-foreground outline-none transition-all"
                        placeholder="e.g. Jean Dupont"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-muted/40 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3.5 text-sm text-foreground outline-none transition-all"
                        placeholder="e.g. jean@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="eventDetails" className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Event Name / Location
                      </label>
                      <input
                        type="text"
                        id="eventDetails"
                        name="eventDetails"
                        required
                        value={formData.eventDetails}
                        onChange={handleInputChange}
                        className="w-full bg-muted/40 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3.5 text-sm text-foreground outline-none transition-all"
                        placeholder="e.g. Paris Half-Marathon"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="date" className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Event Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-muted/40 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3.5 text-sm text-foreground outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="runners" className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Expected Number of Runners
                    </label>
                    <select
                      id="runners"
                      name="runners"
                      required
                      value={formData.runners}
                      onChange={handleInputChange}
                      className="w-full bg-muted/40 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3.5 text-sm text-foreground outline-none transition-all text-muted-foreground"
                    >
                      <option value="" disabled>Select expected registration size</option>
                      <option value="under-500">Under 500 athletes</option>
                      <option value="500-2000">500 - 2,000 athletes</option>
                      <option value="2000-10000">2,000 - 10,000 athletes</option>
                      <option value="over-10000">10,000+ athletes</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Message / Custom Branding Needs
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-muted/40 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3.5 text-sm text-foreground outline-none transition-all resize-none"
                      placeholder="Detail specific coverage points (e.g. start, finish line, elite pack, commercial sponsor banners)..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="w-full py-4 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-accent-foreground font-bold uppercase tracking-wide rounded-md transition-all shadow-lg shadow-accent/20 cursor-pointer text-xs text-center"
                  >
                    {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry Request"}
                  </button>
                </form>
              )}
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
              
              <div className="absolute bottom-4 left-6 z-10 bg-black/60 px-3.5 py-1.5 rounded border border-white/10 text-xs font-mono text-white/95">
                {selectedImage.event}
              </div>
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
