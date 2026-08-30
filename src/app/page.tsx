import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { getCategoryIcon } from '@/lib/categoryIcons'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: categories } = await supabase.from('categories').select('*')
  const { data: products } = await supabase.from('products').select('id, title, price').eq('status', 'active').limit(8)

  let username = ''
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
    username = profile?.username ?? ''
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        {/* Hero */}
        <div className="relative h-[320px] overflow-hidden rounded-[2rem] shadow-[10px_10px_26px_rgba(20,80,143,0.3),-6px_-6px_18px_rgba(255,255,255,0.4)] sm:h-[420px]">
          <img
            src="/images/hero-main2.jpg"
            alt="CompMart"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/50 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-12">
            {/* <h1 className="text-2xl font-semibold text-white sm:text-3xl">
              {user ? `ยินดีต้อนรับกลับมา, ${username}` : 'ตลาดอุปกรณ์คอมและเกมมิ่งเกียร์'}
            </h1> */}
            <p className="mt-2 max-w-md text-sm text-white/95 sm:text-base">
              Marketplace ซื้อขายอุปกรณ์คอมพิวเตอร์และเกมมิ่งเกียร์มือสอง-มือหนึ่ง
            </p>
            {user && (
              <a href="/products/new" className="mt-6 inline-block w-fit rounded-2xl bg-white px-6 py-3 text-sm font-medium text-primary shadow-[4px_4px_12px_rgba(0,0,0,0.15)] transition hover:bg-white/90">
                + ลงขายสินค้า
              </a>
            )}
          </div>
        </div>

        {/* หมวดหมู่ */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-text">หมวดหมู่</h2>
          {categories && categories.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {categories.map((cat) =>(
                <a key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-[1px_1px_3px_rgba(20,80,143,0.15),-1px_-1px_3px_rgba(255,255,255,0.9)] transition hover:text-primary active:shadow-[inset_3px_3px_8px_rgba(20,80,143,0.2)]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-primary">
                      {getCategoryIcon(cat.slug)}
                    </span>
                    {cat.name}
                </a> 
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-muted">ยังไม่มีหมวดหมู่สินค้า</p>
          )}
        </section>

        {/* สินค้า */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-text">สินค้าล่าสุด</h2>

          {products && products.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {products.map((p) => (
                <div key={p.id} className="rounded-2xl bg-surface p-4 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)]">
                  <div className="mb-3 h-28 rounded-xl bg-surface-2" />
                  <p className="truncate text-sm font-medium text-text">{p.title}</p>
                  <p className="mt-1 text-sm font-semibold text-primary">฿{Number(p.price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-surface p-10 text-center shadow-[inset_3px_3px_10px_rgba(20,80,143,0.1),inset_-3px_-3px_10px_rgba(255,255,255,0.8)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-text-muted shadow-[inset_3px_3px_8px_rgba(20,80,143,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.8)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8l2-4h14l2 4M3 8v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8M3 8h18M9 12h6" />
                </svg>
              </div>
              <p className="text-text-muted">ยังไม่มีสินค้าในระบบตอนนี้</p>
              {user && (
                <a href="/products/new" className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary-dark">
                  เป็นคนแรกที่ลงขายสินค้า →
                </a>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}