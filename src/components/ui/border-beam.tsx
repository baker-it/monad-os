"use client"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  anchor?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
  reverse?: boolean
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#22c55e",
  colorTo = "#0ea5e9",
  delay = 0,
  reverse = false,
}: BorderBeamProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0 animate-border-beam"
          style={{
            background: `linear-gradient(90deg, transparent, ${colorFrom}, ${colorTo}, transparent)`,
            width: `${size}px`,
            height: "100%",
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            animationDirection: reverse ? "reverse" : "normal",
            transform: `translateX(-${size}px) rotate(${anchor}deg)`,
            transformOrigin: "0 0",
          }}
        />
      </div>
    </div>
  )
}

