'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Save, FileText, ArrowRight, ShieldCheck, Image as ImageIcon } from 'lucide-react'
import { fetchCapabilitiesSettings, updateCapabilitiesSettings } from '@/app/admin/actions'
import { useToast } from '../../components/ToastProvider'
import ImageUpload from '../../components/ImageUpload'

export default function CapabilitiesSettingsPage() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'cards'>('general')

  // Left Column Settings
  const [badge, setBadge] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // 4 Stats
  const [stats, setStats] = useState([
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' },
  ])

  // 4 Cards / Items
  const [items, setItems] = useState([
    { num: '01', title: '', desc: '', bg_image_url: '' },
    { num: '02', title: '', desc: '', bg_image_url: '' },
    { num: '03', title: '', desc: '', bg_image_url: '' },
    { num: '04', title: '', desc: '', bg_image_url: '' },
  ])

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await fetchCapabilitiesSettings()
        setBadge(settings.badge || '')
        setTitle(settings.title || '')
        setDescription(settings.description || '')
        
        if (settings.stats && settings.stats.length === 4) {
          setStats(settings.stats)
        }
        if (settings.items && settings.items.length === 4) {
          setItems(settings.items)
        }
      } catch (err) {
        console.error('Failed to load capabilities settings', err)
        toast.error('Load Error', 'Failed to retrieve homepage capabilities settings.')
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [toast])

  const uploadHandler = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    if (response.ok && data.url) {
      return data.url
    } else {
      throw new Error(data.error || 'Server rejected file.')
    }
  }

  const handleStatChange = (index: number, field: 'value' | 'label', value: string) => {
    const updated = [...stats]
    updated[index] = { ...updated[index], [field]: value }
    setStats(updated)
  }

  const handleItemChange = (index: number, field: 'title' | 'desc' | 'bg_image_url', value: string) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      await updateCapabilitiesSettings({
        badge,
        title,
        description,
        stats,
        items,
      })
      toast.success('Settings Saved', 'Capabilities configuration has been recompiled successfully.')
    } catch (err: any) {
      console.error(err)
      toast.error('Save Failure', err.message || 'Failed to update capabilities settings.')
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
            <ShieldCheck className="text-[#ccff00]" size={28} />
            Capabilities & Specialty Settings
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
            Configure the homepage Capability section: text, stats, and individual card background images.
          </p>
        </div>
        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="px-6 py-3.5 bg-[#ccff00] hover:bg-[#ccff00]/95 text-black font-black italic uppercase tracking-wider text-xs rounded-xl transition-all shadow-xl shadow-[#ccff00]/10 hover:shadow-[#ccff00]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving Config...' : 'Apply System Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1A1A1A] p-2.5 rounded-2xl border border-white/5 max-w-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center justify-center gap-2.5 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={16} />
          General & Statistics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          className={`flex items-center justify-center gap-2.5 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'cards'
              ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon size={16} />
          Specialty Cards (Background Images)
        </button>
      </div>

      {activeTab === 'general' ? (
        <form onSubmit={handleSave} className="flex flex-col gap-8 max-w-3xl animate-fadeIn">
          {/* General Copy */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase text-white tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
              <Sparkles size={18} className="text-[#ccff00]" /> 1. Section Header & Copy
            </h3>

            {/* Badge */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                Badge Text
              </label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                placeholder="CORE CAPABILITY"
                className="w-full px-4 py-3.5 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors"
              />
            </div>

            {/* Section Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Engineered for zero-failure delivery."
                className="w-full px-4 py-3.5 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors font-display font-bold"
              />
            </div>

            {/* Section Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                Section Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="In elite endurance events, missed frames are not an option..."
                rows={4}
                className="w-full px-4 py-3.5 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase text-white tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
              <FileText size={18} className="text-[#ccff00]" /> 2. Statistics Grid (4 Stats)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-3 bg-zinc-950/45 p-5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-[#ccff00] tracking-wider uppercase block">Stat Box {idx + 1}</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={e => handleStatChange(idx, 'value', e.target.value)}
                        placeholder="e.g. 120+"
                        className="w-full px-3 py-2 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none focus:border-[#ccff00] font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={e => handleStatChange(idx, 'label', e.target.value)}
                        placeholder="e.g. Races Covered"
                        className="w-full px-3 py-2 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none focus:border-[#ccff00]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-8 max-w-4xl animate-fadeIn">
          {/* 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, idx) => (
              <div key={idx} className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold uppercase text-white tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/25 text-[#ccff00] flex items-center justify-center text-[10px] font-black">{item.num}</span>
                    Capability Card {idx + 1}
                  </h3>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Card Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => handleItemChange(idx, 'title', e.target.value)}
                    placeholder="Card Title"
                    className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors font-bold"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Card Description</label>
                  <textarea
                    value={item.desc}
                    onChange={e => handleItemChange(idx, 'desc', e.target.value)}
                    placeholder="Card description text..."
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Background Image Upload */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Background Image</label>
                  <ImageUpload
                    onImageUploaded={url => handleItemChange(idx, 'bg_image_url', url)}
                    currentImage={item.bg_image_url}
                    uploadHandler={uploadHandler}
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}
    </div>
  )
}
