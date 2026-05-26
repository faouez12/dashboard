'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Save, FileText, ArrowRight } from 'lucide-react'
import { fetchHeroSettings, updateHeroSettings } from '@/app/admin/actions'
import { useToast } from '../../components/ToastProvider'
import Link from 'next/link'

export default function HeroSettingsPage() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'text' | 'visual'>('text')

  // Settings State
  const [backgroundType, setBackgroundType] = useState<'aurora' | 'image_carousel' | 'video_carousel'>('aurora')
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [badge, setBadge] = useState('')
  const [titleLine1, setTitleLine1] = useState('')
  const [titleLine2, setTitleLine2] = useState('')
  const [titleLine3, setTitleLine3] = useState('')
  const [description, setDescription] = useState('')

  // Specs State
  const [spec1Label, setSpec1Label] = useState('')
  const [spec1Value, setSpec1Value] = useState('')
  const [spec2Label, setSpec2Label] = useState('')
  const [spec2Value, setSpec2Value] = useState('')
  const [spec3Label, setSpec3Label] = useState('')
  const [spec3Value, setSpec3Value] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await fetchHeroSettings()
        setBackgroundType(settings.background_type || 'aurora')
        setMediaUrls(settings.media_urls || [])
        setBadge(settings.badge || '')
        setTitleLine1(settings.title_line_1 || '')
        setTitleLine2(settings.title_line_2 || '')
        setTitleLine3(settings.title_line_3 || '')
        setDescription(settings.description || '')

        setSpec1Label(settings.spec_1_label || '')
        setSpec1Value(settings.spec_1_value || '')
        setSpec2Label(settings.spec_2_label || '')
        setSpec2Value(settings.spec_2_value || '')
        setSpec3Label(settings.spec_3_label || '')
        setSpec3Value(settings.spec_3_value || '')
      } catch (err) {
        console.error('Failed to load hero settings', err)
        toast.error('Load Error', 'Failed to retrieve homepage hero settings.')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [toast])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      await updateHeroSettings({
        background_type: backgroundType,
        media_urls: mediaUrls,
        badge,
        title_line_1: titleLine1,
        title_line_2: titleLine2,
        title_line_3: titleLine3,
        description,
        spec_1_label: spec1Label,
        spec_1_value: spec1Value,
        spec_2_label: spec2Label,
        spec_2_value: spec2Value,
        spec_3_label: spec3Label,
        spec_3_value: spec3Value,
      })
      toast.success('Settings Saved', 'Homepage hero configuration has been recompiled successfully.')
    } catch (err: any) {
      console.error(err)
      toast.error('Save Failure', err.message || 'Failed to update hero settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 w-full animate-pulse text-slate-400">
        <div className="h-10 w-64 bg-white/5 rounded-lg" />
        <div className="h-[600px] bg-white/5 border border-white/10 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl text-slate-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-[#ccff00]" size={28} />
            Homepage Hero Settings
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
            Configure homepage hero settings, typography, specs, and layout design.
          </p>
        </div>
        {activeTab === 'text' && (
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-6 py-3.5 bg-[#ccff00] hover:bg-[#ccff00]/95 text-black font-black italic uppercase tracking-wider text-xs rounded-xl transition-all shadow-xl shadow-[#ccff00]/10 hover:shadow-[#ccff00]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving Config...' : 'Apply System Changes'}
          </button>
        )}
      </div>

      {/* Selector Tabs (Two Buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1A1A1A] p-2.5 rounded-2xl border border-white/5 max-w-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex items-center justify-center gap-2.5 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={16} />
          Edit Text & Metadata
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visual')}
          className={`flex items-center justify-center gap-2.5 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'visual'
              ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles size={16} />
          Edit Visual Layout
        </button>
      </div>

      {activeTab === 'text' ? (
        <form onSubmit={handleSave} className="flex flex-col gap-8 max-w-3xl animate-fadeIn">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase text-white tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
              <Sparkles size={18} className="text-[#ccff00]" /> 1. Headline & Copy Elements
            </h3>

            {/* Badge */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                Badge Pill Text
              </label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                placeholder="SPORTS PHOTOGRAPHY REDEFINED"
                className="w-full px-4 py-3.5 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors"
              />
            </div>

            {/* Headline Lines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                  Title Line 1
                </label>
                <input
                  type="text"
                  value={titleLine1}
                  onChange={e => setTitleLine1(e.target.value)}
                  placeholder="CAPTURE"
                  className="w-full px-4 py-3.5 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors font-display uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                  Title Line 2 (Accent)
                </label>
                <input
                  type="text"
                  value={titleLine2}
                  onChange={e => setTitleLine2(e.target.value)}
                  placeholder="THE GRIT"
                  className="w-full px-4 py-3.5 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors font-display uppercase text-[#ccff00]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                  Title Line 3
                </label>
                <input
                  type="text"
                  value={titleLine3}
                  onChange={e => setTitleLine3(e.target.value)}
                  placeholder="ON THE COURSE"
                  className="w-full px-4 py-3.5 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors font-display uppercase"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                Under-Title Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Translating the raw victory, sweat, and split-second milestones..."
                rows={4}
                className="w-full px-4 py-3.5 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase text-white tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
              <FileText size={18} className="text-[#ccff00]" /> 2. Specs Overlay Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Spec 1 */}
              <div className="space-y-3 bg-zinc-950/45 p-4 rounded-xl border border-white/5">
                <span className="text-[9px] font-black text-[#ccff00] tracking-wider uppercase block">Specification 01</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={spec1Label}
                    onChange={e => setSpec1Label(e.target.value)}
                    placeholder="SHUTTER"
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/5 text-white rounded-lg text-[10px] outline-none"
                  />
                  <input
                    type="text"
                    value={spec1Value}
                    onChange={e => setSpec1Value(e.target.value)}
                    placeholder="1/2000S"
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/5 text-white rounded-lg text-[10px] outline-none font-bold"
                  />
                </div>
              </div>

              {/* Spec 2 */}
              <div className="space-y-3 bg-zinc-950/45 p-4 rounded-xl border border-white/5">
                <span className="text-[9px] font-black text-[#ccff00] tracking-wider uppercase block">Specification 02</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={spec2Label}
                    onChange={e => setSpec2Label(e.target.value)}
                    placeholder="RESOLUTION"
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/5 text-white rounded-lg text-[10px] outline-none"
                  />
                  <input
                    type="text"
                    value={spec2Value}
                    onChange={e => setSpec2Value(e.target.value)}
                    placeholder="50.1MP"
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/5 text-white rounded-lg text-[10px] outline-none font-bold"
                  />
                </div>
              </div>

              {/* Spec 3 */}
              <div className="space-y-3 bg-zinc-950/45 p-4 rounded-xl border border-white/5">
                <span className="text-[9px] font-black text-[#ccff00] tracking-wider uppercase block">Specification 03</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={spec3Label}
                    onChange={e => setSpec3Label(e.target.value)}
                    placeholder="PIPELINE"
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/5 text-white rounded-lg text-[10px] outline-none"
                  />
                  <input
                    type="text"
                    value={spec3Value}
                    onChange={e => setSpec3Value(e.target.value)}
                    placeholder="FTPS LIVE"
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/5 text-white rounded-lg text-[10px] outline-none font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto mt-6 animate-fadeIn">
          <div className="h-16 w-16 bg-[#ccff00]/10 border border-[#ccff00]/25 rounded-2xl flex items-center justify-center text-[#ccff00]">
            <Sparkles size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-white tracking-tight">Visual Layout Editor</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
              Puck.js visual page builder
            </p>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Take complete control of the homepage design. Drag-and-drop content cards, images, custom carousels, text headers, descriptions, and camera specs.
          </p>
          <Link
            href="/admin/dashboard/builder"
            className="mt-4 px-8 py-4.5 bg-[#ccff00] hover:bg-[#ccff00]/95 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-[#ccff00]/10 hover:shadow-[#ccff00]/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            Launch Visual Builder <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}
