'use client'
import { Data } from '@measured/puck'
import '@measured/puck/puck.css'
import config, { PageEditor } from '../../../components/puck-config'
import { useState, useEffect, Suspense, use } from 'react'
import { getTemplate, saveTemplate } from '@/app/admin/actions'
import { useToast } from '../../../components/ToastProvider'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

function TemplateEditorContent({ paramsPromise }: { paramsPromise: Promise<{ templateId: string }> }) {
    const params = use(paramsPromise)
    const templateId = params.templateId

    const [data, setData] = useState<Data>({ content: [], root: { props: {} } })
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        if (templateId) {
            loadTemplate(templateId)
        }
    }, [templateId])

    const loadTemplate = async (id: string) => {
        try {
            const template = await getTemplate(id)
            if (template) {
                setData(template)
            } else {
                setData({ content: [], root: { props: { title: `${id.replace('-', ' ').toUpperCase()} Blueprint` } } })
            }
        } catch (error) {
            console.error('Failed to load template:', error)
            toast.error('Load Error', 'Unable to retrieve master blueprint.')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (newData: Data) => {
        try {
            setData(newData)
            await saveTemplate(templateId, newData)
            toast.success('Matrix Realigned', `${templateId.replace('-', ' ').toUpperCase()} blueprint successfully stabilized.`)
        } catch (error: any) {
            console.error('Master Save Error:', error)
            toast.error('Sync Failed', error.message || 'Unable to stabilize blueprint.')
        }
    }

    if (loading) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-mono text-[10px] uppercase tracking-[0.5em] italic">
                Scanning_Blueprint_Data...
            </div>
        )
    }

    const titleStr = templateId.replace('-', ' ').toUpperCase()

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden text-slate-800">
            {/* Template Header - Gray Aesthetic */}
            <div className="bg-slate-100/90 backdrop-blur-md border-b border-slate-200 px-8 py-5 shrink-0 z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/dashboard/settings/templates"
                            className="p-3 bg-white hover:bg-slate-200 rounded-2xl transition-all text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="font-black text-2xl uppercase italic tracking-tighter text-slate-900 leading-none">
                                Master Template Editor_
                            </h1>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] italic mt-1.5 opacity-60">
                                Path: SYSTEM_{templateId.toUpperCase().replace('-', '_')}_BLUEPRINT_V1.1
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 shadow-sm">
                            <Sparkles size={14} className="text-purple-600 animate-pulse" />
                            <span className="text-[10px] font-black uppercase italic tracking-widest text-purple-700">{titleStr} Blueprint Mode</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Puck Editor */}
            <div className="flex-1 min-h-0">
                <PageEditor
                    initialData={data}
                    onPublish={handleSave}
                    title={`${titleStr} Template`}
                />
            </div>
        </div>
    )
}

export default function TemplateEditorPage({ params }: { params: Promise<{ templateId: string }> }) {
    return (
        <Suspense fallback={<div className="h-screen bg-slate-950 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-slate-400 italic">Decrypting_Blueprint...</div>}>
            <TemplateEditorContent paramsPromise={params} />
        </Suspense>
    )
}
