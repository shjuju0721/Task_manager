"use client"

export interface BarItem {
  label: string
  value: number
  color: string
}

/** 가로 막대 차트 (우선순위 분포 등) */
export function BarList({ items }: { items: BarItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground w-12 shrink-0">{item.label}</span>
          <div className="bg-muted relative h-6 flex-1 overflow-hidden rounded-md">
            <div
              className="flex h-full items-center justify-end rounded-md px-2 transition-all duration-500"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
                minWidth: item.value > 0 ? "1.5rem" : 0,
              }}
            >
              {item.value > 0 && (
                <span className="text-xs font-semibold text-white tabular-nums">
                  {item.value}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
