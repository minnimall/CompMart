import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { MessageThread } from '@/components/messages/MessageThread'

interface Message {
    id: string
    sender_id: string
    content: string
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
        products(title),
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
                <div className="mx-auto max-w-2xl">
                    <a href="/dashboard/messages" className="text-sm text-text-muted hover:text-primary">
                        ← ข้อความทั้งหมด
                    </a>
                    <h1 className="mt-2 text-xl font-semibold text-text">{otherParty?.username}</h1>
                    <p className="text-sm text-primary">{product?.title}</p>

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