'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from '@/lib/actions/auth'

export function UserMenu({ username }: { username: string }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <div ref={ref} className="relative">
        <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-[4px_4px_10px_rgba(20,80,143,0.25),-3px_-3px_8px_rgba(255,255,255,0.6)] transition active:shadow-[inset_2px_2px_6px_rgba(10,40,80,0.4)]"
        >
            {username.charAt(0).toUpperCase()}
        </button>

        {open && (
            <div className="absolute right-0 top-14 w-56 rounded-2xl bg-surface p-2 shadow-[10px_10px_24px_rgba(20,80,143,0.2),-8px_-8px_20px_rgba(255,255,255,0.9)]">
            <p className="px-3 py-2 text-sm font-medium text-text">สวัสดี, {username}</p>
            <div className="my-1 h-px bg-border" />
            <a href="/dashboard/my-products" className="block rounded-xl px-3 py-2 text-sm text-text-muted transition hover:bg-surface-2 hover:text-text">สินค้าของฉัน</a>
            <a href="/dashboard/my-orders" className="block rounded-xl px-3 py-2 text-sm text-text-muted transition hover:bg-surface-2 hover:text-text">คำสั่งซื้อของฉัน</a>
            <a href="/dashboard/messages" className="block rounded-xl px-3 py-2 text-sm text-text-muted transition hover:bg-surface-2 hover:text-text">ข้อความ</a>
            <div className="my-1 h-px bg-border" />
            <form action={signOut}>
                <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50">ออกจากระบบ</button>
            </form>
            </div>
        )}
        </div>
    )
}