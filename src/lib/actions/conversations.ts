'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getOrCreateConversation(productId: string, sellerId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    if (user.id === sellerId) throw new Error('ไม่สามารถแชทกับตัวเองได้')

    const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('product_id', productId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .maybeSingle()

    if (existing) return existing.id

    const { data: created, error } = await supabase
        .from('conversations')
        .insert({ product_id: productId, buyer_id: user.id, seller_id: sellerId })
        .select('id')
        .single()

    if (error || !created) throw new Error('เริ่มการสนทนาไม่สำเร็จ')
    return created.id
}

export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    if (!content.trim()) return

    const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
    })

    if (error) throw new Error('ส่งข้อความไม่สำเร็จ')

    revalidatePath('/dashboard/messages')
}

export async function markConversationRead(conversationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)
}