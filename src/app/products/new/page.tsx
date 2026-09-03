import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { ProductForm } from '@/components/products/ProductForm'

export default async function NewProductPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: categories } = await supabase.from('categories').select('id, name').order('name')

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-bg px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-semibold text-text">ลงขายสินค้า</h1>
            <p className="mt-1 text-sm text-text-muted">กรอกรายละเอียดสินค้าที่ต้องการขาย</p>

            {params.error && (
                <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-text shadow-[inset_2px_2px_6px_rgba(239,68,68,0.15)]">
                {params.error}
                </p>
            )}

            <div className="mt-6 rounded-[2rem] bg-surface p-8 shadow-[10px_10px_26px_rgba(20,80,143,0.15),-8px_-8px_20px_rgba(255,255,255,0.9)] dark:shadow-[10px_10px_28px_rgba(0,0,0,0.5),-6px_-6px_16px_rgba(255,255,255,0.03)]">
                <ProductForm userId={user.id} categories={categories ?? []} />
            </div>
            </div>
        </div>
        </>
    )
}