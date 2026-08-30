'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
        data: { username },
        },
    })

    if (error) {
        redirect(`/register?error=${encodeURIComponent(error.message)}`)
    }

    redirect('/login?message=สมัครสำเร็จ กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ')
}

export async function signIn(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // เช็คว่าบัญชีถูก soft-delete ไปหรือยัง
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_deleted')
        .eq('id', data.user.id)
        .single()

    if (profile?.is_deleted) {
        await supabase.auth.signOut()
        redirect('/login?error=account_deleted')
    }

    redirect('/')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}