'use client'

import { useState, useTransition } from 'react'
import { confirmOrder, completeOrder, cancelOrder } from '@/lib/actions/orders'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/toast/ToastProvider'

export function OrderRowActions({
    orderId,
    status,
    role,
}: {
    orderId: string
    status: string
    role: 'buyer' | 'seller'
}) {
    const [isPending, startTransition] = useTransition()
    const [confirmCancel, setConfirmCancel] = useState(false)
    const { success, error } = useToast()

    const runAction = (fn: (id: string) => Promise<void>, successMsg: string) => {
        startTransition(async () => {
        try {
            await fn(orderId)
            success(successMsg)
        } catch {
            error('ดำเนินการไม่สำเร็จ ลองใหม่อีกครั้ง')
        } finally {
            setConfirmCancel(false)
        }
        })
    }

    const canCancel = status === 'pending' || status === 'confirmed'

    return (
        <div className="mt-3 flex gap-2 border-t border-border pt-3">
        {role === 'seller' && status === 'pending' && (
            <button
            onClick={() => runAction(confirmOrder, 'ยืนยันออเดอร์แล้ว')}
            disabled={isPending}
            className="flex-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
            ยืนยันออเดอร์
            </button>
        )}
        {role === 'seller' && status === 'confirmed' && (
            <button
            onClick={() => runAction(completeOrder, 'ทำรายการสำเร็จ')}
            disabled={isPending}
            className="flex-1 rounded-xl bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary transition disabled:opacity-60"
            >
            ทำรายการสำเร็จ
            </button>
        )}
        {canCancel && (
            <button
            onClick={() => setConfirmCancel(true)}
            disabled={isPending}
            className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100 disabled:opacity-60 dark:bg-red-500/10 dark:hover:bg-red-500/20"
            >
            ยกเลิกออเดอร์
            </button>
        )}

        {confirmCancel && (
            <ConfirmDialog
            title="ยกเลิกออเดอร์นี้?"
            message="การกระทำนี้ไม่สามารถย้อนกลับได้"
            confirmLabel="ยกเลิกออเดอร์"
            danger
            isPending={isPending}
            onConfirm={() => runAction(cancelOrder, 'ยกเลิกออเดอร์แล้ว')}
            onCancel={() => setConfirmCancel(false)}
            />
        )}
        </div>
    )
}