'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ImageIcon,
  ClipboardList,
  FileText,
  Mail,
  ArrowRight,
  TrendingUp,
  Sparkles,
  UserCheck
} from 'lucide-react'
import { fetchGalleryItems, fetchEvents, fetchBlogPosts, fetchMessages } from '@/app/admin/actions'

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({
    gallery: 0,
    events: 0,
    blogs: 0,
    messages: 0
  })
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [g, e, b, m] = await Promise.all([
          fetchGalleryItems(),
          fetchEvents(),
          fetchBlogPosts(),
          fetchMessages()
        ])
        setStats({
          gallery: g.length,
          events: e.length,
          blogs: b.length,
          messages: m.length
        })
        setRecentMessages(m.slice(0, 5))
      } catch (err) {
        console.error('Failed to load stats', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-8 w-full animate-pulse">
        <div className="h-10 w-64 bg-white/5 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white/5 border border-white/10 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-white/5 border border-white/10 rounded-3xl" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Gallery Media',
      count: stats.gallery,
      icon: ImageIcon,
      color: '#3b82f6',
      href: '/admin/dashboard/gallery',
      desc: 'High-res athletics capture shots'
    },
    {
      title: 'Race Events',
      count: stats.events,
      icon: ClipboardList,
      color: '#10b981',
      href: '/admin/dashboard/events',
      desc: 'Case studies & event galleries'
    },
    {
      title: 'Blog Articles',
      count: stats.blogs,
      icon: FileText,
      color: '#a855f7',
      href: '/admin/dashboard/blog',
      desc: 'Gear logs & tutorials published'
    },
    {
      title: 'Inbox Messages',
      count: stats.messages,
      icon: Mail,
      color: '#ccff00',
      href: '/admin/dashboard/messages',
      desc: 'Customer rates & bookings inquiry'
    }
  ]

  return (
    <div className="flex flex-col gap-10 w-full text-slate-300">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase text-white tracking-tight flex items-center gap-3">
          <Sparkles className="text-[#ccff00]" size={28} />
          Terminal Command Center
        </h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
          Control R2 assets, homepage carousels, and client inquiries.
        </p>
      </div>

      {/* Grid Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group bg-[#1A1A1A] border border-white/5 hover:border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
            >
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-xl bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                  <Icon size={24} style={{ color: card.color }} />
                </div>
                <span className="text-3xl font-black text-white group-hover:scale-105 transition-transform">
                  {card.count}
                </span>
              </div>
              <div className="mt-5">
                <h3 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-1.5 group-hover:text-[#ccff00] transition-colors">
                  {card.title} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
                  {card.desc}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Main Split Panels */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Recent Messages */}
        <div className="lg:col-span-8 bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold uppercase text-white tracking-wider">
                Recent Inquiries
              </h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
                Last submissions from contact form
              </p>
            </div>
            <Link
              href="/admin/dashboard/messages"
              className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] hover:underline flex items-center gap-1"
            >
              View Inbox <ArrowRight size={12} />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-12 text-center text-slate-600 font-mono uppercase tracking-widest text-xs">
              No recent messages received.
            </div>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white uppercase tracking-tight truncate">
                        {msg.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                        {msg.topic}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-1 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 shrink-0 self-start mt-0.5">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Node Config */}
        <div className="lg:col-span-4 bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          <h3 className="text-base font-bold uppercase text-white tracking-wider border-b border-white/5 pb-4">
            Quick Actions
          </h3>

          <div className="flex flex-col gap-3">
            <Link
              href="/admin/dashboard/settings/hero"
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-[#ccff00]/10 border border-white/5 hover:border-[#ccff00]/20 text-slate-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-[#ccff00]" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Customize Hero Section
                </span>
              </div>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/dashboard/gallery"
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20 text-slate-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <ImageIcon size={16} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Upload Gallery Shots
                </span>
              </div>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/dashboard/events"
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 text-slate-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={16} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Create Race Event
                </span>
              </div>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/dashboard/blog"
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/20 text-slate-300 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-purple-500" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Draft New Article
                </span>
              </div>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-2 p-4 bg-[#ccff00]/5 border border-[#ccff00]/10 rounded-2xl flex items-center gap-3.5">
            <UserCheck size={20} className="text-[#ccff00]" />
            <div>
              <p className="text-[10px] text-white font-bold uppercase tracking-wide">
                Role: Senior Administrator
              </p>
              <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">
                Full Read & Write Access
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
