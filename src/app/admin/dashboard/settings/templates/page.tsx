'use client'
import React from 'react'
import Link from 'next/link'
import { Layout, Palette, ArrowLeft, ChevronRight, FileText, ClipboardList, Sparkles } from 'lucide-react'

export default function TemplateSettingsPage() {
    const templates = [
        {
            id: 'blog-default',
            title: 'Blog Master Blueprint',
            desc: 'Define the visual architecture and default elements for all system blog posts.',
            href: '/admin/dashboard/settings/templates/blog-default',
            icon: FileText,
            color: 'text-teal-400',
            borderColor: 'hover:border-teal-500',
            bgAccent: 'bg-teal-500/5',
            hoverShadow: 'hover:shadow-teal-500/5'
        },
        {
            id: 'event-default',
            title: 'Event Master Blueprint',
            desc: 'Define the default layouts, stats overlay settings, and gallery containers for races.',
            href: '/admin/dashboard/settings/templates/event-default',
            icon: ClipboardList,
            color: 'text-blue-400',
            borderColor: 'hover:border-blue-500',
            bgAccent: 'bg-blue-500/5',
            hoverShadow: 'hover:shadow-blue-500/5'
        },
        {
            id: 'hero-default',
            title: 'Homepage Hero Blueprint',
            desc: 'Define the default starting configuration for the homepage Puck page layout.',
            href: '/admin/dashboard/settings/templates/hero-default',
            icon: Sparkles,
            color: 'text-purple-400',
            borderColor: 'hover:border-purple-500',
            bgAccent: 'bg-purple-500/5',
            hoverShadow: 'hover:shadow-purple-500/5'
        }
    ]

    return (
        <div className="p-8 max-w-5xl mx-auto text-slate-300">
            <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group uppercase font-mono text-[10px] tracking-widest"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <div className="mb-12">
                <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                    <Palette className="text-[#ccff00]" size={32} />
                    Master Templates
                </h1>
                <p className="text-slate-500 mt-2 text-sm uppercase tracking-wider font-semibold">
                    Design the default look for your blogs, races, and homepage hero configurations.
                </p>
            </div>

            <div className="grid gap-6">
                {templates.map(template => (
                    <Link
                        key={template.id}
                        href={template.href}
                        className={`group flex items-center justify-between bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 transition-all duration-500 ${template.borderColor} hover:shadow-2xl ${template.hoverShadow}`}
                    >
                        <div className="flex items-center gap-8">
                            <div className={`w-20 h-20 ${template.bgAccent} ${template.color} rounded-2xl flex items-center justify-center group-hover:bg-[#ccff00] group-hover:text-black transition-all duration-500 shadow-sm border border-white/5`}>
                                <template.icon size={36} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white mb-2 uppercase italic tracking-tight group-hover:text-[#ccff00] transition-colors">
                                    {template.title}
                                </h3>
                                <p className="text-slate-500 max-w-md text-xs font-medium leading-relaxed">
                                    {template.desc}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 text-slate-500 group-hover:bg-[#ccff00]/10 group-hover:text-[#ccff00] transition-all border border-white/5">
                            <ChevronRight size={24} />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 p-8 bg-[#1A1A1A] rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="text-white font-bold mb-2 uppercase tracking-wide text-xs">How Templates Work</h4>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
                        When you design a template, it saves a "blueprint". When you create a "Default" post,
                        it copies this blueprint so you don't have to start from zero.
                        Updating a template won't change your existing published posts.
                    </p>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                    <Layout size={120} className="text-white" />
                </div>
            </div>
        </div>
    )
}
