'use client'
import React, { useState } from 'react'
import type { Config } from '@measured/puck'
import {
    Grid,
    Type,
    Image as MediaImage,
    Search,
    ChevronDown,
} from 'lucide-react'
import '@measured/puck/puck.css'

export const config: Config = {
    categories: {
        Structure: {
            components: ['OneBlock', 'Row', 'GridRow', 'FlexBox', 'Link', 'Button', 'List', 'ListItem']
        },
        Typography: {
            components: ['Heading', 'Quote', 'RichText']
        },
        Media: {
            components: ['Image', 'Video', 'ImageCarousel', 'VideoCarousel', 'MediaCarousel']
        }
    },
    components: {
        Heading: {
            render: ({ title }) => <h2 className="text-2xl font-bold">{title}</h2>
        },
        Quote: {
            render: ({ text }) => <blockquote className="border-l-4 pl-4 italic">{text}</blockquote>
        },
        RichText: {
            render: ({ html }) => <div dangerouslySetInnerHTML={{ __html: html }} />
        },
        OneBlock: {
            render: ({ children }) => <div className="p-4">{children}</div>
        },
        Row: {
            render: ({ children }) => <div className="flex gap-4">{children}</div>
        }
    }
}

export function CustomDrawer({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState('Elements')
    const [expandedSections, setExpandedSections] = useState({ Structure: true, Typography: true, Media: true })
    const [searchQuery, setSearchQuery] = useState('')

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    return (
        <aside className="w-72 bg-white/80 backdrop-blur-sm border-r border-slate-200 p-4 flex flex-col shadow-xl h-full">
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('Elements')}
                    className={`flex-1 text-sm font-medium rounded-lg transition-all ${activeTab === 'Elements' ? 'bg-blue-50 text-blue-600 border-2 border-blue-500' : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300'}`}
                    style={{ padding: '0', margin: '8px' }}
                >
                    Elements
                </button>
                <button
                    onClick={() => setActiveTab('Layouts')}
                    className={`flex-1 text-sm font-medium rounded-lg transition-all ${activeTab === 'Layouts' ? 'bg-blue-50 text-blue-600 border-2 border-blue-500' : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300'}`}
                    style={{ padding: '0', margin: '8px' }}
                >
                    Layouts
                </button>
            </div>

            <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search elements..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white/50 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
                {activeTab === 'Elements' ? (
                    <>
                        <div>
                            <button onClick={() => toggleSection('Structure')} className="w-full flex items-center justify-between p-3 text-sm font-semibold text-slate-800 hover:bg-slate-50/50 rounded-xl transition-all group mb-1" style={{ padding: '0', margin: '4px 0' }}>
                                <span className="flex items-center gap-2">
                                    <Grid className="w-4 h-4 text-blue-500" />Structure
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.Structure ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.Structure && <div className="space-y-1 pl-2">{children}</div>}
                        </div>
                        <div>
                            <button onClick={() => toggleSection('Typography')} className="w-full flex items-center justify-between p-3 text-sm font-semibold text-slate-800 hover:bg-slate-50/50 rounded-xl transition-all group mb-1" style={{ padding: '0', margin: '4px 0' }}>
                                <span className="flex items-center gap-2">
                                    <Type className="w-4 h-4 text-blue-500" />Typography
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.Typography ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.Typography && <div className="space-y-1 pl-2">{children}</div>}
                        </div>
                        <div>
                            <button onClick={() => toggleSection('Media')} className="w-full flex items-center justify-between p-3 text-sm font-semibold text-slate-800 hover:bg-slate-50/50 rounded-xl transition-all group mb-1" style={{ padding: '0', margin: '4px 0' }}>
                                <span className="flex items-center gap-2">
                                    <MediaImage className="w-4 h-4 text-blue-500" />Media
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.Media ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections.Media && <div className="grid grid-cols-2 gap-1 pl-2">{children}</div>}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Grid className="w-16 h-16 text-slate-300 mx-auto" />
                        <h3 className="text-lg font-semibold text-slate-700">Layout Templates</h3>
                        <p className="text-sm text-slate-500 max-w-xs text-center">Pre-built layout templates will appear here.</p>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default config
