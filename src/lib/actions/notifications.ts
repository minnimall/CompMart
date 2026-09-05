'use server'

import { createClient } from '@/lib/supabase/server'

export async function getUnreadMessageCount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .neq('sender_id', user.id)
        .eq('is_read', false)

    return count ?? 0
}