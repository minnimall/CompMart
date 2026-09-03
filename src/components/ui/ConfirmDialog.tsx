'use client'

export function ConfirmDialog({
    title,
    message,
    confirmLabel = 'ยืนยัน',
    cancelLabel = 'ยกเลิก',
    danger = false,
    isPending = false,
    onConfirm,
    onCancel,
}: {
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
    isPending?: boolean
    onConfirm: () => void
    onCancel: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-2xl bg-surface p-6 dark:shadow-[10px_10px_28px_rgba(0,0,0,0.6),-6px_-6px_16px_rgba(255,255,255,0.03)]">
            <h2 className="text-base font-semibold text-text">{title}</h2>
            <p className="mt-2 text-sm text-text-muted">{message}</p>

            <div className="mt-6 flex gap-3">
            <button
                type="button"
                onClick={onCancel}
                disabled={isPending}
                className="flex-1 rounded-xl bg-surface-2 px-4 py-2 text-sm font-medium text-text-muted transition disabled:opacity-60"
            >
                {cancelLabel}
            </button>
            <button
                type="button"
                onClick={onConfirm}
                disabled={isPending}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60 ${
                danger
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
            >
                {isPending ? 'กำลังดำเนินการ...' : confirmLabel}
            </button>
            </div>
        </div>
        </div>
    )
}