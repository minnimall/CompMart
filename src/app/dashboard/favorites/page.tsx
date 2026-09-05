import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'

export default async function FavoritesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: favorites } = await supabase
        .from('favorites')
        .select('id, created_at, products(id, title, price, status, is_deleted, product_images(image_url, is_primary, sort_order))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const items = (favorites ?? []).filter((f: any) => {
        const p = Array.isArray(f.products) ? f.products[0] : f.products
        return p && !p.is_deleted
    })

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-bg px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-semibold text-text">รายการโปรดของฉัน</h1>
            <p className="mt-1 text-sm text-text-muted">สินค้าที่คุณกดถูกใจไว้</p>

            {items.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {items.map((f: any) => {
                    const p = Array.isArray(f.products) ? f.products[0] : f.products
                    const images = Array.isArray(p.product_images) ? p.product_images : []
                    const sorted = [...images].sort((a: any, b: any) => a.sort_order - b.sort_order)
                    const primary = sorted.find((i: any) => i.is_primary) ?? sorted[0]
                    return (
                    <a
                        key={f.id}
                        href={`/products/${p.id}`}
                        className="block rounded-2xl bg-surface p-4 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]"
                    >
                        <div className="mb-3 h-28 overflow-hidden rounded-xl bg-surface-2">
                        {primary && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={primary.image_url} alt={p.title} className="h-full w-full object-cover" />
                        )}
                        </div>
                        <p className="truncate text-sm font-medium text-text">{p.title}</p>
                        <p className="mt-0.5 text-sm font-semibold text-primary">฿{Number(p.price).toLocaleString()}</p>
                        {p.status !== 'active' && (
                        <span className="mt-1 inline-block rounded-full bg-red-50 px-2 py-0.5 text-[11px] text-red-500 dark:bg-red-500/10">
                            ปิดการขายแล้ว
                        </span>
                        )}
                    </a>
                    )
                })}
                </div>
            ) : (
                <div className="mt-6 rounded-2xl bg-surface p-10 text-center shadow-[inset_3px_3px_10px_rgba(20,80,143,0.1),inset_-3px_-3px_10px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_10px_rgba(0,0,0,0.4)]">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-text-muted shadow-[inset_3px_3px_8px_rgba(20,80,143,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.02)]">
                        <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                        </svg>
                    </div>
                    <p className="text-sm text-text-muted">ยังไม่มีสินค้าที่ถูกใจ</p>
                </div>
            )}
            </div>
        </div>
        </>
    )
}