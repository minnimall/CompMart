'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from '@/lib/actions/auth'

interface UserMenuProps {
    username: string
    avatarUrl?: string | null
}

export function UserMenu({ username, avatarUrl }: UserMenuProps) {
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
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 sm:pr-4 transition hover:bg-surface-2 cursor-pointer"
        >
            <span className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-white shadow-[4px_4px_10px_rgba(20,80,143,0.25),-3px_-3px_8px_rgba(255,255,255,0.6)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_6px_rgba(255,255,255,0.04)]">
            {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
            ) : (
                username.charAt(0).toUpperCase()
            )}
            </span>
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-text sm:block">
            {username}
            </span>
        </button>

        {open && (
            <div className="absolute right-0 top-14 w-56 rounded-2xl bg-surface p-2 shadow-[10px_10px_24px_rgba(20,80,143,0.2),-8px_-8px_20px_rgba(255,255,255,0.9)] dark:shadow-[10px_10px_24px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(255,255,255,0.03)]">
            <p className="px-3 py-2 text-sm font-medium text-text">สวัสดี, {username}</p>
            <div className="my-1 h-px bg-border" />
            <a href="/dashboard/settings" className="block rounded-xl px-3 py-2 text-sm text-text-muted transition hover:bg-surface-2 hover:text-text">โปรไฟล์ของฉัน</a>
            <a href="/dashboard/my-products" className="block rounded-xl px-3 py-2 text-sm text-text-muted transition hover:bg-surface-2 hover:text-text">สินค้าของฉัน</a>
            <a href="/dashboard/my-orders" className="block rounded-xl px-3 py-2 text-sm text-text-muted transition hover:bg-surface-2 hover:text-text">คำสั่งซื้อของฉัน</a>
            <a href="/dashboard/messages" className="block rounded-xl px-3 py-2 text-sm text-text-muted transition hover:bg-surface-2 hover:text-text">ข้อความ</a>
            <div className="my-1 h-px bg-border" />
            <form action={signOut}>
                <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10">ออกจากระบบ</button>
            </form>
            </div>
        )}
        </div>
    )
}