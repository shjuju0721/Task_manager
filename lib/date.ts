// 날짜 유틸리티 (한국어 표기)

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** 두 날짜(YYYY-MM-DD) 사이의 일수 차이. 미래면 양수, 과거면 음수. */
export function daysUntil(dateISO: string | null): number | null {
  if (!dateISO) return null
  const today = startOfDay(new Date())
  const target = startOfDay(new Date(dateISO + "T00:00:00"))
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

export function isOverdue(dateISO: string | null, done: boolean): boolean {
  if (!dateISO || done) return false
  const d = daysUntil(dateISO)
  return d !== null && d < 0
}

/** 마감일 상대 표기: "오늘 마감", "3일 남음", "2일 지남" */
export function formatDueRelative(dateISO: string | null): string | null {
  const d = daysUntil(dateISO)
  if (d === null) return null
  if (d === 0) return "오늘 마감"
  if (d === 1) return "내일 마감"
  if (d === -1) return "어제 마감"
  if (d > 0) return `${d}일 남음`
  return `${Math.abs(d)}일 지남`
}

export function formatDate(dateISO: string | null): string {
  if (!dateISO) return "—"
  const d = new Date(dateISO + (dateISO.length === 10 ? "T00:00:00" : ""))
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

/** 최근 N일의 날짜 ISO 배열 (오래된 → 최근 순) */
export function lastNDays(n: number): string[] {
  const out: string[] = []
  const today = startOfDay(new Date())
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"]

export function weekdayLabel(dateISO: string): string {
  const d = new Date(dateISO + "T00:00:00")
  return WEEKDAY[d.getDay()]
}
