"use client"

import * as React from "react"

import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/themes"

interface ColorThemeContextValue {
  theme: string
  setTheme: (id: string) => void
}

const ColorThemeContext = React.createContext<ColorThemeContextValue | null>(
  null
)

export function ColorThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setThemeState] = React.useState(DEFAULT_THEME)

  // 마운트 시 저장된 테마 복원 (인라인 스크립트가 이미 적용해 둔 값과 동기화)
  React.useEffect(() => {
    const saved =
      document.documentElement.getAttribute("data-theme") ||
      window.localStorage.getItem(THEME_STORAGE_KEY) ||
      DEFAULT_THEME
    setThemeState(saved)
  }, [])

  const setTheme = React.useCallback((id: string) => {
    setThemeState(id)
    document.documentElement.setAttribute("data-theme", id)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, id)
    } catch {
      // 저장 실패 무시
    }
  }, [])

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme(): ColorThemeContextValue {
  const ctx = React.useContext(ColorThemeContext)
  if (!ctx) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider")
  }
  return ctx
}
