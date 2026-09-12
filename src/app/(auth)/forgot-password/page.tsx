import { requestPasswordReset } from '@/lib/actions/auth'
import { AuthInput } from '@/components/auth/AuthInput'
import { SubmitButton } from '@/components/auth/SubmitButton'

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>
}) {
    const params = await searchParams

    return (
        <div>
            <h1 className="text-3xl font-semibold text-text">ลืมรหัสผ่าน</h1>
            <p className="mt-2 text-sm text-text-muted">
                กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้คุณ
            </p>

            {params.message && (
                <p className="mt-6 rounded-2xl bg-secondary/10 px-4 py-3 text-sm text-text shadow-[inset_2px_2px_6px_rgba(22,184,201,0.15)]">
                    {params.message}
                </p>
            )}
            {params.error && (
                <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-text shadow-[inset_2px_2px_6px_rgba(239,68,68,0.15)]">
                    {params.error}
                </p>
            )}

            <form action={requestPasswordReset} className="mt-8 space-y-5">
                <AuthInput
                    label="อีเมล"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    icon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="m3 7 9 6 9-6" />
                        </svg>
                    }
                />
                <SubmitButton label="ส่งลิงก์รีเซ็ตรหัสผ่าน" />
            </form>

            <p className="mt-6 text-center text-sm text-text-muted">
                นึกรหัสผ่านออกแล้ว?{' '}
                <a href="/login" className="font-medium text-primary hover:text-primary-dark">
                    เข้าสู่ระบบ
                </a>
            </p>
        </div>
    )
}