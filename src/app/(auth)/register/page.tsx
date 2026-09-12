import { signUp } from '@/lib/actions/auth'
import { AuthInput } from '@/components/auth/AuthInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { signInWithGoogle } from '@/lib/actions/auth'

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams

    return (
        <div>
        <h1 className="text-3xl font-semibold text-text">สร้างบัญชีใหม่</h1>
        <p className="mt-2 text-sm text-text-muted">
            เริ่มซื้อขายอุปกรณ์คอมและเกมมิ่งเกียร์กับเรา
        </p>

        {params.error && (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-text
            shadow-[inset_2px_2px_6px_rgba(239,68,68,0.15)]">
            {params.error}
            </p>
        )}

        <form action={signUp} className="mt-8 space-y-5">
            <AuthInput
            label="ชื่อผู้ใช้"
            name="username"
            required
            autoComplete="username"
            icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
            }
            />
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
            <PasswordInput minLength={6} autoComplete="new-password" />
            <p className="!mt-2 text-xs text-text-muted">อย่างน้อย 6 ตัวอักษร</p>

            <SubmitButton label="สมัครสมาชิก" />
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
            มีบัญชีแล้ว?{' '}
            <a href="/login" className="font-medium text-primary hover:text-primary-dark">
            เข้าสู่ระบบ
            </a>
        </p>

        <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-text-muted">หรือ</span>
            <div className="h-px flex-1 bg-border" />
        </div>

        <form action={signInWithGoogle} className="mt-6">
            <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-surface py-3.5 text-sm font-medium text-text transition hover:bg-surface-2"
            >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                เข้าสู่ระบบด้วย Google
            </button>
        </form>
        </div>
    )
}