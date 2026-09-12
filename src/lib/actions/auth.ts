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

export async function signInWithGoogle() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    })

    if (error || !data.url) {
        redirect('/login?error=' + encodeURIComponent('เข้าสู่ระบบด้วย Google ไม่สำเร็จ'))
    }

    redirect(data.url)
}

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get('email') as string
    if (!email?.trim()) {
        redirect('/forgot-password?error=' + encodeURIComponent('กรุณากรอกอีเมล'))
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    redirect('/forgot-password?message=' + encodeURIComponent('หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว'))
}

export async function updatePassword(formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
        redirect('/reset-password?error=' + encodeURIComponent('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'))
    }
    if (password !== confirmPassword) {
        redirect('/reset-password?error=' + encodeURIComponent('รหัสผ่านไม่ตรงกัน'))
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login?error=' + encodeURIComponent('ลิงก์หมดอายุ กรุณาขอลิงก์ใหม่'))
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
        redirect('/reset-password?error=' + encodeURIComponent('เปลี่ยนรหัสผ่านไม่สำเร็จ ลองใหม่อีกครั้ง'))
    }

    redirect('/login?message=' + encodeURIComponent('ตั้งรหัสผ่านใหม่สำเร็จ เข้าสู่ระบบได้เลย'))
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}