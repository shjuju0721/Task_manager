"use client"

import * as React from "react"
import {
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  Timer,
  TrendingUp,
} from "lucide-react"

import { ActivityChart } from "@/components/charts/activity-chart"
import { BarList } from "@/components/charts/bar-list"
import { DonutChart } from "@/components/charts/donut-chart"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { TaskCard } from "@/components/task-card"
import { useTaskDialog } from "@/components/task-dialog-provider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { isOverdue } from "@/lib/date"
import { computeStats, focusTasks } from "@/lib/stats"
import { useStore } from "@/lib/store"
import { PRIORITY_META, STATUS_META } from "@/lib/types"
import { DashboardSkeleton } from "@/components/skeletons"

export default function DashboardPage() {
  const { state, ready } = useStore()
  const { openEdit } = useTaskDialog()

  const stats = React.useMemo(() => computeStats(state), [state])
  const focus = React.useMemo(() => focusTasks(state.tasks), [state.tasks])
  const overdueTasks = React.useMemo(
    () =>
      state.tasks.filter((t) => isOverdue(t.dueDate, t.status === "done")),
    [state.tasks]
  )

  const projectById = React.useMemo(
    () => new Map(state.projects.map((p) => [p.id, p])),
    [state.projects]
  )

  if (!ready) return <DashboardSkeleton />

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="대시보드"
        description="작업 현황을 한눈에 파악하고 오늘 집중할 일을 확인하세요."
      />

      {/* 핵심 지표 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="전체 작업"
          value={stats.total}
          icon={ListTodo}
          hint={`진행 중 ${stats.inProgress}`}
        />
        <StatCard
          label="완료율"
          value={`${stats.completionRate}%`}
          icon={TrendingUp}
          hint={`완료 ${stats.done}건`}
          tone="success"
        />
        <StatCard
          label="마감 임박"
          value={stats.dueSoon}
          icon={Timer}
          hint="3일 이내"
          accent="#f59e0b"
        />
        <StatCard
          label="지연"
          value={stats.overdue}
          icon={AlertTriangle}
          hint="마감 초과"
          tone={stats.overdue > 0 ? "danger" : "default"}
          accent={stats.overdue > 0 ? "#ef4444" : undefined}
        />
      </div>

      {/* 차트 행 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>상태 분포</CardTitle>
            <CardDescription>작업 진행 단계별 비율</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-2">
            <DonutChart
              centerValue={`${stats.completionRate}%`}
              centerLabel="완료"
              segments={[
                {
                  label: STATUS_META.todo.label,
                  value: stats.byStatus.todo,
                  color: "#94a3b8",
                },
                {
                  label: STATUS_META.in_progress.label,
                  value: stats.byStatus.in_progress,
                  color: "#3b82f6",
                },
                {
                  label: STATUS_META.done.label,
                  value: stats.byStatus.done,
                  color: "#10b981",
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>우선순위 분포</CardTitle>
            <CardDescription>우선순위별 작업 수</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <BarList
              items={stats.byPriority.map((p) => ({
                label: PRIORITY_META[p.priority].label,
                value: p.count,
                color: PRIORITY_META[p.priority].color,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 7일 활동</CardTitle>
            <CardDescription>
              이번 주 완료 {stats.completedThisWeek}건
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ActivityChart data={stats.weekly} />
          </CardContent>
        </Card>
      </div>

      {/* 하단 행 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* 집중할 작업 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>오늘 집중할 작업</CardTitle>
            <CardDescription>
              우선순위와 마감일을 반영해 자동 정렬됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {focus.length === 0 ? (
              <EmptyHint text="모든 작업을 완료했어요! 🎉" />
            ) : (
              focus.map((task) => (
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
              ))
            )}
          </CardContent>
        </Card>

        {/* 프로젝트 진행률 */}
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 진행률</CardTitle>
            <CardDescription>프로젝트별 완료 비율</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {stats.projectProgress.length === 0 ? (
              <EmptyHint text="프로젝트가 없습니다." />
            ) : (
              stats.projectProgress.map((pp) => (
                <div key={pp.project?.id ?? "none"}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: pp.project?.color ?? "#94a3b8",
                        }}
                      />
                      <span className="truncate font-medium">
                        {pp.project?.name ?? "미분류"}
                      </span>
                    </span>
                    <span className="text-muted-foreground shrink-0 tabular-nums">
                      {pp.done}/{pp.total}
                    </span>
                  </div>
                  <Progress
                    value={pp.rate}
                    indicatorColor={pp.project?.color ?? "#94a3b8"}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 지연된 작업 경고 */}
      {overdueTasks.length > 0 && (
        <Card className="mt-4 border-red-500/30 bg-red-500/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="size-4" />
              지연된 작업 {overdueTasks.length}건
            </CardTitle>
            <CardDescription>
              마감일이 지난 작업입니다. 우선 처리하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {overdueTasks.map((task) => (
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="text-muted-foreground py-6 text-center text-sm">{text}</p>
  )
}
