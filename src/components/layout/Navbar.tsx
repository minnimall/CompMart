import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './UserMenu'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SearchBar } from './SearchBar'
import { MobileSearchToggle } from './MobileSearchToggle'
import { NotificationBell } from './NotificationBell'
import { getUnreadMessageCount } from '@/lib/actions/notifications'

export async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let username = ''
    let avatarUrl: string | null = null
    let unreadCount = 0

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single()
        username = profile?.username ?? user.email?.split('@')[0] ?? 'สมาชิก'
        avatarUrl = profile?.avatar_url ?? null
        unreadCount = await getUnreadMessageCount()
    }

    return (
        <nav className="sticky top-0 z-20 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur sm:px-8">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between">
            <a href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="CompMart" className="h-12 w-auto" />
            </a>

            <div className="hidden flex-1 justify-center px-8 sm:flex">
            <SearchBar />
            </div>

            <div className="flex items-center gap-3">
                {user && <NotificationBell userId={user.id} initialCount={unreadCount} />}
                <ThemeToggle />
                {user ? <UserMenu username={username} avatarUrl={avatarUrl} /> : (
                    <div className="flex items-center gap-2">
                        <a href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-text transition hover:text-primary">เข้าสู่ระบบ</a>
                        <a href="/register" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark">สมัครสมาชิก</a>
                    </div>
                )}
            </div>
        </div>
        </nav>
    )
}