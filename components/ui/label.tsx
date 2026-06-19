import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-foreground mb-1.5 flex items-center gap-1 text-xs font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Label }
