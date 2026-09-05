'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUnreadMessageCount } from '@/lib/actions/notifications'

export function NotificationBell({
    userId,
    initialCount,
}: {
    userId: string
    initialCount: number
}) {
    const [count, setCount] = useState(initialCount)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const refetch = () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(async () => {
                const c = await getUnreadMessageCount()
                setCount(c)
            }, 300)
        }

        const supabase = createClient()
        const channel = supabase
            .channel(`notif:${userId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages', filter: `buyer_id=eq.${userId}` },
                refetch
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages', filter: `seller_id=eq.${userId}` },
                refetch
            )
            .subscribe((status) => {
                console.log('[NotificationBell] channel status:', status)
            })

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
            supabase.removeChannel(channel)
        }
    }, [userId])

    return (
        <a
            href="/dashboard/messages"
            aria-label="ข้อความ"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-muted transition hover:text-primary shadow-[3px_3px_8px_rgba(20,80,143,0.15),-3px_-3px_8px_rgba(255,255,255,0.7)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.4),-2px_-2px_6px_rgba(255,255,255,0.03)]"
        >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.126 0-2.203-.184-3.19-.522L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
            </svg>
            {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white ring-2 ring-surface">
                        {count > 9 ? '9+' : count}
                    </span>
                </span>
            )}
        </a>
    )
}