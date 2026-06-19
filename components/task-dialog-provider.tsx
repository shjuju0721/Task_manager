"use client"

import * as React from "react"

import { TaskDialog } from "@/components/task-dialog"
import type { Status, Task } from "@/lib/types"

interface OpenCreateOptions {
  status?: Status
  projectId?: string | null
}

interface TaskDialogContextValue {
  openCreate: (options?: OpenCreateOptions) => void
  openEdit: (task: Task) => void
}

const TaskDialogContext = React.createContext<TaskDialogContextValue | null>(
  null
)

export function TaskDialogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [task, setTask] = React.useState<Task | null>(null)
  const [status, setStatus] = React.useState<Status>("todo")
  const [projectId, setProjectId] = React.useState<string | null>(null)

  const value = React.useMemo<TaskDialogContextValue>(
    () => ({
      openCreate: (options) => {
        setTask(null)
        setStatus(options?.status ?? "todo")
        setProjectId(options?.projectId ?? null)
        setOpen(true)
      },
      openEdit: (t) => {
        setTask(t)
        setOpen(true)
      },
    }),
    []
  )

  return (
    <TaskDialogContext.Provider value={value}>
      {children}
      <TaskDialog
        open={open}
        onClose={() => setOpen(false)}
        task={task}
        defaultStatus={status}
        defaultProjectId={projectId}
      />
    </TaskDialogContext.Provider>
  )
}

export function useTaskDialog(): TaskDialogContextValue {
  const ctx = React.useContext(TaskDialogContext)
  if (!ctx) {
    throw new Error("useTaskDialog must be used within a TaskDialogProvider")
  }
  return ctx
}
