'use client'

import { useState, useTransition } from 'react'
import { createReview, updateReview } from '@/lib/actions/reviews'
import { useToast } from '@/components/ui/toast/ToastProvider'

export function ReviewModal({
    orderId,
    existingReview,
    onClose,
}: {
    orderId: string
    existingReview?: { id: string; rating: number; comment: string | null } | null
    onClose: () => void
}) {
    const [rating, setRating] = useState(existingReview?.rating ?? 5)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState(existingReview?.comment ?? '')
    const [isPending, startTransition] = useTransition()
    const { success, error } = useToast()

    const isEditMode = !!existingReview

    const handleSubmit = () => {
        startTransition(async () => {
        try {
            if (isEditMode) {
            await updateReview(existingReview.id, rating, comment)
            success('แก้ไขรีวิวสำเร็จ')
            } else {
            await createReview(orderId, rating, comment)
            success('ส่งรีวิวสำเร็จ')
            }
            onClose()
        } catch (err) {
            error(err instanceof Error ? err.message : 'ดำเนินการไม่สำเร็จ')
        }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-[10px_10px_24px_rgba(20,80,143,0.25),-8px_-8px_20px_rgba(255,255,255,0.6)] dark:shadow-[10px_10px_28px_rgba(0,0,0,0.6),-6px_-6px_16px_rgba(255,255,255,0.03)]">
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">
                {isEditMode ? 'แก้ไขรีวิว' : 'ให้คะแนนผู้ขาย'}
            </h2>
            <button onClick={onClose} className="text-text-muted hover:text-text" aria-label="ปิด">✕</button>
            </div>

            {isEditMode && (
            <p className="mb-3 text-xs text-amber-600">แก้ไขรีวิวได้เพียง 1 ครั้งเท่านั้น</p>
            )}

            <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-3xl transition"
                >
                <span className={(hoverRating || rating) >= star ? 'text-amber-400' : 'text-border'}>
                    ★
                </span>
                </button>
            ))}
            </div>

            <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="เล่าประสบการณ์การซื้อขายกับผู้ขายคนนี้..."
            className="mt-4 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
            />

            <div className="mt-4 flex gap-3">
            <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-surface-2 px-4 py-2 text-sm font-medium text-text-muted"
            >
                ยกเลิก
            </button>
            <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
                {isPending ? 'กำลังส่ง...' : isEditMode ? 'บันทึกการแก้ไข' : 'ส่งรีวิว'}
            </button>
            </div>
        </div>
        </div>
    )
}