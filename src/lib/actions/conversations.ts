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

    if (error || !created) {
        console.error('Error creating conversation:', error)
        throw new Error('เริ่มการสนทนาไม่สำเร็จ')
    }
    return created.id
}

export async function sendMessage(conversationId: string, content: string, imageUrl?: string | null) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    if (!content.trim() && !imageUrl) throw new Error('ข้อความว่างเปล่า')

    const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .single()

    if (convError || !conversation) {
        throw new Error('ไม่พบการสนทนา')
    }

    const { data: inserted, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim() || null,
            image_url: imageUrl || null,
        })
        .select('id, sender_id, content, image_url, created_at')
        .single()

    if (error || !inserted) {
        console.error('Error sending message:', error)
        throw new Error('ส่งข้อความไม่สำเร็จ')
    }

    revalidatePath(`/dashboard/messages/${conversationId}`)
    revalidatePath('/dashboard/messages')
    return inserted
}

export async function markConversationRead(conversationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)

    if (!error) {
        revalidatePath('/dashboard/messages')
    }
}

export async function deleteMessage(messageId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: deleted, error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user.id)
        .select('id')
        .maybeSingle()

    if (error || !deleted) {
        console.error('Error deleting message:', error)
        throw new Error('ลบข้อความไม่สำเร็จ หรือไม่มีสิทธิ์ลบข้อความนี้')
    }

    revalidatePath('/dashboard/messages')
}