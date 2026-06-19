"use client"

import * as React from "react"

export interface DonutSegment {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerValue?: string | number
}

export function DonutChart({
  segments,
  size = 160,
  thickness = 22,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  let offset = 0
  const arcs =
    total === 0
      ? []
      : segments
          .filter((s) => s.value > 0)
          .map((seg) => {
            const fraction = seg.value / total
            const dash = fraction * circumference
            const arc = {
              ...seg,
              dasharray: `${dash} ${circumference - dash}`,
              dashoffset: -offset,
            }
            offset += dash
            return arc
          })

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={thickness}
          />
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness}
              strokeDasharray={arc.dasharray}
              strokeDashoffset={arc.dashoffset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        {(centerValue !== undefined || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue !== undefined && (
              <span className="text-2xl font-bold tracking-tight">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-muted-foreground text-xs">{centerLabel}</span>
            )}
          </div>
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-muted-foreground">{seg.label}</span>
            <span className="ml-auto font-semibold tabular-nums">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
