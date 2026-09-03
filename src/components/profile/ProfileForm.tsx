'use client'

import { useTransition } from 'react'
import { AuthInput } from '@/components/auth/AuthInput'
import { PhoneInput } from '@/components/profile/PhoneInput'
import { updateProfile } from '@/lib/actions/profile'
import { useToast } from '@/components/ui/toast/ToastProvider'

interface ProfileFormProps {
    profile: {
        username?: string
        full_name?: string
        phone?: string
        address?: string
    } | null
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()
    const toast = useToast()

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
        const result = await updateProfile(formData)

        if (result.success) {
            toast.success(result.message || 'บันทึกสำเร็จ')
        } else {
            toast.error(result.error || 'เกิดข้อผิดพลาด')
        }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div>
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            ข้อมูลส่วนตัว
            </h3>
            <div className="space-y-4 pl-4">
            <AuthInput
                label="ชื่อผู้ใช้"
                name="username"
                required
                defaultValue={profile?.username ?? ''}
                icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
                }
            />
            <AuthInput
                label="ชื่อ-นามสกุล"
                name="full_name"
                defaultValue={profile?.full_name ?? ''}
                icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                }
            />
            </div>
        </div>

        {/* Contact Information Section */}
        <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            ข้อมูลติดต่อ
            </h3>
            <div className="space-y-4 pl-4">
            <PhoneInput defaultValue={profile?.phone ?? ''} />
            <AuthInput
                label="ที่อยู่"
                name="address"
                defaultValue={profile?.address ?? ''}
                icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                }
            />
            </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-border">
            <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-2xl bg-gradient-to-r from-primary to-primary/90 py-4 font-semibold text-white shadow-[8px_8px_16px_rgba(20,80,143,0.4),-4px_-4px_12px_rgba(255,255,255,0.5)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.55),-3px_-3px_10px_rgba(255,255,255,0.04)] transition duration-200 hover:shadow-[10px_10px_20px_rgba(20,80,143,0.5)] dark:hover:shadow-[10px_10px_22px_rgba(0,0,0,0.6)] active:shadow-[inset_4px_4px_10px_rgba(10,40,80,0.4)] dark:active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.7)] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isPending ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </button>
        </div>
        </form>
    )
}