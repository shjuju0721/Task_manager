"use client"

import * as React from "react"
import { Plus, Search } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { ListSkeleton } from "@/components/skeletons"
import { TaskCard } from "@/components/task-card"
import { useTaskDialog } from "@/components/task-dialog-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import {
  PRIORITY_META,
  STATUS_META,
  STATUS_ORDER,
  type Priority,
  type Status,
} from "@/lib/types"

type SortKey = "priority" | "due" | "created"

export default function TasksPage() {
  const { state, ready } = useStore()
  const { openCreate, openEdit } = useTaskDialog()

  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<Status | "all">("all")
  const [priorityFilter, setPriorityFilter] = React.useState<Priority | "all">(
    "all"
  )
  const [projectFilter, setProjectFilter] = React.useState("all")
  const [sort, setSort] = React.useState<SortKey>("priority")

  const projectById = React.useMemo(
    () => new Map(state.projects.map((p) => [p.id, p])),
    [state.projects]
  )

  const tasks = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = state.tasks.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false
      if (projectFilter === "none" && t.projectId !== null) return false
      if (
        projectFilter !== "all" &&
        projectFilter !== "none" &&
        t.projectId !== projectFilter
      )
        return false
      if (q) {
        const hay = (
          t.title +
          " " +
          t.description +
          " " +
          t.tags.join(" ")
        ).toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    const sorted = [...filtered]
    if (sort === "priority") {
      sorted.sort(
        (a, b) =>
          PRIORITY_META[b.priority].weight - PRIORITY_META[a.priority].weight
      )
    } else if (sort === "due") {
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      })
    } else {
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
    return sorted
  }, [state.tasks, query, statusFilter, priorityFilter, projectFilter, sort])

  if (!ready) return <ListSkeleton />

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <PageHeader
        title="작업 목록"
        description={`전체 ${state.tasks.length}건 중 ${tasks.length}건 표시`}
      >
        <Button onClick={() => openCreate()}>
          <Plus /> 새 작업
        </Button>
      </PageHeader>

      {/* 필터 바 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-50 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="제목, 설명, 태그 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
          className="w-32"
        >
          <option value="all">전체 상태</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </Select>
        <Select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as Priority | "all")
          }
          className="w-32"
        >
          <option value="all">전체 우선순위</option>
          {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_META[p].label}
            </option>
          ))}
        </Select>
        <Select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="w-36"
        >
          <option value="all">전체 프로젝트</option>
          <option value="none">미분류</option>
          {state.projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="w-32"
        >
          <option value="priority">우선순위순</option>
          <option value="due">마감일순</option>
          <option value="created">최근 생성순</option>
        </Select>
      </div>

      {/* 목록 */}
      {tasks.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed py-16 text-center text-sm">
          조건에 맞는 작업이 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              project={
                task.projectId
                  ? (projectById.get(task.projectId) ?? null)
                  : null
              }
              onEdit={openEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
