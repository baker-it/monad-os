"use client"

interface RuneStatusProps {
  status: string
  className?: string
}

export const RuneStatus = ({ status, className = "" }: RuneStatusProps) => {
  const getRuneConfig = (status: string) => {
    switch (status) {
      case 'starting':
        return {
          symbol: '◬',
          color: 'text-cyan-400',
          glow: 'text-cyan-400',
          label: 'INITIALIZING'
        }
      case 'working':
        return {
          symbol: '⚡',
          color: 'text-yellow-400',
          glow: 'text-yellow-400',
          label: 'PROCESSING'
        }
      case 'awaiting_approval':
        return {
          symbol: '◈',
          color: 'text-orange-400',
          glow: 'text-orange-400',
          label: 'AWAITING_APPROVAL'
        }
      case 'finished':
        return {
          symbol: '◉',
          color: 'text-green-400',
          glow: 'text-green-400',
          label: 'COMPLETE'
        }
      default:
        return {
          symbol: '○',
          color: 'text-gray-400',
          glow: 'text-gray-400',
          label: 'STANDBY'
        }
    }
  }

  const config = getRuneConfig(status)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span 
        className={`text-2xl ${config.color} animate-[pulse-glow_2s_ease-in-out_infinite]`}
        style={{ 
          filter: 'drop-shadow(0 0 8px currentColor)',
          fontFamily: 'monospace'
        }}
      >
        {config.symbol}
      </span>
      <span className={`text-xs font-bold tracking-wider ${config.color}`}>
        {config.label}
      </span>
    </div>
  )
}

