'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createOrder(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const productId = formData.get('product_id') as string
    const quantity = Number(formData.get('quantity'))
    const shippingAddress = formData.get('shipping_address') as string

    const { data: product } = await supabase
        .from('products')
        .select('id, price, stock, seller_id, status, is_deleted')
        .eq('id', productId)
        .single()

    if (!product || product.is_deleted || product.status !== 'active') {
        return { error: 'สินค้านี้ไม่พร้อมขายแล้ว' }
    }
    if (product.seller_id === user.id) {
        return { error: 'ไม่สามารถสั่งซื้อสินค้าของตัวเองได้' }
    }
    if (quantity < 1 || quantity > product.stock) {
        return { error: `จำนวนสินค้าไม่ถูกต้อง (คงเหลือ ${product.stock} ชิ้น)` }
    }
    if (!shippingAddress?.trim()) {
        return { error: 'กรุณากรอกที่อยู่จัดส่ง' }
    }

    const { error } = await supabase.from('orders').insert({
        buyer_id: user.id,
        seller_id: product.seller_id,
        product_id: product.id,
        quantity,
        total_price: Number(product.price) * quantity,
        shipping_address: shippingAddress,
        status: 'pending',
    })

    if (error) {
        return { error: 'สั่งซื้อไม่สำเร็จ ลองใหม่อีกครั้ง' }
    }

    revalidatePath('/dashboard/orders')
    return { success: true }
}

export async function confirmOrder(orderId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: order } = await supabase
        .from('orders')
        .select('id, product_id, quantity, seller_id, status')
        .eq('id', orderId)
        .single()

    if (!order || order.seller_id !== user.id || order.status !== 'pending') {
        throw new Error('ไม่สามารถยืนยันออเดอร์นี้ได้')
    }

    const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', order.product_id)
        .single()

    if (!product || product.stock < order.quantity) {
        throw new Error('สินค้าคงเหลือไม่พอ')
    }

    await supabase
        .from('products')
        .update({ stock: product.stock - order.quantity })
        .eq('id', order.product_id)

    await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId)
        .eq('seller_id', user.id)

    revalidatePath('/dashboard/orders')
    revalidatePath('/')
}

export async function completeOrder(orderId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId)
        .eq('seller_id', user.id)
        .eq('status', 'confirmed')

    revalidatePath('/dashboard/orders')
}

export async function cancelOrder(orderId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: order } = await supabase
        .from('orders')
        .select('id, product_id, quantity, buyer_id, seller_id, status')
        .eq('id', orderId)
        .single()

    if (!order) throw new Error('ไม่พบออเดอร์')

    const isBuyer = order.buyer_id === user.id
    const isSeller = order.seller_id === user.id
    if (!isBuyer && !isSeller) throw new Error('ไม่มีสิทธิ์ยกเลิกออเดอร์นี้')
    if (order.status !== 'pending' && order.status !== 'confirmed') {
        throw new Error('ไม่สามารถยกเลิกออเดอร์นี้ได้')
    }

    if (order.status === 'confirmed') {
        const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', order.product_id)
            .single()
        if (product) {
            await supabase
                .from('products')
                .update({ stock: product.stock + order.quantity })
                .eq('id', order.product_id)
        }
    }

    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId)

    revalidatePath('/dashboard/orders')
    revalidatePath('/')
}