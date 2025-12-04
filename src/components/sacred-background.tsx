"use client"

export const SacredBackground = () => {
  return (
    <>
      {/* SVG Sacred Geometry Pattern */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        style={{ filter: 'blur(2px)' }}
      >
        <defs>
          {/* Gradient Definitions */}
          <radialGradient id="goldGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cyanGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Central Circle with Glow */}
        <circle cx="50%" cy="50%" r="150" fill="url(#goldGradient)" opacity="0.3">
          <animate attributeName="r" values="150;180;150" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Outer Ring */}
        <circle 
          cx="50%" 
          cy="50%" 
          r="300" 
          fill="none" 
          stroke="url(#goldGradient)" 
          strokeWidth="3"
          strokeDasharray="20 10"
          opacity="0.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 960 540"
            to="360 960 540"
            dur="60s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Sacred Triangle */}
        <polygon 
          points="960,300 1200,700 720,700" 
          fill="none" 
          stroke="url(#cyanGradient)" 
          strokeWidth="4"
          opacity="0.5"
        >
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
        </polygon>

        {/* Inner Triangle (inverted) */}
        <polygon 
          points="960,650 1100,450 820,450" 
          fill="none" 
          stroke="url(#goldGradient)" 
          strokeWidth="3"
          opacity="0.4"
        />

        {/* Runic Circles - positioned around center */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const radius = 250
          const x = 960 + radius * Math.cos((angle * Math.PI) / 180)
          const y = 540 + radius * Math.sin((angle * Math.PI) / 180)
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="15" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.4">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r="8" fill="#22c55e" opacity="0.3" />
            </g>
          )
        })}

        {/* Lightning Effect Lines */}
        <path 
          d="M 960 100 L 980 300 L 940 300 L 960 540" 
          stroke="#0ea5e9" 
          strokeWidth="2" 
          fill="none" 
          opacity="0"
        >
          <animate attributeName="opacity" values="0;1;0" dur="0.3s" begin="0s" repeatCount="indefinite" />
        </path>
        <path 
          d="M 1200 300 L 1000 500 L 1050 500 L 900 700" 
          stroke="#0ea5e9" 
          strokeWidth="2" 
          fill="none" 
          opacity="0"
        >
          <animate attributeName="opacity" values="0;1;0" dur="0.3s" begin="1s" repeatCount="indefinite" />
        </path>

        {/* Horizontal Runic Lines */}
        {[200, 350, 500, 650, 800].map((y, i) => (
          <line 
            key={i}
            x1="0" 
            y1={y} 
            x2="1920" 
            y2={y} 
            stroke="#22c55e" 
            strokeWidth="1" 
            strokeDasharray="10 20"
            opacity="0.1"
          />
        ))}

        {/* Wing-like Arcs */}
        <path 
          d="M 660 540 Q 760 300, 960 400" 
          stroke="url(#wingGradient)" 
          strokeWidth="3" 
          fill="none" 
          opacity="0.3"
        >
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
        </path>
        <path 
          d="M 1260 540 Q 1160 300, 960 400" 
          stroke="url(#wingGradient)" 
          strokeWidth="3" 
          fill="none" 
          opacity="0.3"
        >
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" begin="2s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Particle Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 3 + 'px',
              height: Math.random() * 6 + 3 + 'px',
              background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#0ea5e9' : '#22c55e',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `pulse-glow ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
              filter: 'blur(2px)',
              boxShadow: `0 0 20px currentColor`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>
    </>
  )
}

