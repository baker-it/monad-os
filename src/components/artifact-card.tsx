"use client"

interface ArtifactCardProps {
  type: string
  payload: any
  timestamp?: Date
  className?: string
}

export const ArtifactCard = ({ type, payload, timestamp, className = "" }: ArtifactCardProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INSIGHT': return '◈'
      case 'STRATEGY': return '◬'
      case 'CODE': return '◉'
      case 'MODEL': return '◊'
      default: return '◇'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INSIGHT': return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50'
      case 'STRATEGY': return 'from-purple-500/20 to-pink-500/20 border-purple-500/50'
      case 'CODE': return 'from-green-500/20 to-emerald-500/20 border-green-500/50'
      case 'MODEL': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/50'
    }
  }

  return (
    <div 
      className={`
        relative p-4 rounded-lg border-2 
        bg-gradient-to-br ${getTypeColor(type)}
        backdrop-blur-sm
        transition-all duration-300
        hover:scale-105 hover:shadow-2xl
        ${className}
      `}
      style={{
        boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
      }}
    >
      {/* Corner Decorations */}
      <div className="absolute top-1 left-1 text-xs opacity-50">╔</div>
      <div className="absolute top-1 right-1 text-xs opacity-50">╗</div>
      <div className="absolute bottom-1 left-1 text-xs opacity-50">╚</div>
      <div className="absolute bottom-1 right-1 text-xs opacity-50">╝</div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span 
            className="text-2xl sacred-glow"
            style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
          >
            {getTypeIcon(type)}
          </span>
          <span className="text-sm font-bold tracking-wider">{type}</span>
        </div>
        {timestamp && (
          <span className="text-xs opacity-50">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="text-sm space-y-2 font-mono">
        {Object.entries(payload).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-xs opacity-70 uppercase tracking-wide">{key}:</span>
            <span className="text-green-400 pl-2">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Shimmer Effect */}
      <div 
        className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite',
        }}
      />
    </div>
  )
}

