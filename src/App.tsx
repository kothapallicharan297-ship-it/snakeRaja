/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center font-sans selection:bg-fuchsia-500/30 relative overflow-hidden text-slate-100">
      
      {/* Immersive Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#39ff14 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#020205_80%)] pointer-events-none" />

      <div className="z-10 w-full max-w-6xl flex flex-col items-center pt-8 pb-12 px-4">
        
        {/* Title Header */}
        <div className="flex items-center gap-4 mb-10 md:mb-16">
          <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(192,38,211,0.5)]">
            <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-indigo-400">
            SYNTH•SERPENT
          </h1>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center w-full">
          {/* Game Panel */}
          <div className="flex-shrink-0 animate-[fade-in_0.5s_ease-out]">
            <SnakeGame />
          </div>
          
          {/* Audio Panel */}
          <div className="w-full max-w-[350px] lg:my-auto animate-[fade-in_0.7s_ease-out]">
            <MusicPlayer />
          </div>
        </div>

      </div>
    </div>
  );
}
