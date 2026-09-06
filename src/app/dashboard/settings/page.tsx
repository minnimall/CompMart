import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { deleteProfile } from '@/lib/actions/profile'
import { DeleteAccountButton } from '@/components/profile/DeleteAccountButton'
import { AvatarUpload } from '@/components/profile/AvatarUpload'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    const username = profile?.username || 'ผู้ใช้งาน'
    const email = user.email || 'ไม่พบอีเมล'
    const fallbackChar = (profile?.username ?? user.email ?? '?').charAt(0).toUpperCase()

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gradient-to-b from-bg via-bg to-bg/80 px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
                <div className="mx-auto w-full max-w-6xl">

                    {/* Header */}
                    <header className="mb-7">
                        <div className="flex items-center gap-3">
                            <div className="min-w-0">
                                <h1 className="text-2xl font-semibold text-text">การตั้งค่า</h1>
                                <p className="mt-1 text-sm text-text-muted">จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ</p>
                            </div>
                        </div>
                    </header>

                    {/* Profile + Account */}
                    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

                        {/* Profile */}
                        <section className="h-fit overflow-hidden rounded-[26px] bg-surface shadow-[8px_10px_24px_rgba(20,80,143,0.11),-6px_-6px_16px_rgba(255,255,255,0.85)] dark:shadow-[8px_10px_24px_rgba(0,0,0,0.42),-4px_-4px_12px_rgba(255,255,255,0.03)]">
                            <div className="border-b border-border/40 px-5 py-4">
                                <p className="text-sm font-semibold text-text">โปรไฟล์ของฉัน</p>
                                <p className="mt-0.5 text-xs text-text-muted">ข้อมูลโปรไฟล์ของคุณ</p>
                            </div>

                            <div className="px-5 py-7">
                                <div className="flex flex-col items-center text-center">
                                    <AvatarUpload userId={user.id} currentAvatarUrl={profile?.avatar_url} fallbackChar={fallbackChar} />

                                    <h2 className="mt-5 max-w-full truncate text-lg font-bold text-text">{username}</h2>
                                    <p className="mt-1 max-w-full truncate text-xs text-text-muted">{email}</p>

                                    {/* <div className="mt-5 w-full rounded-2xl bg-surface-2 px-4 py-3 text-left shadow-[inset_3px_3px_8px_rgba(20,80,143,0.08),inset_-3px_-3px_8px_rgba(255,255,255,0.75)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.02)]">
                                        <p className="text-[9px] font-semibold uppercase tracking-wider text-text-muted">Account ID</p>
                                        <p className="mt-1 truncate font-mono text-[11px] text-text-muted">{user.id}</p>
                                    </div> */}
                                </div>
                            </div>
                        </section>

                        {/* Account */}
                        <section className="overflow-hidden rounded-[26px] bg-surface shadow-[8px_10px_24px_rgba(20,80,143,0.11),-6px_-6px_16px_rgba(255,255,255,0.85)] dark:shadow-[8px_10px_24px_rgba(0,0,0,0.42),-4px_-4px_12px_rgba(255,255,255,0.03)]">
                            <div className="border-b border-border/40 px-5 py-4 sm:px-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-text">ข้อมูลบัญชี</p>
                                        <p className="mt-0.5 text-xs text-text-muted">แก้ไขข้อมูลส่วนตัวของคุณ</p>
                                    </div>

                                    <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6">
                                <ProfileForm profile={profile} />
                            </div>
                        </section>
                    </div>

                    {/* Danger Zone */}
                    <section className="mt-6 overflow-hidden rounded-[26px] border border-red-200/70 bg-surface shadow-[8px_10px_24px_rgba(20,80,143,0.08),-5px_-5px_14px_rgba(255,255,255,0.8)] dark:border-red-500/10 dark:shadow-[8px_10px_24px_rgba(0,0,0,0.38),-4px_-4px_10px_rgba(255,255,255,0.02)]">
                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                            <div className="flex min-w-0 items-start gap-3.5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M12 9v4" />
                                        <path d="M12 17h.01" />
                                        <path d="M10.3 3.8 2.6 17a2 2 0 0 0 1.73 3h15.34a2 2 0 0 0 1.73-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">โซนอันตราย</h2>
                                    <p className="mt-1 text-xs leading-relaxed text-text-muted">การลบบัญชีจะลบข้อมูลทั้งหมดของคุณอย่างถาวร และไม่สามารถกู้คืนได้</p>
                                </div>
                            </div>

                            <div className="shrink-0">
                                <DeleteAccountButton action={deleteProfile} />
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-7 text-center">
                        <p className="text-xs text-text-muted/60">ต้องการความช่วยเหลือ? <a href="#" className="font-medium text-primary transition hover:underline">ติดต่อเรา</a></p>
                    </footer>
                </div>
            </main>
        </>
    )
}