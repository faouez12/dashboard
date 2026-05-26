'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    FileText,
    Image as ImageIcon,
    Settings,
    Menu,
    X,
    LogOut,
    User,
    Layout,
    Sparkles,
    Mail,
    ClipboardList,
    Activity,
    ShieldCheck
} from 'lucide-react'

interface DashboardContainerProps {
    children: React.ReactNode
    userName?: string
    avatarUrl?: string | null
}

export default function DashboardContainer({ children, userName, avatarUrl }: DashboardContainerProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()
    
    const navItems = [
        { name: 'Overview', href: '/admin/dashboard', icon: Layout },
        { name: 'Hero Settings', href: '/admin/dashboard/settings/hero', icon: Sparkles },
        { name: 'Templates', href: '/admin/dashboard/settings/templates', icon: Layout },
        { name: 'Gallery', href: '/admin/dashboard/gallery', icon: ImageIcon },
        { name: 'Events', href: '/admin/dashboard/events', icon: ClipboardList },
        { name: 'Blog', href: '/admin/dashboard/blog', icon: FileText },
        { name: 'Messages', href: '/admin/dashboard/messages', icon: Mail },
    ]

    const handleSignOut = async () => {
        localStorage.clear()
        try {
            await fetch('/api/admin/logout', { method: 'POST' })
        } catch (e) {
            console.error(e)
        }
        window.location.href = '/admin/login'
    }


    return (
        <div className="flex h-screen bg-[#0F0F0F] font-sans text-slate-300 overflow-hidden">
            
            {/* Sidebar */}
            <aside
                className={`relative bg-[#1A1A1A] border-r border-white/5 transition-all duration-500 ease-out z-30 flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.4)] h-full shrink-0 ${isSidebarOpen ? 'w-64' : 'w-[80px]'}`}
            >
                {/* Logo Section */}
                <div className="relative h-24 flex items-center justify-between px-6 border-b border-white/5">
                    {isSidebarOpen ? (
                        <div className="w-32 h-12 relative flex items-center">
                          <span className="text-xl font-bold font-display uppercase tracking-tight text-white">
                            Shahine<span className="text-accent">.</span>Admin
                          </span>
                        </div>
                    ) : (
                        <div className="w-10 h-10 relative bg-[#ccff00] rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                          <span className="text-sm font-black text-black font-display uppercase">S</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-xl hover:bg-white/5 text-slate-500 transition-colors"
                    >
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Status Indicator */}
                {isSidebarOpen && (
                    <div className="px-6 py-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                            <span className="text-[10px] font-black text-[#ccff00] uppercase tracking-widest">System Operational</span>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                        isActive
                                        ? 'bg-[#ccff00] text-black font-bold shadow-[0_10px_20px_-5px_rgba(204,255,0,0.4)]'
                                        : 'text-slate-500 hover:bg-white/5 hover:text-white'
                                    } ${!isSidebarOpen ? 'justify-center' : ''}`}
                            >
                                <item.icon
                                    size={20}
                                    className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                />
                                {isSidebarOpen && (
                                    <span className="relative z-10 truncate flex-1 text-sm uppercase tracking-tight">{item.name}</span>
                                )}
                                {isSidebarOpen && isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-white/5">
                    <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 ${!isSidebarOpen ? 'justify-center' : ''}`}>
                        <div className="w-9 h-9 rounded-xl bg-[#2A2A2A] flex items-center justify-center text-[#ccff00] shrink-0 border border-white/10">
                            {avatarUrl ? (
                                <Image src={avatarUrl} alt={userName || 'User'} width={36} height={36} className="rounded-xl object-cover" />
                            ) : (
                                <User size={18} />
                            )}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-white truncate uppercase tracking-tight">{userName || 'Shahine Admin'}</p>
                                <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-widest">Senior Operator</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Industrial Header */}
                <header className="h-20 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                            <Activity size={14} className="text-[#ccff00]" />
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Live Flow</span>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                            Dashboard <span className="mx-2 text-white/10">/</span>
                            <span className="text-white">
                                {navItems.find(i => i.href === pathname)?.name || 'Command Center'}
                            </span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 text-[#ccff00]">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Secure Access</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                        >
                            <LogOut size={14} />
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Page Canvas */}
                <main className="flex-1 overflow-auto bg-[#0F0F0F] p-8">
                    <div className="max-w-[1600px] mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
