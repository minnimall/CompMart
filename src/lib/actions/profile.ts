'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'ไม่พบผู้ใช้' }
    }

    const username = formData.get('username')?.toString() ?? ''
    const full_name = formData.get('full_name')?.toString() ?? ''
    const phone = (formData.get('phone') as string).replace(/\D/g, '')
    const address = formData.get('address')?.toString() ?? ''

    if (!username.trim()) {
        return { success: false, error: 'ชื่อผู้ใช้จำเป็นต้องกรอก' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            username: username.trim(),
            full_name: full_name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true, message: 'บันทึกการเปลี่ยนแปลงสำเร็จ' }
}

export async function updateAvatarUrl(avatarUrl: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'ไม่พบผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id)

    if (error) {
        return { success: false, error: 'อัปเดตรูปโปรไฟล์ไม่สำเร็จ' }
    }

    revalidatePath('/dashboard/settings')
    return { success: true, message: 'อัปเดตรูปโปรไฟล์สำเร็จ' }
}

export async function deleteProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'ไม่พบผู้ใช้' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        return { success: false, error: error.message }
    }

    await supabase.auth.signOut()
    return { success: true, message: 'บัญชีของคุณถูกปิดใช้งานแล้ว' }
}