// 작업 관리 도메인 타입 정의

export type Status = "todo" | "in_progress" | "done"
export type Priority = "urgent" | "high" | "medium" | "low"

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  projectId: string | null
  dueDate: string | null // ISO date string (YYYY-MM-DD)
  tags: string[]
  estimatedHours: number | null
  createdAt: string // ISO datetime
  completedAt: string | null // ISO datetime
  order: number // 같은 컬럼/상태 내 정렬 순서
}

export interface Project {
  id: string
  name: string
  description: string
  color: string // oklch / hex 색상값
  createdAt: string
}

export interface AppState {
  tasks: Task[]
  projects: Project[]
}

// ───────────────────────── 표시용 메타데이터 ─────────────────────────

export const STATUS_META: Record<
  Status,
  { label: string; color: string; dot: string }
> = {
  todo: { label: "할 일", color: "var(--chart-3)", dot: "bg-slate-400" },
  in_progress: {
    label: "진행 중",
    color: "var(--chart-2)",
    dot: "bg-blue-500",
  },
  done: { label: "완료", color: "var(--chart-1)", dot: "bg-emerald-500" },
}

export const STATUS_ORDER: Status[] = ["todo", "in_progress", "done"]

export const PRIORITY_META: Record<
  Priority,
  { label: string; weight: number; className: string; color: string }
> = {
  urgent: {
    label: "긴급",
    weight: 4,
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    color: "#ef4444",
  },
  high: {
    label: "높음",
    weight: 3,
    className:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    color: "#f97316",
  },
  medium: {
    label: "보통",
    weight: 2,
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    color: "#f59e0b",
  },
  low: {
    label: "낮음",
    weight: 1,
    className:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    color: "#94a3b8",
  },
}

export const PRIORITY_ORDER: Priority[] = ["urgent", "high", "medium", "low"]

export const PROJECT_COLORS = [
  "#6366f1", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#14b8a6", // teal
]
