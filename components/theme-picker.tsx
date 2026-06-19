"use client"

import * as React from "react"
import { Check, Palette } from "lucide-react"

import { useColorTheme } from "@/components/color-theme-provider"
import { Button } from "@/components/ui/button"
import { COLOR_THEMES } from "@/lib/themes"
import { cn } from "@/lib/utils"

export function ThemePicker() {
  const { theme, setTheme } = useColorTheme()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const current = COLOR_THEMES.find((t) => t.id === theme) ?? COLOR_THEMES[0]

  // 바깥 클릭 시 닫기
  React.useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("mousedown", onClick)
    return () => window.removeEventListener("mousedown", onClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        className="text-muted-foreground w-full justify-start"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Palette />
        <span className="flex-1 text-left">테마</span>
        <span
          className="size-3.5 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: current.swatch }}
        />
      </Button>

      {open && (
        <div className="bg-popover text-popover-foreground animate-in fade-in zoom-in-95 absolute bottom-full left-0 z-50 mb-2 w-full origin-bottom rounded-xl border p-1.5 shadow-xl">
          <p className="text-muted-foreground px-2 py-1 text-xs font-medium">
            색감 테마
          </p>
          {COLOR_THEMES.map((t) => {
            const active = t.id === theme
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id)
                  setOpen(false)
                }}
                className={cn(
                  "hover:bg-accent flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors",
                  active && "bg-accent"
                )}
              >
                <span
                  className="size-5 shrink-0 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: t.swatch }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{t.label}</span>
                  <span className="text-muted-foreground block text-xs">
                    {t.hint}
                  </span>
                </span>
                {active && <Check className="text-primary size-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
