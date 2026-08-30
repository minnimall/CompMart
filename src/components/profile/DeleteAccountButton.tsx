'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteAccountButton({ action }: { action: (formData: FormData) => Promise<any> }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = () => {
        startTransition(async () => {
            const formData = new FormData()
            const result = await action(formData)
            
            if (result.success) {
                // Redirect after successful delete
                router.push('/?message=บัญชีของคุณถูกลบแล้ว')
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.error}`)
                setIsOpen(false)
                setIsConfirmed(false)
            }
        })
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="rounded-2xl bg-red-500/90 hover:bg-red-600 px-6 py-3 font-medium text-white shadow-[6px_6px_14px_rgba(239,68,68,0.35)] transition active:shadow-[inset_4px_4px_10px_rgba(185,28,28,0.4)] active:translate-y-[1px]"
            >
                🗑️ ลบบัญชี
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-3xl shadow-[20px_20px_40px_rgba(20,80,143,0.25)] max-w-sm w-full p-8 border border-white/50">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c.866 1.5 2.926 2.871 5.303 2.871s4.437-1.372 5.303-2.87m0 0a3.75 3.75 0 11-7.5 0m7.5 0a3.75 3.75 0 1-7.5 0" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text">ลบบัญชีอย่างถาวร?</h3>
                                <p className="text-sm text-text-muted mt-1">การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
                            </div>
                        </div>

                        <p className="text-sm text-text-muted mb-6">
                            เมื่อคุณลบบัญชี:
                        </p>
                        <ul className="text-sm text-text-muted space-y-2 mb-6 pl-4">
                            <li className="flex gap-2">
                                <span className="text-red-500">•</span>
                                <span>ข้อมูลส่วนตัวทั้งหมดจะถูกลบอย่างถาวร</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-500">•</span>
                                <span>คุณจะไม่สามารถกู้คืนบัญชีได้</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-500">•</span>
                                <span>คุณจะออกจากระบบโดยอัตโนมัติ</span>
                            </li>
                        </ul>

                        <label className="flex items-center gap-3 mb-6 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isConfirmed}
                                onChange={(e) => setIsConfirmed(e.target.checked)}
                                disabled={isPending}
                                className="w-4 h-4 rounded border-border text-red-500 focus:ring-0 disabled:opacity-50"
                            />
                            <span className="text-sm text-text-muted">
                                ฉันเข้าใจและต้องการลบบัญชีนี้
                            </span>
                        </label>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false)
                                    setIsConfirmed(false)
                                }}
                                disabled={isPending}
                                className="flex-1 rounded-2xl border border-border px-4 py-3 font-medium text-text transition hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={!isConfirmed || isPending}
                                className="flex-1 rounded-2xl bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-[6px_6px_14px_rgba(239,68,68,0.35)]"
                            >
                                {isPending ? 'กำลังลบ...' : 'ลบบัญชี'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}