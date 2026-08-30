import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/components/ui/toast/ToastProvider'

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CompMart",
  description: "ตลาดซื้อขายอุปกรณ์คอมพิวเตอร์และเกมมิ่งเกียร์",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${kanit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className={`${kanit.className} min-h-full flex flex-col`}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}