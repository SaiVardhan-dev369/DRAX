import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-cyan-50 font-mono flex flex-col items-center justify-start py-8 px-4 sm:px-8 selection:bg-fuchsia-500/30">
      <header className="mb-8 md:mb-12 text-center flex flex-col items-center">
        <div className="inline-block relative">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] relative z-10 p-2">
            NEON_SNAKETUNES
          </h1>
          <div className="absolute inset-0 bg-cyan-400/20 blur-2xl z-0 rounded-full mix-blend-screen"></div>
        </div>
        <p className="text-cyan-400/80 mt-1 md:mt-2 text-xs md:text-sm uppercase tracking-[0.3em] font-medium border-y border-cyan-500/30 py-2 inline-block">
          Synthetic Beats &middot; Grid Operations
        </p>
      </header>

      <main className="w-full max-w-6xl flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start justify-center">
        {/* Left column: Music Player */}
        <div className="w-full max-w-md lg:w-1/3 lg:max-w-sm flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <div className="sticky top-8">
            <h3 className="text-fuchsia-500/80 uppercase tracking-widest text-xs font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
              Audio Interface
            </h3>
            <MusicPlayer />
            
            <div className="mt-8 p-4 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm text-xs text-gray-400 leading-relaxed font-sans">
              <p>
                <strong>Controls:</strong> Use <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-cyan-400">WASD</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-cyan-400">Arrow Keys</kbd> to navigate the grid.
              </p>
              <p className="mt-2">
                Press <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-cyan-400">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-cyan-400">Enter</kbd> to begin.
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Game */}
        <div className="w-full max-w-md lg:w-2/3 lg:max-w-2xl flex justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out delay-150 fill-mode-both">
          <SnakeGame />
        </div>
      </main>
    </div>
  );
}
