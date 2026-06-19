"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { TaskCard } from "@/components/task-card"
import { useTaskDialog } from "@/components/task-dialog-provider"
import { useStore } from "@/lib/store"
import {
  STATUS_META,
  type Project,
  type Status,
  type Task,
} from "@/lib/types"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  status: Status
  tasks: Task[]
  projectById: Map<string, Project>
}

export function KanbanColumn({ status, tasks, projectById }: KanbanColumnProps) {
  const { moveTask } = useStore()
  const { openCreate, openEdit } = useTaskDialog()
  const [over, setOver] = React.useState(false)
  const meta = STATUS_META[status]

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setOver(false)
    const id = e.dataTransfer.getData("text/task-id")
    if (!id) return
    const order = tasks.length
    moveTask(id, status, order)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      className={cn(
        "bg-muted/40 flex h-full min-h-[140px] flex-col rounded-xl border p-3 transition-colors lg:min-h-[60vh]",
        over && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={cn("size-2.5 rounded-full", meta.dot)} />
        <h2 className="text-sm font-semibold">{meta.label}</h2>
        <span className="text-muted-foreground bg-muted rounded-md px-1.5 text-xs font-medium tabular-nums">
          {tasks.length}
        </span>
        <button
          onClick={() => openCreate({ status })}
          aria-label="작업 추가"
          className="text-muted-foreground hover:bg-muted hover:text-foreground ml-auto inline-flex size-6 items-center justify-center rounded-md transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {tasks.length === 0 ? (
          <button
            onClick={() => openCreate({ status })}
            className="text-muted-foreground hover:border-primary/40 hover:text-foreground flex h-20 items-center justify-center rounded-lg border border-dashed text-xs transition-colors"
          >
            여기로 끌어다 놓거나 + 로 추가
          </button>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              project={
                task.projectId
                  ? (projectById.get(task.projectId) ?? null)
                  : null
              }
              onEdit={openEdit}
              draggable
            />
          ))
        )}
      </div>
    </div>
  )
}
