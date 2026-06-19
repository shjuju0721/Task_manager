"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { ListSkeleton } from "@/components/skeletons"
import { useTaskDialog } from "@/components/task-dialog-provider"
import { Button } from "@/components/ui/button"
import {
  formatYearMonth,
  isoLocal,
  monthGrid,
  monthOf,
  WEEKDAYS,
} from "@/lib/date"
import { useStore } from "@/lib/store"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function CalendarPage() {
  const { state, ready } = useStore()
  const { openEdit } = useTaskDialog()

  // 표시 중인 연/월 (오늘 기준 초기화)
  const [cursor, setCursor] = React.useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const todayISOValue = isoLocal(new Date())

  // 날짜별 작업 맵: 마감일이 있으면 마감일, 없으면 생성일에 배치
  const byDate = React.useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const t of state.tasks) {
      const date = t.dueDate ?? isoLocal(new Date(t.createdAt))
      const list = map.get(date)
      if (list) list.push(t)
      else map.set(date, [t])
    }
    return map
  }, [state.tasks])

  const cells = React.useMemo(
    () => monthGrid(cursor.year, cursor.month),
    [cursor]
  )

  function shiftMonth(delta: number) {
    setCursor((c) => {
      const m = c.month + delta
      return {
        year: c.year + Math.floor(m / 12),
        month: ((m % 12) + 12) % 12,
      }
    })
  }

  function goToday() {
    const now = new Date()
    setCursor({ year: now.getFullYear(), month: now.getMonth() })
  }

  if (!ready) return <ListSkeleton />

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="캘린더"
        description="마감일이 있는 작업은 색으로 강조됩니다."
      >
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={goToday}>
            오늘
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="이전 달"
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="다음 달"
            onClick={() => shiftMonth(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </PageHeader>

      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-lg font-bold tracking-tight">
          {formatYearMonth(cursor.year, cursor.month)}
        </h2>
        <Legend />
      </div>

      {/* 달력 (요일 헤더 + 6주 그리드) */}
      <div className="overflow-hidden rounded-lg border">
      <div className="text-muted-foreground grid grid-cols-7 border-b text-center text-xs font-medium">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={cn(
              "py-2",
              i === 0 && "text-red-500",
              i === 6 && "text-blue-500"
            )}
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 [&>*:nth-child(7n)]:border-r-0 [&>*:nth-last-child(-n+7)]:border-b-0 [&>*]:border-r [&>*]:border-b">
        {cells.map((date) => {
          const inMonth = monthOf(date) === cursor.month
          const isToday = date === todayISOValue
          const day = Number(date.slice(8, 10))
          const weekday = new Date(date + "T00:00:00").getDay()
          const tasks = byDate.get(date) ?? []

          return (
            <div
              key={date}
              className={cn(
                "min-h-20 p-1 sm:min-h-24 sm:p-1.5",
                !inMonth && "bg-muted/30"
              )}
            >
              <div className="mb-1 flex justify-end">
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-xs tabular-nums",
                    !inMonth && "text-muted-foreground/50",
                    isToday && "bg-primary text-primary-foreground font-semibold",
                    inMonth && !isToday && weekday === 0 && "text-red-500",
                    inMonth && !isToday && weekday === 6 && "text-blue-500"
                  )}
                >
                  {day}
                </span>
              </div>

              <div className="flex flex-col gap-0.5">
                {tasks.slice(0, 3).map((t) => (
                  <TaskChip
                    key={t.id}
                    task={t}
                    today={todayISOValue}
                    onClick={() => openEdit(t)}
                  />
                ))}
                {tasks.length > 3 && (
                  <span className="text-muted-foreground px-1 text-[10px]">
                    +{tasks.length - 3}개 더
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}

function TaskChip({
  task,
  today,
  onClick,
}: {
  task: Task
  today: string
  onClick: () => void
}) {
  const done = task.status === "done"
  const hasDue = !!task.dueDate
  const overdue = hasDue && !done && task.dueDate! < today

  return (
    <button
      onClick={onClick}
      title={task.title}
      className={cn(
        "block w-full truncate rounded px-1 py-0.5 text-left text-[11px] leading-tight transition-colors",
        done && "bg-muted text-muted-foreground line-through",
        !done &&
          overdue &&
          "bg-red-500/15 text-red-600 hover:bg-red-500/25 dark:text-red-400",
        !done &&
          !overdue &&
          hasDue &&
          "bg-primary/15 text-primary hover:bg-primary/25 font-medium",
        !done &&
          !hasDue &&
          "bg-muted/70 text-muted-foreground hover:bg-muted"
      )}
    >
      {task.title}
    </button>
  )
}

function Legend() {
  return (
    <div className="text-muted-foreground hidden items-center gap-3 text-xs sm:flex">
      <span className="flex items-center gap-1">
        <span className="bg-primary/40 size-2.5 rounded-sm" /> 마감일
      </span>
      <span className="flex items-center gap-1">
        <span className="size-2.5 rounded-sm bg-red-500/40" /> 지연
      </span>
      <span className="flex items-center gap-1">
        <span className="bg-muted-foreground/30 size-2.5 rounded-sm" /> 마감일 없음
      </span>
    </div>
  )
}
