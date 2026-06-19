"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import { PROJECT_COLORS, type Project } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProjectDialogProps {
  open: boolean
  onClose: () => void
  project?: Project | null
}

export function ProjectDialog({ open, onClose, project }: ProjectDialogProps) {
  const { addProject, updateProject, deleteProject } = useStore()
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [color, setColor] = React.useState(PROJECT_COLORS[0])

  React.useEffect(() => {
    if (!open) return
    if (project) {
      setName(project.name)
      setDescription(project.description)
      setColor(project.color)
    } else {
      setName("")
      setDescription("")
      setColor(PROJECT_COLORS[0])
    }
  }, [open, project])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const payload = { name: name.trim(), description, color }
    if (project) {
      updateProject(project.id, payload)
    } else {
      addProject(payload)
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? "프로젝트 편집" : "새 프로젝트"}
      description="관련 작업을 묶어 진행률을 추적합니다."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="pname">
            이름 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pname"
            autoFocus
            placeholder="프로젝트 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="pdesc">설명</Label>
          <Textarea
            id="pdesc"
            placeholder="프로젝트 목표나 메모"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label>색상</Label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`색상 ${c}`}
                onClick={() => setColor(c)}
                className={cn(
                  "size-7 rounded-full transition-transform",
                  color === c
                    ? "ring-ring ring-offset-background scale-110 ring-2 ring-offset-2"
                    : "hover:scale-110"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          {project ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                deleteProject(project.id)
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
            <Button type="submit">{project ? "저장" : "추가"}</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
