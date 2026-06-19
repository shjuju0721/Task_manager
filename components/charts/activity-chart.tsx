"use client"

import { weekdayLabel } from "@/lib/date"

interface ActivityChartProps {
  data: { date: string; created: number; completed: number }[]
}

/** 최근 7일 생성/완료 작업 추이 (그룹 막대) */
export function ActivityChart({ data }: ActivityChartProps) {
  const max = Math.max(1, ...data.flatMap((d) => [d.created, d.completed]))

  return (
    <div>
      <div className="flex h-40 items-end justify-between gap-2">
        {data.map((d) => (
          <div
            key={d.date}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className="flex h-32 w-full items-end justify-center gap-1">
              <div
                className="bg-chart-3 w-2.5 rounded-t transition-all duration-500"
                style={{ height: `${(d.created / max) * 100}%` }}
                title={`생성 ${d.created}건`}
              />
              <div
                className="bg-primary w-2.5 rounded-t transition-all duration-500"
                style={{ height: `${(d.completed / max) * 100}%` }}
                title={`완료 ${d.completed}건`}
              />
            </div>
            <span className="text-muted-foreground text-xs">
              {weekdayLabel(d.date)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="bg-chart-3 size-2.5 rounded-full" />
          <span className="text-muted-foreground">생성</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-primary size-2.5 rounded-full" />
          <span className="text-muted-foreground">완료</span>
        </span>
      </div>
    </div>
  )
}
