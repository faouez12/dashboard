'use client'
import config from '../../../components/puck-config'
import { CustomVisualBuilder } from '../../../components/CustomVisualBuilder'
import { useState, useEffect, Suspense, use } from 'react'
import { getTemplate, saveTemplate } from '@/app/admin/actions'
import { useToast } from '../../../components/ToastProvider'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

function TemplateEditorContent({ paramsPromise }: { paramsPromise: Promise<{ templateId: string }> }) {
    const params = use(paramsPromise)
    const templateId = params.templateId

    const [data, setData] = useState<any>({ content: [], root: { props: {} } })
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

    const handleSave = async (newData: any) => {
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
        <div className="h-screen bg-[#070708] relative z-20 -m-8 p-8 overflow-hidden">
            <CustomVisualBuilder
                initialData={data}
                onSave={handleSave}
                title={`${titleStr} Template Editor`}
            />
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
