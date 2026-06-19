"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { KanbanColumn } from "@/components/kanban-column"
import { PageHeader } from "@/components/page-header"
import { BoardSkeleton } from "@/components/skeletons"
import { useTaskDialog } from "@/components/task-dialog-provider"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { STATUS_ORDER, type Status, type Task } from "@/lib/types"

export default function BoardPage() {
  const { state, ready } = useStore()
  const { openCreate } = useTaskDialog()
  const [projectFilter, setProjectFilter] = React.useState<string>("all")

  const projectById = React.useMemo(
    () => new Map(state.projects.map((p) => [p.id, p])),
    [state.projects]
  )

  const columns = React.useMemo(() => {
    const filtered = state.tasks.filter((t) =>
      projectFilter === "all"
        ? true
        : projectFilter === "none"
          ? t.projectId === null
          : t.projectId === projectFilter
    )
    const map: Record<Status, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    }
    for (const t of filtered) map[t.status].push(t)
    for (const s of STATUS_ORDER) {
      map[s].sort((a, b) => a.order - b.order)
    }
    return map
  }, [state.tasks, projectFilter])

  if (!ready) return <BoardSkeleton />

  return (
    <div className="flex h-svh flex-col p-6 lg:p-8">
      <PageHeader
        title="칸반 보드"
        description="카드를 끌어다 놓아 상태를 변경하세요."
      >
        <Select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="w-44"
        >
          <option value="all">모든 프로젝트</option>
          <option value="none">미분류</option>
          {state.projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Button onClick={() => openCreate()}>
          <Plus /> 새 작업
        </Button>
      </PageHeader>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-3">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columns[status]}
            projectById={projectById}
          />
        ))}
      </div>
    </div>
  )
}
