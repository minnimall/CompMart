'use client'

import { useState } from 'react'

interface Image { image_url: string }

export function ProductGallery({ images, title }: { images: Image[]; title: string }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const active = images[activeIndex]

    return (
        <div>
        <div className="aspect-square overflow-hidden rounded-2xl bg-surface-2 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]">
            {active ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active.image_url} alt={title} className="h-full w-full object-cover" />
            ) : (
            <div className="flex h-full items-center justify-center text-text-muted">ไม่มีรูปภาพ</div>
            )}
        </div>

        {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
                <button
                key={img.image_url}
                onClick={() => setActiveIndex(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl transition ${
                    i === activeIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                }`}
                >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                </button>
            ))}
            </div>
        )}
        </div>
    )
}