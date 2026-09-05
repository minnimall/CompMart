import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { MessageThread } from '@/components/messages/MessageThread'

interface Message {
    id: string
    sender_id: string
    content: string
    image_url?: string | null
    created_at: string
    sender?: {
        username: string
        avatar_url: string | null
    } | null
}

export default async function ConversationPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: conversation } = await supabase
        .from('conversations')
        .select(`
        id, buyer_id, seller_id,
        products(id, title),
        buyer:profiles!buyer_id(username, avatar_url),
        seller:profiles!seller_id(username, avatar_url)
        `)
        .eq('id', id)
        .single()

    if (!conversation) notFound()
    if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) {
        redirect('/dashboard/messages')
    }

    const { data: messagesData } = await supabase
        .from('messages')
        .select(`
        id, 
        sender_id, 
        content, 
        image_url,
        created_at,
        sender:profiles!sender_id(username, avatar_url)
        `)
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })

    const messages: Message[] = (messagesData ?? []).map((msg: any) => ({
        ...msg,
        sender: Array.isArray(msg.sender) ? msg.sender[0] : msg.sender,
    }))

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()

    const product = Array.isArray(conversation.products) ? conversation.products[0] : conversation.products
    const isBuyer = conversation.buyer_id === user.id
    const otherParty = isBuyer
        ? (Array.isArray(conversation.seller) ? conversation.seller[0] : conversation.seller)
        : (Array.isArray(conversation.buyer) ? conversation.buyer[0] : conversation.buyer)

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-bg px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <a
                    href="/dashboard/messages"
                    className="inline-flex items-center gap-1.5 text-sm text-text-muted transition hover:text-primary"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    ข้อความทั้งหมด
                </a>

                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface-2">
                        {otherParty?.avatar_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={otherParty.avatar_url} alt={otherParty.username} className="h-full w-full object-cover" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text">{otherParty?.username}</p>
                        <p className="text-xs text-text-muted">{isBuyer ? 'ผู้ขาย' : 'ผู้ซื้อ'}</p>
                    </div>
                    {product && (
                        <a
                            href={`/products/${product.id}`}
                            className="shrink-0 rounded-xl bg-surface-2 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10"
                        >
                            ดูสินค้า
                        </a>
                    )}
                </div>

                {product?.title && (
                    <p className="mt-2 truncate px-1 text-xs text-text-muted">
                        เกี่ยวกับสินค้า: <span className="text-primary">{product.title}</span>
                    </p>
                )}

                <div className="mt-4">
                    <MessageThread
                        conversationId={id}
                        currentUserId={user.id}
                        initialMessages={messages}
                        currentUserAvatar={currentUserProfile?.avatar_url}
                    />
                </div>
            </div>
        </div>
        </>
    )
}