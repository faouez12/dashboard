'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Function to check if cookie exists
        const getCookie = (name: string) => {
            if (typeof document === 'undefined') return null
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null
        }

        const consent = getCookie('cookie-consent')
        if (!consent) {
            // Short delay to let the page settle
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1); // 1 year
        document.cookie = `cookie-consent=accepted; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
        setIsVisible(false)
    }

    const handleReject = () => {
        // Session cookie for rejection
        document.cookie = `cookie-consent=rejected; path=/; SameSite=Lax`;
        setIsVisible(false)
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#070708]/90 border-t border-border/20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                >
                    <div className="max-w-7xl mx-auto p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 relative">
                        
                        {/* Decorative Background Element */}
                        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />

                        {/* Left Side: Icon and Title */}
                        <div className="flex items-center gap-6 z-10">
                            {/* Icon Container */}
                            <div className="relative flex-shrink-0">
                                <div className="w-14 h-14 rounded-2xl bg-muted border border-border/30 flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-300">
                                    <Cookie className="w-7 h-7 text-accent animate-pulse" />
                                    {/* Neon Cyan Dot Accent */}
                                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-accent rounded-full shadow-[0_0_10px_rgba(0,245,255,0.8)]" />
                                </div>
                            </div>
 
                            {/* Title Block */}
                            <div className="flex flex-col uppercase tracking-tighter">
                                <span className="text-[10px] text-accent font-black tracking-[0.3em] mb-1 font-mono">Telemetry Active</span>
                                <span className="text-xl font-black text-white leading-none font-display">Data Consent</span>
                            </div>
                        </div>

                        {/* Middle: Description */}
                        <div className="flex-grow max-w-2xl z-10">
                            <p className="text-muted-foreground text-xs md:text-[13px] leading-relaxed font-medium">
                                We use technical cookies to analyze site traffic, optimize your speed-focused visual experience, and manage authentication. By proceeding, you agree to our 
                                <span className="text-white mx-1 underline decoration-accent underline-offset-4 cursor-pointer hover:text-accent transition-colors font-bold">Privacy Standards</span>.
                            </p>
                        </div>

                        {/* Right Side: Actions and Close */}
                        <div className="flex items-center gap-8 z-10">
                            {/* Buttons */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleAccept}
                                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-[0_10px_25px_rgba(0,245,255,0.25)] hover:scale-103 active:scale-97 cursor-pointer"
                                >
                                    Authorize
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="text-muted-foreground hover:text-white font-black text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
                                >
                                    Decline
                                </button>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="transition-all hover:rotate-90 p-1 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
