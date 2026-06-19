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

export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"]

export function weekdayLabel(dateISO: string): string {
  const d = new Date(dateISO + "T00:00:00")
  return WEEKDAYS[d.getDay()]
}

/** Date → 로컬 기준 YYYY-MM-DD (타임존 오프셋 영향 없음) */
export function isoLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** 해당 월을 채우는 42칸(6주) 달력의 날짜 ISO 배열 (일요일 시작) */
export function monthGrid(year: number, month: number): string[] {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  const cells: string[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    cells.push(isoLocal(d))
  }
  return cells
}

export function formatYearMonth(year: number, month: number): string {
  return `${year}년 ${month + 1}월`
}

export function monthOf(dateISO: string): number {
  return Number(dateISO.slice(5, 7)) - 1
}
