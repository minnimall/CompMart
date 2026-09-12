'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function RecoverySessionGate({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'checking' | 'ready' | 'invalid'>('checking')

    useEffect(() => {
        const code = searchParams.get('code')
        const supabase = createClient()

        async function verify() {
            if (!code) {
                setStatus('invalid')
                return
            }

            const { error } = await supabase.auth.exchangeCodeForSession(code)
            if (error) {
                console.error('exchangeCodeForSession error:', error.message)
                setStatus('invalid')
                return
            }

            // ลบ code ออกจาก URL กัน exchange ซ้ำถ้า refresh หน้า (code ใช้ได้ครั้งเดียว)
            window.history.replaceState(null, '', window.location.pathname)
            setStatus('ready')
        }

        verify()
    }, [searchParams])

    if (status === 'invalid') {
        return (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-text shadow-[inset_2px_2px_6px_rgba(239,68,68,0.15)]">
                ลิงก์หมดอายุหรือไม่ถูกต้อง กรุณาขอลิงก์ใหม่อีกครั้ง
            </p>
        )
    }

    if (status === 'checking') {
        return <p className="py-8 text-center text-sm text-text-muted">กำลังตรวจสอบลิงก์...</p>
    }

    return <>{children}</>
}