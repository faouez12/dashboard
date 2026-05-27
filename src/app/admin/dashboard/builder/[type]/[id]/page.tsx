'use client'

import React, { useEffect, useState, Suspense, use } from 'react'
import { useRouter } from 'next/navigation'
import {
    fetchBlogPostById,
    fetchEventById,
    savePuckData,
    getTemplate,
    fetchSavedDesigns,
    addSavedDesign,
    deleteSavedDesign
} from '@/app/admin/actions'
import { Data } from '@measured/puck'
import '@measured/puck/puck.css'
import config, { PageEditor } from '../../../components/puck-config'
import { useToast } from '../../../components/ToastProvider'
import { ArrowLeft, Sparkles, Layout, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

function EditItemBuilderContent({ paramsPromise }: { paramsPromise: Promise<{ type: string; id: string }> }) {
    const params = use(paramsPromise)
    const type = params.type
    const id = params.id
    
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [item, setItem] = useState<any>(null)
    const [data, setData] = useState<Data>({ content: [], root: { props: {} } })
    const [showChoice, setShowChoice] = useState(true)
    const [presets, setPresets] = useState<any[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Save Preset Modal State
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
    const [presetName, setPresetName] = useState('')
    const [isSavingPreset, setIsSavingPreset] = useState(false)

    // Sync metadata state
    const [title, setTitle] = useState('')

    const loadPresets = async () => {
        try {
            const list = await fetchSavedDesigns(type)
            setPresets(list)
        } catch (err) {
            console.error('Failed to load presets:', err)
        }
    }

    useEffect(() => {
        if (id && type) {
            loadItem(type, id)
        }
    }, [id, type])

    const loadItem = async (itemType: string, itemId: string) => {
        try {
            let result: any = null
            if (itemType === 'blog') {
                result = await fetchBlogPostById(itemId)
            } else if (itemType === 'event') {
                result = await fetchEventById(itemId)
            }

            if (result) {
                setItem(result)
                setTitle(result.title)

                try {
                    const parsedContent = typeof result.puck_data === 'string'
                        ? JSON.parse(result.puck_data)
                        : result.puck_data

                    if (parsedContent && (parsedContent.content || parsedContent.root)) {
                        setData(parsedContent)
                    }
                } catch (error) {
                    console.error('Error parsing puck content:', error)
                }
                
                await loadPresets()
            } else {
                toast.error('Not Found', 'The requested record matrix was not found.')
            }
        } catch (error) {
            console.error('Error loading item:', error)
            toast.error('Loading Error', 'Unable to retrieve matrix data.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async (newData: Data) => {
        if (!id || !type) return
        setIsSaving(true)

        try {
            await savePuckData(type as 'blog' | 'event', id, newData)
            toast.success('Matrix Restructured', 'Visual layout content successfully synced.')
        } catch (error) {
            console.error('Error saving page:', error)
            toast.error('Sync Failed', 'Unable to save the visual layout.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleChooseTemplate = async () => {
        try {
            const template = await getTemplate(`${type}-default`)
            const initialData = template && (template.content || template.root)
                ? template
                : { content: [], root: { props: { title } } }
            
            setData(initialData)
            await savePuckData(type as 'blog' | 'event', id, initialData)
            toast.success('Template Loaded', `Initialized with master ${type} blueprint.`)
        } catch (err) {
            console.error(err)
            const emptyData = { content: [], root: { props: { title } } }
            setData(emptyData)
            await savePuckData(type as 'blog' | 'event', id, emptyData)
        } finally {
            setShowChoice(false)
        }
    }

    const handleChooseScratch = async () => {
        const emptyData = { content: [], root: { props: { title } } }
        setData(emptyData)
        try {
            await savePuckData(type as 'blog' | 'event', id, emptyData)
            toast.info('Blank Matrix', 'Initialized from scratch.')
        } catch (err) {
            console.error(err)
        } finally {
            setShowChoice(false)
        }
    }

    const handleLoadPreset = async (preset: any) => {
        try {
            setData(preset.content)
            await savePuckData(type as 'blog' | 'event', id, preset.content)
            toast.success('Preset Loaded', `Loaded visual preset "${preset.name}".`)
        } catch (err) {
            console.error('Failed to load preset:', err)
            toast.error('Load Failure', 'Could not restore preset layout.')
        } finally {
            setShowChoice(false)
        }
    }

    const handleDeletePreset = async (presetId: string) => {
        if (!confirm('Are you sure you want to delete this visual design preset?')) return
        try {
            await deleteSavedDesign(presetId)
            toast.success('Preset Deleted', 'Layout preset successfully removed.')
            await loadPresets()
        } catch (err) {
            console.error('Failed to delete preset:', err)
            toast.error('Deletion Failure', 'Could not remove layout preset.')
        }
    }

    const handleSavePresetSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!presetName.trim()) return
        setIsSavingPreset(true)
        try {
            await addSavedDesign(type, presetName, data)
            toast.success('Preset Saved', `Layout configuration saved as "${presetName}".`)
            setIsSaveModalOpen(false)
            setPresetName('')
            await loadPresets()
        } catch (err) {
            console.error('Failed to save preset:', err)
            toast.error('Save Failure', 'Unable to create layout preset.')
        } finally {
            setIsSavingPreset(false)
        }
    }

    if (!mounted || isLoading) {
        return <div className="h-screen bg-zinc-950 flex items-center justify-center text-white font-mono text-xs uppercase tracking-[0.5em] italic">Initializing_Matrix_Stream...</div>
    }

    const backUrl = type === 'blog' ? '/admin/dashboard/blog' : '/admin/dashboard/events'
    const hasActiveLayout = data && data.content && data.content.length > 0

    if (showChoice) {
        const typeColor = type === 'blog' ? 'text-teal-400 border-teal-500/20 bg-teal-500/5' : 'text-blue-400 border-blue-500/20 bg-blue-500/5'
        const typeBorderHover = type === 'blog' ? 'hover:border-teal-400 hover:bg-zinc-900/70' : 'hover:border-blue-400 hover:bg-zinc-900/70'
        const typeIconColor = type === 'blog' ? 'text-teal-400' : 'text-blue-400'
        const typeIconHoverBg = type === 'blog' ? 'group-hover:bg-teal-500 group-hover:text-black' : 'group-hover:bg-blue-500 group-hover:text-white'
        const typeTextHighlight = type === 'blog' ? 'group-hover:text-teal-400' : 'group-hover:text-blue-400'
        
        return (
            <div className="min-h-screen bg-[#070708] text-slate-300 font-sans p-8 overflow-y-auto relative z-20 -m-8">
                <div className="max-w-6xl mx-auto flex flex-col gap-10 py-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800/85 pb-6 gap-4">
                        <div>
                            <h2 className="text-3xl font-black uppercase text-white tracking-tight flex items-center gap-3">
                                <Sparkles className="text-[#ccff00]" size={28} />
                                Visual Layout Selector
                            </h2>
                            <p className="text-xs text-slate-500 font-mono font-bold uppercase tracking-widest mt-2 flex items-center gap-2 flex-wrap">
                                Choose configuration method for: 
                                <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-black uppercase font-mono tracking-widest ${typeColor}`}>
                                    {type}
                                </span>
                            </p>
                        </div>
                        <Link
                            href={backUrl}
                            className="flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 rounded-xl text-xs font-mono tracking-widest uppercase transition-all duration-300 text-slate-400 hover:text-white"
                        >
                            <ArrowLeft size={14} /> Cancel & Exit
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Standard Options */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#ccff00] font-mono">
                                Standard Blueprints
                            </h3>

                            {/* Option 1: Continue */}
                            <button
                                onClick={() => setShowChoice(false)}
                                className={`group p-6 rounded-2xl bg-zinc-900/40 border text-left flex flex-col justify-between transition-all duration-300 ${
                                    hasActiveLayout
                                        ? `border-zinc-800 ${typeBorderHover} cursor-pointer`
                                        : 'border-zinc-800/10 opacity-30 cursor-not-allowed'
                                }`}
                                disabled={!hasActiveLayout}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl border ${hasActiveLayout ? `bg-zinc-800 ${typeIconColor} border-zinc-700` : 'bg-zinc-800 text-zinc-600 border-zinc-700'}`}>
                                        <Layout size={20} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-black text-white uppercase italic tracking-wider ${typeTextHighlight} transition-colors`}>
                                            Continue with Active Layout_
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                            Keep editing the current visual blueprint for this {type}.
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Option 2: Blueprint */}
                            <button
                                onClick={handleChooseTemplate}
                                className={`group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 ${typeBorderHover} text-left flex flex-col justify-between transition-all duration-300 cursor-pointer`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl bg-zinc-800 ${typeIconColor} border border-zinc-800 ${typeIconHoverBg} transition-colors`}>
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-black text-white uppercase italic tracking-wider ${typeTextHighlight} transition-colors`}>
                                            Use Master Blueprint_
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                            Reset layout and load from standard master {type} blueprint.
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Option 3: Scratch */}
                            <button
                                onClick={handleChooseScratch}
                                className={`group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 ${typeBorderHover} text-left flex flex-col justify-between transition-all duration-300 cursor-pointer`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-zinc-800 text-slate-400 border border-zinc-800 group-hover:bg-white group-hover:text-black transition-colors">
                                        <Layout size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase italic tracking-wider group-hover:text-white transition-colors">
                                            Start From Scratch_
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                            Wipe elements completely to construct a layout from blank.
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Presets Grid */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">
                                    Saved Layout Presets ({presets.length})
                                </h3>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase">Click card to deploy</span>
                            </div>

                            {presets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20 text-center">
                                    <Layout className="w-12 h-12 text-zinc-700 mb-3" />
                                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">No Presets Found</p>
                                    <p className="text-xs text-zinc-600 mt-1 max-w-xs leading-relaxed">
                                        Layout presets created inside the editor will appear here for fast loading.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-2">
                                    {presets.map((preset) => (
                                        <div
                                            key={preset.id}
                                            className={`group relative flex flex-col justify-between p-5 rounded-xl bg-zinc-900 border border-zinc-800 ${typeBorderHover} transition-all duration-300`}
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={`text-sm font-bold text-white uppercase tracking-tight ${typeTextHighlight} transition-colors truncate max-w-[80%]`}>
                                                        {preset.name}
                                                    </h4>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeletePreset(preset.id)
                                                        }}
                                                        className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-zinc-800/80 rounded-lg transition-all"
                                                        title="Delete Preset"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-[9px] text-zinc-500 font-mono mt-2 uppercase">
                                                    Saved: {new Date(preset.created_at).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleLoadPreset(preset)}
                                                className={`mt-6 w-full py-2 bg-zinc-850 ${type === 'blog' ? 'hover:bg-teal-500 hover:text-black' : 'hover:bg-blue-500 hover:text-white'} text-zinc-300 font-black uppercase text-[10px] tracking-wider rounded-lg transition-all duration-300`}
                                            >
                                                Deploy Design_
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden text-slate-800">
            {/* Management Bar */}
            <div className="bg-slate-100/90 backdrop-blur-md border-b px-8 py-4 shrink-0 z-20">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href={backUrl}
                            className="p-2 hover:bg-slate-200 rounded-xl transition-all text-slate-400 hover:text-slate-900 cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic block">Puck Page Builder</span>
                            <span className="text-sm font-black italic uppercase tracking-tight text-slate-950">
                                {title || 'Visual Editor'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border bg-zinc-900 text-[#ccff00] border-zinc-800 shadow-xl uppercase font-mono mr-2">
                            {type.toUpperCase()}_NODE
                        </span>
                        
                        <button
                            onClick={() => setIsSaveModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white hover:bg-black hover:text-[#ccff00] font-black italic uppercase text-xs tracking-wider rounded-xl transition-all duration-300 shadow-md border border-zinc-800"
                        >
                            <Save size={14} />
                            Save Layout as Preset
                        </button>
                    </div>
                </div>
            </div>

            {/* Puck Editor */}
            <main className="flex-1 min-h-0">
                <PageEditor
                    initialData={data}
                    onPublish={handleSave}
                    onChange={(newData) => setData(newData)}
                    title={title || "Edit Visual Layout"}
                />
            </main>

            {/* Save Preset Dialog Modal */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="w-full max-w-md bg-[#121214] border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative">
                        <h3 className="text-lg font-black uppercase italic tracking-tight text-white mb-2">
                            Save Layout Preset_
                        </h3>
                        <p className="text-xs text-zinc-500 uppercase font-mono tracking-wider mb-6">
                            Create a non-deployed visual design template
                        </p>

                        <form onSubmit={handleSavePresetSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 font-mono mb-2">
                                    Preset Design Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Autumn Race Report, Cycling Highlights Grid"
                                    value={presetName}
                                    onChange={(e) => setPresetName(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none transition-all"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSaveModalOpen(false)
                                        setPresetName('')
                                    }}
                                    className="px-4 py-2.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 rounded-xl text-xs font-mono tracking-widest uppercase transition-all duration-300 text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingPreset}
                                    className="px-5 py-2.5 bg-[#ccff00] text-black hover:bg-black hover:text-[#ccff00] border border-transparent hover:border-zinc-800 font-black italic uppercase text-xs tracking-wider rounded-xl transition-all duration-300 shadow-md"
                                >
                                    {isSavingPreset ? 'Saving...' : 'Save Preset_'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function EditItemBuilderPage({ params }: { params: Promise<{ type: string; id: string }> }) {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-slate-400 italic bg-zinc-950 text-white">Decrypting_Matrix_Stream...</div>}>
            <EditItemBuilderContent paramsPromise={params} />
        </Suspense>
    )
}
