'use client'
import config from '../components/puck-config'
import { CustomVisualBuilder } from '../components/CustomVisualBuilder'
import { useState, useEffect } from 'react'
import {
    fetchHomepagePuckData,
    saveHomepagePuckData,
    getTemplate,
    fetchSavedDesigns,
    addSavedDesign,
    deleteSavedDesign
} from '@/app/admin/actions'
import { useToast } from '../components/ToastProvider'
import { Sparkles, Layout, ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function BuilderPage() {
    const toast = useToast()
    const [data, setData] = useState<any>({ content: [], root: { props: {} } })
    const [loading, setLoading] = useState(true)
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

    const loadPresets = async () => {
        try {
            const list = await fetchSavedDesigns('homepage')
            setPresets(list)
        } catch (err) {
            console.error('Failed to load presets:', err)
        }
    }

    useEffect(() => {
        async function load() {
            try {
                const res = await fetchHomepagePuckData()
                if (res) {
                    try {
                        const parsed = typeof res === 'string' ? JSON.parse(res) : res
                        if (parsed && (parsed.content || parsed.root)) {
                            setData(parsed)
                        }
                    } catch (err) {
                        console.error('Failed to parse saved puck data', err)
                    }
                }
                await loadPresets()
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [toast])

    const handleChooseTemplate = async () => {
        try {
            const template = await getTemplate('hero-default')
            const initialData = template && (template.content || template.root)
                ? template
                : { content: [], root: { props: {} } }
            
            setData(initialData)
            await saveHomepagePuckData(initialData)
            toast.success('Template Loaded', 'Homepage initialized with master template blueprint.')
        } catch (err) {
            console.error(err)
            const emptyData = { content: [], root: { props: {} } }
            setData(emptyData)
            await saveHomepagePuckData(emptyData)
        } finally {
            setShowChoice(false)
        }
    }

    const handleChooseScratch = async () => {
        const emptyData = { content: [], root: { props: {} } }
        setData(emptyData)
        try {
            await saveHomepagePuckData(emptyData)
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
            await saveHomepagePuckData(preset.content)
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
            await addSavedDesign('homepage', presetName, data)
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

    const handlePublish = async (newData: any) => {
        try {
            await saveHomepagePuckData(newData)
            toast.success('Matrix Configured', 'Homepage visual elements successfully compiled.')
        } catch (err) {
            console.error(err)
            toast.error('Sync Failure', 'Failed to publish homepage layout.')
        }
    }

    if (!mounted || loading) {
        return <div className="h-screen flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-slate-400 italic bg-[#0F0F0F] text-white">Decrypting_Matrix_Stream...</div>
    }

    const hasActiveLayout = data && data.content && data.content.length > 0
    const backUrl = '/admin/dashboard/settings/hero'

    if (showChoice) {
        return (
            <div className="min-h-full bg-[#070708] text-slate-300 font-sans p-8 overflow-y-auto relative z-20">
                <div className="max-w-6xl mx-auto flex flex-col gap-10 py-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800/85 pb-6 gap-4">
                        <div>
                            <h2 className="text-3xl font-black uppercase text-white tracking-tight flex items-center gap-3">
                                <Sparkles className="text-[#ccff00]" size={28} />
                                Homepage Layout Selector
                            </h2>
                            <p className="text-xs text-slate-500 font-mono font-bold uppercase tracking-widest mt-2">
                                Select layout method or choose a saved non-deployed preset
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
                                        ? 'border-zinc-800 hover:border-[#ccff00] cursor-pointer hover:bg-zinc-900/70'
                                        : 'border-zinc-800/10 opacity-30 cursor-not-allowed'
                                }`}
                                disabled={!hasActiveLayout}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl border ${hasActiveLayout ? 'bg-[#ccff00]/10 text-[#ccff00] border-[#ccff00]/25' : 'bg-zinc-800 text-zinc-600 border-zinc-700'}`}>
                                        <Layout size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase italic tracking-wider group-hover:text-[#ccff00] transition-colors">
                                            Continue with Active Layout_
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                            Keep editing the current layout setup deployed on the homepage.
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Option 2: Blueprint */}
                            <button
                                onClick={handleChooseTemplate}
                                className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-[#ccff00] hover:bg-zinc-900/70 text-left flex flex-col justify-between transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-zinc-800 text-[#ccff00] border border-zinc-800 group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase italic tracking-wider group-hover:text-[#ccff00] transition-colors">
                                            Use Master Blueprint_
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                            Reset layout and load from standard homepage master template.
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Option 3: Scratch */}
                            <button
                                onClick={handleChooseScratch}
                                className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/70 text-left flex flex-col justify-between transition-all duration-300 cursor-pointer"
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
                                            Wipe elements completely to construct a layout from a blank screen.
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
                                            className="group relative flex flex-col justify-between p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#ccff00] transition-all duration-300"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-[#ccff00] transition-colors truncate max-w-[80%]">
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
                                                className="mt-6 w-full py-2 bg-zinc-850 hover:bg-[#ccff00] text-zinc-300 hover:text-black font-black uppercase text-[10px] tracking-wider rounded-lg transition-all duration-300"
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
        <div className="h-screen bg-[#070708] relative z-20 -m-8 p-8 overflow-hidden">
            <CustomVisualBuilder
                initialData={data}
                onSave={handlePublish}
                title="Homepage Layout Builder"
            />
        </div>
    )
}
