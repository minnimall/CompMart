'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function RecoverySessionGate({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false)
    const [invalid, setInvalid] = useState(false)

    useEffect(() => {
        const supabase = createClient()

        // เรียก getSession() เพื่อทริกเกอร์ให้ library อ่าน token จาก URL fragment
        // แล้วสร้าง session พร้อมเก็บลง cookie ให้ server อ่านต่อได้
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setReady(true)
                window.history.replaceState(null, '', window.location.pathname)
            } else {
                setInvalid(true)
            }
        })

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY' && session) {
                setReady(true)
                window.history.replaceState(null, '', window.location.pathname)
            }
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    if (invalid) {
        return (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-text shadow-[inset_2px_2px_6px_rgba(239,68,68,0.15)]">
                ลิงก์หมดอายุหรือไม่ถูกต้อง กรุณาขอลิงก์ใหม่อีกครั้ง
            </p>
        )
    }

    if (!ready) {
        return <p className="py-8 text-center text-sm text-text-muted">กำลังตรวจสอบลิงก์...</p>
    }

    return <>{children}</>
}