function Block({ className }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-lg ${className ?? ""}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-8">
      <Block className="h-9 w-40" />
      <Block className="mt-2 h-4 w-72" />
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Block key={i} className="h-24" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Block key={i} className="h-56" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Block className="h-72 lg:col-span-2" />
        <Block className="h-72" />
      </div>
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-8">
      <Block className="h-9 w-40" />
      <Block className="mt-2 h-4 w-72" />
      <div className="mt-6 flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Block key={i} className="h-16" />
        ))}
      </div>
    </div>
  )
}

export function BoardSkeleton() {
  return (
    <div className="p-6 lg:p-8">
      <Block className="h-9 w-40" />
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Block key={i} className="h-96" />
        ))}
      </div>
    </div>
  )
}
