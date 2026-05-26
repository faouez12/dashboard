'use client'
import React, { useState } from 'react'
import { Puck } from '@measured/puck'
import type { Config } from '@measured/puck'
import {
    Grid,
    Type,
    Image as MediaImage,
    Search,
    ChevronDown,
    Sparkles,
} from 'lucide-react'

// Import refactored components
import { Heading, Quote, RichText } from './puck-blocks/typography'
import { OneBlock, FlexBox, Row, GridRow, Link, Button, List, ListItem } from './puck-blocks/structure'
import { Image, ImageCarousel, Video, VideoCarousel, MediaCarousel } from './puck-blocks/media'
import { HUDStats, Hero } from './puck-blocks/special'

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
        },
        Special: {
            components: ['HUDStats', 'Hero']
        }
    },
    components: {
        Heading: Heading,
        Quote: Quote,
        RichText: RichText,
        List: List,
        ListItem: ListItem,
        OneBlock: OneBlock,
        FlexBox: FlexBox,
        Row: Row,
        GridRow: GridRow,
        Image: Image,
        ImageCarousel: ImageCarousel,
        Video: Video,
        VideoCarousel: VideoCarousel,
        MediaCarousel: MediaCarousel,
        Link: Link,
        Button: Button,
        HUDStats: HUDStats,
        Hero: Hero
    },
    root: {
        render: ({ children }: any) => (
            <div style={{ backgroundColor: '#020617', color: '#ffffff', minHeight: '100vh', width: '100%', fontFamily: 'sans-serif' }}>
                {children}
            </div>
        )
    }
}

// Custom Drawer Component
export function CustomDrawer({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState('Elements')
    const [expandedSections, setExpandedSections] = useState({ Structure: true, Typography: true, Media: true, Special: true })
    const [searchQuery, setSearchQuery] = useState('')

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const drawerSections = [
        { name: 'Structure', icon: Grid, components: config.categories?.Structure?.components || [] },
        { name: 'Typography', icon: Type, components: config.categories?.Typography?.components || [] },
        { name: 'Media', icon: MediaImage, components: config.categories?.Media?.components || [] },
        { name: 'Special', icon: Sparkles, components: config.categories?.Special?.components || [] },
    ]

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
                    drawerSections.map((section) => (
                        <div key={section.name}>
                            <button
                                onClick={() => toggleSection(section.name as any)}
                                className="w-full flex items-center justify-between p-3 text-sm font-semibold text-slate-800 hover:bg-slate-50/50 rounded-xl transition-all group mb-1"
                                style={{ padding: '0', margin: '4px 0' }}
                            >
                                <span className="flex items-center gap-2">
                                    <section.icon className="w-4 h-4 text-blue-500" />
                                    {section.name}
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections[section.name as keyof typeof expandedSections] ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedSections[section.name as keyof typeof expandedSections] && (
                                <div className={`space-y-1 pl-2 ${section.name === 'Media' ? 'grid grid-cols-2 gap-1' : ''}`}>
                                    {children}
                                </div>
                            )}
                        </div>
                    ))
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

// Main Editor Component
export function PageEditor({ initialData, onPublish, onChange, title }: { initialData: any, onPublish: (data: any) => void, onChange?: (data: any) => void, title?: string }) {
    return (
        <div className="h-full">
            <Puck
                config={config}
                data={initialData}
                onPublish={onPublish}
                onChange={onChange}
            />
        </div>
    )
}

export default config
