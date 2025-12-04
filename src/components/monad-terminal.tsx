"use client"

import { useState } from "react"
import { client } from "@/lib/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Zap, Activity, CheckCircle } from "lucide-react"
import { SacredLoader } from "./sacred-loader"
import { RuneStatus } from "./rune-status"
import { ArtifactCard } from "./artifact-card"

export const MonadTerminal = () => {
  const [input, setInput] = useState("")
  const [runId, setRunId] = useState<string | null>(null)

  // Start ACP
  const { mutate: injectWill } = useMutation({
    mutationFn: async (intent: string) => {
      const res = await client.acp.start.$post({ intent })
      // JStack client usually returns a Response object in fetch-based environments,
      // but sometimes it parses it automatically.
      
      // If it's already a plain object (no .json method), return it directly.
      if (res && typeof res === 'object' && !('json' in res)) {
        return res
      }
      
      // If it is a Response object, parse it.
      if (res && typeof (res as any).json === 'function') {
         return await (res as any).json()
      }
      
      return res
    },
    onSuccess: (data) => {
      setRunId(data.runId)
    }
  })

  // Poll Status
  const { data: statusData } = useQuery({
    queryKey: ["acp-status", runId],
    queryFn: async () => {
      if (!runId) return null
      const res = await client.acp.status.$get({ id: runId })
      
      if (res && typeof res === 'object' && !('json' in res)) {
        return res
      }

      if (res && typeof (res as any).json === 'function') {
         return await (res as any).json()
      }
      return res
    },
    enabled: !!runId,
    refetchInterval: 1000
  })

  // Approve
  const { mutate: approve } = useMutation({
    mutationFn: async () => {
      if (!runId) return
      await client.acp.approve.$post({ id: runId })
    }
  })

  const isProcessing = statusData?.run?.status === 'starting' || statusData?.run?.status === 'working'
  const isFinished = statusData?.run?.status === 'finished'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]" style={{ fontFamily: 'Space Mono, monospace' }}>
        {/* Left/Center: Input & Chat */}
        <div className="lg:col-span-2 flex flex-col border-2 border-green-500/30 p-6 rounded-xl bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden animate-[border-glow_3s_ease-in-out_infinite]">
            {/* Background Grid Effect */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .2) 25%, rgba(34, 197, 94, .2) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .2) 75%, rgba(34, 197, 94, .2) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .2) 25%, rgba(34, 197, 94, .2) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .2) 75%, rgba(34, 197, 94, .2) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px'
              }}
            />
            
            <div className="flex-1 overflow-y-auto mb-6 space-y-4 relative z-10">
                <div className="flex items-center gap-3 text-green-400/70 sacred-glow">
                  <Zap size={20} className="animate-pulse" />
                  <span className="text-sm tracking-wider">{">>"} SYSTEM READY. WAITING FOR WILL...</span>
                </div>
                
                {statusData?.run?.intent && (
                    <div className="bg-green-500/5 border border-green-500/30 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <Activity size={16} />
                          <span className="text-xs tracking-widest opacity-70">INTENT CAPTURED</span>
                        </div>
                        <div className="text-green-300 pl-6 font-bold">
                            {`"${statusData.run.intent}"`}
                        </div>
                    </div>
                )}

                {isProcessing && (
                  <div className="flex items-center gap-4 text-yellow-400 animate-pulse">
                    <SacredLoader size={30} />
                    <span className="text-sm sacred-glow">Processing Intent...</span>
                  </div>
                )}

                {isFinished && (
                  <div className="flex items-center gap-3 text-green-400 animate-[float-up_1s_ease-out]">
                    <CheckCircle size={20} />
                    <span className="text-sm sacred-glow">Sequence Complete</span>
                  </div>
                )}
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (!input.trim()) return
                injectWill(input)
                setInput("")
              }} 
              className="flex gap-3 items-center relative z-10 p-4 bg-black/50 border border-green-500/30 rounded-lg backdrop-blur-sm"
            >
                <span className="text-2xl text-cyan-400 animate-pulse sacred-glow">{"▶"}</span>
                <input 
                    className="flex-1 bg-transparent border-b-2 border-green-500/50 focus:border-cyan-400 focus:outline-none text-green-300 py-2 px-2 placeholder-green-700/50 transition-all duration-300 sacred-glow"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoFocus
                    placeholder="Inject Will..."
                    style={{ fontSize: '1rem' }}
                />
            </form>
        </div>

        {/* Right: ACP Stream */}
        <div className="border-2 border-green-500/30 p-6 rounded-xl bg-gradient-to-br from-black via-gray-900 to-black flex flex-col relative overflow-hidden">
            {/* Header with Rune Status */}
            <div className="flex flex-col gap-3 border-b-2 border-green-500/30 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-cyan-400 animate-pulse" />
                  <span className="font-bold tracking-widest text-sm" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    ACP STREAM
                  </span>
                </div>
                {statusData?.run?.status && (
                  <RuneStatus status={statusData.run.status} />
                )}
            </div>
            
            {/* Logs */}
            <div className="flex-1 overflow-y-auto text-xs space-y-2 mb-4">
                {statusData?.logs?.map((log: any, i: number) => (
                    <div 
                      key={i} 
                      className="flex flex-col gap-1 p-2 bg-green-500/5 border-l-2 border-green-500/50 rounded"
                    >
                        <span className="text-green-700/70 text-[10px] tracking-wider">
                          [{new Date(log.timestamp).toLocaleTimeString()}]
                        </span>
                        <span className={`${log.type === 'ERROR' ? 'text-red-400' : log.type === 'ACTION' ? 'text-cyan-400' : 'text-green-300'} leading-relaxed`}>
                          {log.message}
                        </span>
                    </div>
                ))}
                {!statusData && (
                  <div className="flex flex-col items-center justify-center h-full gap-4 opacity-30">
                    <SacredLoader size={50} className="text-green-700" />
                    <div className="text-green-700 italic text-center">Standby...</div>
                  </div>
                )}
            </div>

            {/* Approve Button */}
            {statusData?.run?.status === 'awaiting_approval' && (
                <button 
                    onClick={() => approve()}
                    className="relative w-full py-4 bg-gradient-to-r from-green-600/20 to-cyan-600/20 hover:from-green-500/40 hover:to-cyan-500/40 text-green-100 rounded-lg border-2 border-green-500/50 hover:border-cyan-400 transition-all duration-300 font-bold tracking-widest sacred-border overflow-hidden group"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <span className="text-2xl">◈</span>
                      [APPROVE ACTION]
                      <span className="text-2xl">◈</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
            )}
        </div>
    </div>
  )
}

