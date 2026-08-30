import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            getAll() {
            return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
            )
            },
        },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // ถ้ายังไม่ล็อกอิน แล้วพยายามเข้า /dashboard ให้เด้งไป /login
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // ถ้าล็อกอินอยู่ ให้เช็คว่าบัญชีถูก soft-delete ไปหรือยัง
    if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_deleted')
            .eq('id', user.id)
            .single()

        if (profile?.is_deleted) {
            await supabase.auth.signOut()
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('error', 'account_deleted')
            return NextResponse.redirect(redirectUrl)
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}