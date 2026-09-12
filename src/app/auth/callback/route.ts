import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const next = searchParams.get('next') ?? '/'

    // ถ้ามี error จาก Supabase
    if (error) {
        console.error('Auth callback error:', error, errorDescription)
        return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent(
                errorDescription || 'Authentication failed'
            )}`
        )
    }

    // ถ้ามี code ให้ exchange
    if (code) {
        const supabase = await createClient()
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
            console.error('Code exchange error:', exchangeError.message)
            return NextResponse.redirect(
                `${origin}/login?error=${encodeURIComponent('Invalid or expired link')}`
            )
        }

        return NextResponse.redirect(`${origin}${next}`)
    }

    return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('เข้าสู่ระบบไม่สำเร็จ')}`
    )
}