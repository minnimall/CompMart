import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { MyProductCard } from '@/components/products/MyProductCard'
import { ProductsPageToast } from '@/components/products/ProductsPageToast'

export default async function MyProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string }>
}) {
    const params = await searchParams
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: products } = await supabase
        .from('products')
        .select('id, title, price, stock, status, product_images(image_url)')
        .eq('seller_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-bg px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-2xl font-semibold text-text">สินค้าของฉัน</h1>
                <p className="mt-1 text-sm text-text-muted">จัดการสินค้าที่คุณลงขาย</p>
                </div>
                <a
                href="/products/new"
                className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-[4px_4px_10px_rgba(20,80,143,0.3),-3px_-3px_8px_rgba(255,255,255,0.5)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(255,255,255,0.03)] transition hover:bg-primary-dark"
                >
                + ลงขายสินค้า
                </a>
            </div>

            <ProductsPageToast message={params.message} />

            {products && products.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {products.map((p) => (
                    <MyProductCard key={p.id} product={p} />
                ))}
                </div>
            ) : (
                <div className="mt-6 rounded-2xl bg-surface p-10 text-center shadow-[inset_3px_3px_10px_rgba(20,80,143,0.1),inset_-3px_-3px_10px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_10px_rgba(0,0,0,0.4),inset_-2px_-2px_8px_rgba(255,255,255,0.02)]">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-text-muted shadow-[inset_3px_3px_8px_rgba(20,80,143,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.02)]">
                        <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <p className="text-text-muted">คุณยังไม่เคยลงขายสินค้าเลย</p>
                    <a href="/products/new" className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary-dark">
                        เริ่มลงขายสินค้าชิ้นแรก →
                    </a>
                </div>
            )}
            </div>
        </div>
        </>
    )
}