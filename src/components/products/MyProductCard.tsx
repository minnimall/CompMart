'use client'

import { useState, useTransition } from 'react'
import { deleteProduct, toggleProductStatus } from '@/lib/actions/products'
import { EditProductModal } from '@/app/products/EditProductModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/toast/ToastProvider'

interface Product {
    id: string
    title: string
    price: number
    stock: number
    status: string
    product_images: { image_url: string }[]
}

export function MyProductCard({ product }: { product: Product }) {
    const [isPending, startTransition] = useTransition()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const { success, error } = useToast()
    const thumbnail = product.product_images?.[0]?.image_url

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteProduct(product.id)
                success('ลบสินค้าสำเร็จ')
            } catch {
                error('ลบสินค้าไม่สำเร็จ ลองใหม่อีกครั้ง')
            } finally {
                setIsDeleteOpen(false)
            }
        })
    }

    const handleToggle = () => {
        startTransition(() => toggleProductStatus(product.id, product.status))
    }

    return (
        <div className="rounded-2xl bg-surface p-4 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]">
        <div className="mb-3 h-28 overflow-hidden rounded-xl bg-surface-2">
            {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt={product.title} className="h-full w-full object-cover" />
            )}
        </div>

        <p className="truncate text-sm font-medium text-text">{product.title}</p>
        <p className="mt-0.5 text-sm font-semibold text-primary">฿{Number(product.price).toLocaleString()}</p>
        <p className="mt-0.5 text-xs text-text-muted">คงเหลือ {product.stock} ชิ้น</p>

        <div className="mt-3 flex items-center gap-2">
            <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex-1 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                product.status === 'active'
                ? 'bg-secondary/10 text-secondary'
                : 'bg-surface-2 text-text-muted'
            }`}
            >
            {product.status === 'active' ? 'กำลังขาย' : 'ปิดการขาย'}
            </button>
            <button
            onClick={() => setIsEditOpen(true)}
            disabled={isPending}
            className="rounded-xl bg-surface-2 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10"
            >
            แก้ไข
            </button>
            <button
            onClick={() => setIsDeleteOpen(true)}
            disabled={isPending}
            className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20"
            >
            ลบ
            </button>
        </div>

        {isEditOpen && (
            <EditProductModal productId={product.id} onClose={() => setIsEditOpen(false)} />
        )}

        {isDeleteOpen && (
            <ConfirmDialog
                title="ลบสินค้านี้?"
                message={`คุณต้องการลบ "${product.title}" ใช่ไหม? การกระทำนี้ไม่สามารถย้อนกลับได้`}
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