'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ToastCard } from './ToastCard'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
    id: string
    message: string
    type: ToastType
    duration: number
}

interface ToastContextValue {
    success: (message: string, duration?: number) => void
    error: (message: string, duration?: number) => void
    info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast ต้องถูกใช้ภายใน ToastProvider เท่านั้น')
    return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const addToast = useCallback((message: string, type: ToastType, duration = 2000) => {
        const id = crypto.randomUUID()
        setToasts((prev) => [...prev, { id, message, type, duration }])
    }, [])

    const value: ToastContextValue = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        info: (message, duration) => addToast(message, 'info', duration),
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
                {toasts.map((t) => (
                    <ToastCard key={t.id} toast={t} onDone={() => remove(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}