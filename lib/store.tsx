"use client"

import * as React from "react"

import { SEED_STATE } from "./seed"
import type { AppState, Project, Status, Task } from "./types"

const STORAGE_KEY = "taskflow.state.v1"

// ───────────────────────── 액션 정의 ─────────────────────────

type Action =
  | { type: "hydrate"; state: AppState }
  | { type: "addTask"; task: Task }
  | { type: "updateTask"; id: string; patch: Partial<Task> }
  | { type: "deleteTask"; id: string }
  | { type: "moveTask"; id: string; status: Status; order: number }
  | { type: "addProject"; project: Project }
  | { type: "updateProject"; id: string; patch: Partial<Project> }
  | { type: "deleteProject"; id: string }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return action.state

    case "addTask":
      return { ...state, tasks: [...state.tasks, action.task] }

    case "updateTask":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? applyTaskPatch(t, action.patch) : t
        ),
      }

    case "deleteTask":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }

    case "moveTask": {
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? applyTaskPatch(t, { status: action.status, order: action.order })
            : t
        ),
      }
    }

    case "addProject":
      return { ...state, projects: [...state.projects, action.project] }

    case "updateProject":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, ...action.patch } : p
        ),
      }

    case "deleteProject":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.id),
        // 프로젝트 삭제 시 소속 작업은 미분류로 이동
        tasks: state.tasks.map((t) =>
          t.projectId === action.id ? { ...t, projectId: null } : t
        ),
      }

    default:
      return state
  }
}

// 상태 변경 시 completedAt 자동 관리
function applyTaskPatch(task: Task, patch: Partial<Task>): Task {
  const next = { ...task, ...patch }
  if (patch.status && patch.status !== task.status) {
    if (patch.status === "done" && !next.completedAt) {
      next.completedAt = new Date().toISOString()
    } else if (patch.status !== "done") {
      next.completedAt = null
    }
  }
  return next
}

// ───────────────────────── Context ─────────────────────────

interface StoreContextValue {
  state: AppState
  ready: boolean
  dispatch: React.Dispatch<Action>
  // 편의 액션
  addTask: (input: NewTaskInput) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, status: Status, order: number) => void
  addProject: (input: { name: string; description: string; color: string }) => void
  updateProject: (id: string, patch: Partial<Project>) => void
  deleteProject: (id: string) => void
  resetDemo: () => void
}

export interface NewTaskInput {
  title: string
  description: string
  status: Status
  priority: Task["priority"]
  projectId: string | null
  dueDate: string | null
  tags: string[]
  estimatedHours: number | null
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, SEED_STATE)
  const [ready, setReady] = React.useState(false)

  // 최초 마운트 시 localStorage에서 복원
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AppState
        if (parsed && Array.isArray(parsed.tasks) && Array.isArray(parsed.projects)) {
          dispatch({ type: "hydrate", state: parsed })
        }
      }
    } catch {
      // 손상된 데이터는 무시하고 시드 유지
    }
    setReady(true)
  }, [])

  // 상태 변경 시 저장 (복원 완료 후에만)
  React.useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // 저장 실패는 조용히 무시
    }
  }, [state, ready])

  const value = React.useMemo<StoreContextValue>(() => {
    const nextOrder = (status: Status) => {
      const inStatus = state.tasks.filter((t) => t.status === status)
      return inStatus.length
        ? Math.max(...inStatus.map((t) => t.order)) + 1
        : 0
    }

    return {
      state,
      ready,
      dispatch,
      addTask: (input) =>
        dispatch({
          type: "addTask",
          task: {
            id: uid(),
            ...input,
            createdAt: new Date().toISOString(),
            completedAt: input.status === "done" ? new Date().toISOString() : null,
            order: nextOrder(input.status),
          },
        }),
      updateTask: (id, patch) => dispatch({ type: "updateTask", id, patch }),
      deleteTask: (id) => dispatch({ type: "deleteTask", id }),
      moveTask: (id, status, order) =>
        dispatch({ type: "moveTask", id, status, order }),
      addProject: (input) =>
        dispatch({
          type: "addProject",
          project: { id: uid(), ...input, createdAt: new Date().toISOString() },
        }),
      updateProject: (id, patch) =>
        dispatch({ type: "updateProject", id, patch }),
      deleteProject: (id) => dispatch({ type: "deleteProject", id }),
      resetDemo: () => {
        window.localStorage.removeItem(STORAGE_KEY)
        dispatch({ type: "hydrate", state: SEED_STATE })
      },
    }
  }, [state, ready])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = React.useContext(StoreContext)
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return ctx
}
