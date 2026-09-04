'use client'

import { useState, useTransition } from 'react'
import { createOrder } from '@/lib/actions/orders'
import { useToast } from '@/components/ui/toast/ToastProvider'

export function OrderModal({
    productId,
    productTitle,
    price,
    stock,
    onClose,
}: {
    productId: string
    productTitle: string
    price: number
    stock: number
    onClose: () => void
}) {
    const [isPending, startTransition] = useTransition()
    const [quantity, setQuantity] = useState(1)
    const { success, error } = useToast()

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
        const result = await createOrder(formData)
        if (result?.error) {
            error(result.error)
        } else {
            success('สั่งซื้อสำเร็จ รอผู้ขายยืนยันออเดอร์')
            onClose()
        }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-2xl bg-surface p-6 dark:shadow-[10px_10px_28px_rgba(0,0,0,0.6),-6px_-6px_16px_rgba(255,255,255,0.03)]">
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">สั่งซื้อสินค้า</h2>
            <button onClick={onClose} className="text-text-muted hover:text-text" aria-label="ปิด">✕</button>
            </div>

            <p className="truncate text-sm font-medium text-text">{productTitle}</p>
            <p className="mt-0.5 text-sm text-text-muted">คงเหลือ {stock} ชิ้น</p>

            <form action={handleSubmit} className="mt-4 space-y-4">
            <input type="hidden" name="product_id" value={productId} />

            <div>
                <label className="text-xs font-medium text-text-muted">จำนวน</label>
                <input
                name="quantity"
                type="number"
                min={1}
                max={stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                />
            </div>

            <div>
                <label className="text-xs font-medium text-text-muted">ที่อยู่จัดส่ง</label>
                <textarea
                name="shipping_address"
                rows={3}
                required
                placeholder="ที่อยู่สำหรับจัดส่งสินค้า"
                className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                />
            </div>

            <div className="rounded-xl bg-surface-2 px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                <span className="text-text-muted">ยอดรวม</span>
                <span className="font-semibold text-primary">
                    ฿{(price * quantity).toLocaleString()}
                </span>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-surface-2 px-4 py-2 text-sm font-medium text-text-muted"
                >
                ยกเลิก
                </button>
                <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
                >
                {isPending ? 'กำลังสั่งซื้อ...' : 'ยืนยันสั่งซื้อ'}
                </button>
            </div>
            </form>
        </div>
        </div>
    )
}