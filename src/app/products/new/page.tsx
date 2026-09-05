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
            <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-semibold text-text">ลงขายสินค้า</h1>
            <p className="mt-1 text-sm text-text-muted">กรอกรายละเอียดสินค้าที่ต้องการขาย</p>

            {params.error && (
                <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-text shadow-[inset_2px_2px_6px_rgba(239,68,68,0.15)]">
                {params.error}
                </p>
            )}

            <div className="">
                <ProductForm userId={user.id} categories={categories ?? []} />
            </div>
            </div>
        </div>
        </>
    )
}