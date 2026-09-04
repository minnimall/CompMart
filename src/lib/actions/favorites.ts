'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(productId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

    if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id)
        revalidatePath('/dashboard/favorites')
        return false
    }

    await supabase.from('favorites').insert({ user_id: user.id, product_id: productId })
    revalidatePath('/dashboard/favorites')
    return true
}