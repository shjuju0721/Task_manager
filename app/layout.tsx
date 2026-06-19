import type { Metadata } from "next"
import { Geist_Mono, Space_Grotesk } from "next/font/google"

import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { ColorThemeProvider } from "@/components/color-theme-provider"
import { TaskDialogProvider } from "@/components/task-dialog-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/lib/store"
import { cn } from "@/lib/utils"

// 새로고침 시 색감 테마 깜빡임 방지: 페인트 전에 data-theme 적용
const themeInitScript = `(function(){try{var t=localStorage.getItem('taskflow.color')||'latte';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','latte');}})();`

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "TaskFlow — 개인 작업 관리",
  description:
    "칸반·우선순위·마감일 기반 개인 작업 관리와 대시보드",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        spaceGrotesk.variable
      )}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <ColorThemeProvider>
            <StoreProvider>
              <TaskDialogProvider>
                <div className="flex">
                  <AppSidebar />
                  <main className="h-svh flex-1 overflow-y-auto">
                    {children}
                  </main>
                </div>
              </TaskDialogProvider>
            </StoreProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
