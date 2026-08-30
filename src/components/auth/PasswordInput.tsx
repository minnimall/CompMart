'use client'

import { useState } from 'react'

export function PasswordInput({
    label = 'รหัสผ่าน',
    name = 'password',
    minLength,
    autoComplete = 'current-password',
}: {
    label?: string
    name?: string
    minLength?: number
    autoComplete?: string
}) {
    const [visible, setVisible] = useState(false)

    return (
        <div>
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-text">
            {label}
        </label>
        <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary/70">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="11" width="16" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            </span>
            <input
            id={name}
            name={name}
            type={visible ? 'text' : 'password'}
            required
            minLength={minLength}
            autoComplete={autoComplete}
            className="w-full rounded-2xl border-0 bg-surface-2 py-3.5 pl-12 pr-14 text-text outline-none transition shadow-[inset_4px_4px_10px_rgba(20,80,143,0.15),inset_-4px_-4px_10px_rgba(255,255,255,0.85)] focus:shadow-[inset_2px_2px_6px_rgba(20,80,143,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-primary/30"
            />
            <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-primary transition shadow-[3px_3px_6px_rgba(20,80,143,0.18),-3px_-3px_6px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_5px_rgba(20,80,143,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.5)]"
            >
            {visible ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.5A9.9 9.9 0 0 1 12 5c5.5 0 9 6 9 6a15 15 0 0 1-3 3.6M6.1 6.9A15.4 15.4 0 0 0 3 11s3.5 6 9 6c1 0 1.9-.2 2.8-.5" />
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 11s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
                <circle cx="12" cy="11" r="2.5" />
                </svg>
            )}
            </button>
        </div>
        </div>
    )
}