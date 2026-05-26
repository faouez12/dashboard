# design_doc.md — Premium Marathon Photography Portfolio

## 1. Product Positioning & Value Prop
* **Core Problem**: Marathon and endurance-event photographers capture high-emotion, fast-paced moments, but standard social media feeds (Instagram/Facebook) fail to establish professional credibility, present event-based structure, or capture high-value corporate inquiries from race organizers and brands.
* **Value Proposition**: A high-performance, premium digital portfolio that translates the raw energy of race-day achievement into a structured, high-trust sales tool for event organizers, sponsors, and athletic brands.
* **Target Audience**: 
  1. **Primary**: Race organizers & sports event managers looking for reliable, high-pressure event coverage.
  2. **Secondary**: Fitness, athletics, and sportswear brands needing commercial-grade, emotion-driven visual assets.
  3. **Tertiary**: Individual runners seeking high-quality race memories.

---

## 2. The Narrowest Wedge (Phase 1)
A premium single-page application built on Next.js 15 & Tailwind CSS v4, optimized for visual impact, mobile responsiveness, and swift inquiry conversion.

### Section Structure (Single-Page Layout)
1. **Hero Section (The Hook)**:
   * High-impact fullscreen image slider or background video of raw finish-line emotion.
   * Bold, clear positioning statement: *"Capturing the Grit, Sweat, and Victory of Endurance Sports."*
   * Call to Action (CTA): *Book Coverage* (scrolls to Contact).
2. **Specialization & Stats (The Proof)**:
   * Quick grid showcasing the photographer’s focus: *Marathons*, *Trail Runs*, *Cycling Events*, *Brand Commercials*.
   * Micro-statistics: *100+ events covered*, *50,000+ runners shot*, *10+ brands represented*.
3. **Curated Event Galleries (The Work)**:
   * Tabbed or filtered premium gallery. Instead of random "nice pictures," categorize by race narrative:
     * *The Start Line* (Anticipation, energy)
     * *Mid-Race Grit* (Effort, endurance, sponsor visibility)
     * *The Finish Line* (Raw emotion, victory, medal moments)
     * *Brand & Details* (Sponsor logos, running gear, medals)
   * Lightbox view optimized for mobile swipe gestures.
4. **The Client Journey / Testimonials (Trust)**:
   * Quotes from race directors and athletic brands highlighting reliability under pressure.
5. **Call to Action (Conversion)**:
   * A premium, minimal contact form designed specifically for race bookings, sponsorships, and commercial inquiries.

---

## 3. UI/UX & Aesthetic Guidelines
To match the "premium" requirement, the design must feel energetic yet extremely structured and professional:
* **Color Palette (Dark Mode by Default)**:
   * Primary Dark: HSL `240 10% 3.9%` (Deep Obsidian / Near Black)
   * Accent (Energy): HSL `22 100% 50%` (Vibrant Endurance Orange - represents race bibs, safety, energy) or HSL `142 70% 45%` (Active Green)
   * Muted Gray: HSL `240 5% 64.9%` (Sleek slate borders)
* **Typography**:
   * Headings: Sans-serif bold, modern geometric font (e.g., *Outfit* or *Inter*).
   * Body: Sleek, highly readable sans-serif (e.g., *Inter* or *Plus Jakarta Sans*).
* **Transitions & Micro-Animations**:
   * Smooth, hardware-accelerated transitions on gallery filters.
   * High-performance hover effects for images (slight scale up + overlay opacity shift).
   * Slide-in elements on scroll for testimonial blocks.
* **Performance Optimization**:
   * Image optimization using Next.js `next/image` to handle high-resolution photos without degrading page speed.
   * Lazy loading for gallery rows.

---

## 4. Technology Stack
* **Framework**: Next.js 15 (App Router, React 19)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4
* **Icons**: `lucide-react`
* **Performance Tools**: Next.js native `Image` optimization, layout-shifting prevention.

---

## 5. Success Metrics
* **Lead Conversion**: Number of booking/inquiry forms completed divided by unique site visits.
* **Retention (Dwell Time)**: Time spent viewing galleries (target: > 1.5 minutes average).
* **Speed Index**: Load time of largest contentful paint (LCP) under 1.5 seconds.
