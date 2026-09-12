import { updatePassword } from '@/lib/actions/auth'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { SubmitButton } from '@/components/auth/SubmitButton'

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams

    return (
        <div>
            <h1 className="text-3xl font-semibold text-text">ตั้งรหัสผ่านใหม่</h1>
            <p className="mt-2 text-sm text-text-muted">
                กรอกรหัสผ่านใหม่ที่ต้องการใช้
            </p>

            {params.error && (
                <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-text shadow-[inset_2px_2px_6px_rgba(239,68,68,0.15)]">
                    {params.error}
                </p>
            )}

            <form action={updatePassword} className="mt-8 space-y-5">
                <PasswordInput name="password" minLength={6} autoComplete="new-password" />
                <p className="!mt-2 text-xs text-text-muted">อย่างน้อย 6 ตัวอักษร</p>

                <PasswordInput name="confirmPassword" label="ยืนยันรหัสผ่าน" autoComplete="new-password" />

                <SubmitButton label="บันทึกรหัสผ่านใหม่" />
            </form>
        </div>
    )
}