export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-bg">
        {/* Image panel — desktop เท่านั้น */}
        <div className="relative hidden w-1/2 overflow-hidden md:block">
            <img
            src="/images/hero-bg.jpg"
            alt="Gaming setup"
            className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/90 via-primary/70 to-secondary/50" />

            <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <div className="inline-flex w-fit items-center rounded-xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur">
                <img src="/images/logo.jpg" alt="CompMart" className="h-8 w-auto" />
            </div>

            <div>
                <h1 className="text-4xl font-semibold leading-tight text-white">
                อัปเกรดคอมของคุณ
                <br />
                ในราคาที่ใช่
                </h1>
                <p className="mt-4 max-w-sm text-white/85">
                ตลาดซื้อขายอุปกรณ์คอมและเกมมิ่งเกียร์ ตรงจากคนเล่นจริง
                </p>
            </div>

            <p className="text-sm text-white/60">© 2026 CompMart</p>
            </div>
        </div>

        {/* Form panel */}
        <div className="flex w-full flex-1 items-center justify-center px-6 py-16 md:w-1/2">
            <div className="w-full max-w-sm">
            <img src="/images/logo.jpg" alt="CompMart" className="mb-8 h-10 w-auto md:hidden" />
            {children}
            </div>
        </div>
        </div>
    )
}