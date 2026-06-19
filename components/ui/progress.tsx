import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<"div"> {
  value: number // 0~100
  indicatorColor?: string
}

function Progress({
  value,
  indicatorColor,
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      data-slot="progress"
      className={cn(
        "bg-muted relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${clamped}%`,
          backgroundColor: indicatorColor ?? "var(--primary)",
        }}
      />
    </div>
  )
}

export { Progress }
