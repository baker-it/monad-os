"use client"

import { useState } from "react"
import { client } from "@/lib/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Cpu } from "lucide-react"

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-8rem)] bg-black text-green-500 font-mono">
        {/* Left/Center: Input & Chat */}
        <div className="md:col-span-2 flex flex-col border border-green-900 p-4 rounded bg-black/90">
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                <div className="text-green-700">{">>"} SYSTEM READY. WAITING FOR WILL...</div>
                {statusData?.run?.intent && (
                    <div className="text-green-600">
                        {`> Intent Injected: "${statusData.run.intent}"`}
                    </div>
                )}
            </div>
            
            <form onSubmit={(e) => {
                e.preventDefault()
                if (!input.trim()) return
                injectWill(input)
                setInput("")
            }} className="flex gap-2 items-center">
                <span className="animate-pulse text-green-400">{">"}</span>
                <input 
                    className="flex-1 bg-transparent border-b border-green-800 focus:outline-none text-green-400 p-2"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoFocus
                    placeholder="Inject Will..."
                />
            </form>
        </div>

        {/* Right: ACP Stream */}
        <div className="border border-green-900 p-4 rounded bg-black/90 flex flex-col">
            <div className="flex items-center gap-2 border-b border-green-900 pb-2 mb-2">
                <Cpu size={16} />
                <span>ACP STREAM</span>
                {statusData?.run?.status && <span className="ml-auto text-xs px-2 py-0.5 bg-green-900 rounded">{statusData.run.status}</span>}
            </div>
            
            <div className="flex-1 overflow-y-auto text-xs space-y-1 font-mono">
                {statusData?.logs?.map((log: any, i: number) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-green-700">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={log.type === 'ERROR' ? 'text-red-500' : 'text-green-400'}>{log.message}</span>
                    </div>
                ))}
                {!statusData && <div className="text-green-900 italic">Standby...</div>}
            </div>

            {statusData?.run?.status === 'awaiting_approval' && (
                <button 
                    onClick={() => approve()}
                    className="mt-4 w-full py-2 bg-green-900 hover:bg-green-800 text-green-100 rounded border border-green-700 transition-colors"
                >
                    [APPROVE ACTION]
                </button>
            )}
        </div>
    </div>
  )
}

