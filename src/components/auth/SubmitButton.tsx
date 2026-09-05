'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus()

    return (
        <button
        type="submit"
        disabled={pending}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-medium text-white transition
            shadow-[6px_6px_14px_rgba(20,80,143,0.35),-4px_-4px_10px_rgba(255,255,255,0.4)]
            hover:bg-primary-dark
            active:shadow-[inset_4px_4px_10px_rgba(10,40,80,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.15)] active:translate-y-[1px]
            disabled:cursor-not-allowed disabled:opacity-70 disabled:active:translate-y-0 disabled:active:shadow-[6px_6px_14px_rgba(20,80,143,0.35),-4px_-4px_10px_rgba(255,255,255,0.4)]"
        >
        {pending ? (
            <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            กำลังดำเนินการ...
            </>
        ) : (
            <>
            {label}
            <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                className="transition group-hover:translate-x-0.5"
            >
                <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            </>
        )}
        </button>
    )
}