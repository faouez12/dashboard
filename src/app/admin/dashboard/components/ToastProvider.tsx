'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: string
    type: ToastType
    message: string
    description?: string
    duration?: number
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, description?: string, duration?: number) => void
    success: (message: string, description?: string) => void
    error: (message: string, description?: string) => void
    warning: (message: string, description?: string) => void
    info: (message: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const showToast = useCallback(
        (type: ToastType, message: string, description?: string, duration = 5000) => {
            const id = Math.random().toString(36).substring(2, 9)
            const toast: Toast = { id, type, message, description, duration }

            setToasts((prev) => [...prev, toast])

            if (duration > 0) {
                setTimeout(() => removeToast(id), duration)
            }
        },
        [removeToast]
    )

    const success = useCallback(
        (message: string, description?: string) => showToast('success', message, description),
        [showToast]
    )

    const error = useCallback(
        (message: string, description?: string) => showToast('error', message, description),
        [showToast]
    )

    const warning = useCallback(
        (message: string, description?: string) => showToast('warning', message, description),
        [showToast]
    )

    const info = useCallback(
        (message: string, description?: string) => showToast('info', message, description),
        [showToast]
    )

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
            ))}
        </div>
    )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
    const config = {
        success: {
            icon: CheckCircle2,
            gradient: 'from-emerald-500 to-green-600',
            bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
            border: 'border-emerald-200 dark:border-emerald-500/30',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            textColor: 'text-emerald-900 dark:text-emerald-100',
            descColor: 'text-emerald-700 dark:text-emerald-300',
            shadow: 'shadow-emerald-500/20 dark:shadow-emerald-500/30'
        },
        error: {
            icon: XCircle,
            gradient: 'from-red-500 to-rose-600',
            bg: 'bg-red-500/10 dark:bg-red-500/20',
            border: 'border-red-200 dark:border-red-500/30',
            iconBg: 'bg-red-100 dark:bg-red-900/40',
            iconColor: 'text-red-600 dark:text-red-400',
            textColor: 'text-red-900 dark:text-red-100',
            descColor: 'text-red-700 dark:text-red-300',
            shadow: 'shadow-red-500/20 dark:shadow-red-500/30'
        },
        warning: {
            icon: AlertCircle,
            gradient: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-500/10 dark:bg-amber-500/20',
            border: 'border-amber-200 dark:border-amber-500/30',
            iconBg: 'bg-amber-100 dark:bg-amber-900/40',
            iconColor: 'text-amber-600 dark:text-amber-400',
            textColor: 'text-amber-900 dark:text-amber-100',
            descColor: 'text-amber-700 dark:text-amber-300',
            shadow: 'shadow-amber-500/20 dark:shadow-amber-500/30'
        },
        info: {
            icon: Info,
            gradient: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-500/10 dark:bg-blue-500/20',
            border: 'border-blue-200 dark:border-blue-500/30',
            iconBg: 'bg-blue-100 dark:bg-blue-900/40',
            iconColor: 'text-blue-600 dark:text-blue-400',
            textColor: 'text-blue-900 dark:text-blue-100',
            descColor: 'text-blue-700 dark:text-blue-300',
            shadow: 'shadow-blue-500/20 dark:shadow-blue-500/30'
        }
    }

    const style = config[toast.type]
    const Icon = style.icon

    return (
        <div
            className={`
                relative overflow-hidden pointer-events-auto
                backdrop-blur-xl ${style.bg} ${style.border}
                border-2 rounded-2xl shadow-2xl ${style.shadow}
                transform transition-all duration-500 ease-out
                animate-slide-in-right hover:scale-105 hover:shadow-3xl
                w-full max-w-sm
            `}
        >
            {/* Animated gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${style.gradient} animate-shimmer`}></div>
            </div>

            {/* Progress bar if duration is set */}
            {toast.duration && toast.duration > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200/20 dark:bg-slate-700/20">
                    <div
                        className={`h-full bg-gradient-to-r ${style.gradient}`}
                        style={{
                            animation: `shrink ${toast.duration}ms linear forwards`
                        }}
                    ></div>
                </div>
            )}

            <div className="relative p-4 flex items-start gap-4">
                {/* Icon with pulse animation */}
                <div className={`
                    flex-shrink-0 w-12 h-12 rounded-xl ${style.iconBg} 
                    flex items-center justify-center
                    animate-pulse-subtle
                `}>
                    <Icon className={`${style.iconColor}`} size={24} strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`font-bold text-sm leading-snug ${style.textColor}`}>
                        {toast.message}
                    </p>
                    {toast.description && (
                        <p className={`text-xs mt-1 leading-relaxed ${style.descColor}`}>
                            {toast.description}
                        </p>
                    )}
                </div>

                {/* Close button */}
                <button
                    onClick={onRemove}
                    className={`
                        flex-shrink-0 w-7 h-7 rounded-lg
                        ${style.iconBg} ${style.iconColor}
                        hover:bg-opacity-80 transition-all
                        flex items-center justify-center
                        hover:rotate-90 transform duration-300
                    `}
                    aria-label="Close notification"
                >
                    <X size={16} strokeWidth={2.5} />
                </button>
            </div>

            {/* Decorative glow effect */}
            <div className={`
                absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-32 h-32 bg-gradient-to-r ${style.gradient} opacity-20 blur-3xl
                animate-pulse-glow
            `}></div>
        </div>
    )
}

// Add these animations to your global CSS or include them inline
export const toastStyles = `
@keyframes slide-in-right {
    from {
        opacity: 0;
        transform: translateX(100%) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

@keyframes shrink {
    from {
        width: 100%;
    }
    to {
        width: 0%;
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

@keyframes pulse-subtle {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

@keyframes pulse-glow {
    0%, 100% {
        opacity: 0.15;
        transform: translate(-50%, -50%) scale(1);
    }
    50% {
        opacity: 0.25;
        transform: translate(-50%, -50%) scale(1.1);
    }
}

.animate-slide-in-right {
    animation: slide-in-right 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}

.animate-pulse-subtle {
    animation: pulse-subtle 3s ease-in-out infinite;
}

.animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
}
`
