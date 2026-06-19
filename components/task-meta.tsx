import { CalendarClock } from "lucide-react"

import { formatDueRelative, isOverdue } from "@/lib/date"
import { PRIORITY_META, type Priority, type Project } from "@/lib/types"
import { cn } from "@/lib/utils"

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium",
        meta.className
      )}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.label}
    </span>
  )
}

export function DueBadge({
  dueDate,
  done,
}: {
  dueDate: string | null
  done: boolean
}) {
  const label = formatDueRelative(dueDate)
  if (!label) return null
  const overdue = isOverdue(dueDate, done)
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs",
        overdue
          ? "font-medium text-red-600 dark:text-red-400"
          : "text-muted-foreground"
      )}
    >
      <CalendarClock className="size-3" />
      {label}
    </span>
  )
}

export function ProjectDot({ project }: { project: Project | null }) {
  if (!project) {
    return (
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
        <span className="bg-muted-foreground/40 size-2 rounded-full" />
        미분류
      </span>
    )
  }
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: project.color }}
      />
      {project.name}
    </span>
  )
}
