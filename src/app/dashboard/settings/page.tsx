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
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[3px_3px_8px_rgba(20,80,143,0.10),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.35),-2px_-2px_5px_rgba(255,255,255,0.03)]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                                    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-2v-.48a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 10a1.7 1.7 0 0 0-.34-1.88L9 8.06l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.4 5.48V5h2v.48a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03H21v2h-.04A1.7 1.7 0 0 0 19.4 15Z" />
                                </svg>
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">การตั้งค่า</h1>
                                <p className="mt-1 text-sm text-text-muted">จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ</p>
                            </div>
                        </div>
                    </header>

                    {/* Profile + Account */}
                    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

                        {/* Profile */}
                        <section className="h-fit overflow-hidden rounded-[26px] bg-surface shadow-[8px_10px_24px_rgba(20,80,143,0.11),-6px_-6px_16px_rgba(255,255,255,0.85)] dark:shadow-[8px_10px_24px_rgba(0,0,0,0.42),-4px_-4px_12px_rgba(255,255,255,0.03)]">
                            <div className="border-b border-border/40 px-5 py-4">
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">Profile</p>
                                <p className="mt-1 text-xs text-text-muted">ข้อมูลโปรไฟล์ของคุณ</p>
                            </div>

                            <div className="px-5 py-7">
                                <div className="flex flex-col items-center text-center">
                                    <AvatarUpload userId={user.id} currentAvatarUrl={profile?.avatar_url} fallbackChar={fallbackChar} />

                                    <h2 className="mt-5 max-w-full truncate text-lg font-bold text-text">{username}</h2>
                                    <p className="mt-1 max-w-full truncate text-xs text-text-muted">{email}</p>

                                    <div className="mt-5 w-full rounded-2xl bg-surface-2 px-4 py-3 text-left shadow-[inset_3px_3px_8px_rgba(20,80,143,0.08),inset_-3px_-3px_8px_rgba(255,255,255,0.75)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.02)]">
                                        <p className="text-[9px] font-semibold uppercase tracking-wider text-text-muted">Account ID</p>
                                        <p className="mt-1 truncate font-mono text-[11px] text-text-muted">{user.id}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Account */}
                        <section className="overflow-hidden rounded-[26px] bg-surface shadow-[8px_10px_24px_rgba(20,80,143,0.11),-6px_-6px_16px_rgba(255,255,255,0.85)] dark:shadow-[8px_10px_24px_rgba(0,0,0,0.42),-4px_-4px_12px_rgba(255,255,255,0.03)]">
                            <div className="border-b border-border/40 px-5 py-4 sm:px-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">Account Information</p>
                                        <p className="mt-1 text-xs text-text-muted">แก้ไขข้อมูลส่วนตัวของคุณ</p>
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

                    {/* Security */}
                    <section className="mt-6 overflow-hidden rounded-[26px] bg-surface shadow-[8px_10px_24px_rgba(20,80,143,0.10),-6px_-6px_16px_rgba(255,255,255,0.82)] dark:shadow-[8px_10px_24px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)]">
                        <div className="border-b border-border/40 px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                        <path d="M12 14v3" />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">Security</p>
                                    <p className="mt-1 text-xs text-text-muted">จัดการความปลอดภัยของบัญชี</p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-border/30">
                            {/* Email */}
                            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-text-muted">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <rect x="3" y="5" width="18" height="14" rx="2" />
                                            <path d="m3 7 9 6 9-6" />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-text">อีเมล</p>
                                        <p className="mt-0.5 truncate text-xs text-text-muted">{email}</p>
                                    </div>
                                </div>

                                <div className="flex w-fit items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-medium text-green-600 dark:text-green-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    บัญชีใช้งานอยู่
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-text-muted">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <rect x="4" y="10" width="16" height="11" rx="2" />
                                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                        </svg>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-text">รหัสผ่าน</p>
                                        <p className="mt-0.5 text-xs text-text-muted">••••••••••••</p>
                                    </div>
                                </div>

                                <button type="button" className="w-fit rounded-xl bg-surface-2 px-3.5 py-2 text-xs font-medium text-text-muted shadow-[3px_3px_8px_rgba(20,80,143,0.10),-2px_-2px_6px_rgba(255,255,255,0.75)] transition hover:text-primary active:translate-y-[1px] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.35),-2px_-2px_5px_rgba(255,255,255,0.02)]">เปลี่ยนรหัสผ่าน</button>
                            </div>

                            {/* Account ID */}
                            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-text-muted">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M4 7h16" />
                                            <path d="M4 12h16" />
                                            <path d="M4 17h16" />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-text">รหัสบัญชี</p>
                                        <p className="mt-0.5 truncate font-mono text-xs text-text-muted">{user.id}</p>
                                    </div>
                                </div>

                                <span className="text-[10px] text-text-muted">ใช้สำหรับระบุบัญชีของคุณ</span>
                            </div>
                        </div>
                    </section>

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