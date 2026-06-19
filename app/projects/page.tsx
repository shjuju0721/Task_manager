"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  FolderKanban,
  Pencil,
  Plus,
  RotateCcw,
} from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { ProjectDialog } from "@/components/project-dialog"
import { ListSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { computeStats } from "@/lib/stats"
import { useStore } from "@/lib/store"
import type { Project } from "@/lib/types"

export default function ProjectsPage() {
  const router = useRouter()
  const { state, ready, resetDemo } = useStore()
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Project | null>(null)

  const stats = React.useMemo(() => computeStats(state), [state])
  const progressById = React.useMemo(
    () => new Map(stats.projectProgress.map((p) => [p.project?.id ?? "none", p])),
    [stats.projectProgress]
  )

  if (!ready) return <ListSkeleton />

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="프로젝트"
        description="프로젝트를 눌러 관련 할 일을 확인하세요."
      >
        <Button
          variant="ghost"
          onClick={() => {
            if (confirm("모든 데이터를 초기 예시로 되돌릴까요?")) resetDemo()
          }}
        >
          <RotateCcw /> 예시 초기화
        </Button>
        <Button
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          <Plus /> 새 프로젝트
        </Button>
      </PageHeader>

      {state.projects.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed py-16 text-center text-sm">
          아직 프로젝트가 없습니다. 새 프로젝트를 추가해 보세요.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {state.projects.map((project) => {
            const pp = progressById.get(project.id)
            return (
              <Card
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="hover:border-primary/40 group cursor-pointer gap-3 transition-colors hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${project.color}1a` }}
                  >
                    <FolderKanban
                      className="size-5"
                      style={{ color: project.color }}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditing(project)
                      setOpen(true)
                    }}
                    aria-label="편집"
                    className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors"
                  >
                    <Pencil className="size-4" />
                  </button>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">진행률</span>
                    <span className="font-medium tabular-nums">
                      {pp?.rate ?? 0}% · {pp?.done ?? 0}/{pp?.total ?? 0}
                    </span>
                  </div>
                  <Progress
                    value={pp?.rate ?? 0}
                    indicatorColor={project.color}
                  />
                </div>

                <div className="text-muted-foreground group-hover:text-primary flex items-center justify-end gap-0.5 text-xs font-medium">
                  할 일 보기
                  <ChevronRight className="size-3.5" />
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <ProjectDialog
        open={open}
        onClose={() => setOpen(false)}
        project={editing}
      />
    </div>
  )
}
