"use client";
import React, { useState, useEffect } from "react";
import { useMotionValue, useMotionTemplate, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const EvervaultCard = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    const str = generateRandomString(1000);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1000);
    setRandomString(str);
  }

  return (
    <div
      onMouseMove={onMouseMove}
      className={cn(
        "relative flex items-center justify-center w-full h-full overflow-hidden group/card rounded-[2rem] border border-border bg-muted/5 transition-all duration-300 hover:border-accent/40",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <CardPattern
        mouseX={mouseX}
        mouseY={mouseY}
        randomString={randomString}
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString }: any) {
  const maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 rounded-[2rem] [mask-image:radial-gradient(350px_at_50%_50%,white,transparent)]" />
      <motion.div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover/card:opacity-100 transition duration-300"
        style={{ ...style, background: "linear-gradient(to right, rgba(0,245,255,0.15), rgba(0,245,255,0.08))" }}
      />
      <motion.div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover/card:opacity-40 mix-blend-overlay font-mono text-[9px] text-accent select-none overflow-hidden p-6 break-all leading-none font-bold"
        style={style}
      >
        {randomString}
      </motion.div>
    </div>
  );
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
