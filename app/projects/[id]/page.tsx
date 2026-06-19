"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, FolderKanban, Pencil, Plus } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { ProjectDialog } from "@/components/project-dialog"
import { ListSkeleton } from "@/components/skeletons"
import { TaskCard } from "@/components/task-card"
import { useTaskDialog } from "@/components/task-dialog-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/lib/store"
import { STATUS_META, STATUS_ORDER } from "@/lib/types"

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { state, ready } = useStore()
  const { openCreate, openEdit } = useTaskDialog()
  const [editOpen, setEditOpen] = React.useState(false)

  const project = React.useMemo(
    () => state.projects.find((p) => p.id === id) ?? null,
    [state.projects, id]
  )

  const tasks = React.useMemo(
    () => state.tasks.filter((t) => t.projectId === id),
    [state.tasks, id]
  )

  const grouped = React.useMemo(
    () =>
      STATUS_ORDER.map((status) => ({
        status,
        items: tasks
          .filter((t) => t.status === status)
          .sort((a, b) => a.order - b.order),
      })),
    [tasks]
  )

  if (!ready) return <ListSkeleton />

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
        <BackLink />
        <div className="text-muted-foreground mt-8 rounded-xl border border-dashed py-16 text-center text-sm">
          프로젝트를 찾을 수 없습니다.
        </div>
      </div>
    )
  }

  const done = tasks.filter((t) => t.status === "done").length
  const inProgress = tasks.filter((t) => t.status === "in_progress").length
  const rate = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <BackLink />

      {/* 프로젝트 헤더 */}
      <Card className="mt-3 gap-4">
        <div className="flex items-start gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${project.color}1a` }}
          >
            <FolderKanban className="size-6" style={{ color: project.color }} />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-muted-foreground mt-0.5 text-sm">
                {project.description}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            <Pencil /> 편집
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="전체" value={tasks.length} />
          <Stat label="진행 중" value={inProgress} />
          <Stat label="완료" value={done} />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">진행률</span>
            <span className="font-medium tabular-nums">{rate}%</span>
          </div>
          <Progress value={rate} indicatorColor={project.color} />
        </div>
      </Card>

      {/* 할 일 목록 (상태별) */}
      <div className="mt-10">
        <PageHeader title="할 일" description={`${tasks.length}개의 작업`}>
          <Button onClick={() => openCreate({ projectId: project.id })}>
            <Plus /> 작업 추가
          </Button>
        </PageHeader>
      </div>

      {tasks.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed py-16 text-center text-sm">
          이 프로젝트에는 아직 작업이 없습니다.
          <br />
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => openCreate({ projectId: project.id })}
          >
            <Plus /> 첫 작업 추가
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(({ status, items }) => (
            <section key={status}>
              <div className="mb-2 flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${STATUS_META[status].dot}`} />
                <h2 className="text-sm font-semibold">
                  {STATUS_META[status].label}
                </h2>
                <span className="text-muted-foreground bg-muted rounded-md px-1.5 text-xs font-medium tabular-nums">
                  {items.length}
                </span>
              </div>
              {items.length === 0 ? (
                <p className="text-muted-foreground rounded-lg border border-dashed px-3 py-4 text-xs">
                  해당 상태의 작업이 없습니다.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {items.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      project={project}
                      onEdit={openEdit}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      <ProjectDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        project={project}
      />
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/projects"
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
    >
      <ArrowLeft className="size-4" /> 프로젝트 목록
    </Link>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  )
}
