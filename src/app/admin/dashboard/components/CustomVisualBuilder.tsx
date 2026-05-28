'use client'
import React, { useState, useEffect, useTransition, useRef } from 'react'
import {
    DndContext,
    closestCenter,
    closestCorners,
    pointerWithin,
    rectIntersection,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
    useDraggable,
    useDroppable
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import {
    Monitor,
    Tablet,
    Smartphone,
    Plus,
    Copy,
    Trash2,
    Eye,
    Settings,
    Layers,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Undo,
    Redo,
    Maximize,
    FolderPlus,
    LayoutGrid,
    Type,
    Image as ImageIcon,
    Grid,
    Settings2
} from 'lucide-react'
import config from './puck-config'
import { SortableBlockWrapper } from './SortableBlockWrapper'
import { SortableZone } from './SortableZone'

// Custom pickers from core
import {
    ColorPicker,
    ResponsiveInput,
    ResponsiveRadio,
    RangeInput,
    ImageUpload,
    VideoUpload
} from './puck-blocks/core'

interface Block {
    id: string
    type: string
    props: Record<string, any>
}

interface PageData {
    content: Block[]
    root: { props: Record<string, any> }
    zones?: Record<string, Block[]>
}

interface CustomVisualBuilderProps {
    initialData: PageData
    onSave: (data: PageData) => void
    title: string
}

interface BuilderContextType {
    data: PageData
    selectedId: string | null
    setSelectedId: (id: string | null) => void
    handleDelete: (id: string) => void
    handleDuplicate: (id: string) => void
    handleAddBlock: (type: string, targetZoneId?: string) => void
    renderBlockItem: (block: Block, containerId: string) => React.ReactNode
}

const BuilderContext = React.createContext<BuilderContextType | null>(null)
const BlockContext = React.createContext<{ blockId: string } | null>(null)

const SharedDropZone = ({ zone }: { zone: string }) => {
    const blockCtx = React.useContext(BlockContext)
    const builderCtx = React.useContext(BuilderContext)
    if (!blockCtx || !builderCtx) return null
    const { blockId } = blockCtx
    const { data, selectedId, setSelectedId, handleDelete, handleDuplicate, renderBlockItem, handleAddBlock } = builderCtx

    const zoneId = `${blockId}:${zone}`
    return (
        <SortableZone
            zoneId={zoneId}
            items={data.zones?.[zoneId] || []}
            onSelectItem={setSelectedId}
            selectedId={selectedId}
            onDeleteItem={handleDelete}
            onDuplicateItem={handleDuplicate}
            renderBlock={(b) => renderBlockItem(b, zoneId)}
            onAddClick={() => {
                const element = prompt(`Add element to ${zoneId}:\n${Object.keys(config.components).join(', ')}`)
                if (element && config.components[element]) {
                    handleAddBlock(element, zoneId)
                }
            }}
        />
    )
}

const cleanId = (id: string): string => {
    if (!id) return id
    if (id.startsWith('outline-zone-')) return id.replace('outline-zone-', '')
    if (id.startsWith('outline-')) return id.replace('outline-', '')
    return id
}

interface SortableOutlineItemProps {
    block: Block
    indent: number
    isSelected: boolean
    onSelect: () => void
    onDuplicate: () => void
    onDelete: () => void
    children?: React.ReactNode
}

function SortableOutlineItem({
    block,
    indent,
    isSelected,
    onSelect,
    onDuplicate,
    onDelete,
    children
}: SortableOutlineItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: `outline-${block.id}` })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        position: 'relative'
    }

    return (
        <div ref={setNodeRef} style={style} className="group/outline w-full select-none">
            <div
                onClick={onSelect}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                    isSelected
                        ? 'bg-[#ccff00]/10 border border-[#ccff00]/25 text-[#ccff00]'
                        : 'hover:bg-zinc-900 text-slate-400 hover:text-white border border-transparent'
                }`}
            >
                <div className="flex items-center gap-1.5 min-w-0">
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-0.5 hover:bg-zinc-850 rounded text-zinc-550 hover:text-zinc-250 cursor-grab active:cursor-grabbing opacity-0 group-hover/outline:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical size={11} />
                    </button>
                    <span className="text-[10px] font-mono uppercase font-black truncate max-w-[120px]">
                        {block.type}
                    </span>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover/outline:opacity-100 transition-opacity">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDuplicate()
                        }}
                        className="p-1 hover:bg-zinc-850 rounded text-zinc-500 hover:text-white"
                        title="Duplicate Block"
                    >
                        <Copy size={11} />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete()
                        }}
                        className="p-1 hover:bg-zinc-850 rounded text-zinc-500 hover:text-red-400"
                        title="Delete Block"
                    >
                        <Trash2 size={11} />
                    </button>
                </div>
            </div>
            {children}
        </div>
    )
}

interface SortableOutlineZoneProps {
    zoneId: string
    children: React.ReactNode
}

function SortableOutlineZone({ zoneId, children }: SortableOutlineZoneProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `outline-zone-${zoneId}`
    })

    return (
        <div
            ref={setNodeRef}
            className={`rounded-lg transition-colors p-1 ${
                isOver ? 'bg-[#ccff00]/5 border border-dashed border-[#ccff00]/30 shadow-[0_0_10px_rgba(204,255,0,0.02)]' : ''
            }`}
        >
            {children}
        </div>
    )
}

interface DraggableElementProps {
    type: string
    onClick: () => void
    children: React.ReactNode
}

function DraggableElement({ type, onClick, children }: DraggableElementProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `new-${type}`
    })

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={onClick}
            style={{
                opacity: isDragging ? 0.4 : 1,
                cursor: 'grab'
            }}
            className="w-full h-full flex flex-col"
        >
            {children}
        </div>
    )
}

const sanitizePageData = (initialData: PageData): PageData => {
    const cleanData = JSON.parse(JSON.stringify(initialData || {}))
    if (!cleanData.content) cleanData.content = []
    if (!cleanData.root) cleanData.root = { props: {} }
    if (!cleanData.zones) cleanData.zones = {}

    const usedIds = new Set<string>()

    const ensureUniqueId = (block: any, prefix: string) => {
        let id = block.id
        if (!id || id === 'placeholder-block' || usedIds.has(id)) {
            id = `${block.type || prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }
        usedIds.add(id)
        block.id = id
    }

    cleanData.content.forEach((block: any) => {
        ensureUniqueId(block, 'block')
    })

    for (const [zoneId, zoneItems] of Object.entries(cleanData.zones)) {
        if (Array.isArray(zoneItems)) {
            zoneItems.forEach((block: any) => {
                ensureUniqueId(block, 'sub-block')
            })
        }
    }

    return cleanData
}

const pointerSensorOptions = {
    activationConstraint: {
        distance: 8
    }
}

const keyboardSensorOptions = {
    coordinateGetter: sortableKeyboardCoordinates
}

const customCollisionDetection = (args: any) => {
    // 1. First check pointer intersections
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) {
        // Prioritize nested zones (IDs with colons, e.g., "blockId:zoneName")
        const nested = pointerCollisions.find(
            (c: any) => typeof c.id === 'string' && c.id.includes(':')
        )
        if (nested) return [nested]
        return pointerCollisions
    }

    // 2. Fallback to rect intersections
    const rectCollisions = rectIntersection(args)
    if (rectCollisions.length > 0) {
        const nested = rectCollisions.find(
            (c: any) => typeof c.id === 'string' && c.id.includes(':')
        )
        if (nested) return [nested]
        return rectCollisions
    }

    // 3. Last fallback to closest corners
    return closestCorners(args)
}

export function CustomVisualBuilder({
    initialData,
    onSave,
    title
}: CustomVisualBuilderProps) {
    const [data, setData] = useState<PageData>(() => {
        return sanitizePageData(initialData)
    })

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'elements' | 'outline'>('elements')
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [activeDragId, setActiveDragId] = useState<string | null>(null)
    
    const dragStartStateRef = useRef<PageData | null>(null)

    const { setNodeRef: setCanvasRef } = useDroppable({
        id: 'content'
    })

    // Find container for a block or zone
    const findContainer = (id: string): string => {
        if (id === 'content') return 'content'
        if (id.startsWith('new-')) return 'sidebar'
        if (id.includes(':')) return id // is a zone ID

        // Search top level content
        const topBlock = data.content.find((b) => b.id === id)
        if (topBlock) return 'content'
        
        // Search inside zones
        if (data.zones) {
            for (const [zoneId, zoneItems] of Object.entries(data.zones)) {
                if (zoneItems.find((b) => b.id === id)) {
                    return zoneId
                }
            }
        }
        return ''
    }

    // Helper to remove placeholder block from all content/zones
    const removePlaceholder = (currentData: PageData): PageData => {
        const nextZones = { ...currentData.zones }
        const nextContent = currentData.content.filter((b) => b.id !== 'placeholder-block')
        if (nextZones) {
            for (const zoneId of Object.keys(nextZones)) {
                nextZones[zoneId] = nextZones[zoneId].filter((b) => b.id !== 'placeholder-block')
            }
        }
        return {
            ...currentData,
            content: nextContent,
            zones: nextZones
        }
    }

    const getDragLabel = () => {
        if (!activeDragId) return ''
        if (activeDragId.startsWith('new-')) {
            return activeDragId.replace('new-', '')
        }
        const blockInfo = findBlock(activeDragId)
        return blockInfo?.block.type || ''
    }
    
    // Undo/Redo history
    const [history, setHistory] = useState<PageData[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    
    // UI elements section expand collapse
    const [expandedCategories, setExpandedCategories] = useState({
        Structure: true,
        Typography: true,
        Media: true,
        Special: true
    })

    // Set viewport on window for the responsive components
    useEffect(() => {
        const width = viewport === 'mobile' ? 375 : viewport === 'tablet' ? 768 : 1200
        if (typeof window !== 'undefined') {
            ;(window as any).__builderViewportWidth = width
            // Trigger storage event or force component updates
            window.dispatchEvent(new Event('resize'))
        }
    }, [viewport])

    // Update history when data changes (skip if it was undo/redo)
    const updateData = (newData: PageData) => {
        setData(newData)
        const nextHistory = history.slice(0, historyIndex + 1)
        setHistory([...nextHistory, newData])
        setHistoryIndex(nextHistory.length)
    }

    // Sensors for drag-and-drop
    const sensors = useSensors(
        useSensor(PointerSensor, pointerSensorOptions),
        useSensor(KeyboardSensor, keyboardSensorOptions)
    )

    // Undo action
    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1)
            setData(history[historyIndex - 1])
        }
    }

    // Redo action
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1)
            setData(history[historyIndex + 1])
        }
    }

    // Initial history push
    useEffect(() => {
        if (history.length === 0) {
            setHistory([data])
            setHistoryIndex(0)
        }
    }, [])

    // Find block by ID in content or zones
    const findBlock = (id: string): { block: Block; containerId: string } | null => {
        // Search top level content
        const topBlock = data.content.find((b) => b.id === id)
        if (topBlock) {
            return { block: topBlock, containerId: 'content' }
        }
        
        // Search inside zones
        if (data.zones) {
            for (const [zoneId, zoneItems] of Object.entries(data.zones)) {
                const zoneBlock = zoneItems.find((b) => b.id === id)
                if (zoneBlock) {
                    return { block: zoneBlock, containerId: zoneId }
                }
            }
        }
        return null
    }

    // Delete a block by ID
    const handleDelete = (id: string) => {
        const result = findBlock(id)
        if (!result) return

        const { containerId } = result
        const cleanZones = { ...data.zones }

        if (containerId === 'content') {
            const nextContent = data.content.filter((b) => b.id !== id)
            updateData({
                ...data,
                content: nextContent,
                zones: cleanZones
            })
        } else {
            cleanZones[containerId] = cleanZones[containerId].filter((b) => b.id !== id)
            updateData({
                ...data,
                zones: cleanZones
            })
        }
        
        if (selectedId === id) {
            setSelectedId(null)
        }
    }

    // Duplicate a block by ID
    const handleDuplicate = (id: string) => {
        const result = findBlock(id)
        if (!result) return

        const { block, containerId } = result
        const newId = `${block.type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        const duplicatedBlock: Block = {
            ...block,
            id: newId,
            props: JSON.parse(JSON.stringify(block.props))
        }

        const cleanZones = { ...data.zones }

        if (containerId === 'content') {
            const idx = data.content.findIndex((b) => b.id === id)
            const nextContent = [...data.content]
            nextContent.splice(idx + 1, 0, duplicatedBlock)
            updateData({
                ...data,
                content: nextContent
            })
        } else {
            const idx = cleanZones[containerId].findIndex((b) => b.id === id)
            const nextZoneItems = [...cleanZones[containerId]]
            nextZoneItems.splice(idx + 1, 0, duplicatedBlock)
            cleanZones[containerId] = nextZoneItems
            updateData({
                ...data,
                zones: cleanZones
            })
        }
        setSelectedId(newId)
    }

    // Add element to canvas / zone
    const handleAddBlock = (type: string, targetZoneId?: string) => {
        const componentConfig = config.components[type]
        if (!componentConfig) return

        const newId = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        const newBlock: Block = {
            id: newId,
            type,
            props: JSON.parse(JSON.stringify(componentConfig.defaultProps || {}))
        }

        if (targetZoneId && targetZoneId !== 'content') {
            const nextZones = { ...data.zones }
            if (!nextZones[targetZoneId]) nextZones[targetZoneId] = []
            nextZones[targetZoneId] = [...nextZones[targetZoneId], newBlock]
            updateData({
                ...data,
                zones: nextZones
            })
        } else {
            updateData({
                ...data,
                content: [...data.content, newBlock]
            })
        }
        setSelectedId(newId)
    }

    // Update block props
    const handleUpdateProp = (id: string, path: string[], value: any, shouldCommit = false) => {
        const result = findBlock(id)
        if (!result) return

        const { block, containerId } = result
        const updatedProps = { ...block.props }
        
        // Deep set value by path
        let current = updatedProps
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i]
            if (!current[key]) current[key] = {}
            current[key] = { ...current[key] }
            current = current[key]
        }
        current[path[path.length - 1]] = value

        const nextZones = { ...data.zones }
        let nextData: PageData

        if (containerId === 'content') {
            const nextContent = data.content.map((b) => 
                b.id === id ? { ...b, props: updatedProps } : b
            )
            nextData = {
                ...data,
                content: nextContent
            }
        } else {
            nextZones[containerId] = nextZones[containerId].map((b) =>
                b.id === id ? { ...b, props: updatedProps } : b
            )
            nextData = {
                ...data,
                zones: nextZones
            }
        }

        if (shouldCommit) {
            updateData(nextData)
        } else {
            setData(nextData)
        }
    }

    // Finish form changes on blur (commit to history)
    const handleCommitChanges = () => {
        updateData(data)
    }

    // Drag start
    const handleDragStart = (event: DragStartEvent) => {
        const id = cleanId(event.active.id as string)
        setActiveDragId(id)
        dragStartStateRef.current = JSON.parse(JSON.stringify(data))
    }

    // Drag over handler for cross-container live-sorting and sidebar dragging placeholders
    const handleDragOver = (event: any) => {
        const { active, over } = event
        if (!over) {
            const activeIdClean = cleanId(active.id as string)
            if (activeIdClean.startsWith('new-')) {
                setData(prev => removePlaceholder(prev))
            }
            return
        }

        const activeId = cleanId(active.id as string)
        const overId = cleanId(over.id as string)
        if (activeId === overId) return

        // Case 1: Dragging a new element from the sidebar
        if (activeId.startsWith('new-')) {
            const componentType = activeId.replace('new-', '')
            const componentConfig = config.components[componentType]
            if (!componentConfig) return

            const placeholderId = 'placeholder-block'
            const overContainer = findContainer(overId)
            if (!overContainer || overContainer === 'sidebar') {
                setData(prev => removePlaceholder(prev))
                return
            }

            const placeholderBlock: Block = {
                id: placeholderId,
                type: componentType,
                props: JSON.parse(JSON.stringify(componentConfig.defaultProps || {}))
            }

            const currentContainer = findContainer(placeholderId)
            const nextZones = { ...data.zones }
            let nextContent = [...data.content]

            if (currentContainer === overContainer) {
                // Same container, reorder placeholder-block with overId
                const items = overContainer === 'content' ? nextContent : [...(nextZones[overContainer] || [])]
                const oldIndex = items.findIndex((b) => b.id === placeholderId)
                const newIndex = items.findIndex((b) => b.id === overId)

                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    const reordered = arrayMove(items, oldIndex, newIndex)
                    if (overContainer === 'content') {
                        nextContent = reordered
                    } else {
                        nextZones[overContainer] = reordered
                    }
                    setData({
                        ...data,
                        content: nextContent,
                        zones: nextZones
                    })
                }
            } else {
                // Different container, remove from old and insert into new
                if (currentContainer) {
                    if (currentContainer === 'content') {
                        nextContent = nextContent.filter((b) => b.id !== placeholderId)
                    } else if (nextZones[currentContainer]) {
                        nextZones[currentContainer] = nextZones[currentContainer].filter((b) => b.id !== placeholderId)
                    }
                }

                // Insert into new container
                const targetItems = overContainer === 'content' ? nextContent : [...(nextZones[overContainer] || [])]
                let insertIndex = targetItems.length
                if (overId !== overContainer) {
                    insertIndex = targetItems.findIndex((b) => b.id === overId)
                    if (insertIndex === -1) insertIndex = targetItems.length
                }

                targetItems.splice(insertIndex, 0, placeholderBlock)
                if (overContainer === 'content') {
                    nextContent = targetItems
                } else {
                    nextZones[overContainer] = targetItems
                }

                setData({
                    ...data,
                    content: nextContent,
                    zones: nextZones
                })
            }
        }
        // Case 2: Dragging an existing element on the canvas
        else {
            const activeContainer = findContainer(activeId)
            const overContainer = findContainer(overId)

            if (!activeContainer || !overContainer || activeContainer === 'sidebar' || overContainer === 'sidebar') return

            if (activeContainer === overContainer) {
                // Reordering within the same container
                const items = activeContainer === 'content' ? [...data.content] : [...(data.zones?.[activeContainer] || [])]
                const oldIndex = items.findIndex((b) => b.id === activeId)
                const newIndex = items.findIndex((b) => b.id === overId)

                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    const nextZones = { ...data.zones }
                    const reordered = arrayMove(items, oldIndex, newIndex)
                    if (activeContainer === 'content') {
                        setData({
                            ...data,
                            content: reordered
                        })
                    } else {
                        nextZones[activeContainer] = reordered
                        setData({
                            ...data,
                            zones: nextZones
                        })
                    }
                }
            } else {
                // Dragging from one container to another
                let activeItems = activeContainer === 'content' ? [...data.content] : [...(data.zones?.[activeContainer] || [])]
                let overItems = overContainer === 'content' ? [...data.content] : [...(data.zones?.[overContainer] || [])]

                const activeIndex = activeItems.findIndex((b) => b.id === activeId)
                if (activeIndex === -1) return

                const [itemToMove] = activeItems.splice(activeIndex, 1)

                let overIndex = overItems.length
                if (overId !== overContainer) {
                    overIndex = overItems.findIndex((b) => b.id === overId)
                    if (overIndex === -1) overIndex = overItems.length
                }

                overItems.splice(overIndex, 0, itemToMove)

                const nextZones = { ...data.zones }
                if (activeContainer === 'content') {
                    data.content = activeItems
                } else {
                    nextZones[activeContainer] = activeItems
                }

                if (overContainer === 'content') {
                    data.content = overItems
                } else {
                    nextZones[overContainer] = overItems
                }

                setData({
                    ...data,
                    content: data.content,
                    zones: nextZones
                })
            }
        }
    }

    // Drag cancel reverter
    const handleDragCancel = () => {
        if (dragStartStateRef.current) {
            setData(dragStartStateRef.current)
        }
        setActiveDragId(null)
    }

    // Drag end reordering handler
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveDragId(null)

        const activeId = cleanId(active.id as string)

        if (activeId.startsWith('new-')) {
            const placeholderId = 'placeholder-block'
            const placeholderContainer = findContainer(placeholderId)

            if (placeholderContainer) {
                // Replace placeholder with a real block
                const componentType = activeId.replace('new-', '')
                const componentConfig = config.components[componentType]
                const realId = `${componentType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
                const realBlock: Block = {
                    id: realId,
                    type: componentType,
                    props: JSON.parse(JSON.stringify(componentConfig?.defaultProps || {}))
                }

                const nextZones = { ...data.zones }
                let nextContent = [...data.content]

                if (placeholderContainer === 'content') {
                    nextContent = nextContent.map((b) => (b.id === placeholderId ? realBlock : b))
                } else if (nextZones[placeholderContainer]) {
                    nextZones[placeholderContainer] = nextZones[placeholderContainer].map((b) => (b.id === placeholderId ? realBlock : b))
                }

                const finalData = {
                    ...data,
                    content: nextContent,
                    zones: nextZones
                }
                updateData(finalData)
                setSelectedId(realId)
            } else {
                // Dropped outside, revert placeholder
                if (dragStartStateRef.current) {
                    setData(dragStartStateRef.current)
                }
            }
        } else {
            if (!over) {
                // Dropped outside, revert
                if (dragStartStateRef.current) {
                    setData(dragStartStateRef.current)
                }
                return
            }

            // Commit final reordered layout
            updateData(data)
        }
    }

    // Render a single block on the canvas
    const renderBlockItem = (block: Block, containerId: string) => {
        const componentConfig = config.components[block.type]
        if (!componentConfig) return null

        const isSelected = selectedId === block.id

        // Create the mocked puck prop for rendering dropzones inside container blocks
        const puck = {
            renderDropZone: SharedDropZone
        }

        const RenderedComponent = componentConfig.render as any

        return (
            <SortableBlockWrapper
                key={block.id}
                id={block.id}
                isSelected={isSelected}
                onSelect={() => setSelectedId(block.id)}
                onDelete={() => handleDelete(block.id)}
                onDuplicate={() => handleDuplicate(block.id)}
                label={block.type}
            >
                <BlockContext.Provider value={{ blockId: block.id }}>
                    <RenderedComponent
                        {...block.props}
                        puck={puck}
                        id={block.id}
                    />
                </BlockContext.Provider>
            </SortableBlockWrapper>
        )
    }

    // Render field input based on field type
    const renderFieldInput = (fieldName: string, fieldSchema: any, value: any, path: string[]) => {
        const label = fieldSchema.label || fieldName

        // Handle Custom Types (ResponsiveInput, ColorPicker, RangeInput, etc.)
        if (fieldSchema.type === 'custom') {
            const onChange = (val: any) => {
                const shouldCommit = fieldSchema.render !== ResponsiveInput
                handleUpdateProp(selectedId!, path, val, shouldCommit)
            }
            const onBlur = handleCommitChanges

            const CustomField = fieldSchema.render
            if (typeof CustomField === 'function') {
                return (
                    <div key={fieldName} onBlur={onBlur} className="mb-4">
                        {(CustomField === ImageUpload || CustomField === VideoUpload) && (
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 font-mono">{label}</label>
                        )}
                        <CustomField
                            value={value}
                            onChange={onChange}
                            label={label}
                            options={fieldSchema.options || []}
                        />
                    </div>
                )
            }
        }

        // Standard Text input
        if (fieldSchema.type === 'text') {
            return (
                <div key={fieldName} className="mb-4">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 font-mono">
                        {label}
                    </label>
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => handleUpdateProp(selectedId!, path, e.target.value, false)}
                        onBlur={handleCommitChanges}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00]"
                    />
                </div>
            )
        }

        // Select dropdown
        if (fieldSchema.type === 'select') {
            return (
                <div key={fieldName} className="mb-4">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 font-mono">
                        {label}
                    </label>
                    <select
                        value={value || ''}
                        onChange={(e) => {
                            handleUpdateProp(selectedId!, path, e.target.value, true)
                        }}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:border-[#ccff00]"
                    >
                        {fieldSchema.options?.map((opt: any) => (
                            <option key={opt.value} value={opt.value} className="bg-zinc-950">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )
        }

        // Radio list
        if (fieldSchema.type === 'radio') {
            return (
                <div key={fieldName} className="mb-4">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 font-mono">
                        {label}
                    </label>
                    <div className="flex gap-2">
                        {fieldSchema.options?.map((opt: any) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    handleUpdateProp(selectedId!, path, opt.value, true)
                                }}
                                className={`flex-1 py-1.5 rounded-lg border text-[10px] uppercase font-bold tracking-wider transition ${
                                    value === opt.value
                                        ? 'bg-[#ccff00] text-black border-transparent'
                                        : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:border-zinc-700'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )
        }

        return null
    }

    // Get selected block data and schema
    const selectedBlockInfo = selectedId ? findBlock(selectedId) : null
    const selectedBlock = selectedBlockInfo?.block
    const selectedBlockConfig = selectedBlock ? config.components[selectedBlock.type] : null

    // Outline component reordering panel list items
    const renderOutlineTree = (blocks: Block[], containerId: string, indent = 0): React.ReactNode => {
        const itemIds = blocks.map((b) => `outline-${b.id}`)
        return (
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                <SortableOutlineZone zoneId={containerId}>
                    <div className="space-y-1">
                        {blocks.map((block) => {
                            const isSelected = selectedId === block.id
                            return (
                                <div key={block.id} style={{ paddingLeft: `${indent * 12}px` }}>
                                    <SortableOutlineItem
                                        block={block}
                                        indent={indent}
                                        isSelected={isSelected}
                                        onSelect={() => setSelectedId(block.id)}
                                        onDuplicate={() => handleDuplicate(block.id)}
                                        onDelete={() => handleDelete(block.id)}
                                    >
                                        {/* Render zones outline */}
                                        {Object.keys(config.components[block.type]?.fields || {}).map((fieldKey) => {
                                            const zoneId = `${block.id}:${fieldKey}`
                                            if (data.zones?.[zoneId]) {
                                                return (
                                                    <div key={zoneId} className="pl-4 border-l border-zinc-800 my-1">
                                                        <div className="text-[8px] font-black text-zinc-650 tracking-wider uppercase font-mono py-1">
                                                            Zone: {fieldKey}
                                                        </div>
                                                        {renderOutlineTree(data.zones[zoneId], zoneId, indent + 1)}
                                                    </div>
                                                )
                                            }
                                            return null
                                        })}
                                    </SortableOutlineItem>
                                </div>
                            )
                        })}
                    </div>
                </SortableOutlineZone>
            </SortableContext>
        )
    }

    // Visual elements panel templates categorized
    const elementCategories = [
        { name: 'Structure', icon: LayoutGrid, components: config.categories?.Structure?.components || [] },
        { name: 'Typography', icon: Type, components: config.categories?.Typography?.components || [] },
        { name: 'Media', icon: ImageIcon, components: config.categories?.Media?.components || [] },
        { name: 'Special', icon: Sparkles, components: config.categories?.Special?.components || [] }
    ]

    return (
        <BuilderContext.Provider
            value={{
                data,
                selectedId,
                setSelectedId,
                handleDelete,
                handleDuplicate,
                handleAddBlock,
                renderBlockItem
            }}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={customCollisionDetection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
            <div className="h-full flex flex-col bg-[#040405] text-slate-200 overflow-hidden font-sans border border-zinc-900 rounded-[2.5rem] shadow-2xl relative z-10">
            {/* Top Workspace Header Bar */}
            <div className="h-16 shrink-0 bg-[#08080a] border-b border-zinc-900 flex items-center justify-between px-8 relative z-20">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-black text-[#ccff00] border border-[#ccff00]/25 bg-[#ccff00]/5 px-3 py-1 rounded-full uppercase tracking-wider">
                        NODE_ENGINE
                    </span>
                    <div>
                        <h1 className="text-sm font-black uppercase text-white tracking-tight italic">
                            {title}
                        </h1>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
                            Custom visual builder matrix
                        </p>
                    </div>
                </div>

                {/* Viewport Selectors */}
                <div className="flex items-center gap-2 bg-zinc-900/60 p-1 rounded-xl border border-zinc-850/60 backdrop-blur-md">
                    <button
                        onClick={() => setViewport('desktop')}
                        className={`p-2 rounded-lg transition-all ${
                            viewport === 'desktop'
                                ? 'bg-zinc-800 text-white shadow-md'
                                : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Desktop Layout Preview"
                    >
                        <Monitor size={15} />
                    </button>
                    <button
                        onClick={() => setViewport('tablet')}
                        className={`p-2 rounded-lg transition-all ${
                            viewport === 'tablet'
                                ? 'bg-zinc-800 text-white shadow-md'
                                : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Tablet Layout Preview"
                    >
                        <Tablet size={15} />
                    </button>
                    <button
                        onClick={() => setViewport('mobile')}
                        className={`p-2 rounded-lg transition-all ${
                            viewport === 'mobile'
                                ? 'bg-zinc-800 text-white shadow-md'
                                : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Mobile Layout Preview"
                    >
                        <Smartphone size={15} />
                    </button>
                </div>

                {/* Core Action controls */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 border-r border-zinc-800 pr-3 mr-1">
                        <button
                            type="button"
                            onClick={handleUndo}
                            disabled={historyIndex <= 0}
                            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-900 transition"
                            title="Undo Action"
                        >
                            <Undo size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={handleRedo}
                            disabled={historyIndex >= history.length - 1}
                            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-900 transition"
                            title="Redo Action"
                        >
                            <Redo size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => onSave(data)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#ccff00] text-black hover:bg-black hover:text-[#ccff00] font-black italic uppercase text-xs tracking-wider rounded-xl transition duration-300 shadow-lg shadow-[#ccff00]/10 border border-transparent hover:border-zinc-800"
                    >
                        Publish Changes_
                    </button>
                </div>
            </div>

            {/* Bottom Panels Layout */}
            <div className="flex-1 flex min-h-0 relative z-10">
                {/* 1. Left Control Panel Sidebar */}
                <aside className="w-72 shrink-0 bg-[#08080a] border-r border-zinc-900 flex flex-col min-h-0">
                    {/* Tabs switcher */}
                    <div className="flex border-b border-zinc-900 p-3 gap-2">
                        <button
                            onClick={() => setActiveTab('elements')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition border flex items-center justify-center gap-2 ${
                                activeTab === 'elements'
                                    ? 'bg-zinc-900 text-white border-zinc-800'
                                    : 'text-zinc-500 hover:text-zinc-300 border-transparent bg-transparent'
                            }`}
                        >
                            <LayoutGrid size={12} /> Elements
                        </button>
                        <button
                            onClick={() => setActiveTab('outline')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition border flex items-center justify-center gap-2 ${
                                activeTab === 'outline'
                                    ? 'bg-zinc-900 text-white border-zinc-800'
                                    : 'text-zinc-500 hover:text-zinc-300 border-transparent bg-transparent'
                            }`}
                        >
                            <Layers size={12} /> Outline Tree
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {activeTab === 'elements' ? (
                            elementCategories.map((cat) => {
                                const isExpanded = expandedCategories[cat.name as keyof typeof expandedCategories]
                                return (
                                    <div key={cat.name} className="border-b border-zinc-900 pb-3 last:border-0">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedCategories((prev) => ({
                                                    ...prev,
                                                    [cat.name]: !isExpanded
                                                }))
                                            }
                                            className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white py-2"
                                        >
                                            <span className="flex items-center gap-2">
                                                <cat.icon size={13} className="text-[#ccff00]" />
                                                {cat.name}
                                            </span>
                                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        </button>

                                        {isExpanded && (
                                            <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
                                                {cat.components.map((comp) => (
                                                    <div
                                                        key={comp}
                                                        className="border border-zinc-850 bg-zinc-950/40 rounded-xl hover:border-[#ccff00]/40 hover:bg-zinc-900/40 text-left transition duration-200 group text-center"
                                                    >
                                                        <DraggableElement
                                                            type={comp}
                                                            onClick={() => handleAddBlock(comp)}
                                                        >
                                                            <div className="flex flex-col items-center justify-center p-3 w-full h-full cursor-grab active:cursor-grabbing">
                                                                <Plus
                                                                    size={12}
                                                                    className="text-zinc-600 group-hover:text-[#ccff00] mb-1.5 transition"
                                                                />
                                                                <span className="text-[9px] font-mono uppercase text-slate-300 tracking-wide font-black truncate max-w-full">
                                                                    {comp}
                                                                </span>
                                                            </div>
                                                        </DraggableElement>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="space-y-1">
                                <h4 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2 mb-3">
                                    Root Layout Context
                                </h4>
                                {renderOutlineTree(data.content, 'content')}
                            </div>
                        )}
                    </div>
                </aside>

                {/* 2. Middle Editor Canvas */}
                <main className="flex-1 min-w-0 bg-[#040405] flex justify-center p-8 overflow-y-auto relative">
                    {/* Viewport resizing shell wrapping */}
                    <div
                        style={{
                            width:
                                viewport === 'mobile'
                                    ? '375px'
                                    : viewport === 'tablet'
                                    ? '768px'
                                    : '100%',
                            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            maxWidth: viewport === 'desktop' ? '1200px' : 'none'
                        }}
                        className="h-fit min-h-full border border-zinc-900 bg-[#020617] rounded-3xl p-6 shadow-2xl relative"
                    >
                        {/* Status watermark */}
                        <div className="absolute top-4 right-6 text-[8px] font-mono text-zinc-700 tracking-widest uppercase pointer-events-none">
                            Matrix_Canvas_Active
                        </div>

                            <SortableContext
                                items={data.content.map((b) => b.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div ref={setCanvasRef} className="space-y-4 min-h-[500px]">
                                    {data.content.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-32 text-center text-zinc-650">
                                            <LayoutGrid className="w-12 h-12 mb-3 text-zinc-800 animate-pulse" />
                                            <p className="text-xs font-mono uppercase font-black tracking-widest text-slate-500">
                                                Canvas is Empty
                                            </p>
                                            <p className="text-[10px] text-zinc-650 mt-2 max-w-xs leading-relaxed uppercase">
                                                Select or drag elements from the left side bar to construct the page matrix
                                            </p>
                                        </div>
                                    ) : (
                                        data.content.map((block) => renderBlockItem(block, 'content'))
                                    )}
                                </div>
                            </SortableContext>
                    </div>
                </main>

                {/* 3. Right Element Properties Settings Sidebar */}
                <aside className="w-80 shrink-0 bg-[#08080a] border-l border-zinc-900 flex flex-col min-h-0">
                    <div className="p-4 border-b border-zinc-900 flex items-center justify-between shrink-0 bg-zinc-950/45">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <Settings2 size={13} className="text-[#ccff00]" /> Config Panel
                        </span>
                        {selectedBlock && (
                            <button
                                onClick={() => setSelectedId(null)}
                                className="text-[8px] bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white px-2 py-1 rounded font-bold uppercase transition"
                            >
                                Clear Select
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-5">
                        {selectedBlock && selectedBlockConfig ? (
                            <div className="space-y-6">
                                {/* Block meta details */}
                                <div className="border-b border-zinc-900 pb-4 mb-4">
                                    <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Selected Block</span>
                                    <h3 className="text-sm font-black uppercase tracking-tight text-white mt-1">
                                        {selectedBlock.type}
                                    </h3>
                                    <p className="text-[8px] font-mono text-zinc-600 mt-1 uppercase truncate font-bold">
                                        ID: {selectedBlock.id}
                                    </p>
                                </div>

                                {/* Dynamically generated form fields */}
                                <div className="space-y-4">
                                    {Object.entries(selectedBlockConfig.fields || {}).map(([fieldName, fieldSchema]: [string, any]) => {
                                        // Ignore zone categories inside fields (they are handled as nested SortableZones)
                                        if (data.zones && data.zones[`${selectedBlock.id}:${fieldName}`] !== undefined) {
                                            return null
                                        }
                                        
                                        const value = selectedBlock.props[fieldName]
                                        return renderFieldInput(fieldName, fieldSchema, value, [fieldName])
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <Settings className="w-10 h-10 text-zinc-800 mb-3 animate-spin duration-3000" />
                                <p className="text-[10px] font-mono uppercase font-black tracking-widest text-slate-500">
                                    No Element Focus
                                </p>
                                <p className="text-[9px] text-zinc-650 mt-1.5 uppercase max-w-xs leading-relaxed">
                                    Select an element on the canvas to configure its properties here.
                                </p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>

            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.4'
                        }
                    }
                })
            }}>
                {activeDragId ? (
                    <div className="p-4 border border-[#ccff05] bg-zinc-950/80 rounded-xl shadow-2xl text-xs uppercase font-mono tracking-widest text-[#ccff00] font-black opacity-85">
                        Dragging {getDragLabel()}...
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
        </BuilderContext.Provider>
    )
}
export default CustomVisualBuilder
