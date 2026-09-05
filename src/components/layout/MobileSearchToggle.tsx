'use client'

import { useEffect, useRef, useState } from 'react'
import { SearchBar } from './SearchBar'

export function MobileSearchToggle() {
    const [open, setOpen] = useState(false)
    const [visible, setVisible] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    // แยก open (mount) กับ visible (trigger animation) เพื่อให้ transition ทำงานตอนเปิด
    useEffect(() => {
        if (open) {
            const raf = requestAnimationFrame(() => setVisible(true))
            return () => cancelAnimationFrame(raf)
        }
        setVisible(false)
    }, [open])

    // ปิดเมื่อกดนอกกล่อง หรือกด Escape
    useEffect(() => {
        if (!open) return

        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [open])

    return (
        <>
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'ปิดการค้นหา' : 'ค้นหา'}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-muted transition hover:text-primary shadow-[3px_3px_8px_rgba(20,80,143,0.15),-3px_-3px_8px_rgba(255,255,255,0.7)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.4),-2px_-2px_6px_rgba(255,255,255,0.03)] sm:hidden"
            >
                {open ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                    </svg>
                )}
            </button>

            {open && (
                <>
                    {/* Overlay จางๆ ด้านหลัง กดแล้วปิด */}
                    <div
                        className={`fixed inset-0 z-20 bg-black/20 backdrop-blur-[2px] transition-opacity duration-200 sm:hidden ${
                            visible ? 'opacity-100' : 'opacity-0'
                        }`}
                    />

                    {/* แผงค้นหา เลื่อนลงมาจากด้านบน */}
                    <div
                        ref={panelRef}
                        className={`absolute inset-x-3 top-full z-30 rounded-b-3xl rounded-t-xl bg-surface p-4 shadow-[6px_10px_24px_rgba(20,80,143,0.2)] transition-all duration-200 ease-out dark:shadow-[6px_10px_24px_rgba(0,0,0,0.5)] sm:hidden ${
                            visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                        }`}
                    >
                        <SearchBar autoFocus onSubmitted={() => setOpen(false)} />
                    </div>
                </>
            )}
        </>
    )
}