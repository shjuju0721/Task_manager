import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-background flex min-h-[72px] w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
