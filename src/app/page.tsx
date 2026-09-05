import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { getCategoryIcon } from '@/lib/categoryIcons'
import { FavoriteButton } from '@/components/products/FavoriteButton'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const { category: selectedSlug, search: searchQuery } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: categories } = await supabase.from('categories').select('*')

  const activeCategory = categories?.find((c) => c.slug === selectedSlug)

  let productsQuery = supabase
    .from('products')
    .select('id, title, price, brand, condition, category_id, categories(name, slug), product_images(image_url, is_primary, sort_order)')
    .eq('status', 'active')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })

  if (activeCategory) {
      productsQuery = productsQuery.eq('category_id', activeCategory.id)
  }
  if (searchQuery?.trim()) {
      const term = searchQuery.trim().replace(/[%_]/g, '\\$&') // กัน % หรือ _ ทำให้ pattern เพี้ยน
      productsQuery = productsQuery.or(`title.ilike.%${term}%,brand.ilike.%${term}%`)
  }
  if (!activeCategory && !searchQuery?.trim()) {
      productsQuery = productsQuery.limit(12)
  }

  const { data: products } = await productsQuery

  let favoritedIds = new Set<string>()
  if (user) {
      const { data: favs } = await supabase
          .from('favorites')
          .select('product_id')
          .eq('user_id', user.id)
      favoritedIds = new Set((favs ?? []).map((f) => f.product_id))
  }

  let username = ''
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
    username = profile?.username ?? ''
  }

  const conditionLabel: Record<string, string> = {
    new: 'ใหม่',
    like_new: 'สภาพดีมาก',
    used_good: 'มือสอง สภาพดี',
    used_fair: 'มือสอง ใช้งานได้',
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        {/* Hero */}
        <div className="relative h-[320px] overflow-hidden rounded-[2rem] shadow-[10px_10px_26px_rgba(20,80,143,0.3),-6px_-6px_18px_rgba(255,255,255,0.4)] dark:shadow-[10px_10px_28px_rgba(0,0,0,0.55),-4px_-4px_12px_rgba(255,255,255,0.03)] sm:h-[420px]">
          <img
            src="/images/hero-main2.jpg"
            alt="CompMart"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/50 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-12">
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
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
              <a
                href="/"
                className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                  !activeCategory
                    ? 'bg-primary text-white shadow-[4px_4px_10px_rgba(20,80,143,0.3)]'
                    : 'bg-surface text-text shadow-[1px_1px_3px_rgba(20,80,143,0.15),-1px_-1px_3px_rgba(255,255,255,0.9)] hover:text-primary dark:shadow-[1px_1px_4px_rgba(0,0,0,0.4),-1px_-1px_3px_rgba(255,255,255,0.03)]'
                }`}
              >
                ทั้งหมด
              </a>
              {categories.map((cat) => {
                const isActive = cat.slug === selectedSlug
                return (
                  <a key={cat.id}
                    href={`/?category=${cat.slug}`}
                    className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-primary text-white shadow-[4px_4px_10px_rgba(20,80,143,0.3)]'
                        : 'bg-surface text-text shadow-[1px_1px_3px_rgba(20,80,143,0.15),-1px_-1px_3px_rgba(255,255,255,0.9)] hover:text-primary dark:shadow-[1px_1px_4px_rgba(0,0,0,0.4),-1px_-1px_3px_rgba(255,255,255,0.03)] dark:active:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.5)] active:shadow-[inset_3px_3px_8px_rgba(20,80,143,0.2)]'
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-surface-2 text-primary'
                    }`}>
                      {getCategoryIcon(cat.slug)}
                    </span>
                    {cat.name}
                  </a>
                )
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-muted">ยังไม่มีหมวดหมู่สินค้า</p>
          )}
        </section>

        {/* สินค้า */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">
                {searchQuery?.trim()
                    ? `ผลการค้นหา "${searchQuery.trim()}"`
                    : activeCategory
                        ? `สินค้าในหมวด ${activeCategory.name}`
                        : 'สินค้าล่าสุด'}
            </h2>
            {products && products.length > 0 && (
              <span className="text-sm text-text-muted">{products.length} รายการ</span>
            )}
          </div>

          {products && products.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {products.map((p) => {
                  const category = Array.isArray(p.categories) ? p.categories[0] : p.categories
                  const images = Array.isArray(p.product_images) ? p.product_images : []
                  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)
                  const primary = sorted.find((img) => img.is_primary) ?? sorted[0]

                  return (
                    <a
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="block rounded-2xl bg-surface p-4 shadow-[6px_6px_14px_rgba(20,80,143,0.15),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5"
                    >
                      <div className="relative mb-3 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-surface-2 text-primary/60">
                        {primary ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={primary.image_url} alt={p.title} className="h-full w-full object-cover" />
                        ) : (
                            category ? getCategoryIcon(category.slug) : null
                        )}
                        <div className="absolute right-1.5 top-1.5 rounded-full bg-white/80 backdrop-blur-sm dark:bg-black/40">
                            <FavoriteButton
                                productId={p.id}
                                initialFavorited={favoritedIds.has(p.id)}
                                variant="icon"
                                isLoggedIn={!!user}
                            />
                        </div>
                    </div>

                      {category && (
                        <span className="text-xs font-medium text-primary">{category.name}</span>
                      )}
                      <p className="mt-0.5 truncate text-sm font-medium text-text">{p.title}</p>
                      {p.brand && (
                        <p className="truncate text-xs text-text-muted">{p.brand}</p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-primary">฿{Number(p.price).toLocaleString()}</p>
                        {p.condition && (
                          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-text-muted">
                            {conditionLabel[p.condition] ?? p.condition}
                          </span>
                        )}
                      </div>
                    </a>
                  )
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-surface p-10 text-center shadow-[inset_3px_3px_10px_rgba(20,80,143,0.1),inset_-3px_-3px_10px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_10px_rgba(0,0,0,0.4),inset_-2px_-2px_8px_rgba(255,255,255,0.02)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-text-muted shadow-[inset_3px_3px_8px_rgba(20,80,143,0.12),inset_-3px_-3px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.45),inset_-2px_-2px_6px_rgba(255,255,255,0.02)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8l2-4h14l2 4M3 8v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8M3 8h18M9 12h6" />
                </svg>
              </div>
              <p className="text-text-muted">
                  {searchQuery?.trim()
                      ? `ไม่พบสินค้าที่ตรงกับ "${searchQuery.trim()}"`
                      : activeCategory
                          ? 'ยังไม่มีสินค้าในหมวดหมู่นี้'
                          : 'ยังไม่มีสินค้าในระบบตอนนี้'}
              </p>
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