'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProduct, toggleProductStatus } from '@/lib/actions/products'
import { EditProductModal } from '@/app/products/EditProductModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/toast/ToastProvider'

export function ProductDetailActions({
    productId,
    productTitle,
    productStatus,
    isOwner,
    isLoggedIn,
}: {
    productId: string
    productTitle: string
    productStatus: string
    isOwner: boolean
    isLoggedIn: boolean
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const { success, error, info } = useToast()

    const handleDelete = () => {
        startTransition(async () => {
        try {
            await deleteProduct(productId)
            success('ลบสินค้าสำเร็จ')
            router.push('/dashboard/my-products')
        } catch {
            error('ลบสินค้าไม่สำเร็จ ลองใหม่อีกครั้ง')
            setIsDeleteOpen(false)
        }
        })
    }

    const handleToggle = () => {
        startTransition(() => toggleProductStatus(productId, productStatus))
    }

    if (isOwner) {
        return (
        <div className="flex gap-3">
            <button
                onClick={handleToggle}
                disabled={isPending}
                className="flex-1 cursor-pointer rounded-xl bg-surface-2 px-4 py-2.5 text-sm font-medium text-text transition disabled:cursor-not-allowed disabled:opacity-60"
            >
                {productStatus === 'active' ? 'ปิดการขาย' : 'เปิดขายอีกครั้ง'}
            </button>

            <button
                onClick={() => setIsEditOpen(true)}
                className="flex-1 cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark"
            >
                แก้ไขสินค้า
            </button>

            <button
                onClick={() => setIsDeleteOpen(true)}
                disabled={isPending}
                className="cursor-pointer rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500/10 dark:hover:bg-red-500/20"
            >
                ลบ
            </button>

            {isEditOpen && (
            <EditProductModal productId={productId} onClose={() => setIsEditOpen(false)} />
            )}

            {isDeleteOpen && (
            <ConfirmDialog
                title="ลบสินค้านี้?"
                message={`คุณต้องการลบ "${productTitle}" ใช่ไหม? การกระทำนี้ไม่สามารถย้อนกลับได้`}
                confirmLabel="ลบสินค้า"
                danger
                isPending={isPending}
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
            />
            )}
        </div>
        )
    }

    if (!isLoggedIn) {
        return (
        <a
            href="/login"
            className="block rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-primary-dark"
        >
            เข้าสู่ระบบเพื่อติดต่อผู้ขาย
        </a>
        )
    }

    return (
        <div className="flex gap-3">
        <button
            onClick={() => info('ระบบแชทกำลังพัฒนา เร็วๆ นี้')}
            disabled={productStatus !== 'active'}
            className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
            ติดต่อผู้ขาย
        </button>
        <button
            onClick={() => info('ระบบรายการโปรดกำลังพัฒนา เร็วๆ นี้')}
            className="rounded-xl bg-surface-2 px-4 py-2.5 text-sm font-medium text-text transition"
        >
            ♡ ถูกใจ
        </button>
        </div>
    )
}