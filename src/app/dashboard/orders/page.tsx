import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { OrderRowActions } from '@/components/orders/OrderRowActions'

const statusLabel: Record<string, { text: string; className: string }> = {
    pending: { text: 'รอผู้ขายยืนยัน', className: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10' },
    confirmed: { text: 'กำลังดำเนินการ', className: 'bg-primary/10 text-primary' },
    completed: { text: 'สำเร็จ', className: 'bg-secondary/10 text-secondary' },
    cancelled: { text: 'ยกเลิก', className: 'bg-red-50 text-red-500 dark:bg-red-500/10' },
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

        return (
        <div key={order.id} className="rounded-2xl bg-surface p-4 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)]">
            <div className="flex gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                {primary && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={primary.image_url} alt={product?.title} className="h-full w-full object-cover" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">{product?.title}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                {role === 'buyer' ? 'ผู้ขาย' : 'ผู้ซื้อ'}: {otherParty?.username}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">จำนวน {order.quantity} ชิ้น</p>
            </div>
            <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-primary">฿{Number(order.total_price).toLocaleString()}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${st.className}`}>
                {st.text}
                </span>
            </div>
            </div>

            <OrderRowActions 
                orderId={order.id} 
                status={order.status} 
                role={role} 
                existingReview={review ?? null} 
                />
        </div>
        )
    }

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-bg px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-6xl space-y-10">
            <div>
                <h1 className="text-2xl font-semibold text-text">คำสั่งซื้อของฉัน</h1>
                <p className="mt-1 text-sm text-text-muted">รายการที่คุณสั่งซื้อ</p>
                <div className="mt-4 space-y-3">
                {purchases && purchases.length > 0 ? (
                    purchases.map((o) => renderOrder(o, 'buyer'))
                ) : (
                    <p className="rounded-2xl bg-surface p-6 text-center text-sm text-text-muted shadow-[inset_3px_3px_10px_rgba(20,80,143,0.1),inset_-3px_-3px_10px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_10px_rgba(0,0,0,0.4)]">
                    ยังไม่มีคำสั่งซื้อ
                    </p>
                )}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-text">ออเดอร์ที่ขาย</h2>
                <p className="mt-1 text-sm text-text-muted">รายการที่มีคนสั่งซื้อสินค้าของคุณ</p>
                <div className="mt-4 space-y-3">
                {sales && sales.length > 0 ? (
                    sales.map((o) => renderOrder(o, 'seller'))
                ) : (
                    <div className="rounded-2xl bg-surface p-6 text-center shadow-[inset_3px_3px_10px_rgba(20,80,143,0.1),inset_-3px_-3px_10px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_10px_rgba(0,0,0,0.4)]">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-text-muted shadow-[inset_3px_3px_8px_rgba(20,80,143,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.02)]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <p className="text-sm text-text-muted">ยังไม่มีออเดอร์เข้ามา</p>
                    </div>
                )}
                </div>
            </div>
            </div>
        </div>
        </>
    )
}