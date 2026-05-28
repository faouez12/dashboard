'use client'
import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

interface SortableZoneProps {
    zoneId: string
    items: Array<{ id: string; type: string; props: Record<string, any> }>
    onSelectItem: (id: string) => void
    selectedId: string | null
    onDeleteItem: (id: string) => void
    onDuplicateItem: (id: string) => void
    renderBlock: (block: any) => React.ReactNode
    onAddClick?: () => void
}

export function SortableZone({
    zoneId,
    items,
    onSelectItem,
    selectedId,
    onDeleteItem,
    onDuplicateItem,
    renderBlock,
    onAddClick
}: SortableZoneProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: zoneId
    })

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] w-full rounded-xl transition-all duration-300 relative border ${
                isOver
                    ? 'bg-[#ccff00]/5 border-[#ccff00] border-dashed shadow-[inset_0_0_15px_rgba(204,255,0,0.05)]'
                    : 'border-zinc-800/60 bg-zinc-950/15'
            }`}
        >
            <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="p-3 w-full min-h-[90px] flex flex-col">
                    {items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                            <span className="p-1.5 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 mb-2">
                                <Plus size={10} className="text-zinc-600 animate-pulse" />
                            </span>
                            <span>Empty Zone</span>
                            {onAddClick && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onAddClick()
                                    }}
                                    className="mt-2 text-[8px] bg-zinc-850 hover:bg-zinc-800 hover:text-white px-2 py-1 rounded border border-zinc-800 font-bold uppercase transition"
                                >
                                    + Add Element
                                </button>
                            )}
                        </div>
                    ) : (
                        items.map((item) => renderBlock(item))
                    )}
                </div>
            </SortableContext>
        </div>
    )
}
export default SortableZone
