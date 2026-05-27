'use client'
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ResponsiveInput, ResponsiveRadio, ResponsiveStyles, ImageUpload, VideoUpload, normalizeResponsive, ColorPicker } from '../core'

export const Image = {
    fields: {
        src: { type: 'custom', label: 'Upload Image', render: ImageUpload },
        alt: { type: 'text', label: 'Alt Text' },
        width: { type: 'custom', label: 'Width', render: ResponsiveInput },
        height: { type: 'custom', label: 'Height', render: ResponsiveInput },
        aspectRatio: {
            type: 'custom',
            label: 'Aspect Ratio',
            render: (props: any) => (
                <ResponsiveRadio 
                    {...props} 
                    options={[
                        { label: 'Auto', value: 'auto' },
                        { label: '16:9', value: '16/9' },
                        { label: '4:3', value: '4/3' },
                        { label: '1:1', value: '1/1' },
                        { label: '21:9', value: '21/9' }
                    ]} 
                />
            )
        },
        borderRadius: { type: 'text', label: 'Border Radius (e.g. 12px)' },

        borderWidth: { type: 'text', label: 'Border Width' },
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
        borderColor: { type: 'custom', label: 'Border Color', render: ColorPicker },
        boxShadow: { type: 'text', label: 'Box Shadow (e.g. 0 10px 15px -3px rgb(0 0 0 / 0.1))' },
        marginTop: { type: 'custom', label: 'Margin Top', render: ResponsiveInput },
        marginBottom: { type: 'custom', label: 'Margin Bottom', render: ResponsiveInput },
        fullWidthMobile: {
            type: 'radio',
            label: 'Full Width Mobile',
            options: [
                { label: 'Edge-to-Edge', value: 'true' },
                { label: 'Indented (Default)', value: 'false' }
            ]
        }
    },
    defaultProps: {
        src: '', alt: 'Image', width: { d: '100%', t: '', m: '100%' }, height: { d: 'auto', t: '', m: '320px' },
        aspectRatio: { d: 'auto', t: '', m: 'auto' },
        objectFit: 'contain', display: 'block', textAlign: { d: 'left', t: '', m: '' }, hideOnDesktop: 'false',
        href: '', sharePlatform: 'none', target: '_self',
        borderRadius: '12px', borderWidth: '0px', borderStyle: 'none', borderColor: '#ffffff', boxShadow: 'none',
        marginTop: { d: '0px', t: '', m: '' }, marginBottom: { d: '0px', t: '', m: '' },
        fullWidthMobile: 'false'
    },

    render: (allProps: any) => {
        const { src, alt, objectFit, display, textAlign, hideOnDesktop, href, sharePlatform, target, borderRadius, borderWidth, borderStyle, borderColor, boxShadow, id, aspectRatio } = allProps;
        const isShare = sharePlatform === 'facebook' || sharePlatform === 'twitter';
        const isAction = isShare || !!href;
        const imageId = `img-${(id || 'default').replace(/[:.]/g, '-')}`;
        const isFullWidthMobile = allProps.fullWidthMobile === 'true';

        const handleAction = (e: React.MouseEvent) => {
            if (isShare) {
                e.preventDefault();
                const urlToShare = typeof window !== 'undefined' ? window.location.href : '';
                let finalUrl = '';
                if (sharePlatform === 'facebook') finalUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(urlToShare)}`;
                else if (sharePlatform === 'twitter') finalUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlToShare)}`;
                if (typeof window !== 'undefined' && finalUrl) window.open(finalUrl, 'share-dialog', 'width=600,height=400');
            }
        };

        const imageStyle: React.CSSProperties = {
            width: 'var(--width)', 
            height: 'var(--final-height)', 
            aspectRatio: 'var(--aspect-ratio)',
            objectFit: objectFit as any, 
            display: display as any,
            maxWidth: '100%',
            borderRadius: isFullWidthMobile ? '0px' : borderRadius,
            border: `${borderWidth} ${borderStyle} ${borderColor}`,
            boxShadow,
            transition: isAction ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s' : 'none',
            cursor: isAction ? 'pointer' : 'default'
        }

        const image = <img src={src || 'https://via.placeholder.com/400x300'} alt={alt} style={imageStyle} className={isAction ? 'hover:scale-[1.02] hover:shadow-2xl' : ''} />

        return (
            <div 
                id={imageId} 
                style={{ textAlign: 'var(--text-align)' as any, overflow: 'hidden', marginTop: 'var(--margin-top)', marginBottom: 'var(--margin-bottom)' }} 
                className={`${hideOnDesktop === 'true' ? 'hide-desktop' : ''} ${isFullWidthMobile ? 'full-width-mobile-fix' : ''}`}
            >
                <ResponsiveStyles id={imageId} props={allProps} />

                <style dangerouslySetInnerHTML={{ __html: `
                    #${imageId} {
                        --aspect-ratio: ${normalizeResponsive(aspectRatio).d !== 'auto' ? normalizeResponsive(aspectRatio).d : 'initial'};
                        --final-height: ${normalizeResponsive(aspectRatio).d === 'auto' ? 'var(--height)' : 'auto'};
                    }
                    @media (max-width: 1024px) {
                        #${imageId} {
                            --aspect-ratio: ${(normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) !== 'auto' ? (normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) : 'initial'};
                            --final-height: ${(normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) === 'auto' ? 'var(--height)' : 'auto'};
                        }
                    }
                    @media (max-width: 640px) {
                        #${imageId} {
                            --aspect-ratio: ${(normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) !== 'auto' ? (normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) : 'initial'};
                            --final-height: ${(normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) === 'auto' ? 'var(--height)' : 'auto'};
                        }
                        #${imageId}.full-width-mobile-fix {
                            width: calc(100% + 48px) !important;
                            margin-left: -24px !important;
                            margin-right: -24px !important;
                        }
                    }
                `}} />

                {isAction ? (
                    <a
                        href={isShare ? '#' : href} target={isShare ? undefined : target} onClick={handleAction}
                        rel={!isShare && target === '_blank' ? 'noopener noreferrer' : undefined}
                        style={{
                            display: display === 'block' ? 'block' : 'inline-block',
                            width: (display === 'block' || allProps.width?.d === '100%') ? '100%' : 'auto',
                            margin: normalizeResponsive(textAlign).d === 'center' ? '0 auto' : (normalizeResponsive(textAlign).d === 'right' ? '0 0 0 auto' : '0'),
                            textDecoration: 'none'
                        }}
                    >
                        {image}
                    </a>
                ) : image}
            </div>
        )
    }
}

const CarouselArrows = ({ onPrev, onNext, items, index, setIndex }: any) => (
    <>
        <button onClick={onPrev} className="carousel-arrow-prev" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 10, margin: '0', padding: '0' }}><ChevronLeft size={24} /></button>
        <button onClick={onNext} className="carousel-arrow-next" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', transition: 'all 0.2s', zIndex: 10, margin: '0', padding: '0' }}><ChevronRight size={24} /></button>
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', padding: '8px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', borderRadius: '20px', zIndex: 10 }}>
            {items.map((_: any, i: number) => (<button key={i} onClick={() => setIndex(i)} style={{ width: index === i ? '24px' : '8px', height: '8px', borderRadius: '4px', background: index === i ? 'white' : 'rgba(255,255,255,0.4)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s', margin: '0 2px' }} />))}
        </div>
    </>
)

export const ImageCarousel = {
    fields: {
        items: {
            type: "array", label: "Carousel Images", getItemSummary: (item: any, index?: number) => item.alt || `Image ${index !== undefined ? index + 1 : ""}`,
            arrayFields: { src: { type: 'custom', label: 'Image', render: ImageUpload }, alt: { type: 'text', label: 'Caption / Alt Text' }, href: { type: 'text', label: 'Link URL' }, sharePlatform: { type: 'select', label: 'Share Platform', options: [{ label: 'None', value: 'none' }, { label: 'Facebook', value: 'facebook' }, { label: 'Twitter/X', value: 'twitter' }] }, target: { type: 'radio', label: 'Open in', options: [{ label: 'Same Tab', value: '_self' }, { label: 'New Tab', value: '_blank' }] } },
            defaultItemProps: { src: '', alt: '', href: '', sharePlatform: 'none', target: '_self' }
        },
        width: { type: 'custom', label: 'Width', render: ResponsiveInput },
        height: { type: 'custom', label: 'Height', render: ResponsiveInput },
        backgroundColor: { type: 'custom', label: 'Background Color', render: ColorPicker },
        captionPosition: {
            type: 'select',
            label: 'Caption Position',
            options: [
                { label: 'Above Image (Title / Outside)', value: 'above' },
                { label: 'Top Overlay', value: 'top-overlay' },
                { label: 'Bottom Overlay', value: 'bottom-overlay' }
            ]
        },
        autoPlay: { type: 'radio', label: 'Auto Play', options: [{ label: 'On', value: 'true' }, { label: 'Off', value: 'false' }] },
        interval: { type: 'number', label: 'Interval (ms)' },
        aspectRatio: {
            type: 'custom',
            label: 'Aspect Ratio',
            render: (props: any) => (
                <ResponsiveRadio 
                    {...props} 
                    options={[
                        { label: 'Auto', value: 'auto' },
                        { label: '16:9', value: '16/9' },
                        { label: '4:3', value: '4/3' },
                        { label: '1:1', value: '1/1' },
                        { label: '21:9', value: '21/9' }
                    ]} 
                />
            )
        },
        borderRadius: { type: 'text', label: 'Border Radius (e.g. 24px)' },
        borderWidth: { type: 'text', label: 'Border Width' },
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
        borderColor: { type: 'custom', label: 'Border Color', render: ColorPicker },
        boxShadow: { type: 'text', label: 'Box Shadow' },
        padding: { type: 'text', label: 'Container Padding (e.g. 8px 16px)' },
        objectFit: { type: 'select', label: 'Object Fit', options: [{ label: 'Contain', value: 'contain' }, { label: 'Cover', value: 'cover' }, { label: 'Fill', value: 'fill' }] },
        display: { type: 'radio', label: 'Display', options: [{ label: 'Block', value: 'block' }, { label: 'Inline Block', value: 'inline-block' }, { label: 'Inline', value: 'inline' }] },
        textAlign: { type: 'radio', label: 'Alignment', options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }] },
        hideOnDesktop: { type: 'radio', label: 'Hide on Desktop', options: [{ label: 'Show', value: 'false' }, { label: 'Hide', value: 'true' }] },
        marginTop: { type: 'custom', label: 'Margin Top', render: ResponsiveInput },
        marginBottom: { type: 'custom', label: 'Margin Bottom', render: ResponsiveInput },
        fullWidthMobile: {
            type: 'radio',
            label: 'Full Width Mobile',
            options: [
                { label: 'Edge-to-Edge', value: 'true' },
                { label: 'Indented (Default)', value: 'false' }
            ]
        }
    },
    defaultProps: {
        items: [{ src: '', alt: 'Image 1' }, { src: '', alt: 'Image 2' }],
        width: { d: '100%', t: '', m: '100%' }, height: { d: '350px', t: '300px', m: '250px' }, backgroundColor: 'transparent', captionPosition: 'above', autoPlay: 'false', interval: 3000,
        aspectRatio: { d: 'auto', t: 'auto', m: 'auto' }, borderRadius: '16px', borderWidth: '0px', borderStyle: 'none', borderColor: 'transparent',
        boxShadow: 'none', padding: '0px',
        objectFit: 'cover', display: 'block', textAlign: 'left', hideOnDesktop: 'false', marginTop: { d: '0px', t: '', m: '' }, marginBottom: { d: '0px', t: '', m: '' },
        fullWidthMobile: 'false'
    },

    render: (allProps: any) => {
        const { items, autoPlay, interval, backgroundColor, captionPosition, objectFit, display, textAlign, hideOnDesktop, aspectRatio, borderRadius, borderWidth, borderStyle, borderColor, boxShadow, id } = allProps;
        const [index, setIndex] = useState(0)
        React.useEffect(() => {
            if (autoPlay === 'true' && items && items.length > 1) {
                const timer = setInterval(() => { setIndex((prev) => (prev + 1) % items.length) }, interval || 3000)
                return () => clearInterval(timer)
            }
        }, [autoPlay, interval, items])
        const carouselId = `icar-${(id || 'default').replace(/[:.]/g, '-')}`;
        if (!items || items.length === 0) return <div style={{ height: '200px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#64748b' }}>No images.</div>
        const safeIndex = (index >= items.length) ? 0 : index
        const isFullWidthMobile = allProps.fullWidthMobile === 'true';

        const textAlignVal = (typeof textAlign === 'object' ? textAlign?.d : textAlign) || 'left';
        const { padding } = allProps;
        const containerStyle: React.CSSProperties = {
            position: 'relative',
            width: 'var(--width)',
            height: 'var(--final-height)',
            aspectRatio: 'var(--aspect-ratio)',
            overflow: 'hidden',
            borderRadius: isFullWidthMobile ? 'var(--final-radius)' : borderRadius,
            border: borderStyle !== 'none' ? `${borderWidth} ${borderStyle} ${borderColor}` : 'none',
            boxShadow: boxShadow || 'none',
            padding: padding || '0px',
            display: 'block',
            marginLeft: textAlignVal === 'center' ? 'auto' : textAlignVal === 'right' ? 'auto' : undefined,
            marginRight: textAlignVal === 'center' ? 'auto' : textAlignVal === 'right' ? '0' : undefined,
            backgroundColor: backgroundColor || 'transparent'
        }

        return (
            <div 
                id={carouselId} 
                style={{ 
                    textAlign: textAlign as any, 
                    display: display as any, 
                    width: '100%', 
                    marginTop: 'var(--margin-top)', 
                    marginBottom: 'var(--margin-bottom)',
                    lineHeight: 0
                }} 
                className={`${hideOnDesktop === 'true' ? 'hide-desktop' : ''} ${isFullWidthMobile ? 'full-width-mobile-fix' : ''}`}
            >
                <ResponsiveStyles id={carouselId} props={allProps} />
                <style dangerouslySetInnerHTML={{ __html: `
                    #${carouselId} {
                        --aspect-ratio: ${normalizeResponsive(aspectRatio).d !== 'auto' ? normalizeResponsive(aspectRatio).d : 'initial'};
                        --final-height: ${normalizeResponsive(aspectRatio).d === 'auto' ? 'var(--height)' : 'auto'};
                    }
                    div:has(> #${carouselId}),
                    div:has(> div > #${carouselId}),
                    div:has(> div > div > #${carouselId}),
                    div:has(> div > div > div > #${carouselId}),
                    [data-puck-dropzone]:has(#${carouselId}),
                    .puck-dropzone:has(#${carouselId}) {
                        background-color: transparent !important;
                        background: transparent !important;
                        border: none !important;
                        border-width: 0 !important;
                        box-shadow: none !important;
                        min-height: 0 !important;
                        padding: 0 !important;
                    }
                    @media (max-width: 1024px) {
                        #${carouselId} {
                            --aspect-ratio: ${(normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) !== 'auto' ? (normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) : 'initial'};
                            --final-height: ${(normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) === 'auto' ? 'var(--height)' : 'auto'};
                        }
                    }
                    @media (max-width: 640px) {
                        #${carouselId} {
                            --aspect-ratio: ${(normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) !== 'auto' ? (normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) : 'initial'};
                            --final-height: ${(normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) === 'auto' ? 'var(--height)' : 'auto'};
                        }
                        #${carouselId}.full-width-mobile-fix {
                            width: calc(100% + 48px) !important;
                            margin-left: -24px !important;
                            margin-right: -24px !important;
                        }
                        #${carouselId}.full-width-mobile-fix > div {
                            border-radius: 0px !important;
                            --final-radius: 0px;
                        }
                    }
                `}} />

                <div style={containerStyle}>
                    <div style={{ display: 'flex', height: '100%', transform: `translateX(-${safeIndex * 100}%)`, transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        {items.map((item: any, i: number) => {
                            const isAction = (item.sharePlatform && item.sharePlatform !== 'none') || !!item.href;
                            const image = <img src={item.src || 'https://via.placeholder.com/800x400'} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: objectFit as any, cursor: isAction ? 'pointer' : 'default' }} />
                            
                            const isAbove = captionPosition === 'above' || !captionPosition;
                            const isTopOverlay = captionPosition === 'top-overlay';
                            const isBottomOverlay = captionPosition === 'bottom-overlay';

                            let captionStyle: React.CSSProperties = {
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                pointerEvents: 'none',
                                zIndex: 2,
                                maxWidth: 'fit-content'
                            };

                            if (isAbove) {
                                captionStyle = {
                                    ...captionStyle,
                                    padding: '12px 16px',
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    width: '100%',
                                    maxWidth: '100%',
                                    textAlign: (textAlign || 'center') as any,
                                    color: 'var(--text-foreground, #ffffff)',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    boxSizing: 'border-box'
                                };
                            } else if (isTopOverlay) {
                                captionStyle = {
                                    ...captionStyle,
                                    position: 'absolute',
                                    top: '24px',
                                    left: '24px',
                                    right: '24px',
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '8px 14px',
                                    borderRadius: '8px'
                                };
                            } else {
                                captionStyle = {
                                    ...captionStyle,
                                    position: 'absolute',
                                    bottom: '40px',
                                    left: '24px',
                                    right: '24px',
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '8px 14px',
                                    borderRadius: '8px'
                                };
                            }

                            const caption = item.alt ? (
                                <div style={captionStyle}>
                                    {item.alt}
                                </div>
                            ) : null;

                            return (
                                <div key={i} style={{ 
                                    flex: '0 0 100%', 
                                    height: '100%', 
                                    position: 'relative', 
                                    backgroundColor: backgroundColor || 'transparent',
                                    display: isAbove ? 'flex' : 'block',
                                    flexDirection: 'column'
                                }}>
                                    {isAbove && caption}
                                    <div style={{ flex: isAbove ? 1 : 'none', height: isAbove ? '100%' : '100%', position: 'relative', overflow: 'hidden' }}>
                                        {isAction ? (
                                            <a href={item.href || '#'} target={item.target} style={{ display: 'block', height: '100%', position: 'relative' }}>
                                                {image}
                                                {!isAbove && caption}
                                            </a>
                                        ) : (
                                            <>
                                                {image}
                                                {!isAbove && caption}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {items.length > 1 && <CarouselArrows onPrev={() => setIndex((prev) => (prev - 1 + items.length) % items.length)} onNext={() => setIndex((prev) => (prev + 1) % items.length)} items={items} index={safeIndex} setIndex={setIndex} />}
                </div>
            </div>
        )
    }
}

export const Video = {
    fields: {
        uploadedVideo: { type: 'custom', label: 'Video Resource', render: VideoUpload },
        videoUrl: { type: 'text', label: 'External URL' },
        width: { type: 'custom', label: 'Width', render: ResponsiveInput },
        height: { type: 'custom', label: 'Height', render: ResponsiveInput },
        objectFit: { type: 'select', label: 'Object Fit', options: [{ label: 'Contain', value: 'contain' }, { label: 'Cover', value: 'cover' }, { label: 'Fill', value: 'fill' }] },
        display: { type: 'radio', label: 'Display', options: [{ label: 'Block', value: 'block' }, { label: 'Inline Block', value: 'inline-block' }, { label: 'Inline', value: 'inline' }] },
        textAlign: { type: 'custom', label: 'Alignment', render: (props: any) => (<ResponsiveRadio {...props} options={[{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }]} />) },
        hideOnDesktop: { type: 'radio', label: 'Hide on Desktop', options: [{ label: 'Show', value: 'false' }, { label: 'Hide', value: 'true' }] }
    },
    defaultProps: { uploadMethod: 'upload', uploadedVideo: '', videoUrl: '', width: { d: '100%', t: '', m: '' }, height: { d: 'auto', t: '', m: '' }, objectFit: 'contain', display: 'block', textAlign: { d: 'left', t: '', m: '' }, hideOnDesktop: 'false' },
    render: (allProps: any) => {
        const { uploadedVideo, videoUrl, objectFit, display, textAlign, hideOnDesktop, id } = allProps;
        const src = videoUrl || uploadedVideo
        const isYouTube = src?.includes('youtube.com') || src?.includes('youtu.be')
        const isVimeo = src?.includes('vimeo.com')
        let embedUrl = src
        if (isYouTube && src) { const videoId = src.includes('youtu.be') ? src.split('youtu.be/')[1]?.split('?')[0] : src.split('v=')[1]?.split('&')[0]; if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`; }
        if (isVimeo && src) { const videoId = src.split('vimeo.com/')[1]?.split('?')[0]; if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`; }
        const vidId = `vid-${(id || 'default').replace(/[:.]/g, '-')}`;
        return (
            <div id={vidId} style={{ textAlign: 'var(--text-align)' as any, display: display as any, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', overflow: 'hidden', width: '100%', marginTop: 'var(--margin-top)', marginBottom: 'var(--margin-bottom)' }} className={hideOnDesktop === 'true' ? 'hide-desktop' : ''}>
                <ResponsiveStyles id={vidId} props={allProps} />
                {(isYouTube || isVimeo) ? <iframe src={embedUrl} style={{ width: 'var(--width)', height: 'var(--height)', border: 'none', backgroundColor: '#000' }} allowFullScreen /> : <video src={src || 'https://www.w3schools.com/html/mov_bbb.mp4'} controls style={{ width: 'var(--width)', height: 'var(--height)', objectFit: objectFit as any, backgroundColor: '#000' }} />}
            </div>
        )
    }
}

export const VideoCarousel = {
    fields: {
        items: {
            type: "array", label: "Carousel Videos", getItemSummary: (item: any, index?: number) => item.alt || `Video ${index !== undefined ? index + 1 : ""}`,
            arrayFields: { type: { type: 'select', label: 'Source', options: [{ label: 'File Upload', value: 'upload' }, { label: 'External URL', value: 'url' }] }, uploadedVideo: { type: 'custom', label: 'Video File', render: VideoUpload }, videoUrl: { type: 'text', label: 'Video URL' }, alt: { type: 'text', label: 'Caption / Text Overlay' } },
            defaultItemProps: { type: 'url', videoUrl: '', uploadedVideo: '', alt: '' }
        },
        width: { type: 'custom', label: 'Width', render: ResponsiveInput }, height: { type: 'custom', label: 'Height', render: ResponsiveInput }, 
        backgroundColor: { type: 'custom', label: 'Background Color', render: ColorPicker },
        captionPosition: {
            type: 'select',
            label: 'Caption Position',
            options: [
                { label: 'Above Image (Title / Outside)', value: 'above' },
                { label: 'Top Overlay', value: 'top-overlay' },
                { label: 'Bottom Overlay', value: 'bottom-overlay' }
            ]
        },
        autoPlay: { type: 'radio', label: 'Auto Play', options: [{ label: 'On', value: 'true' }, { label: 'Off', value: 'false' }] }, interval: { type: 'number', label: 'Interval (ms)' }, 
        aspectRatio: {
            type: 'custom',
            label: 'Aspect Ratio',
            render: (props: any) => (
                <ResponsiveRadio 
                    {...props} 
                    options={[
                        { label: 'Auto', value: 'auto' },
                        { label: '16:9', value: '16/9' },
                        { label: '4:3', value: '4/3' },
                        { label: '1:1', value: '1/1' },
                        { label: '21:9', value: '21/9' }
                    ]} 
                />
            )
        },
        borderRadius: { type: 'text', label: 'Border Radius (e.g. 12px)' },
        borderWidth: { type: 'text', label: 'Border Width (e.g. 1px)' },
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
        borderColor: { type: 'custom', label: 'Border Color', render: ColorPicker },
        boxShadow: { type: 'text', label: 'Box Shadow' },
        padding: { type: 'text', label: 'Container Padding (e.g. 8px 16px)' },
        objectFit: { type: 'select', label: 'Object Fit', options: [{ label: 'Contain', value: 'contain' }, { label: 'Cover', value: 'cover' }, { label: 'Fill', value: 'fill' }] }, display: { type: 'radio', label: 'Display', options: [{ label: 'Block', value: 'block' }, { label: 'Inline Block', value: 'inline-block' }, { label: 'Inline', value: 'inline' }] }, textAlign: { type: 'custom', label: 'Alignment', render: (props: any) => (<ResponsiveRadio {...props} options={[{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }]} />) }, hideOnDesktop: { type: 'radio', label: 'Hide on Desktop', options: [{ label: 'Show', value: 'false' }, { label: 'Hide', value: 'true' }] }, marginTop: { type: 'custom', label: 'Margin Top', render: ResponsiveInput }, marginBottom: { type: 'custom', label: 'Margin Bottom', render: ResponsiveInput }
    },
    defaultProps: { items: [{ uploadMethod: 'url', videoUrl: '', alt: 'Video 1' }], width: { d: '100%', t: '', m: '' }, height: { d: '350px', t: '300px', m: '250px' }, backgroundColor: 'transparent', captionPosition: 'above', autoPlay: 'false', interval: 5000, aspectRatio: { d: 'auto', t: 'auto', m: 'auto' }, borderRadius: '12px', borderWidth: '0px', borderStyle: 'none', borderColor: 'transparent', boxShadow: 'none', padding: '0px', objectFit: 'cover', display: 'block', textAlign: { d: 'left', t: '', m: '' }, hideOnDesktop: 'false', marginTop: { d: '0px', t: '', m: '' }, marginBottom: { d: '0px', t: '', m: '' } },

    render: (allProps: any) => {
        const { items, autoPlay, interval, backgroundColor, captionPosition, objectFit, display, textAlign, hideOnDesktop, id, borderRadius, borderWidth, borderStyle, borderColor, boxShadow, padding } = allProps;
        const [index, setIndex] = useState(0)
        React.useEffect(() => { if (autoPlay === 'true' && items && items.length > 1) { const timer = setInterval(() => { setIndex((prev) => (prev + 1) % items.length) }, interval || 5000); return () => clearInterval(timer); } }, [autoPlay, interval, items])
        const carouselId = `vcar-${(id || 'default').replace(/[:.]/g, '-')}`;
        if (!items || items.length === 0) return <div style={{ height: '200px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#64748b' }}>No videos.</div>
        const safeIndex = (index >= items.length) ? 0 : index;
        const { aspectRatio } = allProps;

        return (
            <div id={carouselId} style={{ textAlign: 'var(--text-align)' as any, display: display as any, width: '100%', marginTop: 'var(--margin-top)', marginBottom: 'var(--margin-bottom)', lineHeight: 0 }} className={hideOnDesktop === 'true' ? 'hide-desktop' : ''}>
                <ResponsiveStyles id={carouselId} props={allProps} />
                <style dangerouslySetInnerHTML={{ __html: `
                    #${carouselId} {
                        --aspect-ratio: ${normalizeResponsive(aspectRatio).d !== 'auto' ? normalizeResponsive(aspectRatio).d : 'initial'};
                        --final-height: ${normalizeResponsive(aspectRatio).d === 'auto' ? 'var(--height)' : 'auto'};
                    }
                    div:has(> #${carouselId}),
                    div:has(> div > #${carouselId}),
                    div:has(> div > div > #${carouselId}),
                    div:has(> div > div > div > #${carouselId}),
                    [data-puck-dropzone]:has(#${carouselId}),
                    .puck-dropzone:has(#${carouselId}) {
                        background-color: transparent !important;
                        background: transparent !important;
                        border: none !important;
                        border-width: 0 !important;
                        box-shadow: none !important;
                        min-height: 0 !important;
                        padding: 0 !important;
                    }
                    @media (max-width: 1024px) {
                        #${carouselId} {
                            --aspect-ratio: ${(normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) !== 'auto' ? (normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) : 'initial'};
                            --final-height: ${(normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) === 'auto' ? 'var(--height)' : 'auto'};
                        }
                    }
                    @media (max-width: 640px) {
                        #${carouselId} {
                            --aspect-ratio: ${(normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) !== 'auto' ? (normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) : 'initial'};
                            --final-height: ${(normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) === 'auto' ? 'var(--height)' : 'auto'};
                        }
                    }
                `}} />
                <div style={{ position: 'relative', width: 'var(--width)', height: 'var(--final-height)', aspectRatio: 'var(--aspect-ratio)', overflow: 'hidden', borderRadius: borderRadius || '12px', border: borderStyle !== 'none' ? `${borderWidth} ${borderStyle} ${borderColor}` : 'none', boxShadow: boxShadow || 'none', padding: padding || '0px', display: 'block', backgroundColor: backgroundColor || 'transparent' }}>
                    <div style={{ display: 'flex', height: '100%', transform: `translateX(-${safeIndex * 100}%)`, transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        {items.map((item: any, i: number) => {
                            const src = item.videoUrl || item.uploadedVideo;
                            const isYouTube = src?.includes('youtube.com') || src?.includes('youtu.be');
                            const isVimeo = src?.includes('vimeo.com');
                            let embedUrl = src;
                            if (isYouTube && src) { const videoId = src.includes('youtu.be') ? src.split('youtu.be/')[1]?.split('?')[0] : src.split('v=')[1]?.split('&')[0]; if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`; }
                            if (isVimeo && src) { const videoId = src.split('vimeo.com/')[1]?.split('?')[0]; if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`; }
                            
                            const isAbove = captionPosition === 'above' || !captionPosition;
                            const isTopOverlay = captionPosition === 'top-overlay';
                            const isBottomOverlay = captionPosition === 'bottom-overlay';

                            let captionStyle: React.CSSProperties = {
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                pointerEvents: 'none',
                                zIndex: 2,
                                maxWidth: 'fit-content'
                            };

                            if (isAbove) {
                                captionStyle = {
                                    ...captionStyle,
                                    padding: '12px 16px',
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    width: '100%',
                                    maxWidth: '100%',
                                    textAlign: (textAlign || 'center') as any,
                                    color: 'var(--text-foreground, #ffffff)',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    boxSizing: 'border-box'
                                };
                            } else if (isTopOverlay) {
                                captionStyle = {
                                    ...captionStyle,
                                    position: 'absolute',
                                    top: '24px',
                                    left: '24px',
                                    right: '24px',
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '8px 14px',
                                    borderRadius: '8px'
                                };
                            } else {
                                captionStyle = {
                                    ...captionStyle,
                                    position: 'absolute',
                                    bottom: '40px',
                                    left: '24px',
                                    right: '24px',
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '8px 14px',
                                    borderRadius: '8px'
                                };
                            }

                            const caption = item.alt ? (
                                <div style={captionStyle}>
                                    {item.alt}
                                </div>
                            ) : null;

                            return (
                                <div key={i} style={{ 
                                    flex: '0 0 100%', 
                                    height: '100%', 
                                    position: 'relative', 
                                    backgroundColor: backgroundColor || 'transparent',
                                    display: isAbove ? 'flex' : 'block',
                                    flexDirection: 'column'
                                }}>
                                    {isAbove && caption}
                                    <div style={{ flex: isAbove ? 1 : 'none', height: isAbove ? '100%' : '100%', position: 'relative', overflow: 'hidden' }}>
                                        {(isYouTube || isVimeo) ? (
                                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                                <iframe src={embedUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                                                {!isAbove && caption}
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                                <video src={src || undefined} controls style={{ width: '100%', height: '100%', objectFit: objectFit as any }} />
                                                {!isAbove && caption}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {items.length > 1 && <CarouselArrows onPrev={() => setIndex((prev) => (prev - 1 + items.length) % items.length)} onNext={() => setIndex((prev) => (prev + 1) % items.length)} items={items} index={safeIndex} setIndex={setIndex} />}
                </div>
            </div>
        )
    }
}

export const MediaCarousel = {
    fields: {
        items: {
            type: "array", label: "Items", getItemSummary: (item: any, index?: number) => `${item.type === 'video' ? '🎥' : '📷'} ${item.alt || (item.type === 'video' ? 'Video' : 'Image')} ${index !== undefined ? index + 1 : ""}`,
            arrayFields: { type: { type: 'select', label: 'Type', options: [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }] }, src: { type: 'custom', label: 'Image', render: ImageUpload }, uploadedVideo: { type: 'custom', label: 'Video File', render: VideoUpload }, videoUrl: { type: 'text', label: 'Video URL' }, alt: { type: 'text', label: 'Caption / Text Overlay' }, href: { type: 'text', label: 'Link URL' }, sharePlatform: { type: 'select', label: 'Share', options: [{ label: 'None', value: 'none' }, { label: 'Facebook', value: 'facebook' }, { label: 'Twitter/X', value: 'twitter' }] }, target: { type: 'radio', label: 'Open in', options: [{ label: 'Same Tab', value: '_self' }, { label: 'New Tab', value: '_blank' }] } },
            defaultItemProps: { type: 'image', src: '', videoUrl: '', uploadedVideo: '', alt: '', href: '', sharePlatform: 'none', target: '_self' }
        },
        width: { type: 'custom', label: 'Width', render: ResponsiveInput }, height: { type: 'custom', label: 'Height', render: ResponsiveInput }, 
        backgroundColor: { type: 'custom', label: 'Background Color', render: ColorPicker },
        captionPosition: {
            type: 'select',
            label: 'Caption Position',
            options: [
                { label: 'Above Image (Title / Outside)', value: 'above' },
                { label: 'Top Overlay', value: 'top-overlay' },
                { label: 'Bottom Overlay', value: 'bottom-overlay' }
            ]
        },
        autoPlay: { type: 'radio', label: 'Auto Play', options: [{ label: 'On', value: 'true' }, { label: 'Off', value: 'false' }] }, interval: { type: 'number', label: 'Interval (ms)' }, 
        aspectRatio: {
            type: 'custom',
            label: 'Aspect Ratio',
            render: (props: any) => (
                <ResponsiveRadio 
                    {...props} 
                    options={[
                        { label: 'Auto', value: 'auto' },
                        { label: '16:9', value: '16/9' },
                        { label: '4:3', value: '4/3' },
                        { label: '1:1', value: '1/1' },
                        { label: '21:9', value: '21/9' }
                    ]} 
                />
            )
        },
        borderRadius: { type: 'text', label: 'Border Radius (e.g. 12px)' },
        borderWidth: { type: 'text', label: 'Border Width (e.g. 1px)' },
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
        borderColor: { type: 'custom', label: 'Border Color', render: ColorPicker },
        boxShadow: { type: 'text', label: 'Box Shadow' },
        padding: { type: 'text', label: 'Container Padding (e.g. 8px 16px)' },
        objectFit: { type: 'select', label: 'Object Fit', options: [{ label: 'Contain', value: 'contain' }, { label: 'Cover', value: 'cover' }, { label: 'Fill', value: 'fill' }] }, display: { type: 'radio', label: 'Display', options: [{ label: 'Block', value: 'block' }, { label: 'Inline Block', value: 'inline-block' }, { label: 'Inline', value: 'inline' }] }, textAlign: { type: 'custom', label: 'Alignment', render: (props: any) => (<ResponsiveRadio {...props} options={[{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }]} />) }, hideOnDesktop: { type: 'radio', label: 'Hide on Desktop', options: [{ label: 'Show', value: 'false' }, { label: 'Hide', value: 'true' }] }, marginTop: { type: 'custom', label: 'Margin Top', render: ResponsiveInput }, marginBottom: { type: 'custom', label: 'Margin Bottom', render: ResponsiveInput },
        fullWidthMobile: {
            type: 'radio',
            label: 'Full Width Mobile',
            options: [
                { label: 'Edge-to-Edge', value: 'true' },
                { label: 'Indented (Default)', value: 'false' }
            ]
        }
    },
    defaultProps: {
        items: [{ type: 'image', src: '', alt: 'Nature' }, { type: 'video', uploadMethod: 'url', videoUrl: '', alt: 'Big Buck Bunny' }],
        width: { d: '100%', t: '', m: '100%' }, height: { d: '350px', t: '300px', m: '250px' }, backgroundColor: 'transparent', captionPosition: 'above', autoPlay: 'false', interval: 5000,
        aspectRatio: { d: 'auto', t: 'auto', m: 'auto' }, borderRadius: '12px', borderWidth: '0px', borderStyle: 'none', borderColor: 'transparent', boxShadow: 'none', padding: '0px',
        objectFit: 'cover', display: 'block', textAlign: 'left', hideOnDesktop: 'false', marginTop: { d: '0px', t: '', m: '' }, marginBottom: { d: '0px', t: '', m: '' },
        fullWidthMobile: 'false'
    },

    render: (allProps: any) => {
        const { items, autoPlay, interval, backgroundColor, captionPosition, objectFit, display, textAlign, hideOnDesktop, id, aspectRatio, borderRadius, borderWidth, borderStyle, borderColor, boxShadow, padding } = allProps;
        const [index, setIndex] = useState(0)
        React.useEffect(() => {
            if (autoPlay === 'true' && items && items.length > 1) {
                const timer = setInterval(() => { setIndex((prev) => (prev + 1) % items.length) }, interval || 5000)
                return () => clearInterval(timer)
            }
        }, [autoPlay, interval, items])
        const carouselId = `mcar-${(id || 'default').replace(/[:.]/g, '-')}`;

        if (!items || items.length === 0) return <div id={carouselId} style={{ height: 'var(--height)', minHeight: '200px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#64748b' }}><ResponsiveStyles id={carouselId} props={allProps} />No items.</div>
        const safeIndex = (index >= items.length) ? 0 : index;
        const isFullWidthMobile = allProps.fullWidthMobile === 'true';

        return (
            <div 
                id={carouselId} 
                style={{ 
                    textAlign: 'var(--text-align)' as any, 
                    display: display as any, 
                    width: '100%', 
                    marginTop: 'var(--margin-top)', 
                    marginBottom: 'var(--margin-bottom)',
                    lineHeight: 0
                }} 
                className={`${hideOnDesktop === 'true' ? 'hide-desktop' : ''} ${isFullWidthMobile ? 'full-width-mobile-fix' : ''}`}
            >
                <ResponsiveStyles id={carouselId} props={allProps} />
                <style dangerouslySetInnerHTML={{ __html: `
                    #${carouselId} {
                        --aspect-ratio: ${normalizeResponsive(aspectRatio).d !== 'auto' ? normalizeResponsive(aspectRatio).d : 'initial'};
                        --final-height: ${normalizeResponsive(aspectRatio).d === 'auto' ? 'var(--height)' : 'auto'};
                    }
                    div:has(> #${carouselId}),
                    div:has(> div > #${carouselId}),
                    div:has(> div > div > #${carouselId}),
                    div:has(> div > div > div > #${carouselId}),
                    [data-puck-dropzone]:has(#${carouselId}),
                    .puck-dropzone:has(#${carouselId}) {
                        background-color: transparent !important;
                        background: transparent !important;
                        border: none !important;
                        border-width: 0 !important;
                        box-shadow: none !important;
                        min-height: 0 !important;
                        padding: 0 !important;
                    }
                    @media (max-width: 1024px) {
                        #${carouselId} {
                            --aspect-ratio: ${(normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) !== 'auto' ? (normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) : 'initial'};
                            --final-height: ${(normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) === 'auto' ? 'var(--height)' : 'auto'};
                        }
                    }
                    @media (max-width: 640px) {
                        #${carouselId} {
                            --aspect-ratio: ${(normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) !== 'auto' ? (normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) : 'initial'};
                            --final-height: ${(normalizeResponsive(aspectRatio).m || normalizeResponsive(aspectRatio).t || normalizeResponsive(aspectRatio).d) === 'auto' ? 'var(--height)' : 'auto'};
                        }
                        #${carouselId}.full-width-mobile-fix {
                            width: calc(100% + 48px) !important;
                            margin-left: -24px !important;
                            margin-right: -24px !important;
                        }
                        #${carouselId}.full-width-mobile-fix > div {
                            border-radius: 0px !important;
                        }
                    }
                `}} />
                <div style={{ position: 'relative', width: 'var(--width)', height: 'var(--final-height)', aspectRatio: 'var(--aspect-ratio)', overflow: 'hidden', borderRadius: borderRadius || '12px', border: borderStyle !== 'none' ? `${borderWidth} ${borderStyle} ${borderColor}` : 'none', boxShadow: boxShadow || 'none', padding: padding || '0px', display: 'block', backgroundColor: backgroundColor || 'transparent' }}>

                    <div style={{ display: 'flex', height: '100%', transform: `translateX(-${safeIndex * 100}%)`, transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        {items.map((item: any, i: number) => {
                            const isAction = (item.sharePlatform && item.sharePlatform !== 'none') || !!item.href;
                            const media = item.type === 'video' ? <video src={item.uploadedVideo || item.videoUrl || undefined} controls style={{ width: '100%', height: '100%', objectFit: objectFit as any }} /> : <img src={item.src || undefined} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: objectFit as any }} />
                            
                            const isAbove = captionPosition === 'above' || !captionPosition;
                            const isTopOverlay = captionPosition === 'top-overlay';
                            const isBottomOverlay = captionPosition === 'bottom-overlay';

                            let captionStyle: React.CSSProperties = {
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                pointerEvents: 'none',
                                zIndex: 2,
                                maxWidth: 'fit-content'
                            };

                            if (isAbove) {
                                captionStyle = {
                                    ...captionStyle,
                                    padding: '12px 16px',
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    width: '100%',
                                    maxWidth: '100%',
                                    textAlign: (textAlign || 'center') as any,
                                    color: 'var(--text-foreground, #ffffff)',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    boxSizing: 'border-box'
                                };
                            } else if (isTopOverlay) {
                                captionStyle = {
                                    ...captionStyle,
                                    position: 'absolute',
                                    top: '24px',
                                    left: '24px',
                                    right: '24px',
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '8px 14px',
                                    borderRadius: '8px'
                                };
                            } else {
                                captionStyle = {
                                    ...captionStyle,
                                    position: 'absolute',
                                    bottom: '40px',
                                    left: '24px',
                                    right: '24px',
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '8px 14px',
                                    borderRadius: '8px'
                                };
                            }

                            const caption = item.alt ? (
                                <div style={captionStyle}>
                                    {item.alt}
                                </div>
                             ) : null;

                            return (
                                <div key={i} style={{ 
                                    flex: '0 0 100%', 
                                    height: '100%', 
                                    position: 'relative', 
                                    backgroundColor: backgroundColor || 'transparent',
                                    display: isAbove ? 'flex' : 'block',
                                    flexDirection: 'column'
                                }}>
                                    {isAbove && caption}
                                    <div style={{ flex: isAbove ? 1 : 'none', height: isAbove ? '100%' : '100%', position: 'relative', overflow: 'hidden' }}>
                                        {isAction ? (
                                            <a href={item.href || '#'} style={{ display: 'block', height: '100%', position: 'relative' }}>
                                                {media}
                                                {!isAbove && caption}
                                            </a>
                                        ) : (
                                            <>
                                                {media}
                                                {!isAbove && caption}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {items.length > 1 && <CarouselArrows onPrev={() => setIndex((prev) => (prev - 1 + items.length) % items.length)} onNext={() => setIndex((prev) => (prev + 1) % items.length)} items={items} index={safeIndex} setIndex={setIndex} />}
                </div>
            </div>
        )
    }
}
