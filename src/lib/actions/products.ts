'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const brand = formData.get('brand') as string
    const condition = formData.get('condition') as string
    const price = Number(formData.get('price'))
    const stock = Number(formData.get('stock'))
    const category_id = formData.get('category_id') as string
    const imagesRaw = formData.get('images') as string
    const images: string[] = imagesRaw ? JSON.parse(imagesRaw) : []

    const { data: product, error } = await supabase
        .from('products')
        .insert({
        seller_id: user.id,
        category_id: category_id || null,
        title,
        description,
        brand,
        condition,
        price,
        stock,
        status: 'active',
        })
        .select('id')
        .single()

    if (error || !product) {
        redirect(`/products/new?error=${encodeURIComponent(error?.message ?? 'เกิดข้อผิดพลาด')}`)
    }

    if (images.length > 0) {
        await supabase.from('product_images').insert(
        images.map((url, i) => ({
            product_id: product.id,
            image_url: url,
            is_primary: i === 0,
            sort_order: i,
        }))
        )
    }

    revalidatePath('/')
    revalidatePath('/dashboard/my-products')
    redirect(`/dashboard/my-products?message=${encodeURIComponent('ลงขายสินค้าสำเร็จ')}`)
}

export async function updateProduct(productId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const brand = formData.get('brand') as string
    const condition = formData.get('condition') as string
    const price = Number(formData.get('price'))
    const stock = Number(formData.get('stock'))
    const category_id = formData.get('category_id') as string
    const imagesRaw = formData.get('images') as string
    const images: string[] = imagesRaw ? JSON.parse(imagesRaw) : []

    const { error } = await supabase
        .from('products')
        .update({
            category_id: category_id || null,
            title,
            description,
            brand,
            condition,
            price,
            stock,
        })
        .eq('id', productId)
        .eq('seller_id', user.id)

    if (error) {
        redirect(`/products/${productId}/edit?error=${encodeURIComponent(error.message)}`)
    }

    // แทนที่รูปเดิมทั้งหมดด้วยชุดใหม่ (ง่ายและชัวร์กว่าไล่ diff ทีละรูป)
    await supabase.from('product_images').delete().eq('product_id', productId)
    if (images.length > 0) {
        await supabase.from('product_images').insert(
            images.map((url, i) => ({
                product_id: productId,
                image_url: url,
                is_primary: i === 0,
                sort_order: i,
            }))
        )
    }

    revalidatePath('/')
    revalidatePath('/dashboard/my-products')
    revalidatePath(`/products/${productId}`)
    redirect(`/dashboard/my-products?message=${encodeURIComponent('แก้ไขสินค้าสำเร็จ')}`)
}

export async function deleteProduct(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { error } = await supabase
        .from('products')
        .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            status: 'inactive',
        })
        .eq('id', productId)
        .eq('seller_id', user.id)

    if (error) {
        console.error('deleteProduct error:', error.message)
        throw new Error('ลบสินค้าไม่สำเร็จ')
    }

    revalidatePath('/')
    revalidatePath('/dashboard/my-products')
}

export async function toggleProductStatus(productId: string, currentStatus: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId)
        .eq('seller_id', user.id)

    revalidatePath('/')
    revalidatePath('/dashboard/my-products')
}