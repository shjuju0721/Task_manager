"use client"

import * as React from "react"
import { CheckCircle2, Circle, Clock, GripVertical } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DueBadge, PriorityBadge, ProjectDot } from "@/components/task-meta"
import { useStore } from "@/lib/store"
import { STATUS_ORDER, type Project, type Status, type Task } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  project: Project | null
  onEdit: (task: Task) => void
  draggable?: boolean
}

const STATUS_ICON: Record<Status, React.ReactNode> = {
  todo: <Circle className="size-4" />,
  in_progress: <Clock className="size-4 text-blue-500" />,
  done: <CheckCircle2 className="size-4 text-emerald-500" />,
}

/** 다음 상태로 순환 (할 일 → 진행 중 → 완료 → 할 일) */
function nextStatus(status: Status): Status {
  const i = STATUS_ORDER.indexOf(status)
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length]
}

export function TaskCard({ task, project, onEdit, draggable }: TaskCardProps) {
  const { moveTask } = useStore()
  const done = task.status === "done"

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("text/task-id", task.id)
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      onClick={() => onEdit(task)}
      className={cn(
        "group bg-card hover:border-primary/40 relative cursor-pointer rounded-xl border p-3 shadow-sm transition-all hover:shadow-md",
        done && "opacity-70"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          aria-label="상태 변경"
          onClick={(e) => {
            e.stopPropagation()
            moveTask(task.id, nextStatus(task.status), task.order)
          }}
          className="hover:text-foreground text-muted-foreground mt-0.5 shrink-0 transition-colors"
        >
          {STATUS_ICON[task.status]}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm leading-snug font-medium",
              done && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <PriorityBadge priority={task.priority} />
            <DueBadge dueDate={task.dueDate} done={done} />
            {project !== undefined && <ProjectDot project={project} />}
          </div>

          {task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="muted">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {draggable && (
          <GripVertical className="text-muted-foreground/40 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
    </div>
  )
}
