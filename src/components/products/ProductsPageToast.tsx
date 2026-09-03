'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast/ToastProvider'

export function ProductsPageToast({ message }: { message?: string }) {
    const router = useRouter()
    const { success } = useToast()
    const shown = useRef(false)

    useEffect(() => {
        if (message && !shown.current) {
        shown.current = true
        success(message)
        router.replace('/dashboard/my-products')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])

    return null
}