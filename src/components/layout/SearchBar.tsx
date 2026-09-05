'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('search') ?? '')
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        debounceRef.current = setTimeout(() => {
        const trimmed = query.trim()
        const currentSearch = searchParams.get('search') ?? ''

        // ถ้าค่าที่พิมพ์ตรงกับ URL อยู่แล้ว ไม่ต้องทำอะไร
        // (กัน effect ยิงซ้ำโดยไม่จำเป็น รวมถึงตอน React Strict Mode รัน effect ซ้ำ)
        if (trimmed === currentSearch) return

        const params = new URLSearchParams(searchParams.toString())
        if (trimmed) {
            params.set('search', trimmed)
        } else {
            params.delete('search')
        }
        router.push(params.toString() ? `/?${params.toString()}` : '/')
        }, 400)

        return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    return (
        <div className="w-full max-w-md">
        <div className="flex items-center gap-2 rounded-2xl bg-surface-2 px-4 py-2.5 shadow-[inset_3px_3px_8px_rgba(20,80,143,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.02)]">
            <svg className="h-4 w-4 shrink-0 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาอุปกรณ์คอม, เกมมิ่งเกียร์..."
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
            />
        </div>
        </div>
    )
}