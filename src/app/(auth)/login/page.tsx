import { signIn } from '@/lib/actions/auth'
import { AuthInput } from '@/components/auth/AuthInput'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { SubmitButton } from '@/components/auth/SubmitButton'

const ERROR_MESSAGES: Record<string, string> = {
    account_deleted: 'บัญชีนี้ถูกปิดใช้งานไปแล้ว หากต้องการกู้คืนกรุณาติดต่อฝ่ายสนับสนุน',
}

function resolveErrorMessage(error: string) {
    return ERROR_MESSAGES[error] ?? error
}

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>
}) {
    const params = await searchParams

    return (
        <div>
        <h1 className="text-3xl font-semibold text-text">เข้าสู่ระบบ</h1>
        <p className="mt-2 text-sm text-text-muted">กลับมาเช็คของที่ถูกใจต่อ</p>

        {params.message && (
            <p className="mt-6 rounded-2xl bg-secondary/10 px-4 py-3 text-sm text-text
            shadow-[inset_2px_2px_6px_rgba(22,184,201,0.15)]">
            {params.message}
            </p>
        )}
        {params.error && (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-text
            shadow-[inset_2px_2px_6px_rgba(239,68,68,0.15)]">
            {resolveErrorMessage(params.error)}
            </p>
        )}

        <form action={signIn} className="mt-8 space-y-5">
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
            <PasswordInput autoComplete="current-password" />

            <SubmitButton label="เข้าสู่ระบบ" />
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
            ยังไม่มีบัญชี?{' '}
            <a href="/register" className="font-medium text-primary hover:text-primary-dark">
            สมัครสมาชิก
            </a>
        </p>
        </div>
    )
}