'use client'
import { Puck, Data } from '@measured/puck'
import '@measured/puck/puck.css'
import config from './components/puck-config'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
    const [data, setData] = useState<Data>({ content: [], root: { props: {} } })

    useEffect(() => {
        const savedData = localStorage.getItem('puck-data')
        if (savedData) {
            try {
                setData(JSON.parse(savedData))
            } catch (e) {
                console.error('Failed to parse saved puck data', e)
            }
        }
    }, [])

    return (
        <div className="h-screen min-h-0 bg-white text-slate-800">
            <Puck
                config={config}
                data={data}
                onPublish={(newData) => {
                    setData(newData)
                    localStorage.setItem('puck-data', JSON.stringify(newData))
                }}
            />
        </div>
    )
}
