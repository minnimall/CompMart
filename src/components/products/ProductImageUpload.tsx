'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ProductImageUpload({
    userId,
    onChange,
}: {
    userId: string
    onChange: (urls: string[]) => void
}) {
    const [images, setImages] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return
        setUploading(true)
        const supabase = createClient()
        const uploaded: string[] = []

        for (const file of Array.from(files).slice(0, 6 - images.length)) {
        const path = `${userId}/${crypto.randomUUID()}-${file.name}`
        const { error } = await supabase.storage.from('product-images').upload(path, file)
        if (!error) {
            const { data } = supabase.storage.from('product-images').getPublicUrl(path)
            uploaded.push(data.publicUrl)
        }
        }

        const next = [...images, ...uploaded]
        setImages(next)
        onChange(next)
        setUploading(false)
    }

    const removeImage = (url: string) => {
        const next = images.filter((i) => i !== url)
        setImages(next)
        onChange(next)
    }

    return (
        <div>
        <label className="mb-2 block text-sm font-medium text-text">รูปสินค้า (สูงสุด 6 รูป)</label>

        <div className="flex flex-wrap gap-3">
            {images.map((url) => (
            <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-xl bg-surface-2 shadow-[inset_2px_2px_6px_rgba(20,80,143,0.12),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.02)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="ลบรูปนี้"
                >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                </button>
            </div>
            ))}

            {images.length < 6 && (
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl bg-surface-2 text-text-muted shadow-[inset_2px_2px_6px_rgba(20,80,143,0.12),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] transition hover:text-primary">
                {uploading ? (
                <span className="text-xs">กำลังอัปโหลด...</span>
                ) : (
                <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 5v14M5 12h14" />
                    </svg>
                    <span className="text-xs">เพิ่มรูป</span>
                </>
                )}
                <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleFiles(e.target.files)}
                />
            </label>
            )}
        </div>
        </div>
    )
}