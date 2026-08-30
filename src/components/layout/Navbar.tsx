import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './UserMenu'
import { ThemeToggle } from '@/components/ThemeToggle'

export async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let username = ''
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
        username = profile?.username ?? user.email?.split('@')[0] ?? 'สมาชิก'
    }

    return (
        <nav className="sticky top-0 z-20 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
            <a href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="CompMart" className="h-12 w-auto" />
            </a>

            <div className="hidden flex-1 justify-center px-8 sm:flex">
            <div className="w-full max-w-md rounded-2xl bg-surface-2 px-4 py-2.5 text-sm text-text-muted shadow-[inset_3px_3px_8px_rgba(20,80,143,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.8)]">
                ค้นหาอุปกรณ์คอม, เกมมิ่งเกียร์...
            </div>
            </div>
            
            <div className="flex items-center gap-3">
                <ThemeToggle />
                {user ? <UserMenu username={username} /> : (
                    <div className="flex items-center gap-2">
                        <a href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-text transition hover:text-primary">เข้าสู่ระบบ</a>
                        <a href="/register" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-[4px_4px_10px_rgba(20,80,143,0.3),-3px_-3px_8px_rgba(255,255,255,0.5)] transition hover:bg-primary-dark">สมัครสมาชิก</a>
                    </div>
                )}
            </div>
        </div>
        </nav>
    )
}