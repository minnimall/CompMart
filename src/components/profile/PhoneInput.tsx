'use client'

import { useState } from 'react'

function formatPhone(digits: string) {
    const d = digits.slice(0, 10)
    if (d.length <= 3) return d
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
}

export function PhoneInput({ defaultValue = '' }: { defaultValue?: string }) {
    const [display, setDisplay] = useState(() => formatPhone(defaultValue.replace(/\D/g, '')))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = e.target.value.replace(/\D/g, '')
        setDisplay(formatPhone(digitsOnly))
    }

    return (
        <div>
        <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-text">
            เบอร์โทรศัพท์
        </label>
        <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/70">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.7a2 2 0 0 1-.4 2.1L8 10a16 16 0 0 0 6 6l1.5-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
            </svg>
            </span>
            <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            placeholder="090-000-0000"
            value={display}
            onChange={handleChange}
            maxLength={12}
            className="h-[42px] w-full rounded-xl border-0 bg-surface-2 px-3.5 text-sm text-text outline-none transition shadow-[inset_3px_3px_8px_rgba(20,80,143,0.10),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] focus:ring-2 focus:ring-primary/25 dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
            style={{ paddingLeft: '2.75rem' }}
            />
        </div>
        </div>
    )
}