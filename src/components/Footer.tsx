"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-20 pb-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Top Section: Branding & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group self-start">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-6 w-6 object-contain group-hover:rotate-12 transition-transform duration-300" 
              />
              <span className="text-md font-bold tracking-tight uppercase font-display text-foreground group-hover:text-accent transition-colors">
                Shahine<span className="text-accent"> Photography</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Documenting athletic speed, grit, and endurance milestones globally. Specializing in high-speed race coverage, alpine trail journals, and brand campaigns.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  ), 
                  href: "https://www.instagram.com/shahine_photography?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
                  target: "_blank",
                  rel: "noopener noreferrer"
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                  ), 
                  href: "#" 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                      <path d="m10 15 5-3-5-3v6z"/>
                    </svg>
                  ), 
                  href: "#" 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  ), 
                  href: "#" 
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target={social.target}
                  rel={social.rel}
                  className="w-8 h-8 rounded-lg bg-muted border border-border hover:border-accent hover:text-accent flex items-center justify-center text-muted-foreground transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 gap-8">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest font-mono border-b border-border pb-1.5">
                Chronicles
              </span>
              <div className="flex flex-col gap-2.5 text-xs font-bold uppercase tracking-wider">
                <Link href="/events" className="hover:text-accent transition-colors">
                  Race Chronicles
                </Link>
                <Link href="/gallery" className="hover:text-accent transition-colors">
                  Selected Gallery
                </Link>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest font-mono border-b border-border pb-1.5">
                Technicals
              </span>
              <div className="flex flex-col gap-2.5 text-xs font-bold uppercase tracking-wider">
                <Link href="/about" className="hover:text-accent transition-colors">
                  About & Gear
                </Link>
                <Link href="/blog" className="hover:text-accent transition-colors">
                  Technical Journal
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section: Copyright & Creator */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground font-mono">
          <span>
            © 2026 Shahine Photography. All rights reserved.
          </span>
          <div className="flex items-center gap-1.5">
            <span>Design & Code by</span>
            <a
              href="https://elhenifaouez.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-cyan-400 via-pink-500 via-yellow-400 via-green-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-multicolor-text font-black tracking-wider uppercase flex items-center gap-1 hover:opacity-85 transition-opacity"
            >
              El Heni Faouez
              <ExternalLink size={10} className="text-pink-500 inline shrink-0" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
