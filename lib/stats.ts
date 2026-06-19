import { isOverdue, lastNDays } from "./date"
import {
  PRIORITY_ORDER,
  type AppState,
  type Priority,
  type Project,
  type Status,
  type Task,
} from "./types"

export interface DashboardStats {
  total: number
  done: number
  inProgress: number
  todo: number
  overdue: number
  dueSoon: number // 오늘 포함 3일 이내 마감(미완료)
  completionRate: number // 0~100
  byStatus: Record<Status, number>
  byPriority: { priority: Priority; count: number }[]
  projectProgress: ProjectProgress[]
  weekly: { date: string; created: number; completed: number }[]
  completedThisWeek: number
}

export interface ProjectProgress {
  project: Project | null // null = 미분류
  total: number
  done: number
  rate: number // 0~100
}

export function computeStats(state: AppState): DashboardStats {
  const { tasks, projects } = state
  const total = tasks.length
  const byStatus: Record<Status, number> = {
    todo: 0,
    in_progress: 0,
    done: 0,
  }
  for (const t of tasks) byStatus[t.status]++

  const overdue = tasks.filter((t) =>
    isOverdue(t.dueDate, t.status === "done")
  ).length

  const dueSoon = tasks.filter((t) => {
    if (t.status === "done" || !t.dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(t.dueDate + "T00:00:00")
    const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000)
    return diff >= 0 && diff <= 3
  }).length

  const completionRate = total === 0 ? 0 : Math.round((byStatus.done / total) * 100)

  const byPriority = PRIORITY_ORDER.map((priority) => ({
    priority,
    count: tasks.filter((t) => t.priority === priority).length,
  }))

  // 프로젝트별 진행률 (미분류 포함)
  const projectProgress: ProjectProgress[] = projects.map((project) => {
    const list = tasks.filter((t) => t.projectId === project.id)
    const done = list.filter((t) => t.status === "done").length
    return {
      project,
      total: list.length,
      done,
      rate: list.length === 0 ? 0 : Math.round((done / list.length) * 100),
    }
  })
  const unassigned = tasks.filter((t) => t.projectId === null)
  if (unassigned.length > 0) {
    const done = unassigned.filter((t) => t.status === "done").length
    projectProgress.push({
      project: null,
      total: unassigned.length,
      done,
      rate: Math.round((done / unassigned.length) * 100),
    })
  }

  // 최근 7일 생성/완료 추이
  const days = lastNDays(7)
  const weekly = days.map((date) => ({
    date,
    created: tasks.filter((t) => t.createdAt.slice(0, 10) === date).length,
    completed: tasks.filter(
      (t) => t.completedAt && t.completedAt.slice(0, 10) === date
    ).length,
  }))
  const completedThisWeek = weekly.reduce((s, d) => s + d.completed, 0)

  return {
    total,
    done: byStatus.done,
    inProgress: byStatus.in_progress,
    todo: byStatus.todo,
    overdue,
    dueSoon,
    completionRate,
    byStatus,
    byPriority,
    projectProgress: projectProgress.sort((a, b) => b.total - a.total),
    weekly,
    completedThisWeek,
  }
}

/** 우선순위 가중치 + 마감 임박도로 정렬한 "지금 집중할 작업" */
export function focusTasks(tasks: Task[], limit = 5): Task[] {
  const weight: Record<Priority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  }
  return tasks
    .filter((t) => t.status !== "done")
    .map((t) => {
      let score = weight[t.priority] * 10
      if (t.dueDate) {
        const due = new Date(t.dueDate + "T00:00:00").getTime()
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const diff = Math.round((due - today.getTime()) / 86_400_000)
        if (diff < 0) score += 50 // 지연
        else if (diff <= 3) score += 20 - diff * 3
      }
      if (t.status === "in_progress") score += 5
      return { t, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.t)
}
