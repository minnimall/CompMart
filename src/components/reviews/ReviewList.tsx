'use client'

import { useState, useTransition } from 'react'
import { replyToReview } from '@/lib/actions/reviews'
import { useToast } from '@/components/ui/toast/ToastProvider'

interface Review {
    id: string
    rating: number
    comment: string | null
    is_edited: boolean
    seller_reply: string | null
    created_at: string
    reviewer?: { username: string; avatar_url: string | null } | null
}

export function ReviewList({
    reviews,
    isOwnerViewing,
}: {
    reviews: Review[]
    isOwnerViewing: boolean
}) {
    if (reviews.length === 0) {
        return <p className="py-8 text-center text-sm text-text-muted">ยังไม่มีรีวิว</p>
    }

    return (
        <div className="space-y-4">
        {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} isOwnerViewing={isOwnerViewing} />
        ))}
        </div>
    )
}

function ReviewCard({ review, isOwnerViewing }: { review: Review; isOwnerViewing: boolean }) {
    const [isReplying, setIsReplying] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [isPending, startTransition] = useTransition()
    const { success, error } = useToast()

    const handleReply = () => {
        if (!replyText.trim()) return
        startTransition(async () => {
        try {
            await replyToReview(review.id, replyText)
            success('ตอบกลับสำเร็จ')
            setIsReplying(false)
        } catch (err) {
            error(err instanceof Error ? err.message : 'ตอบกลับไม่สำเร็จ')
        }
        })
    }

    return (
        <div className="rounded-2xl bg-surface p-4 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-surface-2">
            {review.reviewer?.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={review.reviewer.avatar_url} alt="" className="h-full w-full object-cover" />
            )}
            </div>
            <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text">{review.reviewer?.username ?? 'ผู้ใช้'}</p>
            <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= review.rating ? '' : 'text-border'}>★</span>
                ))}
                {review.is_edited && (
                <span className="ml-1 text-[11px] text-text-muted">(แก้ไขแล้ว)</span>
                )}
            </div>
            </div>
        </div>

        {review.comment && (
            <p className="mt-2 text-sm text-text-muted">{review.comment}</p>
        )}

        {review.seller_reply ? (
            <div className="mt-3 rounded-xl bg-surface-2 p-3">
            <p className="text-xs font-medium text-primary">การตอบกลับจากผู้ขาย</p>
            <p className="mt-1 text-sm text-text-muted">{review.seller_reply}</p>
            </div>
        ) : (
            isOwnerViewing && (
            <div className="mt-3">
                {isReplying ? (
                <div className="space-y-2">
                    <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    placeholder="ตอบกลับรีวิวนี้..."
                    className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    />
                    <div className="flex gap-2">
                    <button
                        onClick={() => setIsReplying(false)}
                        className="rounded-xl bg-surface-2 px-3 py-1.5 text-xs font-medium text-text-muted"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleReply}
                        disabled={isPending}
                        className="rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
                    >
                        {isPending ? 'กำลังส่ง...' : 'ส่งการตอบกลับ'}
                    </button>
                    </div>
                </div>
                ) : (
                <button
                    onClick={() => setIsReplying(true)}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    ตอบกลับรีวิวนี้
                </button>
                )}
            </div>
            )
        )}
        </div>
    )
}