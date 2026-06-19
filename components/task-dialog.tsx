"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useStore, type NewTaskInput } from "@/lib/store"
import {
  PRIORITY_ORDER,
  PRIORITY_META,
  STATUS_ORDER,
  STATUS_META,
  type Status,
  type Task,
} from "@/lib/types"

interface TaskDialogProps {
  open: boolean
  onClose: () => void
  task?: Task | null // 있으면 편집, 없으면 생성
  defaultStatus?: Status
  defaultProjectId?: string | null
}

const empty = (status: Status, projectId: string | null): NewTaskInput => ({
  title: "",
  description: "",
  status,
  priority: "medium",
  projectId,
  dueDate: null,
  tags: [],
  estimatedHours: null,
})

export function TaskDialog({
  open,
  onClose,
  task,
  defaultStatus = "todo",
  defaultProjectId = null,
}: TaskDialogProps) {
  const { state, addTask, updateTask, deleteTask } = useStore()
  const [form, setForm] = React.useState<NewTaskInput>(
    empty(defaultStatus, defaultProjectId)
  )
  const [tagsText, setTagsText] = React.useState("")

  // 다이얼로그가 열릴 때 폼 초기화
  React.useEffect(() => {
    if (!open) return
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        dueDate: task.dueDate,
        tags: task.tags,
        estimatedHours: task.estimatedHours,
      })
      setTagsText(task.tags.join(", "))
    } else {
      setForm(empty(defaultStatus, defaultProjectId))
      setTagsText("")
    }
  }, [open, task, defaultStatus, defaultProjectId])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    const payload = { ...form, title: form.title.trim(), tags }
    if (task) {
      updateTask(task.id, payload)
    } else {
      addTask(payload)
    }
    onClose()
  }

  function set<K extends keyof NewTaskInput>(key: K, value: NewTaskInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "작업 편집" : "새 작업"}
      description={
        task ? "작업 내용을 수정합니다." : "관리할 새 작업을 추가합니다."
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="title">
            제목 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            autoFocus
            placeholder="무엇을 해야 하나요?"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="desc">설명</Label>
          <Textarea
            id="desc"
            placeholder="세부 내용, 메모 등"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>상태</Label>
            <Select
              value={form.status}
              onChange={(e) => set("status", e.target.value as Status)}
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>우선순위</Label>
            <Select
              value={form.priority}
              onChange={(e) =>
                set("priority", e.target.value as NewTaskInput["priority"])
              }
            >
              {PRIORITY_ORDER.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_META[p].label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>프로젝트</Label>
            <Select
              value={form.projectId ?? ""}
              onChange={(e) => set("projectId", e.target.value || null)}
            >
              <option value="">미분류</option>
              {state.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="due">마감일</Label>
            <Input
              id="due"
              type="date"
              value={form.dueDate ?? ""}
              onChange={(e) => set("dueDate", e.target.value || null)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tags">태그</Label>
            <Input
              id="tags"
              placeholder="쉼표로 구분 (예: 개발, 긴급)"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hours">예상 소요(시간)</Label>
            <Input
              id="hours"
              type="number"
              min={0}
              step={0.5}
              placeholder="예: 3"
              value={form.estimatedHours ?? ""}
              onChange={(e) =>
                set(
                  "estimatedHours",
                  e.target.value ? Number(e.target.value) : null
                )
              }
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          {task ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                deleteTask(task.id)
                onClose()
              }}
            >
              <Trash2 /> 삭제
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">{task ? "저장" : "추가"}</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
