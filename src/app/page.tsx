"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Flame, 
  Sliders, 
  TrendingUp, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
  Check
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AuroraBackground from "@/components/AuroraBackground";
import { EvervaultCard } from "@/components/ui/EvervaultCard";
import { fetchHeroSettings, fetchEvents, fetchHomepagePuckData, fetchCapabilitiesSettings } from "@/app/admin/actions";
import { Render } from "@measured/puck";
import { config as puckConfig } from "@/app/admin/dashboard/components/puck-config";

// Register ScrollTrigger client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Specialties with numeric icons
const SPECIALTIES = [
  {
    num: "01",
    icon: <Flame className="h-6 w-6 text-accent" />,
    title: "Marathons & Road Races",
    desc: "Start lines, pack dynamics, elite pacing, and high-emotion finish arches. Engineered for race organizers needing quick media turnarounds."
  },
  {
    num: "02",
    icon: <Sliders className="h-6 w-6 text-accent" />,
    title: "Trail & Ultra Running",
    desc: "Backcountry endurance events, steep vertical accents, and remote aid stations. Physically capable of covering remote trail points."
  },
  {
    num: "03",
    icon: <TrendingUp className="h-6 w-6 text-accent" />,
    title: "Athletic Brand Campaigns",
    desc: "Commercial-grade shots focused on footwear, apparel, and sponsor placements. Highlighting brand logos in live, unscripted race contexts."
  }
];

// Stats
const STATS = [
  { value: "120+", label: "Races Covered" },
  { value: "80,000+", label: "Runners Captured" },
  { value: "15+", label: "International Brands" },
  { value: "12h", label: "Media Delivery Time" }
];

const CAPABILITY_ICONS = [
  <Flame className="h-6 w-6 text-accent" key="flame" />,
  <Sliders className="h-6 w-6 text-accent" key="sliders" />,
  <TrendingUp className="h-6 w-6 text-accent" key="trending" />,
  <Sparkles className="h-8 w-8 text-accent animate-pulse" key="sparkles" />,
];

// Gallery / Case studies
interface EventItem {
  id: number | string;
  slug: string;
  title: string;
  location: string;
  date: string;
  type: "marathon" | "trail" | "cycling";
  runners: string;
  gradient: string;
  desc: string;
  highlight: string;
  image_url?: string;
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
    gradient: "from-blue-950 via-zinc-950 to-zinc-900",
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
    gradient: "from-teal-950 via-zinc-950 to-zinc-900",
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
    gradient: "from-cyan-950 via-zinc-950 to-zinc-900",
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
    gradient: "from-blue-950 via-zinc-950 to-zinc-900",
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

  // Dynamic Settings and Database State
  const [hero, setHero] = useState<any>(null);
  const [capabilities, setCapabilities] = useState<any>(null);
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);
  const [puckData, setPuckData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const h = await fetchHeroSettings();
        setHero(h);
        const caps = await fetchCapabilitiesSettings();
        setCapabilities(caps);
        const evts = await fetchEvents();
        setDbEvents(evts);
        const pData = await fetchHomepagePuckData();
        setPuckData(pData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // GSAP ScrollTrigger Refresh when page load settles to prevent stale coordinates
  useEffect(() => {
    if (loading) return;
    
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [loading]);

  // Carousel Interval
  useEffect(() => {
    if (!hero || hero.background_type === 'aurora' || !hero.media_urls || hero.media_urls.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentMediaIdx(prev => (prev + 1) % hero.media_urls.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [hero]);

  // Handle Form Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          topic: 'Booking Inquiry',
          type: 'booking',
          eventDetails: formData.eventDetails,
          date: formData.date,
          runners: formData.runners
        })
      });
      if (res.ok) {
        setFormSubmitted(true);
        setFormData({
          name: "",
          email: "",
          eventDetails: "",
          date: "",
          runners: "",
          message: ""
        });
      } else {
        alert('Failed to submit booking inquiry. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3D Perspective Card Tilt handler (desktop only)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // cursor inside card bounding box
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Tilt calculations (-12 to 12 degrees limit)
    const rotateX = -((y - yc) / yc) * 12;
    const rotateY = ((x - xc) / xc) * 12;
    
    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.03,
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 25px rgba(88, 101, 242, 0.25)",
      duration: 0.35,
      ease: "power2.out"
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: "0 0 0px rgba(0,0,0,0), 0 0 0px rgba(0,0,0,0)",
      duration: 0.6,
      ease: "power3.out"
    });
  };

  const hasPuckData = puckData && puckData.content && puckData.content.length > 0;

  // Filter events for the homepage showcase (max 6, fallback to first 6)
  const homepageFeatured = dbEvents.filter((e: any) => e.featured_on_homepage).slice(0, 6);
  const showcaseEvents = homepageFeatured.length > 0 
    ? homepageFeatured 
    : (dbEvents.length > 0 ? dbEvents.slice(0, 6) : EVENTS_DATA);


  // GSAP 2026 Overhaul Animations
  useGSAP(() => {
    if (loading) return;
    
    // 1. Initial Page Load Clip-Path Reveal (Header titles) — always shown now
    gsap.from(".hero-text-reveal", {
      y: "115%",
      duration: 1.4,
      ease: "power4.out",
      stagger: 0.15
    });

    // 2. Horizontal Scroll Pinning (Desktop only)
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      const container = document.querySelector(".horizontal-container") as HTMLElement;
      if (container) {
        gsap.to(".horizontal-container", {
          scrollTrigger: {
            trigger: ".horizontal-sec",
            start: "top top",
            end: () => `+=${container.scrollWidth - container.clientWidth}`,
            scrub: 1.2,
            pin: true,
            pinType: "transform",
            invalidateOnRefresh: true,
          },
          x: () => -(container.scrollWidth - container.clientWidth),
          ease: "none"
        });
      }
    });

    // 3. Word-by-Word Reveals for specialties section title
    gsap.from(".spec-word-reveal", {
      scrollTrigger: {
        trigger: ".spec-title-trigger",
        start: "top 85%",
      },
      y: "100%",
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.08
    });

    // 4. Specialties cards stagger entry
    gsap.from(".spec-card-anim", {
      scrollTrigger: {
        trigger: "#about",
        start: "top 70%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });

    // 5. Word-by-Word reveals for testimonials section title
    gsap.from(".testimonial-word-reveal", {
      scrollTrigger: {
        trigger: ".testimonial-title-trigger",
        start: "top 85%",
      },
      y: "100%",
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.08
    });

    // 6. Testimonials ScrollTrigger stagger
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

    // 7. Booking Form ScrollTrigger entrance
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
  }, { scope: containerRef, dependencies: [loading, hasPuckData] });

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#070708] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-[#ccff00] italic animate-pulse">
        Decrypting_Matrix_Stream...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-background text-foreground flex-1 flex flex-col font-sans">
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20">
        <section className="relative min-h-[90vh] border-b border-border overflow-hidden bg-zinc-950">

          {/* ── BACKGROUND LAYER (z-0) ── */}
          {hasPuckData ? (
            /* Puck builder controls the background — absolute behind text */
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ minHeight: '100%' }}>
              <Render config={puckConfig} data={puckData} />
            </div>
          ) : (
            /* Static background selector */
            <>
              {hero?.background_type === 'video_carousel' && hero.media_urls && hero.media_urls.length > 0 ? (
                <div className="absolute inset-0 z-0 bg-black pointer-events-none">
                  <video
                    key={hero.media_urls[currentMediaIdx]}
                    src={hero.media_urls[currentMediaIdx]}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-35 transition-opacity duration-1000"
                  />
                </div>
              ) : hero?.background_type === 'image_carousel' && hero.media_urls && hero.media_urls.length > 0 ? (
                <div className="absolute inset-0 z-0 bg-black pointer-events-none">
                  {hero.media_urls.map((url: string, idx: number) => (
                    <div
                      key={url}
                      style={{ backgroundImage: `url(${url})` }}
                      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                        idx === currentMediaIdx ? 'opacity-35' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                  <AuroraBackground className="min-h-[90vh]" />
                </div>
              )}
            </>
          )}

          {/* ── HERO TEXT CONTENT (z-10 — always above background) ── */}
          <div className="relative z-10 min-h-[90vh] flex flex-col justify-center px-6 md:px-16">
            <div className="max-w-7xl mx-auto w-full flex flex-col justify-between py-12">
              
              <div className="flex flex-col gap-6 max-w-4xl">
                <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono border border-accent/20 bg-accent/5 px-4 py-1.5 rounded-full self-start">
                  {hero?.badge || "SPORTS PHOTOGRAPHY REDEFINED"}
                </span>
                
                {/* Masked Clip-Path Typography */}
                <h1 className="text-5xl md:text-8xl font-black uppercase font-display leading-[0.9] tracking-tighter">
                  <div className="overflow-hidden inline-block"><span className="hero-text-reveal block">{hero?.title_line_1 || "CAPTURE"}</span></div><br/>
                  <div className="overflow-hidden inline-block"><span className="hero-text-reveal block text-accent">{hero?.title_line_2 || "THE GRIT"}</span></div><br/>
                  <div className="overflow-hidden inline-block"><span className="hero-text-reveal block">{hero?.title_line_3 || "ON THE COURSE"}</span></div>
                </h1>

                <p className="text-base md:text-xl text-muted-foreground max-w-xl font-medium mt-4 leading-relaxed">
                  {hero?.description || "Translating the raw victory, sweat, and split-second milestones of marathon and trail running events into high-performance visual assets for race organizers and global athletics brands."}
                </p>
              </div>

              {/* Micro Specs and CTAs */}
              <div className="mt-16 flex flex-col md:flex-row md:items-center justify-between gap-8 border-t border-border/30 pt-10">
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#book"
                    className="flex items-center gap-2.5 px-8 py-4 bg-accent text-accent-foreground font-black uppercase tracking-wide rounded-md transition-transform hover:scale-102 shadow-lg shadow-accent/15 text-xs cursor-pointer"
                  >
                    Book Race Coverage <ArrowRight className="h-4 w-4 text-accent-foreground" />
                  </a>
                  <a
                    href="#gallery"
                    className="px-8 py-4 border border-border hover:bg-muted text-foreground font-bold uppercase tracking-wide rounded-md transition-colors text-xs"
                  >
                    Explore Chronicles
                  </a>
                </div>

                {/* Specs Overlay */}
                <div className="flex gap-8 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  <div>
                    <div className="text-accent font-bold">{hero?.spec_1_label || "SHUTTER"}</div>
                    <div className="text-foreground font-extrabold mt-0.5">{hero?.spec_1_value || "1/2000S"}</div>
                  </div>
                  <div className="w-[1px] bg-border/40 h-8 self-center" />
                  <div>
                    <div className="text-accent font-bold">{hero?.spec_2_label || "RESOLUTION"}</div>
                    <div className="text-foreground font-extrabold mt-0.5">{hero?.spec_2_value || "50.1MP"}</div>
                  </div>
                  <div className="w-[1px] bg-border/40 h-8 self-center" />
                  <div>
                    <div className="text-accent font-bold">{hero?.spec_3_label || "PIPELINE"}</div>
                    <div className="text-foreground font-extrabold mt-0.5">{hero?.spec_3_value || "FTPS LIVE"}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* Infinite Typography Marquee Ticker */}
        <div className="w-full overflow-hidden bg-accent py-5 border-y border-border flex whitespace-nowrap text-accent-foreground font-display font-black uppercase text-xl md:text-3xl tracking-widest pointer-events-none z-10 relative">
          <div className="animate-marquee flex gap-16">
            <span>SPEED • RESOLVE • MOTION • VICTORY • GRIT • ACTIVE • PERFORMANCE • </span>
            <span>SPEED • RESOLVE • MOTION • VICTORY • GRIT • ACTIVE • PERFORMANCE • </span>
          </div>
        </div>

        {/* Specialty Asymmetrical Section */}
        <section id="about" className="py-32 px-6 max-w-7xl mx-auto w-full relative spec-title-trigger">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Sticky Left Column Context */}
            <div className="lg:col-span-5 flex flex-col gap-6 spec-title-anim lg:sticky lg:top-32">
              <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono">
                {capabilities?.badge || "CORE CAPABILITY"}
              </span>
              
              {/* Word-by-Word Reveal */}
              <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight uppercase leading-[0.95] font-display flex flex-wrap gap-x-3 gap-y-1">
                {(capabilities?.title || "Engineered for zero-failure delivery.").split(" ").map((word: string, idx: number) => (
                  <div key={idx} className="overflow-hidden inline-block">
                    <span className="spec-word-reveal block">{word}</span>
                  </div>
                ))}
              </h2>
              
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-2">
                {capabilities?.description || "In elite endurance events, missed frames are not an option. Our field setups carry weatherproof enclosures, carbon-fiber rigs, and secondary cellular nodes to guarantee instantaneous PR deliveries."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {(capabilities?.stats && capabilities.stats.length === 4 ? capabilities.stats : STATS).map((stat: any, idx: number) => (
                  <div key={idx} className="border border-border p-5 rounded-xl bg-muted/15 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-accent/40 group-hover:bg-accent transition-colors" />
                    <div className="text-3xl font-extrabold text-accent tracking-tight font-display">{stat.value}</div>
                    <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asymmetrical Staggered Columns on Right (with 3D perspective enabled) */}
            <div 
              className="lg:col-span-7 grid sm:grid-cols-2 gap-8 pt-0 md:pt-16" 
              style={{ perspective: "1000px" }}
            >
              
              {/* Left staggered cards */}
              <div className="flex flex-col gap-8 md:translate-y-0">
                {(capabilities?.items && capabilities.items.length === 4 ? capabilities.items : [
                  { num: "01", title: "Marathons & Road Races", desc: "Start lines, pack dynamics...", bg_image_url: "" },
                  { num: "02", title: "Trail & Ultra Running", desc: "Backcountry endurance...", bg_image_url: "" }
                ]).slice(0, 2).map((spec: any, idx: number) => (
                  <div key={idx} className="spec-card-anim h-[280px]">
                    <EvervaultCard bgImage={spec.bg_image_url}>
                      <div className="flex justify-between items-start w-full">
                        <div className="p-3 bg-muted border border-border rounded-xl text-accent">
                          {CAPABILITY_ICONS[idx]}
                        </div>
                        <span 
                          className="text-4xl font-black font-display text-transparent"
                          style={{ WebkitTextStroke: "1px var(--border)" }}
                        >
                          {spec.num}
                        </span>
                      </div>
                      <div className="mt-auto">
                        <h3 className="text-lg font-bold uppercase tracking-tight font-display text-foreground">{spec.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed mt-2">{spec.desc}</p>
                      </div>
                    </EvervaultCard>
                  </div>
                ))}
              </div>

              {/* Right staggered cards with offset */}
              <div className="flex flex-col gap-8 md:translate-y-16">
                {(capabilities?.items && capabilities.items.length === 4 ? capabilities.items : [
                  { num: "03", title: "Athletic Brand Campaigns", desc: "Commercial-grade shots...", bg_image_url: "" },
                  { num: "04", title: "Looking for Custom Rates?", desc: "Custom media structures...", bg_image_url: "" }
                ]).slice(2, 4).map((spec: any, idx: number) => (
                  <div key={idx} className={`spec-card-anim ${idx === 1 ? 'h-[240px]' : 'h-[280px]'}`}>
                    <EvervaultCard bgImage={spec.bg_image_url}>
                      <div className="flex justify-between items-start w-full">
                        <div className="p-3 bg-muted border border-border rounded-xl text-accent">
                          {CAPABILITY_ICONS[idx + 2]}
                        </div>
                        <span 
                          className="text-4xl font-black font-display text-transparent"
                          style={{ WebkitTextStroke: "1px var(--border)" }}
                        >
                          {spec.num}
                        </span>
                      </div>
                      <div className="mt-auto">
                        <h3 className="text-lg font-bold uppercase tracking-tight font-display text-foreground">{spec.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed mt-2">{spec.desc}</p>
                      </div>
                    </EvervaultCard>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* Sticky Split-Screen Horizontal Event Showcase */}
        <section id="gallery" className="relative horizontal-sec border-t border-border bg-muted/5 min-h-screen">
          <div className="w-full h-screen overflow-hidden flex items-center">
            <div className="max-w-7xl mx-auto w-full px-6 grid md:grid-cols-12 gap-8 items-center">
              
              {/* Sticky Column details (locked left side) */}
              <div className="md:col-span-4 flex flex-col items-start gap-4">
                <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono">
                  THE CHRONICLES
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase font-display leading-[0.95] tracking-tighter">
                  Endurance Case Studies
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                  Scroll down to navigate horizontally through our complete race archives. Look inside for detailed weather notes and camera configurations.
                </p>

                <Link
                  href="/events"
                  className="mt-2 flex items-center gap-2 px-5 py-3 border border-accent/30 hover:border-accent bg-accent/5 hover:bg-accent/10 text-accent font-black uppercase tracking-wider text-[10px] rounded-lg transition-all cursor-pointer"
                >
                  View All Events <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                
                {/* Indicator dots mapping scroll progress */}
                <div className="hidden md:flex gap-1.5 mt-4">
                  <div className="h-1.5 w-8 rounded-full bg-accent" />
                  <div className="h-1.5 w-2 rounded-full bg-zinc-800" />
                  <div className="h-1.5 w-2 rounded-full bg-zinc-800" />
                </div>
              </div>

              {/* Horizontal Scroll sliding panel on Right */}
              <div className="md:col-span-8 overflow-hidden py-10" style={{ perspective: "1000px" }}>
                <div className="horizontal-container flex flex-row gap-6 md:gap-10 pl-0 md:pl-8 pr-0 md:pr-24 overflow-x-auto md:overflow-x-visible w-full scroll-smooth snap-x snap-mandatory md:snap-none pb-6 md:pb-0">
                  {showcaseEvents.map((event) => (
                    <div
                      key={event.id}
                      onMouseMove={handleCardMouseMove}
                      onMouseLeave={handleCardMouseLeave}
                      className="w-[280px] md:w-[380px] h-[400px] shrink-0 border border-border bg-background rounded-[2rem] flex flex-col justify-between overflow-hidden relative transition-all duration-300 snap-start"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Image or Gradient preview */}
                      <div className="h-40 w-full relative overflow-hidden bg-zinc-950 flex items-center justify-center" style={{ transform: "translateZ(10px)" }}>
                        {event.image_url ? (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-tr ${event.gradient} flex items-center justify-center p-6 w-full h-full`}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-300" />
                            <Camera className="h-8 w-8 text-white/10 group-hover:scale-110 transition-transform duration-500 relative z-10" />
                          </div>
                        )}
                        
                        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded border border-white/10 text-[9px] font-mono text-white/95">
                          <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                          <span>{event.highlight}</span>
                        </div>
                      </div>

                      {/* Detail metadata block */}
                      <div className="p-6 flex flex-col justify-between flex-grow gap-4" style={{ transform: "translateZ(20px)" }}>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-accent">
                            <span>{event.type}</span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                            <span className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {event.location}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-accent transition-colors font-display">
                            {event.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/40 pt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-accent transition-colors">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {event.date}
                          </span>
                          <Link 
                            href={`/events/${event.slug}`} 
                            className="flex items-center gap-1 text-accent font-black hover:underline text-[9px] uppercase tracking-widest cursor-pointer"
                          >
                            Explore study <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Bold Quote Testimonials */}
        <section id="testimonials" className="py-32 px-6 max-w-7xl mx-auto w-full border-t border-border testimonial-title-trigger">
          <div className="flex flex-col gap-16">
            <div className="max-w-2xl flex flex-col gap-3">
              <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono">
                CLIENT CONVERSATIONS
              </span>
              
              {/* Word-by-Word Reveal */}
              <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight uppercase font-display leading-[0.95] flex flex-wrap gap-x-3 gap-y-1">
                {"What directors report.".split(" ").map((word, idx) => (
                  <div key={idx} className="overflow-hidden inline-block">
                    <span className="testimonial-word-reveal block">{word}</span>
                  </div>
                ))}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {TESTIMONIALS.map((test, idx) => (
                <div 
                  key={idx} 
                  className="border border-border p-10 rounded-[2rem] bg-muted/10 relative flex flex-col justify-between testimonial-card-anim group hover:border-accent/40 transition-colors"
                >
                  <MessageSquare className="absolute top-8 right-8 h-12 w-12 text-accent/5" />
                  <p className="text-muted-foreground italic leading-relaxed text-sm md:text-lg mb-10 relative z-10">
                    "{test.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center font-bold text-accent uppercase font-display text-sm shrink-0">
                      {test.author[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm uppercase tracking-wider text-white font-display">{test.author}</div>
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">{test.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Minimal Dark Form Section */}
        <section id="book" className="py-32 px-6 border-t border-border bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-12">
            
            <div className="text-center flex flex-col gap-4">
              <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono">
                SECURE ACCESS
              </span>
              <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight uppercase font-display leading-[0.95]">
                Book Live Coverage
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed mt-2">
                Inquire availability and custom rates tailored to your event registry size and brand sponsorship requirements.
              </p>
            </div>

            <div className="border border-border rounded-[2.5rem] bg-background p-8 md:p-12 shadow-2xl shadow-black/60 form-card-anim">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
                  <div className="h-16 w-16 bg-accent/15 border border-accent/40 text-accent rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide font-display">Inquiry Transmitted</h3>
                  <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                    Thank you. I am reviewing the event schedule and will respond with logistics options within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-6 px-6 py-3 border border-border hover:bg-muted text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label htmlFor="name" className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-muted/30 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-4 py-3.5 text-sm text-foreground outline-none transition-all"
                        placeholder="e.g. Marc Dupont"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2.5">
                      <label htmlFor="email" className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-muted/30 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-4 py-3.5 text-sm text-foreground outline-none transition-all"
                        placeholder="e.g. marc@domain.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label htmlFor="eventDetails" className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                        Event Name / Location
                      </label>
                      <input
                        type="text"
                        id="eventDetails"
                        name="eventDetails"
                        required
                        value={formData.eventDetails}
                        onChange={handleInputChange}
                        className="w-full bg-muted/30 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-4 py-3.5 text-sm text-foreground outline-none transition-all"
                        placeholder="e.g. UTMB Chamonix"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2.5">
                      <label htmlFor="date" className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                        Event Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-muted/30 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-4 py-3.5 text-sm text-muted-foreground outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label htmlFor="runners" className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                      Expected Registration size
                    </label>
                    <select
                      id="runners"
                      name="runners"
                      required
                      value={formData.runners}
                      onChange={handleInputChange}
                      className="w-full bg-muted/30 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-4 py-3.5 text-sm text-muted-foreground outline-none transition-all"
                    >
                      <option value="" disabled>Select expected registration size</option>
                      <option value="under-500">Under 500 athletes</option>
                      <option value="500-2000">500 - 2,000 athletes</option>
                      <option value="2000-10000">2,000 - 10,000 athletes</option>
                      <option value="over-10000">10,000+ athletes</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label htmlFor="message" className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                      Special Branding & FTPS Upload Requirements
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-muted/30 border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-4 py-3.5 text-sm text-foreground outline-none transition-all resize-none"
                      placeholder="Specify requirements (e.g. start lines, sponsor banner highlights, real-time media delivery)..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-accent hover:bg-accent/90 disabled:bg-accent/70 text-accent-foreground font-black uppercase tracking-widest rounded-lg transition-transform hover:scale-101 shadow-lg shadow-accent/15 cursor-pointer text-xs text-center"
                  >
                    {isSubmitting ? "Transmitting..." : "Submit Inquiry Request"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

    </div>
  );
}
