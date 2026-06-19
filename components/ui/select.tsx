import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

/** 네이티브 select 기반의 가벼운 셀렉트 */
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "border-input bg-background flex h-9 w-full appearance-none rounded-lg border px-3 pr-8 text-sm shadow-sm transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-input/30",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2" />
    </div>
  )
}

export { Select }
