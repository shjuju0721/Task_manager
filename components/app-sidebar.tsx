"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  KanbanSquare,
  LayoutDashboard,
  ListTodo,
  Moon,
  Plus,
  FolderKanban,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useTaskDialog } from "@/components/task-dialog-provider"
import { ThemePicker } from "@/components/theme-picker"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/board", label: "칸반 보드", icon: KanbanSquare },
  { href: "/tasks", label: "작업 목록", icon: ListTodo },
  { href: "/projects", label: "프로젝트", icon: FolderKanban },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { openCreate } = useTaskDialog()

  return (
    <aside className="bg-sidebar text-sidebar-foreground flex h-svh w-60 shrink-0 flex-col border-r">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
          <KanbanSquare className="size-5" />
        </div>
        <div>
          <p className="text-sm leading-none font-bold">TaskFlow</p>
          <p className="text-muted-foreground mt-0.5 text-xs">작업 관리</p>
        </div>
      </div>

      <div className="px-3">
        <Button className="w-full" onClick={() => openCreate()}>
          <Plus /> 새 작업
        </Button>
      </div>

      <nav className="mt-4 flex flex-col gap-0.5 px-3">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 p-3">
        <ThemePicker />
        <ThemeToggle />
      </div>
    </aside>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      className="text-muted-foreground w-full justify-start"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && isDark ? <Sun /> : <Moon />}
      {mounted ? (isDark ? "라이트 모드" : "다크 모드") : "테마"}
    </Button>
  )
}
