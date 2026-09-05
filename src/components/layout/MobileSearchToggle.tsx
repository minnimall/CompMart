'use client'

import { useState } from 'react'
import { SearchBar } from './SearchBar'

export function MobileSearchToggle() {
    const [open, setOpen] = useState(false)

    return (
        <>
        <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'ปิดการค้นหา' : 'ค้นหา'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-muted transition hover:text-primary sm:hidden"
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
            <div className="absolute inset-x-0 top-full z-30 border-b border-border bg-surface/95 p-4 shadow-lg backdrop-blur sm:hidden">
            <SearchBar />
            </div>
        )}
        </>
    )
}