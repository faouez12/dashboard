'use client'
import React, { useState, useEffect } from 'react'
import { ResponsiveInput, ColorPicker, ResponsiveStyles, ImageUpload } from '../core'

export const HUDStats = {
    fields: {
        stats: {
            type: 'array',
            label: 'Stats',
            getItemSummary: (item: any) => `${item.label}: ${item.value}`,
            defaultItemProps: {
                label: 'LABEL',
                value: 'VALUE'
            },
            arrayFields: {
                label: { type: 'text', label: 'Label' },
                value: { type: 'text', label: 'Value' }
            }
        },
        color: { type: 'custom', label: 'Accent Color', render: ColorPicker },
        fontSize: { type: 'custom', label: 'Font Size', render: ResponsiveInput },
        alignment: {
            type: 'select',
            label: 'Alignment',
            options: [
                { label: 'Left', value: 'flex-start' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'flex-end' }
            ]
        },
        marginTop: { type: 'custom', label: 'Margin Top', render: ResponsiveInput },
        marginBottom: { type: 'custom', label: 'Margin Bottom', render: ResponsiveInput },
    },
    defaultProps: {
        stats: [
            { label: 'ARCHITECT', value: 'FAOUÈZ' },
            { label: 'NODE_STAMP', value: '2024' },
            { label: 'CATEGORY', value: 'FULL_STACK' }
        ],
        color: '#A855F7',
        fontSize: { d: '12px', t: '11px', m: '10px' },
        alignment: 'center',
        marginTop: { d: '24px', t: '16px', m: '12px' },
        marginBottom: { d: '24px', t: '16px', m: '12px' },
    },
    render: (allProps: any) => {
        const { stats, color, fontSize, alignment, id, marginTop, marginBottom } = allProps;
        const blockId = `hud-${(id || 'default').replace(/[:.]/g, '-')}`;

        const containerStyle: React.CSSProperties = {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: alignment,
            gap: '2rem',
            width: '100%',
            marginTop: 'var(--margin-top)',
            marginBottom: 'var(--margin-bottom)',
            fontFamily: 'var(--font-mono, monospace)'
        };

        return (
            <div id={blockId} style={containerStyle}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    #${blockId} .hud-label { font-size: calc(var(--font-size, 12px) * 0.8) !important; }
                    #${blockId} .hud-value { font-size: var(--font-size, 12px) !important; }
                ` }} />
                <ResponsiveStyles id={blockId} props={allProps} />
                {stats.map((stat: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1 items-start">
                        <span
                            className="hud-label"
                            style={{
                                color: color,
                                fontWeight: 900,
                                letterSpacing: '0.3em',
                                opacity: 0.6
                            }}
                        >
                            [{stat.label}]
                        </span>
                        <span
                            className="hud-value"
                            style={{
                                color: 'white',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                fontStyle: 'italic'
                            }}
                        >
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
}

export const Hero = {
    fields: {
        backgroundType: {
            type: 'select',
            label: 'Background Type',
            options: [
                { label: 'Aurora Mesh', value: 'aurora' },
                { label: 'Image Carousel', value: 'image_carousel' },
                { label: 'Video Carousel', value: 'video_carousel' }
            ]
        },
        mediaUrls: {
            type: 'array',
            label: 'Carousel Media',
            getItemSummary: (item: any, index?: number) => item.url || `Media ${index !== undefined ? index + 1 : ""}`,
            arrayFields: {
                url: { type: 'custom', label: 'Media (Image/Video URL)', render: ImageUpload }
            },
            defaultItemProps: { url: '' }
        },
        opacity: {
            type: 'number',
            label: 'Media Opacity (0.0 to 1.0)',
            min: 0,
            max: 1,
            step: 0.1
        },
        overlayOpacity: {
            type: 'number',
            label: 'Dark Overlay Opacity (0.0 to 1.0)',
            min: 0,
            max: 1,
            step: 0.1
        },
        minHeight: {
            type: 'text',
            label: 'Min Height'
        },
        padding: {
            type: 'text',
            label: 'Padding'
        }
    },
    defaultProps: {
        backgroundType: 'aurora',
        mediaUrls: [],
        opacity: 0.35,
        overlayOpacity: 0.0,
        minHeight: '70vh',
        padding: '48px 24px'
    },
    render: (allProps: any) => {
        const {
            backgroundType, mediaUrls, opacity, overlayOpacity, minHeight, padding, puck, id
        } = allProps

        const [currentMediaIdx, setCurrentMediaIdx] = useState(0)

        useEffect(() => {
            if (backgroundType === 'aurora' || !mediaUrls || mediaUrls.length <= 1) return
            const interval = setInterval(() => {
                setCurrentMediaIdx(prev => (prev + 1) % mediaUrls.length)
            }, 5000)
            return () => clearInterval(interval)
        }, [backgroundType, mediaUrls])

        const activeMedia = mediaUrls && mediaUrls.length > 0 ? mediaUrls[currentMediaIdx]?.url : ''

        return (
            <section
                style={{ minHeight, padding }}
                className="relative overflow-hidden bg-[#0F0F0F] flex flex-col justify-center px-6 md:px-16 w-full text-white font-sans"
            >
                {/* Background rendering */}
                {backgroundType === 'video_carousel' && activeMedia ? (
                    <div className="absolute inset-0 z-0 bg-black pointer-events-none">
                        <video
                            key={activeMedia}
                            src={activeMedia}
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ opacity }}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                        />
                    </div>
                ) : backgroundType === 'image_carousel' && mediaUrls && mediaUrls.length > 0 ? (
                    <div className="absolute inset-0 z-0 bg-black pointer-events-none">
                        {mediaUrls.map((item: any, idx: number) => (
                            <div
                                key={item.url + '-' + idx}
                                style={{
                                    backgroundImage: `url(${item.url})`,
                                    opacity: idx === currentMediaIdx ? opacity : 0
                                }}
                                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity }}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-teal-950/20 to-zinc-950" />
                    </div>
                )}

                {/* Dark overlay */}
                {overlayOpacity > 0 && (
                    <div
                        style={{ opacity: overlayOpacity }}
                        className="absolute inset-0 bg-black pointer-events-none z-[1]"
                    />
                )}

                {/* Dynamic dropzone wrapper */}
                <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-between flex-grow py-8">
                    <puck.renderDropZone zone="hero-content" />
                </div>
            </section>
        )
    }
}
