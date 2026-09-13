import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { OrderRowActions } from '@/components/orders/OrderRowActions'

const statusLabel: Record<string, { text: string; className: string }> = {
    pending: { text: 'รอผู้ขายยืนยัน', className: 'text-amber-500 dark:text-amber-300' },
    confirmed: { text: 'กำลังดำเนินการ', className: 'text-primary' },
    completed: { text: 'สำเร็จ', className: 'text-green-500 dark:text-green-300' },
    cancelled: { text: 'ยกเลิก', className: 'text-red-500 dark:text-red-300' },
}

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const orderSelect = `
        id, quantity, total_price, status, shipping_address, created_at,
        products(id, title, product_images(image_url, is_primary, sort_order)),
        buyer:profiles!buyer_id(username),
        seller:profiles!seller_id(username),
        reviews(id, rating, comment, is_edited)
    `

    const [{ data: purchases }, { data: sales }] = await Promise.all([
        supabase.from('orders').select(orderSelect).eq('buyer_id', user.id).order('created_at', { ascending: false }),
        supabase.from('orders').select(orderSelect).eq('seller_id', user.id).order('created_at', { ascending: false }),
    ])

    const purchaseCount = purchases?.length ?? 0
    const salesCount = sales?.length ?? 0
    const totalCount = purchaseCount + salesCount

    const formatOrderDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    const renderOrder = (order: any, role: 'buyer' | 'seller') => {
        const product = Array.isArray(order.products) ? order.products[0] : order.products

        const otherParty = role === 'buyer'
            ? (Array.isArray(order.seller) ? order.seller[0] : order.seller)
            : (Array.isArray(order.buyer) ? order.buyer[0] : order.buyer)

        const images = Array.isArray(product?.product_images) ? product.product_images : []
        const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)
        const primary = sorted.find((i) => i.is_primary) ?? sorted[0]

        const st = statusLabel[order.status] ?? statusLabel.pending

        const review = Array.isArray(order.reviews) ? order.reviews[0] : order.reviews
        const orderCode = order.id.slice(0, 8).toUpperCase()

        return (
            <article key={order.id} className="group overflow-hidden rounded-[22px] bg-surface shadow-[7px_8px_18px_rgba(20,80,143,0.10),-5px_-5px_14px_rgba(255,255,255,0.82)] transition hover:-translate-y-0.5 hover:shadow-[9px_11px_22px_rgba(20,80,143,0.13),-6px_-6px_16px_rgba(255,255,255,0.9)] dark:shadow-[7px_8px_18px_rgba(0,0,0,0.38),-3px_-3px_10px_rgba(255,255,255,0.025)] dark:hover:shadow-[9px_11px_22px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(255,255,255,0.03)]">
                <div className="p-4 sm:p-5">
                    {/* Order meta bar: แค่วันที่ ไม่โชว์ code */}
                    <div className="mb-3 flex items-center justify-end text-[11px] text-text-muted">
                        <span>{formatOrderDate(order.created_at)}</span>
                    </div>

                    <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-2xl bg-surface-2 shadow-[inset_2px_2px_6px_rgba(20,80,143,0.08)] dark:shadow-[inset_2px_2px_7px_rgba(0,0,0,0.35)] sm:h-20 sm:w-20">
                            {primary ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={primary.image_url} alt={product?.title ?? 'สินค้า'} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-text-muted">
                                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path d="m21 15-5-5L5 21" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-text sm:text-[15px]">{product?.title ?? 'ไม่พบชื่อสินค้า'}</h3>
                                    <p className="mt-1 text-xs text-text-muted">{role === 'buyer' ? 'ผู้ขาย' : 'ผู้ซื้อ'}: {otherParty?.username ?? 'ไม่ระบุ'}</p>
                                    <p className="mt-1 text-xs text-text-muted">จำนวน {order.quantity} ชิ้น</p>
                                </div>

                                <div className="shrink-0 sm:text-right">
                                    <p className="text-base font-bold text-primary">฿{Number(order.total_price).toLocaleString()}</p>
                                    <span className={`mt-1 inline-flex items-center gap-1.5 text-xs font-medium ${st.className}`}>
                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                        {st.text}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ที่อยู่จัดส่ง — สำคัญมากสำหรับผู้ขาย ต้องใช้ในการจัดส่งจริง */}
                    {order.shipping_address && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-surface-2 px-3 py-2.5">
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-text-muted">
                                    {role === 'seller' ? 'จัดส่งไปที่' : 'ที่อยู่จัดส่งของคุณ'}
                                </p>
                                <p className="mt-0.5 text-xs text-text">{order.shipping_address}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 border-t border-border/40 pt-3">
                        <OrderRowActions orderId={order.id} status={order.status} role={role} existingReview={review ?? null} />
                    </div>
                </div>
            </article>
        )
    }

    const EmptyState = ({ type }: { type: 'purchase' | 'sale' }) => (
        <div className="rounded-[22px] bg-surface px-5 py-10 text-center shadow-[inset_3px_3px_10px_rgba(20,80,143,0.08),inset_-3px_-3px_10px_rgba(255,255,255,0.75)] dark:shadow-[inset_3px_3px_10px_rgba(0,0,0,0.35)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-text-muted shadow-[inset_3px_3px_8px_rgba(20,80,143,0.08),inset_-3px_-3px_8px_rgba(255,255,255,0.75)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.4)]">
                {type === 'purchase' ? (
                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 8h12l1 12H5L6 8Z" />
                        <path d="M9 8a3 3 0 0 1 6 0" />
                    </svg>
                ) : (
                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 7h18" />
                        <path d="M5 7v13h14V7" />
                        <path d="M8 4h8l2 3H6l2-3Z" />
                        <path d="M9 11h6" />
                    </svg>
                )}
            </div>

            <p className="mt-4 text-sm font-medium text-text">
                {type === 'purchase' ? 'ยังไม่มีคำสั่งซื้อ' : 'ยังไม่มีออเดอร์เข้ามา'}
            </p>

            <p className="mt-1 text-xs text-text-muted">
                {type === 'purchase' ? 'รายการสินค้าที่คุณสั่งซื้อจะแสดงที่นี่' : 'เมื่อมีคนสั่งซื้อสินค้าของคุณ รายการจะแสดงที่นี่'}
            </p>
        </div>
    )

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gradient-to-b from-bg via-bg to-bg/80 px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
                <div className="mx-auto w-full max-w-6xl">

                    {/* Header */}
                    <header className="mb-7">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-semibold text-text">คำสั่งซื้อของฉัน</h1>
                                <p className="mt-1 text-sm text-text-muted">จัดการรายการซื้อและขายสินค้าของคุณ</p>
                            </div>
                        </div>
                    </header>

                    {/* Summary */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div className="rounded-[22px] bg-surface p-5 shadow-[6px_7px_16px_rgba(20,80,143,0.09),-4px_-4px_12px_rgba(255,255,255,0.8)] dark:shadow-[6px_7px_16px_rgba(0,0,0,0.35),-3px_-3px_9px_rgba(255,255,255,0.02)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-muted">สินค้าที่สั่งซื้อ</p>
                                    <p className="mt-2 text-2xl font-bold text-text">{purchaseCount}</p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="9" cy="21" r="1.5" />
                                        <circle cx="18" cy="21" r="1.5" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 3h2l2.4 12.4a2 2 0 002 1.6h8.2a2 2 0 002-1.6L19.5 8H6" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[22px] bg-surface p-5 shadow-[6px_7px_16px_rgba(20,80,143,0.09),-4px_-4px_12px_rgba(255,255,255,0.8)] dark:shadow-[6px_7px_16px_rgba(0,0,0,0.35),-3px_-3px_9px_rgba(255,255,255,0.02)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-muted">ออเดอร์ที่ขาย</p>
                                    <p className="mt-2 text-2xl font-bold text-text">{salesCount}</p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 13v3M15 13v3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[22px] bg-surface p-5 shadow-[6px_7px_16px_rgba(20,80,143,0.09),-4px_-4px_12px_rgba(255,255,255,0.8)] dark:shadow-[6px_7px_16px_rgba(0,0,0,0.35),-3px_-3px_9px_rgba(255,255,255,0.02)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-muted">รายการทั้งหมด</p>
                                    <p className="mt-2 text-2xl font-bold text-text">{totalCount}</p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-text-muted">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M4 6h16" />
                                        <path d="M4 12h16" />
                                        <path d="M4 18h16" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purchases */}
                    <section>
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-text">รายการที่ฉันสั่งซื้อ</h2>
                                    <p className="mt-0.5 text-xs text-text-muted">สินค้าที่คุณสั่งจากผู้ขายรายอื่น</p>
                                </div>
                            </div>

                            {purchaseCount > 0 && (
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary">{purchaseCount} รายการ</span>
                            )}
                        </div>

                        <div className="space-y-3">
                            {purchases && purchases.length > 0 ? purchases.map((order) => renderOrder(order, 'buyer')) : <EmptyState type="purchase" />}
                        </div>
                    </section>

                    {/* Sales */}
                    <section className="mt-9">
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-text">รายการที่มีคนสั่งซื้อ</h2>
                                    <p className="mt-0.5 text-xs text-text-muted">ออเดอร์ที่ต้องดำเนินการจัดส่ง</p>
                                </div>
                            </div>

                            {salesCount > 0 && (
                                <span className="rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-semibold text-secondary">{salesCount} รายการ</span>
                            )}
                        </div>

                        <div className="space-y-3">
                            {sales && sales.length > 0 ? sales.map((order) => renderOrder(order, 'seller')) : <EmptyState type="sale" />}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-8 text-center">
                        <p className="text-xs text-text-muted/60">ข้อมูลคำสั่งซื้อและสถานะจะอัปเดตตามการดำเนินการของผู้ซื้อและผู้ขาย</p>
                    </footer>
                </div>
            </main>
        </>
    )
}