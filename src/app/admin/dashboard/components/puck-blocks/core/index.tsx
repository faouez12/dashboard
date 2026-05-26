'use client'
import React from 'react'
import { usePuck } from '@measured/puck'
import {
    Monitor,
    Tablet as TabletIcon,
    Smartphone,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

export const ColorPicker = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) => (
    <div style={{ marginBottom: '12px', width: '100%' }}>
        {label && (
            <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
                display: 'block'
            }}>
                {label}
            </div>
        )}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                backgroundColor: value === 'transparent' ? 'transparent' : (value || '#ffffff'),
                backgroundImage: value === 'transparent' ? 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)' : 'none',
                backgroundSize: value === 'transparent' ? '8px 8px' : 'auto',
                backgroundPosition: value === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto',
                cursor: 'pointer',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
                <input
                    type="color"
                    value={value?.startsWith('#') && value.length === 7 ? value : '#ffffff'}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '-10px',
                        width: '80px',
                        height: '80px',
                        cursor: 'pointer',
                        opacity: 0
                    }}
                />
            </div>
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#HEXCODE or transparent"
                style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    color: '#1e293b'
                }}
            />
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button 
                type="button" 
                onClick={() => onChange('transparent')}
                style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '11px',
                    cursor: 'pointer',
                    backgroundColor: value === 'transparent' ? '#cbd5e1' : '#ffffff',
                    color: '#1e293b',
                    fontWeight: 700,
                    transition: 'all 0.2s'
                }}
            >
                Transparent
            </button>
            {['#020617', '#0f172a', '#1e293b', '#f8fafc', '#ffffff'].map(c => (
                <button
                    key={c}
                    type="button"
                    onClick={() => onChange(c)}
                    style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: value === c ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                        cursor: 'pointer',
                        padding: 0
                    }}
                    title={c}
                />
            ))}
        </div>
    </div>
)

export const ResponsiveInput = ({ value, onChange, label }: { value: any; onChange: (v: any) => void; label?: string }) => {
    const { appState } = usePuck();
    const viewportWidth = appState.ui.viewports.current.width;
    let mode: 'd' | 't' | 'm' = 'd';

    if (viewportWidth <= 640) mode = 'm';
    else if (viewportWidth <= 1024) mode = 't';
    else mode = 'd';

    const val = typeof value === 'object' && value !== null ? value : { d: value || '', t: '', m: '' }
    const currentVal = val[mode] || '';

    const getIcon = () => {
        if (mode === 'm') return <Smartphone size={14} style={{ color: '#3b82f6' }} />
        if (mode === 't') return <TabletIcon size={14} style={{ color: '#3b82f6' }} />
        return <Monitor size={14} style={{ color: '#3b82f6' }} />
    }

    const getModeLabel = () => {
        if (mode === 'm') return 'Mobile'
        if (mode === 't') return 'Tablet'
        return 'PC'
    }

    const isColorField = label?.toLowerCase().includes('color');

    return (
        <div style={{ marginBottom: '16px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    {getIcon()} {getModeLabel()} View
                </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {isColorField && (
                    <div style={{
                        position: 'relative',
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        border: '2px solid #e2e8f0',
                        backgroundColor: currentVal || '#ffffff',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}>
                        <input
                            type="color"
                            value={currentVal?.startsWith('#') && currentVal.length === 7 ? currentVal : '#ffffff'}
                            onChange={(e) => onChange({ ...val, [mode]: e.target.value })}
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '-10px',
                                width: '80px',
                                height: '80px',
                                cursor: 'pointer',
                                opacity: 0
                            }}
                        />
                    </div>
                )}
                <input
                    type="text"
                    value={currentVal}
                    onChange={(e) => onChange({ ...val, [mode]: e.target.value })}
                    placeholder={mode === 'd' ? (isColorField ? '#HEXCODE' : 'Default value...') : 'Inherit from PC...'}
                    style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '2px solid #e2e8f0',
                        fontSize: '14px',
                        fontFamily: isColorField ? 'monospace' : 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#ffffff',
                        color: '#1e293b'
                    }}
                />
            </div>
            {mode !== 'd' && !val[mode] && val.d && (
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
                    Currently using PC value: {val.d}
                </div>
            )}
        </div>
    )
}

export const ResponsiveRadio = ({ value, onChange, label, options }: { value: any; onChange: (v: any) => void; label?: string; options: { label: string; value: string }[] }) => {
    const { appState } = usePuck();
    const viewportWidth = appState.ui.viewports.current.width;
    let mode: 'd' | 't' | 'm' = 'd';

    if (viewportWidth <= 640) mode = 'm';
    else if (viewportWidth <= 1024) mode = 't';
    else mode = 'd';

    const val = normalizeResponsive(value, options[0]?.value || '');
    const currentVal = val[mode] || val.d;

    const getIcon = () => {
        if (mode === 'm') return <Smartphone size={14} style={{ color: '#3b82f6' }} />
        if (mode === 't') return <TabletIcon size={14} style={{ color: '#3b82f6' }} />
        return <Monitor size={14} style={{ color: '#3b82f6' }} />
    }

    return (
        <div style={{ marginBottom: '16px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    {getIcon()} {mode === 'm' ? 'Mobile' : (mode === 't' ? 'Tablet' : 'PC')} View
                </span>
            </div>

            <div style={{
                display: 'flex',
                backgroundColor: '#f1f5f9',
                padding: '4px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                gap: '4px'
            }}>
                {options.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => onChange({ ...val, [mode]: opt.value })}
                        style={{
                            flex: 1,
                            padding: '10px 4px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            border: 'none',
                            transition: 'all 0.2s',
                            backgroundColor: (val[mode] === opt.value || (!val[mode] && val.d === opt.value)) ? '#ffffff' : 'transparent',
                            color: (val[mode] === opt.value || (!val[mode] && val.d === opt.value)) ? '#3b82f6' : '#64748b',
                            fontWeight: (val[mode] === opt.value || (!val[mode] && val.d === opt.value)) ? '700' : '600',
                            boxShadow: (val[mode] === opt.value || (!val[mode] && val.d === opt.value)) ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            {mode !== 'd' && !val[mode] && (
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', textAlign: 'center', fontStyle: 'italic' }}>
                    Following PC: <b>{options.find(o => o.value === val.d)?.label || val.d}</b>
                </div>
            )}
        </div>
    )
}

export const normalizeResponsive = (val: any, defaultVal: string = '') => {
    if (typeof val === 'object' && val !== null && 'd' in val) return val;
    return { d: val || defaultVal, t: '', m: '' };
}



export const ImageUpload = ({ value, onChange }: any) => {
    const [uploading, setUploading] = React.useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const body = new FormData();
            body.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Server upload failed');
            }

            const data = await res.json();
            onChange(data.url);
        } catch (err: any) {
            console.error('SYSTEM_PUCK_UPLOAD_FAILURE:', err);
            alert(err.message || 'Transmission failed. Verify Storage uplink.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label style={{
                display: 'block',
                padding: '30px 10px',
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: uploading ? 'wait' : 'pointer',
                backgroundColor: '#f8fafc',
                opacity: uploading ? 0.6 : 1,
                transition: 'all 0.2s'
            }}>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                    disabled={uploading}
                />
                <div style={{ fontSize: '24px', color: '#3b82f6', marginBottom: '8px' }}>
                    {uploading ? '⌛' : '📷'}
                </div>
                <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {uploading ? 'Transmitting Data...' : (value ? 'Change Visual Component' : 'Upload_Visual')}
                </div>
            </label>
            {value && (
                <div style={{ position: 'relative', marginTop: '16px' }}>
                    <img
                        src={value}
                        alt="Preview"
                        style={{ width: '100%', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', color: '#3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        SYNCED_LIVE
                    </div>
                </div>
            )}
        </div>
    );
}

export const VideoUpload = ({ value, onChange }: any) => {
    const [uploading, setUploading] = React.useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const body = new FormData();
            body.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Server upload failed');
            }

            const data = await res.json();
            onChange(data.url);
        } catch (err: any) {
            console.error('SYSTEM_PUCK_VIDEO_FAILURE:', err);
            alert(err.message || 'Video uplink failed. Verify file size and connection.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label style={{
                display: 'block',
                padding: '40px 10px',
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: uploading ? 'wait' : 'pointer',
                backgroundColor: '#f8fafc',
                opacity: uploading ? 0.6 : 1
            }}>
                <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
                <div style={{ fontSize: '32px', color: '#3b82f6', marginBottom: '8px' }}>
                    {uploading ? '⌛' : '🎥'}
                </div>
                <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {uploading ? 'Uploading Video...' : (value ? 'Change Video Stream' : 'Upload_Video_File')}
                </div>
            </label>
            {value && <video src={value} controls style={{ marginTop: '16px', width: '100%', borderRadius: '10px', border: '1px solid #e2e8f0' }} />}
        </div>
    );
}

export const RangeInput = ({ value, onChange, label }: any) => (
    <div style={{ marginBottom: '16px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '6px' }}>
                {value || 50}% / {100 - (value || 50)}%
            </span>
        </div>
        <input
            type="range"
            min="10"
            max="90"
            step="5"
            value={value || 50}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{
                width: '100%',
                height: '6px',
                backgroundColor: '#e2e8f0',
                borderRadius: '3px',
                appearance: 'none',
                cursor: 'pointer',
                accentColor: '#3b82f6'
            }}
        />
    </div>
)

export const ResponsiveStyles = ({ id, props }: { id: string, props: any }) => {
    const generateCSS = (propName: string, cssVar: string) => {
        const val = normalizeResponsive(props[propName]);
        return `
            #${id} { --${cssVar}: ${val.d || 'initial'}; }
            @media (max-width: 1024px) { #${id} { --${cssVar}: ${val.t || val.d || 'initial'}; } }
            @media (max-width: 640px) { #${id} { --${cssVar}: ${val.m || val.t || val.d || 'initial'}; } }
        `
    }

    const responsiveKeys = ['width', 'height', 'backgroundColor', 'padding', 'gap', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'fontSize', 'borderRadius', 'textAlign', 'justifyContent', 'alignItems', 'flexDirection', 'alignment'];

    const css = Object.keys(props)
        .filter(key => responsiveKeys.includes(key))
        .map(key => generateCSS(key, key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())))
        .join('\n')

    return <style dangerouslySetInnerHTML={{ __html: css }} />
}
