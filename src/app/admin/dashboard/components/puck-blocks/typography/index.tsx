'use client'
import React from 'react'
import { ResponsiveInput, ColorPicker, ResponsiveRadio, ResponsiveStyles } from '../core'

export const Heading = {
    fields: {
        text: { type: 'text', label: 'Text' },
        level: {
            type: 'select',
            label: 'Level',
            options: [
                { label: 'H1', value: 'h1' }, { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' }, { label: 'H4', value: 'h4' },
                { label: 'H5', value: 'h5' }, { label: 'H6', value: 'h6' }
            ]
        },
        fontFamily: { type: 'text', label: 'Font Family' },
        fontSize: { type: 'custom', label: 'Font Size', render: ResponsiveInput },
        fontWeight: {
            type: 'select',
            label: 'Font Weight',
            options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Medium', value: '500' },
                { label: 'SemiBold', value: '600' },
                { label: 'Bold', value: 'bold' }
            ]
        },
        color: { type: 'custom', label: 'Color', render: ColorPicker },
        textAlign: {
            type: 'custom',
            label: 'Text Align',
            render: (props: any) => (
                <ResponsiveRadio
                    {...props}
                    options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                        { label: 'Justify', value: 'justify' }
                    ]}
                />
            )
        },
        display: {
            type: 'radio',
            label: 'Display',
            options: [
                { label: 'Block', value: 'block' },
                { label: 'Inline', value: 'inline-block' },
                { label: 'Flex', value: 'flex' },
                { label: 'Grid', value: 'grid' }
            ]
        },
        width: { type: 'custom', label: 'Width', render: ResponsiveInput },
        alignment: {
            type: 'custom',
            label: 'Box Alignment',
            render: (props: any) => (
                <ResponsiveRadio
                    {...props}
                    options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' }
                    ]}
                />
            )
        },
        marginTop: { type: 'custom', label: 'Margin Top', render: ResponsiveInput },
        marginBottom: { type: 'custom', label: 'Margin Bottom', render: ResponsiveInput },
        backgroundColor: { type: 'custom', label: 'Background Color', render: ColorPicker },
        borderRadius: { type: 'text', label: 'Border Radius' },
        borderWidth: { type: 'text', label: 'Border Width' },
        borderColor: { type: 'custom', label: 'Border Color', render: ColorPicker },
        borderStyle: {
            type: 'select',
            label: 'Border Style',
            options: [
                { label: 'None', value: 'none' },
                { label: 'Solid', value: 'solid' },
                { label: 'Dashed', value: 'dashed' },
                { label: 'Dotted', value: 'dotted' }
            ]
        },
        boxShadow: { type: 'text', label: 'Box Shadow' },
        hideOnDesktop: {
            type: 'radio',
            label: 'Hide on Desktop',
            options: [{ label: 'Show', value: 'false' }, { label: 'Hide', value: 'true' }]
        }
    },
    defaultProps: {
        text: 'Your heading here',
        level: 'h2',
        fontFamily: 'Inter',
        fontSize: { d: '24px', t: '', m: '' },
        fontWeight: 'bold',
        color: '#000000',
        textAlign: { d: 'left', t: '', m: '' },
        display: 'block',
        width: { d: 'auto', t: '', m: '' },
        alignment: { d: 'left', t: '', m: '' },
        marginTop: { d: '0px', t: '', m: '' },
        marginBottom: { d: '0px', t: '', m: '' },
        backgroundColor: 'transparent',
        borderRadius: '0px',
        borderWidth: '0px',
        borderColor: '#000000',
        borderStyle: 'none',
        boxShadow: 'none',
        hideOnDesktop: 'false'
    },
    render: (allProps: any) => {
        const { text, level, fontFamily, fontSize, fontWeight, color, textAlign, display, backgroundColor, borderRadius, borderWidth, borderStyle, borderColor, boxShadow, hideOnDesktop, alignment, id } = allProps;
        const Tag = (level || 'h2') as any
        const blockId = `head-${(id || 'default').replace(/[:.]/g, '-')}`;

        const headingStyle = {
            fontFamily, fontSize: 'var(--font-size)', fontWeight, color,
            textAlign: 'var(--text-align)' as any,
            display, margin: 0, backgroundColor, borderRadius,
            border: `${borderWidth} ${borderStyle} ${borderColor}`,
            boxShadow, width: 'var(--width)'
        }

        const containerStyle: React.CSSProperties = {
            textAlign: 'var(--alignment)' as any, width: '100%',
            marginTop: 'var(--margin-top)', marginBottom: 'var(--margin-bottom)'
        }

        return (
            <div id={blockId} style={containerStyle} className={hideOnDesktop === 'true' ? 'hide-desktop' : ''}>
                <ResponsiveStyles id={blockId} props={allProps} />
                <Tag style={headingStyle}>{text}</Tag>
            </div>
        )
    }
}

export const Quote = {
    fields: {
        text: { type: 'textarea', label: 'Quote Text' },
        author: { type: 'text', label: 'Author' },
        fontSize: { type: 'custom', label: 'Font Size', render: ResponsiveInput },
        color: { type: 'custom', label: 'Color', render: ColorPicker },
        width: { type: 'custom', label: 'Width', render: ResponsiveInput },
        alignment: {
            type: 'custom',
            label: 'Box Alignment',
            render: (props: any) => (
                <ResponsiveRadio
                    {...props}
                    options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' }
                    ]}
                />
            )
        },
        marginTop: { type: 'custom', label: 'Margin Top', render: ResponsiveInput },
        marginBottom: { type: 'custom', label: 'Margin Bottom', render: ResponsiveInput },
        hideOnDesktop: {
            type: 'radio',
            label: 'Hide on Desktop',
            options: [{ label: 'Show', value: 'false' }, { label: 'Hide', value: 'true' }]
        }
    },
    defaultProps: {
        text: 'Your quote here...', author: 'Author Name', fontSize: { d: '18px', t: '', m: '' }, color: '#475569',
        width: { d: 'auto', t: '', m: '' }, alignment: { d: 'left', t: '', m: '' },
        marginTop: { d: '16px', t: '', m: '' }, marginBottom: { d: '16px', t: '', m: '' },
        hideOnDesktop: 'false'
    },
    render: (allProps: any) => {
        const { text, author, fontSize, color, hideOnDesktop, alignment, id } = allProps;
        const blockId = `quote-${(id || 'default').replace(/[:.]/g, '-')}`;

        const quoteStyle: React.CSSProperties = {
            fontSize: 'var(--font-size)', color, fontStyle: 'italic', borderLeft: '4px solid #3b82f6',
            margin: 0, display: 'inline-block', textAlign: 'left', width: 'var(--width)'
        }

        const containerStyle: React.CSSProperties = {
            textAlign: 'var(--alignment)' as any, width: '100%',
            marginTop: 'var(--margin-top)', marginBottom: 'var(--margin-bottom)'
        }

        return (
            <div id={blockId} style={containerStyle} className={hideOnDesktop === 'true' ? 'hide-desktop' : ''}>
                <ResponsiveStyles id={blockId} props={allProps} />
                <blockquote style={quoteStyle}>
                    <p style={{ margin: 0 }}>{text}</p>
                    {author && <footer style={{ marginTop: '8px', fontSize: '14px', color: '#94a3b8' }}>— {author}</footer>}
                </blockquote>
            </div>
        )
    }
}

export const RichText = {
    fields: {
        content: { type: 'textarea', label: 'Content' },
        fontFamily: { type: 'text', label: 'Font Family' },
        fontSize: { type: 'custom', label: 'Font Size', render: ResponsiveInput },
        fontWeight: {
            type: 'select',
            label: 'Font Weight',
            options: [{ label: 'Regular', value: 'normal' }, { label: 'Bold', value: 'bold' }]
        },
        width: { type: 'custom', label: 'Width', render: ResponsiveInput },
        height: { type: 'custom', label: 'Height', render: ResponsiveInput },
        color: { type: 'custom', label: 'Color', render: ColorPicker },
        lineHeight: { type: 'text', label: 'Line Height' },
        textAlign: {
            type: 'custom',
            label: 'Text Align (Internal)',
            render: (props: any) => (
                <ResponsiveRadio
                    {...props}
                    options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                        { label: 'Justify', value: 'justify' }
                    ]}
                />
            )
        },
        alignment: {
            type: 'custom',
            label: 'Box Alignment',
            render: (props: any) => (
                <ResponsiveRadio
                    {...props}
                    options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' }
                    ]}
                />
            )
        },
        marginTop: { type: 'custom', label: 'Margin Top', render: ResponsiveInput },
        marginBottom: { type: 'custom', label: 'Margin Bottom', render: ResponsiveInput },
        backgroundColor: { type: 'custom', label: 'Background Color', render: ColorPicker },
        borderRadius: { type: 'text', label: 'Border Radius' },
        hideOnDesktop: {
            type: 'radio',
            label: 'Hide on Desktop',
            options: [{ label: 'Show', value: 'false' }, { label: 'Hide', value: 'true' }]
        }
    },
    defaultProps: {
        content: 'Your text here...', fontFamily: 'Inter', fontSize: { d: '16px', t: '', m: '' }, fontWeight: 'normal',
        width: { d: '100%', t: '', m: '' }, height: { d: 'auto', t: '', m: '' },
        color: '#334155', textAlign: { d: 'left', t: '', m: '' }, alignment: { d: 'left', t: '', m: '' },
        marginTop: { d: '0px', t: '', m: '' }, marginBottom: { d: '0px', t: '', m: '' },
        backgroundColor: 'transparent', borderRadius: '0px', hideOnDesktop: 'false'
    },
    render: (allProps: any) => {
        const { content, fontFamily, fontSize, fontWeight, color, lineHeight, textAlign, backgroundColor, borderRadius, hideOnDesktop, alignment, id } = allProps;
        const blockId = `rich-${(id || 'default').replace(/[:.]/g, '-')}`;

        const richStyle: React.CSSProperties = {
            fontFamily, fontSize: 'var(--font-size)', fontWeight, color, lineHeight,
            textAlign: 'var(--text-align)' as any,
            backgroundColor, borderRadius, whiteSpace: 'pre-wrap',
            display: 'inline-block', width: 'var(--width)', height: 'var(--height)'
        }

        const containerStyle: React.CSSProperties = {
            textAlign: 'var(--alignment)' as any, width: '100%',
            marginTop: 'var(--margin-top)', marginBottom: 'var(--margin-bottom)'
        }

        return (
            <div id={blockId} style={containerStyle} className={hideOnDesktop === 'true' ? 'hide-desktop' : ''}>
                <ResponsiveStyles id={blockId} props={allProps} />
                <div style={richStyle}>{content}</div>
            </div>
        )
    }
}
