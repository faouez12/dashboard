'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Edit2, FileText, Sparkles, X, BookOpen, Camera } from 'lucide-react'
import { fetchBlogPosts, addOrUpdateBlogPost, deleteBlogPost } from '@/app/admin/actions'
import { useToast } from '../components/ToastProvider'
import ImageUpload from '../components/ImageUpload'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: "race-report" | "gear" | "behind-the-lens"
  categoryLabel: string
  gradient: string
  author: string
  leadParagraph: string
  bodyContent: {
    heading?: string
    paragraphs: string[]
    pullQuote?: string
  }[]
  technicalNotes: {
    camera: string
    lens: string
    exposure: string
    settingReason: string
  }
  created_at: string
  image_url?: string
}

export default function BlogDashboardPage() {
  const toast = useToast()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState<'race-report' | 'gear' | 'behind-the-lens'>('gear')
  const [date, setDate] = useState('')
  const [readTime, setReadTime] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [leadParagraph, setLeadParagraph] = useState('')
  const [author, setAuthor] = useState('Shahine')
  const [gradient, setGradient] = useState('from-teal-900 via-cyan-950 to-zinc-900')
  const [imageUrl, setImageUrl] = useState('')

  // Block 1 content
  const [block1Heading, setBlock1Heading] = useState('')
  const [block1Para1, setBlock1Para1] = useState('')
  const [block1Para2, setBlock1Para2] = useState('')
  const [block1Quote, setBlock1Quote] = useState('')

  // Block 2 content
  const [block2Heading, setBlock2Heading] = useState('')
  const [block2Para1, setBlock2Para1] = useState('')
  const [block2Para2, setBlock2Para2] = useState('')

  // Tech Notes
  const [techCamera, setTechCamera] = useState('')
  const [techLens, setTechLens] = useState('')
  const [techExposure, setTechExposure] = useState('')
  const [techReason, setTechReason] = useState('')

  const [saving, setSaving] = useState(false)

  const loadPosts = async () => {
    try {
      const data = await fetchBlogPosts()
      setPosts(data as BlogPost[])
    } catch (err) {
      console.error(err)
      toast.error('Load Error', 'Failed to retrieve blog posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setSlug('')
    setCategory('gear')
    setDate('')
    setReadTime('6 min read')
    setExcerpt('')
    setLeadParagraph('')
    setAuthor('Shahine')
    setGradient('from-teal-900 via-cyan-950 to-zinc-900')
    setImageUrl('')

    // Block 1
    setBlock1Heading('Eliminating Rolling Shutter Jello')
    setBlock1Para1('With traditional rolling shutters, the sensor reads data line-by-line...')
    setBlock1Para2('The global shutter reads all megapixels simultaneously, preserving runner stride biomechanics.')
    setBlock1Quote('In elite race photography, precision is not a choice.')

    // Block 2
    setBlock2Heading('Burst Rates and Pre-Capture')
    setBlock2Para1('Autofocus tracking combined with high frames-per-second capability transforms track metrics.')
    setBlock2Para2('By utilizing pre-capture buffers, photographers lock focus and freeze the tape impact with zero error.')

    // Tech
    setTechCamera('Sony Alpha 9 III')
    setTechLens('Sony FE 70-200mm f/2.8 GM II')
    setTechExposure('1/2000s • f/2.8 • ISO 160')
    setTechReason('High shutter speed freezes the runner strides while maintaining low ISO grain.')
  }

  const handleOpenCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post.id)
    setTitle(post.title)
    setSlug(post.slug)
    setCategory(post.category)
    setDate(post.date)
    setReadTime(post.readTime)
    setExcerpt(post.excerpt)
    setLeadParagraph(post.leadParagraph)
    setAuthor(post.author)
    setGradient(post.gradient)
    setImageUrl(post.image_url || '')

    // Load body content sections
    const block1 = post.bodyContent?.[0]
    setBlock1Heading(block1?.heading || '')
    setBlock1Para1(block1?.paragraphs?.[0] || '')
    setBlock1Para2(block1?.paragraphs?.[1] || '')
    setBlock1Quote(block1?.pullQuote || '')

    const block2 = post.bodyContent?.[1]
    setBlock2Heading(block2?.heading || '')
    setBlock2Para1(block2?.paragraphs?.[0] || '')
    setBlock2Para2(block2?.paragraphs?.[1] || '')

    // Load Tech Notes
    setTechCamera(post.technicalNotes?.camera || '')
    setTechLens(post.technicalNotes?.lens || '')
    setTechExposure(post.technicalNotes?.exposure || '')
    setTechReason(post.technicalNotes?.settingReason || '')

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

    // Construct bodyContent sections
    const bodyContent = [
      {
        heading: block1Heading,
        paragraphs: [block1Para1, block1Para2].filter(p => p !== ''),
        pullQuote: block1Quote || undefined
      },
      {
        heading: block2Heading,
        paragraphs: [block2Para1, block2Para2].filter(p => p !== '')
      }
    ].filter(section => section.heading !== '' || section.paragraphs.length > 0)

    const categoryLabels = {
      'gear': 'Gear Review',
      'race-report': 'Race Report',
      'behind-the-lens': 'Behind the Lens'
    }

    try {
      await addOrUpdateBlogPost({
        title,
        slug,
        category,
        categoryLabel: categoryLabels[category],
        date,
        readTime,
        excerpt,
        leadParagraph,
        author,
        gradient,
        image_url: imageUrl,
        bodyContent,
        technicalNotes: {
          camera: techCamera,
          lens: techLens,
          exposure: techExposure,
          settingReason: techReason
        }
      }, editingId || undefined)

      toast.success(
        editingId ? 'Article Updated' : 'Article Published',
        `Successfully saved "${title}" to your endurance logs.`
      )
      setShowModal(false)
      loadPosts()
    } catch (err: any) {
      console.error(err)
      toast.error('Publishing Error', err.message || 'Failed to save blog post.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Purge article "${name}" from publications database?`)) {
      try {
        await deleteBlogPost(id)
        toast.success('Article Removed', `Successfully deleted "${name}" from publication list.`)
        loadPosts()
      } catch (err) {
        console.error(err)
        toast.error('Deletion Failure', 'Failed to remove blog post record.')
      }
    }
  }

  const categoryGradients = {
    'gear': 'from-teal-900 via-cyan-950 to-zinc-900',
    'race-report': 'from-teal-900/40 via-cyan-950 to-slate-900',
    'behind-the-lens': 'from-rose-900/40 via-teal-950 to-slate-900'
  }

  const handleCategoryChange = (cat: 'gear' | 'race-report' | 'behind-the-lens') => {
    setCategory(cat)
    setGradient(categoryGradients[cat])
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 w-full animate-pulse text-slate-400">
        <div className="h-10 w-64 bg-white/5 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <FileText className="text-[#ccff00]" size={28} />
            Endurance Journal Blog
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-2">
            Write and publish tutorials, gear reports, and race day commentary.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3.5 bg-[#ccff00] hover:bg-[#ccff00]/95 text-black font-black italic uppercase tracking-wider text-xs rounded-xl transition-all shadow-xl shadow-[#ccff00]/10 hover:shadow-[#ccff00]/25 flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Create Blog Post
        </button>
      </div>

      {/* Grid of Items */}
      {posts.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl text-slate-600 font-mono uppercase tracking-widest text-xs">
          No blog posts found. Write your first article today.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <div
              key={post.id}
              className="group bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden hover:border-[#ccff00]/30 transition-all flex flex-col justify-between p-6 h-[19rem]"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  <span className="text-[#ccff00]">{post.categoryLabel}</span>
                  <span>{post.date} • {post.readTime}</span>
                </div>
                <div className="flex gap-4 mt-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight truncate group-hover:text-[#ccff00] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-20 h-20 rounded-xl object-cover border border-white/5 shrink-0 self-start"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                <span className="text-[10px] font-bold text-slate-600 uppercase font-mono tracking-widest">
                  Author: {post.author}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/dashboard/builder/blog/${post.id}`}
                    className="p-2 hover:bg-[#ccff00]/10 text-slate-400 hover:text-[#ccff00] rounded-lg transition-colors"
                    title="Edit Visual Layout"
                  >
                    <Sparkles size={14} />
                  </Link>
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="p-2 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Edit Post"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-2 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 size={14} />
                  </button>
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
                {editingId ? 'Edit Article Node' : 'Compose New Article'}
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
                <h4 className="text-[10px] font-black text-[#ccff00] tracking-widest uppercase">1. Publication Dossier</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => handleTitleChange(e.target.value)}
                      placeholder="Sony A9 III Review"
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
                      placeholder="sony-a9-iii-review"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-slate-500 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Category</label>
                    <select
                      value={category}
                      onChange={e => handleCategoryChange(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none cursor-pointer"
                    >
                      <option value="gear">Gear Review</option>
                      <option value="race-report">Race Report</option>
                      <option value="behind-the-lens">Behind the Lens</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Publish Date</label>
                    <input
                      type="text"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      placeholder="e.g. May 12, 2026"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Read Duration</label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={e => setReadTime(e.target.value)}
                      placeholder="e.g. 6 min read"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Author Node</label>
                    <input
                      type="text"
                      value={author}
                      onChange={e => setAuthor(e.target.value)}
                      placeholder="Shahine"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Short Excerpt (Grid Card summary)</label>
                  <textarea
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    placeholder="Provide a 2-sentence summary of what this article targets..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Article Cover Image</label>
                  <ImageUpload
                    onImageUploaded={url => setImageUrl(url)}
                    currentImage={imageUrl}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Lead Introductory Paragraph (Large font detail header)</label>
                  <textarea
                    value={leadParagraph}
                    onChange={e => setLeadParagraph(e.target.value)}
                    placeholder="Enter the primary introductory hooks..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Row 2: Structured Content blocks */}
              <div className="bg-zinc-950/25 p-5 rounded-2xl border border-white/5 space-y-6">
                <h4 className="text-[10px] font-black text-[#ccff00] tracking-widest uppercase">2. Article Content Columns</h4>

                {/* Block 1 */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-[#ccff00] uppercase tracking-widest block">Column Section 01</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={block1Heading}
                      onChange={e => setBlock1Heading(e.target.value)}
                      placeholder="Heading (e.g. Eliminating Rolling Shutter)"
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea
                      value={block1Para1}
                      onChange={e => setBlock1Para1(e.target.value)}
                      placeholder="Paragraph 1 Text..."
                      rows={3}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-normal"
                    />
                    <textarea
                      value={block1Para2}
                      onChange={e => setBlock1Para2(e.target.value)}
                      placeholder="Paragraph 2 Text..."
                      rows={3}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-normal"
                    />
                  </div>
                  <input
                    type="text"
                    value={block1Quote}
                    onChange={e => setBlock1Quote(e.target.value)}
                    placeholder="Pull Quote Overlay Highlight (Optional)"
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-xs outline-none"
                  />
                </div>

                {/* Block 2 */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-[#ccff00] uppercase tracking-widest block">Column Section 02</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={block2Heading}
                      onChange={e => setBlock2Heading(e.target.value)}
                      placeholder="Heading (e.g. Continuous Burst Limits)"
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea
                      value={block2Para1}
                      onChange={e => setBlock2Para1(e.target.value)}
                      placeholder="Paragraph 1 Text..."
                      rows={3}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-normal"
                    />
                    <textarea
                      value={block2Para2}
                      onChange={e => setBlock2Para2(e.target.value)}
                      placeholder="Paragraph 2 Text..."
                      rows={3}
                      className="w-full px-3 py-2.5 bg-zinc-950 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Technical notes */}
              <div className="bg-zinc-950/25 p-5 rounded-2xl border border-white/5 space-y-6">
                <h4 className="text-[10px] font-black text-[#ccff00] tracking-widest uppercase">3. Technical Capture Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Camera Gear</label>
                    <input
                      type="text"
                      value={techCamera}
                      onChange={e => setTechCamera(e.target.value)}
                      placeholder="Sony Alpha 9 III"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Lens Focal Profile</label>
                    <input
                      type="text"
                      value={techLens}
                      onChange={e => setTechLens(e.target.value)}
                      placeholder="Sony FE FE 70-200mm"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Exposure specs</label>
                    <input
                      type="text"
                      value={techExposure}
                      onChange={e => setTechExposure(e.target.value)}
                      placeholder="1/2000s • f/2.8 • ISO 160"
                      className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono">Field Rationale & Settings Reasoning</label>
                  <textarea
                    value={techReason}
                    onChange={e => setTechReason(e.target.value)}
                    placeholder="e.g. Exposure limit frozen strides while keeping low ISO..."
                    rows={2}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-white/5 text-white rounded-lg text-xs outline-none resize-none leading-relaxed"
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
                  {saving ? 'Saving Article...' : 'Publish Article Node'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
