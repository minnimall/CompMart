'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return <div className="h-11 w-11" />

    const isDark = theme === 'dark'

    return (
        <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label="สลับธีมสว่าง/มืด"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-primary shadow-[4px_4px_10px_rgba(20,80,143,0.15),-3px_-3px_8px_rgba(255,255,255,0.7)] transition active:shadow-[inset_2px_2px_6px_rgba(20,80,143,0.2)]"
        >
        {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
        ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
        )}
        </button>
    )
}