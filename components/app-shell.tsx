"use client"

import * as React from "react"
import { KanbanSquare, Menu, Plus } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { useTaskDialog } from "@/components/task-dialog-provider"
import { Button } from "@/components/ui/button"

/** 사이드바(데스크톱 고정 / 모바일 드로어) + 모바일 상단바 + 본문 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex h-svh overflow-hidden">
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader onMenu={() => setOpen(true)} />
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function MobileHeader({ onMenu }: { onMenu: () => void }) {
  const { openCreate } = useTaskDialog()

  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b px-3 backdrop-blur lg:hidden">
      <Button variant="ghost" size="icon" onClick={onMenu} aria-label="메뉴 열기">
        <Menu />
      </Button>
      <div className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
          <KanbanSquare className="size-4" />
        </div>
        <span className="text-sm font-bold">TaskFlow</span>
      </div>
      <Button size="sm" className="ml-auto" onClick={() => openCreate()}>
        <Plus /> 새 작업
      </Button>
    </header>
  )
}
