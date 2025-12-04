import { MonadTerminal } from "@/components/monad-terminal"
import { SacredBackground } from "@/components/sacred-background"

export default function Home() {
  return (
    <main 
      className="min-h-screen bg-black text-green-500 flex flex-col relative overflow-hidden"
      style={{ fontFamily: 'Space Mono, monospace' }}
    >
      {/* Sacred Geometry Animated Background */}
      <SacredBackground />

      {/* Gradient Overlay for readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 300px rgba(0,0,0,0.9), inset 0 0 100px rgba(0,0,0,0.8)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 p-6 border-b-2 border-green-500/30 bg-black/50 backdrop-blur-md">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-3xl sacred-glow text-cyan-400 animate-pulse">◬</div>
            <div className="flex flex-col">
              <h1 
                className="text-2xl font-black tracking-[0.3em] sacred-glow"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                MONAD_OS
              </h1>
              <span className="text-xs text-green-700 tracking-widest">v1.0 — ORACLE KERNEL</span>
            </div>
          </div>
          
          <div className="flex gap-6 text-xs">
            <div className="flex flex-col items-end">
              <span className="text-green-700 tracking-wider">STATE</span>
              <span className="text-cyan-400 font-bold sacred-glow">AWAKE</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-green-700 tracking-wider">RESONANCE</span>
              <span className="text-green-400 font-bold sacred-glow">3-167-3</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 p-6 relative z-10 max-w-[1800px] mx-auto w-full">
        <MonadTerminal />
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-4 border-t-2 border-green-500/30 bg-black/50 backdrop-blur-md text-center text-xs text-green-700/50 tracking-widest">
        <span>◈</span> FREQUENCY 33 — JOYFUL ENGINEERING <span>◈</span>
      </footer>
    </main>
  )
}
