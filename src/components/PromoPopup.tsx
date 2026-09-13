'use client'

import { useEffect, useState } from 'react'

type PromoPopupProps = {
  /** รูปที่จะโชว์ใน popup */
  imageUrl: string
  /** ลิงก์ที่จะพาไปเมื่อคลิกที่รูป (ใส่ '#' ถ้าไม่ต้องการให้คลิกแล้วไปไหน) */
  href?: string
  /** ข้อความ alt ของรูป */
  alt?: string
  /** key ที่ใช้เก็บใน sessionStorage เผื่อมี popup หลายอันในเว็บ ให้ตั้งชื่อไม่ซ้ำกัน */
  storageKey?: string
  /** หน่วงเวลาก่อนเด้ง (มิลลิวินาที) */
  delay?: number
}

export function PromoPopup({
    imageUrl,
    href,
    alt = 'โปรโมชั่น',
    storageKey = 'promo-popup-dismissed',
    delay = 400,
    }: PromoPopupProps) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        // ถ้าปิดไปแล้วในเซสชันนี้ ไม่ต้องเด้งอีก
        const dismissed = sessionStorage.getItem(storageKey)
        if (dismissed) return

        const timer = setTimeout(() => setOpen(true), delay)
        return () => clearTimeout(timer)
    }, [storageKey, delay])

    const close = () => {
        setOpen(false)
        sessionStorage.setItem(storageKey, '1')
    }

    if (!open) return null

    const imageContent = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
        src={imageUrl}
        alt={alt}
        className="max-h-[80vh] w-full rounded-2xl object-contain"
        />
    )

    return (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={close}
        role="dialog"
        aria-modal="true"
        >
        <div
            className="relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
        >
            <button
            onClick={close}
            aria-label="ปิดหน้าต่างโปรโมชั่น"
            className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-text shadow-[4px_4px_10px_rgba(0,0,0,0.25)] transition hover:scale-105 hover:bg-white/90"
            >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
            </button>

            {href ? (
            <a href={href} onClick={close}>
                {imageContent}
            </a>
            ) : (
            imageContent
            )}
        </div>
        </div>
    )
}