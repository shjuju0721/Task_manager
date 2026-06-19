import type { LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  hint?: string
  accent?: string // 아이콘 배경 색
  tone?: "default" | "danger" | "success"
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent,
  tone = "default",
}: StatCardProps) {
  return (
    <Card className="gap-0 p-4">
      <div className="flex items-start justify-between">
        <span className="text-muted-foreground text-xs font-medium">
          {label}
        </span>
        <span
          className="flex size-8 items-center justify-center rounded-lg"
          style={{
            backgroundColor: accent ?? "color-mix(in oklch, var(--primary) 12%, transparent)",
            color: accent ? "white" : "var(--primary)",
          }}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span
          className={cn(
            "text-2xl font-bold tracking-tight tabular-nums",
            tone === "danger" && "text-red-600 dark:text-red-400",
            tone === "success" && "text-emerald-600 dark:text-emerald-400"
          )}
        >
          {value}
        </span>
        {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
      </div>
    </Card>
  )
}
