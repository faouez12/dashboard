"use client";

import React from "react";
import Link from "next/link";
import { Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-14 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Branding Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Camera className="h-5 w-5 text-accent group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm font-bold tracking-tight uppercase font-display text-foreground group-hover:text-accent transition-colors">
            Shahine<span className="text-accent">.</span>Sports © 2026
          </span>
        </Link>
        
        {/* Footnote Metadata */}
        <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-4">
          <span>Speed: 1/2000s</span>
          <span>•</span>
          <span>Resolution: 50.1MP</span>
          <span>•</span>
          <span>Cobalt-Obsidian Active</span>
        </div>
      </div>
    </footer>
  );
}
