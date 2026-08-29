import { signIn } from '@/lib/actions/auth'
import { AuthInput } from '@/components/auth/AuthInput'
import { PasswordInput } from '@/components/auth/PasswordInput'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>
}) {
    const params = await searchParams

    return (
        <div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Auth // Login
        </span>
        <h1 className="mt-3 font-display text-3xl font-medium text-text">เข้าสู่ระบบ</h1>
        <p className="mt-2 text-sm text-text-muted">กลับมาเช็คของที่ถูกใจต่อ</p>

        {params.message && (
            <p className="mt-6 rounded-lg border-l-2 border-accent bg-surface-2 px-4 py-3 text-sm text-text">
            {params.message}
            </p>
        )}
        {params.error && (
            <p className="mt-6 rounded-lg border-l-2 border-red-500 bg-surface-2 px-4 py-3 text-sm text-text">
            {params.error}
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

            <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-medium text-white transition hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
            เข้าสู่ระบบ
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition group-hover:translate-x-0.5"
            >
                <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
            ยังไม่มีบัญชี?{' '}
            <a href="/register" className="text-accent hover:underline">
            สมัครสมาชิก
            </a>
        </p>
        </div>
    )
}