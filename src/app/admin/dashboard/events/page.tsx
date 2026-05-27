'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Edit2, ClipboardList, Sparkles, X, Upload, Camera } from 'lucide-react'
import { fetchEvents, addOrUpdateEvent, deleteEvent } from '@/app/admin/actions'
import { useToast } from '../components/ToastProvider'
import Image from 'next/image'

interface RaceEventGalleryItem {
  id: number
  title: string
  category: "start" | "grit" | "finish" | "details"
  specs: string
  gradient: string
  description: string
  image_url?: string
}

interface RaceEvent {
  id: string
  slug: string
  title: string
  location: string
  date: string
  type: "marathon" | "trail" | "cycling"
  runners: string
  gradient: string
  desc: string
  highlight: string
  weather: string
  gearUsed: string
  intro: string
  technicalLog: string
  gallery: RaceEventGalleryItem[]
  created_at: string
  image_url?: string
  featured_in_navbar?: boolean
  featured_on_homepage?: boolean
}

export default function EventsDashboardPage() {
  const toast = useToast()
  const [events, setEvents] = useState<RaceEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Modal States
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form States
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<'marathon' | 'trail' | 'cycling'>('marathon')
  const [runners, setRunners] = useState('')
  const [gradient, setGradient] = useState('from-blue-950 via-zinc-950 to-zinc-900')
  const [desc, setDesc] = useState('')
  const [highlight, setHighlight] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [featuredInNavbar, setFeaturedInNavbar] = useState(false)
  const [featuredOnHomepage, setFeaturedOnHomepage] = useState(false)
  
  // Detail Form States
  const [weather, setWeather] = useState('')
  const [gearUsed, setGearUsed] = useState('')
  const [intro, setIntro] = useState('')
  const [technicalLog, setTechnicalLog] = useState('')

  // Timeline Gallery State (Fixed 4 checkpoints)
  const [timelineStartTitle, setTimelineStartTitle] = useState('')
  const [timelineStartSpecs, setTimelineStartSpecs] = useState('')
  const [timelineStartDesc, setTimelineStartDesc] = useState('')
  const [timelineStartImg, setTimelineStartImg] = useState('')

  const [timelineGritTitle, setTimelineGritTitle] = useState('')
  const [timelineGritSpecs, setTimelineGritSpecs] = useState('')
  const [timelineGritDesc, setTimelineGritDesc] = useState('')
  const [timelineGritImg, setTimelineGritImg] = useState('')

  const [timelineFinishTitle, setTimelineFinishTitle] = useState('')
  const [timelineFinishSpecs, setTimelineFinishSpecs] = useState('')
  const [timelineFinishDesc, setTimelineFinishDesc] = useState('')
  const [timelineFinishImg, setTimelineFinishImg] = useState('')

  const [timelineDetailsTitle, setTimelineDetailsTitle] = useState('')
  const [timelineDetailsSpecs, setTimelineDetailsSpecs] = useState('')
  const [timelineDetailsDesc, setTimelineDetailsDesc] = useState('')
  const [timelineDetailsImg, setTimelineDetailsImg] = useState('')

  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  const loadEvents = async () => {
    try {
      const data = await fetchEvents()
      setEvents(data as RaceEvent[])
    } catch (err) {
      console.error(err)
      toast.error('Load Error', 'Failed to retrieve race logs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setSlug('')
    setLocation('')
    setDate('')
    setType('marathon')
    setRunners('30,000+ Runners')
    setGradient('from-blue-950 via-zinc-950 to-zinc-900')
    setDesc('')
    setHighlight('')
    setWeather('Cool, 12°C, Overcast')
    setGearUsed('Sony A9 III + 70-200mm f/2.8 GM II')
    setIntro('')
    setTechnicalLog('')
    setImageUrl('')
    setFeaturedInNavbar(false)
    setFeaturedOnHomepage(false)

    // Reset timeline items
    setTimelineStartTitle('The Preamble')
    setTimelineStartSpecs('70mm • f/2.8 • 1/500s')
    setTimelineStartDesc('Corral packing in Hopkinton as final gear adjustments are made in the cool morning air.')
    setTimelineStartImg('')

    setTimelineGritTitle('Heartbreak Climb')
    setTimelineGritSpecs('200mm • f/2.8 • 1/1600s')
    setTimelineGritDesc('Mid-race grit as runners battle the infamous incline, faces etched with effort.')
    setTimelineGritImg('')

    setTimelineFinishTitle('Boylston Scream')
    setTimelineFinishSpecs('135mm • f/2.0 • 1/2000s')
    setTimelineFinishDesc('Finisher crossing the line with arms raised in victory, crowd out of focus in the background.')
    setTimelineFinishImg('')

    setTimelineDetailsTitle('Medals of honor')
    setTimelineDetailsSpecs('50mm Macro • f/3.2 • 1/500s')
    setTimelineDetailsDesc('Finisher medals gleaming on the blue ribbons, stacked near the finish line tents.')
    setTimelineDetailsImg('')
  }

  const handleOpenCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleOpenEdit = (evt: RaceEvent) => {
    setEditingId(evt.id)
    setTitle(evt.title)
    setSlug(evt.slug)
    setLocation(evt.location)
    setDate(evt.date)
    setType(evt.type)
    setRunners(evt.runners)
    setGradient(evt.gradient)
    setDesc(evt.desc)
    setHighlight(evt.highlight)
    setWeather(evt.weather)
    setGearUsed(evt.gearUsed)
    setIntro(evt.intro)
    setTechnicalLog(evt.technicalLog)
    setImageUrl(evt.image_url || '')
    setFeaturedInNavbar(!!evt.featured_in_navbar)
    setFeaturedOnHomepage(!!evt.featured_on_homepage)

    // Load timeline (with fallbacks if empty)
    const tStart = evt.gallery?.find(g => g.category === 'start')
    setTimelineStartTitle(tStart?.title || 'The Preamble')
    setTimelineStartSpecs(tStart?.specs || '70mm • f/2.8 • 1/500s')
    setTimelineStartDesc(tStart?.description || '')
    setTimelineStartImg(tStart?.image_url || '')

    const tGrit = evt.gallery?.find(g => g.category === 'grit')
    setTimelineGritTitle(tGrit?.title || 'Heartbreak Climb')
    setTimelineGritSpecs(tGrit?.specs || '200mm • f/2.8 • 1/1600s')
    setTimelineGritDesc(tGrit?.description || '')
    setTimelineGritImg(tGrit?.image_url || '')

    const tFinish = evt.gallery?.find(g => g.category === 'finish')
    setTimelineFinishTitle(tFinish?.title || 'Boylston Scream')
    setTimelineFinishSpecs(tFinish?.specs || '135mm • f/2.0 • 1/2000s')
    setTimelineFinishDesc(tFinish?.description || '')
    setTimelineFinishImg(tFinish?.image_url || '')

    const tDetails = evt.gallery?.find(g => g.category === 'details')
    setTimelineDetailsTitle(tDetails?.title || 'Medals of honor')
    setTimelineDetailsSpecs(tDetails?.specs || '50mm Macro • f/3.2 • 1/500s')
    setTimelineDetailsDesc(tDetails?.description || '')
    setTimelineDetailsImg(tDetails?.image_url || '')

    setShowModal(true)
  }

  const handleTitleChange = (val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug) {
      toast.warning('Validation Checked', 'Title and slug are mandatory.')
      return
    }

    setSaving(true)

    // Construct the timeline array
    const timelineGallery: RaceEventGalleryItem[] = [
      {
        id: 101,
        title: timelineStartTitle,
        category: 'start',
        specs: timelineStartSpecs,
        gradient: 'from-amber-900/60 to-zinc-900',
        description: timelineStartDesc,
        image_url: timelineStartImg
      },
      {
        id: 102,
        title: timelineGritTitle,
        category: 'grit',
        specs: timelineGritSpecs,
        gradient: 'from-orange-900/60 to-zinc-900',
        description: timelineGritDesc,
        image_url: timelineGritImg
      },
      {
        id: 103,
        title: timelineFinishTitle,
        category: 'finish',
        specs: timelineFinishSpecs,
        gradient: 'from-red-900/60 to-zinc-900',
        description: timelineFinishDesc,
        image_url: timelineFinishImg
      },
      {
        id: 104,
        title: timelineDetailsTitle,
        category: 'details',
        specs: timelineDetailsSpecs,
        gradient: 'from-stone-900/60 to-zinc-900',
        description: timelineDetailsDesc,
        image_url: timelineDetailsImg
      }
    ]

    try {
      await addOrUpdateEvent({
        title,
        slug,
        location,
        date,
        type,
        runners,
        gradient,
        desc,
        highlight,
        weather,
        gearUsed,
        intro,
        technicalLog,
        gallery: timelineGallery,
        image_url: imageUrl,
        featured_in_navbar: featuredInNavbar,
        featured_on_homepage: featuredOnHomepage
      }, editingId || undefined)

      toast.success(
        editingId ? 'Event Updated' : 'Event Created',
        `Successfully published "${title}" in race logs.`
      )
      setShowModal(false)
      loadEvents()
    } catch (err: any) {
      console.error(err)
      toast.error('Publishing Error', err.message || 'Failed to save event record.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete case study event "${name}" permanently?`)) {
      try {
        await deleteEvent(id)
        toast.success('Event Deleted', `Successfully removed "${name}" from archives.`)
        loadEvents()
      } catch (err) {
        console.error(err)
        toast.error('Deletion Failure', 'Failed to remove event record.')
      }
    }
  }

  const handleUploadField = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(field)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (response.ok && data.url) {
        if (field === 'start') setTimelineStartImg(data.url)
        else if (field === 'grit') setTimelineGritImg(data.url)
        else if (field === 'finish') setTimelineFinishImg(data.url)
        else if (field === 'details') setTimelineDetailsImg(data.url)
        else if (field === 'cover') setImageUrl(data.url)
        toast.success('Uploaded successfully', 'Timeline frame saved.')
      } else {
        toast.error('Upload failed', data.error || 'Server error.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Upload error', 'Network error.')
    } finally {
      setUploadingField(null)
    }
  }

  const typeGradients = {
    marathon: 'from-blue-950 via-zinc-950 to-zinc-900',
    trail: 'from-teal-950 via-zinc-950 to-zinc-900',
    cycling: 'from-sky-950 via-zinc-950 to-zinc-900'
  }

  const handleTypeChange = (val: 'marathon' | 'trail' | 'cycling') => {
    setType(val)
    setGradient(typeGradients[val])
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 w-full animate-pulse text-slate-400">
        <div className="h-10 w-64 bg-white/5 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 w-full text-slate-300 relative">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase text-white tracking-tight flex items-center gap-3">
            <ClipboardList className="text-[#ccff00]" size={28} />
            Race Event Logs
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
            Add and manage your case studies and chronological event portfolios.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3.5 bg-[#ccff00] hover:bg-[#ccff00]/95 text-black font-black italic uppercase tracking-wider text-xs rounded-xl transition-all shadow-xl shadow-[#ccff00]/10 hover:shadow-[#ccff00]/25 flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Create Event Record
        </button>
      </div>

      {/* Grid of Items */}
      {events.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl text-slate-600 font-mono uppercase tracking-widest text-xs">
          No race events registered. Create your first case study.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(evt => (
            <div
              key={evt.id}
              className="group bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden hover:border-[#ccff00]/30 transition-all flex flex-col h-[28rem]"
            >
              {/* Simulated banner gradient */}
              <div className={`h-40 bg-gradient-to-tr ${evt.gradient} flex items-center justify-center p-6 relative border-b border-white/5`}>
                <Camera size={36} className="text-white/10 group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 px-2 py-0.5 bg-black/60 border border-white/10 rounded font-mono text-[9px] font-bold text-white uppercase tracking-wider">
                  {evt.type}
                </span>
                <span className="absolute bottom-4 left-4 px-2.5 py-1 bg-black/70 border border-white/10 rounded font-mono text-[9px] text-[#ccff00] font-black uppercase tracking-widest">
                  {evt.highlight || 'Featured study'}
                </span>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                    {evt.location} • {evt.date}
                  </span>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight truncate mt-1 group-hover:text-[#ccff00] transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-3 leading-relaxed">
                    {evt.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                    {evt.runners}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/dashboard/builder/event/${evt.id}`}
                      className="p-2 hover:bg-[#ccff00]/10 text-slate-400 hover:text-[#ccff00] rounded-lg transition-colors"
                      title="Edit Visual Layout"
                    >
                      <Sparkles size={14} />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Edit Event"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.id, evt.title)}
                      className="p-2 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-out/Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="relative w-full max-w-4xl bg-[#1A1A1A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black max-h-[90vh] flex flex-col animate-slide-in-right">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-zinc-950/30">
              <h3 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-[#ccff00]" />
                {editingId ? 'Edit Race Event Log' : 'Create New Race Event'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* Row 1: Core Fields */}
              <div className="bg-zinc-950/25 p-5 rounded-2xl border border-white/5 space-y-6">
                <h4 className="text-[10px] font-black text-[#ccff00] tracking-widest uppercase">1. Core Metadata</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => handleTitleChange(e.target.value)}
                      placeholder="e.g. Boston Marathon"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none focus:border-[#ccff00]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Slug</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={e => setSlug(e.target.value)}
                      placeholder="e.g. boston-marathon"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-slate-500 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Type</label>
                    <select
                      value={type}
                      onChange={e => handleTypeChange(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none cursor-pointer"
                    >
                      <option value="marathon">Marathon (Road)</option>
                      <option value="trail">Trail / Mountain</option>
                      <option value="cycling">Cycling / Endurance</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Boston, USA"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Date Text</label>
                    <input
                      type="text"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      placeholder="e.g. April 2026"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Runners Size</label>
                    <input
                      type="text"
                      value={runners}
                      onChange={e => setRunners(e.target.value)}
                      placeholder="e.g. 30,000+ Runners"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Hero Highlight</label>
                    <input
                      type="text"
                      value={highlight}
                      onChange={e => setHighlight(e.target.value)}
                      placeholder="e.g. Finish line stagers"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Brief Summary</label>
                  <textarea
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    placeholder="Short summary for the index bento grid..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Event Cover Image Upload */}
                <div className="space-y-3 bg-zinc-950/45 p-4 rounded-xl border border-white/5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-[#ccff00] font-mono block">
                    Event Cover Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {imageUrl ? (
                      <div className="w-16 h-16 relative bg-zinc-900 border border-white/10 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={imageUrl} alt="Event Cover" className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 flex-shrink-0">
                        <Plus size={18} />
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://pub-xxxxxx.r2.dev/visuals/event.jpg"
                        className="w-full px-3 py-2 bg-zinc-900 border border-white/5 text-white rounded-lg text-[10px] outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider text-[9px] rounded-lg cursor-pointer transition-colors relative flex items-center gap-1">
                          {uploadingField === 'cover' ? 'Streaming...' : 'Upload Cover'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleUploadField(e, 'cover')}
                            disabled={uploadingField === 'cover'}
                            className="hidden"
                          />
                        </label>
                        {imageUrl && (
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="px-3 py-1.5 bg-red-950/10 hover:bg-red-950/30 border border-red-500/10 text-red-400 font-bold uppercase tracking-wider text-[9px] rounded-lg transition-colors cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <label className="flex items-center gap-3 p-3 bg-zinc-900 border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-900/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={featuredInNavbar}
                      onChange={e => setFeaturedInNavbar(e.target.checked)}
                      className="w-4 h-4 accent-[#ccff00] cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-white tracking-wider">Feature in Navbar Dropdown</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Show this card in the main navbar dropdown menu (max 2)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-zinc-900 border border-white/5 rounded-xl cursor-pointer hover:bg-zinc-900/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={featuredOnHomepage}
                      onChange={e => setFeaturedOnHomepage(e.target.checked)}
                      className="w-4 h-4 accent-[#ccff00] cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-white tracking-wider">Feature on Homepage Showcase</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Show this case study in the homepage horizontal slider (max 6)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Row 2: Detail logs */}
              <div className="bg-zinc-950/25 p-5 rounded-2xl border border-white/5 space-y-6">
                <h4 className="text-[10px] font-black text-[#ccff00] tracking-widest uppercase">2. Technical & Narrative Dossier</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Weather Specs</label>
                    <input
                      type="text"
                      value={weather}
                      onChange={e => setWeather(e.target.value)}
                      placeholder="Cool, 12°C, Overcast"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Gear Configured</label>
                    <input
                      type="text"
                      value={gearUsed}
                      onChange={e => setGearUsed(e.target.value)}
                      placeholder="Sony A9 III + 70-200mm f/2.8"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Introduction Paragraph</label>
                  <textarea
                    value={intro}
                    onChange={e => setIntro(e.target.value)}
                    placeholder="First text element rendering in the header details..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Technical Rationale Log</label>
                  <textarea
                    value={technicalLog}
                    onChange={e => setTechnicalLog(e.target.value)}
                    placeholder="Describe lens choices, autofocus modes, shutter speed synchronization sync logic, and R2 pipeline logistics..."
                    rows={3}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Row 3: Timeline Checkpoint items */}
              <div className="bg-zinc-950/25 p-5 rounded-2xl border border-white/5 space-y-6">
                <h4 className="text-[10px] font-black text-[#ccff00] tracking-widest uppercase">3. Timeline Chronological Gallery Frames</h4>

                {/* 1. Start */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block">Frame 1: Start Line Checkpoint</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={timelineStartTitle}
                      onChange={e => setTimelineStartTitle(e.target.value)}
                      placeholder="Title (e.g. The Preamble)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                    />
                    <input
                      type="text"
                      value={timelineStartSpecs}
                      onChange={e => setTimelineStartSpecs(e.target.value)}
                      placeholder="Specs (e.g. 70mm • f/2.8)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={timelineStartImg}
                        onChange={e => setTimelineStartImg(e.target.value)}
                        placeholder="R2 Image URL"
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[9px]"
                      />
                      <label className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider rounded border border-white/10 flex items-center justify-center cursor-pointer shrink-0">
                        {uploadingField === 'start' ? '...' : 'Upload'}
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleUploadField(e, 'start')} />
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={timelineStartDesc}
                    onChange={e => setTimelineStartDesc(e.target.value)}
                    placeholder="Short description detailing composition or backdrop..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                  />
                </div>

                {/* 2. Grit */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block">Frame 2: Grit / Course Checkpoint</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={timelineGritTitle}
                      onChange={e => setTimelineGritTitle(e.target.value)}
                      placeholder="Title (e.g. Heartbreak Climb)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                    />
                    <input
                      type="text"
                      value={timelineGritSpecs}
                      onChange={e => setTimelineGritSpecs(e.target.value)}
                      placeholder="Specs (e.g. 200mm • f/2.8)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={timelineGritImg}
                        onChange={e => setTimelineGritImg(e.target.value)}
                        placeholder="R2 Image URL"
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[9px]"
                      />
                      <label className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider rounded border border-white/10 flex items-center justify-center cursor-pointer shrink-0">
                        {uploadingField === 'grit' ? '...' : 'Upload'}
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleUploadField(e, 'grit')} />
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={timelineGritDesc}
                    onChange={e => setTimelineGritDesc(e.target.value)}
                    placeholder="Short description detailing composition or backdrop..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                  />
                </div>

                {/* 3. Finish */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block">Frame 3: Finish Tape Checkpoint</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={timelineFinishTitle}
                      onChange={e => setTimelineFinishTitle(e.target.value)}
                      placeholder="Title (e.g. Boylston Scream)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                    />
                    <input
                      type="text"
                      value={timelineFinishSpecs}
                      onChange={e => setTimelineFinishSpecs(e.target.value)}
                      placeholder="Specs (e.g. 135mm • f/2.0)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={timelineFinishImg}
                        onChange={e => setTimelineFinishImg(e.target.value)}
                        placeholder="R2 Image URL"
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[9px]"
                      />
                      <label className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider rounded border border-white/10 flex items-center justify-center cursor-pointer shrink-0">
                        {uploadingField === 'finish' ? '...' : 'Upload'}
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleUploadField(e, 'finish')} />
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={timelineFinishDesc}
                    onChange={e => setTimelineFinishDesc(e.target.value)}
                    placeholder="Short description detailing composition or backdrop..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                  />
                </div>

                {/* 4. Details */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Frame 4: Gear & Macro Details Checkpoint</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={timelineDetailsTitle}
                      onChange={e => setTimelineDetailsTitle(e.target.value)}
                      placeholder="Title (e.g. Medals of honor)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                    />
                    <input
                      type="text"
                      value={timelineDetailsSpecs}
                      onChange={e => setTimelineDetailsSpecs(e.target.value)}
                      placeholder="Specs (e.g. 50mm Macro)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={timelineDetailsImg}
                        onChange={e => setTimelineDetailsImg(e.target.value)}
                        placeholder="R2 Image URL"
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[9px]"
                      />
                      <label className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider rounded border border-white/10 flex items-center justify-center cursor-pointer shrink-0">
                        {uploadingField === 'details' ? '...' : 'Upload'}
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleUploadField(e, 'details')} />
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={timelineDetailsDesc}
                    onChange={e => setTimelineDetailsDesc(e.target.value)}
                    placeholder="Short description detailing composition or backdrop..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-[10px]"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-6 bg-zinc-950/10 -mx-6 px-6 -mb-6 pb-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 border border-white/10 hover:bg-white/5 text-slate-300 font-bold uppercase tracking-wider text-[10px] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-[#ccff00] hover:bg-[#ccff00]/95 text-black font-black italic uppercase tracking-wider text-[10px] rounded-xl transition-all shadow-xl shadow-[#ccff00]/5 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Publishing Event...' : 'Publish Event Case Study'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
