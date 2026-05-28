'use client'
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Copy } from 'lucide-react'

interface SortableBlockWrapperProps {
    id: string
    isSelected: boolean
    onSelect: () => void
    onDelete: () => void
    onDuplicate: () => void
    label: string
    children: React.ReactNode
}

export function SortableBlockWrapper({
    id,
    isSelected,
    onSelect,
    onDelete,
    onDuplicate,
    label,
    children
}: SortableBlockWrapperProps) {
    const isPlaceholder = id === 'placeholder-block'
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled: isPlaceholder })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        position: 'relative'
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => {
                if (isPlaceholder) return
                e.stopPropagation()
                onSelect()
            }}
            className={`group relative border transition-all duration-200 rounded-xl mb-4 bg-zinc-950/20 ${
                isPlaceholder
                    ? 'border-[#5E6AD2] border-dashed bg-[#5E6AD2]/5 opacity-60 animate-pulse shadow-[0_0_15px_rgba(94,106,210,0.1)]'
                    : isSelected
                    ? 'border-[#ccff00] ring-1 ring-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.1)]'
                    : 'border-zinc-800/80 hover:border-zinc-700'
            }`}
        >
            {/* Top Info / Controls Bar */}
            <div
                className={`absolute -top-3 left-4 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase font-black border z-10 transition-colors pointer-events-none ${
                    isPlaceholder
                        ? 'bg-[#5E6AD2] text-white border-transparent'
                        : isSelected
                        ? 'bg-[#ccff00] text-black border-transparent'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 group-hover:text-white'
                }`}
            >
                {isPlaceholder ? `${label} (Preview)` : label}
            </div>

            {/* Quick Actions Panel */}
            {!isPlaceholder && (
                <div
                    className={`absolute -top-4 right-4 flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-200 shadow-xl ${
                        isSelected ? 'opacity-100 border-[#ccff00]/40' : ''
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Drag Handle */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white cursor-grab active:cursor-grabbing"
                        title="Drag to Reorder"
                    >
                        <GripVertical size={13} />
                    </button>

                    {/* Duplicate */}
                    <button
                        onClick={onDuplicate}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                        title="Duplicate Block"
                    >
                        <Copy size={13} />
                    </button>

                    {/* Delete */}
                    <button
                        onClick={onDelete}
                        className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400"
                        title="Delete Block"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            )}

            {/* Inner Content Component */}
            <div className="p-4 pt-6">{children}</div>
        </div>
    )
}
