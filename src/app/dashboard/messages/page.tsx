import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'

export default async function MessagesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: conversations } = await supabase
        .from('conversations')
        .select(`
        id, product_id, buyer_id, seller_id, created_at,
        products(title),
        buyer:profiles!buyer_id(username, avatar_url),
        seller:profiles!seller_id(username, avatar_url)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

    const rows = await Promise.all(
        (conversations ?? []).map(async (c: any) => {
        const [{ data: lastMessage }, { count: unreadCount }] = await Promise.all([
            supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', c.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
            supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', c.id)
            .neq('sender_id', user.id)
            .eq('is_read', false),
        ])
        return { ...c, lastMessage, unreadCount: unreadCount ?? 0 }
        })
    )

    rows.sort((a, b) => {
        const timeA = a.lastMessage?.created_at ?? a.created_at
        const timeB = b.lastMessage?.created_at ?? b.created_at
        return new Date(timeB).getTime() - new Date(timeA).getTime()
    })

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-bg px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-semibold text-text">ข้อความ</h1>
            <p className="mt-1 text-sm text-text-muted">ประวัติการสนทนากับผู้ซื้อ/ผู้ขาย</p>

            <div className="mt-6 space-y-2">
                {rows.length > 0 ? (
                rows.map((c) => {
                    const product = Array.isArray(c.products) ? c.products[0] : c.products
                    const isBuyer = c.buyer_id === user.id
                    const otherParty = isBuyer
                    ? (Array.isArray(c.seller) ? c.seller[0] : c.seller)
                    : (Array.isArray(c.buyer) ? c.buyer[0] : c.buyer)

                    return (
                    <a
                        key={c.id}
                        href={`/dashboard/messages/${c.id}`}
                        className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]"
                    >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-2">
                        {otherParty?.avatar_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={otherParty.avatar_url} alt="" className="h-full w-full object-cover" />
                        )}
                        </div>
                        <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium text-text">{otherParty?.username}</p>
                            {c.unreadCount > 0 && (
                            <span className="ml-2 shrink-0 rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-white">
                                {c.unreadCount}
                            </span>
                            )}
                        </div>
                        <p className="truncate text-xs text-primary">{product?.title}</p>
                        <p className="truncate text-xs text-text-muted">
                            {c.lastMessage?.content ?? 'เริ่มการสนทนา'}
                        </p>
                        </div>
                    </a>
                    )
                })
                ) : (
                <p className="rounded-2xl bg-surface p-10 text-center text-sm text-text-muted shadow-[inset_3px_3px_10px_rgba(20,80,143,0.1),inset_-3px_-3px_10px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_10px_rgba(0,0,0,0.4)]">
                    ยังไม่มีข้อความ
                </p>
                )}
            </div>
            </div>
        </div>
        </>
    )
}