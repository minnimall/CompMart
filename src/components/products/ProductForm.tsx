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
    const [accepted, setAccepted] = useState(false)

    return (
        <form action={createProduct} className="w-full">
            <input type="hidden" name="images" value={JSON.stringify(images)} />

            {/* Main Card - Wrapper with rounded */}
            <div className="mt-4">
                <div className="overflow-hidden rounded-[24px] bg-surface shadow-[8px_10px_24px_rgba(20,80,143,0.13),-5px_-5px_14px_rgba(255,255,255,0.8)] dark:shadow-[8px_10px_24px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(255,255,255,0.025)]">

                    {/* Card Header */}
                    <div className="border-b border-border/40 px-5 py-4 sm:px-6">
                        <h2 className="text-sm font-semibold text-text">Create Product</h2>
                        <p className="mt-0.5 text-[11px] text-text-muted">เพิ่มข้อมูลสินค้าและรายละเอียดเพื่อเริ่มต้นการขาย</p>
                    </div>

                    {/* Form Content */}
                    <div className="grid lg:grid-cols-[1fr_1fr]">

                        {/* LEFT : PRODUCT INFORMATION */}
                        <div className="p-5 sm:p-6">
                            <div className="mb-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Product Information</p>
                            </div>

                            <div className="space-y-4">

                                {/* Product Name */}
                                <AuthInput label="ชื่อสินค้า" name="title" required />

                                {/* Category */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-text">หมวดหมู่</label>
                                    <select name="category_id" className="h-[42px] w-full rounded-xl border-0 bg-surface-2 px-3.5 text-sm text-text outline-none transition shadow-[inset_3px_3px_8px_rgba(20,80,143,0.10),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] focus:ring-2 focus:ring-primary/25 dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]">
                                        <option value="">เลือกหมวดหมู่</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <label className="text-xs font-medium text-text">รายละเอียดสินค้า</label>
                                        <span className="text-[10px] text-text-muted">แนะนำไม่เกิน 1000 ตัวอักษร</span>
                                    </div>
                                    <textarea name="description" rows={5} placeholder="อธิบายรายละเอียดสินค้า เช่น รุ่น อุปกรณ์ที่ได้รับ อายุการใช้งาน หรือสภาพสินค้า..." className="w-full resize-none rounded-xl border-0 bg-surface-2 p-3.5 text-sm text-text placeholder:text-text-muted/50 outline-none transition shadow-[inset_3px_3px_8px_rgba(20,80,143,0.10),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] focus:ring-2 focus:ring-primary/25 dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]" />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-text">ราคา</label>
                                    <div className="flex h-[42px] overflow-hidden rounded-xl bg-surface-2 shadow-[inset_3px_3px_8px_rgba(20,80,143,0.10),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]">
                                        <input name="price" type="number" required placeholder="0" min="0" className="min-w-0 flex-1 border-0 bg-transparent px-3.5 text-sm text-text outline-none" />
                                        <div className="flex items-center border-l border-border/30 px-3 text-xs text-text-muted">บาท</div>
                                    </div>
                                </div>

                                {/* Brand + Condition */}
                                <div className="grid grid-cols-2 gap-3">
                                    <AuthInput label="แบรนด์" name="brand" />
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-text">สภาพสินค้า</label>
                                        <select name="condition" defaultValue="new" className="h-[42px] w-full rounded-xl border-0 bg-surface-2 px-3 text-sm text-text outline-none transition shadow-[inset_3px_3px_8px_rgba(20,80,143,0.10),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] focus:ring-2 focus:ring-primary/25 dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]">
                                            {conditions.map((c) => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-text">จำนวนสต๊อก</label>
                                    <input name="stock" type="number" required min="1" placeholder="จำนวนสินค้า" className="h-[42px] w-full rounded-xl border-0 bg-surface-2 px-3.5 text-sm text-text placeholder:text-text-muted/50 outline-none transition shadow-[inset_3px_3px_8px_rgba(20,80,143,0.10),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] focus:ring-2 focus:ring-primary/25 dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]" />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT : PRODUCT PHOTOS */}
                        <div className="border-t border-border/40 bg-surface-2/30 p-5 sm:p-6 lg:border-l lg:border-t-0">
                            <div className="mb-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Product Photos</p>
                                <p className="mt-1 text-[11px] text-text-muted">เพิ่มรูปภาพสินค้าเพื่อให้ผู้ซื้อเห็นสินค้าได้ชัดเจน</p>
                            </div>

                            <ProductImageUpload userId={userId} onChange={setImages} />

                            {/* Upload Tips */}
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></svg>
                                    <span>สามารถเพิ่มรูปภาพสินค้าได้หลายรูป</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-text-muted">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18" /><path d="M3 12h18" /></svg>
                                    <span>แนะนำให้ใช้รูปภาพที่มีแสงสว่างเพียงพอ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border/40 px-5 py-4 sm:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Agreement */}
                            <label className="flex cursor-pointer items-start gap-2">
                                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border accent-primary" />
                                <span className="text-[11px] leading-relaxed text-text-muted">ฉันยืนยันว่าข้อมูลสินค้าเป็นความจริง และยอมรับเงื่อนไขการลงขายสินค้า</span>
                            </label>

                            {/* Submit */}
                            <button type="submit" disabled={!accepted} className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-white shadow-[5px_5px_12px_rgba(20,80,143,0.28),-3px_-3px_8px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark active:translate-y-[1px] active:shadow-[inset_3px_3px_8px_rgba(10,40,80,0.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 dark:shadow-[5px_5px_12px_rgba(0,0,0,0.45),-3px_-3px_7px_rgba(255,255,255,0.03)]">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                                ลงขายสินค้า
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}