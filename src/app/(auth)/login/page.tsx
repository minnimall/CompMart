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
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-medium text-white transition
            shadow-[6px_6px_14px_rgba(20,80,143,0.35),-4px_-4px_10px_rgba(255,255,255,0.4)]
            hover:bg-primary-dark
            active:shadow-[inset_4px_4px_10px_rgba(10,40,80,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.15)] active:translate-y-[1px]"
        >
          เข้าสู่ระบบ
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            className="transition group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
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