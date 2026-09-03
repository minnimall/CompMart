import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ProductGallery } from '@/components/products/ProductGallery'
import { ProductDetailActions } from '@/components/products/ProductDetailActions'

const conditionLabel: Record<string, string> = {
    new: 'ใหม่',
    like_new: 'สภาพดีมาก',
    used_good: 'มือสอง สภาพดี',
    used_fair: 'มือสอง ใช้งานได้',
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: product } = await supabase
        .from('products')
        .select(`
        id, title, description, brand, condition, price, stock, status, seller_id,
        categories(name, slug),
        product_images(image_url, is_primary, sort_order),
        profiles!seller_id(username, avatar_url)
        `)
        .eq('id', id)
        .eq('is_deleted', false)
        .single()

    if (!product) notFound()

    const category = Array.isArray(product.categories) ? product.categories[0] : product.categories
    const seller = Array.isArray(product.profiles) ? product.profiles[0] : product.profiles
    const images = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
    const isOwner = user?.id === product.seller_id

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-bg px-4 py-10 sm:px-8">
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            <ProductGallery images={images} title={product.title} />

            <div className="rounded-2xl bg-surface p-6 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]">
                {category && (
                    <span className="text-xs font-medium text-primary">{category.name}</span>
                )}

                <p className="mt-3 text-xs font-medium text-text-muted">ชื่อสินค้า</p>
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h1 className="text-xl font-semibold text-text">{product.title}</h1>
                    <p className="text-2xl font-bold text-primary">
                    ฿{Number(product.price).toLocaleString()}
                    </p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    {product.condition && (
                    <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-text-muted">
                        {conditionLabel[product.condition] ?? product.condition}
                    </span>
                    )}
                    {product.status !== 'active' && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500 dark:bg-red-500/10">
                        ปิดการขายอยู่
                    </span>
                    )}
                </div>

                <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                    <div className="flex items-center justify-between">
                    <span className="text-text-muted">แบรนด์</span>
                    <span className="text-text">{product.brand || 'ไม่ระบุ'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                    <span className="text-text-muted">คงเหลือ</span>
                    <span className="text-text">{product.stock} ชิ้น</span>
                    </div>
                </div>

                {product.description && (
                    <div className="mt-5 border-t border-border pt-5">
                    <h2 className="text-sm font-medium text-text">รายละเอียดสินค้า</h2>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-muted">
                        {product.description}
                    </p>
                    </div>
                )}

                {seller && (
                    <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-2">
                        {seller.avatar_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={seller.avatar_url} alt={seller.username} className="h-full w-full object-cover" />
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-text-muted">ผู้ขาย</p>
                        <p className="text-sm font-medium text-text">{seller.username}</p>
                    </div>
                    </div>
                )}

                <div className="mt-5 border-t border-border pt-5">
                    <ProductDetailActions
                    productId={product.id}
                    productTitle={product.title}
                    productStatus={product.status}
                    isOwner={isOwner}
                    isLoggedIn={!!user}
                    />
                </div>
                </div>
            </div>
        </div>
        </>
    )
}