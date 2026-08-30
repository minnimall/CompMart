export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#dbeaff] to-[#eef5ff] px-4 py-10 sm:px-6">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative flex w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-surface shadow-[14px_14px_30px_rgba(20,80,143,0.18),-14px_-14px_30px_rgba(255,255,255,0.9)]">
            {/* ฝั่งซ้าย — ภาพเต็มพื้นที่ */}
            <div className="relative hidden w-1/2 md:block">
            <img src="/images/hero-bg.jpg" alt="Gaming setup" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/85 via-primary/55 to-secondary/40" />

            <div className="relative z-10 flex h-full flex-col justify-between p-10">
                <div className="inline-flex w-fit items-center rounded-xl bg-white px-3 py-1.5 shadow-[6px_6px_16px_rgba(20,80,143,0.3),-4px_-4px_12px_rgba(255,255,255,0.5)]">
                    <img src="/images/logo.png" alt="CompMart" className="h-14 w-auto" />
                </div>

                <div>
                <h1 className="text-3xl font-semibold leading-snug text-white">
                    อัปเกรดคอมของคุณ
                    <br />
                    ในราคาที่ใช่
                </h1>
                <p className="mt-3 max-w-xs text-sm text-white/85">
                    ตลาดซื้อขายอุปกรณ์คอมและเกมมิ่งเกียร์
                </p>
                </div>
            </div>
            </div>

            {/* ฝั่งขวา — ฟอร์ม */}
            <div className="flex w-full items-center justify-center p-8 sm:p-12 md:w-1/2">
            <div className="w-full max-w-sm">
                <img src="/images/logo.png" alt="CompMart" className="mx-auto mb-8 block h-30 w-auto md:hidden" />
                {children}
            </div>
            </div>
        </div>
        </div>
    )
}