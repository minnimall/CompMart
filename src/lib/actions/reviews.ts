'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createReview(orderId: string, rating: number, comment: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    if (rating < 1 || rating > 5) throw new Error('คะแนนต้องอยู่ระหว่าง 1-5')

    const { data: order } = await supabase
        .from('orders')
        .select('id, buyer_id, seller_id, status')
        .eq('id', orderId)
        .single()

    if (!order || order.buyer_id !== user.id || order.status !== 'completed') {
        throw new Error('ไม่สามารถรีวิวออเดอร์นี้ได้')
    }

    const { error } = await supabase.from('reviews').insert({
        order_id: orderId,
        reviewer_id: user.id,
        seller_id: order.seller_id,
        rating,
        comment: comment.trim() || null,
    })

    if (error) {
        if (error.code === '23505') throw new Error('คุณรีวิวออเดอร์นี้ไปแล้ว')
        throw new Error('ส่งรีวิวไม่สำเร็จ')
    }

    revalidatePath('/dashboard/orders')
    revalidatePath(`/sellers/${order.seller_id}`)
}

export async function updateReview(reviewId: string, rating: number, comment: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    if (rating < 1 || rating > 5) throw new Error('คะแนนต้องอยู่ระหว่าง 1-5')

    const { data: review } = await supabase
        .from('reviews')
        .select('id, reviewer_id, is_edited, seller_id')
        .eq('id', reviewId)
        .single()

    if (!review || review.reviewer_id !== user.id) {
        throw new Error('ไม่มีสิทธิ์แก้ไขรีวิวนี้')
    }
    if (review.is_edited) {
        throw new Error('แก้ไขรีวิวได้เพียง 1 ครั้งเท่านั้น')
    }

    const { error } = await supabase
        .from('reviews')
        .update({
            rating,
            comment: comment.trim() || null,
            is_edited: true,
        })
        .eq('id', reviewId)
        .eq('reviewer_id', user.id)

    if (error) throw new Error('แก้ไขรีวิวไม่สำเร็จ')

    revalidatePath('/dashboard/orders')
    revalidatePath(`/sellers/${review.seller_id}`)
}

export async function replyToReview(reviewId: string, replyText: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    if (!replyText.trim()) throw new Error('กรุณากรอกข้อความตอบกลับ')

    const { data: review } = await supabase
        .from('reviews')
        .select('id, seller_id, seller_reply')
        .eq('id', reviewId)
        .single()

    if (!review || review.seller_id !== user.id) {
        throw new Error('ไม่มีสิทธิ์ตอบกลับรีวิวนี้')
    }
    if (review.seller_reply) {
        throw new Error('ตอบกลับรีวิวนี้ไปแล้ว')
    }

    const { error } = await supabase
        .from('reviews')
        .update({
            seller_reply: replyText.trim(),
            seller_replied_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .eq('seller_id', user.id)

    if (error) throw new Error('ตอบกลับไม่สำเร็จ')

    revalidatePath(`/sellers/${review.seller_id}`)
    revalidatePath('/products')
}