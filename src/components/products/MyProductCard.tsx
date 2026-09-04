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
                className={`flex-1 cursor-pointer rounded-xl px-3 py-1.5 text-xs font-medium transition hover:brightness-95 ${
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
                title="แก้ไขสินค้า"
                aria-label="แก้ไขสินค้า"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-surface-2 text-primary transition hover:bg-primary/10"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>

            <button
                onClick={() => setIsDeleteOpen(true)}
                disabled={isPending}
                title="ลบสินค้า"
                aria-label="ลบสินค้า"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
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