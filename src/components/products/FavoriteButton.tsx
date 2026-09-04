'use client'

import { useState, useTransition } from 'react'
import { toggleFavorite } from '@/lib/actions/favorites'
import { useToast } from '@/components/ui/toast/ToastProvider'

export function FavoriteButton({
    productId,
    initialFavorited,
}: {
    productId: string
    initialFavorited: boolean
}) {
    const [isFavorited, setIsFavorited] = useState(initialFavorited)
    const [isPending, startTransition] = useTransition()
    const { error } = useToast()

    const handleClick = () => {
        const next = !isFavorited
        setIsFavorited(next) // optimistic

        startTransition(async () => {
            try {
                const result = await toggleFavorite(productId)
                setIsFavorited(result)
            } catch {
                setIsFavorited(!next) // revert ถ้า error
                error('ดำเนินการไม่สำเร็จ ลองใหม่อีกครั้ง')
            }
        })
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-60 ${
                isFavorited
                    ? 'bg-red-50 text-red-500 dark:bg-red-500/10'
                    : 'bg-surface-2 text-text hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10'
            }`}
        >
            <svg
                className="h-4 w-4"
                fill={isFavorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
            </svg>
            {isFavorited ? 'ถูกใจแล้ว' : 'ถูกใจ'}
        </button>
    )
}