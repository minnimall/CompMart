import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('categories').select('*')

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">ทดสอบเชื่อมต่อ Supabase</h1>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}