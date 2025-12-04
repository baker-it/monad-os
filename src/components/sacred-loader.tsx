"use client"

interface SacredLoaderProps {
  size?: number
  className?: string
}

export const SacredLoader = ({ size = 40, className = "" }: SacredLoaderProps) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Circle */}
      <svg 
        className="absolute inset-0 animate-[rotate-sacred_3s_linear_infinite]"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="70 30"
          opacity="0.3"
        />
      </svg>

      {/* Middle Triangle */}
      <svg 
        className="absolute inset-0 animate-[rotate-sacred_2s_linear_infinite_reverse]"
        viewBox="0 0 100 100"
      >
        <path
          d="M 50 15 L 85 75 L 15 75 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.5"
        />
      </svg>

      {/* Inner Circle */}
      <svg 
        className="absolute inset-0 animate-pulse"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="currentColor"
          opacity="0.2"
        />
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="currentColor"
          opacity="0.8"
        />
      </svg>
    </div>
  )
}

