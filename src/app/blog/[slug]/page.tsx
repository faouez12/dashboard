"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, BookOpen, Camera, Sparkles, User, MapPin } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { fetchBlogPosts } from "@/app/admin/actions";
import CustomPageRenderer from "@/components/CustomPageRenderer";

interface ArticleDetail {
  slug: string;
  title: string;
  categoryLabel: string;
  date: string;
  readTime: string;
  author: string;
  gradient: string;
  leadParagraph: string;
  bodyContent: {
    heading?: string;
    paragraphs: string[];
    pullQuote?: string;
  }[];
  technicalNotes: {
    camera: string;
    lens: string;
    exposure: string;
    settingReason: string;
  };
  puck_data?: any;
}

const ARTICLES_DETAILS: Record<string, ArticleDetail> = {
  "chasing-the-global-shutter-sony-a9-iii": {
    slug: "chasing-the-global-shutter-sony-a9-iii",
    title: "Chasing the Global Shutter: Sony A9 III Race Review",
    categoryLabel: "Gear Review",
    date: "May 12, 2026",
    readTime: "6 min read",
    author: "Shahine",
    gradient: "from-blue-900 via-teal-950 to-zinc-900",
    leadParagraph: "The transition from traditional rolling shutters to a global shutter is the most significant technological leap in sports photography in a generation. In race conditions, where runners are moving at high velocities and camera pans are rapid, the global shutter completely changes the game.",
    bodyContent: [
      {
        heading: "Eliminating the Rolling Shutter Jello Effect",
        paragraphs: [
          "With traditional focal plane rolling shutters, the sensor reads data line-by-line. This speed differential results in bending or warping when fast-moving objects cross the frame. In marathon sports, rolling shutters can cause runner strides to appear distorted, and background sponsor banners to slant during rapid camera pans.",
          "The Sony A9 III's global shutter reads all 24.6 megapixels simultaneously. When shooting a leading pack sprinting past a crowded bridge at 1/2000s, every leg angle, shoelace, and background sponsor banner is captured without warping. Every line is straight, and the biomechanics are preserved with anatomical precision."
        ],
        pullQuote: "In elite race photography, precision is not a choice. A warped stride makes an action shot useless for medical analysis or brand publications."
      },
      {
        heading: "120 Frames-Per-Second Speed & Pre-Capture",
        paragraphs: [
          "Another breakthrough of the global shutter sensor is the raw data throughput. The ability to lock focus and track exposure while blasting 120 RAW files per second ensures that you never miss the exact millisecond of shoe strike or finish-tape impact.",
          "By utilizing the camera's Pre-Capture buffer, we can half-press the shutter button, and the camera starts recording frames. The moment the runner breaks the ribbon, we press the shutter fully, and the preceding 1 second is already saved, guaranteeing zero-failure delivery on the critical finish line moment."
        ]
      }
    ],
    technicalNotes: {
      camera: "Sony Alpha 9 III",
      lens: "Sony FE 70-200mm f/2.8 GM II",
      exposure: "1/2000s • f/2.8 • ISO 160",
      settingReason: "Global shutter allows shutter speed sync up to 1/80,000s. We selected 1/2000s to freeze runner strides while maintaining low ISO grain."
    }
  },
  "capturing-utmb-climbing-10000m-with-lenses": {
    slug: "capturing-utmb-climbing-10000m-with-lenses",
    title: "Capturing UTMB: Climbing 10,000m with 15kg of Lenses",
    categoryLabel: "Race Report",
    date: "April 28, 2026",
    readTime: "12 min read",
    author: "Shahine",
    gradient: "from-teal-900 via-cyan-950 to-zinc-900",
    leadParagraph: "Covering the Ultra-Trail du Mont-Blanc (UTMB) requires as much physical conditioning as it does technical camera capability. Hicking steep mountain passes in Chamonix to capture the world's most elite ultra runners is a test of weight management and weather endurance.",
    bodyContent: [
      {
        heading: "Lightweight Rig Configurations",
        paragraphs: [
          "When you are hiking up to Col du Bonhomme at 2,300 meters, every ounce in your backpack counts. We designed custom carbon-fiber harnesses to carry two bodies safely on the chest while packing lightweight carbon tripods and secondary battery packs.",
          "Our lenses are carefully selected for maximum focal range flexibility. The Sony 400mm f/2.8 prime is used for compressing trail ridges from distance, while the 24-70mm f/2.8 GM II stays on the body for wide-angle environmental portraits as athletes scale rocky passages."
        ],
        pullQuote: "Mountain photography is a balancing act between pack weight and the creative choices made possible by long telephoto lenses."
      },
      {
        heading: "Handling the Alpine Cold",
        paragraphs: [
          "As night temperatures drop below freezing, camera batteries lose charge efficiency. We store backup Lithium-ion packs in insulated internal thermal sleeves against our bodies to keep them warm.",
          "Lens condensation is another major threat. Transitioning from cold mountain summits to humid valley bases requires double-sealed weather protection to prevent optical fogging."
        ]
      }
    ],
    technicalNotes: {
      camera: "Sony Alpha 1",
      lens: "Sony FE 400mm f/2.8 GM OSS",
      exposure: "1/1600s • f/2.8 • ISO 200",
      settingReason: "Telephoto compression allows framing the runner directly against the massive alpine peaks from a distance of over 300 meters."
    }
  }
};

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const posts = await fetchBlogPosts();
        const found = posts.find((p: any) => p.slug === slug);
        if (found) {
          setArticle(found);
        } else {
          setArticle(ARTICLES_DETAILS[slug] || ARTICLES_DETAILS["chasing-the-global-shutter-sony-a9-iii"]);
        }
      } catch (err) {
        console.error(err);
        setArticle(ARTICLES_DETAILS[slug] || ARTICLES_DETAILS["chasing-the-global-shutter-sony-a9-iii"]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // Monitor scroll progress for the progress indicator bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    if (article) {
      // Header animation
      gsap.from(".article-header-anim", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out"
      });
    }
  }, { dependencies: [article], scope: containerRef });

  if (loading || !article) {
    return (
      <div className="bg-background text-foreground flex-1 flex flex-col font-sans min-h-screen items-center justify-center">
        <span className="text-xs uppercase tracking-widest text-[#ccff00] animate-pulse">Retrieving Publication...</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-background text-foreground flex-1 flex flex-col font-sans">
      
      {/* Dynamic Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-accent z-50 transition-all duration-75 pointer-events-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <main className="flex-1 flex flex-col pt-20">
        
        {/* Cinematic Header */}
        <section className="relative py-28 px-6 border-b border-border overflow-hidden bg-gradient-to-b from-muted/30 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-60" />
          
          <div className="max-w-4xl mx-auto flex flex-col items-start gap-6 relative z-10 article-header-anim">
            <Link 
              href="/blog" 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors group mb-2"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Journal</span>
            </Link>

            <span className="text-[10px] md:text-xs uppercase tracking-widest bg-accent/20 border border-accent/40 text-accent px-3.5 py-1 rounded-full font-bold">
              {article.categoryLabel}
            </span>
            
            <h1 className="text-4xl md:text-6xl font-black uppercase font-display leading-[1.05] tracking-tight text-white">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-y border-border/40 py-3 w-full">
              <div className="flex items-center gap-1.5 text-white">
                <User className="h-3.5 w-3.5 text-accent" /> {article.author}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {article.date}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {article.readTime}
              </div>
            </div>
          </div>
        </section>

        {/* Article Body Content */}
        {article.puck_data && (article.puck_data.content?.length > 0 || article.puck_data.root?.props?.title) ? (
          <section className="py-20 px-6 max-w-7xl mx-auto w-full">
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm md:text-base font-medium prose-p:text-slate-300 prose-headings:text-white prose-strong:text-white prose-a:text-[#ccff00]">
              <CustomPageRenderer data={article.puck_data} />
            </div>
            
            {/* Back CTA */}
            <div className="border-t border-border/40 pt-10 mt-10 flex justify-between items-center max-w-4xl mx-auto">
              <Link 
                href="/blog"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Journal Index
              </Link>
              <Link
                href="/#book"
                className="px-6 py-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded hover:scale-102 transition-transform shadow-lg shadow-accent/15"
              >
                Inquire Coverage Rates
              </Link>
            </div>
          </section>
        ) : (
          <section className="py-20 px-6 max-w-4xl mx-auto w-full">
            <div className="flex flex-col gap-12 text-muted-foreground leading-relaxed text-sm md:text-base font-medium">
              
              {/* Lead Paragraph */}
              {article.leadParagraph && (
                <p className="text-lg text-white font-semibold leading-relaxed border-l-2 border-accent pl-6 italic">
                  {article.leadParagraph}
                </p>
              )}

              {/* Structured Content blocks */}
              {article.bodyContent && article.bodyContent.map((section: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-6">
                  {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-bold uppercase font-display text-white tracking-tight mt-6">
                      {section.heading}
                    </h2>
                  )}

                  {section.paragraphs && section.paragraphs.map((para: string, pIdx: number) => (
                    <p key={pIdx} className="leading-relaxed">
                      {para}
                    </p>
                  ))}

                  {section.pullQuote && (
                    <div className="border border-accent/20 bg-accent/5 p-8 rounded-2xl my-4 text-white italic text-center font-semibold text-lg md:text-xl max-w-2xl mx-auto relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
                      "{section.pullQuote}"
                    </div>
                  )}
                </div>
              ))}

              {/* Technical notes callout */}
              {article.technicalNotes && (
                <div className="border border-border p-8 rounded-[2rem] bg-muted/15 flex flex-col gap-6 mt-10">
                  <h3 className="text-base font-bold uppercase text-white font-display tracking-wider flex items-center gap-2 border-b border-border pb-3">
                    <Camera className="h-5 w-5 text-accent" /> Technical Capture Notes
                  </h3>
                  
                  <div className="grid sm:grid-cols-3 gap-6 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Equipment</span>
                      <div className="text-white font-bold mt-1">{article.technicalNotes.camera}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{article.technicalNotes.lens}</div>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Exposure Specs</span>
                      <div className="text-accent font-bold mt-1 font-mono">{article.technicalNotes.exposure}</div>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Field Rationale</span>
                      <p className="text-muted-foreground mt-1 leading-relaxed text-[11px]">{article.technicalNotes.settingReason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Back CTA */}
              <div className="border-t border-border/40 pt-10 mt-10 flex justify-between items-center">
                <Link 
                  href="/blog"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Journal Index
                </Link>
                <Link
                  href="/#book"
                  className="px-6 py-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded hover:scale-102 transition-transform shadow-lg shadow-accent/15"
                >
                  Inquire Coverage Rates
                </Link>
              </div>

            </div>
          </section>
        )}

      </main>

    </div>
  );
}
