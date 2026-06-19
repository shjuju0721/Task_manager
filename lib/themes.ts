// Cozy 색상 테마 정의 (globals.css 의 [data-theme="id"] 와 일치)

export interface ColorTheme {
  id: string
  label: string // 한국어 이름
  hint: string // 짧은 설명
  swatch: string // 미리보기 색 (라이트 모드 primary)
}

export const COLOR_THEMES: ColorTheme[] = [
  { id: "latte", label: "라떼", hint: "커피·크림", swatch: "oklch(0.505 0.075 70)" },
  {
    id: "terracotta",
    label: "테라코타",
    hint: "점토·벽돌",
    swatch: "oklch(0.585 0.135 42)",
  },
  { id: "sage", label: "세이지", hint: "허브 그린", swatch: "oklch(0.55 0.07 150)" },
  { id: "honey", label: "허니", hint: "황금빛", swatch: "oklch(0.66 0.13 83)" },
  { id: "rose", label: "로즈", hint: "더스티 핑크", swatch: "oklch(0.585 0.105 14)" },
  {
    id: "lavender",
    label: "라벤더",
    hint: "부드러운 보라",
    swatch: "oklch(0.555 0.095 300)",
  },
]

export const DEFAULT_THEME = "latte"
export const THEME_STORAGE_KEY = "taskflow.color"
