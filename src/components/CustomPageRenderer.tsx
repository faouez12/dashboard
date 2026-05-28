'use client'
import React from 'react'
import config from '@/app/admin/dashboard/components/puck-config'

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

interface CustomPageRendererProps {
    data: PageData
}

export function CustomPageRenderer({ data }: CustomPageRendererProps) {
    if (!data || !data.content) return null

    const renderBlock = (block: Block) => {
        const componentConfig = config.components[block.type]
        if (!componentConfig) return null

        // Create the puck context prop containing renderDropZone
        const puck = {
            renderDropZone: ({ zone }: { zone: string }) => {
                const zoneId = `${block.id}:${zone}`
                const items = data.zones?.[zoneId] || []
                return (
                    <>
                        {items.map((item) => (
                            <React.Fragment key={item.id}>
                                {renderBlock(item)}
                            </React.Fragment>
                        ))}
                    </>
                )
            }
        }

        // Render the component with its saved props and the mock puck context
        return (componentConfig.render as any)({
            ...block.props,
            puck: puck as any,
            id: block.id
        })
    }

    const RootComponent = (config.root?.render || (({ children }: any) => <>{children}</>)) as any

    return (
        <RootComponent puck={{} as any}>
            {data.content.map((block) => (
                <React.Fragment key={block.id}>
                    {renderBlock(block)}
                </React.Fragment>
            ))}
        </RootComponent>
    )
}
export default CustomPageRenderer
