"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Calendar, Clock, BookOpen, ArrowRight, Camera, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import AuroraBackground from "@/components/AuroraBackground";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: "race-report" | "gear" | "behind-the-lens";
  categoryLabel: string;
  gradient: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "chasing-the-global-shutter-sony-a9-iii",
    title: "Chasing the Global Shutter: Sony A9 III Race Review",
    excerpt: "Why the global shutter change is a game-changer for track and trail sports. Analyzing stride freeze, zero rolling distortion, and real-world sync speed.",
    date: "May 12, 2026",
    readTime: "6 min read",
    category: "gear",
    categoryLabel: "Gear Review",
    gradient: "from-teal-900 via-cyan-950 to-zinc-900",
  },
  {
    slug: "capturing-utmb-climbing-10000m-with-lenses",
    title: "Capturing UTMB: Climbing 10,000m with 15kg of Lenses",
    excerpt: "Behind the scenes of mountain ultra-marathon photography. Managing battery freeze, night tracking on ridges, and lightweight carbon operations.",
    date: "April 28, 2026",
    readTime: "12 min read",
    category: "race-report",
    categoryLabel: "Race Report",
    gradient: "from-teal-900/40 via-cyan-950 to-slate-900"
  },
  {
    slug: "sponsor-alignment-in-sports-photography",
    title: "Biomechanical Framing: Aligning Runners & Brand Logos",
    excerpt: "How to compose shots that frame runner emotion without losing primary shoe, bib, and banner placements for athletics brand campaigns.",
    date: "March 15, 2026",
    readTime: "8 min read",
    category: "behind-the-lens",
    categoryLabel: "Behind the Lens",
    gradient: "from-rose-900/40 via-teal-950 to-slate-900"
  },
  {
    slug: "chicago-marathon-speed-framing",
    title: "Framing the Pack: Speed Capture at Chicago Marathon",
    excerpt: "A tactical breakdown of road race pack compositions. Setting shutter limits for crowded streets and organizing live cloud uploads under high congestion.",
    date: "February 22, 2026",
    readTime: "5 min read",
    category: "race-report",
    categoryLabel: "Race Report",
    gradient: "from-sky-900/40 via-teal-950 to-slate-900"
  }
];

export default function BlogIndexPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"all" | "race-report" | "gear" | "behind-the-lens">("all");

  const filteredPosts = activeTab === "all"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === activeTab);

  useGSAP(() => {
    // Header entry animation
    gsap.from(".blog-header-anim", {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: "power4.out"
    });
  }, { scope: containerRef });

  useGSAP(() => {
    // Post cards entrance animation
    gsap.fromTo(
      ".blog-card-anim",
      { opacity: 0, scale: 0.96, y: 25 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { dependencies: [activeTab], scope: containerRef });

  return (
    <div ref={containerRef} className="bg-background text-foreground flex-1 flex flex-col font-sans">
      
      <main className="flex-1 flex flex-col pt-20">
        
        {/* Hero Section */}
        <section className="relative py-28 px-6 border-b border-border overflow-hidden">
          <AuroraBackground className="py-12">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6 relative z-10 blog-header-anim">
              <span className="text-accent text-xs font-bold uppercase tracking-widest font-mono border border-accent/20 bg-accent/5 px-4 py-1.5 rounded-full">
                ENDURANCE JOURNAL
              </span>
              <h1 className="text-4xl md:text-7xl font-black uppercase font-display leading-[0.9] tracking-tighter">
                RACE & GEAR LOGS
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Technical photography tutorials, behind-the-scenes event logs, and analysis of modern athletic design.
              </p>

              {/* Tabs */}
              <div className="flex flex-wrap justify-center gap-2 mt-8 bg-muted/40 p-1.5 rounded-xl border border-border">
                {([
                  { key: "all", label: "All Articles" },
                  { key: "race-report", label: "Race Reports" },
                  { key: "gear", label: "Gear Reviews" },
                  { key: "behind-the-lens", label: "Behind the Lens" }
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === tab.key
                        ? "bg-accent text-accent-foreground shadow-lg shadow-accent/15"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </AuroraBackground>
        </section>

        {/* Articles Grid */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                className="group border border-border rounded-[2.5rem] bg-muted/10 hover:bg-muted/20 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between p-8 md:p-10 h-[380px] blog-card-anim relative overflow-hidden"
              >
                {/* Accent Background mesh */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${post.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500 z-0`} />
                
                {/* Meta details */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-accent">
                  <span className="bg-accent/10 border border-accent/20 px-3 py-1 rounded-md">
                    {post.categoryLabel}
                  </span>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Title & Excerpt */}
                <div className="relative z-10 flex flex-col gap-3 mt-6">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white group-hover:text-accent transition-colors font-display line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Read Button */}
                <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest mt-6 border-t border-border/40 pt-5 group-hover:text-white transition-colors">
                  <BookOpen className="h-4.5 w-4.5" />
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
