"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export default function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative w-full h-full bg-background transition-colors duration-300",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={cn(
            "aurora-bg-mesh absolute inset-[-10px] opacity-75 mix-blend-screen will-change-transform",
            showRadialGradient &&
              "mask-radial"
          )}
          style={{
            maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)"
          }}
        />
      </div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
