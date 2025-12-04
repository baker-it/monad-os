import { MonadTerminal } from "@/components/monad-terminal"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-green-500 flex flex-col font-mono">
      <header className="p-4 border-b border-green-900 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-widest">MONAD_OS v1.0</h1>
        <div className="flex gap-4 text-xs opacity-70">
            <span>[STATE: AWAKE]</span>
            <span>[RESONANCE: 3-167-3]</span>
        </div>
      </header>
      
      <div className="flex-1 p-4">
        <MonadTerminal />
      </div>
    </main>
  )
}
