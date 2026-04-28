import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, Disc3 } from 'lucide-react';

const TRACKS = [
  { 
    id: 1, 
    title: 'Neon Drive [AI Synth]', 
    artist: 'CyberSystem 01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
  },
  { 
    id: 2, 
    title: 'Cybernetic Pulse [AI Beat]', 
    artist: 'Neural Network 08',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' 
  },
  { 
    id: 3, 
    title: 'Synthwave Grid [AI Ambient]', 
    artist: 'DeepMind FM',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' 
  }
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4); // Start moderate
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Sync volume to audio element
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Autoplay blocked or audio failed to play", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  };
  
  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const currentInfo = TRACKS[currentTrack];

  return (
    <div className="flex flex-col w-full max-w-[350px] bg-[#05050a]/80 backdrop-blur-md p-6 border border-fuchsia-500/10 rounded-xl shadow-2xl">
      
      {/* Header element */}
      <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center justify-between">
        Now Playing
        <Music className="w-3.5 h-3.5 text-fuchsia-500/50" />
      </h3>

      {/* Record Animation Display -> Cover Art */}
      <div className="group relative aspect-video sm:aspect-square w-full bg-gradient-to-tr from-indigo-900 to-fuchsia-900 rounded-xl overflow-hidden shadow-base mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
        
        {/* Visualizer bars if playing */}
        {isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-50">
             <div className="w-2.5 h-12 bg-fuchsia-500 animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_15px_rgba(217,70,239,0.6)]"></div>
             <div className="w-2.5 h-20 bg-indigo-500 animate-[pulse_1.3s_ease-in-out_infinite_reverse] shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
             <div className="w-2.5 h-16 bg-lime-400 animate-[pulse_1.1s_ease-in-out_infinite] shadow-[0_0_15px_rgba(163,230,53,0.6)]"></div>
             <div className="w-2.5 h-10 bg-fuchsia-500 animate-[pulse_0.8s_ease-in-out_infinite_reverse] shadow-[0_0_15px_rgba(217,70,239,0.6)]"></div>
             <div className="w-2.5 h-14 bg-indigo-400 animate-[pulse_1.2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(129,140,248,0.6)]"></div>
          </div>
        ) : (
          <Disc3 className="w-16 h-16 text-white/20 animate-pulse" strokeWidth={1} />
        )}

        <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
          <p className="text-lg font-bold leading-tight uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{currentInfo.title}</p>
          <p className="text-[10px] text-fuchsia-300 font-medium tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{currentInfo.artist}</p>
        </div>
        
        {isPlaying && (
          <div className="absolute top-4 right-4 flex gap-1 z-10">
             <div className="w-1 h-3 bg-lime-400 animate-[pulse_0.75s_infinite]"></div>
             <div className="w-1 h-5 bg-lime-400 animate-[pulse_1s_infinite]"></div>
             <div className="w-1 h-4 bg-lime-400 animate-[pulse_0.8s_infinite]"></div>
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={currentInfo.url}
        onEnded={nextTrack}
        className="hidden"
      />

      {/* Controls */}
      <div className="flex items-center justify-between px-4 mb-6">
        <button 
          onClick={prevTrack} 
          className="text-slate-400 hover:text-white transition-colors"
        >
          <SkipBack className="w-5 h-5 fill-current" />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 ml-1 fill-current" />
          )}
        </button>
        <button 
          onClick={nextTrack} 
          className="text-slate-400 hover:text-white transition-colors"
        >
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
      </div>

      <div className="w-full h-px bg-slate-800 mb-6"></div>

      {/* Playlist List */}
      <div className="flex-1">
        <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Playlist</h3>
        <div className="space-y-2">
          {TRACKS.map((t, i) => {
            const isActive = i === currentTrack;
            return (
              <div 
                key={t.id}
                className={`flex items-center gap-3 p-3 transition-colors rounded-lg cursor-pointer border ${isActive ? 'bg-fuchsia-500/10 border-fuchsia-500/20' : 'hover:bg-white/5 border-transparent'}`}
                onClick={() => {
                  if (isActive) {
                    togglePlay();
                  } else {
                    setCurrentTrack(i);
                    setIsPlaying(true);
                  }
                }}
              >
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,1)]' : 'bg-slate-700'}`}></div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>{t.title}</p>
                  <p className="text-[10px] text-slate-500">{t.artist}</p>
                </div>
                {isActive && isPlaying && (
                  <div className="flex items-end gap-0.5 h-3 pr-1">
                     <div className="w-[3px] bg-lime-400 h-full animate-[pulse_0.75s_infinite]"></div>
                     <div className="w-[3px] bg-lime-400 h-1/2 animate-[pulse_1s_infinite]"></div>
                     <div className="w-[3px] bg-lime-400 h-3/4 animate-[pulse_0.8s_infinite]"></div>
                  </div>
               )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
