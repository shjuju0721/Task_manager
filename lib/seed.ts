import type { AppState, Project, Task } from "./types"

// 초기 예시 데이터: 처음 실행 시 데모 용도로 채워짐

function dayOffset(n: number): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function datetimeOffset(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

const projects: Project[] = [
  {
    id: "p1",
    name: "포트폴리오 웹사이트",
    description: "개인 포트폴리오 사이트 리뉴얼",
    color: "#6366f1",
    createdAt: datetimeOffset(-30),
  },
  {
    id: "p2",
    name: "건강 관리",
    description: "운동·식단·수면 루틴 만들기",
    color: "#10b981",
    createdAt: datetimeOffset(-20),
  },
  {
    id: "p3",
    name: "사이드 프로젝트",
    description: "작업 관리 앱 개발",
    color: "#f59e0b",
    createdAt: datetimeOffset(-14),
  },
]

const tasks: Task[] = [
  {
    id: "t1",
    title: "디자인 시안 확정",
    description: "메인/소개/프로젝트 페이지 와이어프레임 검토 후 확정",
    status: "done",
    priority: "high",
    projectId: "p1",
    dueDate: dayOffset(-5),
    tags: ["디자인"],
    estimatedHours: 6,
    createdAt: datetimeOffset(-12),
    completedAt: datetimeOffset(-4),
    order: 0,
  },
  {
    id: "t2",
    title: "랜딩 페이지 마크업",
    description: "Hero 섹션과 반응형 레이아웃 구현",
    status: "in_progress",
    priority: "high",
    projectId: "p1",
    dueDate: dayOffset(2),
    tags: ["개발", "프론트엔드"],
    estimatedHours: 8,
    createdAt: datetimeOffset(-6),
    completedAt: null,
    order: 0,
  },
  {
    id: "t3",
    title: "프로젝트 상세 콘텐츠 작성",
    description: "지난 작업 3건 케이스 스터디 글 작성",
    status: "todo",
    priority: "medium",
    projectId: "p1",
    dueDate: dayOffset(6),
    tags: ["글쓰기"],
    estimatedHours: 5,
    createdAt: datetimeOffset(-3),
    completedAt: null,
    order: 0,
  },
  {
    id: "t4",
    title: "주 3회 러닝 루틴 시작",
    description: "월·수·금 아침 30분 달리기",
    status: "in_progress",
    priority: "medium",
    projectId: "p2",
    dueDate: null,
    tags: ["운동", "루틴"],
    estimatedHours: null,
    createdAt: datetimeOffset(-15),
    completedAt: null,
    order: 1,
  },
  {
    id: "t5",
    title: "식단 기록 앱 설정",
    description: "하루 칼로리·단백질 목표 설정하기",
    status: "todo",
    priority: "low",
    projectId: "p2",
    dueDate: dayOffset(3),
    tags: ["식단"],
    estimatedHours: 1,
    createdAt: datetimeOffset(-10),
    completedAt: null,
    order: 1,
  },
  {
    id: "t6",
    title: "데이터 모델 설계",
    description: "작업/프로젝트 스키마와 상태 흐름 정의",
    status: "done",
    priority: "urgent",
    projectId: "p3",
    dueDate: dayOffset(-2),
    tags: ["설계"],
    estimatedHours: 3,
    createdAt: datetimeOffset(-8),
    completedAt: datetimeOffset(-2),
    order: 1,
  },
  {
    id: "t7",
    title: "대시보드 차트 구현",
    description: "상태/우선순위 분포 및 진행률 시각화",
    status: "in_progress",
    priority: "urgent",
    projectId: "p3",
    dueDate: dayOffset(1),
    tags: ["개발", "차트"],
    estimatedHours: 6,
    createdAt: datetimeOffset(-4),
    completedAt: null,
    order: 2,
  },
  {
    id: "t8",
    title: "칸반 드래그 앤 드롭",
    description: "보드에서 카드 이동으로 상태 변경",
    status: "todo",
    priority: "high",
    projectId: "p3",
    dueDate: dayOffset(-1),
    tags: ["개발"],
    estimatedHours: 4,
    createdAt: datetimeOffset(-2),
    completedAt: null,
    order: 2,
  },
  {
    id: "t9",
    title: "이력서 PDF 업데이트",
    description: "최근 경력 반영 및 디자인 정리",
    status: "todo",
    priority: "medium",
    projectId: null,
    dueDate: dayOffset(8),
    tags: ["문서"],
    estimatedHours: 2,
    createdAt: datetimeOffset(-1),
    completedAt: null,
    order: 3,
  },
  {
    id: "t10",
    title: "도메인 연결 및 배포",
    description: "Vercel 배포 후 커스텀 도메인 연결",
    status: "todo",
    priority: "low",
    projectId: "p1",
    dueDate: dayOffset(10),
    tags: ["배포"],
    estimatedHours: 2,
    createdAt: datetimeOffset(-1),
    completedAt: null,
    order: 4,
  },
]

export const SEED_STATE: AppState = { projects, tasks }
