# TaskFlow — 개인 작업 관리

칸반·우선순위·마감일 등 **프로젝트 관리 기법**을 적용한 개인 작업 관리 앱과 대시보드입니다.
Next.js 16(App Router) · React 19 · Tailwind v4 로 구현했으며, 데이터는 브라우저
`localStorage`에 저장되어 별도 백엔드 없이 바로 실행됩니다.

## 실행

```bash
pnpm install   # 최초 1회
pnpm dev       # http://localhost:3000
```

기타 스크립트: `pnpm build`(프로덕션 빌드), `pnpm typecheck`, `pnpm lint`.

## 적용한 프로젝트 관리 기법

- **칸반 보드** — 할 일 / 진행 중 / 완료 3단계 워크플로. 카드를 끌어다 놓아 상태 변경.
- **우선순위** — 긴급·높음·보통·낮음 4단계로 분류하고 색상으로 구분.
- **마감일 관리** — 마감 임박(3일 이내)·지연 작업 자동 감지 및 강조.
- **프로젝트별 그룹핑** — 작업을 프로젝트로 묶고 색상·진행률로 추적.
- **태그 / 예상 소요 시간** — 작업을 분류하고 공수를 가늠.
- **자동 집중 정렬** — 우선순위 가중치 + 마감 임박도를 점수화해 "오늘 집중할 작업"을 추천.

## 화면

| 경로         | 설명                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| `/`          | **대시보드** — 핵심 지표, 상태/우선순위 분포, 7일 활동, 진행률, 지연 경고 |
| `/board`     | **칸반 보드** — 드래그 앤 드롭으로 상태 전환, 프로젝트 필터               |
| `/tasks`     | **작업 목록** — 검색·상태/우선순위/프로젝트 필터·정렬                     |
| `/projects`  | **프로젝트** — 프로젝트 생성/편집 및 진행률 카드                          |

## 구조

```
app/
  layout.tsx          루트 레이아웃 (Provider + 사이드바)
  page.tsx            대시보드
  board/  tasks/  projects/   각 페이지
components/
  ui/                 Card, Badge, Input, Select, Modal, Progress 등 기본 UI
  charts/             DonutChart, BarList, ActivityChart (의존성 없는 SVG/CSS 차트)
  task-card · task-dialog · kanban-column · project-dialog · app-sidebar ...
lib/
  types.ts            도메인 타입 + 표시 메타데이터
  store.tsx           Context + reducer + localStorage 영속화
  stats.ts            대시보드 통계/집중 작업 계산
  date.ts             날짜 유틸 (마감 상대표기 등)
  seed.ts             최초 실행용 예시 데이터
```

## 데이터

모든 데이터는 `localStorage`의 `taskflow.state.v1` 키에 저장됩니다.
프로젝트 화면의 **예시 초기화** 버튼으로 초기 데모 데이터로 되돌릴 수 있습니다.
