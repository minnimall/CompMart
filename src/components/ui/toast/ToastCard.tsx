'use client'

import { useEffect, type ReactElement } from 'react'
import type { ToastItem, ToastType } from './ToastProvider'

const STYLES: Record<
    ToastType,
    {
        bar: string
        text: string
        bg: string
        iconBg: string
        icon: ReactElement
    }
> = {
    success: {
        bar: 'bg-gradient-to-r from-green-400 to-emerald-500',
        text: 'text-emerald-600',
        bg: 'bg-[#e8f8ef]',
        iconBg: 'bg-[#d5f1df]',
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },

    error: {
        bar: 'bg-gradient-to-r from-red-400 to-rose-500',
        text: 'text-red-500',
        bg: 'bg-[#fff0f0]',
        iconBg: 'bg-[#ffe0e0]',
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },

    info: {
        bar: 'bg-gradient-to-r from-blue-400 to-indigo-500',
        text: 'text-blue-500',
        bg: 'bg-[#edf4ff]',
        iconBg: 'bg-[#dce9ff]',
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },
}

export function ToastCard({
    toast,
    onDone,
}: {
    toast: ToastItem
    onDone: () => void
}) {
    useEffect(() => {
        const timer = setTimeout(onDone, toast.duration)

        return () => clearTimeout(timer)
    }, [toast.duration, onDone])

    const s = STYLES[toast.type]

    return (
        <div
            className={`
                group
                animate-toast-in
                relative
                w-[360px]
                max-w-[calc(100vw-32px)]
                overflow-hidden
                rounded-[24px]
                border
                border-white/80
                ${s.bg}
                
                /* Clay outer shadow */
                shadow-[
                    10px_10px_20px_rgba(163,177,198,0.35),
                    -10px_-10px_20px_rgba(255,255,255,0.9),
                    inset_2px_2px_4px_rgba(255,255,255,0.7),
                    inset_-2px_-2px_4px_rgba(163,177,198,0.12)
                ]

                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[
                    14px_14px_25px_rgba(163,177,198,0.4),
                    -12px_-12px_24px_rgba(255,255,255,0.95),
                    inset_2px_2px_5px_rgba(255,255,255,0.8),
                    inset_-2px_-2px_5px_rgba(163,177,198,0.12)
                ]
            `}
        >
            {/* Soft highlight */}
            <div
                className="
                    pointer-events-none
                    absolute
                    left-5
                    right-5
                    top-1
                    h-8
                    rounded-full
                    bg-white/50
                    blur-md
                "
            />

            {/* Content */}
            <div className="relative flex items-center gap-4 p-4">
                {/* Icon */}
                <div
                    className={`
                        ${s.iconBg}
                        ${s.text}
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-[16px]

                        shadow-[
                            4px_4px_8px_rgba(163,177,198,0.25),
                            -4px_-4px_8px_rgba(255,255,255,0.8),
                            inset_1px_1px_2px_rgba(255,255,255,0.7)
                        ]

                        transition-transform
                        duration-300
                        group-hover:scale-105
                    `}
                >
                    {s.icon}
                </div>

                {/* Message */}
                <div className="min-w-0 flex-1">
                    <p
                        className="
                            text-sm
                            font-semibold
                            leading-5
                            tracking-[-0.01em]
                            text-slate-700
                        "
                    >
                        {toast.message}
                    </p>
                </div>

                {/* Close */}
                <button
                    type="button"
                    onClick={onDone}
                    aria-label="Close notification"
                    className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        text-slate-400

                        shadow-[
                            3px_3px_6px_rgba(163,177,198,0.2),
                            -3px_-3px_6px_rgba(255,255,255,0.7)
                        ]

                        transition-all
                        duration-200

                        hover:scale-105
                        hover:text-slate-600

                        active:scale-95
                        active:shadow-[
                            inset_2px_2px_4px_rgba(163,177,198,0.25),
                            inset_-2px_-2px_4px_rgba(255,255,255,0.7)
                        ]
                    "
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Progress */}
            <div className="mx-4 mb-3 h-1.5 overflow-hidden rounded-full bg-black/[0.04] shadow-inner">
                <div
                    className={`
                        animate-toast-progress
                        h-full
                        rounded-full
                        ${s.bar}
                        shadow-[0_1px_4px_rgba(0,0,0,0.15)]
                    `}
                    style={{
                        animationDuration: `${toast.duration}ms`,
                    }}
                />
            </div>
        </div>
    )
}