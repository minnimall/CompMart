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

const MAX_IMAGES = 6

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
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [imageError, setImageError] = useState<string | null>(null)

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

    const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        if (files.length === 0) return
        e.target.value = '' // เคลียร์ input กันเลือกไฟล์เดิมซ้ำไม่ trigger onChange

        setImageError(null)

        const remainingSlots = MAX_IMAGES - images.length
        if (remainingSlots <= 0) {
        setImageError(`เพิ่มรูปได้สูงสุด ${MAX_IMAGES} รูป`)
        return
        }

        const filesToUpload = files.slice(0, remainingSlots)
        const invalidFile = filesToUpload.find((f) => !f.type.startsWith('image/'))
        if (invalidFile) {
        setImageError('เลือกได้เฉพาะไฟล์รูปภาพ')
        return
        }
        const tooLargeFile = filesToUpload.find((f) => f.size > 5 * 1024 * 1024)
        if (tooLargeFile) {
        setImageError('แต่ละไฟล์ต้องมีขนาดไม่เกิน 5MB')
        return
        }

        setIsUploadingImage(true)
        try {
        const supabase = createClient()
        const uploadedUrls: string[] = []

        for (const file of filesToUpload) {
            const ext = file.name.split('.').pop()
            const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

            const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(path, file)

            if (uploadError) throw uploadError

            const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(path)

            uploadedUrls.push(publicUrlData.publicUrl)
        }

        setImages((prev) => [...prev, ...uploadedUrls])
        } catch (err) {
        console.error('Error uploading image:', err)
        setImageError('อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง')
        } finally {
        setIsUploadingImage(false)
        }
    }

    const handleRemoveImage = (urlToRemove: string) => {
        setImages((prev) => prev.filter((url) => url !== urlToRemove))
    }

    const handleSubmit = (formData: FormData) => {
        formData.set('images', JSON.stringify(images))
        startTransition(() => updateProduct(productId, formData))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface p-6 shadow-[10px_10px_24px_rgba(20,80,143,0.25),-8px_-8px_20px_rgba(255,255,255,0.6)] dark:shadow-[10px_10px_28px_rgba(0,0,0,0.6),-6px_-6px_16px_rgba(255,255,255,0.03)]">
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

                {/* ส่วนจัดการรูปภาพ */}
                <div>
                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-text-muted">
                    รูปสินค้า ({images.length}/{MAX_IMAGES})
                    </label>
                    {images.length < MAX_IMAGES && (
                    <label className="cursor-pointer text-xs font-medium text-primary hover:underline">
                        {isUploadingImage ? 'กำลังอัปโหลด...' : '+ เพิ่มรูป'}
                        <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAddImages}
                        disabled={isUploadingImage}
                        className="hidden"
                        />
                    </label>
                    )}
                </div>

                {imageError && (
                    <p className="mt-1 text-xs text-red-500">{imageError}</p>
                )}

                {images.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                    {images.map((url, index) => (
                        <div key={url} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        {index === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5 text-center text-[10px] text-white">
                            รูปหลัก
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(url)}
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
                            aria-label="ลบรูปนี้"
                        >
                            ✕
                        </button>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="mt-2 text-xs text-text-muted">ยังไม่มีรูปสินค้า</p>
                )}
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
                    disabled={isPending || isUploadingImage}
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