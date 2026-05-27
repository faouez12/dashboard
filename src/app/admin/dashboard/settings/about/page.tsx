'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Save, FileText, ShieldCheck, Image as ImageIcon, Sliders } from 'lucide-react'
import { fetchAboutSettings, updateAboutSettings } from '@/app/admin/actions'
import { useToast } from '../../components/ToastProvider'
import ImageUpload from '../../components/ImageUpload'

export default function AboutSettingsPage() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'cards' | 'gear'>('general')

  // Section Header Settings
  const [badge, setBadge] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // 3 Operational Cards Settings
  const [cards, setCards] = useState([
    { title: '', desc: '', image_url: '' },
    { title: '', desc: '', image_url: '' },
    { title: '', desc: '', image_url: '' },
  ])

  // Gear Toolkit Settings
  const [gearBadge, setGearBadge] = useState('')
  const [gearTitle, setGearTitle] = useState('')
  const [gearDescription, setGearDescription] = useState('')
  const [gearCategories, setGearCategories] = useState<any[]>([])

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await fetchAboutSettings()
        setBadge(settings.badge || '')
        setTitle(settings.title || '')
        setDescription(settings.description || '')
        
        if (settings.cards && settings.cards.length === 3) {
          setCards(settings.cards.map((c: any) => ({
            title: c.title || '',
            desc: c.desc || '',
            image_url: c.image_url || ''
          })))
        }

        setGearBadge(settings.gear_badge || '')
        setGearTitle(settings.gear_title || '')
        setGearDescription(settings.gear_description || '')
        if (settings.gear_categories && settings.gear_categories.length > 0) {
          setGearCategories(settings.gear_categories.map((cat: any) => ({
            category: cat.category || '',
            items: cat.items ? cat.items.map((i: any) => ({ name: i.name || '', desc: i.desc || '' })) : []
          })))
        }
      } catch (err) {
        console.error('Failed to load about page settings', err)
        toast.error('Load Error', 'Failed to retrieve About page settings.')
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

  const handleCardChange = (index: number, field: 'title' | 'desc' | 'image_url', value: string) => {
    const updated = [...cards]
    updated[index] = { ...updated[index], [field]: value }
    setCards(updated)
  }

  // Gear Categories update handlers
  const handleCategoryNameChange = (catIdx: number, val: string) => {
    const updated = [...gearCategories]
    updated[catIdx] = { ...updated[catIdx], category: val }
    setGearCategories(updated)
  }

  const handleGearItemChange = (catIdx: number, itemIdx: number, field: 'name' | 'desc', val: string) => {
    const updated = [...gearCategories]
    const updatedItems = [...updated[catIdx].items]
    updatedItems[itemIdx] = { ...updatedItems[itemIdx], [field]: val }
    updated[catIdx] = { ...updated[catIdx], items: updatedItems }
    setGearCategories(updated)
  }

  const addGearItem = (catIdx: number) => {
    const updated = [...gearCategories]
    if (updated[catIdx].items.length >= 3) return
    updated[catIdx].items = [...updated[catIdx].items, { name: '', desc: '' }]
    setGearCategories(updated)
  }

  const removeGearItem = (catIdx: number, itemIdx: number) => {
    const updated = [...gearCategories]
    const updatedItems = updated[catIdx].items.filter((_: any, idx: number) => idx !== itemIdx)
    updated[catIdx] = { ...updated[catIdx], items: updatedItems }
    setGearCategories(updated)
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      await updateAboutSettings({
        badge,
        title,
        description,
        cards,
        gear_badge: gearBadge,
        gear_title: gearTitle,
        gear_description: gearDescription,
        gear_categories: gearCategories
      })
      toast.success('Settings Saved', 'About page configurations updated successfully.')
    } catch (err: any) {
      console.error(err)
      toast.error('Save Failure', err.message || 'Failed to update About page settings.')
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
            About Page Settings
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
            Configure the About page header copy, the three operational value cards, and the gear toolkit.
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#1A1A1A] p-2.5 rounded-2xl border border-white/5 max-w-3xl">
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
          Header & Description
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
          Operational Value Cards
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gear')}
          className={`flex items-center justify-center gap-2.5 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'gear'
              ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders size={16} />
          Gear Toolkit
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
                placeholder="The Photographer"
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
                placeholder="Behind the Lens: Shahine"
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
                placeholder="I document the boundary points of athletic capability..."
                rows={5}
                className="w-full px-4 py-3.5 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </form>
      ) : activeTab === 'cards' ? (
        <form onSubmit={handleSave} className="flex flex-col gap-8 max-w-4xl animate-fadeIn">
          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <div key={idx} className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold uppercase text-white tracking-widest flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/25 text-[#ccff00] flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                    Value Card {idx + 1}
                  </h3>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Card Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={e => handleCardChange(idx, 'title', e.target.value)}
                    placeholder="e.g. Zero-Failure Protocol"
                    className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors font-bold"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Card Details</label>
                  <textarea
                    value={card.desc}
                    onChange={e => handleCardChange(idx, 'desc', e.target.value)}
                    placeholder="Specify details..."
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Background Image Upload */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Background / Cover Image</label>
                  <ImageUpload
                    onImageUploaded={url => handleCardChange(idx, 'image_url', url)}
                    currentImage={card.image_url}
                    uploadHandler={uploadHandler}
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-8 max-w-5xl animate-fadeIn">
          {/* Gear General Copy */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase text-white tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
              <Sparkles size={18} className="text-[#ccff00]" /> 1. Toolkit Section Copy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">Badge Text</label>
                <input
                  type="text"
                  value={gearBadge}
                  onChange={e => setGearBadge(e.target.value)}
                  placeholder="The Equipment"
                  className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">Title Text</label>
                <input
                  type="text"
                  value={gearTitle}
                  onChange={e => setGearTitle(e.target.value)}
                  placeholder="Professional Toolkit"
                  className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors font-bold font-display"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono font-mono font-bold">Description</label>
              <textarea
                value={gearDescription}
                onChange={e => setGearDescription(e.target.value)}
                placeholder="High-shutter speed cameras, ultra-bright lenses..."
                rows={3}
                className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 hover:border-white/10 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Gear Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {gearCategories.map((cat, catIdx) => (
              <div key={catIdx} className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-5 flex flex-col gap-5">
                
                {/* Category Header */}
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <span className="h-2 w-2 rounded-full bg-[#ccff00] shrink-0" />
                  <div className="flex-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest text-slate-500 font-mono block">Category Name</label>
                    <input
                      type="text"
                      value={cat.category}
                      onChange={e => handleCategoryNameChange(catIdx, e.target.value)}
                      placeholder="Category Name"
                      className="w-full bg-transparent border-none text-white text-sm font-black font-display uppercase tracking-tight outline-none focus:text-[#ccff00]"
                    />
                  </div>
                </div>

                {/* Items Stacked Vertically in Column */}
                <div className="flex flex-col gap-4 flex-1">
                  {cat.items?.map((item: any, itemIdx: number) => (
                    <div key={itemIdx} className="bg-zinc-950/45 border border-white/5 p-4 rounded-2xl space-y-3 relative group">
                      
                      {/* Name input with '-' Delete button inside/on the right */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-slate-500 font-mono block">Item Name</label>
                        <div className="flex items-center gap-2 relative bg-zinc-900 border border-white/5 focus-within:border-[#ccff00] rounded-lg px-2.5 py-1.5 transition-colors">
                          <input
                            type="text"
                            value={item.name}
                            onChange={e => handleGearItemChange(catIdx, itemIdx, 'name', e.target.value)}
                            placeholder="e.g. Sony Alpha 9 III"
                            className="flex-1 bg-transparent text-white text-xs font-bold outline-none border-none p-0"
                          />
                          <button
                            type="button"
                            onClick={() => removeGearItem(catIdx, itemIdx)}
                            className="text-red-500 hover:text-red-400 text-sm font-black w-5 h-5 flex items-center justify-center rounded bg-red-950/10 border border-red-500/10 hover:bg-red-950/30 transition-all cursor-pointer"
                            title="Delete Item"
                          >
                            -
                          </button>
                        </div>
                      </div>

                      {/* Description Textarea */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-slate-500 font-mono block">Description</label>
                        <textarea
                          value={item.desc}
                          onChange={e => handleGearItemChange(catIdx, itemIdx, 'desc', e.target.value)}
                          placeholder="Technical detail info..."
                          rows={3}
                          className="w-full px-2.5 py-1.5 bg-zinc-900 border border-white/5 focus:border-[#ccff00] text-white rounded-lg text-xs outline-none resize-none leading-relaxed"
                        />
                      </div>

                    </div>
                  ))}

                  {/* Add Item Button at the bottom of the category block */}
                  {cat.items?.length < 3 ? (
                    <button
                      type="button"
                      onClick={() => addGearItem(catIdx)}
                      className="mt-2 w-full py-2.5 border border-dashed border-white/10 hover:border-[#ccff00]/40 text-slate-500 hover:text-[#ccff00] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer bg-transparent"
                    >
                      + Add Item Card
                    </button>
                  ) : (
                    <div className="text-center text-[8px] text-amber-500/60 uppercase font-black tracking-wider py-2">
                      (Category limit reached: Max 3)
                    </div>
                  )}

                </div>

              </div>
            ))}
          </div>
        </form>
      )}
    </div>
  )
}
