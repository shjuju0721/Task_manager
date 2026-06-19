"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}

function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div
        className="animate-in fade-in fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "bg-card text-card-foreground animate-in fade-in zoom-in-95 relative z-10 my-8 w-full max-w-lg rounded-2xl border p-6 shadow-2xl",
          className
        )}
      >
        {(title || description) && (
          <div className="mb-4 pr-8">
            {title && (
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground mt-1 text-sm">{description}</p>
            )}
          </div>
        )}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-4 right-4 inline-flex size-7 items-center justify-center rounded-md transition-colors"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

export { Modal }
