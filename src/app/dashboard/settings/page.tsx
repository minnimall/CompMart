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

    return (
        <>
            <Navbar />
            
            <div className="min-h-screen bg-gradient-to-b from-bg to-bg/80 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Header Section */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            การตั้งค่า
                        </h1>
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-text-muted">จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ</p>
                    </div>

                    {/* Profile Card */}
                    <div className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-surface to-surface/95 p-5 sm:p-6 lg:p-8 shadow-[12px_12px_28px_rgba(20,80,143,0.15),-8px_-8px_24px_rgba(255,255,255,0.9)] border border-white/50">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border text-center sm:text-left">
                            <AvatarUpload
                                userId={user.id}
                                currentAvatarUrl={profile?.avatar_url}
                                fallbackChar={(profile?.username ?? user.email ?? '?').charAt(0).toUpperCase()}
                            />
                            
                            <div className="flex-1 min-w-0 w-full sm:w-auto">
                                <h2 className="text-xl sm:text-2xl font-bold text-text truncate">{profile?.username || 'ผู้ใช้งาน'}</h2>
                                <p className="text-sm sm:text-base text-text-muted truncate">{user.email}</p>
                                <p className="mt-1 sm:mt-2 text-xs text-text-muted/70">ID: {user.id.slice(0, 8)}...</p>
                            </div>
                        </div>

                        <ProfileForm profile={profile} />
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-2xl sm:rounded-3xl border-l-4 border-red-400 bg-gradient-to-br from-red-50/30 to-red-50/10 p-5 sm:p-6 lg:p-8 shadow-[12px_12px_28px_rgba(20,80,143,0.1),-8px_-8px_24px_rgba(255,255,255,0.6)]">
                        <div className="flex items-start gap-3 mb-4">
                            <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-base sm:text-lg font-semibold text-red-700">โซนอันตราย</h2>
                                <p className="mt-1 text-xs sm:text-sm text-red-600/80">
                                    ข้อมูลนี้ไม่สามารถยกเลิกได้ กรุณาทำอย่างระวัง
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-red-600/90 mb-4 pl-8 sm:pl-9">
                            เมื่อลบบัญชี ข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวร และไม่สามารถกู้คืนได้
                        </p>
                        
                        <div className="pl-8 sm:pl-9">
                            <DeleteAccountButton action={deleteProfile} />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-text-muted/60">
                        <p>สำหรับความช่วยเหลือเพิ่มเติม <a href="#" className="text-primary hover:underline">ติดต่อเรา</a></p>
                    </div>
                </div>
            </div>
        </>
    )
}