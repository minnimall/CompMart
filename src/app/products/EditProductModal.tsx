'use client'

import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateProduct } from '@/lib/actions/products'

interface Category { id: string; name: string }
interface ProductImage { image_url: string; sort_order: number }
interface FullProduct {
    id: string
    title: string
    description: string | null
    brand: string | null
    condition: string | null
    price: number
    stock: number
    category_id: string | null
    product_images: ProductImage[]
}

export function EditProductModal({
    productId,
    onClose,
}: {
    productId: string
    onClose: () => void
}) {
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState<FullProduct | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        const supabase = createClient()
        async function load() {
        const [{ data: productData }, { data: categoryData }] = await Promise.all([
            supabase
            .from('products')
            .select('id, title, description, brand, condition, price, stock, category_id, product_images(image_url, sort_order)')
            .eq('id', productId)
            .single(),
            supabase.from('categories').select('id, name').order('name'),
        ])

        if (productData) {
            setProduct(productData as FullProduct)
            const sorted = [...(productData.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
            setImages(sorted.map((img) => img.image_url))
        }
        setCategories(categoryData ?? [])
        setLoading(false)
        }
        load()
    }, [productId])

    const handleSubmit = (formData: FormData) => {
        formData.set('images', JSON.stringify(images))
        startTransition(() => updateProduct(productId, formData))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6 dark:shadow-[10px_10px_28px_rgba(0,0,0,0.6),-6px_-6px_16px_rgba(255,255,255,0.03)]">
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">แก้ไขสินค้า</h2>
            <button onClick={onClose} className="text-text-muted hover:text-text" aria-label="ปิด">✕</button>
            </div>

            {loading || !product ? (
            <p className="py-10 text-center text-sm text-text-muted">กำลังโหลดข้อมูล...</p>
            ) : (
            <form action={handleSubmit} className="space-y-4">
                <div>
                <label className="text-xs font-medium text-text-muted">ชื่อสินค้า</label>
                <input
                    name="title"
                    defaultValue={product.title}
                    required
                    className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                />
                </div>

                <div>
                <label className="text-xs font-medium text-text-muted">รายละเอียด</label>
                <textarea
                    name="description"
                    defaultValue={product.description ?? ''}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                />
                </div>

                <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-text-muted">แบรนด์</label>
                    <input
                    name="brand"
                    defaultValue={product.brand ?? ''}
                    className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-text-muted">สภาพสินค้า</label>
                    <select
                    name="condition"
                    defaultValue={product.condition ?? ''}
                    className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    >
                    <option value="new">ใหม่</option>
                    <option value="like_new">สภาพดีมาก</option>
                    <option value="used_good">มือสอง สภาพดี</option>
                    <option value="used_fair">มือสอง ใช้งานได้</option>
                    </select>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-text-muted">ราคา (บาท)</label>
                    <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={product.price}
                    required
                    className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-text-muted">จำนวนคงเหลือ</label>
                    <input
                    name="stock"
                    type="number"
                    defaultValue={product.stock}
                    required
                    className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    />
                </div>
                </div>

                <div>
                <label className="text-xs font-medium text-text-muted">หมวดหมู่</label>
                <select
                    name="category_id"
                    defaultValue={product.category_id ?? ''}
                    className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                >
                    <option value="">ไม่ระบุ</option>
                    {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                </div>

                {images.length > 0 && (
                <div>
                    <label className="text-xs font-medium text-text-muted">รูปสินค้าปัจจุบัน</label>
                    <div className="mt-1 flex gap-2 overflow-x-auto">
                    {images.map((url) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={url} src={url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                    ))}
                    </div>
                </div>
                )}

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
                    {isPending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
                </div>
            </form>
            )}
        </div>
        </div>
    )
}