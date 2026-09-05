import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ReviewList } from '@/components/reviews/ReviewList'

export default async function SellerProfilePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { data: seller } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, created_at')
        .eq('id', id)
        .single()

    if (!seller) notFound()

    const { data: reviewsData } = await supabase
        .from('reviews')
        .select(
            'id, rating, comment, is_edited, seller_reply, created_at, reviewer:profiles!reviewer_id(username, avatar_url)'
        )
        .eq('seller_id', id)
        .order('created_at', { ascending: false })

    const reviews = (reviewsData ?? []).map((r: any) => ({
        ...r,
        reviewer: Array.isArray(r.reviewer) ? r.reviewer[0] : r.reviewer,
    }))

    const avgRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) /
                  reviews.length
              ).toFixed(1)
            : null

    const { data: activeProducts } = await supabase
        .from('products')
        .select(
            'id, title, price, product_images(image_url, is_primary, sort_order)'
        )
        .eq('seller_id', id)
        .eq('status', 'active')
        .eq('is_deleted', false)
        .limit(8)

    const isOwnProfile = user?.id === id

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-bg px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">

                    {/* ================= PROFILE HERO ================= */}
                    <section
                        className="
                            overflow-hidden rounded-[28px]
                            bg-surface
                            shadow-[8px_8px_18px_rgba(20,80,143,0.14),-8px_-8px_18px_rgba(255,255,255,0.85)]
                            dark:shadow-[8px_8px_20px_rgba(0,0,0,0.45),-5px_-5px_12px_rgba(255,255,255,0.025)]
                        "
                    >
                        {/* Decorative Header */}
                        <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent dark:from-primary/15" />

                        <div className="px-6 pb-6 sm:px-8">
                            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                                {/* Seller */}
                                <div className="flex items-end gap-4">
                                    <div
                                        className="
                                            h-24 w-24 shrink-0 overflow-hidden rounded-full
                                            border-4 border-surface
                                            bg-surface-2
                                            shadow-[5px_5px_12px_rgba(20,80,143,0.16)]
                                            dark:shadow-[5px_5px_14px_rgba(0,0,0,0.45)]
                                        "
                                    >
                                        {seller.avatar_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={seller.avatar_url}
                                                alt={seller.username}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-text-muted">
                                                {seller.username?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pb-1">
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl font-bold text-text">
                                                {seller.username}
                                            </h1>

                                            {isOwnProfile && (
                                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                                                    คุณ
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-text-muted">
                                            สมาชิกตั้งแต่{' '}
                                            {new Date(
                                                seller.created_at
                                            ).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div
                                    className="
                                        flex items-center gap-4 rounded-2xl
                                        bg-surface-2 px-5 py-3
                                        shadow-[inset_3px_3px_7px_rgba(20,80,143,0.08),inset_-3px_-3px_7px_rgba(255,255,255,0.7)]
                                        dark:shadow-[inset_3px_3px_7px_rgba(0,0,0,0.25),inset_-3px_-3px_7px_rgba(255,255,255,0.02)]
                                    "
                                >
                                    <div>
                                        <p className="text-xs text-text-muted">
                                            คะแนนผู้ขาย
                                        </p>

                                        <div className="mt-0.5 flex items-center gap-2">
                                            <span className="text-2xl font-bold text-text">
                                                {avgRating ?? '—'}
                                            </span>

                                            {avgRating && (
                                                <span className="text-lg text-amber-400">
                                                    ★
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-10 w-px bg-border" />

                                    <div>
                                        <p className="text-xs text-text-muted">
                                            รีวิวทั้งหมด
                                        </p>
                                        <p className="text-lg font-bold text-text">
                                            {reviews.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ================= PRODUCTS ================= */}
                    <section className="mt-10">
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <h2 className="mt-1 text-xl font-bold text-text">
                                    สินค้าที่กำลังขาย
                                </h2>
                            </div>

                            {activeProducts && activeProducts.length > 0 && (
                                <span className="text-xs text-text-muted">
                                    {activeProducts.length} รายการ
                                </span>
                            )}
                        </div>

                        {activeProducts && activeProducts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {activeProducts.map((p) => {
                                    const images = Array.isArray(
                                        p.product_images
                                    )
                                        ? p.product_images
                                        : []

                                    const sorted = [...images].sort(
                                        (a, b) =>
                                            a.sort_order - b.sort_order
                                    )

                                    const primary =
                                        sorted.find(
                                            (i) => i.is_primary
                                        ) ?? sorted[0]

                                    return (
                                        <a
                                            key={p.id}
                                            href={`/products/${p.id}`}
                                            className="
                                                group rounded-[22px]
                                                bg-surface p-3
                                        
                                                dark:shadow-[7px_7px_16px_rgba(0,0,0,0.45),-4px_-4px_10px_rgba(255,255,255,0.025)]
                                            "
                                        >
                                            <div className="relative mb-3 aspect-square overflow-hidden rounded-[17px] bg-surface-2">
                                                {primary ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={primary.image_url}
                                                        alt={p.title}
                                                        className="
                                                            h-full w-full object-cover
                                                            transition-transform duration-300
                                                            group-hover:scale-105
                                                        "
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-xs text-text-muted">
                                                        ไม่มีรูปภาพ
                                                    </div>
                                                )}
                                            </div>

                                            <p className="truncate text-sm font-medium text-text">
                                                {p.title}
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-primary">
                                                ฿
                                                {Number(
                                                    p.price
                                                ).toLocaleString()}
                                            </p>
                                        </a>
                                    )
                                })}
                            </div>
                        ) : (
                            <div
                                className="
                                    rounded-[24px] bg-surface p-10 text-center
                                    shadow-[inset_4px_4px_10px_rgba(20,80,143,0.07),inset_-4px_-4px_10px_rgba(255,255,255,0.7)]
                                    dark:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.25)]
                                "
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-2xl">
                                    📦
                                </div>

                                <p className="mt-4 text-sm font-medium text-text">
                                    ยังไม่มีสินค้าที่กำลังขาย
                                </p>

                                <p className="mt-1 text-xs text-text-muted">
                                    ผู้ขายยังไม่มีสินค้าที่เปิดขายในขณะนี้
                                </p>
                            </div>
                        )}
                    </section>

                    <section className="mt-10 pb-10">
                        <div className="mb-4">
                            <h2 className="mt-1 text-xl font-bold text-text">
                                รีวิวจากผู้ซื้อ
                            </h2>
                        </div>

                        <div
                            className="
                                rounded-[24px] bg-surface p-5 sm:p-6
                                shadow-[7px_7px_16px_rgba(20,80,143,0.12),-6px_-6px_16px_rgba(255,255,255,0.85)]
                                dark:shadow-[7px_7px_18px_rgba(0,0,0,0.45),-4px_-4px_10px_rgba(255,255,255,0.025)]
                            "
                        >
                            <ReviewList
                                reviews={reviews}
                                isOwnerViewing={isOwnProfile}
                            />
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}