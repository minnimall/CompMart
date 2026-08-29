import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

const specs = [
    { name: 'RTX 4070 Ti Super', price: '฿24,900' },
    { name: 'Ducky One 3 TKL', price: '฿3,200' },
    { name: 'HyperX Cloud II', price: '฿1,890' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
        className={`${display.variable} ${sans.variable} ${mono.variable} flex min-h-screen bg-bg font-sans`}
        >
        {/* Decorative panel — ซ่อนบนมือถือ */}
        <div className="relative hidden w-[45%] overflow-hidden border-r border-border bg-surface md:flex md:flex-col md:justify-between md:p-12">
            {/* circuit trace pattern */}
            <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
            viewBox="0 0 400 800"
            >
            <path
                d="M0 100H140V220H400M0 340H80V500H260V620H400M0 700H180"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-accent"
            />
            <circle cx="140" cy="100" r="4" className="fill-accent" />
            <circle cx="260" cy="620" r="4" className="fill-warn" />
            <circle cx="80" cy="340" r="4" className="fill-accent" />
            </svg>

            <div className="relative z-10">
            <span className="font-mono text-sm tracking-wider text-accent">MARKETPLACE.GG</span>
            <h1 className="mt-6 font-display text-4xl font-medium leading-tight text-text">
                ของที่ไม่ได้ใช้
                <br />
                คือเกียร์ของใครสักคน
            </h1>
            <p className="mt-4 max-w-xs text-text-muted">
                ซื้อขายอุปกรณ์คอมและเกมมิ่งเกียร์มือสอง-มือหนึ่ง ตรงจากคนเล่นจริง
            </p>
            </div>

            <div className="relative z-10 space-y-3">
            {specs.map((item) => (
                <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border border-border bg-surface-2/80 px-4 py-3 backdrop-blur"
                >
                <span className="text-sm text-text">{item.name}</span>
                <span className="font-mono text-sm text-warn">{item.price}</span>
                </div>
            ))}
            </div>
        </div>

        {/* Form panel */}
        <div className="flex w-full flex-1 items-center justify-center px-6 py-16 md:w-[55%]">
            <div className="w-full max-w-sm">{children}</div>
        </div>
        </div>
    )
}