'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, ImageIcon, Sparkles, X, Upload } from 'lucide-react'
import { fetchGalleryItems, addOrUpdateGalleryItem, deleteGalleryItem } from '@/app/admin/actions'
import { useToast } from '../components/ToastProvider'
import Image from 'next/image'

interface GalleryItem {
  id: string
  title: string
  category: "road" | "trail" | "brand" | "action"
  location: string
  specs: string
  image_url: string
  gradient: string
  description: string
  year: string
  created_at: string
}

export default function GalleryDashboardPage() {
  const toast = useToast()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form states
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'road' | 'trail' | 'brand' | 'action'>('road')
  const [location, setLocation] = useState('')
  const [specs, setSpecs] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [year, setYear] = useState('2026')
  const [gradient, setGradient] = useState('from-blue-900/60 to-slate-900')

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const loadItems = async () => {
    try {
      const data = await fetchGalleryItems()
      setItems(data as GalleryItem[])
    } catch (err) {
      console.error(err)
      toast.error('Load Error', 'Failed to retrieve media items.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setCategory('road')
    setLocation('')
    setSpecs('85mm • f/2.0 • 1/2000s • ISO 100')
    setImageUrl('')
    setDescription('')
    setYear('2026')
    setGradient('from-blue-900/60 to-slate-900')
  }

  const handleOpenCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingId(item.id)
    setTitle(item.title)
    setCategory(item.category)
    setLocation(item.location)
    setSpecs(item.specs)
    setImageUrl(item.image_url)
    setDescription(item.description)
    setYear(item.year)
    setGradient(item.gradient)
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      toast.warning('Validation Check', 'Please enter a title.')
      return
    }

    setSaving(true)
    try {
      await addOrUpdateGalleryItem({
        title,
        category,
        location,
        specs,
        image_url: imageUrl,
        gradient,
        description,
        year
      }, editingId || undefined)

      toast.success(
        editingId ? 'Shot Updated' : 'Shot Added',
        `Successfully published "${title}" dossier in media archive.`
      )
      setShowModal(false)
      loadItems()
    } catch (err: any) {
      console.error(err)
      toast.error('Publishing Error', err.message || 'Failed to save dossier record.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Purge "${name}" shot dossier permanently from system?`)) {
      try {
        await deleteGalleryItem(id)
        toast.success('Dossier Deleted', `Dossier "${name}" has been removed from media archive.`)
        loadItems()
      } catch (err) {
        console.error(err)
        toast.error('Deletion Failure', 'Failed to remove shot dossier record.')
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (response.ok && data.url) {
        setImageUrl(data.url)
        toast.success('Upload Confirmed', 'Image uploaded successfully to R2 bucket.')
      } else {
        toast.error('Upload Failed', data.error || 'Server rejected file.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network Error', 'Connection failed during upload.')
    } finally {
      setUploading(false)
    }
  }

  const categoryGradients = {
    road: 'from-blue-900/60 to-slate-900',
    trail: 'from-teal-900/60 to-slate-900',
    brand: 'from-purple-900/60 to-slate-900',
    action: 'from-rose-900/60 to-slate-900'
  }

  const handleCategoryChange = (cat: 'road' | 'trail' | 'brand' | 'action') => {
    setCategory(cat)
    setGradient(categoryGradients[cat])
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 w-full animate-pulse text-slate-400">
        <div className="h-10 w-64 bg-white/5 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
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
            <ImageIcon className="text-[#ccff00]" size={28} />
            Media Shot Archive
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
            Manage your high-resolution event and commercial catalog.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3.5 bg-[#ccff00] hover:bg-[#ccff00]/95 text-black font-black italic uppercase tracking-wider text-xs rounded-xl transition-all shadow-xl shadow-[#ccff00]/10 hover:shadow-[#ccff00]/25 flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Create Shot Dossier
        </button>
      </div>

      {/* Grid of Items */}
      {items.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl text-slate-600 font-mono uppercase tracking-widest text-xs">
          No shot records recovered. Create your first dossier record.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="group bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden hover:border-[#ccff00]/30 transition-all flex flex-col h-96"
            >
              {/* Image box */}
              <div className="h-48 relative overflow-hidden bg-zinc-900 border-b border-white/5 flex items-center justify-center">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-tr ${item.gradient} flex items-center justify-center opacity-30`}>
                    <ImageIcon size={32} className="text-slate-600 animate-pulse" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 border border-white/10 rounded font-mono text-[9px] font-bold text-white uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 border border-white/10 rounded font-mono text-[9px] font-bold text-slate-400">
                  {item.year}
                </span>
              </div>

              {/* Info body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#ccff00] uppercase tracking-widest block">
                    {item.location}
                  </span>
                  <h3 className="text-base font-black text-white uppercase tracking-tight truncate mt-1 group-hover:text-[#ccff00] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <span className="text-[8px] font-mono text-slate-500 uppercase truncate max-w-[120px]">
                    {item.specs}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Edit Node"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="Purge Node"
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
          <div className="relative w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black max-h-[90vh] flex flex-col animate-slide-in-right">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-zinc-950/30">
              <h3 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-[#ccff00]" />
                {editingId ? 'Edit Shot Dossier' : 'Create New Shot Record'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono block">
                    Shot Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Summit Ridge Line"
                    className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono block">
                    Category Selection
                  </label>
                  <select
                    value={category}
                    onChange={e => handleCategoryChange(e.target.value as any)}
                    className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors cursor-pointer"
                  >
                    <option value="road">Road Marathon</option>
                    <option value="trail">Trail / Mountain</option>
                    <option value="brand">Brand Campaigns</option>
                    <option value="action">Peak Action</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono block">
                    Location Context
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. UTMB Chamonix"
                    className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors"
                  />
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono block">
                    Capture Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    placeholder="e.g. 2025"
                    className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono block">
                  Camera Specs (EXIF Data)
                </label>
                <input
                  type="text"
                  value={specs}
                  onChange={e => setSpecs(e.target.value)}
                  placeholder="e.g. 400mm • f/2.8 • 1/1600s • ISO 200"
                  className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors"
                />
              </div>

              {/* R2 Image Upload */}
              <div className="space-y-3 bg-zinc-950/45 p-5 rounded-2xl border border-white/5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#ccff00] font-mono block">
                  Cloudflare R2 Image Asset
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Preview thumbnail */}
                  {imageUrl ? (
                    <div className="w-20 h-20 relative bg-zinc-900 border border-white/10 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={imageUrl} alt="R2 Uploaded" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 flex-shrink-0">
                      <ImageIcon size={22} />
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://pub-xxxxxx.r2.dev/visuals/file.jpg"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-[10px] outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <label className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider text-[9px] rounded-lg cursor-pointer transition-colors relative flex items-center gap-1.5">
                        <Upload size={12} />
                        {uploading ? 'Streaming...' : 'Upload File'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="px-4 py-2 bg-red-950/10 hover:bg-red-950/30 border border-red-500/10 text-red-400 font-bold uppercase tracking-wider text-[9px] rounded-lg transition-colors cursor-pointer"
                        >
                          Clear URL
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono block">
                  Artistic Description & Narrative
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Artistic composition rationale..."
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-950/60 border border-white/5 focus:border-[#ccff00] text-white rounded-xl text-xs outline-none transition-colors resize-none leading-relaxed"
                />
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
                  {saving ? 'Publishing Dossier...' : 'Publish Dossier Record'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
