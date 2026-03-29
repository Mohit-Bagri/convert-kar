"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  className?: string
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
  disabled?: boolean
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(
    value ?? defaultValue ?? [min]
  )
  const trackRef = React.useRef<HTMLDivElement>(null)
  const draggingIndex = React.useRef<number | null>(null)

  const currentValue = value ?? internalValue

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100

  const getValueFromPosition = (clientX: number) => {
    const track = trackRef.current
    if (!track) return min
    const rect = track.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const raw = min + percent * (max - min)
    const stepped = Math.round(raw / step) * step
    return Math.max(min, Math.min(max, stepped))
  }

  const updateValue = React.useCallback(
    (newVal: number[]) => {
      setInternalValue(newVal)
      onValueChange?.(newVal)
    },
    [onValueChange]
  )

  React.useEffect(() => {
    if (value) setInternalValue(value)
  }, [value])

  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    if (disabled) return
    e.preventDefault()
    draggingIndex.current = index
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIndex.current === null || disabled) return
    const newVal = getValueFromPosition(e.clientX)
    const updated = [...currentValue]
    updated[draggingIndex.current] = newVal

    // For range sliders, prevent thumbs from crossing
    if (updated.length === 2) {
      if (draggingIndex.current === 0 && updated[0] > updated[1]) updated[0] = updated[1]
      if (draggingIndex.current === 1 && updated[1] < updated[0]) updated[1] = updated[0]
    }

    updateValue(updated)
  }

  const handlePointerUp = () => {
    draggingIndex.current = null
  }

  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled) return
    const clickVal = getValueFromPosition(e.clientX)

    if (currentValue.length === 1) {
      updateValue([clickVal])
    } else {
      // Find closest thumb
      const distances = currentValue.map((v) => Math.abs(v - clickVal))
      const closestIndex = distances[0] <= distances[1] ? 0 : 1
      const updated = [...currentValue]
      updated[closestIndex] = clickVal
      updateValue(updated)
    }
  }

  const rangeStart = currentValue.length === 2 ? getPercent(currentValue[0]) : 0
  const rangeEnd = currentValue.length === 2 ? getPercent(currentValue[1]) : getPercent(currentValue[0])

  return (
    <div
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      data-slot="slider"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        ref={trackRef}
        data-slot="slider-track"
        className="relative h-1.5 w-full rounded-full bg-muted cursor-pointer"
        onClick={handleTrackClick}
      >
        <div
          data-slot="slider-range"
          className="absolute h-full rounded-full bg-primary"
          style={{
            left: `${rangeStart}%`,
            width: `${rangeEnd - rangeStart}%`,
          }}
        />
      </div>
      {currentValue.map((val, index) => (
        <div
          key={index}
          data-slot="slider-thumb"
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          className="absolute block size-4 shrink-0 rounded-full border-2 border-primary bg-background ring-ring/50 transition-shadow select-none cursor-grab hover:ring-2 focus-visible:ring-2 focus-visible:outline-hidden active:cursor-grabbing active:ring-2"
          style={{
            left: `calc(${getPercent(val)}% - 8px)`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          onPointerDown={handlePointerDown(index)}
        />
      ))}
    </div>
  )
}

export { Slider }
