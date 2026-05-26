"use client";

import React, { useState, useEffect } from "react";
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

// Mock Data for Hero Slider
const HERO_SLIDES = [
  {
    id: 1,
    title: "THE FINISH LINE VICTORY",
    subtitle: "Endurance sports photography built on raw human emotion.",
    stat: "1/2000s shutter speed catches every tear, drop of sweat, and triumphant shout.",
    tag: "Finish Line",
    gradient: "from-orange-600/30 via-zinc-950 to-zinc-950"
  },
  {
    id: 2,
    title: "MID-RACE RESOLVE",
    subtitle: "Documenting the grit of backcountry trail marathons.",
    stat: "Shot in demanding, high-altitude alpine terrain under extreme light shifts.",
    tag: "Mid-Race Grit",
    gradient: "from-blue-900/30 via-zinc-950 to-zinc-950"
  },
  {
    id: 3,
    title: "THE MORNING SURGE",
    subtitle: "Sponsor visibility matched with athlete energy at the start line.",
    stat: "Wide-angle capture of 30,000+ runners beginning their journey.",
    tag: "The Start Line",
    gradient: "from-purple-900/30 via-zinc-950 to-zinc-950"
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

// Mock Data for curating the event gallery (visual narrative placeholders)
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
    specs: "24mm • f/2.8 • 1/120s • ISO 1600",
    gradient: "from-indigo-950 via-purple-950 to-zinc-900",
    description: "The nervous tension of 2,500 runners illuminated under headlamps at the starting arch."
  },
  {
    id: 2,
    title: "Ridge Runner Grit",
    event: "Zermatt Mountain Marathon",
    category: "grit",
    specs: "70mm • f/4.0 • 1/1600s • ISO 200",
    gradient: "from-blue-950 via-slate-900 to-zinc-900",
    description: "A trail runner pushes up a narrow ridge line at 3,000m altitude, glacier in background."
  },
  {
    id: 3,
    title: "Tears at the Finish",
    event: "Boston Marathon",
    category: "finish",
    specs: "200mm • f/2.8 • 1/2000s • ISO 400",
    gradient: "from-orange-950 via-amber-950 to-zinc-900",
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
    gradient: "from-violet-950 via-sky-950 to-zinc-900",
    description: "Vibrant pack dynamics and colorful outfits flooding Tower Bridge in the early miles."
  },
  {
    id: 6,
    title: "Endurance Battle",
    event: "UTMB Mont Blanc",
    category: "grit",
    specs: "135mm • f/2.0 • 1/1200s • ISO 800",
    gradient: "from-cyan-950 via-zinc-950 to-zinc-900",
    description: "Grit and sweat etched on an athlete's face battling through the final miles of a 100-mile race."
  },
  {
    id: 7,
    title: "Medal Pride",
    event: "New York City Marathon",
    category: "finish",
    specs: "50mm • f/1.8 • 1/800s • ISO 100",
    gradient: "from-rose-950 via-pink-950 to-zinc-900",
    description: "A runner proudly wears their finisher medal, steam rising off their shoulders in the autumn air."
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

// Testimonials
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
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Gallery Filtering State
  const [activeTab, setActiveTab] = useState<"all" | "start" | "grit" | "finish" | "details">("all");
  
  // Lightbox Modal State
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

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
    
    // Simulate API delay
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

  return (
    <div className="bg-background text-foreground flex-1 flex flex-col font-sans">
      
      {/* Header / Nav */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold tracking-tight uppercase">
              Shahine<span className="text-accent">.</span>Sports
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#about" className="hover:text-accent transition-colors">Specialization</a>
            <a href="#gallery" className="hover:text-accent transition-colors">Race Narrative</a>
            <a href="#testimonials" className="hover:text-accent transition-colors">Trust</a>
            <a href="#book" className="px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-md transition-all shadow-lg shadow-accent/20">
              Book Coverage
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20">

        {/* Hero Section */}
        <section className="relative h-[85vh] min-h-[550px] bg-zinc-950 flex items-center overflow-hidden border-b border-border">
          {/* Gradients representing slides */}
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-opacity duration-1000 flex items-center px-6 md:px-16 ${
                idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="max-w-4xl mx-auto w-full flex flex-col items-start gap-4">
                <span className="text-xs uppercase tracking-widest bg-accent/20 border border-accent/40 text-accent px-3 py-1 rounded-full font-bold">
                  {slide.tag}
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase max-w-2xl leading-none">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl font-medium">
                  {slide.subtitle}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs md:text-sm text-accent/80 font-mono">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                  <span>{slide.stat}</span>
                </div>
                <div className="mt-8 flex gap-4">
                  <a
                    href="#book"
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-md transition-all hover:bg-accent/90 shadow-lg shadow-accent/20 hover:translate-x-1"
                  >
                    Inquire Event Coverage <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#gallery"
                    className="px-6 py-3 border border-border hover:bg-muted text-foreground font-semibold rounded-md transition-colors"
                  >
                    View Narrative
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? "w-8 bg-accent" : "w-2 bg-zinc-700"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Specialty & Stats Section */}
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Context */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <span className="text-accent text-xs font-bold uppercase tracking-widest">
                Specialization
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight">
                Built for High-Pressure Endurance Events
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Race organizers and brands cannot afford missed moments. In sports photography, there are no retakes. Our entire workflow—from technical planning to dynamic on-course capture—is engineered to deliver high-impact narrative assets and instant media delivery.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                {STATS.map((stat, idx) => (
                  <div key={idx} className="border border-border p-4 rounded-lg bg-muted/30">
                    <div className="text-3xl font-extrabold text-accent tracking-tight">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Cards */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {SPECIALTIES.map((spec, idx) => (
                <div 
                  key={idx} 
                  className="border border-border p-6 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors flex gap-6 items-start"
                >
                  <div className="p-3 bg-muted rounded-md border border-border">
                    {spec.icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold uppercase tracking-tight">{spec.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{spec.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Narrative Event Galleries */}
        <section id="gallery" className="py-24 px-6 border-y border-border bg-muted/10">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-accent text-xs font-bold uppercase tracking-widest">
                  The Race Narrative
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
                  Curated Work Portfolio
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg">
                  Events are story arcs. Filter by the key stages of an endurance event to see how we document the complete race narrative.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-border pb-1 md:border-none md:pb-0">
                {(["all", "start", "grit", "finish", "details"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-md transition-all ${
                      activeTab === tab
                        ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
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
                  className="group relative h-80 rounded-lg overflow-hidden border border-border bg-zinc-950 flex flex-col justify-end p-6 cursor-pointer hover:border-accent transition-all hover:-translate-y-1"
                >
                  {/* Background CSS placeholder representing the image */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${item.gradient} opacity-40 group-hover:opacity-60 transition-opacity`} />
                  
                  {/* Overlay text describing camera grid details */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 z-10">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-accent bg-accent/15 px-2 py-1 rounded border border-accent/20 self-start">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-white/90 font-mono mt-auto">
                      <Camera className="h-3.5 w-3.5 text-accent" />
                      <span>{item.specs}</span>
                    </div>
                  </div>

                  {/* Base content */}
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <span className="text-xs text-accent font-semibold tracking-wider uppercase">
                      {item.event}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-accent font-bold uppercase tracking-wider mt-2 group-hover:translate-x-1 transition-transform">
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
        <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-12">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <span className="text-accent text-xs font-bold uppercase tracking-widest">
                Trust & Delivery
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
                What Directors Say
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((test, idx) => (
                <div 
                  key={idx} 
                  className="border border-border p-8 rounded-lg bg-muted/20 relative flex flex-col justify-between"
                >
                  <MessageSquare className="absolute top-6 right-6 h-10 w-10 text-accent/10" />
                  <p className="text-muted-foreground italic leading-relaxed text-sm md:text-base mb-6 relative z-10">
                    "{test.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent flex items-center justify-center font-bold text-accent uppercase">
                      {test.author[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm uppercase tracking-wide text-foreground">{test.author}</div>
                      <div className="text-xs text-muted-foreground font-semibold">{test.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Event Booking Form */}
        <section id="book" className="py-24 px-6 border-t border-border bg-muted/10">
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">
            
            <div className="text-center flex flex-col gap-3">
              <span className="text-accent text-xs font-bold uppercase tracking-widest">
                Inquire Coverage
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
                Secure Your Event Date
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Endurance race schedules fill up fast. Fill out the details below, and I will get back to you with custom packaging rates.
              </p>
            </div>

            <div className="border border-border rounded-lg bg-background p-8 shadow-xl">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="h-16 w-16 bg-accent/20 border border-accent text-accent rounded-full flex items-center justify-center">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Inquiry Received Successfully</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Thank you for your request. I am reviewing your event schedule and will respond with coverage options within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-6 px-4 py-2 border border-border hover:bg-muted text-sm font-semibold rounded-md transition-colors"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-muted/50 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3 text-sm text-foreground outline-none transition-all"
                        placeholder="e.g. Jean Dupont"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-muted/50 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3 text-sm text-foreground outline-none transition-all"
                        placeholder="e.g. jean@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="eventDetails" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">
                        Event Name / Location
                      </label>
                      <input
                        type="text"
                        id="eventDetails"
                        name="eventDetails"
                        required
                        value={formData.eventDetails}
                        onChange={handleInputChange}
                        className="w-full bg-muted/50 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3 text-sm text-foreground outline-none transition-all"
                        placeholder="e.g. Paris Half-Marathon"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="date" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">
                        Event Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-muted/50 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3 text-sm text-foreground outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="runners" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">
                      Expected Number of Runners
                    </label>
                    <select
                      id="runners"
                      name="runners"
                      required
                      value={formData.runners}
                      onChange={handleInputChange}
                      className="w-full bg-muted/50 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3 text-sm text-foreground outline-none transition-all"
                    >
                      <option value="" disabled>Select expected registration size</option>
                      <option value="under-500">Under 500 athletes</option>
                      <option value="500-2000">500 - 2,000 athletes</option>
                      <option value="2000-10000">2,000 - 10,000 athletes</option>
                      <option value="over-10000">10,000+ athletes</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs uppercase tracking-wide text-muted-foreground font-bold">
                      Message / Custom Branding Needs
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-muted/50 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded px-4 py-3 text-sm text-foreground outline-none transition-all resize-none"
                      placeholder="Detail specific coverage points (e.g. start, finish line, elite pack, commercial sponsor banners)..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-accent-foreground font-bold uppercase tracking-wide rounded-md transition-all shadow-lg shadow-accent/20 cursor-pointer text-center"
                  >
                    {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry Request"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5 text-accent" />
            <span className="text-sm font-bold tracking-tight uppercase">
              Shahine<span className="text-accent">.</span>Sports © 2026
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            Structured via Garry Tan's GStack Methodology.
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-4xl w-full bg-zinc-950 border border-border rounded-xl overflow-hidden flex flex-col">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-accent transition-colors border border-white/10"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Simulated Image Box */}
            <div className={`h-[50vh] min-h-[300px] w-full bg-gradient-to-tr ${selectedImage.gradient} flex items-center justify-center relative p-8`}>
              <div className="absolute inset-0 bg-black/30" />
              <Camera className="h-16 w-16 text-white/10 relative z-10" />
              
              <div className="absolute bottom-4 left-6 z-10 bg-black/60 px-3 py-1.5 rounded border border-white/10 text-xs font-mono text-white/90">
                {selectedImage.event}
              </div>
            </div>

            {/* Modal Body Context */}
            <div className="p-6 md:p-8 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <span className="text-xs text-accent uppercase tracking-widest font-bold">
                    Narrative Narrative: {selectedImage.category}
                  </span>
                  <h3 className="text-2xl font-bold uppercase tracking-tight mt-1">
                    {selectedImage.title}
                  </h3>
                </div>
                
                {/* Tech Specs */}
                <div className="flex items-center gap-2 bg-muted border border-border px-3 py-2 rounded-md font-mono text-xs text-muted-foreground">
                  <Camera className="h-4 w-4 text-accent" />
                  <span>{selectedImage.specs}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Shot Description</h4>
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
