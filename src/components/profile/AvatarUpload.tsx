'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/toast/ToastProvider'
import { updateAvatarUrl } from '@/lib/actions/profile'

interface AvatarUploadProps {
    userId: string
    currentAvatarUrl?: string | null
    fallbackChar: string
}

export function AvatarUpload({ userId, currentAvatarUrl, fallbackChar }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl ?? null)
    const inputRef = useRef<HTMLInputElement>(null)
    const toast = useToast()
    const router = useRouter()
    const supabase = createClient()

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('ไฟล์ต้องมีขนาดไม่เกิน 2MB')
            return
        }

        setUploading(true)

        try {
            const fileExt = file.name.split('.').pop()
            const filePath = `${userId}/avatar.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            const newUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`

            const result = await updateAvatarUrl(newUrl)

            if (result.success) {
                setPreviewUrl(newUrl)
                toast.success('อัปเดตรูปโปรไฟล์สำเร็จ')
                router.refresh() // บังคับให้ Navbar (Server Component) fetch ข้อมูลใหม่
            } else {
                toast.error(result.error || 'บันทึกไม่สำเร็จ')
            }
        } catch (err) {
            toast.error('อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่')
        } finally {
            setUploading(false)
            if (inputRef.current) inputRef.current.value = ''
        }
    }

    return (
        <div className="relative shrink-0">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/80 text-2xl sm:text-3xl font-bold text-white shadow-[8px_8px_16px_rgba(20,80,143,0.3),-4px_-4px_12px_rgba(255,255,255,0.8)] ring-4 ring-white/50">
                {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="รูปโปรไฟล์" className="h-full w-full object-cover" />
                ) : (
                    fallbackChar
                )}
            </div>

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white shadow-[4px_4px_8px_rgba(22,184,201,0.4)] transition hover:brightness-105 disabled:opacity-50"
                aria-label="เปลี่ยนรูปโปรไฟล์"
            >
                {uploading ? (
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    )
}