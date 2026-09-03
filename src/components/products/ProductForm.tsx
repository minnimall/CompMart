'use client'

import { useState } from 'react'
import { AuthInput } from '@/components/auth/AuthInput'
import { ProductImageUpload } from '@/components/products/ProductImageUpload'
import { createProduct } from '@/lib/actions/products'

const conditions = [
    { value: 'new', label: 'ใหม่' },
    { value: 'like_new', label: 'สภาพดีมาก' },
    { value: 'used_good', label: 'มือสอง สภาพดี' },
    { value: 'used_fair', label: 'มือสอง ใช้งานได้' },
]

export function ProductForm({
    userId,
    categories,
}: {
    userId: string
    categories: { id: string; name: string }[]
}) {
    const [images, setImages] = useState<string[]>([])

    return (
        <form action={createProduct} className="space-y-5">
        <input type="hidden" name="images" value={JSON.stringify(images)} />

        <ProductImageUpload userId={userId} onChange={setImages} />

        <AuthInput
            label="ชื่อสินค้า"
            name="title"
            required
            icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
            </svg>
            }
        />

        <div>
            <label className="mb-2 block text-sm font-medium text-text">รายละเอียดสินค้า</label>
            <textarea
            name="description"
            rows={4}
            className="w-full rounded-2xl border-0 bg-surface-2 p-4 text-text outline-none transition shadow-[inset_4px_4px_10px_rgba(20,80,143,0.15),inset_-4px_-4px_10px_rgba(255,255,255,0.85)] dark:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5),inset_-3px_-3px_8px_rgba(255,255,255,0.03)] focus:ring-2 focus:ring-primary/30"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <AuthInput
            label="แบรนด์"
            name="brand"
            icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                </svg>
            }
            />

            <div>
            <label className="mb-2 block text-sm font-medium text-text">สภาพสินค้า</label>
            <select
                name="condition"
                defaultValue="new"
                className="w-full rounded-2xl border-0 bg-surface-2 px-4 py-3.5 text-text outline-none transition shadow-[inset_4px_4px_10px_rgba(20,80,143,0.15),inset_-4px_-4px_10px_rgba(255,255,255,0.85)] dark:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5),inset_-3px_-3px_8px_rgba(255,255,255,0.03)] focus:ring-2 focus:ring-primary/30"
            >
                {conditions.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
                ))}
            </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <AuthInput
            label="ราคา (บาท)"
            name="price"
            type="number"
            required
            icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            }
            />
            <AuthInput
            label="จำนวนสต๊อก"
            name="stock"
            type="number"
            required
            icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="7" width="18" height="14" rx="2" />
                <path d="M3 11h18" />
                </svg>
            }
            />
        </div>

        <div>
            <label className="mb-2 block text-sm font-medium text-text">หมวดหมู่</label>
            <select
            name="category_id"
            className="w-full rounded-2xl border-0 bg-surface-2 px-4 py-3.5 text-text outline-none transition shadow-[inset_4px_4px_10px_rgba(20,80,143,0.15),inset_-4px_-4px_10px_rgba(255,255,255,0.85)] dark:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.5),inset_-3px_-3px_8px_rgba(255,255,255,0.03)] focus:ring-2 focus:ring-primary/30"
            >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            </select>
        </div>

        <button
            type="submit"
            className="w-full rounded-2xl bg-primary py-3.5 font-medium text-white shadow-[6px_6px_14px_rgba(20,80,143,0.35),-4px_-4px_10px_rgba(255,255,255,0.4)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-3px_-3px_8px_rgba(255,255,255,0.03)] transition hover:bg-primary-dark active:shadow-[inset_4px_4px_10px_rgba(10,40,80,0.4)] dark:active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.7)] active:translate-y-[1px]"
        >
            ลงขายสินค้า
        </button>
        </form>
    )
}